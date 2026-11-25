import { createHash } from "node:crypto";

export interface RateLimitConfig {
  dailyLimit: number;
  ipDailyLimit: number;
  ipRpmLimit: number;
}

export interface RateLimitResult {
  allowed: boolean;
  reason?: "global_daily" | "ip_daily" | "ip_rpm";
  retryAfterSeconds: number;
  dailyLimit: number;
  dailyRemaining: number;
  resetAtIso: string;
}

interface DayBucket {
  dayKey: string;
  globalCount: number;
  ipDailyCounts: Map<string, number>;
  ipMinuteHits: Map<string, number[]>;
}

const DEFAULT_DAILY_LIMIT = 500;
const DEFAULT_IP_DAILY_LIMIT = 30;
const DEFAULT_IP_RPM_LIMIT = 12;

function parsePositiveInt(value: string | undefined, fallback: number, min: number, max: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

export function getRateLimitConfig(): RateLimitConfig {
  const dailyLimit = parsePositiveInt(process.env.ASSISTANT_DAILY_LIMIT, DEFAULT_DAILY_LIMIT, 1, 5000);
  const ipDailyLimit = parsePositiveInt(process.env.ASSISTANT_IP_DAILY_LIMIT, DEFAULT_IP_DAILY_LIMIT, 1, 500);
  const ipRpmLimit = parsePositiveInt(process.env.ASSISTANT_IP_RPM_LIMIT, DEFAULT_IP_RPM_LIMIT, 1, 120);
  const isDev = process.env.NODE_ENV === "development";

  return {
    dailyLimit,
    ipDailyLimit: isDev ? Math.max(ipDailyLimit, 250) : ipDailyLimit,
    ipRpmLimit: isDev ? Math.max(ipRpmLimit, 30) : ipRpmLimit,
  };
}

function getUtcDayInfo(now = Date.now()) {
  const date = new Date(now);
  const dayKey = date.toISOString().slice(0, 10);
  const nextMidnight = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, 0, 0, 0);
  const secondsUntilReset = Math.max(1, Math.ceil((nextMidnight - now) / 1000));
  return {
    dayKey,
    secondsUntilReset,
    resetAtIso: new Date(nextMidnight).toISOString(),
  };
}

const globalState = globalThis as typeof globalThis & {
  __portfolioAssistantBucket?: DayBucket;
};

function getBucket(dayKey: string): DayBucket {
  if (!globalState.__portfolioAssistantBucket || globalState.__portfolioAssistantBucket.dayKey !== dayKey) {
    globalState.__portfolioAssistantBucket = {
      dayKey,
      globalCount: 0,
      ipDailyCounts: new Map(),
      ipMinuteHits: new Map(),
    };
  }
  return globalState.__portfolioAssistantBucket;
}

/** Hash IP with a process-local salt so raw visitor IPs are not retained in memory or logs. */
const PROCESS_SALT = createHash("sha256")
  .update(`${process.pid}-${Date.now()}-${Math.random()}`)
  .digest("hex");

export function hashClientIp(rawIp: string): string {
  return createHash("sha256").update(`${PROCESS_SALT}:${rawIp}`).digest("hex").slice(0, 24);
}

async function upstashCommand(args: (string | number)[]): Promise<number | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { result?: unknown };
    return typeof data.result === "number" ? data.result : Number(data.result ?? 0);
  } catch {
    return null;
  }
}

async function upstashPipeline(commands: (string | number)[][]): Promise<(number | null)[] | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commands),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const rows = (await response.json()) as Array<{ result?: unknown }>;
    return rows.map((row) =>
      typeof row?.result === "number" ? row.result : row?.result != null ? Number(row.result) : null,
    );
  } catch {
    return null;
  }
}

/**
 * Checks and increments rate limits:
 * - Global daily limit (default 500/day matching Google AI Studio Flash-Lite free quota)
 * - Per-IP daily limit (default 30/day)
 * - Per-IP per-minute burst limit (default 12/min)
 */
