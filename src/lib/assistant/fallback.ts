import { portfolio } from "@/config/portfolio";
import { experienceYears } from "@/lib/derive";

/**
 * Deterministic third-person fallback replies built strictly from `portfolio`
 * so 429 bursts still give visitors accurate answers and contact links.
 */
export function buildPortfolioFallbackReply(query: string): string {
  const lower = query.toLowerCase();
  const years = experienceYears();
  const { person, links, work, stack, experience, resume, ai } = portfolio;

  const findProject = (needle: string) =>
    work.projects.find((p) => p.name.toLowerCase().includes(needle.toLowerCase()));
  const findStackGroup = (needle: string) =>
    stack.groups.find((g) => g.category.toLowerCase().includes(needle.toLowerCase()));

  const linkedin = links.find((l) => l.label === "LinkedIn")?.url;
  const github = links.find((l) => l.label === "GitHub")?.url;
  const linksLine = [
    linkedin ? `[LinkedIn](${linkedin})` : null,
    github ? `[GitHub](${github})` : null,
    `[Resume](${person.resumeUrl})`,
    `[${person.email}](mailto:${person.email})`,
  ]
    .filter(Boolean)
    .join(" · ");

  if (/\b(fieldtracking|gps|fleet|attendance)\b/.test(lower)) {
    const project = findProject("FieldTracking360");
    if (project) {
      return `${project.name} (${project.period}): ${project.description} Stack: ${project.stack.slice(0, 6).join(", ")}. ${project.caseStudy.outcome}\n\nReach Gajendra at [${person.email}](mailto:${person.email}) for a deeper walkthrough.`;
    }
  }

  if (/\b(prompt\s*studio|zod|llm|ai|copilot|grounded)\b/.test(lower) && !/\b(overview|summary)\b/.test(lower)) {
    const project = findProject("Prompt Studio AI");
    const aiBullets = ai.capabilities.slice(0, 2).map((c) => c.title).join(" & ");
    if (project) {
      return `${project.name} (${project.period}): ${project.description} ${project.caseStudy.outcome} Focus areas: ${aiBullets}.\n\nConnect with Gajendra at [${person.email}](mailto:${person.email}).`;
    }
  }

  if (/\b(payment|razorpay|cashfree|stripe|webhook|payout|ledger)\b/.test(lower)) {
    const workForce = findProject("WorkForce");
    const fieldTracking = findProject("FieldTracking360");
    return `Gajendra integrates Razorpay, Cashfree, and Stripe across SaaS and workforce platforms using HMAC-signed webhooks, idempotency keys, and audited ledgers (${workForce?.name ?? "WorkForce"} & ${fieldTracking?.name ?? "FieldTracking360"}).\n\nFeel free to connect at [${person.email}](mailto:${person.email}).`;
  }

  if (/\b(grpc|redis|microservice|protobuf|double[\s-]?book|latency|30%)\b/.test(lower)) {
    const ride = findProject("Ride-Sharing");
    if (ride) {
      return `On ${ride.name} (${ride.period}), Gajendra architected NestJS gRPC/Protobuf microservices with Redis geo-hashing and distributed locks. ${ride.caseStudy.outcome}\n\nQuestions? Email [${person.email}](mailto:${person.email}).`;
    }
  }

  if (/\b(aws|ec2|ecs|s3|lambda|sqs|ses|docker|nginx|devops|ci\/?cd)\b/.test(lower)) {
    const cloudGroup = findStackGroup("Cloud");
    const tools = cloudGroup ? cloudGroup.tools.map((t) => t.name).join(", ") : "AWS, Docker, Nginx, GitHub Actions";
    return `Gajendra deploys and operates cloud infrastructure with ${tools} across production Node.js/NestJS and Next.js workloads.\n\nConnect directly at [${person.email}](mailto:${person.email}).`;
  }

  const companyWord = /\b(com[a-z]{1,6}y|cmp\w*|comp\w*|employer\w*|org\w*|firm\w*|job\w*|role\w*|work\w*)\b/.test(lower);
  const asksPrevious =
    (/\b(prev\w*|past|earlier|former|first|before)\b/.test(lower) &&
      (companyWord || /\bnot\s+current\b/.test(lower) || lower.trim().split(/\s+/).length <= 5)) ||
    /\b(not\s+devstree|before\s+devstree|other\s+com[a-z]{1,6}y|other\s+company)\b/.test(lower);

  if (asksPrevious) {
    const previousRole = experience.roles[1];
    const currentRole = experience.roles[0];
    if (previousRole) {
      return `${person.name.split(" ")[0]}'s previous company was **${previousRole.short ?? previousRole.title}** (${previousRole.period}), where he worked as a ${previousRole.title} (${previousRole.focus}) before joining **${currentRole?.short ?? person.company}** (${currentRole?.period ?? "present"}).`;
    }
  }

  if (/\b(curr\w*|present|now|latest)\b/.test(lower) && !/\bnot\s+current\b/.test(lower) && companyWord) {
    const currentRole = experience.roles[0];
    if (currentRole) {
      return `Gajendra currently works at **${currentRole.short ?? person.company}** as a **${currentRole.title}** (${currentRole.period}).`;
    }
  }

  if (/\b(exper\w*|role|roles|career|devstree|precious|infosys|infosystem)\b/.test(lower) || companyWord) {
    const rolesSummary = experience.roles
      .map((r) => `**${r.title}** at **${r.short ?? person.company}** (${r.period}): ${r.focus}`)
      .join("\n");
    return `Gajendra has ${years} years of experience:\n${rolesSummary}\n\n${linksLine}`;
  }

  if (/\b(educat|cert|mca|degree|college|medi|google)\b/.test(lower)) {
    const facts = resume.facts.map((f) => f.text).join(" · ");
    return `Gajendra's background: ${facts}.\n\nView his [Resume](${person.resumeUrl}) or email [${person.email}](mailto:${person.email}).`;
  }

  if (/\b(hire|hiring|open|availab|relocat|remote|hybrid|contact|reach|email)\b/.test(lower)) {
    return `Gajendra is **${person.status}** (${person.workMode}, ${person.relocation}) from ${person.location}.\n\nConnect directly via ${linksLine}.`;
  }

  const projectStat = experience.stats[0] ? `${experience.stats[0].value} ${experience.stats[0].label}` : `${work.projects.length} projects`;
  const cloudStat = experience.stats[1] ? `${experience.stats[1].value} ${experience.stats[1].label}` : "AWS cloud";
  return `${person.name} is a ${person.role} (${person.company}) with ${years} yrs experience and ${projectStat} — spanning **NestJS/gRPC microservices**, **React/Next.js**, **${cloudStat}**, and **Applied AI**.\n\n${linksLine}`;
}
