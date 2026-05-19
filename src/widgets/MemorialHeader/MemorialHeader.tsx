"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", key: "top", label: "top" },
  { href: "/lives", key: "lives", label: "lives" },
  { href: "/members", key: "members", label: "members" },
] as const;

export function MemorialHeader() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header
      className="relative flex items-center justify-between px-4 py-4 sm:px-16 sm:py-5"
      style={{
        borderBottom: "1px solid var(--memorial-rule)",
        background: "rgba(10,8,7,0.92)",
        backdropFilter: "blur(8px)",
        zIndex: 6,
      }}
    >
      {/* Left — brand */}
      <div className="flex items-center gap-3">
        {/* tape-tilted 琥珀□ */}
        <div
          style={{
            width: 10,
            height: 10,
            background: "var(--memorial-accent)",
            transform: "rotate(-12deg)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
            flexShrink: 0,
          }}
        />
        <Link
          href="/"
          className="inline-flex items-baseline gap-1 no-underline"
        >
          <span
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: "-0.02em",
              color: "var(--memorial-fg)",
            }}
          >
            husky
          </span>
          <span
            style={{
              fontFamily: "var(--type)",
              fontSize: 12,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "var(--memorial-sub)",
              transform: "translateY(-2px)",
              display: "inline-block",
            }}
          >
            photo
          </span>
        </Link>
        <Link
          href="/login"
          aria-label="管理画面"
          className="ml-1 flex items-center"
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
        </Link>
      </div>

      {/* Right — tape-tilt nav */}
      <nav className="flex items-center gap-1.5 sm:gap-2">
        {NAV.map((item, i) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: "7px 12px",
                textDecoration: "none",
                color: active ? "#1a120a" : "var(--memorial-fg)",
                background: active ? "var(--memorial-accent)" : "transparent",
                border: `1px solid ${active ? "var(--memorial-accent)" : "var(--memorial-rule)"}`,
                fontFamily: "var(--type)",
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 0.6}deg)`,
                transition: "background .2s, color .2s",
                display: "inline-block",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
