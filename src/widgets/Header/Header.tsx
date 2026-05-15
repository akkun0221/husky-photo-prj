import Link from "next/link";

const navItems = [
  { href: "/", label: "トップ" },
  { href: "/lives", label: "ライブ" },
  { href: "/members", label: "メンバー" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-lg font-bold tracking-tight">
            husky photo
          </Link>
          <Link href="/login" aria-label="管理画面へ">
            🔒
          </Link>
        </div>
        <nav className="flex gap-4 text-sm font-medium text-zinc-600">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-zinc-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
