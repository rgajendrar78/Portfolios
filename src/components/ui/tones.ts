import type { Tone } from "@/types/portfolio";

/** Text colour for each tone; pair it with `bg-current` to colour a shape. */
export const TONE_TEXT: Record<Tone, string> = {
  accent: "text-accent",
  ok: "text-ok",
  sky: "text-sky",
  violet: "text-violet",
  neutral: "text-body",
};

/** The same tones as CSS values, for inline styles. */
export const toneColor = (tone: Tone) => (tone === "neutral" ? "var(--body)" : `var(--${tone})`);
