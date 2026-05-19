// V1 — FILMSTRIP CHRONICLE
// A newspaper-of-record take. Date/title sit in a left-justified column;
// every live ships with a sprocketed horizontal filmstrip of 3 photos that
// gently drift sideways. Year breaks read as chapter headings with a folio
// rule across the full column width.

function V1FilmstripChronicle() {
  const [dir, setDir] = useDirection();
  const ordered = sortedLives(dir);
  const counts = yearCounts();
  const scrollRef = React.useRef(null);

  // Year refs for active-year highlight on scroll.
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
    <div ref={scrollRef} className="mem-root">
      <div className="mem-grain" />

      {/* ── Masthead (non-sticky) ── */}
      <header
        style={{
          padding: "38px 56px 22px",
          borderBottom: "1px double var(--rule)",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "end",
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "var(--sub)",
          }}
        >
          Vol. I · No. 12 — Husky Archives Press
        </div>
        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 64,
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            textAlign: "center",
          }}
        >
          The Live Ledger
        </div>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "var(--sub)",
            textAlign: "right",
          }}
        >
          2022.12.10 — 2026.04.27
        </div>
      </header>

      {/* ── Sticky jump bar ── */}
      <StickyBarChronicle
        dir={dir}
        setDir={setDir}
        activeYear={activeYear}
        counts={counts}
      />

      {/* ── Timeline ── */}
      <section style={{ padding: "48px 56px 80px", position: "relative" }}>
        {/* opening tag */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 36,
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          ──{" "}
          {dir === "forward"
            ? "first frame · 2022.12.10"
            : "last frame · 2026.04.27"}{" "}
          ──
        </div>

        {ordered.map((live, i) => {
          const isYearStart = i === 0 || ordered[i - 1].year !== live.year;
          return (
            <React.Fragment key={live.id}>
              {isYearStart && (
                <ChronicleYearMark
                  innerRef={yearRefs[live.year]}
                  year={live.year}
                  count={counts[live.year] || 0}
                  active={activeYear === live.year}
                />
              )}
              <ChronicleRow live={live} />
            </React.Fragment>
          );
        })}

        <div
          style={{
            textAlign: "center",
            marginTop: 28,
            paddingTop: 28,
            borderTop: "1px double var(--rule)",
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          ──{" "}
          {dir === "forward"
            ? "fade to black · 2026.04.27"
            : "first shutter · 2022.12.10"}{" "}
          ──
        </div>
      </section>
    </div>
  );
}

function StickyBarChronicle({ dir, setDir, activeYear, counts }) {
  const cell = {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.32em",
    textTransform: "uppercase",
    color: "var(--sub)",
  };
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 5,
        background: "rgba(12,8,5,0.88)",
        backdropFilter: "blur(14px) saturate(120%)",
        borderTop: "1px solid var(--rule)",
        borderBottom: "1px double var(--rule)",
        padding: "10px 56px",
        display: "flex",
        alignItems: "center",
        gap: 28,
      }}
    >
      <div style={{ ...cell, flex: "0 0 auto" }}>folio</div>
      <div
        style={{
          display: "flex",
          flex: "1 1 auto",
          gap: 0,
          borderLeft: "1px solid var(--rule)",
        }}
      >
        {YEARS.map((y) => (
          <a
            key={y}
            href={`#y${y}`}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "8px 0",
              borderRight: "1px solid var(--rule)",
              background: activeYear === y ? "var(--ember)" : "transparent",
              color: activeYear === y ? "#fff" : "var(--fg)",
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 18,
              textDecoration: "none",
              transition: "background .25s",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {y}
            <span
              style={{
                ...cell,
                fontSize: 9,
                color:
                  activeYear === y ? "rgba(255,255,255,0.7)" : "var(--sub)",
              }}
            >
              {counts[y] || 0}
            </span>
          </a>
        ))}
      </div>
      <div
        style={{
          flex: "0 0 auto",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div style={cell}>edition</div>
        <div style={{ display: "flex", border: "1px solid var(--rule)" }}>
          {[
            ["forward", "Morning", "22→26"],
            ["reverse", "Evening", "26→22"],
          ].map(([k, label, sub]) => (
            <button
              key={k}
              onClick={() => setDir(k)}
              style={{
                border: "none",
                background: dir === k ? "var(--accent)" : "transparent",
                color: dir === k ? "#1a120a" : "var(--fg)",
                padding: "7px 12px",
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "baseline",
                gap: 8,
              }}
            >
              {label}
              <span
                style={{
                  ...cell,
                  fontSize: 9,
                  color: dir === k ? "rgba(26,18,10,0.7)" : "var(--sub)",
                }}
              >
                {sub}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChronicleYearMark({ innerRef, year, count, active }) {
  return (
    <div
      ref={innerRef}
      id={`y${year}`}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: 24,
        margin: "52px 0 28px",
      }}
    >
      <div style={{ height: 1, background: "var(--rule)" }} />
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--sub)",
          }}
        >
          Chapter {YEARS.indexOf(year) + 1}
        </div>
        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 84,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: active ? "var(--hot)" : "var(--fg)",
            transition: "color .4s",
          }}
        >
          {year}
        </div>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--sub)",
          }}
        >
          {count} {count === 1 ? "live" : "lives"}
        </div>
      </div>
      <div style={{ height: 1, background: "var(--rule)" }} />
    </div>
  );
}

