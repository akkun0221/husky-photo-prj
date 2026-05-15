import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cookie対応サーバークライアント（Route Handler / Server Action でセッション確認に使う）
export async function createServerSessionClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Action 内では set が制限される場合があるが無視してよい
          }
        },
      },
    },
  );
}
