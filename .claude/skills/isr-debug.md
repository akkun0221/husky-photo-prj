# ISR キャッシュ起因バグのデバッグ手順

## 症状の見分け方

「データは DB にあるのに画面に反映されない」場合、まず以下で切り分ける。

| ページ        | レンダリング | キャッシュ               |
| ------------- | ------------ | ------------------------ |
| `/`・`/lives` | ISR          | あり（ビルド時点で固定） |
| `/members`    | CSR          | なし（毎回 API 取得）    |
| `/admin`      | SSR          | なし（毎回 DB 取得）     |

**CSR/SSR では見える・ISR ページだけ見えない → ISR キャッシュ確定**

---

## 原因パターン

### パターン A：`revalidatePath` 漏れ

Server Action（`createPhotoAction`、`createLive` 等）に `revalidatePath` が抜けている。

確認箇所：`src/features/*/actions.ts`

必要な revalidatePath：

```typescript
revalidatePath("/");
revalidatePath("/lives");
revalidatePath(`/lives/${id}`);
revalidatePath("/members");
```

### パターン B：外部設定変更後に再デプロイ未実施

Supabase の `db-max-rows` 変更など、コード外の設定を変えた場合、変更後に Vercel が再ビルドしないと ISR には反映されない。

---

## 修正手順

### パターン A の修正

該当 Server Action に `revalidatePath` を追加してプッシュ。Vercel が自動デプロイされれば次のリクエストで反映される。

### パターン B の修正

外部設定変更後に空コミットで再デプロイをトリガーする。

```bash
git commit --allow-empty -m "chore: ISRキャッシュ再構築のため再デプロイ"
git push origin master
```

Vercel のデプロイ完了後（数分）、ISR ページをリロードして確認する。
