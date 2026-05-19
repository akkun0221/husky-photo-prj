// MOBILE V2+ — Scrapbook for 390px
// V2+ のテイスト（テープ / マーキー / スタンプ / セピア＋琥珀）をそのまま縮め、
// 余白を多めにとり、写真は1ライブにつき1枚（ポラロイド）を中心に。
// 年号は「sticky stacking」で実装 — 各年セクションがそれぞれ独立に sticky
// なので、新しい年に入ると前の年のヘッダが自然に押し出される。

function MobileV2Plus() {
  const [dir, setDir] = useDirection();
  const ordered = sortedLives(dir);
  const counts = yearCounts();

  // 年ごとにグループ化（sticky stacking のため）
  const groups = React.useMemo(() => {
    const map = new Map();
    ordered.forEach((live) => {
      if (!map.has(live.year)) map.set(live.year, []);
      map.get(live.year).push(live);
    });
    return [...map.entries()]; // [[year, lives[]], ...]
  }, [ordered]);

  return (
    <div className="mem-root" style={{ background: "#120a06" }}>
      <div className="mem-grain" style={{ opacity: 0.5 }} />
      <div className="mem-vignette" />

      {/* 短めマーキー */}
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

      {/* Sticky 2段 nav */}
      <MobileV2PlusNav dir={dir} setDir={setDir} counts={counts} />

      {/* タイトル + JP サブタイトル */}
      <section style={{ padding: "40px 24px 28px" }}>
        <div
          style={{
            fontFamily: "var(--type)",
            fontSize: 10,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          in memoriam
          <br />
          2022.12.10 — 2026.04.27
        </div>
        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 64,
            lineHeight: 0.9,
            letterSpacing: "-0.035em",
            marginTop: 18,
          }}
        >
          a long howl,
          <br />
          for <span style={{ color: "var(--accent)" }}>husky</span>
          <span style={{ color: "var(--accent)" }}>.</span>
        </div>

        <div
          style={{
            fontFamily: "var(--jp)",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: 2.0,
            letterSpacing: "0.02em",
            color: "rgba(240,227,200,0.85)",
            paddingLeft: 12,
            marginTop: 24,
            borderLeft: "2px solid var(--accent)",
          }}
        >
          2022年12月10日に池袋 SOUND PEACE で<br />
          husky と出会い、気づけば
          <br />
          解散まで追い続けていました。
          <br />
          上がっている
          <span
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 22,
              color: "var(--accent)",
              verticalAlign: "-2px",
              margin: "0 3px",
            }}
          >
            {LIVES.length}
          </span>
          公演の写真は
          <br />
          参戦したライブの記録です。
          <br />
          まったりアップロードしていくので、
          <br />
          ゆるりとご覧ください。
        </div>

        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--sub)",
            marginTop: 30,
          }}
        >
          {dir === "forward"
            ? "oldest first · ↓ scroll"
            : "most recent first · ↓ scroll"}
        </div>
      </section>

      {/* 年ごとセクション（sticky stacking）*/}
      {groups.map(([year, lives], gi) => (
        <section
          key={year}
          id={`y${year}`}
          style={{
            position: "relative",
            paddingBottom: 24,
            borderTop: gi === 0 ? "1px solid var(--rule)" : "none",
          }}
        >
          {/* Sticky 年号ヘッダ — 次の年セクションが入るとここが自然に押し出される */}
          <div
            style={{
              position: "sticky",
              top: 90, // nav 2段の高さぶん
              zIndex: 4,
              padding: "10px 24px",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              background: "rgba(18,10,6,0.85)",
              backdropFilter: "blur(10px)",
              borderBottom: "1px solid var(--rule)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: 56,
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
                fontSize: 10,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--sub)",
              }}
            >
              ch.{["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ"][YEARS.indexOf(year)]} ·{" "}
              {counts[year] || 0} nights
            </div>
          </div>

          {lives.map((live, i) => (
            <MobileV2PlusCard key={live.id} live={live} indexInYear={i} />
          ))}
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
        ── fade to black ──
      </div>
    </div>
  );
}

