import { NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import OpenAI from "openai"
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
