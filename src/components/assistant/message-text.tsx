import type { ReactNode } from "react";

const TOKEN_PATTERN = /(\[[^\]]+\]\((?:https?:\/\/|mailto:)[^)\s]+\)|\*\*[^*]+\*\*|`[^`]+`|https?:\/\/[^\s)]+|mailto:[^\s)]+)/g;
const MD_LINK_PATTERN = /^\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^)\s]+)\)$/;

/**
 * Safe inline formatter for assistant replies: renders **bold**, `code`, and links
 * using React elements only (never `dangerouslySetInnerHTML`).
 */
export function MessageText({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5 break-words">
      {lines.map((line, lineIndex) => {
        const trimmed = line.trim();
        const isBullet = /^[-*]\s+/.test(trimmed);
        const content = isBullet ? trimmed.replace(/^[-*]\s+/, "") : line;

        if (!trimmed) {
          return <div key={lineIndex} className="h-1" aria-hidden />;
        }

        const rendered = renderInlineTokens(content);
        if (isBullet) {
          return (
            <p key={lineIndex} className="flex gap-2 pl-1">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
              <span className="min-w-0 flex-1">{rendered}</span>
            </p>
          );
        }

        return <p key={lineIndex}>{rendered}</p>;
      })}
    </div>
  );
}

function renderInlineTokens(text: string): ReactNode[] {
  const parts = text.split(TOKEN_PATTERN);
  return parts.map((part, index) => {
    if (!part) return null;

    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-medium text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={index}
          className="rounded border border-line bg-bg px-1 py-0.5 text-[0.78em] text-ink"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    const mdLink = part.match(MD_LINK_PATTERN);
    if (mdLink) {
      const [, label, url] = mdLink;
      return (
        <a
          key={index}
          href={url}
          target={url.startsWith("mailto:") ? undefined : "_blank"}
          rel={url.startsWith("mailto:") ? undefined : "noreferrer noopener"}
          className="underline decoration-accent/60 underline-offset-2 transition-colors hover:text-accent"
        >
          {label}
        </a>
      );
    }

    if (part.startsWith("https://") || part.startsWith("http://") || part.startsWith("mailto:")) {
      const cleanUrl = part.replace(/[.,;!?]+$/, "");
      const trailing = part.slice(cleanUrl.length);
      return (
        <span key={index}>
          <a
            href={cleanUrl}
            target={cleanUrl.startsWith("mailto:") ? undefined : "_blank"}
            rel={cleanUrl.startsWith("mailto:") ? undefined : "noreferrer noopener"}
            className="underline decoration-accent/60 underline-offset-2 transition-colors hover:text-accent"
          >
            {cleanUrl.replace(/^mailto:/, "")}
          </a>
          {trailing}
        </span>
      );
    }

    return part;
  });
}
