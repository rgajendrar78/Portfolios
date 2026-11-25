"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { portfolio } from "@/config/portfolio";
import { experienceYears } from "@/lib/derive";
import { AvatarCanvas, type AvatarMood } from "./avatar-canvas";
import { MessageText } from "./message-text";

type WidgetPhase = "entering" | "intro" | "docking" | "minimized" | "opening" | "open" | "closing";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

const INTRO_DURATION_MS = 6200;
const DOCK_TRANSITION_MS = 820;
const CHAT_CLOSE_TRANSITION_MS = 280;

const FIRST_NAME = portfolio.person.name.split(" ")[0];
const YEARS = experienceYears();
const INTRO_MESSAGES = [
  `Hi! I'm ${FIRST_NAME} AI Assistant — ask about ${FIRST_NAME}'s skills, architecture & work.`,
  `Meet ${FIRST_NAME} AI Assistant — explore his NestJS, gRPC, AWS & Applied AI systems.`,
  `Hey! Ask ${FIRST_NAME} AI Assistant about FieldTracking360, payments, or open roles.`,
  `${FIRST_NAME} AI Assistant here — get a quick overview of ${FIRST_NAME}'s ${YEARS} yrs engineering impact.`,
];
const INTRO_HIGHLIGHTS = [
  { text: "NestJS & React", dotClass: "bg-accent" },
  { text: "10+ AWS & AI", dotClass: "bg-sky" },
  { text: `${YEARS} yrs exp`, dotClass: "bg-ok" },
];
const GENERIC_FALLBACK_REPLY = `I'll be back shortly! Meanwhile, feel free to connect with ${FIRST_NAME} directly at mailto:${portfolio.person.email}.`;

const DOCK_HINTS = [
  `Hiring? Ask about ${FIRST_NAME}'s roles`,
  "Have a project? Let's build",
  "Full-Stack, AWS & AI overview",
  "NestJS, gRPC & React stack",
];

const THINKING_PHRASES = [
  "Thinking…",
  "Pondering…",
  "Brewing an answer…",
  `Scanning ${FIRST_NAME}'s work…`,
  "Connecting the dots…",
  "Reviewing architecture…",
  "Checking projects & stack…",
  "Synthesizing details…",
  "Reading experience notes…",
  "Weaving context…",
  "Distilling highlights…",
  "Refining response…",
  "Pulling verified links…",
  "Simmering thoughts…",
  "Aligning specifics…",
];

const STARTER_CARDS = [
  {
    title: "Quick Overview",
    subtitle: "Full-Stack, Backend, AWS, AI & links",
    prompt:
      "Give me a quick overview of Gajendra covering his 12+ projects, Backend & Full-Stack architecture, AWS cloud services, Applied AI work, and share his LinkedIn, GitHub, and resume links.",
    dotClass: "bg-accent",
    wide: true,
  },
  {
    title: "Experience & Roles",
    subtitle: `${YEARS} yrs · Devstree & Precious`,
    prompt: "Walk me through Gajendra's work experience, roles, and key engineering impact.",
    dotClass: "bg-ok",
    wide: false,
  },
  {
    title: "FieldTracking360",
    subtitle: "100+ screens & live GPS",
    prompt: "Tell me about FieldTracking360 and how Gajendra handled live GPS tracking.",
    dotClass: "bg-sky",
    wide: false,
  },
  {
    title: "gRPC & Redis",
    subtitle: "Microservices & 30% faster API",
    prompt: "Explain Gajendra's NestJS, gRPC, and Redis microservices architecture.",
    dotClass: "bg-accent",
    wide: false,
  },
  {
    title: "Applied AI & LLMs",
    subtitle: "Prompt Studio AI & Zod gates",
    prompt: "How does Gajendra build AI features like Prompt Studio AI with deterministic validation?",
    dotClass: "bg-violet",
    wide: false,
  },
  {
    title: "Payment Gateways",
    subtitle: "Razorpay, Cashfree & Stripe",
    prompt: "How has Gajendra integrated Razorpay, Cashfree, and Stripe payment flows and webhooks?",
    dotClass: "bg-ok",
    wide: false,
  },
  {
    title: "AWS & DevOps",
    subtitle: "10+ AWS services & Docker",
    prompt: "Which AWS services, Docker, Nginx, and CI/CD setups has Gajendra worked with?",
    dotClass: "bg-sky",
    wide: false,
  },
  {
    title: "Education & Certs",
    subtitle: "MCA · Google AI Certified",
    prompt: "What is Gajendra's education and certification background?",
    dotClass: "bg-violet",
    wide: false,
  },
  {
    title: "Hiring & Contact",
    subtitle: `${portfolio.person.status} · ${portfolio.person.workMode}`,
    prompt: "Is Gajendra open to new roles, relocation, or projects, and how can we reach him?",
    dotClass: "bg-accent",
    wide: false,
  },
];

