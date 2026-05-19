# 01. Design Tokens

`globals.css` の `:root` ブロックを以下に置き換えてください。
既存の `--memorial-*` 名前はそのまま維持（既存コードからの参照が壊れないように）、
値だけ V2+ 用に差し替えます。

## カラー

```css
:root {
  /* ── V2+ palette: warm sepia + amber + ember ── */
  --memorial-bg: #0c0805; /* deep warm bistre (← #0a0807) */
  --memorial-surface: #16100a; /* umber card surface */
  --memorial-fg: #f0e3c8; /* cream parchment (← #ece6d8) */
  --memorial-sub: rgba(240, 227, 200, 0.55);
  --memorial-faint: rgba(240, 227, 200, 0.08);
  --memorial-rule: rgba(240, 227, 200, 0.14); /* 罫線 */
  --memorial-accent: #d2823a; /* 琥珀 (← #c84a3a の置き換え) */
  --memorial-accent-hot: #e8a25c; /* 明るい琥珀 (highlight) */
  --memorial-ember: #b85a3a; /* sepia red — 控えめに使用 */
  --memorial-ink: #1a120a; /* ledger 紙の上で使う黒 */
  --memorial-paper: #e9dbc0; /* setlist の紙色（V4 のみ） */

  /* ── 既存フォント変数（変更なし） ── */
  --font-playfair: var(--font-playfair);
  --font-garamond: var(--font-garamond);
}
```

## フォントスタック

3 種類で完結します。次の Google Fonts を `app/layout.tsx` で読み込みます。

| 役割                     | フォント                                | weight      | スタイル | 用途                                 |
| ------------------------ | --------------------------------------- | ----------- | -------- | ------------------------------------ |
| 巨大 italic ディスプレイ | **Playfair Display**                    | 300/400/700 | italic   | 日付、ページタイトル、年号           |
| サブ display             | **Cormorant Garamond**                  | 300/500/700 | italic   | "Lives." の代替（任意）              |
| 日本語 display / body    | **Shippori Mincho** + **Noto Serif JP** | 400/600/700 | normal   | タイトル、サブテキスト               |
| 等幅（mono）             | **JetBrains Mono**                      | 300/400/600 | normal   | キャプション、メタ、CTA              |
| タイプライター           | **Special Elite**                       | 400         | normal   | 「テープ」「スタンプ」周りの装飾文言 |

```css
:root {
  --serif: "Playfair Display", "Shippori Mincho", "Noto Serif JP", serif;
  --serif-alt: "Cormorant Garamond", "Shippori Mincho", serif;
  --jp: "Shippori Mincho", "Noto Serif JP", serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;
  --type: "Special Elite", "JetBrains Mono", monospace;
}
```

Tailwind 側で対応する family を追加するなら:

```ts
// tailwind.config.ts
fontFamily: {
  serif:     ['var(--serif)'],
  'serif-alt': ['var(--serif-alt)'],
  jp:        ['var(--jp)'],
  mono:      ['var(--mono)'],
  type:      ['var(--type)'],
}
```

## グローバル CSS — 装飾レイヤー

写真フィルター、グレイン、マーキー、明滅などはユーティリティ class として
`globals.css` の末尾に追加。

```css
/* セピア＋琥珀の写真トーン */
.mem-photo {
  filter: sepia(0.32) saturate(0.95) contrast(1.08) brightness(0.86)
    hue-rotate(-6deg);
}
.mem-photo-warm {
  filter: sepia(0.48) saturate(1.05) contrast(1.1) brightness(0.82)
    hue-rotate(-8deg);
}

/* グレイン (overlay) */
.mem-grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95  0 0 0 0 0.85  0 0 0 0 0.65  0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>");
  mix-blend-mode: overlay;
  opacity: 0.45;
  z-index: 1;
}
.mem-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at 50% 30%,
    transparent 30%,
    rgba(0, 0, 0, 0.45) 100%
  );
  z-index: 1;
}

/* 公演タイトルマーキー */
.mem-marquee {
  display: flex;
  gap: 48px;
  white-space: nowrap;
  animation: mem-marquee 60s linear infinite;
}
@keyframes mem-marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

/* "rec" / "now playing" 風の明滅 */
.mem-flicker {
  animation: mem-flicker 7s steps(1, end) infinite;
}
@keyframes mem-flicker {
  0%,
  96%,
  100% {
    opacity: 1;
  }
  97% {
    opacity: 0.4;
  }
  98% {
    opacity: 1;
  }
  99% {
    opacity: 0.7;
  }
}

/* "disbanded" / "rec" の脇に脈打つ赤ドット */
.mem-pulse-dot::after {
  content: "";
  display: inline-block;
  width: 6px;
  height: 6px;
  background: var(--memorial-ember);
  border-radius: 50%;
  margin-left: 8px;
  vertical-align: middle;
  animation: mem-pulse 1.6s ease-in-out infinite;
}
@keyframes mem-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(0.7);
  }
}

/* フィルムストリップの被写体微ドリフト（用途: V1 のみ参考） */
.mem-drift-h {
  animation: mem-drift-h 30s ease-in-out infinite alternate;
}
@keyframes mem-drift-h {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-8px);
  }
}
```

## body 全体

```css
html,
body {
  background: var(--memorial-bg);
  color: var(--memorial-fg);
  font-family: "Inter", "Noto Serif JP", sans-serif; /* または既存 */
}
```

## 既存からの差分（変えた色）

| 変数                     | before               | after            | 理由                          |
| ------------------------ | -------------------- | ---------------- | ----------------------------- |
| `--memorial-bg`          | `#0a0807`            | `#0c0805`        | わずかに warmer / bistre 寄り |
| `--memorial-fg`          | `#ece6d8`            | `#f0e3c8`        | より cream パーチメント感     |
| `--memorial-accent`      | `#c84a3a` (ネオン赤) | `#d2823a` (琥珀) | 「焼け落ちた」追悼トーンへ    |
| (new) `--memorial-ember` | —                    | `#b85a3a`        | 元の赤を控えめに残す          |
| (new) `--memorial-paper` | —                    | `#e9dbc0`        | ledger / 紙ベースの上で使用   |
