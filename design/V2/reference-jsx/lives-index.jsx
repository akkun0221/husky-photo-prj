// LIVES INDEX PAGE — V2+ aesthetic
// page.tsx の置き換えイメージ。リスト主体だがスクラップブックの語彙
// （テープ年号 / 赤スタンプ / 微傾きポラ / マーキー / メンバー swatch）を
// 継承して、Memorial（トップ）と地続きに見えるようにする。

function LivesIndexDesktop() {
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

  // 年ごとにグルーピング（リストは年ごと縦に並べる構造）
  const groups = React.useMemo(() => {
    const map = new Map();
    ordered.forEach((live) => {
      if (!map.has(live.year)) map.set(live.year, []);
      map.get(live.year).push(live);
    });
    return [...map.entries()];
  }, [ordered]);

  return (
    <div ref={scrollRef} className="mem-root" style={{ background: "#120a06" }}>
      <div className="mem-grain" style={{ opacity: 0.5 }} />
      <div className="mem-vignette" />

      {/* マーキー */}
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

      <StickyBarScrapbook
        dir={dir}
        setDir={setDir}
        activeYear={activeYear}
        counts={counts}
      />

      <main
        style={{ padding: "80px 64px 120px", position: "relative", zIndex: 2 }}
      >
        {/* ARCHIVE / LIVES 見出し */}
        <div
          style={{
            fontFamily: "var(--type)",
            fontSize: 12,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: 12,
          }}
        >
          archive · index
        </div>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(96px, 12vw, 200px)",
            lineHeight: 0.9,
            letterSpacing: "-0.035em",
            margin: 0,
          }}
        >
          Lives<span style={{ color: "var(--accent)" }}>.</span>
        </h1>
        <div
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "baseline",
            gap: 18,
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--sub)",
          }}
        >
          <span style={{ color: "var(--fg)" }}>
            <span
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: 24,
                color: "var(--accent)",
                verticalAlign: "-2px",
                marginRight: 4,
              }}
            >
              {LIVES.length}
            </span>
            shows documented
          </span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>2022.12.10 — 2026.04.27</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span style={{ color: "var(--accent)" }} className="mem-pulse-dot">
            disbanded
          </span>
        </div>

        {/* 年セクション × ライブ行 */}
        <div style={{ marginTop: 80 }}>
          {groups.map(([year, lives], gi) => (
            <section
              key={year}
              ref={yearRefs[year]}
              id={`y${year}`}
              style={{ marginBottom: 68 }}
            >
              <LivesYearHeader
                year={year}
                count={counts[year] || 0}
                feature={lives[0]}
                isActive={activeYear === year}
              />
              <ul
                style={{
                  listStyle: "none",
                  margin: "24px 0 0",
                  padding: 0,
                  borderTop: "1px solid var(--rule)",
                }}
              >
                {lives.map((live, i) => (
                  <LivesRow
                    key={live.id}
                    live={live}
                    trackNo={i + 1}
                    yearTotal={lives.length}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div
          style={{
            marginTop: 24,
            paddingTop: 24,
            borderTop: "1px double var(--rule)",
            textAlign: "center",
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          ── end of index ──
        </div>
      </main>
    </div>
  );
}

function LivesYearHeader({ year, count, feature, isActive }) {
  const seed = parseInt(feature.id.slice(1), 10);
  const tilt = ((seed % 7) - 3) * 0.6;
  return (
    <header
      style={{
        position: "sticky",
        top: 56,
        zIndex: 4,
        margin: "0 -64px",
        padding: "14px 64px 14px",
        background: "rgba(18,10,6,0.86)",
        backdropFilter: "blur(12px) saturate(120%)",
        borderTop: "1px solid var(--rule)",
        borderBottom: "1px solid var(--rule)",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        gap: 28,
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
          transform: `rotate(${(seed % 2 === 0 ? -1 : 1) * 1.2}deg)`,
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

      {/* 中間 — chapter info + 章サブ */}
      <div>
        <div
          style={{
            fontFamily: "var(--type)",
            fontSize: 12,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: isActive ? "var(--hot)" : "var(--sub)",
            transition: "color .4s",
          }}
        >
          chapter {["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ"][YEARS.indexOf(year)]} · {count}{" "}
          {count === 1 ? "night" : "nights"} on record
        </div>
        <div
          style={{
            fontFamily: "var(--jp)",
            fontWeight: 400,
            fontSize: 16,
            color: "var(--sub)",
            marginTop: 6,
          }}
        >
          {year === "2022" && "出会いの年。"}
          {year === "2023" && "通うようになった年。"}
          {year === "2024" && "転換点の年。"}
          {year === "2025" && "走り抜けた年。"}
          {year === "2026" && "終演の年 — 4.27 解散。"}
        </div>
      </div>

      {/* フィーチャー・ポラロイド（その年の代表ショット） */}
      <div
        style={{
          width: 64,
          transform: `rotate(${tilt}deg)`,
          flex: "0 0 auto",
        }}
      >
        <PhotoStage
          seeds={feature.seeds}
          aspect="4/5"
          shape="polaroid"
          filter="mem-photo-warm"
        >
          <TapeStrip top={-6} left="50%" rot={-6} />
        </PhotoStage>
      </div>
    </header>
  );
}

function LivesRow({ live, trackNo, yearTotal }) {
  return (
    <li
      style={{
        borderBottom: "1px dashed var(--faint)",
      }}
    >
      <a
        href={`/lives/${live.id}`}
        style={{
          display: "grid",
          gridTemplateColumns: "60px 50px 140px 1fr auto 30px",
          alignItems: "baseline",
          gap: 18,
          padding: "14px 4px",
          textDecoration: "none",
          color: "var(--fg)",
          transition: "background .2s, color .2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(240,227,200,0.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        {/* track # */}
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.2em",
            color: "var(--sub)",
          }}
        >
          TR.{String(trackNo).padStart(2, "0")}/
          {String(yearTotal).padStart(2, "0")}
        </span>
        {/* weekday */}
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--sub)",
          }}
        >
          {live.weekday}
        </span>
        {/* date italic */}
        <span
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 22,
            letterSpacing: "-0.01em",
          }}
        >
          {live.date}
        </span>
        {/* title */}
        <span
          style={{
            fontFamily: "var(--jp)",
            fontWeight: 600,
            fontSize: 17,
            lineHeight: 1.35,
          }}
        >
          {live.title}
        </span>
        {/* venue */}
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--sub)",
          }}
        >
          @ {live.venue}
        </span>
        {/* arrow */}
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 14,
            letterSpacing: "0.1em",
            color: "var(--accent)",
            justifySelf: "end",
          }}
        >
          →
        </span>
      </a>
    </li>
  );
}

