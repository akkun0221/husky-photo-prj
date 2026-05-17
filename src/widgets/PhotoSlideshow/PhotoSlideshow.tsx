"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type Photo = { url: string; label: string };

export function PhotoSlideshow({ photos }: { photos: Photo[] }) {
  // ダブルバッファ: A/B スロットを交互に使い、非表示側を先に差し替えてからクロスフェード
  const [slotA, setSlotA] = useState(photos[0] ?? { url: "", label: "" });
  const [slotB, setSlotB] = useState(
    photos[1] ?? photos[0] ?? { url: "", label: "" },
  );
  const [showA, setShowA] = useState(true);
  const idxRef = useRef(0);
  const showARef = useRef(true);

  useEffect(() => {
    if (photos.length <= 1) return;
    let switchTimer: ReturnType<typeof setTimeout> | undefined;

    const id = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % photos.length;
      const next = photos[idxRef.current];

      // 非表示スロットの src を先に更新してプリロード
      if (showARef.current) {
        setSlotB(next);
      } else {
        setSlotA(next);
      }

      // ブラウザが新 src を受け取った後にクロスフェード開始
      switchTimer = setTimeout(() => {
        showARef.current = !showARef.current;
        setShowA((prev) => !prev);
      }, 50);
    }, 3600);

    return () => {
      clearInterval(id);
      clearTimeout(switchTimer);
    };
  }, [photos]);

  if (!photos.length) return null;

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(200px, 42vh, 480px)",
        overflow: "hidden",
        borderTop: "1px solid var(--memorial-rule)",
      }}
    >
      {slotA.url && (
        <Image
          src={slotA.url}
          alt={slotA.label}
          fill
          className="object-cover"
          style={{
            opacity: showA ? 0.65 : 0,
            transition: "opacity 0.6s ease",
          }}
          sizes="100vw"
        />
      )}
      {slotB.url && (
        <Image
          src={slotB.url}
          alt={slotB.label}
          fill
          className="object-cover"
          style={{
            opacity: showA ? 0 : 0.65,
            transition: "opacity 0.6s ease",
          }}
          sizes="100vw"
        />
      )}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--memorial-bg) 0%, transparent 25%, transparent 65%, var(--memorial-bg) 100%)",
        }}
      />
      <div
        className="absolute right-5 bottom-4 font-mono text-[10px] tracking-[0.3em] uppercase"
        style={{ color: "var(--memorial-sub)" }}
      >
        {showA ? slotA.label : slotB.label}
      </div>
    </section>
  );
}
