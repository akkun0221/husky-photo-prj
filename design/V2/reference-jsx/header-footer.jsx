// HEADER & FOOTER — V2+ aesthetic
// MemorialHeader / MemorialFooter の置き換え案。
// Sticky バー（マーキー下に常駐する direction/year tabs）とは別の、
// ページ最上部のブランドヘッダ + 最下部のフッタ。

// `current` で current page をハイライト。'top' | 'lives' | 'members' | null
function MemorialHeaderV2({ current = "top", compact = false }) {
  const items = [
    { key: "top", href: "/", label: "top" },
    { key: "lives", href: "/lives", label: "lives" },
    { key: "members", href: "/members", label: "members" },
  ];
  return (
    <header
      style={{
        position: "relative",
        zIndex: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: compact ? "14px 24px" : "22px 64px",
        borderBottom: "1px solid var(--rule)",
        background: "rgba(10,8,7,0.92)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Left — brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* tape-tilted accent square */}
        <div
          style={{
            width: 10,
            height: 10,
            background: "var(--accent)",
            transform: "rotate(-12deg)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
            flex: "0 0 auto",
          }}
        />
        <a
          href="/"
          style={{
            textDecoration: "none",
            color: "var(--fg)",
            display: "inline-flex",
            alignItems: "baseline",
            gap: 4,
          }}
        >
          <span
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: compact ? 22 : 28,
              letterSpacing: "-0.02em",
            }}
          >
            husky
          </span>
          <span
            style={{
              fontFamily: "var(--type)",
              fontSize: compact ? 11 : 13,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "var(--sub)",
              transform: "translateY(-2px)",
              display: "inline-block",
            }}
          >
            photo
          </span>
        </a>
        <a
          href="/login"
          aria-label="管理画面"
          style={{
            color: "var(--sub)",
            display: "inline-flex",
            alignItems: "center",
            marginLeft: 4,
          }}
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
        </a>
      </div>

      {/* Right — nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: compact ? 4 : 6,
        }}
      >
        {items.map((it, i) => {
          const active = current === it.key;
          return (
            <a
              key={it.key}
              href={it.href}
              style={{
                position: "relative",
                padding: compact ? "6px 10px" : "8px 14px",
                textDecoration: "none",
                color: active ? "#1a120a" : "var(--fg)",
                background: active ? "var(--accent)" : "transparent",
                border:
                  "1px solid " + (active ? "var(--accent)" : "var(--rule)"),
                fontFamily: "var(--type)",
                fontSize: compact ? 11 : 12,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 0.6}deg)`,
                transition: "background .2s, color .2s",
              }}
            >
              {it.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}

function MemorialFooterV2({ compact = false }) {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 2,
        display: "grid",
        gridTemplateColumns: compact ? "1fr" : "1fr auto 1fr",
        alignItems: "center",
        gap: compact ? 14 : 0,
        padding: compact ? "24px" : "28px 64px",
        borderTop: "1px solid var(--rule)",
        background: "rgba(10,8,7,0.92)",
        color: "var(--sub)",
        fontFamily: "var(--mono)",
        fontSize: 11,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        textAlign: compact ? "center" : "left",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          justifyContent: compact ? "center" : "flex-start",
        }}
      >
        <span
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 16,
            color: "var(--fg)",
            letterSpacing: "-0.01em",
            textTransform: "none",
          }}
        >
          husky
        </span>
        <span style={{ opacity: 0.7 }}>photo · 2022 — 2026</span>
      </div>

      <div
        style={{
          fontFamily: "var(--type)",
          fontSize: 12,
          letterSpacing: "0.5em",
          color: "var(--accent)",
          textAlign: "center",
        }}
        className="mem-flicker"
      >
        ── thank you ──
      </div>

      <a
        href="/login"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          justifySelf: compact ? "center" : "end",
          color: "var(--sub)",
          textDecoration: "none",
        }}
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
      </a>
    </footer>
  );
}

// プレビュー用 — Header + ページコンテンツ本体 + Footer を縦並びに。
// 「ヘッダーの下からもうトップ／一覧／メンバーの内容が始まる」状態を見せる。
function HeaderFooterPreview({ current, mobile = false }) {
  const Page =
    current === "lives"
      ? mobile
        ? LivesIndexMobile
        : LivesIndexDesktop
      : current === "members"
        ? mobile
          ? MembersPageMobile
          : MembersPageDesktop
        : mobile
          ? MobileV2Plus
          : V2PlusScrapbookPinned;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#120a06",
      }}
    >
      <MemorialHeaderV2 current={current} compact={mobile} />
      {/* ページ本体 — \u81ea\u8eab\u3067 .mem-root\uff08overflow scroll\uff09\u3092\u4ed8\u3051\u3066\u304f\u308b\u306e\u3067\n          \u3053\u3053\u306f\u305f\u3060\u9ad8\u3055\u3092\u6e21\u3059\u30b3\u30f3\u30c6\u30ca\u3060\u3051 */}
      <div style={{ flex: "1 1 auto", minHeight: 0, position: "relative" }}>
        <Page />
      </div>
      <MemorialFooterV2 compact={mobile} />
    </div>
  );
}

Object.assign(window, {
  MemorialHeaderV2,
  MemorialFooterV2,
  HeaderFooterPreview,
});
