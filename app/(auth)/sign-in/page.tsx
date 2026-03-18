"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    })

    if (error) {
      setError(error.message ?? "Sign in failed")
      setLoading(false)
    } else {
      router.push("/")
    }
  }

  return (
    <div className="w-full max-w-sm space-y-8 px-6">
      <div className="flex flex-col items-center gap-3">
        <Image src="/doorway.svg" alt="doorway" width={32} height={32} />
        <h1 className="text-xl font-semibold tracking-tight text-white">
          Sign in to doorway
        </h1>
        <p className="text-sm text-white/50">
          Enter your credentials to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white/70">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white/70">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#a4f5a6] text-[#0c1a1a] hover:bg-[#8ae68c]"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-white/40">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-[#a4f5a6] hover:text-[#8ae68c]"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}
