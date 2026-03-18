import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error("Unauthenticated")
  return await ctx.storage.generateUploadUrl()
})

export const create = mutation({
  args: {
    fileName: v.string(),
    fileType: v.string(),
    storageId: v.id("_storage"),
    originalText: v.string(),
    parsedData: v.any(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Unauthenticated")
    return await ctx.db.insert("cvs", {
      ...args,
      userId: identity.subject,
      uploadedAt: Date.now(),
    })
  },
})

export const get = query({
  args: { id: v.id("cvs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const list = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []
    return await ctx.db
      .query("cvs")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect()
  },
})

export const getLatest = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null
    return await ctx.db
      .query("cvs")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .first()
  },
})
