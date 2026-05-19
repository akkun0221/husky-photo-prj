// LIVE DETAIL PAGE — /lives/[id]
// V2+ aesthetic で個別ライブの写真ギャラリー。
// 写真は縦横比をそのまま、CSS columns で desktop 5 / mobile 3 列の不揃いグリッドに。

// 各写真のアスペクトをシード固定で混在させるためのヘルパー。
const ASPECTS = [
  { w: 600, h: 900, ratio: "2/3" }, // 縦
  { w: 900, h: 600, ratio: "3/2" }, // 横
  { w: 800, h: 800, ratio: "1/1" }, // スクエア
  { w: 600, h: 800, ratio: "3/4" }, // やや縦
  { w: 900, h: 600, ratio: "3/2" },
  { w: 600, h: 900, ratio: "2/3" },
  { w: 1000, h: 700, ratio: "10/7" },
  { w: 720, h: 960, ratio: "3/4" },
];

function detailPhotosFor(live) {
  // 1ライブにつき 24 枚の placeholder。アスペクトはシードで決定的に混ぜる。
  const base = parseInt(live.id.slice(1), 10) * 7;
  return Array.from({ length: 24 }, (_, i) => {
    const ap = ASPECTS[(base + i) % ASPECTS.length];
    const seed = (live.seeds[i % live.seeds.length] + i * 13 + base) % 1080;
    return {
      url: `https://picsum.photos/seed/h${seed}/${ap.w}/${ap.h}`,
      ratio: ap.ratio,
    };
  });
}

// 写真を1枚表示するだけのカード（PhotoStage はスライドショー用なのでここでは使わない）
function GalleryPhoto({ photo, tilt = 0 }) {
  return (
    <a
      href="#"
      style={{
        display: "block",
        position: "relative",
        breakInside: "avoid",
        marginBottom: "var(--gap, 14px)",
        transform: `rotate(${tilt}deg)`,
        transition: "transform .25s ease, box-shadow .25s",
        boxShadow: "0 10px 22px rgba(0,0,0,0.45)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `rotate(${tilt}deg) scale(1.02)`;
        e.currentTarget.style.boxShadow = "0 18px 36px rgba(0,0,0,0.7)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${tilt}deg)`;
        e.currentTarget.style.boxShadow = "0 10px 22px rgba(0,0,0,0.45)";
      }}
    >
      <img
        src={photo.url}
        alt=""
        loading="lazy"
        className="mem-photo"
        style={{
          display: "block",
          width: "100%",
          aspectRatio: photo.ratio,
          objectFit: "cover",
          background: "#0a0604",
        }}
      />
    </a>
  );
}

