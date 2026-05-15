"use server";

import { redirect } from "next/navigation";
import { createServerSessionClient } from "@/shared/lib/supabase/server-session";

export async function signOutAction() {
  const supabase = await createServerSessionClient();
  await supabase.auth.signOut();
  redirect("/login");
}
