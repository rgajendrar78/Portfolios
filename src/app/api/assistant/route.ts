import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { portfolio } from "@/config/portfolio";
import { buildAssistantSystemInstruction } from "@/lib/assistant/context";
import { buildPortfolioFallbackReply } from "@/lib/assistant/fallback";
import { consumeAssistantRateLimit, getDailyQuotaSnapshot } from "@/lib/assistant/rate-limit";
import { checkPortfolioScope, OFF_TOPIC_REDIRECT } from "@/lib/assistant/scope-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const FALLBACK_FLASH_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-flash-lite-latest",
  "gemini-3-flash-preview",
];
const MAX_BODY_BYTES = 32_768;
const MAX_HISTORY_MESSAGES = 6;
const MAX_USER_MESSAGE_CHARS = 350;
const MAX_HISTORY_CHARS = 2_400;
const REQUEST_TIMEOUT_MS = 15_000;
const SINGLE_TURN_CACHE_TTL_MS = 2 * 60 * 1000;
const MAX_CACHE_ENTRIES = 40;

const singleTurnCache = new Map<string, { reply: string; expiresAt: number }>();

function getSingleTurnCacheKey(messages: ClientMessage[]): string | null {
  if (messages.length !== 1 || messages[0]?.role !== "user") return null;
  return messages[0].content.toLowerCase().replace(/\s+/g, " ").trim();
}

function getCachedReply(key: string): string | null {
  const hit = singleTurnCache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    singleTurnCache.delete(key);
    return null;
  }
  return hit.reply;
}

function setCachedReply(key: string, reply: string) {
  if (singleTurnCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = singleTurnCache.keys().next().value;
    if (oldestKey) singleTurnCache.delete(oldestKey);
  }
  singleTurnCache.set(key, { reply, expiresAt: Date.now() + SINGLE_TURN_CACHE_TTL_MS });
}

interface ClientMessage {
  role: "user" | "assistant";
  content: string;
}

function getSecurityHeaders(extra?: Record<string, string>): HeadersInit {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    ...extra,
  };
}

function stripControlChars(input: string): string {
  return input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

function getClientIp(request: NextRequest): string {
  const netlifyIp = request.headers.get("x-nf-client-connection-ip");
  if (netlifyIp) return netlifyIp.trim();

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return request.headers.get("x-real-ip")?.trim() || "127.0.0.1";
}

function isAllowedOrigin(request: NextRequest): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite === "cross-site") {
    return false;
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  let parsedOrigin: URL;
  try {
    parsedOrigin = new URL(origin);
  } catch {
    return false;
  }

  const allowedOrigins = new Set<string>();
  allowedOrigins.add(request.nextUrl.origin);

  const host = request.headers.get("host");
  if (host) {
    const proto = request.headers.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
    allowedOrigins.add(`${proto}://${host}`);
  }

  for (const candidate of [portfolio.site.url, process.env.URL, process.env.DEPLOY_PRIME_URL]) {
    if (!candidate) continue;
    try {
      allowedOrigins.add(new URL(candidate).origin);
    } catch {
      // Ignore malformed optional env URLs.
    }
  }

  if (allowedOrigins.has(parsedOrigin.origin)) return true;

  if (
    process.env.NODE_ENV !== "production" &&
    (parsedOrigin.hostname === "localhost" || parsedOrigin.hostname === "127.0.0.1")
  ) {
    return true;
  }

  return false;
}

