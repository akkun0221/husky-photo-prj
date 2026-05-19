// V2+ — SCRAPBOOK WITH PINNED YEAR
// V2 (Scrapbook / ZINE) を土台に、V3 の「左端に年号が貼り付いてスクロールで
// 切り替わる」仕組みを移植したハイブリッド。
// - マーキー / テープ / スタンプ / ポラロイド散らし → V2 から踏襲
// - 巨大年号の sticky pin → V3 から移植。スタイルだけ ZINE 寄りに調整。

function V2PlusScrapbookPinned() {
  const [dir, setDir] = useDirection();
  const ordered = sortedLives(dir);
  const counts = yearCounts();
  const scrollRef = React.useRef(null);
  const yearRefs = React.useMemo(
    () =>
      YEARS.reduce((acc, y) => {
        acc[y] = React.createRef();
        return acc;
      }, {}),
    [],
  );
  const activeYear = useActiveYear(
    scrollRef,
    YEARS.map((y) => ({ year: y, ref: yearRefs[y] })),
  );

  return (
    <div ref={scrollRef} className="mem-root" style={{ background: "#120a06" }}>
      <div className="mem-grain" style={{ opacity: 0.55 }} />
      <div className="mem-vignette" />

      {/* Top marquee — venues scroll across the masthead */}
      <div
        style={{
          borderBottom: "1px solid var(--rule)",
          overflow: "hidden",
          background: "#0a0604",
          position: "relative",
          zIndex: 3,
        }}
      >
        <div
          className="mem-marquee"
          style={{
            padding: "14px 0",
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 28,
            color: "var(--accent)",
          }}
        >
          {[...Array(2)].map((_, k) => (
            <React.Fragment key={k}>
              {LIVES.map((l) => (
                <span
                  key={k + "-" + l.id}
                  style={{
                    display: "inline-flex",
                    alignItems: "baseline",
                    gap: 16,
                  }}
                >
                  <span style={{ color: "var(--ember)" }}>✶</span>
                  {l.title}
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: "var(--sub)",
                      alignSelf: "center",
                    }}
                  >
                    {l.date} / {l.venue}
                  </span>
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Sticky bar — tape-strip style (V2) */}
      <StickyBarScrapbook
        dir={dir}
        setDir={setDir}
        activeYear={activeYear}
        counts={counts}
      />

      <section
        style={{
          padding: "80px 64px 120px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* メインタイトル */}
        <div
          style={{
            fontFamily: "var(--type)",
            fontSize: 12,
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: 20,
          }}
        >
          in memoriam · 2022.12.10 — 2026.04.27
        </div>
        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "clamp(96px, 11vw, 168px)",
            lineHeight: 0.92,
            letterSpacing: "-0.035em",
            marginBottom: 32,
          }}
        >
          a long&nbsp;howl,
          <br />
          for&nbsp;
          <span
            style={{
              color: "var(--accent)",
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontWeight: 700,
            }}
          >
            husky
          </span>
          <span style={{ color: "var(--accent)" }}>.</span>
        </div>

        {/* JP サブタイトル */}
        <div
          style={{
            fontFamily: "var(--jp)",
            fontWeight: 400,
            fontSize: 18,
            lineHeight: 2.0,
            letterSpacing: "0.02em",
            color: "rgba(240,227,200,0.85)",
            maxWidth: 620,
            paddingLeft: 18,
            borderLeft: "2px solid var(--accent)",
            marginBottom: 56,
          }}
        >
          2022年12月10日に池袋 SOUND PEACE で husky と出会い、
          <br />
          気づけば解散まで追い続けていました。
          <br />
          上がっている
          <span
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 28,
              color: "var(--accent)",
              verticalAlign: "-2px",
              margin: "0 4px",
            }}
          >
            {LIVES.length}
          </span>
          公演の写真は参戦したライブの記録です。
          <br />
          まったりアップロードしていくので、ゆるりとご覧ください。
        </div>

        {/* 補助行 */}
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--sub)",
            marginBottom: 64,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span>
            {dir === "forward" ? "oldest first" : "most recent first"}
          </span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>scroll to walk through</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span style={{ color: "var(--accent)" }} className="mem-pulse-dot">
            disbanded — 2026.04.27
          </span>
        </div>

        {/* 年ごとグループして sticky stacking */}
        <YearGroupedTimeline
          ordered={ordered}
          counts={counts}
          yearRefs={yearRefs}
          activeYear={activeYear}
        />
      </section>
    </div>
  );
}

// 年ごとに section を切り、その先頭に sticky 年バンドを置く。
// 次の年セクションがビューポートに入ると、前の年バンドは
// 自動的に押し出される（sticky stacking）。
function YearGroupedTimeline({ ordered, counts, yearRefs, activeYear }) {
  const groups = React.useMemo(() => {
    const map = new Map();
    ordered.forEach((live) => {
      if (!map.has(live.year)) map.set(live.year, []);
      map.get(live.year).push(live);
    });
    return [...map.entries()];
  }, [ordered]);

  return (
    <>
      {groups.map(([year, lives], gi) => (
        <section
          key={year}
          ref={yearRefs[year]}
          id={`y${year}`}
          style={{ position: "relative", marginBottom: 24 }}
        >
          <ZineStickyYearBand
            year={year}
            count={counts[year] || 0}
            chapterIdx={YEARS.indexOf(year)}
            active={activeYear === year}
          />
          {lives.map((live, i) => (
            <ScrapbookSpread key={live.id} live={live} index={gi * 100 + i} />
          ))}
        </section>
      ))}
    </>
  );
}

