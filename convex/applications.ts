import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const create = mutation({
  args: {
    cvId: v.id("cvs"),
    jobTitle: v.string(),
    company: v.string(),
    jobDescription: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("applications", {
      ...args,
      createdAt: Date.now(),
      status: "processing",
    })
  },
})

export const updateResult = mutation({
  args: {
    id: v.id("applications"),
    customizedResume: v.any(),
    coverLetter: v.any(),
    optimizationAnalysis: v.optional(v.any()),
    status: v.union(
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed"),
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args
    await ctx.db.patch(id, rest)
  },
})

export const updateResume = mutation({
  args: {
    id: v.id("applications"),
    customizedResume: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      customizedResume: args.customizedResume,
    })
  },
})

export const updateCoverLetter = mutation({
  args: {
    id: v.id("applications"),
    coverLetter: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      coverLetter: args.coverLetter,
    })
  },
})

export const get = query({
  args: { id: v.id("applications") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("applications").order("desc").collect()
  },
})

export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5
    return await ctx.db
      .query("applications")
      .order("desc")
      .take(limit)
  },
})

export const remove = mutation({
  args: { id: v.id("applications") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const count = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("applications").collect()
    const now = Date.now()
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000
    const thisWeek = all.filter((a) => a.createdAt > weekAgo)
    return { total: all.length, thisWeek: thisWeek.length }
  },
})

export const aggregateStats = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("applications").collect()
    const completed = all.filter((a) => a.status === "completed")

    let totalKeywordsMatched = 0
    let totalKeywords = 0
    let totalBulletsOptimized = 0
    let totalRequirementsCovered = 0
    let totalRequirements = 0
    const skillCounts: Record<string, number> = {}
    let appsWithAnalysis = 0

    for (const app of completed) {
      const analysis = app.optimizationAnalysis as {
        summary?: {
          keywordsMatched?: number
          totalKeywords?: number
          bulletsOptimized?: number
          requirementsCovered?: string[]
          totalRequirements?: number
        }
        keywords?: { keyword: string; found: boolean }[]
      } | null

      if (!analysis?.summary) continue
      appsWithAnalysis++

      totalKeywordsMatched += analysis.summary.keywordsMatched ?? 0
      totalKeywords += analysis.summary.totalKeywords ?? 0
      totalBulletsOptimized += analysis.summary.bulletsOptimized ?? 0
      totalRequirementsCovered +=
        analysis.summary.requirementsCovered?.length ?? 0
      totalRequirements += analysis.summary.totalRequirements ?? 0

      if (analysis.keywords) {
        for (const kw of analysis.keywords) {
          if (kw.found) {
            skillCounts[kw.keyword] = (skillCounts[kw.keyword] ?? 0) + 1
          }
        }
      }
    }

    const avgKeywordPercent =
      totalKeywords > 0
        ? Math.round((totalKeywordsMatched / totalKeywords) * 100)
        : 0
    const avgRequirementPercent =
      totalRequirements > 0
        ? Math.round((totalRequirementsCovered / totalRequirements) * 100)
        : 0

    const topSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([skill, count]) => ({ skill, count }))

    const now = Date.now()
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000
    const thisWeek = all.filter((a) => a.createdAt > weekAgo)
    const completedThisWeek = thisWeek.filter(
      (a) => a.status === "completed",
    )

    return {
      total: all.length,
      thisWeek: thisWeek.length,
      completed: completed.length,
      completedThisWeek: completedThisWeek.length,
      avgKeywordPercent,
      avgRequirementPercent,
      totalBulletsOptimized,
      totalKeywordsMatched,
      totalKeywords,
      appsWithAnalysis,
      topSkills,
    }
  },
})
