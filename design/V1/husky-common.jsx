// husky-common.jsx
// アーカイブサイト用 — 写真家による husky の記録

const HUSKY = {
  brand: "husky photo",
  tagline: "a photographer’s archive of husky · since 2022.12.10",
  era: "2022 — 2026",
  archiveStart: "2022.12.10",
  finalDate: "2026.04.27",
  // メンバー — 名前は仮置き(プレースホルダー)。実データで差し替え
  members: [
    { id: "m01", role: "Vo.", name: "— vo.", shots: 412 },
    { id: "m02", role: "Gt.", name: "— gt.", shots: 386 },
    { id: "m03", role: "Ba.", name: "— ba.", shots: 294 },
    { id: "m04", role: "Dr.", name: "— dr.", shots: 351 },
    { id: "m05", role: "Key.", name: "— key.", shots: 268 },
  ],
  // 撮影してきたライブ — 2022.12.10 から 2026.04.27 まで (新しい順)
  // 仮データ。本番では CMS / DB から取得
  lives: [
    {
      id: "l13",
      date: "2026.04.27",
      weekday: "MON",
      venue: "BIGCAT",
      city: "大阪",
      count: 89,
      final: true,
      title: "解散ワンマンライブ",
      note: "最後の音、最後の光。",
    },
    {
      id: "l12",
      date: "2026.01.24",
      weekday: "SAT",
      venue: "NAMBA HATCH",
      city: "大阪",
      count: 47,
    },
    {
      id: "l11",
      date: "2025.10.18",
      weekday: "SAT",
      venue: "CLUB CITTA",
      city: "川崎",
      count: 39,
    },
    {
      id: "l10",
      date: "2025.07.12",
      weekday: "SAT",
      venue: "LIQUIDROOM",
      city: "恵比寿",
      count: 64,
    },
    {
      id: "l09",
      date: "2025.04.05",
      weekday: "SAT",
      venue: "Zepp DiverCity",
      city: "東京",
      count: 71,
    },
    {
      id: "l08",
      date: "2024.12.21",
      weekday: "SAT",
      venue: "O-EAST",
      city: "渋谷",
      count: 56,
    },
    {
      id: "l07",
      date: "2024.08.31",
      weekday: "SAT",
      venue: "Shimokita SHELTER",
      city: "下北沢",
      count: 28,
    },
    {
      id: "l06",
      date: "2024.05.19",
      weekday: "SUN",
      venue: "WWW X",
      city: "渋谷",
      count: 42,
    },
    {
      id: "l05",
      date: "2024.02.10",
      weekday: "SAT",
      venue: "CLUB QUATTRO",
      city: "梅田",
      count: 38,
    },
    {
      id: "l04",
      date: "2023.09.30",
      weekday: "SAT",
      venue: "O-NEST",
      city: "渋谷",
      count: 35,
    },
    {
      id: "l03",
      date: "2023.06.24",
      weekday: "SAT",
      venue: "BASEMENT BAR",
      city: "下北沢",
      count: 24,
    },
    {
      id: "l02",
      date: "2023.03.18",
      weekday: "SAT",
      venue: "Shibuya CYCLONE",
      city: "渋谷",
      count: 19,
    },
    {
      id: "l01",
      date: "2022.12.10",
      weekday: "SAT",
      venue: "CLUB GOODMAN",
      city: "秋葉原",
      count: 16,
      first: true,
      note: "はじめてシャッターを切った日。",
    },
  ],
};

// 斜線プレースホルダー (写真ホルダー)
function StripePlaceholder({
  label,
  w = "100%",
  h = "100%",
  tone = "light",
  style = {},
  children,
  ratio,
}) {
  const dark = tone === "dark";
  const bg = dark ? "#1a1614" : "#e6dfd0";
  const stripe = dark ? "rgba(255,255,255,.035)" : "rgba(0,0,0,.05)";
  const txt = dark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.42)";
  return (
    <div
      style={{
        width: w,
        height: h,
        position: "relative",
        backgroundColor: bg,
        backgroundImage: `repeating-linear-gradient(135deg, transparent 0 14px, ${stripe} 14px 15px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: txt,
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        fontSize: 10,
        letterSpacing: ".1em",
        textTransform: "uppercase",
        ...(ratio ? { aspectRatio: ratio } : null),
        ...style,
      }}
    >
      {children || <span>[ {label} ]</span>}
    </div>
  );
}

// 縦長ポートレート用
function PortraitPlaceholder({ name, role, tone = "light", style = {} }) {
  const dark = tone === "dark";
  const bg = dark ? "#1a1614" : "#d8d1c1";
  const stripe = dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)";
  const txt = dark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.5)";
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: bg,
        backgroundImage: `repeating-linear-gradient(180deg, transparent 0 8px, ${stripe} 8px 9px)`,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: 12,
        color: txt,
        fontFamily: "ui-monospace, monospace",
        fontSize: 10,
        letterSpacing: ".12em",
        ...style,
      }}
    >
      <div style={{ opacity: 0.55 }}>[ {role} ]</div>
      <div style={{ fontSize: 13, marginTop: 2 }}>{name}</div>
    </div>
  );
}

// 鍵アイコン (admin/管理者ログイン用)
function LockIcon({ size = 11, color = "currentColor" }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 11 13" fill="none">
      <rect x="1" y="6" width="9" height="6.5" stroke={color} strokeWidth="1" />
      <path d="M3 6V3.5a2.5 2.5 0 0 1 5 0V6" stroke={color} strokeWidth="1" />
    </svg>
  );
}

// 矢印
function Arrow({ size = 12, color = "currentColor" }) {
  return (
    <svg width={size * 2} height={size} viewBox="0 0 24 12" fill="none">
      <path d="M0 6h22M16 1l6 5-6 5" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

Object.assign(window, {
  HUSKY,
  StripePlaceholder,
  PortraitPlaceholder,
  LockIcon,
  Arrow,
});
