"use client"

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import { ConvexReactClient } from "convex/react"
import { type ReactNode, useMemo } from "react"
import { authClient } from "@/lib/auth-client"

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL

export function ConvexClientProvider({
  children,
  initialToken,
}: {
  children: ReactNode
  initialToken?: string | null
}) {
  const client = useMemo(
    () => (CONVEX_URL ? new ConvexReactClient(CONVEX_URL) : null),
    [],
  )

  if (!client) return <>{children}</>

  return (
    <ConvexBetterAuthProvider
      client={client}
      authClient={authClient}
      initialToken={initialToken}
    >
      {children}
    </ConvexBetterAuthProvider>
  )
}
