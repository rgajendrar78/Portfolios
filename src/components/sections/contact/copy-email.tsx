"use client";

import { useState } from "react";

const RESET_MS = 2000;

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), RESET_MS);
    } catch {
      // Clipboard blocked: the address is on screen and is a mailto link.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={`text-xs transition-colors duration-200 ${copied ? "text-ok" : "text-muted hover:text-ink"}`}
    >
      {copied ? "copied" : "copy address"}
    </button>
  );
}
