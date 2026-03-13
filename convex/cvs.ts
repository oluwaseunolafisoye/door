import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const generateUploadUrl = mutation(async (ctx) => {
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
    return await ctx.db.insert("cvs", {
      ...args,
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
    return await ctx.db.query("cvs").order("desc").collect()
  },
})

export const getLatest = query({
  handler: async (ctx) => {
    return await ctx.db.query("cvs").order("desc").first()
  },
})
