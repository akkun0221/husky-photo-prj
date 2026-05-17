import Link from "next/link";

export function MemorialFooter() {
  return (
    <footer
      className="flex flex-col items-center gap-3 px-4 py-5 font-mono text-[11px] tracking-[0.3em] uppercase sm:flex-row sm:justify-between sm:gap-0 sm:px-16 sm:py-7"
      style={{
        borderTop: "1px solid var(--memorial-rule)",
        background: "rgba(10,8,7,0.92)",
        color: "var(--memorial-sub)",
      }}
    >
      <span>husky photo · 2022 — 2026</span>
      <span
        className="tracking-[0.5em]"
        style={{ color: "var(--memorial-accent)" }}
      >
        ── thank you ──
      </span>
      <Link
        href="/login"
        className="inline-flex items-center gap-2 no-underline transition-opacity hover:opacity-70"
        style={{ color: "var(--memorial-sub)" }}
      >
        <svg
          width="11"
          height="13"
          viewBox="0 0 11 13"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="1"
            y="6"
            width="9"
            height="6.5"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M3 6V3.5a2.5 2.5 0 0 1 5 0V6"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
        admin
      </Link>
    </footer>
  );
}
