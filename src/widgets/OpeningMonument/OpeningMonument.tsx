type Props = {
  showCount: number;
  photoCount: number;
  voiceCount: number;
};

export function OpeningMonument({ showCount, photoCount, voiceCount }: Props) {
  return (
    <section className="relative overflow-hidden px-4 pt-10 pb-8 text-center sm:px-16 sm:pt-18 sm:pb-14">
      <div className="relative z-10">
        <p
          className="mb-8 text-xs tracking-[0.5em] uppercase"
          style={{ color: "var(--memorial-sub)" }}
        >
          ── an archive of husky, through one lens ──
        </p>

        {/* 巨大タイポ */}
        <div
          style={{
            fontFamily: "var(--font-playfair), 'Noto Serif JP', serif",
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            fontSize: "clamp(52px, 12vw, 144px)",
            color: "var(--memorial-fg)",
          }}
        >
          2022
          <span
            className="mx-4 sm:mx-6"
            style={{ color: "var(--memorial-faint)" }}
          >
            —
          </span>
          2026
        </div>

        <p
          className="mx-auto mt-8 max-w-xl px-2 text-sm leading-loose sm:px-0"
          style={{ color: "var(--memorial-sub)", lineHeight: 2, fontSize: 15 }}
        >
          2022年12月10日、池袋SOUND PEACEで、はじめて husky を撮りました。
          そこから 2026年4月27日の解散ライブまで、{showCount}{" "}
          公演を追いかけた記録です。
          まったりアップロードしていくのでゆるりと見てください。
        </p>

        {/* 統計数値 */}
        <div
          className="mt-9 inline-flex flex-wrap items-baseline justify-center gap-5 font-mono text-xs tracking-[0.3em] uppercase sm:gap-7"
          style={{ color: "var(--memorial-sub)" }}
        >
          <StatItem value={showCount} label="shows" />
          <Dot />
          <StatItem value={photoCount} label="photos" />
          <Dot />
          <StatItem value={voiceCount} label="voices" />
        </div>
      </div>
    </section>
  );
}

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <span>
      <span
        style={{
          fontFamily: "var(--font-playfair), serif",
          fontStyle: "italic",
          fontSize: 22,
          letterSpacing: 0,
          marginRight: 6,
          color: "var(--memorial-fg)",
        }}
      >
        {value.toLocaleString()}
      </span>
      {label}
    </span>
  );
}

function Dot() {
  return <span style={{ color: "var(--memorial-rule)" }}>·</span>;
}