// ── Desktop ──
function LiveDetailDesktop() {
  const [dir, setDir] = useDirection();
  const counts = yearCounts();
  // 詳細ページに飛ばす対象ライブ。代表として 2026 開幕公演を使う。
  const live = LIVES.find((l) => l.id === "l08") || LIVES[0];
  const photos = React.useMemo(() => detailPhotosFor(live), [live.id]);

  // ライブごとに参加したメンバー（仮）。実 DB ではタグから引く。
  const lineup = MEMBERS.slice(0, 3 + (parseInt(live.id.slice(1), 10) % 3));

  return (
    <div
      className="mem-root"
      style={{ background: "#120a06", "--gap": "14px" }}
    >
      <div className="mem-grain" style={{ opacity: 0.5 }} />
      <div className="mem-vignette" />

      <MembersMarquee />

      <StickyBarScrapbook
        dir={dir}
        setDir={setDir}
        activeYear={live.year}
        counts={counts}
      />

      <main
        style={{ padding: "56px 64px 80px", position: "relative", zIndex: 2 }}
      >
        {/* 戻る */}
        <a
          href="/lives"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: "var(--sub)",
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          <svg
            width="22"
            height="8"
            viewBox="0 0 22 8"
            fill="none"
            style={{ transform: "scaleX(-1)" }}
          >
            <path
              d="M0 4h18M14 1l4 3-4 3"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
          back to lives
        </a>

        {/* ヘッダ */}
        <header
          style={{
            marginTop: 28,
            paddingBottom: 32,
            borderBottom: "1px solid var(--rule)",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "end",
            gap: 32,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--type)",
                fontSize: 12,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "var(--accent)",
              }}
            >
              live · chapter{" "}
              {["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ"][YEARS.indexOf(live.year)]} · entry{" "}
              {live.id.slice(1)}
            </div>
            <div
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(72px, 9vw, 156px)",
                lineHeight: 0.9,
                letterSpacing: "-0.035em",
                margin: "12px 0 8px",
              }}
            >
              {live.date.split(".").map((p, i, arr) => (
                <span
                  key={i}
                  style={{
                    color: i === arr.length - 1 ? "var(--accent)" : "var(--fg)",
                  }}
                >
                  {p}
                  {i < arr.length - 1 ? "." : ""}
                </span>
              ))}
            </div>
            <div
              style={{
                fontFamily: "var(--jp)",
                fontWeight: 700,
                fontSize: 34,
                lineHeight: 1.25,
                maxWidth: 700,
              }}
            >
              {live.title}
            </div>
            <div
              style={{
                marginTop: 14,
                display: "flex",
                alignItems: "center",
                gap: 18,
                flexWrap: "wrap",
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--sub)",
              }}
            >
              <span>{live.weekday}</span>
              <span style={{ opacity: 0.5 }}>·</span>
              <span>@ {live.venue}</span>
              <span style={{ opacity: 0.5 }}>·</span>
              <span>{photos.length} photos</span>
            </div>
            {/* lineup */}
            <div
              style={{
                marginTop: 18,
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "var(--sub)",
                  marginRight: 6,
                }}
              >
                lineup
              </span>
              {lineup.map((m, i) => (
                <a
                  key={m.id}
                  href={`/members?member=${m.id}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "5px 10px 5px 5px",
                    border: "1px solid var(--rule)",
                    color: "var(--fg)",
                    textDecoration: "none",
                    transform: `rotate(${((i % 2 === 0 ? -1 : 1) * 0.6).toFixed(2)}deg)`,
                    fontFamily: "var(--type)",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      background: m.color,
                      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.4)",
                    }}
                  />
                  {m.name}
                </a>
              ))}
            </div>
          </div>

          {/* 赤スタンプ */}
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              border: "3px double rgba(184,90,58,0.85)",
              color: "rgba(184,90,58,0.85)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(-6deg)",
              fontFamily: "var(--type)",
              textTransform: "uppercase",
              textAlign: "center",
              flex: "0 0 auto",
            }}
          >
            <div style={{ fontSize: 11, letterSpacing: "0.2em" }}>filed</div>
            <div
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: 34,
                letterSpacing: "-0.02em",
                margin: "2px 0",
              }}
            >
              {live.date.split(".")[1]}.{live.date.split(".")[2]}
            </div>
            <div style={{ fontSize: 11, letterSpacing: "0.2em" }}>
              {live.year}
            </div>
          </div>
        </header>

        {/* ギャラリー — CSS columns で 5列、縦横比そのまま */}
        <section
          style={{
            marginTop: 40,
            columnCount: 5,
            columnGap: 14,
          }}
        >
          {photos.map((p, i) => {
            const tilt = (((parseInt(live.id.slice(1), 10) + i) % 9) - 4) * 0.3;
            return <GalleryPhoto key={i} photo={p} tilt={tilt} />;
          })}
        </section>

        {/* prev / next ライブ */}
        <LiveDetailNav live={live} />
      </main>
    </div>
  );
}

// ── Mobile ──
function LiveDetailMobile() {
  const [dir, setDir] = useDirection();
  const counts = yearCounts();
  const live = LIVES.find((l) => l.id === "l08") || LIVES[0];
  const photos = React.useMemo(() => detailPhotosFor(live), [live.id]);
  const lineup = MEMBERS.slice(0, 3 + (parseInt(live.id.slice(1), 10) % 3));

  return (
    <div className="mem-root" style={{ background: "#120a06", "--gap": "8px" }}>
      <div className="mem-grain" style={{ opacity: 0.5 }} />
      <div className="mem-vignette" />

      {/* マーキー */}
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

      <main style={{ padding: "28px 24px 60px" }}>
        <a
          href="/lives"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            color: "var(--sub)",
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          ← back
        </a>

        {/* ヘッダ */}
        <header
          style={{
            marginTop: 18,
            paddingBottom: 22,
            borderBottom: "1px solid var(--rule)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--type)",
              fontSize: 10,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            live · chapter {["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ"][YEARS.indexOf(live.year)]}
          </div>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: 64,
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
              margin: "8px 0 6px",
            }}
          >
            {live.date.split(".").map((p, i, arr) => (
              <span
                key={i}
                style={{
                  color: i === arr.length - 1 ? "var(--accent)" : "var(--fg)",
                }}
              >
                {p}
                {i < arr.length - 1 ? "." : ""}
              </span>
            ))}
          </div>
          <div
            style={{
              fontFamily: "var(--jp)",
              fontWeight: 700,
              fontSize: 22,
              lineHeight: 1.3,
            }}
          >
            {live.title}
          </div>
          <div
            style={{
              marginTop: 8,
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--sub)",
              lineHeight: 1.7,
            }}
          >
            {live.weekday} · @ {live.venue}
            <br />
            {photos.length} photos
          </div>
          {/* lineup */}
          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            {lineup.map((m, i) => (
              <a
                key={m.id}
                href={`/members?member=${m.id}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 9px 4px 4px",
                  border: "1px solid var(--rule)",
                  color: "var(--fg)",
                  textDecoration: "none",
                  transform: `rotate(${((i % 2 === 0 ? -1 : 1) * 0.6).toFixed(2)}deg)`,
                  fontFamily: "var(--type)",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ width: 12, height: 12, background: m.color }} />
                {m.name}
              </a>
            ))}
          </div>
        </header>

        {/* ギャラリー — 3列 */}
        <section
          style={{
            marginTop: 22,
            columnCount: 3,
            columnGap: 8,
          }}
        >
          {photos.map((p, i) => {
            const tilt = (((parseInt(live.id.slice(1), 10) + i) % 9) - 4) * 0.3;
            return <GalleryPhoto key={i} photo={p} tilt={tilt} />;
          })}
        </section>

        <LiveDetailNavMobile live={live} />
      </main>
    </div>
  );
}