function validateMessages(raw: unknown): { ok: true; messages: ClientMessage[] } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object" || !("messages" in raw)) {
    return { ok: false, error: "Request body must include a messages array." };
  }

  const { messages } = raw as { messages: unknown };
  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: false, error: "At least one message is required." };
  }

  if (messages.length > MAX_HISTORY_MESSAGES) {
    return { ok: false, error: `Conversation history is capped at ${MAX_HISTORY_MESSAGES} messages.` };
  }

  const normalized: ClientMessage[] = [];
  for (let i = 0; i < messages.length; i += 1) {
    const item = messages[i];
    if (!item || typeof item !== "object") {
      return { ok: false, error: "Each message must be an object." };
    }

    const { role, content } = item as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") {
      return { ok: false, error: "Message role must be 'user' or 'assistant'." };
    }
    if (typeof content !== "string") {
      return { ok: false, error: "Message content must be a string." };
    }

    const cleaned = stripControlChars(content);
    if (!cleaned) {
      return { ok: false, error: "Message content cannot be empty." };
    }

    const isLast = i === messages.length - 1;
    if (isLast && cleaned.length > MAX_USER_MESSAGE_CHARS) {
      return { ok: false, error: `Message exceeds the ${MAX_USER_MESSAGE_CHARS}-character limit.` };
    }

    normalized.push({
      role,
      content: isLast ? cleaned : cleaned.slice(0, MAX_HISTORY_CHARS),
    });
  }

  if (normalized[normalized.length - 1]?.role !== "user") {
    return { ok: false, error: "The final message must come from the user." };
  }

  return { ok: true, messages: normalized };
}

const GENERIC_POSITIVE_MESSAGE = `I'll be back shortly! Meanwhile, feel free to connect with Gajendra directly at ${portfolio.person.email}.`;

