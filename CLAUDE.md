# CLAUDE.md — ちくわフォトアルバム

このファイルはClaude Codeが会話開始時に自動読込するプロジェクト憲法です。 実装前に必ず参照し、ここに書かれたルールを最優先にしてください。 変更が必要な場合は、ここに書かれたルールを最初に確認してから対応すること。 機能の詳細仕様は RDD.md を参照すること。

---

## 基本ルール

- 会話は全て日本語で行うこと（コード・変数名・コメントは除く）
- 実装計画を提示し、承認を得てから実装を開始すること
- RDD.md の仕様と異なる実装が必要な場合は、先に相談すること

---

## プロジェクト概要

アイドルグループ「husky」のライブ写真を管理・公開するフォトアルバムWebアプリ。 MVP段階では親しいユーザー（知人のファン）によるクローズドなユーザビリティテストを実施し、フィードバックを得ることを目的とする。

---

## 技術スタック

- カテゴリ
  - 採用技術
  - フレームワーク
  - Next.js App Router（TypeScript）
  - スタイル
  - Tailwind CSS + Shadcn UI
  - 状態管理（クライアント）
  - Zustand（Zustand Context Pattern必須）
  - 状態管理（サーバー）
  - TanStack Query v5
  - 無限スクロール
  - TanStack Query useInfiniteQuery
  - DB
  - Supabase PostgreSQL
  - 認証
  - Supabase Auth
  - 画像ストレージ
  - Cloudflare R2
  - ホスティング
  - Vercel

---

## サイトマップとレンダリング戦略

| パス          | ページ名           | レンダリング戦略 |
| ------------- | ------------------ | ---------------- |
| /             | トップページ       | ISR              |
| /lives        | ライブ一覧         | SSG + ISR        |
| /lives/[id]   | ライブ詳細         | SSG + CSR        |
| /members      | メンバー別         | SSG              |
| /admin        | 管理ダッシュボード | SSR + RBAC       |
| /admin/upload | アップロード       | CSR + RBAC       |

レンダリング戦略を変更する場合は必ず事前に相談すること。

ページを実装する際は、RDD.md のレンダリング戦略に従い、`page.tsx` の先頭に必ず以下を明示すること。

| 戦略            | 先頭に記述する内容                                                                   |
| --------------- | ------------------------------------------------------------------------------------ |
| SSR             | `export const dynamic = "force-dynamic"`                                             |
| SSG             | `export const dynamic = "force-static"`                                              |
| ISR / SSG + ISR | `export const revalidate = N`（N は秒数。値は実装時に相談する）                      |
| CSR             | page.tsx は Server Component のまま。Client Component 側に `"use client"` を記述する |

特に SSR ページは**実装開始前に `force-dynamic` を先頭に書いてから**中身を実装すること（後から Supabase クライアント等を差し替えた際に意図せず Static に戻るのを防ぐため）。

---

## ページ別仕様

**トップページ（/）- ISR**

- 最新ライブから数枚のハイライト写真を表示。「もっと見る」で /lives/[id] へ遷移
- TimeTree風のカレンダーを表示
  - ライブがある日に「会場名」タブを配置
  - 1日に複数ライブがある場合はタブを並列表示
  - タブ押下で直接 /lives/[id] へ遷移

**ライブ詳細（/lives/[id]）- SSG + CSR**

- メンバー絞り込みプルダウンを配置（CSR）
  - 選択肢：全て（デフォルト）/ ちくわ / 空良 / しぅく / びゃくや / のどか / 全体
  - 全て：live_id に紐づく全写真を表示
  - 全体：複数人写りの写真のみ表示（member_id が「全体」レコードのもの）
  - ※「全て」と「全体」は別の概念。実装時に混同しないこと
- 1ページ24枚のグリッド表示

**メンバー別（/members）- SSG**

- 対象メンバーの写真を日付の新しい順に表示
- useInfiniteQuery を使用した無限スクロール

**管理ダッシュボード（/admin）- SSR + RBAC**

