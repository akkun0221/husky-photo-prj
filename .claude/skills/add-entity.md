# FSD entities 層 追加手順

`src/entities/` 配下に新しいエンティティを追加するときの手順。

---

## 1. ディレクトリ構造

```
src/entities/
└── {entity-name}/
    ├── types.ts   # 型定義
    └── api.ts     # Supabase API 関数
```

---

## 2. types.ts の作成

```typescript
// PascalCase で命名
export type EntityName = {
  id: string; // uuid は string として扱う
  // ... フィールド
};

// CRUD 用インプット型も定義する
export type CreateEntityNameInput = Omit<EntityName, "id">;
export type UpdateEntityNameInput = Partial<CreateEntityNameInput>;
```

**注意：**

- `any` 型は使用禁止。不明な型は `unknown` を使う
- Supabase のリレーション（JOIN）で取得するフィールドは型に含める
  - 例：`photo & { lives: { date: string } }` など（定義しないと実行時と型が乖離する）

---

## 3. api.ts の作成

### Supabase クライアントの使い分け

| クライアント          | 用途                                                | インポート元                   |
| --------------------- | --------------------------------------------------- | ------------------------------ |
| `createClient()`      | 読み取り（SSG / ISR / SSR）                         | `@/shared/lib/supabase/server` |
| Browser クライアント  | ブラウザからの読み取り（CSR）                       | `@/shared/lib/supabase/client` |
| `createAdminClient()` | 書き込み・管理操作（Server Action / Route Handler） | `@/shared/lib/supabase/admin`  |

### 実装パターン

```typescript
import { createClient } from "@/shared/lib/supabase/server";

export async function getEntities(): Promise<EntityName[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("table_name").select("*");
  if (error) throw error;
  return data ?? [];
}
```

---

## 4. チェックリスト

- [ ] `types.ts` に CRUD 用の入力型（`CreateXxxInput` / `UpdateXxxInput`）があるか
- [ ] リレーション取得時に戻り値型が正確か（JOIN フィールドが型に含まれているか）
- [ ] 読み取りに `createAdminClient` を使っていないか（読み取りは `createClient`）
- [ ] `any` 型を使っていないか
