import type { Portfolio } from "@/types/portfolio";

/**
 * THE ONLY FILE YOU EDIT.
 *
 * Every word, link, colour and list on the site is read from here. Entries
 * marked SAMPLE are placeholders: replace them with your own before you
 * publish. Wrap a phrase in *asterisks* in any section title to set it in
 * italics. Every list can grow: add a project, a skill, a skill group, a role
 * or a step and the layout makes room for it. Icon names and colour tones are listed
 * in src/types/portfolio.ts.
 */
export const portfolio: Portfolio = {
  site: {
    url: "https://your-name.example.com",
    title: "Your Name — Full Stack Engineer | Node.js | NestJS | React | AI",
    description:
      "Portfolio of Your Name, a Full Stack Engineer working with Node.js, NestJS, React, TypeScript, PostgreSQL, AWS, microservices and AI-powered applications.",
    keywords: [
      "Full Stack Engineer",
      "Node.js Developer",
      "NestJS Developer",
      "React Developer",
      "TypeScript Developer",
      "PostgreSQL",
      "AWS",
      "Docker",
    ],
  },

  person: {
    name: "Your Name",
    tagline: "engineer, Ahmedabad",
    role: "Full Stack Engineer",
    company: "Your Company",
    location: "Ahmedabad, Gujarat, India",
    timeZone: "UTC+5:30 (IST)",
    email: "you@example.com",
    // Put your PDF in /public and point to it.
    resumeUrl: "/resume.pdf",
    careerStart: "2023-04-01",
    status: "Open to new roles",
    relocation: "Open to relocation",
    workMode: "Remote, Hybrid, On-site",
  },

  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/your-handle" },
    { label: "GitHub", url: "https://github.com/your-handle" },
  ],

  theme: {
    defaultMode: "light",
    light: {
      bg: "#f7f5f0",
      raised: "#ffffff",
      tint: "#f5ede1",
      ink: "#1c1b19",
      body: "#2f2e2a",
      muted: "#54534e",
      faint: "#64635e",
      line: "#dcd8cf",
      lineStrong: "#b9b4a9",
      accent: "#9a4f14",
      ok: "#3a7134",
      sky: "#245f8f",
      violet: "#5b45a8",
    },
    dark: {
      bg: "#0d0d0c",
      raised: "#151514",
      tint: "#1a1712",
      ink: "#ecebe6",
      body: "#bdbcb5",
      muted: "#8d8c85",
      faint: "#6b6a64",
      line: "#262624",
      lineStrong: "#3a3936",
      accent: "#e9a15b",
      ok: "#8fbf88",
      sky: "#8db6dc",
      violet: "#b4a4e2",
    },
  },

  hero: {
    intro:
      "I build *distributed backends|real-time dashboards|Redis-backed APIs*, *payment flows|audited ledgers|order pipelines* that don't double-charge, and *AI features|AI assistants|RAG pipelines* that don't make things up.",
    footnotes: [
      { text: "gRPC · Docker · Redis", icon: "boxes", tone: "accent" },
      { text: "idempotent webhooks · ACID ledger", icon: "receipt", tone: "ok" },
      { text: "RAG · typed tool calls", icon: "chat", tone: "sky" },
    ],
    // The diagram under the hero: one request per project, drawn from these names.
    trace: {
      label: "Trace · follow one request",
      requests: [
        {
          project: "FieldTrack360",
          caption: "FieldTrack360 · Live team map",
          source: "Admin app",
          gateway: "API",
          services: ["Auth", "Attendance", "Tracking"],
          stores: ["Postgres", "Socket"],
          spans: [
            { label: "token + permission check", from: 0, to: 12, tone: "violet" },
            { label: "team scope lookup", from: 10, to: 36, tone: "accent" },
            { label: "location query", from: 30, to: 70, tone: "accent" },
            { label: "socket subscribe", from: 58, to: 84, tone: "ok" },
            { label: "marker update", from: 84, to: 100, tone: "sky" },
          ],
          result: "map updates per marker, no full redraw",
        },
        {
          // SAMPLE
          project: "Ride Dispatch",
          caption: "Ride Dispatch · Booking a ride",
          source: "Rider app",
          gateway: "Gateway",
          services: ["Ride", "Driver", "Notify"],
          stores: ["Redis", "Postgres"],
          spans: [
            { label: "auth + rate limit", from: 0, to: 10, tone: "violet" },
            { label: "create booking", from: 10, to: 90, tone: "accent" },
            { label: "match driver (gRPC)", from: 18, to: 56, tone: "accent" },
            { label: "lock driver in Redis", from: 24, to: 46, tone: "ok" },
            { label: "notify rider", from: 78, to: 92, tone: "sky" },
          ],
          result: "one driver assigned, no double booking",
        },
        {
          // SAMPLE
          project: "Ledger Pay",
          caption: "Ledger Pay · Payment webhook",
          source: "Provider",
          gateway: "Gateway",
          services: ["Webhook", "Ledger", "Orders"],
          stores: ["Redis", "Postgres"],
          spans: [
            { label: "verify signature", from: 0, to: 16, tone: "violet" },
            { label: "idempotency key", from: 16, to: 28, tone: "ok" },
            { label: "credit ledger", from: 28, to: 88, tone: "accent" },
            { label: "place order", from: 64, to: 86, tone: "accent" },
            { label: "retry dropped", from: 90, to: 98, tone: "ok" },
          ],
          result: "3 deliveries, 1 credit",
        },
      ],
    },
  },

  work: {
    label: "Selected work",
    title: "Case studies from *production*, not side projects.",
    intro:
      "Each one is a system I shipped with a real constraint behind it, and the part that was actually hard.",
    filters: {
      "Full Stack": { tone: "sky", icon: "layout" },
      Backend: { tone: "accent", icon: "server" },
      Microservices: { tone: "accent", icon: "boxes" },
      FinTech: { tone: "ok", icon: "receipt" },
      AI: { tone: "violet", icon: "cpu" },
      SaaS: { tone: "sky", icon: "cloud" },
      Enterprise: { tone: "violet", icon: "shield" },
    },
    projects: [
      {
        name: "FieldTrack360",
        subtitle: "Field Team Tracking & Operations Platform",
        category: "Full Stack",
        tone: "sky",
        icon: "layout",
        tags: ["Full Stack", "SaaS", "Enterprise"],
        period: "2025–2026",
        description:
          "Admin web app that shows a company its field team live on a map, and handles visits, attendance, leave, expenses and billing in one place.",
        facts: [
          { label: "Scale", icon: "layers", value: "100+ screens, 45 API modules" },
          { label: "Real time", icon: "radio", value: "Live locations over WebSockets" },
          { label: "Access", icon: "shield", value: "Role-based permissions per module" },
        ],
        hardPart:
          "Keeping 100+ screens consistent and fast: one shared table, form and loading system, and live locations without redrawing the whole map.",
        stack: [
          "Next.js",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "Redux / Zustand",
          "Socket.IO / WebSockets",
          "REST APIs",
        ],
        caseStudy: {
          problem: "Field operations were run from calls and spreadsheets. Managers could not see where the team was, and attendance, leave, visits and expenses each lived in a separate tool with its own rules.",
          architecture: "A Next.js admin app talks to a NestJS API over REST for records, and over socket connections for anything live. Server data is cached per screen and client state stays small.",
          flow: [
            "Sign in and load the role's permissions",
            "The session is checked on every navigation",
            "A screen loads its list through the shared fetch hook",
            "Filters and paging go through one shared hook",
            "Live locations arrive on the tracking socket",
            "Only the markers that moved are redrawn on the map",
          ],
          components: [
            { name: "Shared data table", role: "Sorting, paging, column toggle and loading states for every list", tech: "React · TypeScript" },
            { name: "Data layer", role: "Cached fetches and mutations with one error path", tech: "TanStack Query · Axios" },
            { name: "Permissions", role: "Read, create, update and delete gates per module", tech: "Zustand · route guards" },
            { name: "Live tracking", role: "Team locations and presence on the map", tech: "Socket.IO" },
            { name: "Forms", role: "Validated forms with server errors mapped to fields", tech: "React Hook Form · Zod" },
          ],
          outcome: "One admin app replaced the scattered tools: 100+ screens that load, filter and fail the same way.",
          takeaway: "Consistency is a feature. Once every list and form shared one primitive, new screens stopped being new problems.",
        },
      },
      {
        // SAMPLE
        name: "Ride Dispatch",
        subtitle: "Distributed Ride-Sharing Platform",
        category: "Microservices",
        tone: "accent",
        icon: "boxes",
        tags: ["Microservices", "Backend"],
        period: "2024–2025",
        description:
          "Ride-sharing backend built as independently deployable services that talk to each other over gRPC.",
        facts: [
          { label: "Architecture pattern", icon: "boxes", value: "Dedicated microservices" },
          { label: "Inter-service protocol", icon: "server", value: "Binary gRPC over HTTP/2" },
          { label: "Deployment", icon: "container", value: "Docker Compose" },
        ],
        hardPart:
          "Moving a booking across several services without deadlocks or stale driver availability when many riders book at once.",
        stack: ["NestJS", "PostgreSQL", "TypeORM / Prisma", "gRPC / Protobuf", "Docker", "Nginx", "Redis"],
        caseStudy: {
          problem: "A single backend handled dispatch, driver locations and payments. At peak hours they competed for the same database locks and slowed each other down.",
          architecture: "Independent services behind one gateway, with gRPC for typed calls between them and Redis for locations and short-lived locks.",
          flow: [
            "Rider requests a ride",
            "Gateway checks the token and rate limit",
            "Ride service creates the booking",
            "Driver service finds and locks the nearest driver",
            "Notification service tells rider and driver",
          ],
          components: [
            { name: "API gateway", role: "Routing, auth checks and rate limits", tech: "Nginx · NestJS" },
            { name: "Ride service", role: "Booking state machine and fares", tech: "NestJS · PostgreSQL" },
            { name: "Driver service", role: "Availability and nearest-driver search", tech: "NestJS · Redis" },
            { name: "Notification service", role: "Push alerts to rider and driver", tech: "NestJS" },
          ],
          outcome: "Each service deploys and scales on its own, and a driver is never assigned twice.",
          takeaway: "Strict boundaries with typed contracts make concurrency problems visible early.",
        },
      },
      {
        // SAMPLE
        name: "Ledger Pay",
        subtitle: "Wealth & FinTech Platform",
        category: "FinTech",
        tone: "ok",
        icon: "receipt",
        tags: ["FinTech", "Backend"],
        period: "2024–2025",
        description:
          "Investment platform with automated purchases and payment reconciliation that stays correct when webhooks retry.",
        facts: [
          { label: "Reliability pattern", icon: "shield", value: "HMAC webhook idempotency" },
          { label: "Payment integration", icon: "receipt", value: "Gateway and webhooks" },
        ],
        hardPart:
          "Preventing duplicate orders when webhook retries arrive out of order, or at the same moment as client polling.",
        stack: ["NestJS", "PostgreSQL", "TypeORM / Prisma", "REST APIs", "Redis"],
        caseStudy: {
          problem: "Payment providers retry webhooks. Without care, the same payment credits an account twice, or an order is placed before the money has arrived.",
          architecture: "Every webhook is signature-checked, stored under an idempotency key, and applied to a ledger inside one database transaction.",
          flow: [
            "Provider sends a payment webhook",
            "Signature is verified",
            "Idempotency key is looked up in Redis",
            "Ledger entry is written in a transaction",
            "Order is placed only after the credit",
          ],
          components: [
            { name: "Webhook handler", role: "Signature check and de-duplication", tech: "NestJS · Redis" },
            { name: "Ledger", role: "Append-only credits and debits", tech: "PostgreSQL" },
            { name: "Orders", role: "Purchases placed after a confirmed credit", tech: "NestJS" },
          ],
          outcome: "Three deliveries of the same webhook produce exactly one credit.",
          takeaway: "Money code is mostly about what happens the second time the same message arrives.",
        },
      },
      {
        // SAMPLE
        name: "Trip Planner",
        subtitle: "AI-Powered Travel Discovery Platform",
        category: "AI",
        tone: "violet",
        icon: "cpu",
        tags: ["AI", "Full Stack", "Backend"],
        period: "2024–2025",
        description:
          "Itinerary and discovery engine where an AI assistant plans trips from real partner inventory.",
        facts: [
          { label: "AI architecture", icon: "cpu", value: "Tool calling + deterministic APIs" },
          { label: "Platform scope", icon: "layout", value: "Discovery, booking and host portal" },
        ],
        hardPart:
          "Stopping the AI from inventing availability, room rates and booking confirmations.",
        stack: ["NestJS", "PostgreSQL", "React", "Next.js", "LLM Applications", "TypeScript"],
        caseStudy: {
          problem: "A language model will happily invent a hotel, a price or a booking reference. In travel, a made-up answer is worse than no answer.",
          architecture: "The model only proposes. Every proposal becomes a typed tool call that the backend validates and runs against real partner inventory.",
          flow: [
            "Traveller describes the trip in plain text",
            "Relevant stays and places are retrieved",
            "The model proposes a typed tool call",
            "The backend validates it against the schema",
            "Availability and rates come from the database",
          ],
          components: [
            { name: "Assistant", role: "Understands the request and proposes steps", tech: "LLM APIs" },
            { name: "Retrieval", role: "Finds matching stays and places", tech: "PostgreSQL" },
            { name: "Tool layer", role: "Typed, validated calls into the API", tech: "NestJS · TypeScript" },
            { name: "Booking API", role: "Reservations and partner portal", tech: "NestJS · PostgreSQL" },
          ],
          outcome: "Itineraries only contain stays that can actually be booked.",
          takeaway: "Let the model reason, and let the backend decide.",
        },
      },
      {
        // SAMPLE
        name: "Parts Market",
        subtitle: "Automotive E-Commerce Platform",
        category: "Full Stack",
        tone: "sky",
        icon: "layout",
        tags: ["Full Stack", "Backend"],
        period: "2023–2024",
        description:
          "Parts marketplace with multi-attribute catalogue filtering, inventory sync and real-time buyer and seller chat.",
        facts: [
          { label: "Catalogue", icon: "database", value: "Multi-attribute compatibility" },
          { label: "Communication", icon: "chat", value: "Real-time WebSocket chat" },
        ],
        hardPart:
          "Fast faceted search across a large catalogue with several layers of vehicle compatibility.",
        stack: ["NestJS", "PostgreSQL", "React", "Next.js", "Socket.IO / WebSockets", "Tailwind CSS"],
        caseStudy: {
          problem: "A part only matters if it fits the buyer's vehicle. Filtering a large catalogue by make, model, year and engine has to stay fast.",
          architecture: "A relational catalogue with indexes shaped by the filters, cached reads for popular searches, and a socket channel for buyer and seller chat.",
          flow: [
            "Buyer picks make, model, year and engine",
            "Compatible parts are filtered in one query",
            "Popular searches are served from cache",
            "Buyer and seller talk in real time",
          ],
          components: [
            { name: "Catalogue", role: "Parts and vehicle compatibility", tech: "PostgreSQL" },
            { name: "Search", role: "Faceted filters and cached results", tech: "NestJS · Redis" },
            { name: "Chat", role: "Buyer and seller messages", tech: "Socket.IO" },
            { name: "Storefront", role: "Listing and product pages", tech: "Next.js · React" },
          ],
          outcome: "Buyers see only the parts that fit, and searches stay quick as the catalogue grows.",
          takeaway: "Index for the questions people actually ask.",
        },
      },
    ],
    // SAMPLE
    alsoBuilt: [
      { name: "Clipstream", subtitle: "Short Video & Content Management SaaS", period: "2024" },
      { name: "Portside", subtitle: "Port Logistics Operations Platform", period: "2023–2024" },
      { name: "Glowbook", subtitle: "Salon & Beauty Services Platform", period: "2023–2024" },
    ],
  },

  about: {
    label: "About",
    title: "I care about the whole request, *not just my layer of it.*",
    intro:
      "I approach software engineering with an end-to-end product mindset. Rather than stopping at UI components or isolated database queries, I design for the full lifecycle: API contracts, concurrency, data integrity, security boundaries and observability.",
    layers: [
      {
        name: "Frontend",
        icon: "layout",
        sketch: "ui",
        tone: "sky",
        text: "Responsive layouts, state synchronization, client performance, and accessible design.",
        tools: ["React", "Next.js"],
      },
      {
        name: "Backend",
        icon: "server",
        sketch: "tree",
        tone: "accent",
        text: "Modular structure, dependency injection, validation guards, and REST/gRPC.",
        tools: ["Node.js", "NestJS"],
      },
      {
        name: "Database",
        icon: "database",
        sketch: "table",
        tone: "ok",
        text: "Relational schemas, ACID transactions, composite indexing, and Redis caching.",
        tools: ["PostgreSQL", "Redis"],
      },
      {
        name: "Infrastructure",
        icon: "cloud",
        sketch: "grid",
        tone: "violet",
        text: "Multi-stage container builds, Docker Compose, EC2 hosts, and automated CI/CD.",
        tools: ["AWS EC2", "Docker"],
      },
      {
        name: "AI engineering",
        icon: "cpu",
        sketch: "chat",
        tone: "violet",
        text: "Connecting generative reasoning with deterministic backend APIs and transactions.",
        tools: ["RAG Architectures", "Function & Tool Calling"],
      },
    ],
    request: {
      label: "A request, top to bottom",
      text: "The layers I usually own on a project. Watch one pass, or pick a layer.",
      layers: [
        {
          name: "Client",
          detail: "React · Next.js · TypeScript",
          title: "Client apps & state",
          tools: ["React", "Next.js", "TanStack Query"],
          text: "Typed screens, shared components, and state that stays in sync with the server.",
          icon: "phone",
          tone: "sky",
        },
        {
          name: "Gateway",
          detail: "Nginx · NestJS gateway",
          title: "API gateway & ingress",
          tools: ["Nginx", "NestJS gateway", "Rate limits"],
          text: "One way in: TLS, rate limits and token checks before any service runs.",
          icon: "shield",
          tone: "violet",
        },
        {
          name: "Services",
          detail: "Microservices & domain logic",
          title: "Services & domain logic",
          tools: ["NestJS modules", "DTO validation", "gRPC"],
          text: "Domain logic in small modules with validated inputs and clear contracts.",
          icon: "boxes",
          tone: "accent",
        },
        {
          name: "Storage",
          detail: "PostgreSQL · Redis",
          title: "Data & caching",
          tools: ["PostgreSQL", "Redis", "Migrations"],
          text: "Schemas, transactions and indexes that match the queries; Redis for hot reads.",
          icon: "database",
          tone: "ok",
        },
        {
          name: "Infra",
          detail: "AWS · Docker Compose",
          title: "Infrastructure & delivery",
          tools: ["Docker", "AWS", "GitHub Actions"],
          text: "Containers and CI/CD, so every environment is built the same way.",
          icon: "cloud",
          tone: "neutral",
        },
      ],
      aside: {
        name: "AI",
        detail: "RAG · LLM tools · backend bridge",
        title: "AI beside the backend",
        text: "Models retrieve, reason and propose. Typed tools hand the decision back to normal API code.",
        tools: ["RAG", "Tool calling", "Schema validation"],
        note: "runs beside services, not inside them",
        icon: "cpu",
        tone: "violet",
      },
    },
  },

  principles: {
    label: "Principles",
    title: "How I think about engineering.",
    intro:
      "Six habits that run in a loop: understand, design, build, measure, automate, ship, and back to the problem. Pick a step to see what I actually do.",
    quote:
      "Good engineering starts with understanding the rules, the failure cases and the people using it. Code written before that usually solves the wrong problem.",
    steps: [
      {
        title: "Start with the problem",
        icon: "search",
        text: "Deconstruct domain constraints before writing code.",
        detail: "Before schemas or routes, map the states, the edge cases, and who is allowed to do what.",
      },
      {
        title: "Design the system",
        icon: "compass",
        text: "Define contracts, data models, and failure modes.",
        detail: "Write the contract first: inputs, outputs, the data model, and how each part can fail.",
      },
      {
        title: "Build for maintainability",
        icon: "wrench",
        text: "Write code optimized for reading and evolving.",
        detail: "Small modules, clear names, one way to do each thing. The next reader is the user of the code.",
      },
      {
        title: "Measure bottlenecks",
        icon: "gauge",
        text: "Profile actual queries and network latencies.",
        detail: "Measure the real query and the real network call before changing anything.",
      },
      {
        title: "Automate repetitive work",
        icon: "repeat",
        text: "Containerize and standardize development pipelines.",
        detail: "If a step is done twice by hand, script it: builds, environments, deploys.",
      },
      {
        title: "Ship and iterate",
        icon: "rocket",
        text: "Deliver working software and incorporate real feedback.",
        detail: "Ship the working slice, watch how it is used, then improve it.",
      },
    ],
  },

  ai: {
    label: "Applied AI",
    title: "The model reasons. *The backend decides.*",
    intro:
      "I don't treat AI as a marketing word. I build LLM features where probabilistic reasoning hands off to deterministic, schema-validated backend transactions, so a model can suggest a booking but never invent one.",
    path: [
      {
        step: "User",
        icon: "user",
        note: "intent",
        zone: "model",
        detail: "Free text in, no structure yet.",
        example: '"2 nights in Jaipur under ₹8k"',
      },
      {
        step: "AI app",
        icon: "phone",
        note: "session",
        zone: "model",
        detail: "The session adds who is asking and what they are allowed to do.",
        example: 'user 42 · role: traveller',
      },
      {
        step: "Prompt",
        icon: "lock",
        note: "guardrails",
        zone: "model",
        detail: "Rules the model must follow, and what it must never do.",
        example: 'never state a price you did not read',
      },
      {
        step: "RAG",
        icon: "database",
        note: "retrieval",
        zone: "model",
        detail: "Relevant records are fetched, so the answer comes from data.",
        example: 'top 5 stays · partner catalogue',
      },
      {
        step: "LLM",
        icon: "cpu",
        note: "reasoning",
        zone: "model",
        detail: "The model proposes the next step. It cannot write anything itself.",
        example: 'propose: search_stays',
      },
      {
        step: "Tool call",
        icon: "braces",
        note: "schema gate",
        zone: "backend",
        detail: "The proposal must match a typed schema, or it is rejected.",
        example: '{ city: "Jaipur", max_price: 8000 }',
      },
      {
        step: "Backend",
        icon: "server",
        note: "NestJS · DB",
        zone: "backend",
        detail: "Normal API code checks permissions and runs the transaction.",
        example: 'SELECT … FOR UPDATE',
      },
      {
        step: "Action",
        icon: "check",
        note: "committed",
        zone: "backend",
        detail: "The change is saved and confirmed back to the user.",
        example: 'booking #1042 confirmed',
      },
    ],
    capabilities: [
      {
        title: "RAG architectures & vector stores",
        icon: "database",
        text: "Grounding models in domain documents and database catalogues, so answers come from retrieved context rather than model memory.",
      },
      {
        title: "Strict tool & function calling",
        icon: "braces",
        text: "Rigid JSON schema signatures for tool invocation, so every call conforms to backend DTOs before touching a database.",
      },
      {
        title: "AI + backend transactions",
        icon: "server",
        text: "Real-world actions run inside atomic database transactions, never on raw LLM strings.",
      },
      {
        title: "Prompts & guardrails",
        icon: "shield",
        text: "Hardened system prompts, defensive input sanitization, and graceful fallbacks when tools error.",
      },
    ],
    // SAMPLE
    replay: [
      {
        project: "Trip Planner",
        ask: "Plan two days in Jaipur under ₹8k.",
        steps: [
          { label: "Reason", icon: "cpu", text: "Needs dates, a budget and partner stays in Jaipur." },
          { label: "Retrieve", icon: "database", text: "12 partner stays and 30 places matched from the catalogue." },
          { label: "Typed tool", icon: "braces", text: "search_stays(city, max_price) passes schema validation." },
          { label: "Backend", icon: "server", text: "Availability and rates are read from the database." },
        ],
        result: "A two-day plan with three stays that can actually be booked.",
        chips: ["rates from the database", "0 invented"],
      },
      {
        project: "Ride Dispatch",
        ask: "Send the nearest driver to pickup #214.",
        steps: [
          { label: "Reason", icon: "cpu", text: "Needs the pickup point, driver state and a dispatch call." },
          { label: "Retrieve", icon: "database", text: "5 drivers in range from the location index." },
          { label: "Typed tool", icon: "braces", text: "assign_driver(ride_id, driver_id) passes schema validation." },
          { label: "Backend", icon: "server", text: "Driver locked and ride updated in one transaction." },
        ],
        result: "One driver assigned; the rider is notified.",
        chips: ["1 assignment", "row locked"],
      },
    ],
  },

  stack: {
    label: "Stack",
    title: "Tools I reach for, and what for.",
    intro:
      "Left side builds the product, right side runs it. Everything here has shipped in production; a filled dot marks a daily driver. Pick any tool to see how I use it.",
    groups: [
      {
        category: "Frontend",
        icon: "layout",
        tone: "sky",
        side: "build",
        tools: [
          {
            name: "React",
            daily: true,
            note: "Component-driven interfaces and state that stays predictable as screens multiply.",
          },
          {
            name: "Next.js",
            daily: true,
            note: "App Router, server rendering and static pages for fast first loads.",
          },
          {
            name: "TypeScript",
            daily: true,
            note: "Strict types across client and server, so contracts break at build time, not in production.",
          },
          {
            name: "Tailwind CSS",
            note: "Design tokens and utility classes for consistent, responsive layouts.",
          },
          {
            name: "Vite",
            note: "Fast local builds for single-page React apps.",
          },
          {
            name: "Redux / Zustand",
            note: "Small, explicit client stores; server data stays in the query cache.",
          },
        ],
      },
      {
        category: "Backend",
        icon: "server",
        tone: "accent",
        side: "build",
        tools: [
          {
            name: "NestJS",
            daily: true,
            note: "Modular services with dependency injection, guards, interceptors and validated DTOs.",
          },
          {
            name: "Node.js",
            daily: true,
            note: "Non-blocking I/O, streams and workers for APIs that stay responsive under load.",
          },
          {
            name: "Express",
            note: "Lightweight HTTP services where a full framework is too much.",
          },
          {
            name: "REST APIs",
            daily: true,
            note: "Resource-oriented endpoints with clear contracts, paging and consistent errors.",
          },
          {
            name: "Socket.IO / WebSockets",
            note: "Live updates: locations, chat and presence without polling.",
          },
          {
            name: "gRPC / Protobuf",
            note: "Typed, binary service-to-service calls with shared schemas.",
          },
        ],
      },
      {
        category: "Database",
        icon: "database",
        tone: "ok",
        side: "build",
        tools: [
          {
            name: "PostgreSQL",
            daily: true,
            note: "Relational schemas, transactions and indexes shaped by the real queries.",
          },
          {
            name: "Redis",
            daily: true,
            note: "Caching, locks, rate limits and pub/sub for hot paths.",
          },
          {
            name: "TypeORM / Prisma",
            note: "Typed data access, with migrations kept in version control.",
          },
          {
            name: "MongoDB",
            note: "Document storage where the shape of the data really is flexible.",
          },
          {
            name: "MySQL",
            note: "Relational storage on projects that already run it.",
          },
        ],
      },
      {
        category: "AI",
        icon: "sparkles",
        tone: "violet",
        side: "build",
        tools: [
          {
            name: "RAG Architectures",
            note: "Answers grounded in retrieved documents instead of model memory.",
          },
          {
            name: "Function & Tool Calling",
            note: "Typed tool schemas, so a model can ask and only the backend can act.",
          },
          {
            name: "LLM Applications",
            note: "Chat and assistant features wired into real product flows.",
          },
          {
            name: "Prompt Engineering",
            note: "System prompts with clear rules, examples and failure behaviour.",
          },
          {
            name: "AI + Backend Integration",
            note: "Model output validated and committed through normal API code.",
          },
        ],
      },
      {
        category: "Cloud",
        icon: "cloud",
        tone: "violet",
        side: "run",
        tools: [
          {
            name: "AWS EC2",
            note: "Application hosts sized and secured for the workload.",
          },
          {
            name: "AWS S3",
            note: "File and media storage with signed, time-limited access.",
          },
          {
            name: "AWS RDS",
            note: "Managed PostgreSQL with backups and replicas.",
          },
          {
            name: "AWS Lambda",
            note: "Small event-driven jobs without a server to look after.",
          },
          {
            name: "AWS ECS / ECR",
            note: "Container images stored and run as services.",
          },
        ],
      },
      {
        category: "DevOps",
        icon: "container",
        tone: "violet",
        side: "run",
        tools: [
          {
            name: "Docker",
            daily: true,
            note: "The same image in development, CI and production.",
          },
          {
            name: "Docker Compose",
            note: "Multi-service stacks started with one command.",
          },
          {
            name: "Nginx",
            note: "Reverse proxy, TLS termination and rate limits in front of the API.",
          },
          {
            name: "GitHub Actions",
            note: "Build, test and deploy on every push.",
          },
        ],
      },
      {
        category: "Architecture",
        icon: "layers",
        tone: "neutral",
        side: "run",
        tools: [
          {
            name: "Microservices",
            note: "Independent services split along real domain boundaries.",
          },
          {
            name: "API Gateway Pattern",
            note: "One entry point for auth, limits and routing.",
          },
          {
            name: "Event-Driven Systems",
            note: "Queues and events, so slow work never blocks a request.",
          },
          {
            name: "RBAC (Role-Based Access)",
            note: "Permissions per role and module, enforced on the server and reflected in the UI.",
          },
          {
            name: "Modular Monolith",
            note: "Clear module boundaries first; split into services only when needed.",
          },
        ],
      },
    ],
  },

  // SAMPLE — newest role first.
  experience: {
    label: "Experience",
    title: "One company, *four different jobs.*",
    intro:
      "Your Company, April 2023 to now. Each role added a layer of the request I was trusted to own.",
    stats: [
      { value: "4", label: "roles, intern to engineer" },
      { value: "15+", label: "production projects" },
      { value: "5", label: "case studies on this page" },
    ],
    layers: ["UI", "State", "API", "DB", "Infra", "AI"],
    roles: [
      {
        title: "Software Engineer",
        icon: "boxes",
        owns: ["UI", "State", "API", "DB", "Infra", "AI"],
        focus: "Distributed Systems & AI Engineering",
        period: "2026 — Present",
        summary:
          "Building distributed backends, gRPC microservices and AI workflows backed by relational databases for international clients.",
        stack: ["NestJS", "Microservices", "gRPC / Protobuf", "Docker", "PostgreSQL", "Redis"],
        responsibilities: [
          "Building microservice backends with NestJS, PostgreSQL, Redis and gRPC.",
          "Integrating AI reasoning with deterministic database tool-calling.",
          "Guiding database design, indexing and transaction isolation.",
          "Containerizing multi-service stacks and setting up CI/CD.",
        ],
      },
      {
        title: "Full Stack Developer",
        short: "Full Stack Dev",
        icon: "server",
        owns: ["UI", "State", "API", "DB"],
        focus: "Features end to end",
        period: "2025",
        summary: "Owned features from the interface to the database.",
        stack: ["Next.js", "NestJS", "PostgreSQL"],
        responsibilities: [
          "Shipped full features across Next.js frontends and NestJS APIs.",
          "Introduced shared patterns for forms, tables and loading states.",
        ],
      },
      {
        title: "React Developer",
        short: "React Dev",
        icon: "layout",
        owns: ["UI", "State"],
        focus: "Production React applications",
        period: "2023 — 2025",
        summary: "Built and maintained production React applications.",
        stack: ["React", "TypeScript", "Tailwind CSS"],
        responsibilities: [
          "Delivered responsive, accessible interfaces for client products.",
          "Improved page speed and state handling on data-heavy screens.",
        ],
      },
      {
        title: "React Intern",
        icon: "user",
        owns: ["UI"],
        focus: "Components and bug fixes",
        period: "2023",
        summary: "Started with components and bug fixes, then small features.",
        stack: ["React"],
        responsibilities: ["Learned the codebase by fixing real issues and shipping small features."],
      },
    ],
  },

  // SAMPLE
  impact: {
    label: "Impact",
    title: "What the work changed.",
    intro: "The number that moved, and the system it moved in.",
    numbers: [
      { value: "100", unit: "+", label: "screens on one shared component system", tone: "accent" },
      { value: "45", label: "API modules integrated", tone: "ok" },
      { value: "0", label: "double charges from webhook retries", tone: "sky" },
      { value: "<100", unit: "ms", label: "filtered catalogue search", tone: "violet" },
    ],
    cards: [
      {
        category: "Architecture",
        icon: "layers",
        stat: { value: "5", label: "independently deployable services" },
        title: "Microservices Decomposition & gRPC Contracts",
        text: "Split tightly coupled domain logic into independently deployable services that communicate over gRPC.",
        how: ["Strict Protobuf schemas between services.", "One gateway for auth and rate limits."],
        seenIn: "Ride Dispatch",
      },
      {
        category: "Performance",
        icon: "zap",
        stat: { value: "3", label: "cache roles: catalogue, sessions, locks" },
        title: "Query Optimization & Redis Caching",
        text: "Improved read latency on high-traffic screens with caching and indexes that match the queries.",
        how: ["Measured slow queries first.", "Cached catalogue reads with clear invalidation."],
        seenIn: "Parts Market",
      },
      {
        category: "Integrations",
        icon: "network",
        stat: { value: "100%", label: "webhooks signature-checked and idempotent" },
        title: "Resilient Webhooks & Payment Lifecycles",
        text: "Payment ingestion that survives network drops, provider retries and duplicate events.",
        how: ["Signature-checked every webhook.", "Idempotency keys on every write."],
        seenIn: "Ledger Pay",
      },
      {
        category: "Product development",
        icon: "boxes",
        stat: { value: "1", label: "table and form system behind every screen" },
        title: "One Component System Across 100+ Screens",
        text: "Shared tables, forms and loading states so every screen behaves the same way.",
        how: ["One table and form primitive for every list page.", "One rule for loaders and skeletons."],
        seenIn: "FieldTrack360",
      },
      {
        category: "AI engineering",
        icon: "sparkles",
        stat: { value: "100%", label: "of writes go through typed tools" },
        title: "Deterministic Tool Calling & RAG",
        text: "Connected generative models to schema-validated databases and booking APIs.",
        how: ["Typed tool definitions only.", "No free-text writes to the database."],
        seenIn: "Trip Planner",
      },
      {
        category: "Real time",
        icon: "radio",
        stat: { value: "2", label: "socket connections: main and tracking" },
        title: "Live Location Over WebSockets",
        text: "Live team locations on a map, updated without redrawing the whole screen.",
        how: ["Separate socket connection for tracking.", "Updates applied per marker."],
        seenIn: "FieldTrack360",
      },
    ],
  },

  resume: {
    title: "Prefer the one-page version?",
    facts: [
      { text: "Intern to engineer", icon: "layout" },
      { text: "Production systems", icon: "boxes" },
      { text: "NestJS · PostgreSQL · Redis · AI", icon: "server" },
      { text: "Open to relocation", icon: "send" },
    ],
  },

  contact: {
    label: "Contact",
    title: "Have a difficult engineering problem? *Let's build the system behind it.*",
    intro:
      "Scaling a backend, wiring AI into real transactions, or hiring a full-stack engineer who owns features end to end.",
    topics: [
      { label: "Backend architecture", icon: "server", subject: "Engineering Discussion: Backend Architecture" },
      { label: "Full-stack role", icon: "briefcase", subject: "Opportunity: Full-Stack Role" },
      { label: "Microservices / gRPC", icon: "boxes", subject: "Engineering Discussion: Microservices" },
      { label: "FinTech webhooks", icon: "receipt", subject: "Engineering Discussion: Payments & Webhooks" },
      { label: "AI, RAG & tools", icon: "chat", subject: "Engineering Discussion: AI Features" },
      { label: "Something else", icon: "mail", subject: "Hello" },
    ],
  },
};
