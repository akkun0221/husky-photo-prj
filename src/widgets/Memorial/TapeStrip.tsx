type Props = {
  top?: number | string;
  left?: number | string;
  rot?: number;
  width?: number;
};

export function TapeStrip({
  top = -10,
  left = "50%",
  rot = 0,
  width = 80,
}: Props) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        transform: `translateX(-50%) rotate(${rot}deg)`,
        width,
        height: 22,
        background: "rgba(232,162,92,0.45)",
        mixBlendMode: "screen",
        boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 5px)",
        pointerEvents: "none",
      }}
    />
  );
}
