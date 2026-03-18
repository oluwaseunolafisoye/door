"use client"

import { useState, useCallback } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import type { ResumeData } from "@/lib/types"
import { CVUpload } from "@/components/cv-upload"
import { JobDescriptionForm } from "@/components/job-description-form"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import {
  Briefcase,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  RefreshCw,
} from "lucide-react"
import { useMutation, useAction } from "convex/react"
import { cn } from "@/lib/utils"

type FlowStep = "idle" | "uploaded" | "submitting"

function CircularProgress({
  value,
  size = 88,
  strokeWidth = 8,
  label,
  sublabel,
}: {
  value: number
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progress-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a4f5a6" />
            <stop offset="100%" stopColor="#a4f5a6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold tracking-tight text-white">{value}%</span>
        {label && <span className="text-[9px] font-medium text-white/50">{label}</span>}
        {sublabel && <span className="text-[8px] text-white/30">{sublabel}</span>}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const stats = useQuery(api.applications.aggregateStats)
  const recentApps = useQuery(api.applications.listRecent, { limit: 3 })
  const latestCv = useQuery(api.cvs.getLatest)
  const createApplication = useMutation(api.applications.create)
  const tailorResume = useAction(api.aiActions.tailorResume)

  const [step, setStep] = useState<FlowStep>("idle")
  const [cvId, setCvId] = useState<Id<"cvs"> | null>(null)
  const [parsedData, setParsedData] = useState<ResumeData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showUploadNew, setShowUploadNew] = useState(false)

  const hasExistingCv = latestCv !== undefined && latestCv !== null
  const effectiveCvId = cvId ?? (hasExistingCv ? latestCv._id : null)
  const effectiveParsedData = parsedData ?? (hasExistingCv ? (latestCv.parsedData as ResumeData) : null)

  const handleUploadComplete = useCallback((id: Id<"cvs">, data: ResumeData) => {
    setCvId(id)
    setParsedData(data)
    setStep("uploaded")
    setShowUploadNew(false)
  }, [])

  const handleJobSubmit = useCallback(
    async (job: { jobTitle: string; company: string; jobDescription: string }) => {
      if (!effectiveCvId || !effectiveParsedData) return
      setIsSubmitting(true)
      try {
        const appId = await createApplication({ cvId: effectiveCvId, ...job })
        tailorResume({ applicationId: appId, resumeData: effectiveParsedData, ...job })
        router.push(`/application/${appId}`)
      } catch {
        setIsSubmitting(false)
      }
    },
    [effectiveCvId, effectiveParsedData, createApplication, tailorResume, router]
  )

  const g = "bg-white/5 border-white/10 backdrop-blur-sm"

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-white">
          {step === "uploaded" || (hasExistingCv && step === "idle" && !showUploadNew)
            ? "Target Role"
            : "Welcome back"}
        </h1>
        <p className="text-xs text-white/40 mt-0.5">
          {step === "uploaded" || (hasExistingCv && step === "idle" && !showUploadNew)
            ? "Tell us about the job you're applying for."
            : "Your CV optimization overview."}
        </p>
      </div>

      {/*
        Grid layout (3 cols):
        Row 1-2: [Hero 2×2]              [Score 1×2 — circle + req bar + mini stats]
        Row 3:   [Keywords col-span-2]   [Top Skills 1×2]
        Row 4:   [Recent Apps col-span-2] [Top Skills cont.]
      */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* Hero — cols 1-2 */}
        <Card className={cn("relative overflow-hidden md:col-span-2", g)}>
          <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-[#a4f5a6]/5 blur-3xl" />
          <CardContent className="relative flex h-full flex-col justify-center p-6">
            {(step === "uploaded" || (hasExistingCv && step === "idle" && !showUploadNew)) ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-[#a4f5a6]/10">
                      <Sparkles className="size-4 text-[#a4f5a6]" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-white">New Application</h2>
                      <p className="text-[10px] text-white/40">
                        Using{" "}
                        <span className="font-medium text-white/60">
                          {hasExistingCv && !cvId ? latestCv.fileName : "uploaded CV"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowUploadNew(true)}
                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
                  >
                    <RefreshCw className="size-3" />
                    New CV
                  </button>
                </div>
                <JobDescriptionForm onSubmit={handleJobSubmit} isLoading={isSubmitting} />
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-xl bg-[#a4f5a6]/10">
                    <Sparkles className="size-4 text-[#a4f5a6]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">New Application</h2>
                    <p className="text-[10px] text-white/40">Upload your CV to get started</p>
                  </div>
                </div>
                <CVUpload onUploadComplete={handleUploadComplete} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right column — Score + Top Skills stacked */}
        <div className="flex flex-col gap-4 md:row-span-2">
          {stats?.appsWithAnalysis ? (
            <Card className={cn("relative overflow-hidden", g)}>
              <div className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-[#a4f5a6]/5 blur-2xl" />
              <CardContent className="relative flex flex-col items-center gap-3 p-4">
                <CircularProgress
                  value={stats.avgKeywordPercent}
                  label="Keyword Match"
                  sublabel={`${stats.appsWithAnalysis} app${stats.appsWithAnalysis !== 1 ? "s" : ""}`}
                />
                <div className="w-full space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-white/40">Req. coverage</span>
                    <span className="font-medium text-white/70">{stats.avgRequirementPercent}%</span>
                  </div>
                  <Progress value={stats.avgRequirementPercent} className="h-1 **:data-[slot=progress-indicator]:bg-[#a4f5a6]">{null}</Progress>
                </div>
              </CardContent>
            </Card>
          ) : null}
          <Card className={cn("relative overflow-hidden", g)}>
            <CardContent className="relative p-4">
              <div className="mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="size-3 text-white/30" />
                <h3 className="text-[11px] font-semibold text-white/70">Top Skills</h3>
              </div>
              {stats === undefined ? (
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-5 w-16 rounded-full opacity-20" />
                  ))}
                </div>
              ) : stats.topSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {stats.topSkills.map(({ skill, count }, i) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className={cn(
                        "text-[10px] font-normal px-2 py-0.5",
                        i < 3
                          ? "bg-[#a4f5a6]/15 text-[#a4f5a6] hover:bg-[#a4f5a6]/25"
                          : "bg-white/8 text-white/50 hover:bg-white/15"
                      )}
                    >
                      {skill}
                      <span className="ml-1 opacity-40">×{count}</span>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-white/40 leading-snug">
                  Skills appear after your first optimized application
                </p>
              )}
            </CardContent>
          </Card>
          {/* Recent Applications */}
          <Card className={cn("relative overflow-hidden", g)}>
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3 text-white/30" />
                  <h3 className="text-[11px] font-semibold text-white/70">Recent</h3>
                </div>
                {recentApps && recentApps.length > 0 && (
                  <button
                    onClick={() => router.push("/history")}
                    className="text-[10px] text-white/40 transition-colors hover:text-white/70"
                  >
                    View all →
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                {recentApps === undefined ? (
                  <>
                    <Skeleton className="h-10 rounded-lg opacity-20" />
                    <Skeleton className="h-10 rounded-lg opacity-20" />
                  </>
                ) : recentApps.length > 0 ? (
                  recentApps.map((app: Doc<"applications">) => (
                    <button
                      key={app._id}
                      type="button"
                      onClick={() => router.push(`/application/${app._id}`)}
                      className="group flex w-full items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-left transition-all hover:bg-white/10"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          app.status === "completed" && "bg-[#a4f5a6]",
                          app.status === "processing" && "animate-pulse bg-amber-400",
                          app.status === "failed" && "bg-destructive"
                        )} />
                        <div>
                          <p className="text-xs font-medium text-white leading-none">{app.jobTitle}</p>
                          <p className="text-[10px] text-white/40 mt-0.5">
                            {app.company} · {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="size-3 text-white/30 opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-4 text-center">
                    <div className="flex size-8 items-center justify-center rounded-full bg-white/10">
                      <Briefcase className="size-3.5 text-white/30" />
                    </div>
                    <p className="text-[10px] text-white/40">No applications yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Keywords + Stats */}
        <Card className={cn("relative overflow-hidden md:col-span-2", g)}>
          <CardContent className="relative flex h-full flex-wrap items-center gap-4 p-4 sm:gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <Zap className="size-4 text-white/60" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white leading-none">{stats?.totalBulletsOptimized ?? "—"}</p>
                <p className="text-[10px] text-white/40 mt-0.5">Bullets optimized</p>
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-white/40">Keywords placed</span>
                <span className="font-medium tabular-nums text-white/60">
                  {stats ? `${stats.totalKeywordsMatched}/${stats.totalKeywords}` : "—"}
                </span>
              </div>
              <Progress value={stats?.avgKeywordPercent ?? 0} className="h-1.5 **:data-[slot=progress-indicator]:bg-[#a4f5a6]">{null}</Progress>
            </div>
            {stats && (
              <div className="flex items-center gap-4 border-l border-white/8 pl-4 sm:pl-6">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xl font-bold text-white leading-none">{stats.thisWeek}</span>
                  <span className="text-[9px] text-white/40">This week</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xl font-bold text-white leading-none">{stats.total}</span>
                  <span className="text-[9px] text-white/40">Total</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
