# 03. ページごとの実装ノート

実装順序の推奨: `globals.css` → 共通プリミティブ → Header/Footer →
Top → Lives 一覧 → Live 個別 → Members。

---

## Page 1 — Top (`/`)

**既存ファイル**: `src/widgets/MemorialClient/MemorialClient.tsx`
**参考**: `reference-jsx/v2plus.jsx`（desktop）/ `mobile-v2plus.jsx`（mobile）

### 構造（縦に上から）

1. **マーキー** (`PhotoMarquee`) — 公演タイトル + 日付が常に流れる
2. **StickyBarScrapbook** — SIDE A/B + 年タブ + メンバーチップ + REC
3. **ヒーローブロック**:
   - `in memoriam · 2022.12.10 — 2026.04.27`（mono, accent）
   - `a long howl, for husky.`（巨大 italic, `husky` だけ accent 色）
   - JP サブタイトル（左に琥珀の縦罫線、line-height 2.0）:
     ```
     2022年12月10日に池袋 SOUND PEACE で husky と出会い、
     気づけば解散まで追い続けていました。
     上がっている{showCount}公演の写真は参戦したライブの記録です。
     まったりアップロードしていくのでゆるりとご覧ください。
     ```
   - 補助行: `oldest first · scroll to walk through · disbanded — 2026.04.27`
4. **年ごとセクション** × N — 各セクションの先頭に `ZineStickyYearBand`
5. **各ライブ = `ScrapbookSpread`**:
   - 2 カラム grid。左右が `i % 2` で alternate
   - 写真クラスタ: 3 枚のポラロイドが微傾き＋テープ片で重なる
   - テキスト側: night N + 巨大 italic 日付（最後のセグメントだけ accent）
     - JP タイトル + `@ venue` + 円形赤スタンプ "archived 2024 · husky"

### モバイル

- `MobileV2PlusNav` (SIDE A/B + member swatches + 年タブ tape)
- 1ライブ 1ポラロイド (46–54% 幅) + 対角側にテキスト
- 余白多め（背景動画前提）

### やめたもの

- 元の中央スパイン + 左右交互カード
- ネオン赤 `#c84a3a`
- モバイルの左ボーダー詰め込みカード
- 元の `OpeningMonument` — このページ冒頭ヒーローに統合

---

## Page 2 — Lives 一覧 (`/lives`)

**既存ファイル**: `src/app/lives/page.tsx`
**参考**: `reference-jsx/lives-index.jsx`

### 構造

1. マーキー
2. StickyBarScrapbook
3. ヘッダ:
   - `archive · index`
   - `Lives.` （巨大 italic + ピリオド accent）
   - `{N} shows documented · 2022.12.10 — 2026.04.27 · disbanded`
4. 年セクション × N:
   - sticky な年ヘッダ: テープ年号 + chapter info + JP サブ + **代表ポラ 96px**
   - ライブ行 (`<ul>` リスト):
     ```
     [TR.01/05]  [SAT]  [2026.04.24]  [感灯終唱~...]  [@ 心斎橋 BIGCAT]  [→]
     ```
   - 行間: 1px dashed border (`var(--memorial-faint)`)
   - hover: ごく薄い背景 hi (`rgba(240,227,200,0.04)`)

### モバイル

- 同 Sticky nav + マーキー
- 行は 2 行構成: `[weekday] / [MM.DD]` + `[title] / [venue]` + `[→]`
- 年ヘッダはコンパクトな italic 48pt + chapter info

---

## Page 3 — Members (`/members`)

**既存ファイル**:

- `src/app/members/page.tsx`
- `src/features/filter-photos/MemorialMemberFilter.tsx`
- `src/widgets/MemberPhotoFeed/MemberPhotoFeed.tsx`

**参考**: `reference-jsx/members-desktop.jsx`, `members-mobile.jsx`

### 構造

1. マーキー
2. StickyBarScrapbook
3. ヘッダ:
   - `gallery · by member`
   - `Members.` （巨大 italic + ピリオド accent）
   - `showing all 5 members` / `now showing — ● MEMBER_NAME`（選択時は名前を
     そのメンバー色で表示）
