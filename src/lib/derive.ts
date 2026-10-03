import { portfolio } from "@/config/portfolio";
import type { Tone } from "@/types/portfolio";

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

/** "3.5+" — rounded down to the half year, from `person.careerStart`. */
export function experienceYears(now = new Date()): string {
  const start = new Date(portfolio.person.careerStart).getTime();
  const years = Math.max(0, (now.getTime() - start) / MS_PER_YEAR);
  return `${Math.floor(years * 2) / 2}+`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const toolTones = new Map(
  portfolio.stack.groups.flatMap((group) =>
    group.tools.map((tool) => [tool.name, group.tone] as const),
  ),
);

/** A tool takes the colour of its group in `stack.groups`; unknown tools are neutral. */
export const toneOf = (tool: string): Tone => toolTones.get(tool) ?? "neutral";
