# husky photo — V2+ Redesign Handoff

このフォルダは、既存プロジェクト（Next.js + TypeScript + Tailwind）の
`MemorialClient` 系 UI を **V2+ Scrapbook** デザインに刷新するためのハンドオフ一式です。

実プレビューは別途共有された design canvas を参照してください
（`MemorialClient Redesign.html` を直接開いても確認可能）。

---

## 📂 ファイル構成

```
handoff/
├── README.md                    ← このファイル
├── 01-design-tokens.md          ← パレット / フォント / globals.css 追記分
├── 02-shared-primitives.md      ← 共有プリミティブ（PhotoStage / hooks など）
├── 03-page-by-page.md           ← ページごとの実装ノート
├── 04-migration-plan.md         ← 既存ファイルとのマッピング・削除対象
├── 05-prompt-for-claude-code.md ← Claude Code に渡す初期プロンプト
└── reference-jsx/               ← 参考実装（プレーン React + 直書きスタイル）
    ├── shared.jsx
    ├── v2plus.jsx               ← Top page (Memorial timeline)
    ├── mobile-v2plus.jsx        ← Top page mobile
    ├── lives-index.jsx          ← Lives list (desktop + mobile)
    ├── members-desktop.jsx      ← Members feed desktop
    ├── members-mobile.jsx       ← Members feed mobile
    ├── live-detail.jsx          ← Live detail page (desktop + mobile)
    └── header-footer.jsx        ← MemorialHeader / MemorialFooter
```

---

## 🎯 デザインの方向性（要約）

- **トーン**: 暖色セピア＋琥珀。深い bistre 黒 (`#0c0805`) に、生成りクリーム
  (`#f0e3c8`) と琥珀アクセント (`#d2823a`)、セピアレッド (`#b85a3a`)。
  元の `#0a0807` / `#c84a3a` 赤を継承しつつ「焼け落ちた感じ」へシフト。
- **語彙**: ZINE / スクラップブック / タイプライター / マスキングテープ /
  ハンドスタンプ / マーキー流れ / 新聞章立て。
- **モーション**:
  - 写真スライド: 各カード独立の `setTimeout(2.4–5.8s)` ランダム間隔（同期させない）
  - 年見出し: sticky stacking（前の年が次の年に押し出される）
  - マーキー: 公演タイトル＋日付が背景で常に流れる
  - ホバー: 写真は微拡大 + シャドウ強化
- **写真**: 縦横比そのまま、CSS columns で desktop 5列 / mobile 3列
  の不揃いギャラリー。アクセスにはセピア寄りフィルター。
- **タイトル例**: `a long howl, for husky.` (解散済グループへの追悼)

---

## ✅ 起こしたページ

| ページ                   | パス          | reference-jsx                               |
| ------------------------ | ------------- | ------------------------------------------- |
| Top（Memorial timeline） | `/`           | `v2plus.jsx`, `mobile-v2plus.jsx`           |
| Lives 一覧               | `/lives`      | `lives-index.jsx`                           |
| Members                  | `/members`    | `members-desktop.jsx`, `members-mobile.jsx` |
| Live 個別                | `/lives/[id]` | `live-detail.jsx`                           |
| 共通ヘッダー・フッター   | —             | `header-footer.jsx`                         |

## 🗑 削除推奨ウィジェット

- `OpeningMonument` — Top の V2+ Memorial 冒頭ヒーローと完全重複
- `MembersRail` — Sticky バーのメンバー swatch + `/members` で発見性確保

詳細は `04-migration-plan.md` を参照。

---

## 🛠 reference-jsx の読み方

参考実装は **プレーン React + 直書きの style オブジェクト** で書かれています。
これは設計の意図（色値・letter-spacing・回転角・余白）を「曖昧さなく」
伝えるためで、本実装で同じ書き方をする必要はありません。

実装側では:

1. **Tailwind に書き換えて OK** — ただし font-family / letter-spacing /
   transform などの粒度を落とさないこと。Tailwind の任意値リテラル
   (`tracking-[0.32em]`, `rotate-[-0.8deg]` など) を活用。
2. **CSS 変数は `globals.css` に追加** — `01-design-tokens.md` をそのまま
   反映してください。
3. **画像 URL は picsum.photos 仮置き** — 実装時は実 DB の写真 URL に差し替え。
4. **メンバー名・色** は `shared.jsx` の `MEMBERS` 配列を参考に。実 DB の
   `MemberWithPhotoCount` 型をそのまま使えばよい。

---

## 次のステップ

1. `01-design-tokens.md` を `globals.css` に反映
2. `05-prompt-for-claude-code.md` を Claude Code に貼って依頼を開始
3. ページ単位で `03-page-by-page.md` を見ながら順次置き換え
