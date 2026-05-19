# 05. Claude Code に渡す初期プロンプト

以下をそのままコピペして Claude Code に渡してください。
事前に `handoff/` フォルダを repo に展開しておくこと。

---

## 📋 コピペ用プロンプト

```
husky photo サイトの UI を全面リデザインします。

設計成果物は `handoff/` フォルダ内にあります。以下を順番に読んでください:

1. `handoff/README.md` — 全体概要と方向性
2. `handoff/01-design-tokens.md` — パレット / フォント / globals.css 追記
3. `handoff/02-shared-primitives.md` — 共通プリミティブ仕様
4. `handoff/03-page-by-page.md` — ページごとの実装ノート
5. `handoff/04-migration-plan.md` — 既存ファイルとのマッピング・削除対象

参考実装は `handoff/reference-jsx/` にあります。これはプレーン React +
直書き style の形なので、実装は既存プロジェクトに合わせて Tailwind +
TypeScript で書き直してください。色値・letter-spacing・回転角・余白
などの粒度は落とさないように、Tailwind の任意値リテラル
(`tracking-[0.32em]`, `rotate-[-0.8deg]` 等) を活用すること。

## 実装順序

1. `app/globals.css` を `01-design-tokens.md` の内容で更新
2. `app/layout.tsx` で Google Fonts (Special Elite, Shippori Mincho,
   JetBrains Mono) を読み込み
3. 共通プリミティブを `widgets/Memorial/` 配下に作成:
   - `PhotoStage.tsx` (useRandomSlide + crossfade)
   - `PhotoMarquee.tsx`
   - `StickyBarScrapbook.tsx`
   - `StickyYearBand.tsx`
   - `TapeStrip.tsx`
   - `GalleryPhoto.tsx`
4. `MemorialHeader` / `MemorialFooter` を刷新
5. Top page (`MemorialClient.tsx`) を刷新
6. Lives 一覧 (`app/lives/page.tsx`) を刷新
7. Live 個別 (`app/lives/[id]/page.tsx` 周辺 + `PhotoGrid`) を刷新
8. Members (`app/members/page.tsx` + `MemorialMemberFilter` +
   `MemberPhotoFeed`) を刷新
9. `OpeningMonument` / `MembersRail` を削除（呼び出し元含む）

## 各ステップで守ること

- データ取得ロジック (`getLivesWithPhotoFlag`, `useInfiniteQuery`,
  `useIntersectionObserver`) は **既存をそのまま使う**。UI 層だけ
  差し替えること。
- 写真スライドショーは**カードごとに独立した setTimeout**でランダム間隔
  (2400–5800ms) にする。`setInterval` を共有しない。
- 年見出しは **sticky stacking** で実装。各年を `<section>` で囲み、
  その先頭の年バンドに `position: sticky; top: 56px`。
- 写真ギャラリーは **CSS columns 5列 (desktop) / 3列 (mobile)** で
  画像の縦横比は変えない (`object-fit: cover` などで切らない)。
- direction toggle (`?dir=reverse`) の URL 同期ロジックは元の
  `MemorialClient.tsx` のものをそのまま流用。
- 背景には YouTube 埋め込み動画が透けるよう、UI 全体の背景は
  `rgba(...,0.86~0.92)` 程度の半透明にする。

## 着手前の確認

- 既存の `tailwind.config` / `globals.css` / `MemorialClient.tsx`
  / 削除対象 (`OpeningMonument`, `MembersRail`) のコードを把握すること
- 設計の意図でわからない箇所があったら、必ず聞いてください。
  仮実装で進めないこと

Step 1 (globals.css 更新) から始めてください。
```

---

## 💡 追加 Tips

### Tailwind での tape-tilted な要素の書き方

```tsx
<button className="font-type rotate-[-0.8deg] border border-[var(--memorial-rule)] px-3 py-1.5 text-[12px] tracking-[0.16em] uppercase">
  SIDE A
</button>
```

### CSS columns の Tailwind

```tsx
<div className="columns-5 gap-3">
  {photos.map((p, i) => (
    <a
      href={`/lives/${live.id}#p${p.id}`}
      className="mb-3 block break-inside-avoid"
    >
      <img
        src={p.url}
        className="mem-photo block w-full"
        style={{ aspectRatio: p.ratio }}
      />
    </a>
  ))}
</div>
```

`columns-5` がなければ `column-count: 5` を `globals.css` に追加するか
任意値 `columns-[5]` で（v3.3+）。

### マーキーの2重ループ問題

`mem-marquee` が `transform: translateX(-50%)` で巻き戻すには
**配列を2回複製** する必要がある (`[...Array(2)].map(...)`)。
動かないときは内側のループ重複を確認。

### sticky stacking が効かないとき

- 親 `<section>` に `position: relative` を付ける
- 親に `overflow: hidden` をかけない（hidden だと sticky が無効化される）
- 各年セクションは **兄弟関係** で並べる。ネストしない

### 写真スライドショーがフラッシュするとき

`src` を切り替えるとブラウザがロードしなおすので必ずフラッシュする。
**全ての写真を最初から `<img>` で並べて、`opacity` だけ切り替える**
方式にすること。元の `LivePhotoSlideshow` の実装パターンを踏襲。