// 前後ライブナビ
function LiveDetailNav({ live }) {
  const idx = LIVES.findIndex((l) => l.id === live.id);
  const prev = idx > 0 ? LIVES[idx - 1] : null;
  const next = idx < LIVES.length - 1 ? LIVES[idx + 1] : null;

  return (
    <nav
      style={{
        marginTop: 56,
        paddingTop: 28,
        borderTop: "1px double var(--rule)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
      }}
    >
      {[prev, next].map((l, i) =>
        l ? (
          <a
            key={i}
            href={`/lives/${l.id}`}
            style={{
              display: "block",
              padding: "18px 22px",
              border: "1px solid var(--rule)",
              textDecoration: "none",
              color: "var(--fg)",
              textAlign: i === 0 ? "left" : "right",
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "var(--accent)",
              }}
            >
              {i === 0 ? "← previous" : "next →"}
            </div>
            <div
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 26,
                marginTop: 6,
              }}
            >
              {l.date}
            </div>
            <div
              style={{
                fontFamily: "var(--jp)",
                fontWeight: 600,
                fontSize: 14,
                marginTop: 4,
              }}
            >
              {l.title}
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
              {l.venue}
            </div>
          </a>
        ) : (
          <div key={i} />
        ),
      )}
    </nav>
  );
}

function LiveDetailNavMobile({ live }) {
  const idx = LIVES.findIndex((l) => l.id === live.id);
  const prev = idx > 0 ? LIVES[idx - 1] : null;
  const next = idx < LIVES.length - 1 ? LIVES[idx + 1] : null;
  return (
    <nav
      style={{
        marginTop: 36,
        paddingTop: 22,
        borderTop: "1px double var(--rule)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
      }}
    >
      {[prev, next].map((l, i) =>
        l ? (
          <a
            key={i}
            href={`/lives/${l.id}`}
            style={{
              display: "block",
              padding: "12px 14px",
              border: "1px solid var(--rule)",
              textDecoration: "none",
              color: "var(--fg)",
              textAlign: i === 0 ? "left" : "right",
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 9,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "var(--accent)",
              }}
            >
              {i === 0 ? "← prev" : "next →"}
            </div>
            <div
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 18,
                marginTop: 4,
                lineHeight: 1,
              }}
            >
              {l.date.slice(5)}
            </div>
            <div
              style={{
                fontFamily: "var(--jp)",
                fontWeight: 600,
                fontSize: 12,
                marginTop: 4,
                lineHeight: 1.3,
              }}
            >
              {l.title.length > 14 ? l.title.slice(0, 14) + "…" : l.title}
            </div>
          </a>
        ) : (
          <div key={i} />
        ),
      )}
    </nav>
  );
}

Object.assign(window, { LiveDetailDesktop, LiveDetailMobile });
