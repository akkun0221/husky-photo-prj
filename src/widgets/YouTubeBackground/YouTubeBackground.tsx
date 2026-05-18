"use client";

import { usePathname } from "next/navigation";

const YT_VIDEO_ID = "08JiOyg4moY";

// YouTube が実際に見える opacity・blur（見せないパスは opacity: 0 で再生継続）
function getYtStyle(pathname: string): { opacity: number; blur: string } {
  if (pathname === "/") return { opacity: 0.2, blur: "10px" };
  if (pathname === "/lives") return { opacity: 0.15, blur: "8px" };
  return { opacity: 0, blur: "10px" };
}

export function YouTubeBackground() {
  const pathname = usePathname();
  const ytStyle = getYtStyle(pathname);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      <iframe
        src={`https://www.youtube.com/embed/${YT_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${YT_VIDEO_ID}&controls=0&disablekb=1&modestbranding=1&playsinline=1&rel=0`}
        allow="autoplay; encrypted-media"
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          width: "177.78vh",
          height: "56.25vw",
          minWidth: "100%",
          minHeight: "100%",
          transform: "translate(-50%, -50%) scale(1.1)",
          filter: `blur(${ytStyle.blur})`,
          opacity: ytStyle.opacity,
          border: "none",
          transition: "opacity 0.8s ease",
        }}
        title=""
      />
    </div>
  );
}
