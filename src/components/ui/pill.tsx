import type { ReactNode } from "react";
import type { Tone } from "@/types/portfolio";

const TONE: Record<Tone, string> = {
  accent: "border-accent/30 bg-accent/[0.07] text-accent",
  ok: "border-ok/30 bg-ok/[0.07] text-ok",
  sky: "border-sky/30 bg-sky/[0.07] text-sky",
  violet: "border-violet/30 bg-violet/[0.07] text-violet",
  neutral: "border-line-strong text-body",
};

export function Pill({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.71875rem] leading-5 whitespace-nowrap ${TONE[tone]}`}
    >
      {children}
    </span>
  );
}
