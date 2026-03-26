export interface ProfileData {
  name: string
  title: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  website: string
  summary: string
}

export interface ExperienceItem {
  id: string
  company: string
  title: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
  hidden?: boolean
}

export interface EducationItem {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
  honors?: string
  description?: string
  hidden?: boolean
}

export interface SkillCategory {
  id: string
  category: string
  items: string[]
}

export interface ProjectItem {
  id: string
  name: string
  description: string
  technologies: string
  url?: string
  bullets: string[]
  hidden?: boolean
}

export interface CertificationItem {
  id: string
  name: string
  issuer: string
  date: string
}

export type SectionId =
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
]

export interface ResumeData {
  profile: ProfileData
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: SkillCategory[]
  projects: ProjectItem[]
  certifications: CertificationItem[]
  sectionOrder?: SectionId[]
  hiddenSections?: SectionId[]
}

export interface CoverLetterData {
  senderAddress: string
  recipientName: string
  recipientTitle: string
  company: string
  companyAddress: string
  opening: string
  bodyParagraphs: string[]
  closing: string
  signoff: string
}

export type ApplicationStatus = "processing" | "completed" | "failed"

export interface KeywordMatch {
  keyword: string
  found: boolean
  section: string
}

export interface BulletMapping {
  bulletIndex: number
  requirementMatched: string
  explanation: string
  skills: string[]
}

export interface ExperienceOptimization {
  experienceId: string
  bulletMappings: BulletMapping[]
}

export interface OptimizationSummary {
  keywordsMatched: number
  totalKeywords: number
  bulletsOptimized: number
  requirementsCovered: string[]
  totalRequirements: number
}

export interface OptimizationAnalysis {
  keywords: KeywordMatch[]
  experienceOptimizations: ExperienceOptimization[]
  summary: OptimizationSummary
}

export const DEFAULT_RESUME_DATA: ResumeData = {
  profile: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    website: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
}

export const DEFAULT_COVER_LETTER_DATA: CoverLetterData = {
  senderAddress: "",
  recipientName: "",
  recipientTitle: "",
  company: "",
  companyAddress: "",
  opening: "",
  bodyParagraphs: [""],
  closing: "",
  signoff: "Sincerely",
}
