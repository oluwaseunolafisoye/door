"use client"

import { use, useState, useCallback, useMemo } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import type { ResumeData, CoverLetterData, OptimizationAnalysis, SectionId } from "@/lib/types"
import { DEFAULT_RESUME_DATA, DEFAULT_COVER_LETTER_DATA, DEFAULT_SECTION_ORDER } from "@/lib/types"
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
  ChevronUp,
  ChevronDown,
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
  const [sectionOrder, setSectionOrder] = useState<SectionId[]>(DEFAULT_SECTION_ORDER)
  const [initialized, setInitialized] = useState(false)

  // Initialize state from Convex data once completed
  if (application && application.customizedResume && !initialized) {
    const resume = application.customizedResume as ResumeData
    setResumeData(resume)
    setSectionOrder(resume.sectionOrder ?? DEFAULT_SECTION_ORDER)
    setCoverLetterData(
      (application.coverLetter as CoverLetterData) ?? DEFAULT_COVER_LETTER_DATA
    )
    setInitialized(true)
  }

  const optimizationAnalysis = useMemo(
    () => application?.optimizationAnalysis as OptimizationAnalysis | undefined,
    [application?.optimizationAnalysis]
  )

  const moveSection = useCallback(
    (index: number, direction: "up" | "down") => {
      const newOrder = [...sectionOrder]
      const target = direction === "up" ? index - 1 : index + 1
      if (target < 0 || target >= newOrder.length) return
      ;[newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]]
      setSectionOrder(newOrder)
      setResumeData((prev) => ({
        ...(prev ?? DEFAULT_RESUME_DATA),
        sectionOrder: newOrder,
      }))
    },
    [sectionOrder],
  )

  const sectionLabels: Record<SectionId, string> = {
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    certifications: "Certifications",
  }

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

  const shell = "dark flex h-full flex-col overflow-hidden bg-[#0c1a1a]"
  const dotGrid = {
    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
    backgroundSize: "24px 24px",
  }

  // Loading state
  if (application === undefined) {
    return (
      <div className={shell} style={dotGrid}>
        <div className="space-y-4 p-8">
          <Skeleton className="h-8 w-64 opacity-20" />
          <div className="grid h-[80vh] grid-cols-1 gap-6 lg:grid-cols-2">
            <Skeleton className="rounded-2xl opacity-20" />
            <Skeleton className="rounded-2xl opacity-20" />
          </div>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className={shell} style={dotGrid}>
        <div className="flex h-[60vh] items-center justify-center">
          <p className="text-sm text-white/40">Application not found.</p>
        </div>
      </div>
    )
  }

  // Processing state
  if (application.status === "processing") {
    return (
      <div className={shell} style={dotGrid}>
        <div className="flex items-center gap-3 border-b border-white/8 px-6 py-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white/50 hover:bg-white/10 hover:text-white">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-white">{application.jobTitle}</h1>
            <p className="text-[11px] text-white/40">{application.company}</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-5">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-[#a4f5a6]/20 bg-[#a4f5a6]/10">
            <Loader2 className="size-6 animate-spin text-[#a4f5a6]" />
          </div>
          <div className="space-y-1.5 text-center">
            <p className="text-sm font-semibold text-white">Tailoring your CV with AI...</p>
            <p className="text-xs text-white/40">
              Applying CARL framework, optimizing action verbs, and generating your cover letter.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Failed state
  if (application.status === "failed") {
    return (
      <div className={shell} style={dotGrid}>
        <div className="flex items-center gap-3 border-b border-white/8 px-6 py-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white/50 hover:bg-white/10 hover:text-white">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-white">{application.jobTitle}</h1>
            <p className="text-[11px] text-white/40">{application.company}</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-5">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10">
            <XCircle className="size-6 text-destructive" />
          </div>
          <div className="space-y-1.5 text-center">
            <p className="text-sm font-semibold text-white">Tailoring failed</p>
            <p className="text-xs text-white/40">
              Something went wrong while optimizing your CV. Please go back and try again.
            </p>
          </div>
          <Link href="/">
            <Button size="sm" className="gap-1.5 bg-[#a4f5a6] text-[#0c1a1a] hover:bg-[#a4f5a6]/90">
              <ArrowLeft className="size-3" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={shell} style={dotGrid}>
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white/50 hover:bg-white/10 hover:text-white">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-white">{application.jobTitle}</h1>
            <p className="text-[11px] text-white/40">{application.company}</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-2 py-1.5 backdrop-blur-sm sm:gap-2 sm:px-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white"
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
          <Separator orientation="vertical" className="h-4 bg-white/10" />
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
        {/* Left: editor */}
        <div className="overflow-y-auto border-r border-white/8">
          <div className="p-4 sm:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 border border-white/10 bg-white/5">
                <TabsTrigger value="resume" className="gap-1.5 text-xs data-[state=active]:bg-[#a4f5a6] data-[state=active]:text-[#0c1a1a]">
                  <FileText className="size-3" />
                  Resume
                </TabsTrigger>
                <TabsTrigger value="coverLetter" className="gap-1.5 text-xs data-[state=active]:bg-[#a4f5a6] data-[state=active]:text-[#0c1a1a]">
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
                {sectionOrder.map((sectionId, index) => {
                  const isFirst = index === 0
                  const isLast = index === sectionOrder.length - 1

                  const sectionContent = (() => {
                    switch (sectionId) {
                      case "experience":
                        return (
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
                        )
                      case "education":
                        return (
                          <EducationSection
                            data={currentResumeData.education}
                            onChange={(education) =>
                              setResumeData((prev) => ({
                                ...(prev ?? DEFAULT_RESUME_DATA),
                                education,
                              }))
                            }
                          />
                        )
                      case "skills":
                        return (
                          <SkillsSection
                            data={currentResumeData.skills}
                            onChange={(skills) =>
                              setResumeData((prev) => ({
                                ...(prev ?? DEFAULT_RESUME_DATA),
                                skills,
                              }))
                            }
                          />
                        )
                      case "projects":
                        return (
                          <ProjectsSection
                            data={currentResumeData.projects}
                            onChange={(projects) =>
                              setResumeData((prev) => ({
                                ...(prev ?? DEFAULT_RESUME_DATA),
                                projects,
                              }))
                            }
                          />
                        )
                      case "certifications":
                        return (
                          <CertificationsSection
                            data={currentResumeData.certifications}
                            onChange={(certifications) =>
                              setResumeData((prev) => ({
                                ...(prev ?? DEFAULT_RESUME_DATA),
                                certifications,
                              }))
                            }
                          />
                        )
                    }
                  })()

                  return (
                    <div key={sectionId}>
                      <Separator className="bg-white/8" />
                      <div className="flex items-center justify-between pt-4 pb-2">
                        <span className="text-[10px] font-medium uppercase tracking-widest text-white/30">
                          {sectionLabels[sectionId]}
                        </span>
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => moveSection(index, "up")}
                            className="rounded p-1 text-white/30 transition-colors hover:bg-white/10 hover:text-white/60 disabled:opacity-20 disabled:hover:bg-transparent"
                          >
                            <ChevronUp className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={isLast}
                            onClick={() => moveSection(index, "down")}
                            className="rounded p-1 text-white/30 transition-colors hover:bg-white/10 hover:text-white/60 disabled:opacity-20 disabled:hover:bg-transparent"
                          >
                            <ChevronDown className="size-3.5" />
                          </button>
                        </div>
                      </div>
                      {sectionContent}
                    </div>
                  )
                })}
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
        <div className="hidden overflow-hidden bg-[#071212] lg:block">
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
