// MEMBERS PAGE — V2+ aesthetic (Desktop)
// メンバー別フィルタ + ライブ別グループ写真フィード。
// 同じ語彙: マーキー / Sticky バー / セピア＋琥珀 / テープ / スタンプ。
// フィルタは tape-strip 風のチップ、写真フィードは各ライブが scrapbook spread。

function MembersPageDesktop() {
  const [dir, setDir] = useDirection();
  const [selected, setSelected] = React.useState("all"); // 'all' | member.id
  const counts = yearCounts();
  // 一覧表示する内容: 「全て」なら全ライブ、メンバー指定なら全ライブ（仮データ）
  const ordered = sortedLives(dir);

  const selectedMember =
    selected === "all" ? null : MEMBERS.find((m) => m.id === selected);

  return (
    <div className="mem-root" style={{ background: "#120a06" }}>
      <div className="mem-grain" style={{ opacity: 0.5 }} />
      <div className="mem-vignette" />

      <MembersMarquee />

      <StickyBarScrapbook
        dir={dir}
        setDir={setDir}
        activeYear={"2026"}
        counts={counts}
      />

      <main
        style={{ padding: "72px 64px 120px", position: "relative", zIndex: 2 }}
      >
        {/* ヘッダ */}
        <div
          style={{
            fontFamily: "var(--type)",
            fontSize: 12,
            letterSpacing: "0.5em",
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
            fontSize: "clamp(96px, 12vw, 200px)",
            lineHeight: 0.9,
            letterSpacing: "-0.035em",
            margin: "10px 0 4px",
          }}
        >
          Members<span style={{ color: "var(--accent)" }}>.</span>
        </h1>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.3em",
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

        {/* フィルタ — tape-strip 風チップ */}
        <MembersFilterChips selected={selected} onChange={setSelected} />

        {/* フォトフィード */}
        <div style={{ marginTop: 56 }}>
          {ordered.map((live, i) => (
            <MemberPhotoSpread
              key={live.id}
              live={live}
              index={i}
              tint={selectedMember?.color}
            />
          ))}
        </div>

        <div
          style={{
            marginTop: 40,
            paddingTop: 28,
            borderTop: "1px double var(--rule)",
            textAlign: "center",
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          ── end of feed ──
        </div>
      </main>
    </div>
  );
}

// 共通マーキー（他ページと統一）
function MembersMarquee() {
  return (
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
  );
}

// フィルタチップ — 「全て」 + メンバー名（色 swatch 付）
function MembersFilterChips({ selected, onChange }) {
  return (
    <div
      style={{
        marginTop: 36,
        paddingBottom: 18,
        borderBottom: "1px solid var(--rule)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          fontFamily: "var(--type)",
          fontSize: 12,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--sub)",
          marginRight: 8,
        }}
      >
        filter
      </div>

      {/* 全て */}
      <button
        onClick={() => onChange("all")}
        style={{
          position: "relative",
          padding: "8px 16px",
          background:
            selected === "all" ? "var(--accent)" : "rgba(240,227,200,0.06)",
          color: selected === "all" ? "#1a120a" : "var(--fg)",
          border:
            "1px solid " +
            (selected === "all" ? "var(--accent)" : "var(--rule)"),
          fontFamily: "var(--type)",
          fontSize: 13,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          cursor: "pointer",
          transform: "rotate(-0.8deg)",
        }}
      >
        全て
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            marginLeft: 8,
            opacity: 0.7,
          }}
        >
          ×{LIVES.length}
        </span>
      </button>

      {MEMBERS.map((m, i) => {
        const active = selected === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 14px 7px 8px",
              background: active ? "rgba(240,227,200,0.12)" : "transparent",
              color: active ? "var(--fg)" : "var(--sub)",
              border: "1px solid " + (active ? m.color : "var(--rule)"),
              fontFamily: "var(--type)",
              fontSize: 13,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              cursor: "pointer",
              transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (0.6 + i * 0.2)}deg)`,
              boxShadow: active ? `0 4px 14px ${m.color}40` : "none",
              transition: "background .2s, color .2s",
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                background: m.color,
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.4)",
              }}
            />
            {m.name}
          </button>
        );
      })}
    </div>
  );
}

// 各ライブの写真スプレッド — 縦横比保持の CSS columns グリッド (5列)
function MemberPhotoSpread({ live, index, tint }) {
  const seed = parseInt(live.id.slice(1), 10);
  // 1ライブあたり 10 枚（フィードなので個別ページよりは控えめに）
  const photos = React.useMemo(
    () => detailPhotosFor(live).slice(0, 10),
    [live.id],
  );

  return (
    <article
      style={{
        marginBottom: 56,
        paddingBottom: 36,
        borderBottom: "1px dashed var(--faint)",
        "--gap": "12px",
      }}
    >
      {/* ライブメタ（横一列に） */}
      <header
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "baseline",
          gap: 24,
          marginBottom: 22,
        }}
      >
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--sub)",
            flex: "0 0 auto",
          }}
        >
          entry №{String(index + 1).padStart(3, "0")} · {live.weekday}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 22,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 38,
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
            }}
          >
            {live.date}
          </span>
          <span
            style={{
              fontFamily: "var(--jp)",
              fontWeight: 600,
              fontSize: 18,
              lineHeight: 1.3,
            }}
          >
            {live.title}
          </span>
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
        </div>
        <a
          href={`/lives/${live.id}`}
          style={{
            textDecoration: "none",
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--accent)",
            flex: "0 0 auto",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          all {photos.length}+ photos →
        </a>
      </header>

      {tint && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            marginBottom: 16,
            border: `1px solid ${tint}`,
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: tint,
            transform: "rotate(-1deg)",
          }}
        >
          <span style={{ width: 10, height: 10, background: tint }} />
          tagged
        </div>
      )}

      {/* 5列の CSS columns ギャラリー */}
      <div style={{ columnCount: 5, columnGap: 12 }}>
        {photos.map((p, k) => {
          const tilt = (((seed + k) % 9) - 4) * 0.25;
          return <GalleryPhoto key={k} photo={p} tilt={tilt} />;
        })}
      </div>
    </article>
  );
}

Object.assign(window, { MembersPageDesktop });
