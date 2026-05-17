# husky フォトアルバム

アイドルグループ **husky** のライブ写真を管理・公開するフォトアルバム Web アプリ。

## 技術スタック

| カテゴリ       | 採用技術                           |
| -------------- | ---------------------------------- |
| フレームワーク | Next.js 16 App Router (TypeScript) |
| スタイル       | Tailwind CSS + Shadcn UI           |
| 状態管理       | Zustand + TanStack Query v5        |
| DB / 認証      | Supabase (PostgreSQL + Auth)       |
| 画像ストレージ | Cloudflare R2                      |
| ホスティング   | Vercel                             |

## ローカル環境のセットアップ

### 1. 前提条件

Node.js が必要です。未インストールの場合は Homebrew でインストールしてください。

```bash
brew install node
```

### 2. リポジトリのクローン & 依存関係インストール

```bash
git clone <repository-url>
cd husky-photo-prj
npm install
```

### 3. 環境変数の設定

プロジェクトルートに `.env.local` を作成し、以下の変数を設定します。

```bash
cp .env.local.example .env.local  # テンプレートがある場合
# または以下の内容を手動で作成
```

`.env.local` の内容：

```env
# ── Supabase ──────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# ── Cloudflare R2 ──────────────────────────────────────
NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxxx.r2.dev
CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxxx.r2.dev
CLOUDFLARE_R2_BUCKET_NAME=husky-photos
CLOUDFLARE_R2_ENDPOINT=https://<アカウントID>.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY_ID=xxxx
CLOUDFLARE_R2_SECRET_ACCESS_KEY=xxxx
```

> **注意:** `NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL` と `CLOUDFLARE_R2_PUBLIC_URL` は同じ値を設定してください。
> 前者はブラウザ側、後者はサーバー側（アップロードRoute Handler）で使われます。
> どちらか一方だけだとアップロードしたURLがDBに `undefined/...` と保存されてしまいます。

#### 各値の取得場所

**Supabase**（[Supabase Dashboard](https://supabase.com/dashboard) → プロジェクト選択 → Settings → API）

| 変数                            | 取得場所                           |
| ------------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Project URL                        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project API keys → `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY`     | Project API keys → `service_role`  |

**Cloudflare R2**（[Cloudflare Dashboard](https://dash.cloudflare.com) → R2 Object Storage → バケット選択）

| 変数                                                                | 取得場所                                                                                                     |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL` / `CLOUDFLARE_R2_PUBLIC_URL` | Settings → Public Development URL（例: `https://pub-xxxx.r2.dev`）                                           |
| `CLOUDFLARE_R2_BUCKET_NAME`                                         | バケット名（例: `husky-photos`）                                                                             |
| `CLOUDFLARE_R2_ENDPOINT`                                            | Settings → S3 API の URL からバケット名を除いた部分（例: `https://<アカウントID>.r2.cloudflarestorage.com`） |
| `CLOUDFLARE_R2_ACCESS_KEY_ID`                                       | R2 → Manage R2 API Tokens → API トークン作成 → Access Key ID                                                 |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY`                                   | 同上 → Secret Access Key                                                                                     |

### 4. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアクセスできます。

管理画面は [http://localhost:3000/admin](http://localhost:3000/admin)（要ログイン）。

## 主なページ構成

| URL             | 内容                           |
| --------------- | ------------------------------ |
| `/`             | トップ（ライブカレンダー）     |
| `/lives`        | ライブ一覧                     |
| `/lives/[id]`   | ライブ詳細・写真グリッド       |
| `/members`      | メンバー別写真                 |
| `/admin`        | 管理ダッシュボード（認証必須） |
| `/admin/upload` | 写真アップロード（認証必須）   |

## ビルド確認

```bash
npm run build
```