// ── Mobile ──
function LivesIndexMobile() {
  const [dir, setDir] = useDirection();
  const ordered = sortedLives(dir);
  const counts = yearCounts();

  const groups = React.useMemo(() => {
    const map = new Map();
    ordered.forEach((live) => {
      if (!map.has(live.year)) map.set(live.year, []);
      map.get(live.year).push(live);
    });
    return [...map.entries()];
  }, [ordered]);

  return (
    <div className="mem-root" style={{ background: "#120a06" }}>
      <div className="mem-grain" style={{ opacity: 0.5 }} />
      <div className="mem-vignette" />

      {/* 短いマーキー */}
      <div
        style={{
          overflow: "hidden",
          background: "#0a0604",
          borderBottom: "1px solid var(--rule)",
          position: "relative",
          zIndex: 3,
        }}
      >
        <div
          className="mem-marquee"
          style={{
            padding: "9px 0",
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontSize: 18,
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
                    gap: 10,
                  }}
                >
                  <span style={{ color: "var(--ember)" }}>✶</span>
                  <span>{l.title}</span>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 9,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "var(--sub)",
                      alignSelf: "center",
                    }}
                  >
                    {l.date}
                  </span>
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <MobileV2PlusNav dir={dir} setDir={setDir} counts={counts} />

      <header style={{ padding: "36px 24px 16px" }}>
        <div
          style={{
            fontFamily: "var(--type)",
            fontSize: 10,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          archive · index
        </div>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 84,
            lineHeight: 0.9,
            letterSpacing: "-0.035em",
            margin: "10px 0 14px",
          }}
        >
          Lives<span style={{ color: "var(--accent)" }}>.</span>
        </h1>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--sub)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 20,
              color: "var(--accent)",
              verticalAlign: "-2px",
              marginRight: 4,
            }}
          >
            {LIVES.length}
          </span>
          shows · 2022 — 2026
        </div>
      </header>

      {groups.map(([year, lives], gi) => (
        <section
          key={year}
          id={`y${year}`}
          style={{
            position: "relative",
            paddingBottom: 16,
          }}
        >
          {/* sticky 年号ヘッダ — 次の年が押し出す */}
          <div
            style={{
              position: "sticky",
              top: 90,
              zIndex: 4,
              padding: "10px 24px",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              background: "rgba(18,10,6,0.88)",
              backdropFilter: "blur(10px)",
              borderBottom: "1px solid var(--rule)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: 48,
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                color: "var(--accent)",
              }}
            >
              {year}
            </div>
            <div
              style={{
                fontFamily: "var(--type)",
                fontSize: 9,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--sub)",
              }}
            >
              ch.{["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ"][YEARS.indexOf(year)]} ·{" "}
              {counts[year] || 0}n
            </div>
          </div>

          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: "0 24px",
              borderTop: "1px solid var(--rule)",
            }}
          >
            {lives.map((live, i) => (
              <li
                key={live.id}
                style={{
                  borderBottom: "1px dashed var(--faint)",
                }}
              >
                <a
                  href={`/lives/${live.id}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "40px 1fr auto",
                    alignItems: "baseline",
                    gap: 12,
                    padding: "14px 0",
                    textDecoration: "none",
                    color: "var(--fg)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 9,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--sub)",
                      lineHeight: 1.6,
                    }}
                  >
                    {live.weekday}
                    <br />
                    <span style={{ opacity: 0.7 }}>{live.date.slice(5)}</span>
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--jp)",
                        fontWeight: 600,
                        fontSize: 16,
                        lineHeight: 1.3,
                      }}
                    >
                      {live.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 10,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--sub)",
                        marginTop: 4,
                      }}
                    >
                      {live.venue}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 14,
                      color: "var(--accent)",
                    }}
                  >
                    →
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div
        style={{
          padding: "40px 24px 80px",
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          textAlign: "center",
          color: "var(--accent)",
        }}
      >
        ── end of index ──
      </div>
    </div>
  );
}

Object.assign(window, { LivesIndexDesktop, LivesIndexMobile });
