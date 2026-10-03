export type ThemeMode = "light" | "dark" | "system";
export type Tone = "accent" | "ok" | "sky" | "violet" | "neutral";

/** Icons you can use in the config. Add more in src/components/icons.tsx. */
export type IconName =
  | "layout"
  | "server"
  | "database"
  | "cloud"
  | "cpu"
  | "boxes"
  | "shield"
  | "receipt"
  | "sparkles"
  | "search"
  | "compass"
  | "wrench"
  | "gauge"
  | "repeat"
  | "rocket"
  | "user"
  | "phone"
  | "lock"
  | "braces"
  | "check"
  | "pin"
  | "clock"
  | "send"
  | "laptop"
  | "mail"
  | "briefcase"
  | "layers"
  | "zap"
  | "network"
  | "radio"
  | "chat"
  | "container";

/** The small wireframe drawn at the top of an About card. */
export type Sketch = "ui" | "tree" | "table" | "grid" | "chat";

export interface Palette {
  bg: string;
  raised: string;
  tint: string;
  ink: string;
  body: string;
  muted: string;
  faint: string;
  line: string;
  lineStrong: string;
  accent: string;
  ok: string;
  sky: string;
  violet: string;
}

export interface LinkItem {
  label: string;
  url: string;
}

/** Wrap a phrase in *asterisks* to set it in italics. */
export interface SectionCopy {
  label: string;
  title: string;
  intro: string;
}

/** The long read that opens when a project card is clicked. */
export interface CaseStudy {
  problem: string;
  architecture: string;
  /** The request, step by step. */
  flow: string[];
  components: { name: string; role: string; tech: string }[];
  outcome: string;
  takeaway: string;
}

export interface Project {
  name: string;
  subtitle: string;
  category: string;
  tone: Tone;
  icon: IconName;
  /** Every category this project is filtered under. */
  tags: string[];
  period: string;
  description: string;
  facts: { label: string; value: string; icon: IconName }[];
  hardPart: string;
  stack: string[];
  link?: string;
  caseStudy: CaseStudy;
}

export interface TraceRequest {
  project: string;
  caption: string;
  source: string;
  gateway: string;
  /** Middle column of the diagram; any number from one to five. */
  services: string[];
  /** Right column of the diagram; any number from one to four. */
  stores: string[];
  /** `from` and `to` are positions on the bar, 0–100. */
  spans: { label: string; from: number; to: number; tone: Tone }[];
  result: string;
}

export interface RequestLayer {
  name: string;
  detail: string;
  title: string;
  text: string;
  tools: string[];
  icon: IconName;
  tone: Tone;
}

export interface Portfolio {
  site: {
    url: string;
    title: string;
    description: string;
    keywords: string[];
  };
  person: {
    name: string;
    tagline: string;
    role: string;
    company: string;
    location: string;
    timeZone: string;
    email: string;
    resumeUrl: string;
    /** ISO date of the first professional role; years of experience derive from it. */
    careerStart: string;
    status: string;
    relocation: string;
    workMode: string;
  };
  links: LinkItem[];
  theme: { defaultMode: ThemeMode; light: Palette; dark: Palette };
  hero: {
    /** Wrap a phrase in *asterisks* to highlight it; `*one|two|three*` rotates between them. */
    intro: string;
    /** One per highlighted phrase, in order; `tone` colours the highlight. */
    footnotes: { text: string; icon: IconName; tone: Tone }[];
    trace: { label: string; requests: TraceRequest[] };
  };
  work: SectionCopy & {
    /** Icon and colour of each filter chip, keyed by tag. */
    filters: Record<string, { tone: Tone; icon: IconName }>;
    projects: Project[];
    alsoBuilt: { name: string; subtitle: string; period: string }[];
  };
  about: SectionCopy & {
    layers: { name: string; text: string; icon: IconName; tone: Tone; sketch: Sketch; tools: string[] }[];
    request: {
      label: string;
      text: string;
      layers: RequestLayer[];
      /** Shown under a dashed line: it runs beside the layers, not between them. */
      aside: RequestLayer & { note: string };
    };
  };
  principles: SectionCopy & {
    steps: { title: string; text: string; detail: string; icon: IconName }[];
    /** Shown under the loop; leave it out to hide it. */
    quote?: string;
  };
  ai: SectionCopy & {
    path: {
      step: string;
      note: string;
      detail: string;
      example: string;
      icon: IconName;
      zone: "model" | "backend";
    }[];
    capabilities: { title: string; text: string; icon: IconName }[];
    /** One request replayed step by step, per project. */
    replay: {
      project: string;
      ask: string;
      steps: { label: string; text: string; icon: IconName }[];
      result: string;
      chips: string[];
    }[];
  };
  stack: SectionCopy & {
    groups: {
      category: string;
      icon: IconName;
      tone: Tone;
      /** `build` groups sit left of the showcase, `run` groups right of it. */
      side: "build" | "run";
      tools: { name: string; note: string; daily?: boolean }[];
    }[];
  };
  experience: SectionCopy & {
    stats: { value: string; label: string }[];
    /** Chart legend, bottom to top. Each role lists which of these it owned. */
    layers: string[];
    roles: {
      title: string;
      /** A shorter title for the chart axis. */
      short?: string;
      focus: string;
      period: string;
      icon: IconName;
      owns: string[];
      summary: string;
      stack: string[];
      responsibilities: string[];
    }[];
  };
  impact: SectionCopy & {
    numbers: { value: string; unit?: string; label: string; tone: Tone }[];
    cards: {
      category: string;
      icon: IconName;
      /** The figure in the small panel: a count draws that many squares, a percentage draws a ring. */
      stat: { value: string; label: string };
      title: string;
      text: string;
      how: string[];
      seenIn: string;
    }[];
  };
  resume: { title: string; facts: { text: string; icon: IconName }[] };
  contact: SectionCopy & { topics: { label: string; subject: string; icon: IconName }[] };
}
