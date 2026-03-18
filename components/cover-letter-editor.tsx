"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { CoverLetterData } from "@/lib/types"
import { Plus, Trash2 } from "lucide-react"

interface CoverLetterEditorProps {
  data: CoverLetterData
  onChange: (data: CoverLetterData) => void
}

export function CoverLetterEditor({ data, onChange }: CoverLetterEditorProps) {
  const update = (field: keyof CoverLetterData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  const addParagraph = () => {
    onChange({ ...data, bodyParagraphs: [...data.bodyParagraphs, ""] })
  }

  const removeParagraph = (index: number) => {
    onChange({
      ...data,
      bodyParagraphs: data.bodyParagraphs.filter((_, i) => i !== index),
    })
  }

  const updateParagraph = (index: number, value: string) => {
    onChange({
      ...data,
      bodyParagraphs: data.bodyParagraphs.map((p, i) =>
        i === index ? value : p
      ),
    })
  }

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold tracking-tight">Cover Letter</h3>

      <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
        <h4 className="text-xs font-medium text-muted-foreground">
          Your Address
        </h4>
        <Textarea
          value={data.senderAddress}
          onChange={(e) => update("senderAddress", e.target.value)}
          placeholder={"123 Example Street\nNorwich, UK"}
          className="min-h-18 resize-y text-sm"
        />
      </div>

      <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-4">
        <h4 className="text-xs font-medium text-muted-foreground">Recipient</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Name</label>
            <Input
              value={data.recipientName}
              onChange={(e) => update("recipientName", e.target.value)}
              placeholder="Hiring Manager"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Title</label>
            <Input
              value={data.recipientTitle}
              onChange={(e) => update("recipientTitle", e.target.value)}
              placeholder="Hiring Team"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Company</label>
            <Input
              value={data.company}
              onChange={(e) => update("company", e.target.value)}
              placeholder="Company Name"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Address</label>
            <Input
              value={data.companyAddress}
              onChange={(e) => update("companyAddress", e.target.value)}
              placeholder="City, State"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Opening Paragraph
          </label>
          <Textarea
            value={data.opening}
            onChange={(e) => update("opening", e.target.value)}
            placeholder="Why you're excited about this role..."
            className="min-h-20 resize-y text-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">
              Body Paragraphs
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={addParagraph}
              className="gap-1"
            >
              <Plus className="size-3" />
              Add Paragraph
            </Button>
          </div>
          {data.bodyParagraphs.map((para, i) => (
            <div key={i} className="flex items-start gap-2">
              <Textarea
                value={para}
                onChange={(e) => updateParagraph(i, e.target.value)}
                placeholder={`Body paragraph ${i + 1}...`}
                className="min-h-20 resize-y text-sm"
              />
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => removeParagraph(i)}
                className="mt-1.5 text-muted-foreground hover:text-destructive"
                disabled={data.bodyParagraphs.length <= 1}
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Closing Paragraph
          </label>
          <Textarea
            value={data.closing}
            onChange={(e) => update("closing", e.target.value)}
            placeholder="Thank you for your consideration..."
            className="min-h-15 resize-y text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Sign-off
          </label>
          <Input
            value={data.signoff}
            onChange={(e) => update("signoff", e.target.value)}
            placeholder="Sincerely"
          />
        </div>
      </div>
    </div>
  )
}
