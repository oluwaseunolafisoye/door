"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"

interface JobDescriptionFormProps {
  company?: string
  onSubmit: (data: {
    jobTitle: string
    company: string
    jobDescription: string
  }) => void
  isLoading?: boolean
}

export function JobDescriptionForm({
  onSubmit,
  isLoading,
}: JobDescriptionFormProps) {
  const [jobTitle, setJobTitle] = useState("")
  const [company, setCompany] = useState("")
  const [jobDescription, setJobDescription] = useState("")

  const canSubmit =
    jobTitle.trim() && company.trim() && jobDescription.trim() && !isLoading

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h3 className="text-lg font-medium">Target Role</h3>
        <p className="text-xs text-muted-foreground">
          Paste the job description and we&apos;ll tailor your CV to match.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="jobTitle" className="text-xs font-medium">
            Job Title
          </label>
          <Input
            id="jobTitle"
            placeholder="e.g. Senior Software Engineer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="company" className="text-xs font-medium">
            Company
          </label>
          <Input
            id="company"
            placeholder="e.g. Google"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="jd" className="text-xs font-medium">
          Job Description
        </label>
        <Textarea
          id="jd"
          placeholder="Paste the full job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="max-h-75 min-h-50 resize-y overflow-y-auto text-sm"
        />
      </div>

      <Button
        onClick={() => onSubmit({ jobTitle, company, jobDescription })}
        disabled={!canSubmit}
        className="w-full gap-2"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Tailoring your CV...
          </>
        ) : (
          <>
            <Sparkles className="size-4" />
            Tailor CV & Generate Cover Letter
          </>
        )}
      </Button>
    </div>
  )
}