function ChronicleRow({ live }) {
  // Three sprocketed panels — same set of seeds, but each animates
  // independently (own random schedule) so the strip never reads as a
  // single tile flipping.
  const a = live.seeds,
    b = [...a].reverse(),
    c = [a[2], a[0], a[3], a[1]];
  return (
    <article
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(260px, 30%) 1fr",
        gap: 48,
        padding: "30px 0",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      <div style={{ paddingTop: 6 }}>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--sub)",
          }}
        >
          {live.weekday} · {live.venue}
        </div>
        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 56,
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
            marginTop: 8,
          }}
        >
          {live.date}
        </div>
        <div
          style={{
            fontFamily: "var(--jp)",
            fontWeight: 600,
            fontSize: 19,
            marginTop: 12,
            lineHeight: 1.3,
          }}
        >
          {live.title}
        </div>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginTop: 18,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <svg width="28" height="10" viewBox="0 0 28 10" fill="none">
            <path
              d="M0 5h25M19 1l5 4-5 4"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
          view {live.seeds.length * 4} photos
        </div>
      </div>
      <div
        className="mem-drift-h"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 4,
          background: "#1a120a",
          padding: "22px 12px",
          position: "relative",
        }}
      >
        <PhotoStage
          seeds={a}
          aspect="4/3"
          shape="filmstrip"
          filter="mem-photo"
        />
        <PhotoStage
          seeds={b}
          aspect="4/3"
          shape="filmstrip"
          filter="mem-photo"
        />
        <PhotoStage
          seeds={c}
          aspect="4/3"
          shape="filmstrip"
          filter="mem-photo"
        />
      </div>
    </article>
  );
}

// ────────────────────────────────────────────────────────────────────────
// V2 — ASYMMETRIC SCRAPBOOK / ZINE
// Photos pasted at irregular sizes and slight rotations, masking-tape
// strips, hand-stamp year ornaments, marquee venue strip. The page itself
// feels like the inside of a tour photobook.

function V2Scrapbook() {
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
      <div className="mem-grain" style={{ opacity: 0.6 }} />
      <div className="mem-vignette" />

      {/* Top marquee — venues scroll across the masthead like a banner */}
      <div
        style={{
          borderBottom: "1px solid var(--rule)",
          overflow: "hidden",
          background: "#0a0604",
          position: "relative",
          zIndex: 2,
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

      {/* Sticky bar — tape-strip style */}
      <StickyBarScrapbook
        dir={dir}
        setDir={setDir}
        activeYear={activeYear}
        counts={counts}
      />

      <section
        style={{ padding: "80px 64px 120px", position: "relative", zIndex: 2 }}
      >
        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 96,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            marginBottom: 12,
          }}
        >
          Tour&nbsp;Diary,
          <br />
          <span style={{ color: "var(--accent)" }}>off the cuff.</span>
        </div>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--sub)",
            maxWidth: 460,
            marginBottom: 64,
          }}
        >
          taped-together pages from {LIVES.length} nights ·{" "}
          {dir === "forward" ? "oldest first" : "most recent first"} · scroll to
          walk through
        </div>

        {ordered.map((live, i) => {
          const isYearStart = i === 0 || ordered[i - 1].year !== live.year;
          return (
            <React.Fragment key={live.id}>
              {isYearStart && (
                <ScrapbookYearMark
                  innerRef={yearRefs[live.year]}
                  year={live.year}
                  count={counts[live.year] || 0}
                  active={activeYear === live.year}
                />
              )}
              <ScrapbookSpread live={live} index={i} />
            </React.Fragment>
          );
        })}
      </section>
    </div>
  );
}

