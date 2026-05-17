import Link from "next/link";
import type { MemberWithPhotoCount } from "@/entities/member/types";

type Props = {
  members: MemberWithPhotoCount[];
};

export function MembersRail({ members }: Props) {
  return (
    <section
      className="px-16 pt-15 pb-15"
      style={{
        borderTop: "1px solid var(--memorial-rule)",
        background: "var(--memorial-bg)",
      }}
    >
      {/* ヘッダー */}
      <div className="mb-7 flex items-baseline justify-between">
        <div className="flex items-baseline gap-4">
          <span
            className="font-mono text-[10px] tracking-[0.4em] uppercase"
            style={{ color: "var(--memorial-accent)" }}
          >
            by member
          </span>
          <h3
            className="m-0 text-4xl font-normal"
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
        className="grid"
        style={{
          gridTemplateColumns: "repeat(5, 1fr)",
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
              padding: 18,
              color: "var(--memorial-fg)",
            }}
          >
            {/* ポートレートエリア */}
            <div className="relative h-70 w-full overflow-hidden">
              <MemberPhoto member={m} index={i} />
            </div>

            {/* テキスト */}
            <div
              className="pt-3.5 font-mono text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "var(--memorial-sub)" }}
            >
              0{i + 1}
            </div>
            <div
              className="mt-1 text-2xl leading-tight font-bold"
              style={{
                fontFamily: "var(--font-playfair), 'Noto Serif JP', serif",
                fontStyle: "italic",
                color: "var(--memorial-fg)",
              }}
            >
              {m.name}
            </div>
            <div
              className="mt-2.5 flex items-center justify-between font-mono text-[10px] tracking-[0.25em] uppercase"
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
      className="absolute inset-0 flex flex-col justify-end p-3"
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