4. **フィルタチップ行**:
   - 「全て」+ 5メンバー（各 8px swatch + 略名）
   - tape-strip 風 tilt（±0.5° 〜 ±1.5°）
   - active: メンバー色のボーダー + 半透明 ハイライト
5. ライブ別フィード × N:
   - **ヘッダ横一列**: `entry №001 · SAT` | `2022.12.10 First Take @ 池袋 SOUND PEACE` | `all 10+ photos →`
   - `tagged` バッジ（active メンバー色）— フィルタ選択時のみ
   - **写真ギャラリー: CSS columns 5列（縦横比保持）**

### モバイル

- フィルタチップは横スクロール
- 写真ギャラリーは CSS columns 3列

### 元実装からの主な差分

- フィルタチップに **回転** を追加（テープ風）
- ライブグループは「ライブヘッダ + 横並び」→「ライブメタを横一行 + 下に columns 5」
- 元の `border-bottom: 1px solid var(--memorial-rule)` の硬い区切り → 点線
  `dashed` に
- `PhotoGrid` を **CSS columns で aspect 保持** の独自実装に置き換え
- 既存の Suspense / `useInfiniteQuery` / `useIntersectionObserver` の
  データ取得ロジックはそのまま使える（UI 層だけ差し替え）

---

## Page 4 — Live 個別 (`/lives/[id]`)

**既存ファイル**: `src/app/lives/[id]/page.tsx` 周辺
**参考**: `reference-jsx/live-detail.jsx`

### 構造

1. マーキー
2. StickyBarScrapbook
3. `← back to lives` リンク
4. ライブヘッダ:
   - `live · chapter Ⅲ · entry 08`
   - 巨大 italic 日付（最後のセグメントだけ accent）
   - JP タイトル（34px）
   - `[WEEKDAY] · @ [VENUE] · {N} photos`
   - **lineup**: 出演メンバーのチップ（色 swatch + 略名、各 `/members?member=X` へ）
   - 右側: 大きな赤いダブルサークルスタンプ `filed 04.24 2026`
5. **写真ギャラリー**: CSS columns **5列**（縦横比保持）
   - ホバー: `transform: scale(1.02)` + shadow 強化
   - 微傾き ±0.3°（seed で決定的）
   - 各写真は LiveBox / Lightbox にリンク（既存の `PhotoGrid` のクリック挙動継承）
6. 前後ナビ:
   - 2カラムで `← previous` / `next →`
   - 日付・JPタイトル・会場を簡潔に

### モバイル

- ヘッダ縮小、lineup チップ小サイズ
- 写真ギャラリー: CSS columns **3列**
- 前後ナビも 2カラム

---

## Page 5 — Header / Footer

**既存ファイル**:

- `src/widgets/MemorialHeader/MemorialHeader.tsx`
- `src/widgets/MemorialFooter/MemorialFooter.tsx`

**参考**: `reference-jsx/header-footer.jsx`

### Header

- 左: 12° 傾いた小さな琥珀色□（10×10px）+ `husky`（serif italic 28pt）+ `photo`（mono 13pt small caps, baseline 微調整）+ admin lock アイコン
- 右: tape-tilted nav チップ (`top` / `lives` / `members`)
  - 各チップは ±0.6° の微傾き
  - active: 琥珀塗り + ダーク文字
  - 非 active: 透明 + ルール線
- `position: relative; border-bottom: 1px solid rule`
  （Sticky にはしない — マーキー＆StickyBarScrapbook がその役）

### Footer

- 3カラム grid:
  - 左: `husky` italic + `photo · 2022 — 2026` mono
  - 中央: `── thank you ──` accent + `mem-flicker`
  - 右: admin lock + `ADMIN`
- 背景: `rgba(10,8,7,0.92)`、上に1px rule

### モバイル

- 縦1カラム、中央寄せ
- 全部の要素を中央配置
