import { Fragment } from "react";

type LiveItem = {
  id: string;
  title: string;
  date: string;
  venue: string;
};

type Props = {
  lives: LiveItem[];
};

export function PhotoMarquee({ lives }: Props) {
  if (lives.length === 0) return null;
  return (
    <div
      style={{
        borderBottom: "1px solid var(--memorial-rule)",
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
          color: "var(--memorial-accent)",
        }}
      >
        {/* 2回複製して translateX(-50%) でシームレスループ */}
        {[0, 1].map((k) => (
          <Fragment key={k}>
            {lives.map((l) => (
              <span
                key={`${k}-${l.id}`}
                style={{
                  display: "inline-flex",
                  alignItems: "baseline",
                  gap: 16,
                }}
              >
                <span style={{ color: "var(--memorial-ember)" }}>✶</span>
                {l.title || l.venue}
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "var(--memorial-sub)",
                    alignSelf: "center",
                  }}
                >
                  {l.date} / {l.venue}
                </span>
              </span>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
