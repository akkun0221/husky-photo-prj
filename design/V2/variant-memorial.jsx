// variant-memorial.jsx
// 案②「Memorial Timeline」 — 時間軸が主役のアーカイブ
//
// 大事な要素:
//   1. 方向トグル: 追体験 (2022 → 2026) / 振り返り (2026 → 2022) を切替可
//   2. sticky な「Jump to...」バー — 年 pill とメンバーポートレートから即遷移
//   3. 中央スパインに沿った alternating timeline (各ノード = ライブページへのリンク)
//   4. ヒーローと末尾に解散日のメモリアル
//
// 暗モード前提の演出。明モードでも一応動くが薄まる。

function MemorialVariant({ accent = "#c84a3a", dark = true }) {
  const bg = dark ? "#0a0807" : "#f0ece4";
  const fg = dark ? "#ece6d8" : "#1a1614";
  const sub = dark ? "rgba(236,230,216,.55)" : "rgba(26,22,20,.55)";
  const faint = dark ? "rgba(236,230,216,.15)" : "rgba(26,22,20,.15)";
  const rule = dark ? "rgba(236,230,216,.12)" : "rgba(26,22,20,.12)";
  const surface = dark ? "#13100e" : "#e6dfd0";
  const tone = dark ? "dark" : "light";

  // 方向トグル — 追体験 (forward = chronological) がデフォルト
  const [direction, setDirection] = React.useState("forward");
  const lives = React.useMemo(() => {
    const asc = [...HUSKY.lives].slice().reverse(); // 2022 → 2026
    return direction === "forward" ? asc : [...asc].reverse();
  }, [direction]);

  // 年ごとにグループ化 (year pill 用)
  const years = ["2022", "2023", "2024", "2025", "2026"];
  const byYear = React.useMemo(() => {
    const m = {};
    HUSKY.lives.forEach((l) => {
      const y = l.date.slice(0, 4);
      (m[y] ||= []).push(l);
    });
    return m;
  }, []);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        background: bg,
        color: fg,
        fontFamily: '"Inter", "Noto Sans JP", -apple-system, sans-serif',
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: dark
            ? "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,.04), transparent 50%)"
            : "radial-gradient(ellipse at 50% 0%, rgba(0,0,0,.04), transparent 50%)",
        }}
      />

      {/* ── header ───────────────── */}
      <header
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "32px 64px",
          borderBottom: `1px solid ${rule}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, background: accent }} />
          <span
            style={{ fontWeight: 600, fontSize: 17, letterSpacing: ".04em" }}
          >
            husky&nbsp;photo
          </span>
          <span style={{ color: sub, display: "inline-flex" }}>
            <LockIcon />
          </span>
        </div>
        <nav
          style={{
            display: "flex",
            gap: 40,
            fontSize: 11,
            letterSpacing: ".32em",
            textTransform: "uppercase",
            color: sub,
            fontWeight: 500,
          }}
        >
          <span style={{ color: fg }}>top</span>
          <span>lives</span>
          <span>members</span>
          <span>about</span>
        </nav>
      </header>

      {/* ── opening monument ──────── */}
      <section style={{ padding: "72px 64px 56px", textAlign: "center" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: ".5em",
            color: sub,
            textTransform: "uppercase",
            marginBottom: 30,
          }}
        >
          ── an archive of husky, through one lens ──
        </div>

        <div
          style={{
            fontFamily: '"Playfair Display", "Noto Serif JP", serif',
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: "-.04em",
          }}
        >
          <div style={{ fontSize: 144, color: fg }}>
            2022
            <span style={{ color: faint, margin: "0 24px" }}>—</span>
            2026
          </div>
        </div>

        <p
          style={{
            margin: "32px auto 0",
            maxWidth: 620,
            fontSize: 15,
            lineHeight: 2,
            color: sub,
          }}
        >
          2022年12月10日、秋葉原のライブハウスで、はじめて husky を撮りました。
          そこから 2026年4月27日の解散ライブまで、{HUSKY.lives.length}{" "}
          公演を追いかけた記録です。
          ここから入って、自分のペースで日付のあいだを歩いてみてください。
        </p>

        <div
          style={{
            marginTop: 36,
            display: "inline-flex",
            gap: 28,
            alignItems: "baseline",
            fontFamily: "ui-monospace, monospace",
            fontSize: 10,
            letterSpacing: ".3em",
            color: sub,
            textTransform: "uppercase",
          }}
        >
          <span>
            <span
              style={{
                color: fg,
                fontSize: 22,
                fontFamily: '"Playfair Display", serif',
                fontStyle: "italic",
                letterSpacing: 0,
                marginRight: 8,
              }}
            >
              {HUSKY.lives.length}
            </span>
            shows
          </span>
          <span style={{ color: rule }}>·</span>
          <span>
            <span
              style={{
                color: fg,
                fontSize: 22,
                fontFamily: '"Playfair Display", serif',
                fontStyle: "italic",
                letterSpacing: 0,
                marginRight: 8,
              }}
            >
              1,711
            </span>
            photos
          </span>
          <span style={{ color: rule }}>·</span>
          <span>
            <span
              style={{
                color: fg,
                fontSize: 22,
                fontFamily: '"Playfair Display", serif',
                fontStyle: "italic",
                letterSpacing: 0,
                marginRight: 8,
              }}
            >
              5
            </span>
            voices
          </span>
        </div>
      </section>

      {/* ── STICKY JUMP BAR ─────────
          ここから先のスクロールでも常に画面上部にとどまる
          ─────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: dark ? "rgba(10,8,7,.85)" : "rgba(240,236,228,.9)",
          backdropFilter: "blur(14px)",
          borderTop: `1px solid ${rule}`,
          borderBottom: `1px solid ${rule}`,
          padding: "14px 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          {/* direction toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: ".3em",
                color: sub,
                textTransform: "uppercase",
              }}
            >
              direction
            </span>
            <div style={{ display: "flex", border: `1px solid ${rule}` }}>
              {[
                ["forward", "▶ 追体験", "2022→2026"],
                ["reverse", "◀ 振り返り", "2026→2022"],
              ].map(([k, label, sub2]) => (
                <button
                  key={k}
                  onClick={() => setDirection(k)}
                  style={{
                    background: direction === k ? accent : "transparent",
                    color: direction === k ? "#fff" : fg,
                    border: "none",
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: ".02em",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>{label}</span>
                  <span
                    style={{
                      opacity: 0.55,
                      fontSize: 9,
                      letterSpacing: ".1em",
                      fontFamily: "ui-monospace, monospace",
                    }}
                  >
                    {sub2}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <span style={{ width: 1, height: 24, background: rule }} />

          {/* year pills */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: ".3em",
                color: sub,
                textTransform: "uppercase",
              }}
            >
              jump to year
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              {years.map((y) => {
                const has = byYear[y]?.length || 0;
                return (
                  <a
                    key={y}
                    href={`#y${y}`}
                    style={{
                      padding: "6px 12px",
                      textDecoration: "none",
                      border: `1px solid ${rule}`,
                      background: "transparent",
                      color: fg,
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: ".05em",
                      display: "inline-flex",
                      alignItems: "baseline",
                      gap: 6,
                      cursor: "pointer",
                    }}
                  >
                    {y}
                    <span
                      style={{ color: sub, fontSize: 9, letterSpacing: ".1em" }}
                    >
                      {has}p
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          <span style={{ width: 1, height: 24, background: rule }} />

          {/* member shortcuts */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: ".3em",
                color: sub,
                textTransform: "uppercase",
              }}
            >
              by member
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              {HUSKY.members.map((m) => (
                <a
                  key={m.id}
                  href={`/members/${m.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 8px 4px 4px",
                    border: `1px solid ${rule}`,
                    textDecoration: "none",
                    color: fg,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ width: 24, height: 24 }}>
                    <PortraitPlaceholder name="" role="" tone={tone} />
                  </div>
                  <span
                    style={{
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 10,
                      letterSpacing: ".15em",
                      fontWeight: 600,
                    }}
                  >
                    {m.role}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <span style={{ flex: 1 }} />

          <span
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 10,
              letterSpacing: ".3em",
              color: sub,
              textTransform: "uppercase",
            }}
          >
            ↓ scroll to walk through
          </span>
        </div>
      </div>

      {/* ── timeline ───────────── */}
      <section style={{ padding: "60px 64px 80px", position: "relative" }}>
        {/* central spine */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            width: 1,
            background: faint,
            transform: "translateX(-50%)",
          }}
        />

        <div style={{ position: "relative" }}>
          {/* direction indicator at top */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div
              style={{
                display: "inline-block",
                background: bg,
                padding: "6px 16px",
                position: "relative",
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: ".4em",
                color: accent,
                textTransform: "uppercase",
              }}
            >
              ──{" "}
              {direction === "forward"
                ? "first frame · 2022.12.10"
                : "last frame · 2026.04.27"}{" "}
              ──
            </div>
          </div>

          {lives.map((l, i) => {
            const left = i % 2 === 0;
            const year = l.date.slice(0, 4);
            const isYearAnchor =
              i === 0 || lives[i - 1].date.slice(0, 4) !== year;
            return (
              <React.Fragment key={l.id}>
                {/* year marker (sticky anchor) */}
                {isYearAnchor && (
                  <div
                    id={`y${year}`}
                    style={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: 24,
                      marginTop: i === 0 ? 0 : 8,
                    }}
                  >
                    <div
                      style={{
                        background: surface,
                        padding: "4px 18px",
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 700,
                        fontStyle: "italic",
                        fontSize: 22,
                        color: fg,
                        letterSpacing: "-.01em",
                        border: `1px solid ${rule}`,
                      }}
                    >
                      {year}
                    </div>
                  </div>
                )}

                <div
                  style={{
                    position: "relative",
                    display: "grid",
                    gridTemplateColumns: "1fr 60px 1fr",
                    alignItems: "center",
                    marginBottom: 56,
                  }}
                >
                  {/* node */}
                  <div
                    style={{
                      gridColumn: 2,
                      justifySelf: "center",
                      position: "relative",
                      zIndex: 2,
                      width: l.final ? 22 : l.first ? 18 : 12,
                      height: l.final ? 22 : l.first ? 18 : 12,
                      background: l.final ? accent : l.first ? fg : fg,
                      boxShadow: l.final
                        ? `0 0 24px ${accent}`
                        : l.first
                          ? `0 0 12px ${faint}`
                          : "none",
                      border: l.first ? `2px solid ${bg}` : "none",
                    }}
                  />

                  {/* card */}
                  <a
                    href={`/lives/${l.id}`}
                    style={{
                      gridColumn: left ? 1 : 3,
                      textAlign: left ? "right" : "left",
                      textDecoration: "none",
                      color: fg,
                      cursor: "pointer",
                      paddingRight: left ? 32 : 0,
                      paddingLeft: left ? 0 : 32,
                      display: "block",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "ui-monospace, monospace",
                        fontSize: 11,
                        letterSpacing: ".3em",
                        color: l.final ? accent : sub,
                        textTransform: "uppercase",
                      }}
                    >
                      {l.weekday} · {l.city}
                      {l.first && <span> · debut</span>}
                      {l.final && <span> · the last</span>}
                    </div>
                    <div
                      style={{
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: l.final ? 800 : 300,
                        fontStyle: l.final ? "normal" : "italic",
                        fontSize: l.final ? 72 : 56,
                        lineHeight: 1.0,
                        letterSpacing: "-.02em",
                        color: l.final ? accent : fg,
                        marginTop: 6,
                      }}
                    >
                      {l.date}
                    </div>
                    <div
                      style={{ marginTop: 10, fontSize: 18, fontWeight: 500 }}
                    >
                      {l.venue}
                    </div>
                    {l.note && (
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: 13,
                          color: sub,
                          fontStyle: "italic",
                          fontFamily: '"EB Garamond", serif',
                        }}
                      >
                        “{l.note}”
                      </div>
                    )}
                    <div
                      style={{
                        marginTop: 14,
                        fontFamily: "ui-monospace, monospace",
                        fontSize: 10,
                        letterSpacing: ".3em",
                        color: sub,
                        textTransform: "uppercase",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        flexDirection: left ? "row-reverse" : "row",
                      }}
                    >
                      <Arrow color={accent} /> view {l.count} photos
                    </div>
                  </a>

                  {/* photo */}
                  <div
                    style={{
                      gridColumn: left ? 3 : 1,
                      paddingLeft: left ? 32 : 0,
                      paddingRight: left ? 0 : 32,
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        boxShadow: l.final
                          ? `0 20px 60px rgba(0,0,0,.5), 0 0 0 1px ${accent}`
                          : "0 12px 30px rgba(0,0,0,.4)",
                      }}
                    >
                      <StripePlaceholder
                        label={`${l.venue.replace(/ /g, "_")}_${l.date}`}
                        tone={tone}
                        ratio="3/2"
                        style={{ height: l.final ? 280 : 200 }}
                      />
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          {/* end-of-line marker */}
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              paddingTop: 12,
            }}
          >
            <div
              style={{
                background: bg,
                padding: "8px 16px",
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: ".5em",
                color: accent,
                textTransform: "uppercase",
              }}
            >
              ──{" "}
              {direction === "forward"
                ? "fade to black · 2026.04.27"
                : "first shutter · 2022.12.10"}{" "}
              ──
            </div>
          </div>
        </div>
      </section>

      {/* ── members rail ─────────── */}
      <section
        style={{ borderTop: `1px solid ${rule}`, padding: "60px 64px 60px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <span
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: ".4em",
                color: accent,
                textTransform: "uppercase",
              }}
            >
              by member
            </span>
            <h3
              style={{
                margin: 0,
                fontFamily: '"Playfair Display", serif',
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: 36,
              }}
            >
              five voices, five archives
            </h3>
          </div>
          <span
            style={{
              fontSize: 11,
              letterSpacing: ".3em",
              color: sub,
              textTransform: "uppercase",
            }}
          >
            メンバーごとの写真ページへ ›
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 1,
            background: rule,
            border: `1px solid ${rule}`,
          }}
        >
          {HUSKY.members.map((m, i) => (
            <a
              key={m.id}
              href={`/members/${m.id}`}
              style={{
                background: bg,
                padding: 18,
                cursor: "pointer",
                textDecoration: "none",
                color: fg,
              }}
            >
              <div style={{ height: 280 }}>
                <PortraitPlaceholder name={m.name} role={m.role} tone={tone} />
              </div>
              <div
                style={{
                  paddingTop: 14,
                  fontSize: 10,
                  letterSpacing: ".3em",
                  color: sub,
                  textTransform: "uppercase",
                }}
              >
                0{i + 1} · {m.role}
              </div>
              <div
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 700,
                  fontSize: 26,
                  marginTop: 4,
                  color: fg,
                  lineHeight: 1,
                  fontStyle: "italic",
                }}
              >
                {m.name}
              </div>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 10,
                  letterSpacing: ".25em",
                  color: sub,
                  textTransform: "uppercase",
                }}
              >
                <span>{m.shots} photos</span>
                <span style={{ color: accent }}>›</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── footer ─────────────── */}
      <footer
        style={{
          borderTop: `1px solid ${rule}`,
          padding: "28px 64px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 11,
          letterSpacing: ".3em",
          color: sub,
          textTransform: "uppercase",
        }}
      >
        <span>husky photo · {HUSKY.era}</span>
        <span style={{ color: accent, letterSpacing: ".5em" }}>
          ── thank you ──
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <LockIcon /> admin
        </span>
      </footer>
    </div>
  );
}

window.MemorialVariant = MemorialVariant;
