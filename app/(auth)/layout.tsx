export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="dark flex min-h-svh items-center justify-center bg-[#0c1a1a]"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {children}
    </div>
  )
}
