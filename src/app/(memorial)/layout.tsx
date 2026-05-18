export default function MemorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* html 要素に背景を設定することで、position:fixed zIndex:-1 の
          YouTubeBackground iframe がキャンバス上に透けて見えるようにする */}
      <style>{`html { background: var(--memorial-bg); }`}</style>
      <div style={{ minHeight: "100dvh", color: "var(--memorial-fg)" }}>
        {children}
      </div>
    </>
  );
}
