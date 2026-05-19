// MEMBERS PAGE — V2+ aesthetic (Mobile, 390pt)

function MembersPageMobile() {
  const [dir, setDir] = useDirection();
  const [selected, setSelected] = React.useState("all");
  const counts = yearCounts();
  const ordered = sortedLives(dir);

  const selectedMember =
    selected === "all" ? null : MEMBERS.find((m) => m.id === selected);

  return (
    <div className="mem-root" style={{ background: "#120a06" }}>
      <div className="mem-grain" style={{ opacity: 0.5 }} />
      <div className="mem-vignette" />

      {/* マーキー（モバイル短め） */}
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

      <header style={{ padding: "36px 24px 12px" }}>
        <div
          style={{
            fontFamily: "var(--type)",
            fontSize: 10,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          gallery · by member
        </div>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 84,
            lineHeight: 0.9,
            letterSpacing: "-0.035em",
            margin: "10px 0 12px",
          }}
        >
          Members<span style={{ color: "var(--accent)" }}>.</span>
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
          {selectedMember ? (
            <>
              now showing —{" "}
              <span style={{ color: selectedMember.color }}>
                ● {selectedMember.name}
              </span>
            </>
          ) : (
            <>showing all {MEMBERS.length} members</>
          )}
        </div>
      </header>

      {/* フィルタチップ（横スクロール）*/}
      <div
        style={{
          padding: "18px 24px",
          borderBottom: "1px solid var(--rule)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        <button
          onClick={() => setSelected("all")}
          style={{
            flex: "0 0 auto",
            padding: "7px 14px",
            background:
              selected === "all" ? "var(--accent)" : "rgba(240,227,200,0.06)",
            color: selected === "all" ? "#1a120a" : "var(--fg)",
            border:
              "1px solid " +
              (selected === "all" ? "var(--accent)" : "var(--rule)"),
            fontFamily: "var(--type)",
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: "pointer",
            transform: "rotate(-0.8deg)",
          }}
        >
          全て
        </button>
        {MEMBERS.map((m, i) => {
          const active = selected === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              style={{
                flex: "0 0 auto",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px 6px 6px",
                background: active ? "rgba(240,227,200,0.12)" : "transparent",
                color: active ? "var(--fg)" : "var(--sub)",
                border: "1px solid " + (active ? m.color : "var(--rule)"),
                fontFamily: "var(--type)",
                fontSize: 12,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
                transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (0.6 + i * 0.2)}deg)`,
                boxShadow: active ? `0 3px 10px ${m.color}40` : "none",
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
            </button>
          );
        })}
      </div>

      {/* フォトフィード */}
      <div style={{ padding: "8px 0 60px" }}>
        {ordered.map((live, i) => (
          <MemberPhotoSpreadMobile
            key={live.id}
            live={live}
            index={i}
            tint={selectedMember?.color}
          />
        ))}
        <div
          style={{
            padding: "30px 24px 40px",
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            textAlign: "center",
            color: "var(--accent)",
          }}
        >
          ── end of feed ──
        </div>
      </div>
    </div>
  );
}

function MemberPhotoSpreadMobile({ live, index, tint }) {
  const seed = parseInt(live.id.slice(1), 10);
  const photos = React.useMemo(
    () => detailPhotosFor(live).slice(0, 9),
    [live.id],
  );

  return (
    <article
      style={{
        padding: "28px 24px 24px",
        borderBottom: "1px dashed var(--faint)",
        "--gap": "6px",
      }}
    >
      {/* ライブメタ */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--sub)",
          }}
        >
          entry №{String(index + 1).padStart(3, "0")} · {live.weekday}
        </div>
        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 32,
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
            marginTop: 4,
          }}
        >
          {live.date}
        </div>
        <div
          style={{
            fontFamily: "var(--jp)",
            fontWeight: 600,
            fontSize: 15,
            lineHeight: 1.4,
            marginTop: 6,
          }}
        >
          {live.title}
        </div>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--sub)",
            marginTop: 3,
          }}
        >
          @ {live.venue}
        </div>
        {tint && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "3px 8px",
              marginTop: 10,
              border: `1px solid ${tint}`,
              fontFamily: "var(--mono)",
              fontSize: 9,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: tint,
              transform: "rotate(-1deg)",
            }}
          >
            <span style={{ width: 8, height: 8, background: tint }} />
            tagged
          </div>
        )}
      </div>

      {/* 3列の CSS columns ギャラリー（縦横比保持）*/}
      <div style={{ columnCount: 3, columnGap: 6 }}>
        {photos.map((p, k) => {
          const tilt = (((seed + k) % 9) - 4) * 0.25;
          return <GalleryPhoto key={k} photo={p} tilt={tilt} />;
        })}
      </div>

      <a
        href={`/lives/${live.id}`}
        style={{
          display: "block",
          textAlign: "right",
          marginTop: 14,
          textDecoration: "none",
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--accent)",
        }}
      >
        view all {photos.length}+ photos →
      </a>
    </article>
  );
}

Object.assign(window, { MembersPageMobile });
