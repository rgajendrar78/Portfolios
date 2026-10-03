import { portfolio } from "@/config/portfolio";
import { stagger } from "@/lib/motion";
import { ExperienceRoles } from "./experience-roles";

export function Experience({ years }: { years: string }) {
  const stats = [{ value: years, label: `years at ${portfolio.person.company}` }, ...portfolio.experience.stats];

  return (
    <>
      <dl className="flex flex-wrap gap-3">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="reveal card card-hover min-w-0 flex-1 basis-[calc(50%-0.375rem)] rounded-lg p-5 lg:basis-48"
            style={stagger(index, 4)}
          >
            <dt className="sr-only">{stat.label}</dt>
            <dd className="text-4xl leading-none text-accent">{stat.value}</dd>
            <dd className="mt-2 text-md text-muted">{stat.label}</dd>
          </div>
        ))}
      </dl>
      <ExperienceRoles />
    </>
  );
}
