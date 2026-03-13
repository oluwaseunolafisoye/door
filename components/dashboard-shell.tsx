"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  const navItems = [
    { label: "Dashboard", href: "/" },
    { label: "History", href: "/history" },
  ]

  const isBuilder = pathname.startsWith("/application")

  if (isBuilder) {
    return <div className="flex h-svh flex-col overflow-hidden">{children}</div>
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/door.svg" alt="door" width={20} height={20} />
              <span className="text-sm font-semibold tracking-tight">door</span>
            </Link>

            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "text-xs",
                      pathname === item.href && "bg-muted text-foreground"
                    )}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden bg-muted/50">
        {pathname.startsWith("/application") ? (
          children
        ) : (
          <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
        )}
      </main>
    </div>
  )
}