function MobileV2PlusNav({ dir, setDir, counts }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 5,
        background: "rgba(18,10,6,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      {/* Row 1: SIDE A/B + members swatches (右側) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
        }}
      >
        <div style={{ display: "flex", gap: 4 }}>
          {[
            ["forward", "A"],
            ["reverse", "B"],
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
                fontSize: 12,
                letterSpacing: "0.14em",
                padding: "4px 10px",
                cursor: "pointer",
              }}
            >
              SIDE {label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        {/* メンバー色スウォッチ（モバイルは色だけ）*/}
        <div style={{ display: "flex", gap: 4 }}>
          {MEMBERS.map((m, i) => (
            <a
              key={m.id}
              href={`#m-${m.id}`}
              title={m.name}
              style={{
                width: 18,
                height: 18,
                background: m.color,
                border: "1px solid rgba(0,0,0,0.35)",
                transform: `rotate(${((i % 2 === 0 ? -1 : 1) * 1.5).toFixed(1)}deg)`,
                display: "block",
              }}
            />
          ))}
        </div>
      </div>
      {/* Row 2: year tape tabs */}
      <div
        style={{
          display: "flex",
          gap: 3,
          padding: "0 14px 8px",
          borderTop: "1px solid var(--rule)",
          paddingTop: 8,
          flexWrap: "wrap",
        }}
      >
        {YEARS.map((y, i) => (
          <a
            key={y}
            href={`#y${y}`}
            style={{
              flex: 1,
              padding: "5px 4px",
              background: "rgba(240,227,200,0.07)",
              color: "var(--fg)",
              textDecoration: "none",
              fontFamily: "var(--type)",
              fontSize: 11,
              letterSpacing: "0.05em",
              textAlign: "center",
              transform: `rotate(${((i % 2 === 0 ? -1 : 1) * 0.5).toFixed(2)}deg)`,
              textTransform: "uppercase",
            }}
          >
            {y}
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 8,
                opacity: 0.6,
                marginLeft: 4,
              }}
            >
              ×{counts[y] || 0}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function MobileV2PlusCard({ live, indexInYear }) {
  // 写真を約 45% 幅に縮め、左右にずらして配置。テキストは写真の対角側
  // にオフセットして余白を確保。1カードの縦は広めに取り、背景動画が
  // 透ける余白を生む。
  const seed = parseInt(live.id.slice(1), 10);
  const tilt = ((seed % 7) - 3) * 0.8; // -2.4 ~ 2.4 deg
  const tapeRot = ((seed % 5) - 2) * 4;
  const flip = indexInYear % 2 === 1; // 偶数→左寄せ、奇数→右寄せ

  // 写真の幅と横位置にゆらぎ
  const widths = ["46%", "52%", "48%", "54%"];
  const widthOf = widths[seed % widths.length];
  const insetSide = flip
    ? { right: ["4%", "8%", "2%"][seed % 3] }
    : { left: ["4%", "8%", "2%"][seed % 3] };

  return (
    <article
      style={{
        position: "relative",
        padding: "72px 24px 56px", // 縦を広く
        minHeight: 420,
      }}
    >
      {/* 写真 — 小さく・端寄せ */}
      <div
        style={{
          position: "relative",
          width: widthOf,
          marginLeft: flip ? "auto" : insetSide.left || 0,
          marginRight: flip ? insetSide.right || 0 : "auto",
          transform: `rotate(${tilt}deg)`,
        }}
      >
        <PhotoStage
          seeds={live.seeds}
          aspect="4/5"
          shape="polaroid"
          filter="mem-photo-warm"
        >
          <TapeStrip top={-10} left={flip ? "30%" : "60%"} rot={tapeRot} />
        </PhotoStage>
      </div>

      {/* 小さな赤スタンプ — 写真の対角側に控えめに */}
      <div
        style={{
          position: "absolute",
          top: 60,
          ...(flip ? { left: 18 } : { right: 18 }),
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "2px solid rgba(184,90,58,0.65)",
          color: "rgba(184,90,58,0.8)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `rotate(${(seed % 9) - 4}deg)`,
          fontFamily: "var(--type)",
          textTransform: "uppercase",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div style={{ fontSize: 7, letterSpacing: "0.16em" }}>night</div>
        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {live.date.split(".")[2]}
        </div>
        <div style={{ fontSize: 7, letterSpacing: "0.16em" }}>
          {live.date.split(".")[1]}.{live.year.slice(2)}
        </div>
      </div>

      {/* テキストブロック — 写真の対角側に配置（PRIMARY: 公演名+会場でタップ）*/}
      <div
        style={{
          marginTop: 28,
          width: "78%",
          marginLeft: flip ? 0 : "auto",
          marginRight: flip ? "auto" : 0,
          textAlign: flip ? "left" : "right",
        }}
      >
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--sub)",
          }}
        >
          {live.weekday}
        </div>
        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 44,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            marginTop: 4,
          }}
        >
          <span>
            {live.date.split(".")[0]}.{live.date.split(".")[1]}.
          </span>
          <span style={{ color: "var(--accent)" }}>
            {live.date.split(".")[2]}
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--jp)",
            fontWeight: 600,
            fontSize: 18,
            lineHeight: 1.4,
            marginTop: 12,
          }}
        >
          {live.title}
        </div>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--sub)",
            marginTop: 6,
          }}
        >
          @ {live.venue}
        </div>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginTop: 18,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            flexDirection: flip ? "row" : "row-reverse",
          }}
        >
          <svg
            width="22"
            height="8"
            viewBox="0 0 22 8"
            fill="none"
            style={{
              transform: flip ? "none" : "scaleX(-1)",
            }}
          >
            <path
              d="M0 4h18M14 1l4 3-4 3"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
          view {live.seeds.length * 4} photos
        </div>
      </div>
    </article>
  );
}

Object.assign(window, { MobileV2Plus });
