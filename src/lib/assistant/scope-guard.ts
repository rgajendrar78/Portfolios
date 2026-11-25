import { portfolio } from "@/config/portfolio";

export const OFF_TOPIC_REDIRECT = `I'm Gajendra AI Assistant, focused strictly on his engineering experience, projects, and availability. Ask me about his NestJS/React work, AWS, or hiring — or email him at ${portfolio.person.email}.`;

const GREETING_ONLY_RE =
  /^(hi+|hello+|hey+|hlo|yo|hola|namaste|good\s*(morning|afternoon|evening))[!.?\s]*$/i;

const THANKS_ONLY_RE = /^(thanks|thank\s*you|thx|ty|appreciated)[!.?\s]*$/i;
const BYE_ONLY_RE = /^(bye|goodbye|see\s*ya|take\s*care)[!.?\s]*$/i;

const INJECTION_RE =
  /\b(ignore\s+(all\s+)?(previous|prior|above)\s+instructions?|system\s+prompt|jailbreak|bypass\s+rules|act\s+as\s+(?!gajendra)|pretend\s+to\s+be|developer\s+mode|reveal\s+(your|the)\s+(prompt|instructions|api\s*key))\b/i;

const PORTFOLIO_SIGNAL_RE =
  /\b(gajendra|he|him|his|himself|you|your|yours|yourself|overview|introduce|introduction|summary|about\s+me|hire|hiring|job|role|roles|position|opening|career|resume|cv|experience|exper\w*|work|worked|working|company|companies|com[a-z]{1,6}y|employer|employers|organization|previous|prev\w*|current|curr\w*|past|first|former|earlier|before|project|projects|case\s*study|stack|skill|skills|tech|architecture|system\s*design|backend|frontend|full[\s-]?stack|microservice|microservices|grpc|protobuf|nestjs|node\.?js|express|react|next\.?js|typescript|postgres|postgresql|typeorm|mongodb|redis|aws|s3|ec2|ecs|lambda|sqs|ses|docker|nginx|ci\/?cd|rbac|jwt|oauth|websocket|socket\.?io|payment|payments|cashfree|razorpay|stripe|fieldtracking\d*|prompt\s*studio|famlee|workforce|ride[\s-]?sharing|portside|geoalerts|devstree|precious|infosys|infosystem|indore|medi[\s-]?caps|mca|certif|google\s*ai|email|mail|contact|linkedin|github|relocat|remote|hybrid|onsite|on-site|availab|notice|salary|rate|freelance|consult|build|built|shipped|deploy|latency|30%|100\+|12\+)\b/i;

const GENERAL_TASK_RE =
  /\b(write\s+(a|an|me|some|the)\s+(code|program|script|essay|poem|story|article|blog|email|letter|sql|regex)|solve\s+(this|my)|translate\s+|summarize\s+(this|the)|calculate\s+|weather|news|stock\s*price|recipe|movie|cricket|football|homework|assignment|leetcode|interview\s+question\s+on)\b/i;

const GENERIC_WHAT_IS_RE =
  /^(what\s+is|what's|whats|define|explain|meaning\s+of|how\s+does|difference\s+between)\b/i;

/**
 * Zero-token server gate:
 * - Handles pure greetings ("hi", "hii", "thanks", "bye") naturally without dumping a bio
 * - Blocks off-topic / personal-use questions before touching Gemini or daily quota
 */
export function checkPortfolioScope(messages: Array<{ role: "user" | "assistant"; content: string }>): {
  allowed: boolean;
  instantReply?: string;
  reason?: string;
} {
  const lastUser = messages[messages.length - 1]?.content?.trim() ?? "";
  if (!lastUser) return { allowed: false, instantReply: OFF_TOPIC_REDIRECT, reason: "empty" };

  if (GREETING_ONLY_RE.test(lastUser)) {
    return {
      allowed: false,
      reason: "greeting",
      instantReply:
        "Hey! Good to see you here. I'm Gajendra AI Assistant — what would you like to know about his experience, projects, or availability?",
    };
  }

  if (THANKS_ONLY_RE.test(lastUser)) {
    return {
      allowed: false,
      reason: "thanks",
      instantReply: `You're welcome! Let me know if you'd like to explore any of Gajendra's projects or reach him at ${portfolio.person.email}.`,
    };
  }

  if (BYE_ONLY_RE.test(lastUser)) {
    return {
      allowed: false,
      reason: "bye",
      instantReply: `Take care! Feel free to reach out to Gajendra anytime at ${portfolio.person.email}.`,
    };
  }

  if (INJECTION_RE.test(lastUser)) {
    return { allowed: false, instantReply: OFF_TOPIC_REDIRECT, reason: "injection" };
  }

  const hasPortfolioSignal = PORTFOLIO_SIGNAL_RE.test(lastUser);

  if (GENERAL_TASK_RE.test(lastUser) && !hasPortfolioSignal) {
    return { allowed: false, instantReply: OFF_TOPIC_REDIRECT, reason: "general_task" };
  }

  if (GENERIC_WHAT_IS_RE.test(lastUser) && !hasPortfolioSignal) {
    return { allowed: false, instantReply: OFF_TOPIC_REDIRECT, reason: "generic_definition" };
  }

  if (hasPortfolioSignal) {
    return { allowed: true };
  }

  if (
    messages.length >= 3 &&
    lastUser.length <= 90 &&
    !/\b(java|python|c\+\+|php|ruby|rust|golang|swift|kotlin|c#|angular|vue|django|laravel|spring)\b/i.test(lastUser)
  ) {
    return { allowed: true };
  }

  return { allowed: false, instantReply: OFF_TOPIC_REDIRECT, reason: "off_topic" };
}