// スクロールで頂部に貼り付く年バンド。
// スティッキーバーの下 (top: 56) にテープ年号・章・般語を並べる。
function ZineStickyYearBand({ year, count, chapterIdx, active }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 56,
        zIndex: 4,
        margin: "0 -64px",
        padding: "14px 64px",
        background: "rgba(18,10,6,0.86)",
        backdropFilter: "blur(12px) saturate(120%)",
        borderTop: "1px solid var(--rule)",
        borderBottom: "1px solid var(--rule)",
        display: "flex",
        alignItems: "center",
        gap: 24,
      }}
    >
      {/* テープ年号 */}
      <div
        style={{
          position: "relative",
          display: "inline-block",
          padding: "2px 18px 4px",
          background: "rgba(240,227,200,0.92)",
          color: "#1a120a",
          boxShadow: "0 6px 14px rgba(0,0,0,0.45)",
          transform: "rotate(-1.4deg)",
          flex: "0 0 auto",
        }}
      >
        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 64,
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
          }}
        >
          {year}
        </div>
        <div
          style={{
            position: "absolute",
            top: -8,
            left: -16,
            width: 70,
            height: 18,
            background: "rgba(232,162,92,0.55)",
            mixBlendMode: "screen",
            transform: "rotate(-10deg)",
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 5px)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
          }}
        />
      </div>

      {/* 章・サブ文言 */}
      <div>
        <div
          style={{
            fontFamily: "var(--type)",
            fontSize: 11,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: active ? "var(--hot)" : "var(--sub)",
            transition: "color .4s",
          }}
        >
          chapter {["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ"][chapterIdx]} · {count}{" "}
          {count === 1 ? "night" : "nights"}
        </div>
        <div
          style={{
            fontFamily: "var(--jp)",
            fontWeight: 400,
            fontSize: 14,
            color: "var(--fg)",
            marginTop: 4,
          }}
        >
          {year === "2022" && "出会いの年。"}
          {year === "2023" && "通うようになった年。"}
          {year === "2024" && "転換点の年。"}
          {year === "2025" && "走り抜けた年。"}
          {year === "2026" && "終演の年 — 4.27 解散。"}
        </div>
      </div>
    </div>
  );
}

// 左サイドに sticky で張り付く巨大年号。
// V3 の PinnedYear と同じ思想だが、ZINE トーンに合わせてテープ風の枠と
// 手書き風の補助テキストを追加。
function PinnedYearZine({ year, count }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 140,
        left: 0,
        width: 0, // フローを邪魔しない
        height: 0,
        zIndex: 4,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 36,
          width: 150,
        }}
      >
        <div
          style={{
            fontFamily: "var(--type)",
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--sub)",
            marginBottom: 8,
          }}
        >
          chapter
        </div>
        {/* テープ風の四角に巨大年号 */}
        <div
          style={{
            position: "relative",
            display: "inline-block",
            padding: "2px 14px 6px",
            background: "rgba(240,227,200,0.92)",
            color: "#1a120a",
            boxShadow: "0 8px 18px rgba(0,0,0,0.45)",
            transform: "rotate(-2.4deg)",
          }}
        >
          <div
            key={year}
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 108,
              lineHeight: 0.86,
              letterSpacing: "-0.04em",
              animation: "mem-year-in .55s ease",
            }}
          >
            {year}
          </div>
          {/* マスキングテープ */}
          <div
            style={{
              position: "absolute",
              top: -10,
              left: -18,
              width: 90,
              height: 22,
              background: "rgba(232,162,92,0.55)",
              mixBlendMode: "screen",
              transform: "rotate(-12deg)",
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 5px)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
            }}
          />
        </div>
        <div
          style={{
            fontFamily: "var(--type)",
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginTop: 14,
            transform: "rotate(-1deg)",
          }}
        >
          · {count} {count === 1 ? "night" : "nights"} ·
        </div>
      </div>
      <style>{`
        @keyframes mem-year-in {
          from { opacity: 0; transform: translateY(14px) rotate(-4deg); filter: blur(6px); }
          to   { opacity: 1; transform: translateY(0)    rotate(0);     filter: blur(0); }
        }
      `}</style>
    </div>
  );
}

// 巨大年号は左に sticky で出るので、本文の章境界は薄いラインだけ。
// ただし「いま新しい章に入った」感を出すために小さい年号バッジは置く。
function ZineYearSep({ innerRef, year, count, active }) {
  return (
    <div
      ref={innerRef}
      id={`y${year}`}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 16,
        margin: "56px 0 16px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--type)",
          fontSize: 11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: active ? "var(--hot)" : "var(--sub)",
          transition: "color .4s",
        }}
      >
        — {year} / {count}n
      </div>
      <div style={{ flex: 1, height: 1, background: "var(--rule)" }} />
    </div>
  );
}

Object.assign(window, { V2PlusScrapbookPinned });
