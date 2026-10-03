import { portfolio } from "@/config/portfolio";

export function Footer({ year }: { year: number }) {
  const { person, links } = portfolio;
  const link = "transition-colors duration-200 hover:text-ink";

  return (
    <footer className="border-t border-line py-10 text-sm text-muted">
      <div className="shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="text-lg text-ink">{person.name}</span>
          <span className="ml-3 text-xs text-faint">© {year} · designed and built with Next.js &amp; Tailwind</span>
        </p>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {links.map((item) => (
            <a key={item.url} href={item.url} target="_blank" rel="noreferrer" className={link}>
              {item.label}
            </a>
          ))}
          <a href={person.resumeUrl} target="_blank" rel="noreferrer" className={link}>
            Resume
          </a>
          <a href="#top" className={link}>
            Back to top ↑
          </a>
        </nav>
      </div>
    </footer>
  );
}
