import { NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { buildCVParsingPrompt } from "@/lib/prompts"

export const dynamic = "force-dynamic"

function getConvex() {
  return new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const storageId = formData.get("storageId") as string | null
    const fileName = formData.get("fileName") as string | null

    if (!file || !storageId || !fileName) {
      return NextResponse.json(
        { error: "Missing file, storageId, or fileName" },
        { status: 400 },
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    let rawText = ""

    if (
      file.type === "application/pdf" ||
      fileName.toLowerCase().endsWith(".pdf")
    ) {
      const { PDFParse } = await import("pdf-parse")
      const parser = new PDFParse({ data: new Uint8Array(buffer) })
      const result = await parser.getText()
      rawText = result.text
    } else if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.toLowerCase().endsWith(".docx")
    ) {
      const mammoth = await import("mammoth")
      const result = await mammoth.extractRawText({ buffer })
      rawText = result.value
    } else {
      rawText = await file.text()
    }

    if (!rawText.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from the file" },
        { status: 422 },
      )
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: "You are a precise resume parser. Return only valid JSON.",
      prompt: buildCVParsingPrompt(rawText),
      temperature: 0.1,
      providerOptions: { openai: { response_format: { type: "json_object" } } },
    })

    const parsedData = JSON.parse(text)

    const convex = getConvex()
    const cvId = await convex.mutation(api.cvs.create, {
      fileName,
      fileType: file.type || "application/octet-stream",
      storageId: storageId as any,
      originalText: rawText,
      parsedData,
    })

    return NextResponse.json({ cvId, parsedData })
  } catch (err) {
    console.error("CV parsing error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Parsing failed" },
      { status: 500 },
    )
  }
}
