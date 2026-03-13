"use client"

import { useState } from "react"
import type { OptimizationAnalysis } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Sparkles,
  Target,
  Zap,
} from "lucide-react"

interface OptimizationPanelProps {
  analysis: OptimizationAnalysis
}

export function OptimizationPanel({ analysis }: OptimizationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const { summary, keywords } = analysis
  const keywordPercent =
    summary.totalKeywords > 0
      ? Math.round((summary.keywordsMatched / summary.totalKeywords) * 100)
      : 0

  const matchedKeywords = keywords.filter((k) => k.found)
  const missingKeywords = keywords.filter((k) => !k.found)

  return (
    <div className="rounded-2xl border bg-card">
      {/* Summary banner — always visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-chart-1/10">
            <Sparkles className="size-4 text-chart-1" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold">Optimization Analysis</p>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Target className="size-3" />
                {summary.keywordsMatched}/{summary.totalKeywords} keywords
              </span>
              <span className="flex items-center gap-1">
                <Zap className="size-3" />
                {summary.bulletsOptimized} bullets optimized
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3" />
                {summary.requirementsCovered.length}/
                {summary.totalRequirements} requirements
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <div className="w-20">
              <Progress value={keywordPercent}>{null}</Progress>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">
              {keywordPercent}%
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="space-y-4 border-t px-4 py-4">
          {/* Keyword cloud */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold">
              Keywords from Job Description
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {matchedKeywords.map((kw) => (
                <Badge
                  key={kw.keyword}
                  variant="default"
                  className="text-[10px]"
                >
                  <CheckCircle2 className="mr-0.5 size-2.5" />
                  {kw.keyword}
                  <span className="ml-0.5 opacity-60">· {kw.section}</span>
                </Badge>
              ))}
              {missingKeywords.map((kw) => (
                <Badge
                  key={kw.keyword}
                  variant="outline"
                  className="text-[10px] opacity-60"
                >
                  <XCircle className="mr-0.5 size-2.5" />
                  {kw.keyword}
                </Badge>
              ))}
            </div>
          </div>

          {/* Requirements checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold">
              Requirements Coverage ({summary.requirementsCovered.length}/
              {summary.totalRequirements})
            </h4>
            <div className="grid gap-1">
              {summary.requirementsCovered.map((req) => (
                <div
                  key={req}
                  className="flex items-center gap-2 text-[11px]"
                >
                  <CheckCircle2 className="size-3 shrink-0 text-chart-1" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
