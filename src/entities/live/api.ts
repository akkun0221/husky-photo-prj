import { createClient } from "@/shared/lib/supabase/server";
import type { Live, CreateLiveInput, UpdateLiveInput } from "./types";

export async function getLives(): Promise<Live[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lives")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getLiveById(id: string): Promise<Live> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lives")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createLive(input: CreateLiveInput): Promise<Live> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lives")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateLive(id: string, input: UpdateLiveInput): Promise<Live> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lives")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteLive(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("lives").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
