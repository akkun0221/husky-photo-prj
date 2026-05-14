# Server Action 実装パターン

`src/features/{feature}/actions.ts` に Server Action を追加するときのパターン。

---

## 1. 基本構造

```typescript
"use server";

import { createAdminClient } from "@/shared/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createEntityAction(input: CreateEntityInput) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("table_name").insert(input);
  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/lives");
}
```

---

## 2. revalidatePath の使い方

そのエンティティが表示される**全ページのパス**を列挙する。
パスは最小限に絞る（全体 revalidate は避ける）。

| 操作                  | revalidatePath すべきパス            |
| --------------------- | ------------------------------------ |
| ライブ 作成/更新/削除 | `/`、`/lives`、`/admin`              |
| 写真アップロード      | `/lives/[id]`（対象ライブのみ）、`/` |

---

## 3. クライアントの選択

- **書き込み操作** → `createAdminClient()`（Service Role Key）
- **認証チェックが必要** → `createClient()`（Cookie ベース、通常は middleware で済んでいる）
- Server Action はサーバー側で実行されるため `SERVICE_ROLE_KEY` の漏洩リスクはない

---

## 4. チェックリスト

- [ ] ファイルの先頭に `"use server"` があるか
- [ ] 書き込み操作に `createAdminClient` を使っているか
- [ ] 影響する全パスを `revalidatePath` しているか
- [ ] エラー時は `throw error` しているか（Client Component 側で catch する）
