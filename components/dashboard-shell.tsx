"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { LogOut } from "lucide-react"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { label: "Dashboard", href: "/" },
    { label: "History", href: "/history" },
  ]

  const isBuilder = pathname.startsWith("/application")

  if (isBuilder) {
    return <div className="flex h-svh flex-col overflow-hidden">{children}</div>
  }

  return (
    <div
      className="dark flex min-h-svh flex-col bg-[#0c1a1a]"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0c1a1a]/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/doorway.svg" alt="doorway" width={20} height={20} />
              <span className="hidden text-sm font-semibold tracking-tight text-white sm:inline">
                doorway
              </span>
            </Link>

            <nav className="flex items-center gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs transition-colors",
                    pathname === item.href
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:bg-white/5 hover:text-white/80"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <button
            onClick={async () => {
              await authClient.signOut()
              router.push("/sign-in")
            }}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-white/50 transition-colors hover:bg-white/5 hover:text-white/80 sm:px-3"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      </main>
    </div>
  )
}
