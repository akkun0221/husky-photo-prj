"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const VIDEO_URL =
  "https://pub-5d0311da2e0a4829b4043cf798f33881.r2.dev/videos/memorial-bg.mp4";

const VISIBLE_PATHS = ["/", "/lives"];

export function YouTubeBackground() {
  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVisible = VISIBLE_PATHS.includes(pathname);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          width: "177.78vh",
          height: "56.25vw",
          minWidth: "100%",
          minHeight: "100%",
          transform: "translate(-50%, -50%) scale(1.1)",
          filter: "blur(10px)",
          opacity: isVisible ? 0.2 : 0,
          objectFit: "cover",
          transition: "opacity 0.8s ease",
        }}
      />
    </div>
  );
}
