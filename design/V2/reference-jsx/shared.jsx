// Shared tokens, data, and primitives for all MemorialClient redesign variations.

// ── Warm sepia / amber palette ──
// Drop-in replacement for the original :root --memorial-* tokens.
// Background sits warmer (oxidized paper black), accent shifts from neon red
// to amber/copper; embers used sparingly for "live" heat.
const PALETTE = {
  bg: "#0c0805", // deep warm bistre
  surface: "#16100a", // umber card
  fg: "#f0e3c8", // cream parchment
  sub: "rgba(240,227,200,0.55)",
  rule: "rgba(240,227,200,0.14)",
  faint: "rgba(240,227,200,0.08)",
  accent: "#d2823a", // amber
  hot: "#e8a25c", // sodium glow
  ember: "#b85a3a", // sepia-red for "danger" / current
  ink: "#1a120a",
  paper: "#e9dbc0", // for ledger cards
  paperWarm: "#d8c5a3",
};

// Inject once: shared @font-face links + grain + photo-warming filter.
(function injectGlobal() {
  if (typeof document === "undefined") return;
  if (document.getElementById("mem-global-css")) return;

  // Google fonts: Playfair (italic display), Cormorant Garamond (alt display),
  // JetBrains Mono (mono), Noto Serif JP (JP body), Shippori Mincho (JP display).
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2" +
    "?family=Playfair+Display:ital,wght@0,400;0,700;1,300;1,400;1,700" +
    "&family=Cormorant+Garamond:ital,wght@0,300;0,500;0,700;1,300;1,500" +
    "&family=Shippori+Mincho:wght@400;600;800" +
    "&family=Noto+Serif+JP:wght@300;400;700" +
    "&family=JetBrains+Mono:wght@300;400;600" +
    "&family=Special+Elite&family=Archivo+Black" +
    "&display=swap";
  document.head.appendChild(link);

  const s = document.createElement("style");
  s.id = "mem-global-css";
  s.textContent = `
    .mem-root {
      --bg: ${PALETTE.bg};
      --surface: ${PALETTE.surface};
      --fg: ${PALETTE.fg};
      --sub: ${PALETTE.sub};
      --rule: ${PALETTE.rule};
      --faint: ${PALETTE.faint};
      --accent: ${PALETTE.accent};
      --hot: ${PALETTE.hot};
      --ember: ${PALETTE.ember};
      --serif: 'Playfair Display', 'Shippori Mincho', 'Noto Serif JP', serif;
      --serif-alt: 'Cormorant Garamond', 'Shippori Mincho', serif;
      --mono: 'JetBrains Mono', ui-monospace, monospace;
      --jp: 'Shippori Mincho', 'Noto Serif JP', serif;
      --type: 'Special Elite', 'JetBrains Mono', monospace;
      background: var(--bg);
      color: var(--fg);
      font-family: 'Inter', 'Noto Serif JP', sans-serif;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
      scrollbar-width: none;
    }
    .mem-root::-webkit-scrollbar { display: none; }

    /* Grain overlay — fixed in viewport coords inside the artboard. */
    .mem-grain {
      position: absolute; inset: 0;
      pointer-events: none;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95  0 0 0 0 0.85  0 0 0 0 0.65  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>");
      mix-blend-mode: overlay;
      opacity: 0.35;
      z-index: 1;
    }
    .mem-vignette {
      position: absolute; inset: 0;
      pointer-events: none;
      background: radial-gradient(ellipse at 50% 30%, transparent 30%, rgba(0,0,0,0.45) 100%);
      z-index: 1;
    }

    /* Sepia/amber photo treatment — keeps unrelated picsum seeds looking
       like they're from one roll of film. */
    .mem-photo { filter: sepia(0.32) saturate(0.95) contrast(1.08) brightness(0.86) hue-rotate(-6deg); }
    .mem-photo-warm { filter: sepia(0.48) saturate(1.05) contrast(1.1) brightness(0.82) hue-rotate(-8deg); }

    .mem-marquee {
      display: flex; gap: 48px; white-space: nowrap;
      animation: mem-marquee 60s linear infinite;
    }
    @keyframes mem-marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }

    .mem-flicker { animation: mem-flicker 7s steps(1,end) infinite; }
    @keyframes mem-flicker {
      0%, 96%, 100% { opacity: 1; }
      97%           { opacity: 0.4; }
      98%           { opacity: 1; }
      99%           { opacity: 0.7; }
    }

    .mem-drift-h { animation: mem-drift-h 30s ease-in-out infinite alternate; }
    @keyframes mem-drift-h {
      from { transform: translateX(0); }
      to   { transform: translateX(-8px); }
    }

    .mem-pulse-dot::after {
      content: ''; display: inline-block; width: 6px; height: 6px;
      background: var(--ember); border-radius: 50%;
      margin-left: 8px; vertical-align: middle;
      animation: mem-pulse 1.6s ease-in-out infinite;
    }
    @keyframes mem-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%      { opacity: 0.3; transform: scale(0.7); }
    }
  `;
  document.head.appendChild(s);
})();

