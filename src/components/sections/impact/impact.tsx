import { Icon } from "@/components/ui/icon";
import { TONE_TEXT } from "@/components/ui/tones";
import { portfolio } from "@/config/portfolio";
import { stagger } from "@/lib/motion";

/** A count draws that many squares; a percentage draws a ring. */
function Stat({ value, label }: { value: string; label: string }) {
  const percent = value.endsWith("%") ? Number.parseFloat(value) : null;
  const count = Number(value);
  const caption = <p className="text-2xs leading-snug text-muted">{label}</p>;

  if (percent !== null) {
    return (
      <div className="flex items-center gap-4">
        <span className="relative grid size-[4.25rem] shrink-0 place-items-center text-lg text-ink tabular-nums">
          <svg viewBox="0 0 36 36" aria-hidden className="absolute inset-0 -rotate-90">
            <circle cx="18" cy="18" r="16" fill="none" strokeWidth="2.5" className="stroke-line" />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              pathLength="100"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="0 100"
              className="stroke-ok transition-[stroke-dasharray] duration-[1400ms] ease-out group-data-[in]:[stroke-dasharray:var(--fill)]"
              style={{ "--fill": `${Math.min(percent, 100)} 100` }}
            />
          </svg>
          {value}
        </span>
        {caption}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-5xl leading-none text-ink tabular-nums">{value}</span>
      <div className="min-w-0 flex-1">
        {Number.isInteger(count) && count > 0 && count <= 12 && (
          <div aria-hidden className="mb-2 flex flex-wrap gap-1.5">
            {Array.from({ length: count }, (_, index) => (
              <span
                key={index}
                className="size-3.5 scale-0 rounded-[4px] border border-accent/60 bg-accent/20 opacity-0 transition-all duration-500 group-data-[in]:scale-100 group-data-[in]:opacity-100"
                style={{ transitionDelay: `${150 + index * 110}ms` }}
              />
            ))}
          </div>
        )}
        {caption}
      </div>
    </div>
  );
}

export function Impact() {
  const { numbers, cards } = portfolio.impact;

  return (
    <>
      {/* The gaps show the darker backing as hairlines; a short last row stretches to fill. */}
      <dl className="reveal group card flex flex-wrap gap-px overflow-hidden rounded-lg bg-line">
        {numbers.map((item, index) => (
          <div
            key={item.label}
            className="relative min-w-0 flex-1 basis-[calc(50%-1px)] bg-raised p-5 max-[24rem]:basis-full sm:p-6 lg:basis-56"
          >
            <dt className="sr-only">{item.label}</dt>
            <dd className={`text-5xl leading-none whitespace-nowrap tabular-nums sm:text-6xl ${TONE_TEXT[item.tone]}`}>
              {item.value}
              {item.unit && <span className="text-3xl sm:text-4xl">{item.unit}</span>}
            </dd>
            <dd className="mt-3 text-md leading-snug text-muted">{item.label}</dd>
            <span
              aria-hidden
              className={`absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-current transition-transform duration-[1400ms] ease-out group-data-[in]:scale-x-100 ${TONE_TEXT[item.tone]}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            />
          </div>
        ))}
      </dl>

      <ul className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <li
            key={card.title}
            className="reveal group card card-hover flex flex-col rounded-lg p-6 hover:-translate-y-0.5"
            style={stagger(index, 3)}
          >
            <p className="flex items-center gap-2 text-2xs tracking-wider text-accent uppercase">
              <Icon name={card.icon} className="size-5 transition-transform duration-300 group-hover:-translate-y-px" />
              {card.category}
            </p>
            <div className="mt-5 rounded-md border border-line bg-bg/60 p-4">
              <Stat {...card.stat} />
            </div>
            <h3 className="mt-5 text-2xl leading-snug text-ink">{card.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-body">{card.text}</p>
            <details className="group/how mt-4">
              <summary className="cursor-pointer text-2xs text-muted transition-colors duration-200 hover:text-ink">
                <span className="group-open/how:hidden">+ how ({card.how.length})</span>
                <span className="hidden group-open/how:inline">− how</span>
              </summary>
              <ul className="space-y-2 pt-3 text-[0.84375rem] leading-relaxed text-muted">
                {card.how.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span aria-hidden className="text-faint">
                      –
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </details>
            <p className="mt-auto pt-5 text-[0.71875rem] leading-relaxed text-muted">
              <span className="block border-t border-line pt-4">
                <span className="text-faint">seen in</span> {card.seenIn}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
