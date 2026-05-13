import Link from "next/link";
import { getLives } from "@/entities/live/api";
import { getMembers } from "@/entities/member/api";
import { UploadPhoto } from "@/features/upload/UploadPhoto";
import { buttonVariants } from "@/shared/ui/button";

export default async function UploadPage() {
  const [lives, members] = await Promise.all([getLives(), getMembers()]);

  return (
    <main className="container mx-auto space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">写真アップロード</h1>
        <Link href="/admin" className={buttonVariants({ variant: "outline" })}>
          ← ダッシュボードへ戻る
        </Link>
      </div>
      <UploadPhoto lives={lives} members={members} />
    </main>
  );
}