// ── Sample data ──
// Real 2026 lives provided by the user, plus a few earlier years so the
// "time-travel through the years" narrative reads on a single screen.
const LIVES = [
  // 2022 — husky と出会った日
  {
    id: "l01",
    date: "2022.12.10",
    weekday: "SAT",
    venue: "池袋 SOUND PEACE",
    title: "First Take",
    year: "2022",
    seeds: [1011, 1043, 1062, 1024],
  },
  // 2023
  {
    id: "l02",
    date: "2023.04.15",
    weekday: "SAT",
    venue: "梅田 amHALL",
    title: "Spring Echo",
    year: "2023",
    seeds: [1059, 1080, 103, 1027],
  },
  {
    id: "l03",
    date: "2023.10.08",
    weekday: "SUN",
    venue: "心斎橋 BIGCAT",
    title: "Autumn Static",
    year: "2023",
    seeds: [1074, 1084, 1067, 1042],
  },
  // 2024
  {
    id: "l04",
    date: "2024.03.22",
    weekday: "FRI",
    venue: "アメリカ村 BEYOND",
    title: "Mirror Stage",
    year: "2024",
    seeds: [219, 225, 217, 210],
  },
  {
    id: "l05",
    date: "2024.11.16",
    weekday: "SAT",
    venue: "CCO クリエイティブセンター",
    title: "Hollow Bloom",
    year: "2024",
    seeds: [160, 164, 177, 180],
  },
  // 2025
  {
    id: "l06",
    date: "2025.05.31",
    weekday: "SAT",
    venue: "Live House ANIMA",
    title: "May Storm",
    year: "2025",
    seeds: [201, 238, 239, 206],
  },
  {
    id: "l07",
    date: "2025.09.07",
    weekday: "SUN",
    venue: "梅田 amHALL",
    title: "Long Drift",
    year: "2025",
    seeds: [342, 338, 326, 317],
  },
  // 2026 — real
  {
    id: "l08",
    date: "2026.04.24",
    weekday: "FRI",
    venue: "Live House ANIMA",
    title: "TAKE YOUR HEART",
    year: "2026",
    seeds: [450, 454, 469, 481],
  },
  {
    id: "l09",
    date: "2026.04.25",
    weekday: "SAT",
    venue: "梅田 amHALL",
    title: "推し活すっきゃねんふぇす",
    year: "2026",
    seeds: [491, 494, 431, 442],
  },
  {
    id: "l10",
    date: "2026.04.25",
    weekday: "SAT",
    venue: "CCO クリエイティブセンター",
    title: "「大阪造船所アイドルフェス」",
    year: "2026",
    seeds: [516, 529, 533, 547],
  },
  {
    id: "l11",
    date: "2026.04.26",
    weekday: "SUN",
    venue: "アメリカ村 BEYOND",
    title: "ROCKING DOGS",
    year: "2026",
    seeds: [558, 564, 571, 584],
  },
  {
    id: "l12",
    date: "2026.04.27",
    weekday: "MON",
    venue: "心斎橋 BIGCAT",
    title: "感灯終唱~ｶﾝﾄｳｼｭｳｼｮｳ~",
    year: "2026",
    seeds: [600, 609, 623, 635],
  },
];

const MEMBERS = [
  { id: "m1", name: "HARU", color: "#d2823a" },
  { id: "m2", name: "NAGI", color: "#7ea2b8" },
  { id: "m3", name: "KOTO", color: "#c45a4a" },
  { id: "m4", name: "AYU", color: "#b89060" },
  { id: "m5", name: "YORU", color: "#3a4a5a" },
];

const YEARS = ["2022", "2023", "2024", "2025", "2026"];

const photoUrl = (seed, w = 720, h = 480) =>
  `https://picsum.photos/seed/h${seed}/${w}/${h}`;

// ── Hooks ──

// Random-interval slideshow index. Each card schedules its OWN next tick
// (jittered between [minMs, maxMs]) so cards never sync up — every glance
// at the page, a different photo somewhere has just flipped.
function useRandomSlide(count, minMs = 2400, maxMs = 5800) {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    if (count <= 1) return;
    let cancelled = false;
    let timer;
    const next = () => {
      if (cancelled) return;
      setIdx((i) => {
        // step 1..count-1 so we never re-show the same frame
        const step = 1 + Math.floor(Math.random() * (count - 1));
        return (i + step) % count;
      });
      const delay = minMs + Math.random() * (maxMs - minMs);
      timer = setTimeout(next, delay);
    };
    // Stagger the first tick so cards mounting at the same moment don't
    // line up on tick 1.
    timer = setTimeout(next, minMs + Math.random() * (maxMs - minMs));
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [count, minMs, maxMs]);
  return idx;
}

