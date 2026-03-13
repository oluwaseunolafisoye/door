"use client"

import { use, useState, useCallback, useMemo } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import type { ResumeData, CoverLetterData, OptimizationAnalysis } from "@/lib/types"
import { DEFAULT_RESUME_DATA, DEFAULT_COVER_LETTER_DATA } from "@/lib/types"
import dynamic from "next/dynamic"

import { ProfileSection } from "@/components/resume-editor/profile-section"
import { ExperienceSection } from "@/components/resume-editor/experience-section"
import { EducationSection } from "@/components/resume-editor/education-section"
import { SkillsSection } from "@/components/resume-editor/skills-section"
import { ProjectsSection } from "@/components/resume-editor/projects-section"
import { CertificationsSection } from "@/components/resume-editor/certifications-section"
import { CoverLetterEditor } from "@/components/cover-letter-editor"
import { OptimizationPanel } from "@/components/optimization-panel"

const PDFPreview = dynamic(
  () =>
    import("../../../../components/pdf-preview").then((mod) => mod.PDFPreview),
  { ssr: false }
)

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Download,
  Save,
  Loader2,
  FileText,
  Mail,
  XCircle,
} from "lucide-react"
import Link from "next/link"

export default function ApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const application = useQuery(api.applications.get, {
    id: id as Id<"applications">,
  })
  const updateResume = useMutation(api.applications.updateResume)
  const updateCoverLetter = useMutation(api.applications.updateCoverLetter)

  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [coverLetterData, setCoverLetterData] =
    useState<CoverLetterData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("resume")
  const [initialized, setInitialized] = useState(false)

  // Initialize state from Convex data once completed
  if (application && application.customizedResume && !initialized) {
    setResumeData(application.customizedResume as ResumeData)
    setCoverLetterData(
      (application.coverLetter as CoverLetterData) ?? DEFAULT_COVER_LETTER_DATA
    )
    setInitialized(true)
  }

  const optimizationAnalysis = useMemo(
    () => application?.optimizationAnalysis as OptimizationAnalysis | undefined,
    [application?.optimizationAnalysis]
  )

  const handleSave = useCallback(async () => {
    if (!resumeData || !coverLetterData) return
    setIsSaving(true)
    await Promise.all([
      updateResume({
        id: id as Id<"applications">,
        customizedResume: resumeData,
      }),
      updateCoverLetter({
        id: id as Id<"applications">,
        coverLetter: coverLetterData,
      }),
    ])
    setIsSaving(false)
  }, [id, resumeData, coverLetterData, updateResume, updateCoverLetter])

  const currentResumeData = useMemo(
    () => resumeData ?? DEFAULT_RESUME_DATA,
    [resumeData]
  )
  const currentCoverLetterData = useMemo(
    () => coverLetterData ?? DEFAULT_COVER_LETTER_DATA,
    [coverLetterData]
  )

  // Loading state
  if (application === undefined) {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-8 w-64" />
        <div className="grid h-[80vh] grid-cols-2 gap-6">
          <Skeleton className="rounded-xl" />
          <Skeleton className="rounded-xl" />
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Application not found.</p>
      </div>
    )
  }

  // Processing skeleton
  if (application.status === "processing") {
    return (
      <div className="space-y-6 p-8">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold">{application.jobTitle}</h1>
            <p className="text-xs text-muted-foreground">
              {application.company}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <Loader2 className="size-8 animate-spin text-chart-1" />
          <div className="space-y-1 text-center">
            <p className="text-sm font-medium">Tailoring your CV with AI...</p>
            <p className="text-xs text-muted-foreground">
              Applying CARL framework, optimizing action verbs, and generating
              your cover letter.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Failed state
  if (application.status === "failed") {
    return (
      <div className="space-y-6 p-8">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold">{application.jobTitle}</h1>
            <p className="text-xs text-muted-foreground">
              {application.company}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="size-6 text-destructive" />
          </div>
          <div className="space-y-1 text-center">
            <p className="text-sm font-medium">Tailoring failed</p>
            <p className="text-xs text-muted-foreground">
              Something went wrong while optimizing your CV. Please go back and
              try again.
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="size-3" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-sm font-semibold">{application.jobTitle}</h1>
            <p className="text-[11px] text-muted-foreground">
              {application.company}
            </p>
          </div>
        </div>

        {/* Floating toolbar */}
        <div className="flex items-center gap-2 rounded-2xl border bg-background px-3 py-1.5 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Save className="size-3" />
            )}
            Save
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <PDFPreview
            resumeData={currentResumeData}
            coverLetterData={currentCoverLetterData}
            activeTab={activeTab}
            mode="download"
            jobTitle={application.jobTitle}
          />
        </div>
      </div>

      {/* Split pane */}
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-2">
        {/* Left: Form editor */}
        <div className="overflow-y-auto border-r">
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="resume" className="gap-1.5 text-xs">
                  <FileText className="size-3" />
                  Resume
                </TabsTrigger>
                <TabsTrigger value="coverLetter" className="gap-1.5 text-xs">
                  <Mail className="size-3" />
                  Cover Letter
                </TabsTrigger>
              </TabsList>

              <TabsContent value="resume" className="space-y-6">
                {optimizationAnalysis && (
                  <OptimizationPanel analysis={optimizationAnalysis} />
                )}
                <ProfileSection
                  data={currentResumeData.profile}
                  onChange={(profile) =>
                    setResumeData((prev) => ({
                      ...(prev ?? DEFAULT_RESUME_DATA),
                      profile,
                    }))
                  }
                />
                <Separator />
                <ExperienceSection
                  data={currentResumeData.experience}
                  onChange={(experience) =>
                    setResumeData((prev) => ({
                      ...(prev ?? DEFAULT_RESUME_DATA),
                      experience,
                    }))
                  }
                  optimizations={optimizationAnalysis?.experienceOptimizations}
                />
                <Separator />
                <EducationSection
                  data={currentResumeData.education}
                  onChange={(education) =>
                    setResumeData((prev) => ({
                      ...(prev ?? DEFAULT_RESUME_DATA),
                      education,
                    }))
                  }
                />
                <Separator />
                <SkillsSection
                  data={currentResumeData.skills}
                  onChange={(skills) =>
                    setResumeData((prev) => ({
                      ...(prev ?? DEFAULT_RESUME_DATA),
                      skills,
                    }))
                  }
                />
                <Separator />
                <ProjectsSection
                  data={currentResumeData.projects}
                  onChange={(projects) =>
                    setResumeData((prev) => ({
                      ...(prev ?? DEFAULT_RESUME_DATA),
                      projects,
                    }))
                  }
                />
                <Separator />
                <CertificationsSection
                  data={currentResumeData.certifications}
                  onChange={(certifications) =>
                    setResumeData((prev) => ({
                      ...(prev ?? DEFAULT_RESUME_DATA),
                      certifications,
                    }))
                  }
                />
              </TabsContent>

              <TabsContent value="coverLetter">
                <CoverLetterEditor
                  data={currentCoverLetterData}
                  onChange={setCoverLetterData}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right: PDF preview */}
        <div className="hidden overflow-hidden bg-muted/30 lg:block">
          <PDFPreview
            resumeData={currentResumeData}
            coverLetterData={currentCoverLetterData}
            activeTab={activeTab}
            mode="preview"
            jobTitle={application.jobTitle}
          />
        </div>
      </div>
    </div>
  )
}
