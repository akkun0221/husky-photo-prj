"use server";

import { revalidatePath } from "next/cache";
import { createLive, updateLive, deleteLive } from "@/entities/live/api";
import type { CreateLiveInput, UpdateLiveInput } from "@/entities/live/types";

export async function createLiveAction(input: CreateLiveInput) {
  await createLive(input);
  revalidatePath("/lives");
  revalidatePath("/");
}

export async function updateLiveAction(id: string, input: UpdateLiveInput) {
  await updateLive(id, input);
  revalidatePath("/lives");
  revalidatePath(`/lives/${id}`);
  revalidatePath("/");
}

export async function deleteLiveAction(id: string) {
  await deleteLive(id);
  revalidatePath("/lives");
  revalidatePath("/");
}
