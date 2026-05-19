import Link from "next/link";

export function MemorialFooter() {
  return (
    <footer
      className="grid grid-cols-1 items-center gap-4 px-4 py-6 text-center sm:grid-cols-3 sm:gap-0 sm:px-16 sm:py-7 sm:text-left"
      style={{
        borderTop: "1px solid var(--memorial-rule)",
        background: "rgba(10,8,7,0.92)",
        color: "var(--memorial-sub)",
        fontFamily: "var(--mono)",
        fontSize: 11,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        zIndex: 2,
        position: "relative",
      }}
    >
      {/* Left */}
      <div className="flex items-center justify-center gap-3 sm:justify-start">
        <span
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 15,
            color: "var(--memorial-fg)",
            letterSpacing: "-0.01em",
            textTransform: "none",
          }}
        >
          husky
        </span>
        <span style={{ opacity: 0.7 }}>photo · 2022 — 2026</span>
      </div>

      {/* Center */}
      <div
        className="mem-flicker text-center"
        style={{
          fontFamily: "var(--type)",
          fontSize: 12,
          letterSpacing: "0.5em",
          color: "var(--memorial-accent)",
        }}
      >
        ── thank you ──
      </div>

      {/* Right */}
      <Link
        href="/login"
        className="inline-flex items-center justify-center gap-2 no-underline sm:justify-end"
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