export async function GET() {
  const quota = getDailyQuotaSnapshot();
  const configured = Boolean(process.env.GEMINI_API_KEY?.trim());

  return NextResponse.json(
    {
      available: configured && quota.dailyRemaining > 0,
      resetAt: quota.resetAtIso,
    },
    { status: 200, headers: getSecurityHeaders() },
  );
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json(
      { error: "Cross-origin requests are not permitted." },
      { status: 403, headers: getSecurityHeaders() },
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json." },
      { status: 415, headers: getSecurityHeaders() },
    );
  }

  const contentLength = Number.parseInt(request.headers.get("content-length") ?? "0", 10);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Payload too large." },
      { status: 413, headers: getSecurityHeaders() },
    );
  }

  let rawBodyText: string;
  try {
    rawBodyText = await request.text();
  } catch {
    return NextResponse.json(
      { error: "Unable to read request body." },
      { status: 400, headers: getSecurityHeaders() },
    );
  }

  if (Buffer.byteLength(rawBodyText, "utf8") > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Payload too large." },
      { status: 413, headers: getSecurityHeaders() },
    );
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBodyText);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400, headers: getSecurityHeaders() },
    );
  }

  const validated = validateMessages(parsedBody);
  if (!validated.ok) {
    return NextResponse.json(
      { error: validated.error },
      { status: 400, headers: getSecurityHeaders() },
    );
  }

  // Zero-token server gate: respond naturally to greetings and block off-topic requests.
  const scopeCheck = checkPortfolioScope(validated.messages);
  if (!scopeCheck.allowed) {
    return NextResponse.json(
      {
        reply: scopeCheck.instantReply ?? OFF_TOPIC_REDIRECT,
        scoped: true,
      },
      { status: 200, headers: getSecurityHeaders() },
    );
  }

  const lastUserContent = validated.messages[validated.messages.length - 1]?.content ?? "";
  const cacheKey = getSingleTurnCacheKey(validated.messages);
  if (cacheKey) {
    const cachedReply = getCachedReply(cacheKey);
    if (cachedReply) {
      return NextResponse.json(
        {
          reply: cachedReply,
          cached: true,
        },
        { status: 200, headers: getSecurityHeaders() },
      );
    }
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        error: GENERIC_POSITIVE_MESSAGE,
      },
      { status: 503, headers: getSecurityHeaders() },
    );
  }

  const clientIp = getClientIp(request);
  const limit = await consumeAssistantRateLimit(clientIp);
  const rateHeaders = {
    "X-RateLimit-Daily-Limit": String(limit.dailyLimit),
    "X-RateLimit-Daily-Remaining": String(limit.dailyRemaining),
    "X-RateLimit-Reset": limit.resetAtIso,
  };

  if (!limit.allowed) {
    const fallbackReply = buildPortfolioFallbackReply(lastUserContent);

    if (limit.reason === "ip_daily" || limit.reason === "global_daily") {
      return NextResponse.json(
        {
          reply: fallbackReply,
          fallback: true,
          quotaReached: true,
        },
        { status: 200, headers: getSecurityHeaders(rateHeaders) },
      );
    }

    return NextResponse.json(
      {
        error: `One moment please — cooling down for ${Math.min(limit.retryAfterSeconds, 60)}s before the next question.`,
        reason: limit.reason,
        retryAfter: limit.retryAfterSeconds,
        fallbackReply,
      },
      {
        status: 429,
        headers: getSecurityHeaders({
          ...rateHeaders,
          "Retry-After": String(limit.retryAfterSeconds),
        }),
      },
    );
  }

  const primaryModel = (process.env.GEMINI_MODEL || DEFAULT_MODEL).trim();
  const modelCandidates = Array.from(new Set([primaryModel, ...FALLBACK_FLASH_MODELS]));
  const ai = new GoogleGenAI({ apiKey });

  // Normalize conversation so Gemini always receives valid alternating user -> model -> user turns.
  const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];
  for (const msg of validated.messages) {
    const role = msg.role === "assistant" ? ("model" as const) : ("user" as const);
    if (contents.length === 0 && role === "model") continue;
    const prev = contents[contents.length - 1];
    if (prev && prev.role === role) {
      prev.parts[0].text = `${prev.parts[0].text}\n${msg.content}`;
    } else {
      contents.push({ role, parts: [{ text: msg.content }] });
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    let reply: string | undefined;
    let lastError: unknown;

    for (const candidateModel of modelCandidates) {
      try {
        const response = await ai.models.generateContent({
          model: candidateModel,
          contents,
          config: {
            systemInstruction: buildAssistantSystemInstruction(),
            temperature: 0.3,
            maxOutputTokens: 600,
            abortSignal: controller.signal,
          },
        });
        const candidateText = response.text?.trim();
        if (candidateText) {
          reply = candidateText;
          break;
        }
        console.error("[assistant] empty text from model:", candidateModel, response.candidates?.[0]?.finishReason);
      } catch (err) {
        lastError = err;
        const status =
          typeof err === "object" && err !== null && "status" in err ? (err as { status?: number }).status : undefined;
        console.error("[assistant] model attempt failed:", candidateModel, status ?? "unknown");
        // Stop immediately on non-quota 4xx client/auth errors; try next Flash model on 404, 429, or 5xx.
        if (status && status !== 404 && status !== 429 && status < 500) {
          throw err;
        }
      }
    }

    if (!reply) {
      if (lastError) throw lastError;
      return NextResponse.json(
        {
          error: GENERIC_POSITIVE_MESSAGE,
        },
        { status: 502, headers: getSecurityHeaders(rateHeaders) },
      );
    }

    if (cacheKey) {
      setCachedReply(cacheKey, reply);
    }

    return NextResponse.json(
      {
        reply,
      },
      { status: 200, headers: getSecurityHeaders(rateHeaders) },
    );
  } catch (err) {
    const status =
      typeof err === "object" && err !== null && "status" in err ? (err as { status?: number }).status : undefined;
    console.error("[assistant] request failed:", status ?? "unknown", err instanceof Error ? err.message : "");
    if (status === 429) {
      return NextResponse.json(
        {
          reply: buildPortfolioFallbackReply(lastUserContent),
          fallback: true,
        },
        { status: 200, headers: getSecurityHeaders(rateHeaders) },
      );
    }

    return NextResponse.json(
      { error: GENERIC_POSITIVE_MESSAGE },
      { status: 502, headers: getSecurityHeaders(rateHeaders) },
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
