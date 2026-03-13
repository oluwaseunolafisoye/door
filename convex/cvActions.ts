"use node"

import { v } from "convex/values"
import { action } from "./_generated/server"
import { api } from "./_generated/api"
import OpenAI from "openai"
import { buildCVParsingPrompt } from "../lib/prompts"

export const parseCV = action({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileType: v.string(),
  },
  handler: async (ctx, args): Promise<{ cvId: string; parsedData: Record<string, unknown> }> => {
    const blob = await ctx.storage.get(args.storageId)
    if (!blob) throw new Error("File not found in storage")

    let rawText = ""

    if (args.fileType === "application/pdf" || args.fileName.endsWith(".pdf")) {
      const { PDFParse } = await import("pdf-parse")
      const buffer = Buffer.from(await blob.arrayBuffer())
      const parser = new PDFParse({ data: new Uint8Array(buffer) })
      const result = await parser.getText()
      rawText = result.text
    } else if (
      args.fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      args.fileName.endsWith(".docx")
    ) {
      const mammoth = await import("mammoth")
      const buffer = Buffer.from(await blob.arrayBuffer())
      const result = await mammoth.extractRawText({ buffer })
      rawText = result.value
    } else {
      rawText = await blob.text()
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a precise resume parser. Return only valid JSON.",
        },
        { role: "user", content: buildCVParsingPrompt(rawText) },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    })

    const parsedData = JSON.parse(
      completion.choices[0].message.content ?? "{}",
    )

    const cvId = await ctx.runMutation(api.cvs.create, {
      fileName: args.fileName,
      fileType: args.fileType,
      storageId: args.storageId,
      originalText: rawText,
      parsedData,
    })

    return { cvId, parsedData }
  },
})
