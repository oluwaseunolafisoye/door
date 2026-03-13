"use node"

import { v } from "convex/values"
import { action } from "./_generated/server"
import { api } from "./_generated/api"
import OpenAI from "openai"
import { buildTailoringPrompt, buildOptimizationPrompt } from "../lib/prompts"

export const tailorResume = action({
  args: {
    applicationId: v.id("applications"),
    resumeData: v.any(),
    jobTitle: v.string(),
    company: v.string(),
    jobDescription: v.string(),
  },
  handler: async (ctx, args): Promise<Record<string, unknown>> => {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

      // Step 1: Tailor resume + generate cover letter
      const tailoringPrompt = buildTailoringPrompt(
        JSON.stringify(args.resumeData, null, 2),
        args.jobTitle,
        args.company,
        args.jobDescription,
      )

      const tailoringCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are an expert career consultant. Return only valid JSON matching the requested structure.",
          },
          { role: "user", content: tailoringPrompt },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      })

      const tailoringResult = JSON.parse(
        tailoringCompletion.choices[0].message.content ?? "{}",
      )

      // Step 2: Generate optimization analysis (non-blocking for the main result)
      let optimizationAnalysis = null
      try {
        const optimizationPrompt = buildOptimizationPrompt(
          JSON.stringify(tailoringResult.customizedResume, null, 2),
          args.jobDescription,
        )

        const optimizationCompletion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a resume optimization analyst. Return only valid JSON.",
            },
            { role: "user", content: optimizationPrompt },
          ],
          temperature: 0.1,
          response_format: { type: "json_object" },
        })

        optimizationAnalysis = JSON.parse(
          optimizationCompletion.choices[0].message.content ?? "null",
        )
      } catch {
        // Optimization analysis is optional — don't fail the whole operation
      }

      await ctx.runMutation(api.applications.updateResult, {
        id: args.applicationId,
        customizedResume: tailoringResult.customizedResume,
        coverLetter: tailoringResult.coverLetter,
        optimizationAnalysis,
        status: "completed",
      })

      return { ...tailoringResult, optimizationAnalysis }
    } catch (error) {
      await ctx.runMutation(api.applications.updateResult, {
        id: args.applicationId,
        customizedResume: null,
        coverLetter: null,
        status: "failed",
      })
      throw error
    }
  },
})