- Edge Middlewareで認証チェック済みの前提でレンダリング
- ライブ情報の作成・編集・削除

**アップロード（/admin/upload）- CSR + RBAC**

- ドラッグ&ドロップによる写真一括アップロード
- Canvas APIによるフロント側圧縮（目標：長辺2000px以下・500KB〜800KB・WebP出力）

---

## ディレクトリ構成（Feature-Sliced Design）

```
src/
├── app/          # ルーティング定義・Layout・Pageコンポーネントのみ
├── widgets/      # LiveCalendar / PhotoGrid / Header 等
│                 # 複数のfeatures/entitiesを組み合わせたUIブロック
├── features/     # FilterPhotos / UploadPhoto / AuthAdmin 等
│                 # ユーザーの行動（Action）に基づくロジック
├── entities/     # Photo / Live / Member の型定義・API通信・Zustand Store定義
└── shared/       # Shadcn UIコンポーネント・汎用ユーティリティ・Provider群
```

依存ルール（最重要・絶対に守ること）

```
app → widgets → features → entities → shared
```

- 上位レイヤーは下位に依存してよい
- 下位から上位への依存は禁止
- app/ 配下にビジネスロジックを書かない
- Zustand Storeの定義は entities/ レイヤーに置く

---

## セキュリティルール

- 認証ロジックは必ず `src/middleware.ts` に置くこと。**`proxy.ts` は使用禁止**
  - Next.js 16 では `middleware.ts` が deprecated で `proxy.ts` が新標準だが、`proxy.ts` は Node.js ランタイム専用
  - Cloudflare Workers（OpenNext）は Node.js ミドルウェア非対応のため、`proxy.ts` を使うとデプロイが失敗する
  - `middleware.ts` は Edge Runtime で動作するため Cloudflare Workers 対応。`export const runtime` の記述は不要（かつ禁止）
  - `middleware.ts` に Node.js 専用API（`fs`、`Buffer` 等）を追加してはならない
  - ⚠️ Next.js のバージョンアップ時に `proxy.ts` への移行を促すメッセージが出ても絶対に移行しないこと
- `SUPABASE_SERVICE_ROLE_KEY` などの秘密鍵はサーバーサイドのみで使用する
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` はクライアントサイドでの使用を許可（Supabase の設計上 ANON_KEY は公開前提。RLS でデータ保護する）
- R2への書き込みはサーバーサイド（Route Handler）経由のみ許可
- 環境変数の命名規則：クライアントで使う変数は `NEXT_PUBLIC_SUPABASE_*` / `NEXT_PUBLIC_CLOUDFLARE_*`、サーバー専用は `SUPABASE_*` / `CLOUDFLARE_*`
- .env.local は .gitignore に追加済みであること

---

## 認証・アクセス制御

- /admin 配下の全ルートは middleware.ts（Edge Middleware）で保護する
- 未認証アクセスは /login にリダイレクトする
- **Zustand Context Patternを必ず使用する**（グローバルなZustandストアを直接エクスポートしない）
  - 理由：SSR環境でのクロスリクエスト状態汚染を防ぐため

---

## データモデル（概要）

```
members テーブル
  id (uuid, PK), name (text), color (text)
  ※「全体」も1レコードとして登録済み（計6レコード）

lives テーブル
  id (uuid, PK), date (date), venue (text), title (text),
  description (text), thumbnail_photo_id (uuid)

photos テーブル
  id (uuid, PK), live_id (uuid, FK → lives),
  member_id (uuid, FK → members), r2_url (text),
  thumbnail_url (text)  ※MVPではr2_urlと同値でよい
