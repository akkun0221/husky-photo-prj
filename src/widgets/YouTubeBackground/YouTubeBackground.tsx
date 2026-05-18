"use client";

import { usePathname } from "next/navigation";

const VIDEO_URL =
  "https://pub-5d0311da2e0a4829b4043cf798f33881.r2.dev/videos/memorial-bg.mp4";

function getVideoStyle(pathname: string): { opacity: number; blur: string } {
  if (pathname === "/") return { opacity: 0.2, blur: "10px" };
  if (pathname === "/lives") return { opacity: 0.15, blur: "8px" };
  return { opacity: 0, blur: "10px" };
}

export function YouTubeBackground() {
  const pathname = usePathname();
  const videoStyle = getVideoStyle(pathname);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      <video
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
          filter: `blur(${videoStyle.blur})`,
          opacity: videoStyle.opacity,
          objectFit: "cover",
          transition: "opacity 0.8s ease",
        }}
      />
    </div>
  );
}