function StickyBarScrapbook({ dir, setDir, activeYear, counts }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 5,
        background: "rgba(18,10,6,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--rule)",
        padding: "14px 64px",
        display: "flex",
        alignItems: "center",
        gap: 22,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontFamily: "var(--type)",
            fontSize: 13,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--sub)",
          }}
        >
          play it
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            ["forward", "SIDE A"],
            ["reverse", "SIDE B"],
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setDir(k)}
              style={{
                border:
                  "1px solid " + (dir === k ? "var(--accent)" : "var(--rule)"),
                background: dir === k ? "var(--accent)" : "transparent",
                color: dir === k ? "#1a120a" : "var(--fg)",
                fontFamily: "var(--type)",
                fontSize: 13,
                letterSpacing: "0.16em",
                padding: "6px 14px",
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ width: 1, height: 24, background: "var(--rule)" }} />
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {YEARS.map((y, i) => (
          <a
            key={y}
            href={`#y${y}`}
            style={{
              position: "relative",
              padding: "8px 14px",
              background:
                activeYear === y ? "var(--accent)" : "rgba(240,227,200,0.07)",
              color: activeYear === y ? "#1a120a" : "var(--fg)",
              fontFamily: "var(--type)",
              fontSize: 14,
              letterSpacing: "0.06em",
              textDecoration: "none",
              textTransform: "uppercase",
              transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (0.6 + i * 0.3)}deg)`,
              display: "inline-flex",
              alignItems: "baseline",
              gap: 8,
              transition: "background .25s",
            }}
          >
            {y}
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                opacity: 0.6,
              }}
            >
              ×{counts[y] || 0}
            </span>
          </a>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      {/* Members — "play it" の対称側。色スウォッチ + 略名 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontFamily: "var(--type)",
            fontSize: 13,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--sub)",
          }}
        >
          by
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {MEMBERS.map((m, i) => (
            <a
              key={m.id}
              href={`#m-${m.id}`}
              title={m.name}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 8px 5px 5px",
                border: "1px solid var(--rule)",
                color: "var(--fg)",
                textDecoration: "none",
                transform: `rotate(${((i % 2 === 0 ? -1 : 1) * 0.5).toFixed(2)}deg)`,
                transition: "opacity .2s",
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  background: m.color,
                  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.35)",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--type)",
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {m.name}
              </span>
            </a>
          ))}
        </div>
      </div>
      <div style={{ width: 1, height: 24, background: "var(--rule)" }} />
      <div
        style={{
          fontFamily: "var(--type)",
          fontSize: 12,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--sub)",
        }}
        className="mem-pulse-dot"
      >
        rec
      </div>
    </div>
  );
}

function ScrapbookYearMark({ innerRef, year, count, active }) {
  return (
    <div
      ref={innerRef}
      id={`y${year}`}
      style={{
        position: "relative",
        margin: "72px 0 24px",
        height: 160,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          transform: "translateX(-50%) rotate(-2deg)",
          padding: "4px 32px",
          background: "rgba(240,227,200,0.92)",
          color: "#1a120a",
          boxShadow: "0 8px 18px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 168,
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
          }}
        >
          {year}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: "64%",
          top: 12,
          fontFamily: "var(--type)",
          fontSize: 14,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: active ? "var(--hot)" : "var(--sub)",
          transform: "rotate(8deg)",
          transition: "color .4s",
        }}
      >
        ·{count} dates·
      </div>
    </div>
  );
}

