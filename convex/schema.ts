import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  cvs: defineTable({
    originalText: v.string(),
    fileName: v.string(),
    fileType: v.string(),
    parsedData: v.any(),
    uploadedAt: v.number(),
    storageId: v.id("_storage"),
  }),
  applications: defineTable({
    cvId: v.id("cvs"),
    jobTitle: v.string(),
    company: v.string(),
    jobDescription: v.string(),
    customizedResume: v.optional(v.any()),
    coverLetter: v.optional(v.any()),
    optimizationAnalysis: v.optional(v.any()),
    createdAt: v.number(),
    status: v.union(
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed"),
    ),
  }),
})