const emptySubscribe = () => () => {};

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function getTimeGreeting() {
  if (typeof window === "undefined") return "Hello";
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function buildInitialGreeting() {
  return `${getTimeGreeting()}! I'm ${FIRST_NAME} AI Assistant. ${FIRST_NAME} has delivered 12+ projects across NestJS microservices, React/Next.js, AWS, and Applied AI. Pick a topic below or ask anything!`;
}

function getContextualFollowUps(
  lastUserPrompt: string,
  replyText: string,
  askedPrompts: string[],
): string[] {
  const combined = `${lastUserPrompt} ${replyText}`.toLowerCase();
  const askedLower = askedPrompts.map((p) => p.toLowerCase());
  const currentCompany = portfolio.experience.roles[0]?.short ?? portfolio.person.company;
  const previousCompany = portfolio.experience.roles[1]?.short ?? "his previous company";

  const topicCandidates: string[] = [];

  if (/\b(previous|prev\w*|precious|infosys|infosystem|before\s+devstree)\b/.test(combined)) {
    topicCandidates.push(
      `What does ${FIRST_NAME} build at ${currentCompany}?`,
      `Tell me about ${portfolio.work.projects[0]?.name ?? "FieldTracking360"}`,
    );
  } else if (/\b(devstree|current|present)\b/.test(combined) && /\b(company|com\w*y|role|work|experience)\b/.test(combined)) {
    topicCandidates.push(
      `What was ${FIRST_NAME}'s previous company?`,
      `Explain his NestJS, gRPC & Redis setup`,
    );
  } else if (/\b(fieldtracking|gps|fleet)\b/.test(combined)) {
    topicCandidates.push(
      "How did he scale MongoDB + PostgreSQL?",
      "Tell me about his Cashfree & Razorpay flows",
    );
  } else if (/\b(grpc|redis|microservice|double)\b/.test(combined)) {
    topicCandidates.push(
      `How did ${FIRST_NAME} prevent double bookings?`,
      `Which AWS services does ${FIRST_NAME} use?`,
    );
  } else if (/\b(ai|llm|zod|prompt\s*studio)\b/.test(combined)) {
    topicCandidates.push(
      "Walk me through Prompt Studio AI",
      `What backend & DevOps tools does ${FIRST_NAME} use?`,
    );
  } else if (/\b(payment|stripe|razorpay|cashfree|webhook)\b/.test(combined)) {
    topicCandidates.push(
      "How does he secure payment webhooks?",
      `Tell me about ${portfolio.work.projects[0]?.name ?? "FieldTracking360"}`,
    );
  } else if (/\b(aws|docker|nginx|devops|ec2|s3|lambda)\b/.test(combined)) {
    topicCandidates.push(
      "How did he cut API latency by 30%?",
      "Tell me about his Applied AI work",
    );
  } else if (/\b(mca|educat|cert|medi|google)\b/.test(combined)) {
    topicCandidates.push(
      `Walk me through ${FIRST_NAME}'s ${YEARS} yrs experience`,
      `Is ${FIRST_NAME} open to new roles?`,
    );
  } else if (/\b(hire|hiring|open|relocat|remote|contact|email)\b/.test(combined)) {
    topicCandidates.push(
      `Share ${FIRST_NAME}'s LinkedIn, GitHub & Resume`,
      `Walk me through ${FIRST_NAME}'s core projects`,
    );
  }

  const rotationPool = [
    `What was ${FIRST_NAME}'s previous company (${previousCompany})?`,
    `Explain ${FIRST_NAME}'s NestJS & gRPC architecture`,
    "Tell me about FieldTracking360 & live GPS",
    "How does he build Zod-validated AI apps?",
    "Which AWS & DevOps tools does he run?",
    "How did he integrate Razorpay, Cashfree & Stripe?",
    `Share ${FIRST_NAME}'s LinkedIn, GitHub & Resume`,
    `Is ${FIRST_NAME} open to new roles?`,
  ];

  const isAlreadyAsked = (candidate: string) => {
    const tokens = candidate
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length >= 4 && t !== FIRST_NAME.toLowerCase() && t !== "gajendra" && t !== "about" && t !== "tell");
    return askedLower.some((prev) => {
      if (prev === candidate.toLowerCase()) return true;
      const hits = tokens.filter((tok) => prev.includes(tok));
      return tokens.length >= 2 && hits.length >= Math.min(2, tokens.length);
    });
  };

  const unique: string[] = [];
  for (const item of [...topicCandidates, ...rotationPool]) {
    if (unique.length >= 2) break;
    if (!unique.includes(item) && !isAlreadyAsked(item)) {
      unique.push(item);
    }
  }

  return unique.length > 0 ? unique : rotationPool.slice(0, 2);
}

