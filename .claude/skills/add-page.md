# Next.js ページ追加手順

`src/app/` 配下に新しいページを追加するときの手順。

---

## 1. レンダリング戦略の確認

CLAUDE.md のサイトマップを確認し、ページのレンダリング戦略を決定する。
**戦略を変更する場合は必ず事前に相談すること。**

| 戦略            | page.tsx 先頭に記述する内容                                                          |
| --------------- | ------------------------------------------------------------------------------------ |
| SSR             | `export const dynamic = "force-dynamic"`                                             |
| SSG             | `export const dynamic = "force-static"`                                              |
| ISR / SSG + ISR | `export const revalidate = N`（N は秒数。値は実装時に相談する）                      |
| CSR             | page.tsx は Server Component のまま。Client Component 側に `"use client"` を記述する |

**SSR ページは `force-dynamic` を最初の行に書いてから中身を実装すること。**
（後から Supabase クライアント等を差し替えた際に意図せず Static に戻るのを防ぐため）

---

## 2. ファイル配置ルール

`app/` 配下はルーティング定義・Layout・Page コンポーネントのみ。ビジネスロジック禁止。

- 複雑な UI ブロック → `src/widgets/` に切り出す
- データ取得 → `src/entities/` の API 関数を呼び出す
- インタラクティブな Client Component → `app/[route]/ComponentName.tsx` として同階層に配置
  - ファイル名は PascalCase

FSD の依存方向：`app → widgets → features → entities → shared`

---

## 3. チェックリスト

- [ ] `page.tsx` の先頭にレンダリング戦略の宣言があるか
- [ ] SSR ページは `force-dynamic` が最初の行に書かれているか
- [ ] `app/` 配下にビジネスロジックが混入していないか
- [ ] データ取得は `entities/` の関数を使っているか
