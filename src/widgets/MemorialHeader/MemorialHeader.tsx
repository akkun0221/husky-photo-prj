"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "top" },
  { href: "/lives", label: "lives" },
  { href: "/members", label: "members" },
];

export function MemorialHeader() {
  const pathname = usePathname();

  // /lives/[id] のような子パスも /lives としてアクティブ判定する
  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header
      className="relative flex items-center justify-between border-b px-4 py-4 sm:px-16 sm:py-8"
      style={{
        borderColor: "var(--memorial-rule)",
        background: "rgba(10,8,7,0.92)",
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
          className="text-base font-semibold tracking-wider sm:text-lg"
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

      <nav className="flex gap-5 sm:gap-10">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-[10px] font-medium tracking-[0.2em] uppercase transition-colors sm:text-xs sm:tracking-[0.32em]"
            style={{
              color: isActive(item.href)
                ? "var(--memorial-fg)"
                : "var(--memorial-sub)",
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
