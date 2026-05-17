const YT_VIDEO_ID = "08JiOyg4moY";

type Props = {
  showCount: number;
  photoCount: number;
  voiceCount: number;
};

export function OpeningMonument({ showCount, photoCount, voiceCount }: Props) {
  return (
    <section
      className="relative overflow-hidden px-16 pt-18 pb-14 text-center"
      style={{ background: "var(--memorial-bg)" }}
    >
      {/* YouTube 背景動画 */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <iframe
          src={`https://www.youtube.com/embed/${YT_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${YT_VIDEO_ID}&controls=0&disablekb=1&modestbranding=1&playsinline=1&rel=0`}
          allow="autoplay; encrypted-media"
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            width: "177.78vh",
            height: "56.25vw",
            minWidth: "100%",
            minHeight: "100%",
            transform: "translate(-50%, -50%) scale(1.1)",
            filter: "blur(24px)",
            opacity: 0.12,
            border: "none",
          }}
          title=""
        />
      </div>

      {/* foreground */}
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
            fontSize: "clamp(72px, 12vw, 144px)",
            color: "var(--memorial-fg)",
          }}
        >
          2022
          <span className="mx-6" style={{ color: "var(--memorial-faint)" }}>
            —
          </span>
          2026
        </div>

        <p
          className="mx-auto mt-8 max-w-xl text-sm leading-loose"
          style={{ color: "var(--memorial-sub)", lineHeight: 2, fontSize: 15 }}
        >
          2022年12月10日、秋葉原のライブハウスで、はじめて husky を撮りました。
          そこから 2026年4月27日の解散ライブまで、{showCount}{" "}
          公演を追いかけた記録です。
          ここから入って、自分のペースで日付のあいだを歩いてみてください。
        </p>

        {/* 統計数値 */}
        <div
          className="mt-9 inline-flex items-baseline gap-7 font-mono text-xs tracking-[0.3em] uppercase"
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