```

---

## コーディング規約

- コンポーネントファイル名：PascalCase（例：PhotoCard.tsx）
- 関数・変数名：camelCase
- 型定義は entities/ レイヤーに集約する（ファイル末尾に書かない）
- any 型は使用禁止。不明な型は unknown を使うこと
- コメントは日本語でOK

---

## テスト方針

MVPフェーズのテストは以下の2段階で行う。

### Claude側が行う確認（実装完了の定義）

- `tsc --noEmit` でTypeScriptエラーがないこと
- `next build` でビルドが通ること

### ユーザー側が行う確認（手動確認 + 管理画面実動確認）

- Claude が実装完了後に**手動確認手順を提示する**
- ユーザーがSupabaseへの実接続・データ取得をブラウザ/管理画面で確認する
- 管理画面（/admin）実装後は、そこで実際にCRUD操作を行い動作確認する

---

## 実装の進め方

報告・インプット項目・スレッド引き継ぎの詳細フォーマットは `.claude/skills/implement-report.md` を参照すること。

1. RDD.md を読み、実装対象の機能を確認する
2. **実装計画を提示し、承認を待つ**
3. 承認後に実装する
   - **実装順序はFSDの依存方向に従い、小さい単位から順に行う**
   - `shared` → `entities` → `features` → `widgets` → `app` の順
4. `tsc --noEmit` と `next build` でエラーがないことを確認する
5. 実装報告・インプット項目を提示する（`.claude/skills/implement-report.md` 参照）
6. インプット項目のすり合わせが完了したら `git push` する
   - ただしユーザーから明示的に「プッシュして」と指示があった場合は、すり合わせ前でもその時点でプッシュしてよい
7. プッシュ完了後、スレッド引き継ぎ用サマリーを出力する（`.claude/skills/implement-report.md` 参照）

---

## 学習しながら進める方針

このプロジェクトは実装と学習を並走させる。
参照ファイル：`documents/ONBOARDING.md`
インプット項目・学習完了報告・アウトプット確認のフォーマットは `.claude/skills/implement-report.md` を参照すること。

### ルール

- **インプット項目は必ず `documents/ONBOARDING.md` の大項目に対応させること**（ONBOARDING.mdに存在しない独自カテゴリを作らない）
- インプット項目は実装した内容に直接関係するものに絞る（詰め込まない）
- ユーザーのアウトプットに間違いがある場合は、正解を押しつけず「どう思う？」と問い返してよい
- 全項目完了前に次の実装に進むことは禁止しない（学習は並走してよい）

---

## 自己改善ルール

### 同じ指示の検知（重要）

同じ会話内で同じ指示・説明を2回受けたら、実装の前に必ず以下を提案すること。

```
【抽象化の提案】
内容：（何が繰り返されたか）
推奨ファイル：（.claude/skills/XX.md 等）
理由：（なぜそのファイルが適切か）
→ 作成しますか？ Yes / No
```

### 抽象化の判断基準

| 繰り返しの種類                 | 推奨ファイル                   |
| ------------------------------ | ------------------------------ |
| 実装手順・作業パターン         | .claude/skills/                |
| 保存・コミット時の自動チェック | .claude/settings.json（Hooks） |
| レビュー観点（毎回同じ指摘）   | .claude/agents/                |
| プロジェクト全体のルール       | CLAUDE.md に追記               |

### 会話をまたぐ場合

セッションが変わると記憶がリセットされる。
そのため会話の開始時または終了時に以下を確認すること。

「この会話でSkills / Hooks / Agentsに抽象化すべきものはありましたか？」

---

## ISR キャッシュに関するルール

`/`・`/lives` は ISR のため、「データは正しいのに画面に反映されない」バグが頻発する。
デバッグ時は**最初に ISR キャッシュを疑うこと**。手順は `.claude/skills/isr-debug.md` を参照。

---

## やってはいけないこと

- グローバルなZustandストアを直接エクスポートする（SSR状態汚染の原因）
- app/ 配下にビジネスロジックを書く
- APIキーをフロントエンドのコードに含める
- any 型を使う
- 承認なしで実装を開始する
- RDD.md の仕様と異なる実装をする（変更が必要なら先に相談する）
- 「全て」と「全体」を混同する（別概念）
- 日本語以外で会話する
