import Link from "next/link";

const NAV: { href: string; label: string; active?: boolean }[] = [
  { href: "/", label: "top", active: true },
  { href: "/lives", label: "lives" },
  { href: "/members", label: "members" },
];

export function MemorialHeader() {
  return (
    <header
      className="relative flex items-center justify-between border-b px-16 py-8"
      style={{
        borderColor: "var(--memorial-rule)",
        background: "var(--memorial-bg)",
      }}
    >
      <div className="flex items-center gap-3">
        {/* accent dot */}
        <div
          className="h-2 w-2 flex-shrink-0"
          style={{ background: "var(--memorial-accent)" }}
        />
        <Link
          href="/"
          className="text-lg font-semibold tracking-wider"
          style={{
            color: "var(--memorial-fg)",
            fontFamily: "var(--font-geist-sans), sans-serif",
            letterSpacing: "0.04em",
          }}
        >
          husky&nbsp;photo
        </Link>
        <Link
          href="/login"
          aria-label="管理画面"
          style={{ color: "var(--memorial-sub)" }}
          className="ml-1 flex items-center"
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
        </Link>
      </div>

      <nav className="flex gap-10">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-xs font-medium tracking-[0.32em] uppercase transition-colors"
            style={{
              color: item.active ? "var(--memorial-fg)" : "var(--memorial-sub)",
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
