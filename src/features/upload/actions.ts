"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/shared/lib/supabase/admin";
import type { CreatePhotoInput } from "@/entities/photo/types";

export async function createPhotoAction(
  input: CreatePhotoInput,
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("photos").insert(input);
  if (error) throw new Error(error.message);
  revalidatePath(`/lives/${input.live_id}`);
  revalidatePath("/lives");
  revalidatePath("/");
}