function ScrapbookSpread({ live, index }) {
  // Pseudo-random offsets seeded from the live id so layout is stable
  // between renders. Each spread has 3 photos at different scales/tilts
  // plus a tape strip and a stamp.
  const seed = parseInt(live.id.slice(1), 10);
  const r = (n, max) => ((Math.sin(seed * (n + 1) * 13.7) + 1) / 2) * max;
  const tilt1 = (r(0, 6) - 3).toFixed(2);
  const tilt2 = (r(1, 6) - 3).toFixed(2);
  const tilt3 = (r(2, 6) - 3).toFixed(2);
  const left = index % 2 === 0;

  return (
    <div
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 56,
        padding: "48px 0",
        minHeight: 480,
      }}
    >
      {/* Photo cluster */}
      <div
        style={{
          gridColumn: left ? 1 : 2,
          gridRow: 1,
          position: "relative",
          minHeight: 420,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "70%",
            transform: `rotate(${tilt1}deg)`,
          }}
        >
          <PhotoStage
            seeds={live.seeds}
            aspect="4/5"
            shape="polaroid"
            filter="mem-photo-warm"
          >
            <TapeStrip top={-12} left="20%" rot={-6} />
          </PhotoStage>
        </div>
        <div
          style={{
            position: "absolute",
            top: 180,
            right: 0,
            width: "55%",
            transform: `rotate(${tilt2}deg)`,
          }}
        >
          <PhotoStage
            seeds={[...live.seeds].reverse()}
            aspect="4/3"
            shape="inset"
            filter="mem-photo"
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: 320,
            left: "18%",
            width: "40%",
            transform: `rotate(${tilt3}deg)`,
          }}
        >
          <PhotoStage
            seeds={[live.seeds[1], live.seeds[3], live.seeds[0]]}
            aspect="1/1"
            shape="inset"
            filter="mem-photo-warm"
          />
          <TapeStrip top={-10} left="40%" rot={12} />
        </div>
      </div>

      {/* Text column */}
      <div
        style={{
          gridColumn: left ? 2 : 1,
          gridRow: 1,
          paddingTop: 40,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--sub)",
            padding: "4px 10px",
            border: "1px solid var(--rule)",
          }}
        >
          night {String(index + 1).padStart(2, "0")} · {live.weekday}
        </div>
        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 92,
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            marginTop: 14,
          }}
        >
          {live.date.split(".").map((p, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: 4,
                color: i === 2 ? "var(--accent)" : "var(--fg)",
              }}
            >
              {p}
              {i < 2 ? "." : ""}
            </span>
          ))}
        </div>
        <div
          style={{
            fontFamily: "var(--jp)",
            fontWeight: 600,
            fontSize: 28,
            marginTop: 18,
            lineHeight: 1.25,
            maxWidth: 360,
          }}
        >
          {live.title}
        </div>
        <div
          style={{
            fontFamily: "var(--type)",
            fontSize: 14,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginTop: 14,
            color: "var(--sub)",
          }}
        >
          @ {live.venue}
        </div>
        {/* Hand-stamp circle */}
        <div
          style={{
            position: "absolute",
            top: 30,
            right: 0,
            width: 110,
            height: 110,
            borderRadius: "50%",
            border: "2px solid var(--ember)",
            color: "var(--ember)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: `rotate(${(r(4, 18) - 9).toFixed(1)}deg)`,
            fontFamily: "var(--type)",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textAlign: "center",
            opacity: 0.85,
          }}
        >
          <div style={{ fontSize: 9 }}>archived</div>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 28,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              margin: "4px 0",
            }}
          >
            {live.year}
          </div>
          <div style={{ fontSize: 9 }}>· husky ·</div>
        </div>
      </div>
    </div>
  );
}

function TapeStrip({ top, left, rot = 0 }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        transform: `translateX(-50%) rotate(${rot}deg)`,
        width: 80,
        height: 22,
        background: "rgba(232,162,92,0.45)",
        mixBlendMode: "screen",
        boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 5px)",
      }}
    />
  );
}

Object.assign(window, { V1FilmstripChronicle, V2Scrapbook });
