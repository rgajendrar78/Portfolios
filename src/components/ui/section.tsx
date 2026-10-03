import type { ReactNode } from "react";
import type { SectionCopy } from "@/types/portfolio";

/** Renders "plain *italic* plain" with the starred part in italics. */
export function Emphasis({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split("*").map((part, index) =>
        index % 2 ? (
          <em key={index} className={className}>
            {part}
          </em>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function Section({
  id,
  index,
  copy,
  emphasisClassName,
  children,
}: {
  id: string;
  index: string;
  copy: SectionCopy;
  emphasisClassName?: string;
  children: ReactNode;
}) {
  return (
    <section id={id}>
      <div className="hatch relative h-10" aria-hidden>
        <div className="absolute inset-y-0 left-1/2 flex -translate-x-1/2 flex-col items-center">
          <span className="h-px w-2.5 bg-ok/60" />
          <span className="w-px flex-1 bg-ok/40" />
          <span className="rounded border border-ok/40 bg-bg px-1.5 text-3xs leading-4 text-ok tabular-nums">
            {index}
          </span>
          <span className="w-px flex-1 bg-ok/40" />
          <span className="h-px w-2.5 bg-ok/60" />
        </div>
      </div>
      <div className="shell py-14 sm:py-16">
        <header className="reveal grid gap-y-4 md:grid-cols-12 md:gap-x-8">
          <p className="label md:col-span-3 md:pt-3">
            <span className="text-accent">{index}</span>
            <span className="mx-2 text-faint">/</span>
            {copy.label}
          </p>
          <div className="md:col-span-9">
            <h2 className="heading">
              <Emphasis text={copy.title} className={emphasisClassName} />
            </h2>
            <p className="mt-5 max-w-2xl text-[0.9375rem] leading-relaxed text-body sm:text-base">{copy.intro}</p>
          </div>
        </header>
        <div className="mt-10 sm:mt-12">{children}</div>
      </div>
    </section>
  );
}
