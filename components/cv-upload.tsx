"use client"

import { useCallback, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Upload, FileText, FileSpreadsheet, File, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import type { Id } from "@/convex/_generated/dataModel"
import type { ResumeData } from "@/lib/types"

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]

const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".txt"]

function getFileIcon(name: string) {
  if (name.endsWith(".pdf")) return <FileText className="size-8 text-red-400" />
  if (name.endsWith(".docx"))
    return <FileSpreadsheet className="size-8 text-blue-400" />
  return <File className="size-8 text-muted-foreground" />
}

interface CVUploadProps {
  onUploadComplete: (cvId: Id<"cvs">, parsedData: ResumeData) => void
}

export function CVUpload({ onUploadComplete }: CVUploadProps) {
  const generateUploadUrl = useMutation(api.cvs.generateUploadUrl)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const processFile = useCallback(
    async (file: File) => {
      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()
      if (
        !ACCEPTED_TYPES.includes(file.type) &&
        !ACCEPTED_EXTENSIONS.includes(ext)
      ) {
        setError("Please upload a PDF, DOCX, or TXT file.")
        return
      }

      setError(null)
      setIsUploading(true)
      setFileName(file.name)
      setUploadProgress(10)

      try {
        const postUrl = await generateUploadUrl()
        setUploadProgress(30)

        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file,
        })

        if (!result.ok) throw new Error("Upload failed")

        const { storageId } = await result.json()
        setUploadProgress(60)

        const formData = new FormData()
        formData.append("file", file)
        formData.append("storageId", storageId)
        formData.append("fileName", file.name)

        const response = await fetch("/api/parse-cv", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const err = await response.json().catch(() => null)
          throw new Error(err?.error || "Parsing failed")
        }

        const { cvId, parsedData } = await response.json()
        setUploadProgress(100)

        setTimeout(() => {
          onUploadComplete(cvId, parsedData)
        }, 400)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong.",
        )
        setIsUploading(false)
        setUploadProgress(0)
      }
    },
    [generateUploadUrl, onUploadComplete],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
    },
    [processFile],
  )

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all duration-300",
        isDragging
          ? "border-chart-1 bg-chart-1/5 scale-[1.02]"
          : "border-border hover:border-muted-foreground/40",
        isUploading && "pointer-events-none",
      )}
    >
      {isUploading ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="size-8 animate-spin text-chart-1" />
          <div className="space-y-1">
            <p className="text-sm font-medium">{fileName}</p>
            <p className="text-xs text-muted-foreground">
              {uploadProgress < 60
                ? "Uploading..."
                : uploadProgress < 100
                  ? "Parsing your CV with AI..."
                  : "Done!"}
            </p>
          </div>
          <Progress value={uploadProgress} className="h-1 w-48" />
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-muted p-4">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Drop your CV here</p>
            <p className="text-xs text-muted-foreground">
              PDF, DOCX, or TXT — we&apos;ll parse it automatically
            </p>
          </div>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          {fileName && !isUploading && (
            <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5">
              {getFileIcon(fileName)}
              <span className="text-xs">{fileName}</span>
            </div>
          )}
        </label>
      )}

      {error && (
        <p className="mt-3 text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}
