import { Geist_Mono, DM_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ConvexClientProvider } from "@/components/convex-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { getToken } from "@/lib/auth-server"

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const token = await getToken()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        dmSans.variable,
      )}
    >
      <body>
        <ConvexClientProvider initialToken={token}>
          <ThemeProvider>
            <TooltipProvider delay={200}>{children}</TooltipProvider>
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
