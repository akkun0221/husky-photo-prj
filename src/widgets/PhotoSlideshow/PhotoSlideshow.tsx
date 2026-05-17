"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Photo = { url: string; label: string };

export function PhotoSlideshow({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (photos.length <= 1) return;
    let swapTimeout: ReturnType<typeof setTimeout> | undefined;
    const id = setInterval(() => {
      setVisible(false);
      swapTimeout = setTimeout(() => {
        setIndex((i) => (i + 1) % photos.length);
        setVisible(true);
      }, 600);
    }, 3600);
    return () => {
      clearInterval(id);
      clearTimeout(swapTimeout);
    };
  }, [photos.length]);

  if (!photos.length) return null;
  const photo = photos[index];

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
      <Image
        src={photo.url}
        alt={photo.label}
        fill
        className="object-cover"
        style={{
          opacity: visible ? 0.65 : 0,
          transition: "opacity 0.6s ease",
        }}
        sizes="100vw"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--memorial-bg) 0%, transparent 25%, transparent 65%, var(--memorial-bg) 100%)",
        }}
      />
      <div
        className="absolute right-5 bottom-4 font-mono text-[10px] tracking-[0.3em] uppercase"
        style={{
          color: "var(--memorial-sub)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        {photo.label}
      </div>
    </section>
  );
}