/**
 * 3D AI Assistant (`Gajendra's AI`):
 * - Greets visitors on first load with the waving 3D avatar and improved floating speech pill
 * - Glides smoothly into the bottom-right `Gajendra's AI` (`⌘K`) capsule
 * - Third-person assistant voice speaking about Gajendra with rich topic menus & toggleable menu drawer
 */
export function AssistantWidget() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const [phase, setPhase] = useState<WidgetPhase>(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return "minimized";
    }
    return "entering";
  });

  const [introIndex, setIntroIndex] = useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      const prev = Number.parseInt(sessionStorage.getItem("gajendra-intro-idx") ?? "-1", 10);
      return Number.isFinite(prev) ? (prev + 1) % INTRO_MESSAGES.length : 0;
    } catch {
      return 0;
    }
  });
  const [introTypedCount, setIntroTypedCount] = useState(0);
  const [dockHintIndex, setDockHintIndex] = useState(0);
  const [avatarHovered, setAvatarHovered] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const [showTopicMenu, setShowTopicMenu] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: "welcome", role: "assistant", content: buildInitialGreeting() },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const drawerRef = useRef<HTMLElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const topicMenuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [streamingMsg, setStreamingMsg] = useState<{ id: string; fullText: string; shownChars: number } | null>(null);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [thinkingSeconds, setThinkingSeconds] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const phraseTimer = setInterval(() => {
      setThinkingIndex((prev) => (prev + 1) % THINKING_PHRASES.length);
    }, 1050);
    const secondTimer = setInterval(() => {
      setThinkingSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      clearInterval(phraseTimer);
      clearInterval(secondTimer);
    };
  }, [isLoading]);

  const clearTimers = useCallback(() => {
    if (phaseTimerRef.current) {
      clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isClient || phase !== "entering") return;
    const timer = setTimeout(() => {
      setPhase("intro");
    }, 45);
    return () => clearTimeout(timer);
  }, [isClient, phase]);

  const startDocking = useCallback(() => {
    clearTimers();
    setPhase("docking");
    phaseTimerRef.current = setTimeout(() => {
      setPhase("minimized");
    }, DOCK_TRANSITION_MS);
  }, [clearTimers]);

  const openChat = useCallback(() => {
    clearTimers();
    setPhase("opening");
    openTimerRef.current = setTimeout(() => {
      setPhase("open");
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 60);
    }, 20);
  }, [clearTimers]);

  const closeChat = useCallback(() => {
    clearTimers();
    setShowTopicMenu(false);
    setPhase("closing");
    phaseTimerRef.current = setTimeout(() => {
      setPhase("minimized");
    }, CHAT_CLOSE_TRANSITION_MS);
  }, [clearTimers]);

  const replayIntro = useCallback(() => {
    clearTimers();
    setShowTopicMenu(false);
    setIntroTypedCount(0);
    setIntroIndex((prev) => {
      const next = (prev + 1) % INTRO_MESSAGES.length;
      try {
        sessionStorage.setItem("gajendra-intro-idx", String(next));
      } catch {
        // Ignore storage restrictions.
      }
      return next;
    });
    setTransitionKey((k) => k + 1);
    setPhase("entering");
  }, [clearTimers]);

  const activeIntroLine = INTRO_MESSAGES[introIndex % INTRO_MESSAGES.length];

  useEffect(() => {
    if (!isClient || phase !== "intro") return;

    try {
      sessionStorage.setItem("gajendra-intro-idx", String(introIndex));
    } catch {
      // Ignore storage restrictions.
    }

    const typeTimer = setInterval(() => {
      setIntroTypedCount((prev) => (prev < activeIntroLine.length ? prev + 2 : prev));
    }, 32);

    const dockTimer = setTimeout(() => {
      startDocking();
    }, INTRO_DURATION_MS);

    return () => {
      clearInterval(typeTimer);
      clearTimeout(dockTimer);
    };
  }, [isClient, phase, introIndex, activeIntroLine, startDocking]);

  useEffect(() => {
    if (!isClient || phase !== "minimized") return;
    const timer = setInterval(() => {
      setDockHintIndex((i) => (i + 1) % DOCK_HINTS.length);
    }, 3600);
    return () => clearInterval(timer);
  }, [isClient, phase]);

  useEffect(() => {
    if (!streamingMsg) return;

    const timer = setInterval(() => {
      setStreamingMsg((prev) => {
        if (!prev) return null;
        if (prev.shownChars >= prev.fullText.length) {
          clearInterval(timer);
          return null;
        }
        const remaining = prev.fullText.slice(prev.shownChars);
        const stepMatch = remaining.match(/^\S+\s*/);
        const step = Math.max(3, stepMatch ? stepMatch[0].length : 4);
        const nextChars = Math.min(prev.fullText.length, prev.shownChars + step);
        if (nextChars >= prev.fullText.length) {
          clearInterval(timer);
          return null;
        }
        return { ...prev, shownChars: nextChars };
      });
    }, 22);

    return () => clearInterval(timer);
  }, [streamingMsg?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase === "open") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamingMsg?.shownChars, isLoading, phase]);

  useEffect(() => {
    if (phase === "open" && showTopicMenu) {
      topicMenuRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [phase, showTopicMenu]);

  useEffect(() => {
    if (!isClient || (phase !== "open" && phase !== "opening")) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (drawerRef.current?.contains(target) || avatarButtonRef.current?.contains(target)) {
        return;
      }
      closeChat();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isClient, phase, closeChat]);

  useEffect(() => {
    if (!isClient) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (phase === "open" || phase === "opening") closeChat();
        else openChat();
        return;
      }
      if (event.key !== "Escape") return;
      if (phase === "intro") startDocking();
      else if (phase === "open" || phase === "opening") closeChat();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isClient, phase, startDocking, openChat, closeChat]);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const sendMessage = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || isLoading || cooldownSeconds > 0) return;

      const userMsg: ChatMessage = { id: makeId(), role: "user", content: text };
      const nextThread = [...messages, userMsg];
      setMessages(nextThread);
      setStreamingMsg(null);
      setFollowUps([]);
      setShowTopicMenu(false);
      setInput("");
      setThinkingIndex(Math.floor(Math.random() * THINKING_PHRASES.length));
      setThinkingSeconds(0);
      setIsLoading(true);

      const apiMessages = nextThread
        .filter((m) => !m.isError && m.id !== "welcome")
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 1200) }));

      const askedHistory = nextThread.filter((m) => m.role === "user").map((m) => m.content);

      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        });

        const data = (await res.json().catch(() => ({}))) as {
          reply?: string;
          error?: string;
          reason?: string;
          retryAfter?: number;
          fallbackReply?: string;
        };

        if (res.status === 429) {
          if (data.reason === "ip_rpm") {
            const waitSecs = Math.min(Math.max(Math.ceil(data.retryAfter ?? 12), 3), 60);
            setCooldownSeconds(waitSecs);
          }

          if (data.fallbackReply) {
            setMessages((prev) => {
              const lastAssistant = [...prev].reverse().find((m) => m.role === "assistant");
              if (lastAssistant?.content === data.fallbackReply) return prev;
              return [
                ...prev,
                {
                  id: makeId(),
                  role: "assistant",
                  content: data.fallbackReply!,
                },
              ];
            });
            setFollowUps(getContextualFollowUps(text, data.fallbackReply, askedHistory));
          } else if (data.reason !== "ip_rpm") {
            setMessages((prev) => [
              ...prev,
              {
                id: makeId(),
                role: "assistant",
                isError: true,
                content: data.error
                  ? data.error.replace(portfolio.person.email, `mailto:${portfolio.person.email}`)
                  : GENERIC_FALLBACK_REPLY,
              },
            ]);
          }
          return;
        }

        if (!res.ok || !data.reply) {
          setMessages((prev) => [
            ...prev,
            {
              id: makeId(),
              role: "assistant",
              isError: true,
              content: data.fallbackReply ?? GENERIC_FALLBACK_REPLY,
            },
          ]);
          return;
        }

        const replyId = makeId();
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        setMessages((prev) => [...prev, { id: replyId, role: "assistant", content: data.reply! }]);
        setFollowUps(getContextualFollowUps(text, data.reply, askedHistory));

        if (!reducedMotion) {
          setStreamingMsg({ id: replyId, fullText: data.reply, shownChars: 1 });
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            role: "assistant",
            isError: true,
            content: GENERIC_FALLBACK_REPLY,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, cooldownSeconds, messages],
  );

  if (!isClient) return null;

  const isIntroArea = phase === "entering" || phase === "intro";
  const showIntroCaption = phase === "entering" || phase === "intro" || phase === "docking";
  const showChatShell = phase === "opening" || phase === "open" || phase === "closing";
  const isChatVisible = phase === "open";
  const isMinimized = phase === "minimized";
  const isSpeakingNow = Boolean(streamingMsg);

  const activeMood: AvatarMood =
    phase === "entering" || phase === "intro"
      ? "intro"
      : phase === "docking"
        ? "docking"
        : isLoading
          ? "thinking"
          : isSpeakingNow
            ? "speaking"
            : input.trim().length > 0 || phase === "open"
              ? "listening"
              : "idle";

  const hasUserMessages = messages.some((m) => m.role === "user");

  const avatarStageClass =
    phase === "entering"
      ? "right-5 bottom-16 size-36 scale-75 translate-y-6 opacity-0 sm:right-10 sm:bottom-20 sm:size-44 xl:right-[max(2.5rem,calc((100vw-70rem)/4-5.5rem))]"
      : phase === "intro"
        ? "right-5 bottom-16 size-36 scale-100 translate-y-0 opacity-100 sm:right-10 sm:bottom-20 sm:size-44 xl:right-[max(2.5rem,calc((100vw-70rem)/4-5.5rem))]"
        : "right-5 bottom-5 size-14 scale-100 translate-y-0 opacity-100 sm:right-8 sm:bottom-7 xl:right-[max(2rem,calc((100vw-70rem)/4-1.75rem))]";

  return (
    <>
      {/* Ambient Warm Spotlight behind 3D Intro */}
      {showIntroCaption && (
        <div
          aria-hidden
          className={`pointer-events-none fixed inset-0 z-40 transition-opacity duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            phase === "intro" ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(34rem 22rem at 86% 78%, color-mix(in oklab, var(--accent) 13%, transparent) 0%, color-mix(in oklab, var(--sky) 6%, transparent) 42%, transparent 74%)",
          }}
        />
      )}

      {/* Staggered Highlight Intro Speech Panel beside the Waving 3D Avatar */}
      {showIntroCaption && (
        <div
          role="region"
          aria-label={`${FIRST_NAME}'s AI Introduction`}
          onMouseEnter={() => setAvatarHovered(true)}
          onMouseLeave={() => setAvatarHovered(false)}
          className={`fixed right-[10.5rem] bottom-[4.5rem] z-50 flex max-w-[15.75rem] origin-right flex-col gap-2 overflow-hidden rounded-2xl rounded-br-sm border border-line-strong/90 bg-raised/94 px-4 py-3 text-left shadow-[0_22px_65px_-14px_var(--shadow)] backdrop-blur-xl transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] sm:right-[14.25rem] sm:bottom-[6.25rem] sm:max-w-[21rem] xl:right-[max(14.5rem,calc((100vw-70rem)/4+6.5rem))] ${
            phase === "intro"
              ? "translate-x-0 scale-100 opacity-100 blur-0 delay-100"
              : "pointer-events-none translate-x-4 scale-95 opacity-0 blur-[5px]"
          }`}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -top-16 -right-14 size-44 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 8%, transparent), color-mix(in oklab, var(--violet) 4%, transparent) 60%, transparent 85%)",
            }}
          />
          <span className="relative flex items-center gap-1.5 text-[0.625rem] font-medium tracking-wider uppercase">
            <span className="relative flex size-1.5" aria-hidden>
              <span className="absolute inset-0 animate-ping rounded-full bg-ok opacity-75" />
              <span className="relative size-1.5 rounded-full bg-ok" />
            </span>
            <span className="bg-gradient-to-r from-ink via-accent to-violet bg-clip-text text-transparent">
              {FIRST_NAME} AI Assistant
            </span>
            <span className="text-ok">· Online</span>
          </span>

          <span className="relative text-xs leading-snug font-medium text-ink sm:text-[0.84375rem]">
            {activeIntroLine.slice(0, introTypedCount)}
            {introTypedCount < activeIntroLine.length && (
              <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-accent align-middle" aria-hidden />
            )}
          </span>

          {/* Staggered Highlight Chips */}
          <span className="relative flex flex-wrap gap-1.5">
            {INTRO_HIGHLIGHTS.map((item, idx) => (
              <span
                key={item.text}
                style={{ transitionDelay: phase === "intro" ? `${220 + idx * 110}ms` : "0ms" }}
                className={`inline-flex items-center gap-1 rounded-full border border-line bg-bg/85 px-2 py-0.5 text-[0.625rem] text-body transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  phase === "intro" ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
                }`}
              >
                <span className={`size-1.5 rounded-full ${item.dotClass}`} aria-hidden />
                {item.text}
              </span>
            ))}
          </span>

          {/* Compact Bottom Ask Me Text Action */}
          <div className="relative flex justify-end pt-0.5">
            <button
              type="button"
              onClick={openChat}
              className="group inline-flex items-center gap-1 text-[0.6875rem] font-medium text-accent transition-colors hover:text-ink"
            >
              <span>Ask me</span>
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Hover-Only `Gajendra AI Assistant` Pill beside the Minimized 3D Avatar Orb */}
      <button
        type="button"
        onClick={openChat}
        onMouseEnter={() => setAvatarHovered(true)}
        onMouseLeave={() => setAvatarHovered(false)}
        aria-label={`Open ${FIRST_NAME} AI Assistant`}
        className={`group fixed right-[5.25rem] bottom-[1.35rem] z-50 flex items-center gap-2.5 overflow-hidden rounded-full border border-line-strong/90 bg-raised/94 px-3.5 py-2 text-left shadow-[0_14px_40px_-10px_var(--shadow)] backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-accent sm:right-[6.25rem] sm:bottom-[1.85rem] xl:right-[calc(max(2rem,calc((100vw-70rem)/4-1.75rem))+4.25rem)] ${
          isMinimized && avatarHovered
            ? "translate-x-0 scale-100 opacity-100 blur-0"
            : "pointer-events-none translate-x-3 scale-95 opacity-0 blur-[3px]"
        }`}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent"
        />
        <span className="relative flex size-2 shrink-0" aria-hidden>
          <span className="absolute inset-0 animate-ping rounded-full bg-ok opacity-65" />
          <span className="relative size-2 rounded-full bg-ok" />
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 text-xs font-medium whitespace-nowrap text-ink">
            <span className="bg-gradient-to-r from-ink via-accent to-violet bg-clip-text text-transparent">
              {FIRST_NAME} AI Assistant
            </span>
            <kbd className="hidden rounded border border-line-strong bg-bg px-1.5 py-0.5 font-sans text-[0.5625rem] text-muted sm:inline-block">
              ⌘K
            </kbd>
          </span>
          <span key={dockHintIndex} className="anim-in block truncate text-[0.65rem] text-muted">
            {DOCK_HINTS[dockHintIndex]}
          </span>
        </span>
      </button>

      {/* Right-Side Chat Drawer */}
      {showChatShell && (
        <aside
          ref={drawerRef}
          aria-label={`${FIRST_NAME} AI Assistant Chat`}
          className={`fixed inset-x-4 bottom-[5.25rem] z-50 flex h-[min(32rem,calc(100dvh-10.75rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-line-strong/90 bg-raised/95 shadow-[0_28px_90px_-18px_var(--shadow)] backdrop-blur-xl transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] sm:inset-x-auto sm:right-8 sm:bottom-[5.75rem] sm:h-[min(33rem,calc(100dvh-11.75rem))] sm:w-[26rem] ${
            isChatVisible
              ? "translate-y-0 scale-100 opacity-100 blur-0"
              : "pointer-events-none translate-y-4 scale-[0.96] opacity-0 blur-[6px]"
          }`}
        >
          {/* Compact header with subtle dark-mode-safe AI glow */}
          <header className="relative flex items-center justify-between gap-2 overflow-hidden border-b border-line bg-gradient-to-b from-tint/35 via-bg/85 to-bg/80 px-3.5 py-2">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-24 -left-16 size-56 rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 7%, transparent), color-mix(in oklab, var(--violet) 4%, transparent) 60%, transparent 85%)",
              }}
            />
            <div className="relative min-w-0">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2 shrink-0" aria-hidden>
                  <span className="absolute inset-0 animate-ping rounded-full bg-ok opacity-60" />
                  <span className="relative size-2 rounded-full bg-ok" />
                </span>
                <h2 className="truncate bg-gradient-to-r from-ink via-accent to-violet bg-clip-text text-[0.8125rem] font-medium tracking-tight text-transparent">
                  {FIRST_NAME} AI Assistant
                </h2>
              </div>
              {(isLoading || isSpeakingNow) && (
                <p className="truncate pl-4 text-[0.65rem] leading-tight text-muted">
                  {isLoading ? THINKING_PHRASES[thinkingIndex] : "Typing…"}
                </p>
              )}
            </div>

            <div className="relative flex shrink-0 items-center gap-1">
              {hasUserMessages && (
                <button
                  type="button"
                  onClick={() => setShowTopicMenu((open) => !open)}
                  aria-expanded={showTopicMenu}
                  title="Browse topics"
                  className={`rounded-md border px-2 py-0.5 text-[0.6875rem] transition-colors ${
                    showTopicMenu
                      ? "border-accent/60 bg-tint text-ink"
                      : "border-transparent text-muted hover:border-line hover:text-ink"
                  }`}
                >
                  Menu
                </button>
              )}
              <button
                type="button"
                onClick={replayIntro}
                title="Replay intro"
                aria-label="Replay intro"
                className="rounded-md border border-transparent px-2 py-0.5 text-[0.6875rem] text-muted transition-colors hover:border-line hover:text-ink"
              >
                Intro
              </button>
              {hasUserMessages && (
                <button
                  type="button"
                  onClick={() => {
                    setStreamingMsg(null);
                    setFollowUps([]);
                    setShowTopicMenu(false);
                    setMessages([{ id: "welcome", role: "assistant", content: buildInitialGreeting() }]);
                  }}
                  title="Clear conversation"
                  aria-label="Clear conversation"
                  className="rounded-md border border-transparent px-2 py-0.5 text-[0.6875rem] text-muted transition-colors hover:border-line hover:text-ink"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={closeChat}
                title="Minimize chat (Esc)"
                aria-label="Minimize chat"
                className="grid size-7 place-items-center rounded-md border border-line text-xs text-muted transition-colors hover:border-accent hover:text-ink"
              >
                —
              </button>
            </div>
          </header>

          {/* Messages */}
          <div
            data-lenis-prevent
            className="assistant-scroll flex-1 space-y-3 overflow-y-auto px-4 py-3.5 text-sm"
          >
            {messages.map((msg) => {
              const displayText =
                streamingMsg && streamingMsg.id === msg.id
                  ? streamingMsg.fullText.slice(0, streamingMsg.shownChars)
                  : msg.content;
              const isStreamingThis = streamingMsg?.id === msg.id;

              return (
                <div key={msg.id} className={`anim-in flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[0.84375rem] leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-br-sm bg-gradient-to-br from-ink to-ink/85 text-bg"
                        : msg.isError
                          ? "rounded-bl-sm border border-accent/40 bg-tint text-ink"
                          : "rounded-bl-sm border border-line bg-bg text-body"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p className="whitespace-pre-wrap break-words">{displayText}</p>
                    ) : (
                      <div>
                        <MessageText text={displayText} />
                        {isStreamingThis && (
                          <span className="ml-1 inline-flex items-center gap-1 align-middle" aria-hidden>
                            <span className="inline-block h-3.5 w-[2px] animate-pulse bg-accent" />
                            <svg
                              viewBox="0 0 16 16"
                              className="size-3 animate-pulse text-violet"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            >
                              <path d="M3 13l1.2-3.6L10.6 3a1.5 1.5 0 0 1 2.1 2.1L6.3 11.5 3 13z" strokeLinejoin="round" />
                            </svg>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-sm border border-line bg-bg px-3.5 py-2 text-xs text-muted">
                  <span className="font-mono text-[0.6875rem] tabular-nums text-accent">
                    {thinkingSeconds}s
                  </span>
                  <span
                    key={thinkingIndex}
                    className="anim-in bg-gradient-to-r from-ink via-accent to-violet bg-clip-text font-medium text-transparent"
                  >
                    {THINKING_PHRASES[thinkingIndex]}
                  </span>
                  <span className="inline-flex items-center gap-1" aria-hidden>
                    <span className="size-1.5 animate-bounce rounded-full bg-accent [animation-delay:0ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-sky [animation-delay:150ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-violet [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}

            {hasUserMessages && !isLoading && !isSpeakingNow && followUps.length > 0 && !showTopicMenu && (
              <div className="anim-in flex flex-wrap gap-1.5 pt-0.5">
                {followUps.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    disabled={cooldownSeconds > 0}
                    onClick={() => void sendMessage(chip)}
                    className="rounded-full border border-line-strong/85 bg-bg/85 px-3 py-1 text-2xs text-body transition-all duration-200 hover:-translate-y-px hover:border-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {chip} ↗
                  </button>
                ))}
              </div>
            )}

            {((!hasUserMessages && !isLoading) || showTopicMenu) && (
              <div ref={topicMenuRef} className="anim-in space-y-2.5 pt-1">
                {!hasUserMessages && (
                  <div className="flex flex-wrap gap-1.5 text-[0.625rem] text-muted">
                    {portfolio.resume.facts.slice(0, 3).map((fact) => (
                      <span key={fact.text} className="rounded-full border border-line bg-bg/75 px-2.5 py-1">
                        {fact.text}
                      </span>
                    ))}
                  </div>
                )}

                <p className="label-sm">Popular topics</p>
                <div className="grid grid-cols-2 gap-2">
                  {STARTER_CARDS.map((card) => (
                    <button
                      key={card.title}
                      type="button"
                      disabled={cooldownSeconds > 0}
                      onClick={() => void sendMessage(card.prompt)}
                      className={`group rounded-xl border p-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${
                        card.wide
                          ? "col-span-2 border-accent/30 bg-gradient-to-br from-tint via-tint/60 to-violet/10 shadow-[inset_0_1px_0_0_color-mix(in_oklab,var(--accent)_20%,transparent)] hover:border-accent/55"
                          : "border-line bg-bg/85 hover:border-line-strong hover:bg-bg"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 text-xs font-medium text-ink">
                        <span className={`size-1.5 rounded-full ${card.dotClass}`} aria-hidden />
                        <span className="truncate">{card.title}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-[0.65rem] text-muted">{card.subtitle}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Rate-Limit Cooldown Banner */}
          {cooldownSeconds > 0 && (
            <div className="border-t border-accent/25 bg-tint/80 px-3.5 py-1.5 text-[0.6875rem] text-ink">
              Too many requests — ready in <span className="font-medium text-accent">{cooldownSeconds}s</span> ·{" "}
              <a href={`mailto:${portfolio.person.email}`} className="underline decoration-accent/50 hover:text-accent">
                {portfolio.person.email}
              </a>
            </div>
          )}

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage(input);
            }}
            className="border-t border-line bg-bg/75 p-3"
          >
            <div className="flex items-end gap-2 rounded-xl border border-line-strong bg-raised px-3 py-2 focus-within:border-accent">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                maxLength={350}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendMessage(input);
                  }
                }}
                placeholder={
                  cooldownSeconds > 0
                    ? `Ready in ${cooldownSeconds}s…`
                    : `Ask about ${FIRST_NAME}'s projects, AWS, or roles…`
                }
                aria-label={`Message ${FIRST_NAME} AI Assistant`}
                className="max-h-24 min-h-6 flex-1 resize-none bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || cooldownSeconds > 0 || input.trim().length === 0}
                aria-label="Send message"
                className="grid size-8 shrink-0 place-items-center rounded-lg bg-ink text-sm font-medium text-bg transition-all duration-200 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-35"
              >
                {cooldownSeconds > 0 ? cooldownSeconds : "↑"}
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between px-1 text-3xs text-faint">
              <a href={`mailto:${portfolio.person.email}`} className="transition-colors hover:text-accent">
                {portfolio.person.email} ↗
              </a>
              <span>{cooldownSeconds > 0 ? `Cooldown ${cooldownSeconds}s` : "Enter ↵"}</span>
            </div>
          </form>
        </aside>
      )}

      {/* Single Persistent Three.js 3D Avatar */}
      <button
        ref={avatarButtonRef}
        type="button"
        onClick={() => {
          if (phase === "open" || phase === "opening") closeChat();
          else openChat();
        }}
        onMouseEnter={() => setAvatarHovered(true)}
        onMouseLeave={() => setAvatarHovered(false)}
        aria-label={phase === "open" ? `Minimize ${FIRST_NAME} AI Assistant` : `Open ${FIRST_NAME} AI Assistant`}
        className={`fixed z-50 cursor-pointer rounded-full transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-accent ${avatarStageClass} ${
          isIntroArea
            ? "bg-transparent"
            : "border border-line-strong/90 bg-raised/92 shadow-[0_14px_40px_-10px_var(--shadow)] backdrop-blur-xl hover:scale-105 hover:border-accent"
        }`}
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-x-3 -bottom-2 h-6 rounded-full blur-xl transition-opacity duration-700 ${
            isIntroArea ? "opacity-75" : "opacity-0"
          }`}
          style={{
            background: "radial-gradient(closest-side, var(--accent), transparent)",
          }}
        />
        <AvatarCanvas
          mood={activeMood}
          variant={isIntroArea ? "intro" : "orb"}
          hovered={avatarHovered}
          transitionKey={transitionKey}
          className="h-full w-full"
        />
      </button>
    </>
  );
}
