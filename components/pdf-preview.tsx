"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import type { ResumeData, CoverLetterData } from "@/lib/types"

interface PDFPreviewProps {
  resumeData: ResumeData
  coverLetterData: CoverLetterData
  activeTab: string
  mode: "preview" | "download"
  jobTitle?: string
}

export function PDFPreview({
  resumeData,
  coverLetterData,
  activeTab,
  mode,
  jobTitle,
}: PDFPreviewProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)

      try {
        const { pdf } = await import("@react-pdf/renderer")
        const { ResumeTemplate } = await import(
          "@/components/resume-pdf/resume-template"
        )
        const { CoverLetterTemplate } = await import(
          "@/components/resume-pdf/cover-letter-template"
        )

        const doc =
          activeTab === "coverLetter" ? (
            <CoverLetterTemplate
              data={coverLetterData}
              senderProfile={resumeData.profile}
              jobTitle={jobTitle}
            />
          ) : (
            <ResumeTemplate data={resumeData} />
          )

        const blob = await pdf(doc).toBlob()
        if (!cancelled) {
          setBlobUrl(URL.createObjectURL(blob))
          setLoading(false)
        }
      } catch (err) {
        console.error("PDF generation error:", err)
        if (!cancelled) setLoading(false)
      }
    }, 800)

    return () => {
      cancelled = true
    }
  }, [resumeData, coverLetterData, activeTab])

  if (mode === "download") {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-xs"
        disabled={loading || !blobUrl}
        onClick={() => {
          if (!blobUrl) return
          const link = document.createElement("a")
          link.href = blobUrl
          link.download =
            activeTab === "coverLetter" ? "cover-letter.pdf" : "resume.pdf"
          link.click()
        }}
      >
        <Download className="size-3" />
        {loading ? "Generating..." : "Download PDF"}
      </Button>
    )
  }

  return (
    <div className="relative flex h-full items-center justify-center">
      {!blobUrl && loading ? (
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
          <p className="text-xs">Generating preview…</p>
        </div>
      ) : blobUrl ? (
        <>
          <iframe
            src={blobUrl}
            className="h-full w-full rounded-lg border"
            title="PDF Preview"
          />
          {loading && (
            <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md bg-background/80 px-2 py-1 text-xs text-muted-foreground shadow backdrop-blur-sm">
              <Loader2 className="size-3 animate-spin" />
              Updating…
            </div>
          )}
        </>
      ) : (
        <p className="text-xs text-muted-foreground">
          Failed to generate preview
        </p>
      )}
    </div>
  )
}
