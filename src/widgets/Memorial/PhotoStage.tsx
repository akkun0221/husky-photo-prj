"use client";
import { useEffect, useState, type ReactNode } from "react";

type Shape = "rect" | "inset" | "polaroid";
type Filter = "mem-photo" | "mem-photo-warm" | "none";

type Props = {
  urls: string[];
  aspect?: string;
  shape?: Shape;
  filter?: Filter;
  children?: ReactNode;
};

function useRandomSlide(count: number, minMs = 2400, maxMs = 5800): number {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (count <= 1) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const next = () => {
      if (cancelled) return;
      setIdx((i) => {
        const step = 1 + Math.floor(Math.random() * (count - 1));
        return (i + step) % count;
      });
      const delay = minMs + Math.random() * (maxMs - minMs);
      timer = setTimeout(next, delay);
    };
    timer = setTimeout(next, minMs + Math.random() * (maxMs - minMs));
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [count, minMs, maxMs]);
  return idx;
}

export function PhotoStage({
  urls,
  aspect = "3/2",
  shape = "rect",
  filter = "mem-photo",
  children,
}: Props) {
  const idx = useRandomSlide(urls.length);

  const frameStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    aspectRatio: aspect,
    overflow: "hidden",
    background: "#0a0604",
  };

  if (shape === "polaroid") {
    Object.assign(frameStyle, {
      background: "#efe5cd",
      padding: "14px 14px 56px",
      boxShadow: "0 16px 38px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.25)",
      overflow: "visible",
    });
  } else if (shape === "inset") {
    Object.assign(frameStyle, {
      outline: "1px solid rgba(240,227,200,0.18)",
      outlineOffset: "-1px",
      boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
    });
  } else {
    frameStyle.boxShadow = "0 12px 30px rgba(0,0,0,0.55)";
  }

  if (urls.length === 0) {
    return (
      <div style={frameStyle}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--memorial-surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--type)",
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--memorial-sub)",
            }}
          >
            coming soon
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={frameStyle}>
      {urls.map((url, i) => (
        <img
          key={url}
          src={url}
          alt=""
          className={filter !== "none" ? filter : undefined}
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
      {children}
    </div>
  );
}
