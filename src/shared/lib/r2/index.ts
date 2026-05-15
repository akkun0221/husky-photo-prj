import { AwsClient } from "aws4fetch";
import { createAdminClient } from "@/shared/lib/supabase/admin";

const r2 = new AwsClient({
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  service: "s3",
  region: "auto",
});

const R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT!;
const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET_NAME!;

export function getKeyFromUrl(url: string): string {
  const parsed = new URL(url);
  return parsed.pathname.slice(1);
}

export async function putR2Object(
  key: string,
  body: ArrayBuffer,
  contentType: string,
): Promise<void> {
  const url = `${R2_ENDPOINT}/${R2_BUCKET}/${key}`;
  const res = await r2.fetch(url, {
    method: "PUT",
    body,
    headers: { "Content-Type": contentType },
  });
  if (!res.ok) {
    throw new Error(`R2 put failed: ${res.status} ${res.statusText}`);
  }
}

export async function deleteR2Object(key: string): Promise<void> {
  const url = `${R2_ENDPOINT}/${R2_BUCKET}/${key}`;
  const res = await r2.fetch(url, { method: "DELETE" });
  if (!res.ok && res.status !== 404) {
    throw new Error(`R2 delete failed: ${res.status} ${res.statusText}`);
  }
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
