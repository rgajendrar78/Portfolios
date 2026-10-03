"use client";

export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-line-strong px-2.5 text-sm font-medium whitespace-nowrap text-ink transition-colors duration-200 hover:border-accent hover:text-accent sm:px-3.5"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4 transition-transform duration-500 group-hover:-rotate-12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden
      >
        <path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z" strokeLinejoin="round" />
      </svg>
      {/* Both labels render; CSS shows one, so there is no hydration mismatch. */}
      <span className="max-sm:sr-only dark:hidden">Dark mode</span>
      <span className="hidden max-sm:sr-only dark:inline">Light mode</span>
    </button>
  );
}
