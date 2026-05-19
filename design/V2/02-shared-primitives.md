# 02. Shared Primitives

複数ページで使い回す共通コンポーネント / フック / ヘルパー。
`features/memorial/` や `widgets/MemorialShared/` あたりに置く想定。

## 2.1 `PhotoStage` — 写真スライドショー

**1枚枠の中で複数写真を独立した random タイミングで crossfade** させる。
ポラロイドフレームやフィルムストリップ枠など、`shape` で見た目を切替可能。

- `seeds: number[]` — picsum 仮置きのシード。本実装では `urls: string[]`
- `aspect: string` — `"3/2"` / `"4/5"` / `"1/1"` など
- `shape: 'rect' | 'inset' | 'polaroid' | 'filmstrip'`
- `filter: 'mem-photo' | 'mem-photo-warm'` — セピアトーン

ポイント:

- **各カードが独立に setTimeout で次の写真をスケジュール** すること。
  全カードで `setInterval` を共有しない（一斉切替になる）。
- 初回の発火タイミングも `2400–5800ms` の範囲でジッターを入れる。
- 元コードと同じく `src` は変えず、`opacity` だけ切替（フラッシュ防止）。

`useRandomSlide(count, minMs=2400, maxMs=5800)` フック側に詳細あり →
`reference-jsx/shared.jsx`。

## 2.2 `useDirection()` — 古い順 / 新しい順

URL の `?dir=reverse` を単一情報源として `forward | reverse` を返す。
`useRouter().replace` で更新。元の `MemorialClient.tsx` の実装そのまま流用 OK。

## 2.3 `useActiveYear()` — スクロール位置から active year を推定

各年セクションの `<section>` 要素を ref で渡し、スクロールコンテナの
top に最も近い年を返す。年タブハイライトに使う。

```ts
const yearRefs = YEARS.reduce((acc, y) => {
  acc[y] = useRef(null);
  return acc;
}, {});
const activeYear = useActiveYear(
  scrollRef,
  YEARS.map((y) => ({ year: y, ref: yearRefs[y] })),
);
```

## 2.4 `StickyBarScrapbook` — 共通 Sticky ナビ

ページ最上部のマーキーの下に貼り付く Sticky バー。
**Memorial / Lives / Members / LiveDetail すべて共通でこれを置く**。

構成 (左→右):

```
[ play it ] [SIDE A] [SIDE B]   |   [tape-tilted year tabs ×5]   |   [by] [member chips ×5]   |   [rec ●]
```

- 「SIDE A / SIDE B」: direction toggle (forward / reverse)
- 年タブ: マスキングテープ風に微傾き。active は琥珀塗り
- メンバーチップ: 色 swatch + 略名。slight rotate ±0.5°
- "rec" + パルス: `mem-pulse-dot` クラス

`reference-jsx/v1v2.jsx` の `StickyBarScrapbook` 関数を参照。

## 2.5 `PhotoMarquee` — 公演タイトル流れ

ヘッダーの直下に常駐する、公演タイトル＋日付＋会場のマーキー。
30 公演ぶん複製して `animation: mem-marquee 60s linear infinite` で
横スクロール。**ループは duplicate して半分の幅で動かす** こと。

```tsx
<div className="mem-marquee">
  {[...Array(2)].map((_, k) => (
    <Fragment key={k}>
      {lives.map((l) => (
        <span key={k + "-" + l.id}>
          <span style={{ color: "var(--memorial-ember)" }}>✶</span>
          {l.title}
          <span className="mono small">
            {l.date} / {l.venue}
          </span>
        </span>
      ))}
    </Fragment>
  ))}
</div>
```

## 2.6 `ZineStickyYearBand` — 年見出し（sticky stacking）

各年セクションの先頭に配置。`position: sticky; top: 56px` で
スティッキーバーの直下に張り付く。次の年セクションが入ると自然に
押し出される（sticky stacking）。

構成 (横一列):

```
[テープ年号 (italic, 60-86pt)] [chapter Ⅱ · N nights]
                              [JP サブ文言「通うようになった年。」]
```

- 年号: クリーム色の四角に黒文字（紙テープ風）
- マスキングテープ: 左上にちょこんと貼る（rgba 半透明）
- 章サブ文言（仮置き）:

```
2022: 出会いの年。
2023: 通うようになった年。
2024: 転換点の年。
2025: 走り抜けた年。
2026: 終演の年 — 4.27 解散。
```

実装は `reference-jsx/v2plus.jsx` の `ZineStickyYearBand` / `LivesYearHeader`
を参照。

## 2.7 `TapeStrip` — マスキングテープ装飾

ポラロイドや年号バッジに重ねる半透明テープ片。

```tsx
<div
  style={{
    position: "absolute",
    top,
    left,
    transform: `translateX(-50%) rotate(${rot}deg)`,
    width: 80,
    height: 22,
    background: "rgba(232,162,92,0.45)",
    mixBlendMode: "screen",
    boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
    backgroundImage:
      "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 5px)",
  }}
/>
```

## 2.8 `GalleryPhoto` — 縦横比保持の写真カード

CSS columns ギャラリー内で1枚を表示するだけのカード。
ホバーで微拡大 + シャドウ強化。

- 画像本体は `<img>` で `aspect-ratio` をそのまま指定
- `break-inside: avoid` で column 境界をまたがないように
- `transform: rotate(-1° to 1°)` の微小な傾き（seed で決定的に）

詳細は `reference-jsx/live-detail.jsx` を参照。

## 2.9 写真の枚数と aspect ratio の仮置き

参考実装は picsum.photos の seed から `ASPECTS` 配列で混在比率を決定:

```ts
const ASPECTS = [
  { ratio: "2/3" }, // 縦
  { ratio: "3/2" }, // 横
  { ratio: "1/1" }, // スクエア
  { ratio: "3/4" },
  { ratio: "10/7" },
];
```

実装側では DB から取得した実画像の幅・高さで `aspect-ratio` を CSS で指定。
**画像のオリジナル aspect を変えずに columns 内に流す** のが要件。
