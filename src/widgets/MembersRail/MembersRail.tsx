import Link from "next/link";
import type { MemberWithPhotoCount } from "@/entities/member/types";

type Props = {
  members: MemberWithPhotoCount[];
};

export function MembersRail({ members }: Props) {
  return (
    <section
      className="px-4 pt-10 pb-10 sm:px-16 sm:pt-15 sm:pb-15"
      style={{ borderTop: "1px solid var(--memorial-rule)" }}
    >
      {/* ヘッダー */}
      <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-0">
        <div className="flex items-baseline gap-4">
          <span
            className="font-mono text-[10px] tracking-[0.4em] uppercase"
            style={{ color: "var(--memorial-accent)" }}
          >
            by member
          </span>
          <h3
            className="m-0 text-2xl font-normal sm:text-4xl"
            style={{
              fontFamily: "var(--font-playfair), 'Noto Serif JP', serif",
              fontStyle: "italic",
              color: "var(--memorial-fg)",
            }}
          >
            five voices, five archives
          </h3>
        </div>
        <span
          className="text-[11px] tracking-[0.3em] uppercase"
          style={{ color: "var(--memorial-sub)" }}
        >
          メンバーごとの写真ページへ ›
        </span>
      </div>

      {/* グリッド */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        style={{
          gap: 1,
          background: "var(--memorial-rule)",
          border: "1px solid var(--memorial-rule)",
        }}
      >
        {members.map((m, i) => (
          <Link
            key={m.id}
            href={`/members?member=${m.id}`}
            className="block no-underline transition-opacity hover:opacity-80"
            style={{
              background: "var(--memorial-bg)",
              padding: 12,
              color: "var(--memorial-fg)",
            }}
          >
            {/* ポートレートエリア */}
            <div className="relative h-36 w-full overflow-hidden sm:h-52 lg:h-70">
              <MemberPhoto member={m} index={i} />
            </div>

            {/* テキスト */}
            <div
              className="pt-3 font-mono text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "var(--memorial-sub)" }}
            >
              0{i + 1}
            </div>
            <div
              className="mt-1 text-xl leading-tight font-bold sm:text-2xl"
              style={{
                fontFamily: "var(--font-playfair), 'Noto Serif JP', serif",
                fontStyle: "italic",
                color: "var(--memorial-fg)",
              }}
            >
              {m.name}
            </div>
            <div
              className="mt-2 flex items-center justify-between font-mono text-[10px] tracking-[0.25em] uppercase"
              style={{ color: "var(--memorial-sub)" }}
            >
              <span>{m.photoCount.toLocaleString()} photos</span>
              <span style={{ color: "var(--memorial-accent)" }}>›</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function MemberPhoto({
  member,
  index,
}: {
  member: MemberWithPhotoCount;
  index: number;
}) {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-end p-2 sm:p-3"
      style={{
        backgroundColor: member.color,
        backgroundImage:
          "repeating-linear-gradient(180deg, transparent 0 8px, rgba(0,0,0,0.04) 8px 9px)",
      }}
    >
      <div
        className="font-mono text-[10px] tracking-[0.12em] uppercase opacity-55"
        style={{ color: "#fff" }}
      >
        [ 0{index + 1} ]
      </div>
      <div className="mt-0.5 text-sm font-medium" style={{ color: "#fff" }}>
        {member.name}
      </div>
    </div>
  );
}
