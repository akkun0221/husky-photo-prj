"use client";

type Props = {
  url: string;
  alt?: string;
  tilt?: number;
  aspectRatio?: string;
  onClick?: () => void;
};

export function GalleryPhoto({
  url,
  alt = "",
  tilt = 0,
  aspectRatio,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full cursor-pointer"
      style={{
        position: "relative",
        breakInside: "avoid",
        marginBottom: 14,
        transform: `rotate(${tilt}deg)`,
        transition: "transform .25s ease, box-shadow .25s",
        boxShadow: "0 10px 22px rgba(0,0,0,0.45)",
        background: "transparent",
        border: "none",
        padding: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `rotate(${tilt}deg) scale(1.02)`;
        e.currentTarget.style.boxShadow = "0 18px 36px rgba(0,0,0,0.7)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${tilt}deg)`;
        e.currentTarget.style.boxShadow = "0 10px 22px rgba(0,0,0,0.45)";
      }}
    >
      <img
        src={url}
        alt={alt}
        loading="lazy"
        className="mem-photo block w-full"
        style={{ aspectRatio, objectFit: "cover", background: "#0a0604" }}
      />
    </button>
  );
}