export async function consumeAssistantRateLimit(rawIp: string): Promise<RateLimitResult> {
  const config = getRateLimitConfig();
  const now = Date.now();
  const { dayKey, secondsUntilReset, resetAtIso } = getUtcDayInfo(now);
  const ipHash = hashClientIp(rawIp);

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const minuteBucket = Math.floor(now / 60_000);
    const rpmKey = `assistant:rpm:${ipHash}:${minuteBucket}`;
    const ipDayKey = `assistant:ipday:${dayKey}:${ipHash}`;
    const globalDayKey = `assistant:global:${dayKey}`;

    const results = await upstashPipeline([
      ["INCR", rpmKey],
      ["EXPIRE", rpmKey, 65],
      ["INCR", ipDayKey],
      ["EXPIRE", ipDayKey, secondsUntilReset + 60],
      ["INCR", globalDayKey],
      ["EXPIRE", globalDayKey, secondsUntilReset + 60],
    ]);

    if (results && results.length >= 5) {
      const rpmCount = results[0] ?? 1;
      const ipDayCount = results[2] ?? 1;
      const globalCount = results[4] ?? 1;

      if (globalCount > config.dailyLimit) {
        return {
          allowed: false,
          reason: "global_daily",
          retryAfterSeconds: secondsUntilReset,
          dailyLimit: config.dailyLimit,
          dailyRemaining: 0,
          resetAtIso,
        };
      }
      if (ipDayCount > config.ipDailyLimit) {
        await upstashCommand(["DECR", globalDayKey]);
        return {
          allowed: false,
          reason: "ip_daily",
          retryAfterSeconds: secondsUntilReset,
          dailyLimit: config.dailyLimit,
          dailyRemaining: Math.max(0, config.dailyLimit - (globalCount - 1)),
          resetAtIso,
        };
      }
      if (rpmCount > config.ipRpmLimit) {
        await upstashPipeline([
          ["DECR", ipDayKey],
          ["DECR", globalDayKey],
        ]);
        return {
          allowed: false,
          reason: "ip_rpm",
          retryAfterSeconds: 60,
          dailyLimit: config.dailyLimit,
          dailyRemaining: Math.max(0, config.dailyLimit - (globalCount - 1)),
          resetAtIso,
        };
      }

      return {
        allowed: true,
        retryAfterSeconds: 0,
        dailyLimit: config.dailyLimit,
        dailyRemaining: Math.max(0, config.dailyLimit - globalCount),
        resetAtIso,
      };
    }
  }

  const bucket = getBucket(dayKey);
  const windowStart = now - 60_000;
  const recentHits = (bucket.ipMinuteHits.get(ipHash) ?? []).filter((ts) => ts > windowStart);

  if (bucket.ipMinuteHits.size > 1000) {
    for (const [key, timestamps] of bucket.ipMinuteHits.entries()) {
      const active = timestamps.filter((ts) => ts > windowStart);
      if (active.length === 0) bucket.ipMinuteHits.delete(key);
      else bucket.ipMinuteHits.set(key, active);
    }
  }

  if (bucket.globalCount >= config.dailyLimit) {
    return {
      allowed: false,
      reason: "global_daily",
      retryAfterSeconds: secondsUntilReset,
      dailyLimit: config.dailyLimit,
      dailyRemaining: 0,
      resetAtIso,
    };
  }

  const ipDayCount = bucket.ipDailyCounts.get(ipHash) ?? 0;
  if (ipDayCount >= config.ipDailyLimit) {
    return {
      allowed: false,
      reason: "ip_daily",
      retryAfterSeconds: secondsUntilReset,
      dailyLimit: config.dailyLimit,
      dailyRemaining: Math.max(0, config.dailyLimit - bucket.globalCount),
      resetAtIso,
    };
  }

  if (recentHits.length >= config.ipRpmLimit) {
    const oldest = recentHits[0] ?? now;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + 60_000 - now) / 1000));
    return {
      allowed: false,
      reason: "ip_rpm",
      retryAfterSeconds,
      dailyLimit: config.dailyLimit,
      dailyRemaining: Math.max(0, config.dailyLimit - bucket.globalCount),
      resetAtIso,
    };
  }

  recentHits.push(now);
  bucket.ipMinuteHits.set(ipHash, recentHits);
  bucket.ipDailyCounts.set(ipHash, ipDayCount + 1);
  bucket.globalCount += 1;

  return {
    allowed: true,
    retryAfterSeconds: 0,
    dailyLimit: config.dailyLimit,
    dailyRemaining: Math.max(0, config.dailyLimit - bucket.globalCount),
    resetAtIso,
  };
}

/** Read-only snapshot of today's global quota (does not increment counters). */
export function getDailyQuotaSnapshot(): { dailyLimit: number; dailyRemaining: number; resetAtIso: string } {
  const config = getRateLimitConfig();
  const { dayKey, resetAtIso } = getUtcDayInfo();
  const bucket = getBucket(dayKey);
  return {
    dailyLimit: config.dailyLimit,
    dailyRemaining: Math.max(0, config.dailyLimit - bucket.globalCount),
    resetAtIso,
  };
}
