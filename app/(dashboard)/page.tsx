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
  FileText,
  Briefcase,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Target,
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
  size = 120,
  strokeWidth = 10,
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
          className="text-muted/50"
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
          <linearGradient
            id="progress-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#a4f5a6" />
            <stop offset="100%" stopColor="#a4f5a6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tracking-tight">{value}%</span>
        {label && (
          <span className="text-[10px] font-medium opacity-60">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-[9px] opacity-40">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const stats = useQuery(api.applications.aggregateStats)
  const recentApps = useQuery(api.applications.listRecent, { limit: 4 })
  const latestCv = useQuery(api.cvs.getLatest)
  const createApplication = useMutation(api.applications.create)
  const tailorResume = useAction(api.aiActions.tailorResume)

  const [step, setStep] = useState<FlowStep>("idle")
  const [cvId, setCvId] = useState<Id<"cvs"> | null>(null)
  const [parsedData, setParsedData] = useState<ResumeData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showUploadNew, setShowUploadNew] = useState(false)

  // Auto-load existing CV
  const hasExistingCv = latestCv !== undefined && latestCv !== null
  const effectiveCvId = cvId ?? (hasExistingCv ? latestCv._id : null)
  const effectiveParsedData = parsedData ?? (hasExistingCv ? (latestCv.parsedData as ResumeData) : null)

  const handleUploadComplete = useCallback(
    (id: Id<"cvs">, data: ResumeData) => {
      setCvId(id)
      setParsedData(data)
      setStep("uploaded")
      setShowUploadNew(false)
    },
    []
  )

  const handleJobSubmit = useCallback(
    async (job: {
      jobTitle: string
      company: string
      jobDescription: string
    }) => {
      if (!effectiveCvId || !effectiveParsedData) return
      setIsSubmitting(true)

      try {
        const appId = await createApplication({
          cvId: effectiveCvId,
          ...job,
        })

        tailorResume({
          applicationId: appId,
          resumeData: effectiveParsedData,
          ...job,
        })

        router.push(`/application/${appId}`)
      } catch {
        setIsSubmitting(false)
      }
    },
    [effectiveCvId, effectiveParsedData, createApplication, tailorResume, router]
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {step === "uploaded" || (hasExistingCv && step === "idle" && !showUploadNew)
            ? "Target Role"
            : "Welcome back"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {step === "uploaded" || (hasExistingCv && step === "idle" && !showUploadNew)
            ? "Tell us about the job you're applying for."
            : "Your CV optimization overview."}
        </p>
      </div>

      {/* Single bento grid */}
      <div className="grid grid-cols-3 gap-6">

        {/* Hero — cols 1-2, rows 1-2 */}
        <Card className="relative col-span-2 row-span-2 overflow-hidden border-border">
          <div className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-secondary/30 blur-3xl" />
          <CardContent className="relative flex h-full min-h-80 flex-col justify-center p-8">
            {(step === "uploaded" || (hasExistingCv && step === "idle" && !showUploadNew)) ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                      <Sparkles className="size-4.5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold">New Application</h2>
                      <p className="text-[11px] text-muted-foreground">
                        Using <span className="font-medium text-foreground">{hasExistingCv && !cvId ? latestCv.fileName : "uploaded CV"}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowUploadNew(true)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <RefreshCw className="size-3" />
                    Upload new CV
                  </button>
                </div>
                <JobDescriptionForm onSubmit={handleJobSubmit} isLoading={isSubmitting} />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-chart-1/10">
                    <Sparkles className="size-4.5 text-chart-1" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold">New Application</h2>
                    <p className="text-[11px] text-muted-foreground">Upload your CV to get started</p>
                  </div>
                </div>
                <CVUpload onUploadComplete={handleUploadComplete} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Optimization Score — col 3, row 1-2, dark card */}
        <Card className="relative row-span-2 overflow-hidden">
          <div className="pointer-events-none absolute -top-12 -right-12 size-32 rounded-full bg-primary/5 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 size-32 rounded-full bg-secondary/30 blur-2xl" />
          <CardContent className="relative flex h-full flex-col items-center justify-center gap-3 p-6">
            {stats === undefined ? (
              <Skeleton className="size-28 rounded-full" />
            ) : stats.appsWithAnalysis > 0 ? (
              <>
                <CircularProgress
                  value={stats.avgKeywordPercent}
                  label="Keyword Match"
                  sublabel={`across ${stats.appsWithAnalysis} app${stats.appsWithAnalysis !== 1 ? "s" : ""}`}
                />
                <div className="mt-1 w-full space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Requirements</span>
                    <span className="font-medium">{stats.avgRequirementPercent}%</span>
                  </div>
                  <Progress value={stats.avgRequirementPercent}>{null}</Progress>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                  <Target className="size-6 text-muted-foreground/50" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Optimization score appears after your first tailored application
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* This Week — col 1, row 3 */}
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-8 -bottom-8 size-24 rounded-full bg-primary/10 blur-2xl" />
          <CardContent className="relative flex h-full items-center gap-4 p-5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <TrendingUp className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight">{stats?.thisWeek ?? "—"}</p>
              <p className="text-[11px] text-muted-foreground">This week</p>
            </div>
          </CardContent>
        </Card>

        {/* Keywords — col 2, row 3 */}
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-8 -left-8 size-24 rounded-full bg-secondary/50 blur-2xl" />
          <CardContent className="relative space-y-3 p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <Zap className="size-4 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-lg font-bold">{stats?.totalBulletsOptimized ?? "—"}</p>
                <p className="text-[11px] text-muted-foreground">Bullets optimized</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Keywords placed</span>
                <span className="font-medium tabular-nums">
                  {stats ? `${stats.totalKeywordsMatched}/${stats.totalKeywords}` : "—"}
                </span>
              </div>
              <Progress value={stats?.avgKeywordPercent ?? 0} className="[&>div]:bg-primary">{null}</Progress>
            </div>
          </CardContent>
        </Card>

        {/* Total — col 3, row 3 */}
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -bottom-8 -left-8 size-24 rounded-full bg-secondary/50 blur-2xl" />
          <CardContent className="relative flex h-full items-center gap-4 p-5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary">
              <FileText className="size-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight">{stats?.total ?? "—"}</p>
              <p className="text-[11px] text-muted-foreground">Total applications</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications — cols 1-2, rows 4-5 */}
        <Card className="col-span-2 row-span-2">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="size-3.5 text-muted-foreground" />
                <h3 className="text-xs font-semibold">Recent Applications</h3>
              </div>
              {recentApps && recentApps.length > 0 && (
                <button
                  onClick={() => router.push("/history")}
                  className="text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  View all →
                </button>
              )}
            </div>
            <div className="space-y-2">
              {recentApps === undefined ? (
                <>
                  <Skeleton className="h-14 rounded-xl" />
                  <Skeleton className="h-14 rounded-xl" />
                  <Skeleton className="h-14 rounded-xl" />
                </>
              ) : recentApps.length > 0 ? (
                recentApps.map((app: Doc<"applications">) => (
                  <button
                    key={app._id}
                    type="button"
                    onClick={() => router.push(`/application/${app._id}`)}
                    className="group flex w-full items-center justify-between rounded-xl bg-muted/40 px-4 py-3 text-left transition-all hover:bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "size-2 shrink-0 rounded-full",
                        app.status === "completed" && "bg-primary",
                        app.status === "processing" && "animate-pulse bg-amber-500",
                        app.status === "failed" && "bg-destructive"
                      )} />
                      <div>
                        <p className="text-sm font-medium">{app.jobTitle}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {app.company} · {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    <Briefcase className="size-4 text-muted-foreground/50" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    No applications yet — upload a CV to get started
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Matched Skills — col 3, rows 4-5 */}
        <Card className="relative row-span-2 overflow-hidden border-border">
          <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-muted/50 blur-3xl" />
          <CardContent className="relative p-5">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-muted-foreground" />
              <h3 className="text-xs font-semibold">Top Matched Skills</h3>
            </div>
            {stats === undefined ? (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-full" />
                ))}
              </div>
            ) : stats.topSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {stats.topSkills.map(({ skill, count }, i) => (
                  <Badge
                    key={skill}
                    variant={i < 3 ? "default" : "secondary"}
                    className={cn("text-[11px] font-normal", i < 3 && "bg-primary/10 text-primary hover:bg-primary/20")}
                  >
                    {skill}
                    <span className="ml-1 opacity-50">×{count}</span>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Matched skills appear after your first optimized application
              </p>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
