import type { Portfolio } from "@/types/portfolio";

/**
 * THE ONLY FILE YOU EDIT.
 *
 * Every word, link, colour and list on the site is read from here.
 * Configured for Gajendra Singh — Full Stack Software Engineer.
 */
export const portfolio: Portfolio = {
  site: {
    url: "https://gajendra-singh.dev",
    title: "Gajendra Singh — Full Stack Software Engineer | NestJS, React.js, PostgreSQL",
    description:
      "Portfolio of Gajendra Singh, a Full Stack Software Engineer with 3+ years of experience across 12+ projects, building SaaS and enterprise platforms with NestJS, React.js, Next.js, TypeScript, PostgreSQL, microservices, gRPC, and AWS.",
    keywords: [
      "Gajendra Singh",
      "Full Stack Software Engineer",
      "Software Engineer",
      "NestJS Developer",
      "React.js Developer",
      "Next.js Developer",
      "TypeScript",
      "PostgreSQL",
      "MongoDB",
      "Microservices",
      "gRPC",
      "Redis",
      "AWS",
      "Docker",
      "Cashfree",
      "Razorpay",
      "Stripe",
    ],
  },

  person: {
    name: "Gajendra Singh",
    tagline: "Software Engineer, Ahmedabad",
    role: "Full Stack Software Engineer",
    company: "Devstree",
    location: "Ahmedabad, Gujarat, India",
    timeZone: "UTC+5:30 (IST)",
    email: "rgajendrar@gmail.com",
    resumeUrl: "https://drive.google.com/file/d/1GO6pGtOOmQffzyfcIFmWD5Jfic2o2E9x/view?usp=sharing",
    careerStart: "2023-05-01",
    status: "Open to new roles",
    relocation: "Open to relocation",
    workMode: "Remote, Hybrid, On-site",
  },

  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/gajendra-singh-software-engineer" },
    { label: "GitHub", url: "https://github.com/rgajendrar78" },
    { label: "+91 7828203667", url: "tel:+917828203667" },
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
      "I build *distributed backends|real-time dashboards|gRPC microservices*, *payment flows|audited ledgers|order pipelines* that don't double-charge, and *AI features|AI assistants|agent prompt pipelines* that don't make things up.",
    footnotes: [
      { text: "NestJS · gRPC · Docker · Redis", icon: "boxes", tone: "accent" },
      { text: "3 payment gateways · ACID ledger", icon: "receipt", tone: "ok" },
      { text: "LLM tools · real-time sockets", icon: "cpu", tone: "sky" },
    ],
    // The diagram under the hero: one request per project, drawn from these names.
    trace: {
      label: "Trace · follow one request",
      requests: [
        {
          project: "FieldTracking360",
          caption: "FieldTracking360 · Live team map",
          source: "Admin app",
          gateway: "NestJS API",
          services: ["Auth", "Attendance", "Tracking"],
          stores: ["Postgres", "MongoDB", "Socket.IO"],
          spans: [
            { label: "token + RBAC check", from: 0, to: 12, tone: "violet" },
            { label: "team scope lookup", from: 10, to: 34, tone: "accent" },
            { label: "GPS location query", from: 28, to: 65, tone: "accent" },
            { label: "WebSocket broadcast", from: 55, to: 82, tone: "ok" },
            { label: "marker update", from: 80, to: 100, tone: "sky" },
          ],
          result: "map updates per marker, no full redraw",
        },
        {
          project: "Prompt Studio AI",
          caption: "Prompt Studio AI · Blueprint generation",
          source: "Web IDE",
          gateway: "Gateway",
          services: ["Doc Parser", "LLM Agent", "Collab Hub"],
          stores: ["Postgres", "WebSocket"],
          spans: [
            { label: "parse PRD document", from: 0, to: 15, tone: "violet" },
            { label: "agent reasoning", from: 12, to: 48, tone: "accent" },
            { label: "schema validation", from: 45, to: 68, tone: "ok" },
            { label: "real-time sync", from: 65, to: 86, tone: "sky" },
            { label: "stream prototype", from: 84, to: 100, tone: "violet" },
          ],
          result: "interactive prototype and agent prompt ready",
        },
        {
          project: "Ride-Sharing Platform",
          caption: "Ride-Sharing · Booking a ride",
          source: "Rider app",
          gateway: "Nginx",
          services: ["Ride Svc", "Driver Svc", "Payment"],
          stores: ["Redis", "Postgres"],
          spans: [
            { label: "auth + rate limit", from: 0, to: 12, tone: "violet" },
            { label: "create booking", from: 10, to: 88, tone: "accent" },
            { label: "match driver (gRPC)", from: 18, to: 55, tone: "accent" },
            { label: "lock driver in Redis", from: 24, to: 48, tone: "ok" },
            { label: "Cashfree authorize", from: 50, to: 80, tone: "ok" },
            { label: "notify rider & driver", from: 78, to: 98, tone: "sky" },
          ],
          result: "one driver assigned, no double booking",
        },
      ],
    },
  },

  work: {
    label: "Selected work",
    title: "Case studies from *production*, not side projects.",
    intro:
      "Systems shipped across enterprise SaaS, distributed microservices, and AI platforms with real constraints behind each one.",
    filters: {
      "Full Stack": { tone: "sky", icon: "layout" },
      Backend: { tone: "accent", icon: "server" },
      Microservices: { tone: "accent", icon: "boxes" },
      AI: { tone: "violet", icon: "cpu" },
      SaaS: { tone: "sky", icon: "cloud" },
      Enterprise: { tone: "violet", icon: "shield" },
    },
    projects: [
      {
        name: "FieldTracking360",
        subtitle: "Field Force Management Platform",
        category: "Full Stack",
        tone: "sky",
        icon: "layout",
        tags: ["Full Stack", "Microservices", "SaaS", "Enterprise"],
        period: "2025–Present",
        description:
          "Enterprise SaaS platform tracking field force operations live with visit history, expense management, multi-level approvals, RBAC, and Cashfree payments.",
        facts: [
          { label: "Scale", icon: "layers", value: "100+ screens, 45 API modules" },
          { label: "Real time", icon: "radio", value: "Live GPS via Google Maps & MongoDB" },
          { label: "Security & Flow", icon: "shield", value: "RBAC & multi-level expense approvals" },
        ],
        hardPart:
          "Handling high-frequency GPS coordinate writes alongside relational data while rendering real-time marker updates on Google Maps without full redraws.",
        stack: [
          "NestJS",
          "React.js",
          "PostgreSQL",
          "MongoDB",
          "gRPC",
          "Cashfree",
          "Google Maps API",
          "TypeScript",
          "Tailwind CSS",
          "Socket.IO",
        ],
        caseStudy: {
          problem:
            "Enterprise field operations were fragmented across disjointed tools, manual spreadsheets, and calls. Managers had zero live visibility into field locations, and expense reconciliation suffered from lost receipts and delayed approvals.",
          architecture:
            "A Next.js/React frontend communicates with a NestJS backend over REST and gRPC. PostgreSQL stores core business records and user hierarchies, while MongoDB efficiently handles high-write-volume GPS tracking history, connected with Google Maps APIs and WebSockets.",
          flow: [
            "Field agent checks in and begins route tracking on mobile device",
            "High-frequency GPS telemetry streams into NestJS ingestion gateway",
            "MongoDB stores location logs while Google Maps API resolves coordinates",
            "Socket.IO pushes marker coordinates to the manager's live dashboard",
            "Agent submits field expense claims with receipts for verification",
            "Multi-level approval workflow triggers Cashfree payment disbursement",
          ],
          components: [
            {
              name: "Live Map Engine",
              role: "Renders marker movements incrementally without redrawing",
              tech: "Google Maps API · Socket.IO",
            },
            {
              name: "Dual-Database Layer",
              role: "MongoDB for GPS time-series; PostgreSQL for ACID records",
              tech: "PostgreSQL · MongoDB",
            },
            {
              name: "Approval Workflow",
              role: "Configurable multi-level gates for visits and expenses",
              tech: "NestJS · RBAC",
            },
            {
              name: "Payment Gateway",
              role: "Automated expense payouts and vendor settlements",
              tech: "Cashfree · Webhooks",
            },
            {
              name: "Shared Component System",
              role: "Consistent data table, filter, and form system across 100+ screens",
              tech: "React · TypeScript",
            },
          ],
          outcome:
            "Delivered an enterprise-grade platform uniting tracking, expenses, visits, and payments across 100+ screens with 45 API modules.",
          takeaway:
            "Separating high-velocity telemetry (MongoDB) from transactional ledgers (Postgres) prevents database bottlenecks as field teams scale.",
        },
      },
      {
        name: "Prompt Studio AI",
        subtitle: "AI Project Generation Platform",
        category: "AI",
        tone: "violet",
        icon: "cpu",
        tags: ["AI", "Full Stack", "Backend"],
        period: "2025–2026",
        description:
          "AI platform that converts requirement documents into plans, interactive prototypes, backend architectures, and agent-executable prompts with real-time multi-developer collaboration.",
        facts: [
          { label: "AI Architecture", icon: "cpu", value: "LLM APIs with typed tool schemas" },
          { label: "Collaboration", icon: "chat", value: "WebSocket real-time multi-developer sync" },
          { label: "Output", icon: "braces", value: "Instant interactive prototype & agent prompts" },
        ],
        hardPart:
          "Translating ambiguous PRDs into deterministic system specifications and interactive prototypes while keeping multi-user state synchronized in real time.",
        stack: [
          "NestJS",
          "Next.js",
          "TypeScript",
          "LLM APIs",
          "WebSocket",
          "PostgreSQL",
          "Zod",
          "Tailwind CSS",
        ],
        caseStudy: {
          problem:
            "Building software from requirement documents normally requires weeks of back-and-forth between product managers, UI designers, and backend architects before a single line of working code is written.",
          architecture:
            "A Next.js frontend with real-time WebSocket channels connects to a NestJS backend orchestrated with LLM APIs. Structured prompts and typed Zod schemas ensure generated outputs conform to strict executable standards.",
          flow: [
            "User uploads or writes system requirement document in editor",
            "LLM pipeline parses user stories, entities, and business constraints",
            "System synthesizes a structured blueprint, data model, and API endpoints",
            "Interactive UI prototype is generated for live stakeholder testing",
            "Multiple developers modify flows collaboratively via WebSockets",
            "Platform compiles an optimized, deterministic prompt for AI agents to generate code",
          ],
          components: [
            {
              name: "Requirement Parser",
              role: "Extracts entities, roles, and constraints from free text",
              tech: "LLM APIs · Prompt Engineering",
            },
            {
              name: "Schema Compiler",
              role: "Validates generated models against strict schemas",
              tech: "Zod · TypeScript",
            },
            {
              name: "Real-Time Collaboration",
              role: "Broadcasts multi-user canvas changes instantly",
              tech: "WebSocket · NestJS",
            },
            {
              name: "Prototype Renderer",
              role: "Interactively renders generated mockups and user flows",
              tech: "Next.js · React",
            },
          ],
          outcome:
            "Reduced the path from idea to functional prototype and agent-ready code from days to minutes with zero hallucinated schemas.",
          takeaway:
            "Strict schema guardrails allow LLMs to be creative in reasoning while keeping resulting code generation reliable and deterministic.",
        },
      },
      {
        name: "Ride-Sharing Platform",
        subtitle: "Rider & Driver Distributed Services",
        category: "Microservices",
        tone: "accent",
        icon: "boxes",
        tags: ["Microservices", "Backend"],
        period: "2024–2025",
        description:
          "Distributed ride-hailing backend featuring independently deployable microservices over gRPC, real-time driver tracking, and concurrent dispatch locks.",
        facts: [
          { label: "Inter-service", icon: "server", value: "Binary gRPC over HTTP/2" },
          { label: "Real time", icon: "radio", value: "WebSocket driver location broadcast" },
          { label: "Infrastructure", icon: "container", value: "Docker Compose & Nginx gateway" },
        ],
        hardPart:
          "Preventing race conditions and double bookings when hundreds of riders concurrently request drivers in the same geographical zone.",
        stack: [
          "NestJS",
          "PostgreSQL",
          "Redis",
          "gRPC / Protobuf",
          "WebSocket",
          "Docker",
          "Nginx",
        ],
        caseStudy: {
          problem:
            "A monolithic ride-sharing system faced lock contention, stale driver location reads, and cascading failures during peak commute traffic spikes.",
          architecture:
            "Domain logic decomposed into discrete microservices (Auth, Ride, Driver, Payment, Notification) behind an Nginx reverse proxy. Services communicate via high-performance binary gRPC.",
          flow: [
            "Rider requests pickup; Nginx gateway validates JWT and rate limit",
            "Ride service creates booking record in PostgreSQL",
            "Driver service queries Redis geospatial index for nearest active drivers",
            "Distributed Redis lock secures the chosen driver, avoiding race conditions",
            "WebSocket gateway pushes instant ride confirmation to rider and driver",
          ],
          components: [
            {
              name: "API Gateway",
              role: "TLS termination, routing, JWT auth, and rate limiting",
              tech: "Nginx · NestJS",
            },
            {
              name: "Ride Service",
              role: "Booking lifecycle, fares, and state transitions",
              tech: "NestJS · PostgreSQL",
            },
            {
              name: "Driver Service",
              role: "Geospatial indexing and availability locks",
              tech: "NestJS · Redis",
            },
            {
              name: "gRPC Transport",
              role: "Low-latency binary communication between microservices",
              tech: "gRPC · Protobuf",
            },
          ],
          outcome:
            "Achieved sub-50ms dispatch times with guaranteed zero double-bookings under concurrent booking surges.",
          takeaway:
            "Combining gRPC for synchronous inter-service calls with Redis distributed locks provides clean isolation without database lock contention.",
        },
      },
      {
        name: "WorkForce",
        subtitle: "Configurable Workforce Management Platform",
        category: "Full Stack",
        tone: "sky",
        icon: "layout",
        tags: ["Full Stack", "Backend", "SaaS"],
        period: "2023–2024",
        description:
          "Enterprise workforce operations hub with a dynamic form builder, custom job cards, task delegation, execution tracking, and workflow approvals.",
        facts: [
          { label: "Form Engine", icon: "wrench", value: "Dynamic drag-and-drop form builder" },
          { label: "Workflows", icon: "layers", value: "Multi-level approval pipelines" },
          { label: "Security", icon: "shield", value: "Strict role-based access control (RBAC)" },
        ],
        hardPart:
          "Designing a flexible JSON-schema-backed form builder supporting complex validation rules, conditional logic, and arbitrary approval hierarchies.",
        stack: [
          "React.js",
          "TypeScript",
          "Node.js",
          "Express.js",
          "MongoDB",
          "RBAC",
          "Tailwind CSS",
        ],
        caseStudy: {
          problem:
            "Organizations required distinct operational workflows, job cards, and verification steps for different job sites, creating a need for customized forms without redeploying code.",
          architecture:
            "A React frontend featuring an intuitive schema builder backed by Node.js/Express REST APIs and MongoDB for flexible document storage.",
          flow: [
            "Administrator designs custom job card forms using dynamic field builder",
            "Validation schemas and approval gates are saved to MongoDB",
            "Supervisors assign tasks and job cards to field technicians",
            "Technicians complete checkpoints and submit real-time completion proof",
            "Workflow engine routes submission through configured approval stages",
          ],
          components: [
            {
              name: "Dynamic Form Builder",
              role: "Configures inputs, validation, and conditional branches",
              tech: "React · TypeScript",
            },
            {
              name: "Workflow Engine",
              role: "State machine routing approvals between roles",
              tech: "Node.js · Express.js",
            },
            {
              name: "Document Store",
              role: "Stores polymorphic form schemas and submission records",
              tech: "MongoDB",
            },
            {
              name: "RBAC Guard",
              role: "Restricts access based on organizational hierarchies",
              tech: "JWT · Express Middleware",
            },
          ],
          outcome:
            "Allowed operational teams to roll out new departmental workflows and job cards in minutes instead of waiting for engineering sprint cycles.",
          takeaway:
            "Building on top of JSON schema standards gives end users flexibility while maintaining structured, reliable data validation.",
        },
      },
      {
        name: "Family",
        subtitle: "Social Media Platform",
        category: "Full Stack",
        tone: "ok",
        icon: "chat",
        tags: ["Full Stack", "Backend"],
        period: "2023–2024",
        description:
          "Full-featured social networking platform with multimedia feed streaming, likes, comments, follows, Redis feed caching, and location-based push notifications.",
        facts: [
          { label: "Media Pipeline", icon: "cloud", value: "AWS S3 storage with signed upload URLs" },
          { label: "Caching", icon: "zap", value: "Redis cache for hot timelines & session stores" },
          { label: "Push Alerts", icon: "radio", value: "FCM location-based push notifications" },
        ],
        hardPart:
          "Aggregating and paginating chronological and social feeds efficiently under high engagement without running heavy multi-table joins on every request.",
        stack: [
          "Next.js",
          "NestJS",
          "PostgreSQL",
          "Redis",
          "AWS S3",
          "Firebase Cloud Messaging (FCM)",
          "TypeORM",
        ],
        caseStudy: {
          problem:
            "Social feeds suffer from degrading response times as user follower graphs and post volumes expand, causing slow timeline rendering and high server load.",
          architecture:
            "A Next.js web application paired with a NestJS backend. PostgreSQL manages social graphs and posts, Redis caches hot feeds, and AWS S3 hosts media via pre-signed URLs.",
          flow: [
            "User posts media content; client uploads directly to S3 via pre-signed URL",
            "NestJS records metadata in PostgreSQL and publishes to follower feeds",
            "Redis invalidates and warms active timeline caches",
            "Followers receive instant location-based push notifications via FCM",
            "Users interact with posts via real-time comments and likes",
          ],
          components: [
            {
              name: "Feed Generator",
              role: "Generates timeline reads with Redis caching",
              tech: "NestJS · Redis",
            },
            {
              name: "Media Uploader",
              role: "Secure, direct-to-S3 uploads with pre-signed URLs",
              tech: "AWS S3 SDK",
            },
            {
              name: "Push Notification Svc",
              role: "Dispatches location-targeted alerts to users",
              tech: "Firebase Cloud Messaging",
            },
            {
              name: "Social Graph API",
              role: "Manages follower connections, likes, and comments",
              tech: "PostgreSQL · TypeORM",
            },
          ],
          outcome:
            "Delivered responsive timeline scrolling with sub-100ms load times and reliable media delivery.",
          takeaway:
            "Offloading media uploads directly to S3 with signed URLs protects API servers from bandwidth bottlenecks.",
        },
      },
    ],
    alsoBuilt: [
      {
        name: "Payment Gateway Engine",
        subtitle: "Multi-Provider (Razorpay, Cashfree, Stripe) Checkout & Webhook Ledger",
        period: "2025",
      },
      {
        name: "GeoAlerts Service",
        subtitle: "Location-Based Push Notification & Alert Dispatcher via FCM",
        period: "2024",
      },
      {
        name: "Portside Logistics",
        subtitle: "Port Operations & Supply Chain Tracking SaaS",
        period: "2023–2024",
      },
    ],
  },

  about: {
    label: "About",
    title: "I care about the whole request, *not just my layer of it.*",
    intro:
      "Full Stack Software Engineer with 3+ years of experience across 12+ projects, building SaaS and enterprise platforms. Rather than stopping at UI components or isolated database queries, I design for the full lifecycle: API contracts, concurrency, data integrity, security boundaries, and cloud observability.",
    layers: [
      {
        name: "Frontend",
        icon: "layout",
        sketch: "ui",
        tone: "sky",
        text: "Responsive web apps with Next.js & React, TanStack Query caching, Zustand state, and Tailwind CSS / Shadcn UI.",
        tools: ["React.js", "Next.js", "TypeScript", "Tailwind CSS"],
      },
      {
        name: "Backend",
        icon: "server",
        sketch: "tree",
        tone: "accent",
        text: "Modular NestJS & Express microservices, dependency injection, gRPC protocols, and RESTful API design.",
        tools: ["Node.js", "NestJS", "Express.js", "gRPC"],
      },
      {
        name: "Database",
        icon: "database",
        sketch: "table",
        tone: "ok",
        text: "PostgreSQL relational schemas, ACID transactions, MongoDB document storage, and Redis caching layers.",
        tools: ["PostgreSQL", "MongoDB", "Redis", "TypeORM"],
      },
      {
        name: "Cloud & DevOps",
        icon: "cloud",
        sketch: "grid",
        tone: "violet",
        text: "10+ AWS services (EC2, S3, RDS, ECS, Lambda, SQS, SES), Docker containers, Nginx reverse proxy, and CI/CD pipelines.",
        tools: ["AWS", "Docker", "Nginx", "CI/CD"],
      },
      {
        name: "AI & Integrations",
        icon: "cpu",
        sketch: "chat",
        tone: "violet",
        text: "LLM API pipelines, prompt engineering, Google Maps APIs, and payment gateways (Razorpay, Cashfree, Stripe).",
        tools: ["LLM Integration", "Prompt Engineering", "WebSockets", "Payment APIs"],
      },
    ],
    request: {
      label: "A request, top to bottom",
      text: "The layers I own from user interaction to database commit. Watch one pass, or inspect a layer.",
      layers: [
        {
          name: "Client",
          detail: "React.js · Next.js · TypeScript · Tailwind CSS",
          title: "Client apps & state",
          tools: ["React.js", "Next.js", "TanStack Query", "Zustand"],
          text: "Typed interfaces, reusable component systems, and client state synchronized with server queries.",
          icon: "laptop",
          tone: "sky",
        },
        {
          name: "Gateway",
          detail: "Nginx · NestJS Ingress · OAuth / JWT",
          title: "API gateway & ingress",
          tools: ["Nginx", "JWT", "OAuth", "Rate limits", "RBAC"],
          text: "Secure ingress: TLS termination, token verification, rate limiting, and RBAC authorization before any service runs.",
          icon: "shield",
          tone: "violet",
        },
        {
          name: "Services",
          detail: "NestJS · gRPC · Microservices · Message Queues",
          title: "Services & domain logic",
          tools: ["NestJS", "gRPC / Protobuf", "BullMQ", "Socket.IO"],
          text: "Domain logic partitioned into modular services communicating over high-speed binary gRPC or async queues.",
          icon: "boxes",
          tone: "accent",
        },
        {
          name: "Storage",
          detail: "PostgreSQL · MongoDB · Redis",
          title: "Data & caching",
          tools: ["PostgreSQL", "MongoDB", "Redis", "TypeORM"],
          text: "Normalized schemas, ACID transactions, MongoDB geo-spatial records, and Redis caching that cut query times by 30%.",
          icon: "database",
          tone: "ok",
        },
        {
          name: "Cloud",
          detail: "AWS (10+ Services) · Docker · CI/CD",
          title: "Infrastructure & cloud",
          tools: ["AWS EC2", "AWS S3", "AWS ECS", "Docker", "CI/CD"],
          text: "Containerized deployments on AWS with automated CI/CD pipelines, managed RDS, and S3 media storage.",
          icon: "cloud",
          tone: "neutral",
        },
      ],
      aside: {
        name: "AI & Realtime",
        detail: "LLMs · Tool schemas · WebSockets",
        title: "AI & real-time collaboration",
        text: "LLM agents reason and parse PRDs into structured schemas, handing off deterministic calls over WebSockets and REST.",
        tools: ["LLM APIs", "Zod Validation", "WebSockets"],
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
      "Six engineering standards that guide every platform I build: understand the problem, design the contracts, build maintainable code, measure performance, automate repetitive tasks, and ship reliably.",
    quote:
      "Good engineering starts with understanding domain constraints, failure cases, and real user workflows. Code written before that usually solves the wrong problem.",
    steps: [
      {
        title: "Start with domain constraints",
        icon: "search",
        text: "Deconstruct business requirements and edge cases before writing code.",
        detail:
          "Map entity lifecycles, permissions, failure modes, and user journeys before drafting schemas or API routes.",
      },
      {
        title: "Design explicit contracts",
        icon: "compass",
        text: "Define gRPC protobufs, DTOs, and database models first.",
        detail:
          "Strict contracts between client and server, or between microservices, prevent runtime bugs and enable parallel team velocity.",
      },
      {
        title: "Build for maintainability",
        icon: "wrench",
        text: "Clean architecture, modular separation, and readable code.",
        detail:
          "Small single-responsibility modules, dependency injection, and reusable components that make adding features seamless.",
      },
      {
        title: "Measure & optimize bottlenecks",
        icon: "gauge",
        text: "Profile slow database queries and network round-trips.",
        detail:
          "Analyze execution plans, add strategic indexes, and introduce Redis caching where it actually moves the needle (like our 30% latency cut).",
      },
      {
        title: "Automate delivery & environments",
        icon: "repeat",
        text: "Containerize multi-service stacks with Docker and CI/CD.",
        detail:
          "Docker Compose for consistent local development, automated lint and test workflows, and reproducible cloud deployments.",
      },
      {
        title: "Ship, observe & iterate",
        icon: "rocket",
        text: "Deploy production-ready code with monitoring and feedback loops.",
        detail:
          "Roll out features incrementally, monitor logs and error rates, and incorporate feedback from real users.",
      },
    ],
  },

  ai: {
    label: "Applied AI",
    title: "The model reasons. *The backend decides.*",
    intro:
      "I build AI-powered applications where generative reasoning hands off to deterministic, schema-validated backend transactions. A model can draft an architecture, generate an interactive prototype, or suggest actions, but strict backend validation enforces correctness.",
    path: [
      {
        step: "User",
        icon: "user",
        note: "intent",
        zone: "model",
        detail: "Free text requirement or document input.",
        example: '"Field team tracking with Cashfree payouts"',
      },
      {
        step: "Session",
        icon: "phone",
        note: "context",
        zone: "model",
        detail: "Session authenticates user role, workspace, and permissions.",
        example: "workspace #108 · role: architect",
      },
      {
        step: "Prompt",
        icon: "lock",
        note: "guardrails",
        zone: "model",
        detail: "System prompt limits output to valid component tokens and schemas.",
        example: "never output free-form code without validation",
      },
      {
        step: "RAG",
        icon: "database",
        note: "retrieval",
        zone: "model",
        detail: "Relevant architectural patterns and DTO schemas retrieved from store.",
        example: "microservice auth & Cashfree webhook pattern",
      },
      {
        step: "LLM",
        icon: "cpu",
        note: "reasoning",
        zone: "model",
        detail: "Model reasons over requirements and proposes tool call.",
        example: "propose: compile_blueprint",
      },
      {
        step: "Tool call",
        icon: "braces",
        note: "schema gate",
        zone: "backend",
        detail: "Strict Zod / DTO gate validates the payload before execution.",
        example: "{ services: ['Auth', 'Tracking'], db: 'Postgres' }",
      },
      {
        step: "Backend",
        icon: "server",
        note: "NestJS · DB",
        zone: "backend",
        detail: "Backend commits valid blueprint and streams real-time updates.",
        example: "INSERT INTO blueprints … RETURNING id",
      },
      {
        step: "Action",
        icon: "check",
        note: "committed",
        zone: "backend",
        detail: "Interactive prototype rendered and agent prompt generated.",
        example: "blueprint #204 deployed to preview",
      },
    ],
    capabilities: [
      {
        title: "LLM APIs & Prompt Engineering",
        icon: "cpu",
        text: "Building pipelines with structured prompts, multi-turn dialogs, and automated evaluation for reliable application generation.",
      },
      {
        title: "Strict Tool & Function Calling",
        icon: "braces",
        text: "Rigid Zod and DTO schemas for tool invocations, ensuring model proposals conform to backend contracts before touching databases.",
      },
      {
        title: "Real-Time WebSocket Synchronization",
        icon: "radio",
        text: "Bi-directional WebSocket streaming so multiple developers can collaborate on AI-generated prototypes simultaneously.",
      },
      {
        title: "AI + Transactional Backends",
        icon: "server",
        text: "Wiring generative workflows into PostgreSQL and Redis transactional operations, guaranteeing zero invalid states.",
      },
    ],
    replay: [
      {
        project: "Prompt Studio AI",
        ask: "Turn PRD document into a microservices architecture and interactive prototype.",
        steps: [
          {
            label: "Reason",
            icon: "cpu",
            text: "Extracts system entities, user roles, API endpoints, and event workflows.",
          },
          {
            label: "Retrieve",
            icon: "database",
            text: "Matches standard component templates and schema definitions.",
          },
          {
            label: "Typed tool",
            icon: "braces",
            text: "compile_blueprint(entities, routes, state_machine) passes Zod validation.",
          },
          {
            label: "Backend",
            icon: "server",
            text: "Emits editable prototype and agent prompts over WebSocket.",
          },
        ],
        result: "Interactive prototype ready with zero hallucinated database columns.",
        chips: ["WebSocket sync", "0 invalid schemas"],
      },
      {
        project: "FieldTracking360",
        ask: "Optimize route visit order and detect mileage anomalies.",
        steps: [
          {
            label: "Reason",
            icon: "cpu",
            text: "Evaluates scheduled client visits against real-time traffic and GPS history.",
          },
          {
            label: "Retrieve",
            icon: "database",
            text: "Pulls agent location coordinates from MongoDB and visit records from Postgres.",
          },
          {
            label: "Typed tool",
            icon: "braces",
            text: "optimize_route(agent_id, visit_list) passes validation.",
          },
          {
            label: "Backend",
            icon: "server",
            text: "Updates dispatcher map and notifies field agent via WebSocket.",
          },
        ],
        result: "Optimized visit sequence dispatched to mobile app.",
        chips: ["GPS telemetry", "instant dispatch"],
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
            name: "React.js",
            daily: true,
            note: "Component-driven interfaces, custom hooks, and predictable state across complex screens.",
          },
          {
            name: "Next.js",
            daily: true,
            note: "App Router, server components, and static generation for high-performance SaaS.",
          },
          {
            name: "TypeScript",
            daily: true,
            note: "Strict typing end-to-end, catching contract breakages at compile time rather than runtime.",
          },
          {
            name: "Tailwind CSS & Shadcn UI",
            daily: true,
            note: "Design tokens, accessible primitives, and consistent UI styling across enterprise dashboards.",
          },
          {
            name: "TanStack Query",
            daily: true,
            note: "Server-state caching, automatic refetching, and optimistic mutations for responsive data views.",
          },
          {
            name: "Zustand",
            note: "Lightweight client state management for UI preferences, modals, and local filters.",
          },
          {
            name: "Zod",
            daily: true,
            note: "Runtime schema validation for form submissions, API payloads, and LLM tool calling.",
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
            note: "Enterprise TypeScript framework with dependency injection, guards, interceptors, and modular architecture.",
          },
          {
            name: "Node.js",
            daily: true,
            note: "Event loop, asynchronous I/O, streams, and worker threads for high-throughput network services.",
          },
          {
            name: "Express.js",
            note: "Lightweight, battle-tested HTTP middleware for microservices and API gateways.",
          },
          {
            name: "REST APIs",
            daily: true,
            note: "Resource-oriented endpoints with standardized error formats, pagination, and OpenAPI docs.",
          },
          {
            name: "Microservices & gRPC",
            daily: true,
            note: "High-performance binary RPCs over HTTP/2 with strongly-typed Protobuf contracts.",
          },
          {
            name: "WebSocket & Socket.IO",
            daily: true,
            note: "Bi-directional real-time communication for live GPS tracking, notifications, and collaborative editing.",
          },
          {
            name: "Message Queues (BullMQ / SQS)",
            note: "Background job processing, asynchronous email/SMS notifications, and scheduled workflows.",
          },
        ],
      },
      {
        category: "Databases",
        icon: "database",
        tone: "ok",
        side: "build",
        tools: [
          {
            name: "PostgreSQL",
            daily: true,
            note: "Relational data modeling, ACID transactions, complex joins, and JSONB document columns.",
          },
          {
            name: "Redis",
            daily: true,
            note: "In-memory caching, distributed locks, rate limiting, and pub/sub channels that cut latency by 30%.",
          },
          {
            name: "MongoDB",
            daily: true,
            note: "Document storage for high-frequency GPS tracking telemetry, visit history, and flexible schemas.",
          },
          {
            name: "TypeORM",
            daily: true,
            note: "Database ORM with entity relationships, migrations, and transactional query runners.",
          },
          {
            name: "Query Optimization",
            daily: true,
            note: "EXPLAIN ANALYZE profiling, composite B-tree indexes, and connection pool tuning.",
          },
        ],
      },
      {
        category: "AI & Integrations",
        icon: "sparkles",
        tone: "violet",
        side: "build",
        tools: [
          {
            name: "LLM APIs & Integration",
            daily: true,
            note: "Orchestrating model reasoning into structured SaaS features and automated project builders.",
          },
          {
            name: "Prompt Engineering",
            daily: true,
            note: "Structured guardrails, system instructions, and schema-constrained output generation.",
          },
          {
            name: "Payment Gateways",
            daily: true,
            note: "Integrating Razorpay, Cashfree, and Stripe with HMAC signature verification and idempotent ledgers.",
          },
          {
            name: "Google Maps API",
            daily: true,
            note: "Geocoding, route mapping, distance matrix calculation, and live marker tracking.",
          },
          {
            name: "Firebase Cloud Messaging (FCM)",
            note: "Targeted push notifications, topic subscriptions, and location-triggered alerts.",
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
            daily: true,
            note: "Compute instances configured with security groups, load balancing, and auto-recovery.",
          },
          {
            name: "AWS S3",
            daily: true,
            note: "Secure media and asset storage using pre-signed upload URLs and lifecycle policies.",
          },
          {
            name: "AWS RDS & ElastiCache",
            daily: true,
            note: "Managed PostgreSQL database instances with read replicas and Redis caching nodes.",
          },
          {
            name: "AWS Lambda",
            note: "Serverless functions triggered by S3 events, queues, or cron schedules.",
          },
          {
            name: "AWS ECS & ECR",
            note: "Container registry and managed cluster execution for microservice workloads.",
          },
          {
            name: "AWS SQS & SES",
            note: "Decoupled message queues and transactional email delivery pipelines.",
          },
        ],
      },
      {
        category: "DevOps & Security",
        icon: "container",
        tone: "accent",
        side: "run",
        tools: [
          {
            name: "Docker & Docker Compose",
            daily: true,
            note: "Multi-stage container builds ensuring consistency across local dev, staging, and production.",
          },
          {
            name: "Nginx",
            daily: true,
            note: "Reverse proxy, SSL/TLS termination, gzip compression, and rate limiting in front of APIs.",
          },
          {
            name: "CI/CD & Git",
            daily: true,
            note: "Automated linting, testing, and deployment pipelines using GitHub Actions.",
          },
          {
            name: "JWT & OAuth",
            daily: true,
            note: "Stateless session authentication, token refresh rotation, and third-party login providers.",
          },
          {
            name: "RBAC (Role-Based Access)",
            daily: true,
            note: "Fine-grained permission hierarchies enforced on backend routes and synced to UI gates.",
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
            name: "System Design & SaaS Architecture",
            daily: true,
            note: "Designing resilient multi-tenant SaaS platforms that scale predictably under load.",
          },
          {
            name: "Microservices Decomposition",
            daily: true,
            note: "Partitioning monoliths into bounded contexts communicating via gRPC and message brokers.",
          },
          {
            name: "API Gateway Pattern",
            daily: true,
            note: "Unified ingress handling authentication, traffic routing, and DDoS rate protection.",
          },
          {
            name: "Event-Driven Systems",
            daily: true,
            note: "Asynchronous pub/sub patterns ensuring core request paths remain non-blocking.",
          },
        ],
      },
    ],
  },

  experience: {
    label: "Experience",
    title: "From foundation to scale, *engineering production systems.*",
    intro:
      "Devstree and Precious Infosystem, May 2023 to present. Designing resilient microservices, high-throughput APIs, and enterprise SaaS platforms.",
    stats: [
      { value: "12+", label: "projects delivered" },
      { value: "10+", label: "AWS cloud services" },
      { value: "30%", label: "API latency reduction" },
    ],
    layers: ["UI", "State", "API", "DB", "Infra", "AI"],
    roles: [
      {
        title: "Software Engineer – Full Stack",
        short: "Devstree",
        icon: "boxes",
        owns: ["UI", "State", "API", "DB", "Infra", "AI"],
        focus: "Enterprise SaaS, Microservices & Payments",
        period: "Jan 2025 — Present",
        summary:
          "Leading end-to-end delivery of enterprise SaaS platforms, high-throughput gRPC microservices, payment integrations, real-time tracking, and AWS cloud architecture.",
        stack: [
          "NestJS",
          "React.js",
          "PostgreSQL",
          "MongoDB",
          "gRPC",
          "Docker",
          "Redis",
          "AWS",
          "Cashfree",
          "Razorpay",
          "Stripe",
        ],
        responsibilities: [
          "Owned end-to-end delivery of FieldTracking360, an enterprise SaaS field force platform.",
          "Built REST APIs and microservices over gRPC for FieldTracking360 and ride-sharing with NestJS, Docker, and Nginx.",
          "Integrated 3 payment gateways (Razorpay, Cashfree, Stripe) for payment and transaction workflows.",
          "Secured APIs with JWT, OAuth, and RBAC; added WebSocket real-time updates and FCM push notifications.",
          "Used 10+ AWS services, including S3, EC2, ECS, Lambda, SQS, and SES, for storage, queues, email, and deployment.",
          "Optimized PostgreSQL queries and added Redis caching, reducing API response time by 30%.",
          "Led backend development, API and database design, and code reviews; mentored junior developers.",
        ],
      },
      {
        title: "Software Engineer",
        short: "Precious Infosys",
        icon: "server",
        owns: ["UI", "State", "API", "DB"],
        focus: "Full Stack Web Apps & Configurable Workflows",
        period: "May 2023 — Dec 2024",
        summary:
          "Engineered scalable full-stack web applications, dynamic workforce management modules, and social media platforms with Redis caching and AWS S3 media storage.",
        stack: [
          "React.js",
          "TypeScript",
          "Node.js",
          "Express.js",
          "MongoDB",
          "PostgreSQL",
          "Redis",
          "AWS S3",
          "Tailwind CSS",
        ],
        responsibilities: [
          "Developed full stack web apps with React.js, TypeScript, Node.js, and Express.js, with REST APIs and RBAC.",
          "Built reusable UI components using clean architecture and scalable frontend patterns.",
          "Built a social media platform with Redis caching, AWS S3 media storage, and location-based push alerts.",
          "Built configurable workforce modules, including job cards and a dynamic form builder with workflow approvals.",
          "Integrated third-party APIs and built notification and reporting modules in Agile/Scrum teams.",
        ],
      },
    ],
  },

  impact: {
    label: "Impact",
    title: "What the work changed.",
    intro: "Measurable results delivered across production systems and high-throughput architectures.",
    numbers: [
      {
        value: "30",
        unit: "%",
        label: "reduction in API response time via Redis & indexing",
        tone: "accent",
      },
      {
        value: "100",
        unit: "+",
        label: "screens delivered on FieldTracking360 platform",
        tone: "ok",
      },
      {
        value: "3",
        label: "payment gateways (Razorpay, Cashfree, Stripe) integrated",
        tone: "sky",
      },
      {
        value: "10",
        unit: "+",
        label: "AWS services powering storage, queues & deploy",
        tone: "violet",
      },
    ],
    cards: [
      {
        category: "Microservices",
        icon: "boxes",
        stat: { value: "gRPC", label: "binary protocol between microservices" },
        title: "Microservices Decomposition & gRPC Contracts",
        text: "Decomposed monolithic domain logic into independently deployable microservices communicating via low-latency gRPC over HTTP/2.",
        how: [
          "Strict Protobuf schema contracts between services.",
          "Nginx gateway handling auth, TLS termination, and rate limiting.",
        ],
        seenIn: "FieldTracking360 & Ride-Sharing",
      },
      {
        category: "Performance",
        icon: "zap",
        stat: { value: "30%", label: "faster API latency across endpoints" },
        title: "Query Optimization & Redis Caching",
        text: "Optimized complex PostgreSQL queries, created targeted composite indexes, and implemented Redis caching on high-frequency read paths.",
        how: [
          "Analyzed slow queries using EXPLAIN ANALYZE.",
          "Introduced Redis caching with deterministic TTL and invalidation.",
        ],
        seenIn: "FieldTracking360",
      },
      {
        category: "FinTech & Payments",
        icon: "receipt",
        stat: { value: "3", label: "payment gateways integrated" },
        title: "Multi-Gateway Integration & Resilient Webhooks",
        text: "Integrated Razorpay, Cashfree, and Stripe for seamless checkout, automated payout disbursements, and idempotent webhook reconciliation.",
        how: [
          "HMAC signature verification on every incoming webhook event.",
          "Idempotency keys and transactional ledgers to prevent double-crediting.",
        ],
        seenIn: "FieldTracking360",
      },
      {
        category: "Enterprise Scale",
        icon: "layers",
        stat: { value: "100+", label: "screens unified on shared system" },
        title: "Enterprise Component Architecture",
        text: "Constructed a centralized design system and shared component primitive for data tables, form validation, and loading skeletons across 100+ screens.",
        how: [
          "Standardized TanStack Query fetchers and mutations.",
          "Reusable data table with server-side sorting, pagination, and filters.",
        ],
        seenIn: "FieldTracking360",
      },
      {
        category: "Applied AI",
        icon: "cpu",
        stat: { value: "100%", label: "writes validated by Zod DTO gates" },
        title: "Deterministic AI Generation & Multi-User Collaboration",
        text: "Developed an AI platform that turns requirement documents into structured blueprints and interactive prototypes with real-time WebSocket sync.",
        how: [
          "Strict JSON schema gates validating LLM outputs.",
          "Bi-directional WebSocket broadcast for concurrent multi-developer editing.",
        ],
        seenIn: "Prompt Studio AI",
      },
      {
        category: "Real Time",
        icon: "radio",
        stat: { value: "Live", label: "GPS telemetry and push alerts" },
        title: "Live GPS Telemetry & Notification Engine",
        text: "Engineered real-time location tracking pipelines using Google Maps APIs, MongoDB geo-spatial records, WebSockets, and Firebase Cloud Messaging.",
        how: [
          "Streamed location coordinates updated per marker without full map redraws.",
          "Dispatched location-targeted push notifications via FCM.",
        ],
        seenIn: "FieldTracking360",
      },
    ],
  },

  resume: {
    title: "Prefer the one-page version?",
    facts: [
      { text: "MCA · Medi-Caps University", icon: "user" },
      { text: "12+ production projects", icon: "boxes" },
      { text: "NestJS · PostgreSQL · React · AWS", icon: "server" },
      { text: "Google AI Certified (2026)", icon: "sparkles" },
    ],
  },

  contact: {
    label: "Contact",
    title: "Have an engineering challenge? *Let's build the system behind it.*",
    intro:
      "Scaling backend microservices, integrating payments, wiring AI into deterministic transactions, or hiring a full-stack engineer who owns features end to end.",
    topics: [
      { label: "Full-stack role", icon: "briefcase", subject: "Opportunity: Full-Stack Role" },
      { label: "Microservices / gRPC", icon: "boxes", subject: "Engineering Discussion: Microservices" },
      { label: "Backend architecture", icon: "server", subject: "Engineering Discussion: Backend Architecture" },
      { label: "Payment integration", icon: "receipt", subject: "Engineering Discussion: Payment Gateways" },
      { label: "AI & agent tools", icon: "cpu", subject: "Engineering Discussion: AI Engineering" },
      { label: "Something else", icon: "mail", subject: "Hello Gajendra" },
    ],
  },
};
