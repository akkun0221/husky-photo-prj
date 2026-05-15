import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createServerSessionClient } from "@/shared/lib/supabase/server-session";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

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

  const buffer = Buffer.from(await file.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: "image/webp",
    }),
  );

  const url = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
  return NextResponse.json({ url });
}