// Reports the most-visible year marker so a per-artboard overlay can react
// to scroll. Pass an array of {year, ref}; returns the year whose marker
// element is closest to the top of the scroll container.
function useActiveYear(scrollRef, markerRefs) {
  const [active, setActive] = React.useState(YEARS[0]);
  React.useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const handler = () => {
      let best = null;
      let bestDist = Infinity;
      const top = root.getBoundingClientRect().top;
      markerRefs.forEach(({ year, ref }) => {
        const el = ref.current;
        if (!el) return;
        const d = Math.abs(el.getBoundingClientRect().top - top - 60);
        if (d < bestDist) {
          bestDist = d;
          best = year;
        }
      });
      if (best) setActive(best);
    };
    handler();
    root.addEventListener("scroll", handler, { passive: true });
    return () => root.removeEventListener("scroll", handler);
  }, [scrollRef, markerRefs]);
  return active;
}

// Crossfading slideshow primitive. All variations call this.
// `shape` controls the frame: rect (default), filmstrip (sprocketed),
// polaroid (white border), inset (1px sepia hairline).
function PhotoStage({
  seeds,
  aspect = "3/2",
  shape = "rect",
  filter = "mem-photo",
  children,
}) {
  const idx = useRandomSlide(seeds.length);
  const frame = {
    position: "relative",
    width: "100%",
    aspectRatio: aspect,
    overflow: "hidden",
    background: "#0a0604",
  };
  if (shape === "polaroid") {
    Object.assign(frame, {
      background: "#efe5cd",
      padding: "14px 14px 56px",
      boxShadow: "0 16px 38px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.25)",
    });
  } else if (shape === "inset") {
    Object.assign(frame, {
      outline: "1px solid rgba(240,227,200,0.18)",
      outlineOffset: "-1px",
      boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
    });
  } else {
    frame.boxShadow = "0 12px 30px rgba(0,0,0,0.55)";
  }
  return (
    <div style={frame}>
      {seeds.map((s, i) => (
        <img
          key={s}
          src={photoUrl(s)}
          alt=""
          className={filter}
          style={{
            position: shape === "polaroid" ? "relative" : "absolute",
            inset: shape === "polaroid" ? "auto" : 0,
            width: "100%",
            height: shape === "polaroid" ? "auto" : "100%",
            aspectRatio: shape === "polaroid" ? aspect : "auto",
            objectFit: "cover",
            opacity: i === idx ? 1 : 0,
            transition: "opacity 1.1s ease",
            display: shape === "polaroid" && i !== idx ? "none" : "block",
          }}
        />
      ))}
      {shape === "filmstrip" && <SprocketHoles />}
      {children}
    </div>
  );
}

function SprocketHoles() {
  const holes = Array.from({ length: 14 });
  const row = (top) => (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        height: 14,
        display: "flex",
        gap: 10,
        padding: "0 8px",
        pointerEvents: "none",
      }}
    >
      {holes.map((_, i) => (
        <div
          key={i}
          style={{
            width: 14,
            height: 8,
            background: "#0a0604",
            flex: "0 0 auto",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.7)",
          }}
        />
      ))}
    </div>
  );
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 22,
          background: "linear-gradient(180deg, #1a120a 60%, transparent)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 22,
          background: "linear-gradient(0deg, #1a120a 60%, transparent)",
          pointerEvents: "none",
        }}
      />
      {row(4)}
      {row("calc(100% - 12px)")}
    </>
  );
}

// Sticky jump bar shared shell — variations style it differently via `theme`.
// Keeps direction toggle + year pills + member swatches functional everywhere.
function useDirection() {
  const [dir, setDir] = React.useState("forward");
  return [dir, setDir];
}

function sortedLives(dir) {
  // DB came descending → ascending, then reverse if needed.
  const asc = [...LIVES];
  return dir === "forward" ? asc : [...asc].reverse();
}

function yearCounts() {
  const m = {};
  LIVES.forEach((l) => {
    m[l.year] = (m[l.year] || 0) + 1;
  });
  return m;
}

Object.assign(window, {
  PALETTE,
  LIVES,
  MEMBERS,
  YEARS,
  photoUrl,
  useRandomSlide,
  useActiveYear,
  PhotoStage,
  useDirection,
  sortedLives,
  yearCounts,
});
