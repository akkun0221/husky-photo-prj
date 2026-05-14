import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// 公開ページのサーバーサイド読み取り用（RLS適用、cookies不要）
// cookies() を使わないため SSG / ISR でも動作する
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
