# Retrofit — 既存コードベースへのデザイン差し込み

MVP が動いていて DB・認証・ルーティングは出来上がっている前提で、
トップページの UI だけを今回のデザインに張り替える手順。

---

## 1. 必要なのは 3 ファイルだけ

このプロジェクトの `handoff/` フォルダの中身を、既存リポジトリのルート（`CLAUDE.md` と同階層）に `design/` として展開：

```
husky-photo/                  ← 既存リポジトリ
├── CLAUDE.md                 ← 既存
├── src/                      ← 既存
├── .claude/                  ← skills, hooks など
└── design/                   ← ★ 3 ファイルだけ
    ├── variant-memorial.jsx  ← デザイン正本 (React 風 JSX)
    ├── husky-common.jsx      ← データ型サンプル + プレースホルダー部品
    └── HANDOFF.md            ← トークン・データモデル・要件
```

`design-canvas.jsx`・`tweaks-panel.jsx`・不採用 variant・比較用 HTML は **混乱の元になるので持っていかない**。
`design/` 配下は Claude Code に読ませるだけ。ビルドには含めない。

## 2. 既存 CLAUDE.md に 1 ブロック追加

末尾あたりに以下を追記するだけでOK：

```markdown
## デザイン参照

トップページのリデザインを進行中。デザインの正本は `design/variant-memorial.jsx`。
全体方針・データモデル・トークンは `design/HANDOFF.md`。

UI 作業時のルール:

- 色・タイポ・余白は `design/variant-memorial.jsx` を尊重
- `design/` 配下は読み取り専用。編集しない
- 既存のデータ層・認証・ルーティングは触らない。UI 差し替えのみ
```

skills や hooks にすでにある「コード規約」や「ファイル命名」のルールはそのまま機能します。

## 3. 最初の差し替えプロンプト（コピペ用）

```
design/ フォルダを読んでください。

- design/variant-memorial.jsx ─ トップページの新デザインの正本 (React 風 JSX)
- design/husky-common.jsx ─ サンプルデータ型 + プレースホルダー部品の参考実装
- design/HANDOFF.md ─ デザイントークン (色・タイポ・余白)、データモデル、要件

タスク: 現状のトップページを、このデザインに張り替える。

【絶対に触らない】
- DB スキーマ・マイグレーション・seed
- データ取得層 (既存の getLives / getMembers などをそのまま呼ぶ)
- 認証・ルーティング・API 層
- design/ 配下のファイル (読み取り専用)

【やる】
1. 現状のトップページ (該当ファイルを特定して教えて) を design/variant-memorial.jsx の
   構造・色・タイポ・余白に合わせて作り直す。CSS-in-JS は、このリポジトリの既存スタイル方針
   (CLAUDE.md 参照) に翻訳して構わない
2. ヒーロー、Sticky Jump Bar (direction toggle + 年pill + メンバーショートカット)、
   Timeline、Members rail、Footer の 5 セクションを実装
3. Direction toggle (追体験/振り返り) は URL クエリ ?dir=reverse で永続化
4. 年 pill は <a href="#y2024"> でアンカージャンプ、html { scroll-behavior: smooth } を有効化
5. メンバーショートカットは /members/[id] への通常リンク

【データ前提】
- 2026 年の公演のみ DB に入っている (それ以前は空)
- 空の年でも year マーカーは薄く表示してレイアウトが崩れないように
- 写真が未登録のセルは PhotoFallback コンポーネントを新設してストライプ表示で埋める
  (design/husky-common.jsx の StripePlaceholder を参考に)

進め方: まず現状トップページのファイルパスを特定して報告し、どの順で差し替えるかの
提案を出してから着手してください。一気に書き換えない。
```

このプロンプトのキモ:

- 「触らない」を最初に列挙 → 既存資産を守る
- 「現状ファイルを特定して報告」 → Claude Code が勝手に推測して暴走するのを防ぐ
- 「順序の提案を先に」 → 大ぶり PR にならない

## 4. データがまだ揃ってない期間の落とし所

- 2026 のライブ（実データあり）→ そのまま表示
- 2022〜2025 の年マーカーは出すが、中身は「coming soon」や薄い空ノードで埋める
- 写真未登録のカードは `PhotoFallback`（design のストライプを再現）で表示
- 写真家の入稿スピードに合わせて段階的に埋まっていく

`HANDOFF.md` の §7（プレースホルダー差し替え）にこの方針を書いてあります。

## 5. その後

- トップが動いたら `/lives/[id]` と `/members/[id]` も同じ vocabulary（色・タイポ・余白）で。
  既存のページがあれば「`design/variant-memorial.jsx` の見た目語彙を踏襲しつつ、現状の `/lives/[id]` をリファインして」と頼む
- 迷ったら design 側に戻ってきて聞いてください

---

要するに **「design/ を canon としてリポジトリに置く → CLAUDE.md に 1 ブロック追記 → プロンプトで参照させる」** だけです。既存の skills / hooks はそのまま活きます。
