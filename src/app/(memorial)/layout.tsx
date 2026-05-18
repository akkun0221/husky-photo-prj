export default function MemorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        color: "var(--memorial-fg)",
        background: "var(--memorial-bg)",
      }}
    >
      {children}
    </div>
  );
}
