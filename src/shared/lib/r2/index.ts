import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { createAdminClient } from "@/shared/lib/supabase/admin";

export const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

export function getKeyFromUrl(url: string): string {
  const parsed = new URL(url);
  return parsed.pathname.slice(1);
}

export async function deleteR2Object(key: string): Promise<void> {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
    }),
  );
}

export async function logR2DeletionFailure(
  photoId: string | null,
  liveId: string | null,
  memberName: string,
  r2Url: string,
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("r2_deletion_failures").insert({
    photo_id: photoId,
    live_id: liveId,
    member_name: memberName,
    r2_url: r2Url,
  });
  if (error) console.error("Failed to log R2 deletion failure:", error.message);
}
