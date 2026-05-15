import { NextRequest, NextResponse } from "next/server";
import { createServerSessionClient } from "@/shared/lib/supabase/server-session";
import { putR2Object } from "@/shared/lib/r2";

export async function POST(req: NextRequest) {
  const supabase = await createServerSessionClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as Blob | null;
  const key = formData.get("key") as string | null;

  if (!file || !key) {
    return NextResponse.json(
      { error: "file と key は必須です" },
      { status: 400 },
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  await putR2Object(key, arrayBuffer, "image/webp");

  const url = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
  return NextResponse.json({ url });
}
