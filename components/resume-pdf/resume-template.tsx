"use client"

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
} from "@react-pdf/renderer"
import type { ResumeData, SectionId } from "@/lib/types"
import { DEFAULT_SECTION_ORDER } from "@/lib/types"

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjQ.ttf",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjQ.ttf",
      fontWeight: 700,
    },
  ],
})

// Disable automatic hyphenation to prevent mid-word breaks (e.g., "produc tion-ready")
Font.registerHyphenationCallback((word) => [word])

const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 9.5,
    paddingHorizontal: 40,
    paddingTop: 14,
    paddingBottom: 14,
    color: "#1a1a1a",
    lineHeight: 1.35,
    backgroundColor: "#ffffff",
  },
  // ── Header ────────────────────────────────────────────────
  header: {
    marginBottom: 4,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#d4d4d4",
    flexDirection: "column",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 1,
    color: "#111111",
    lineHeight: 1.2,
    textAlign: "center",
  },
  title: {
    fontSize: 10,
    color: "#525252",
    marginBottom: 3,
    lineHeight: 1.2,
    textAlign: "center",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  contactItem: {
    fontSize: 7.5,
    color: "#404040",
  },
  contactLink: {
    fontSize: 7.5,
    color: "#404040",
    textDecoration: "none",
  },
  contactSep: {
    fontSize: 7.5,
    color: "#a3a3a3",
    marginHorizontal: 3,
  },
  // ── Section header ────────────────────────────────────────
  sectionHeaderRow: {
    marginTop: 3,
    marginBottom: 3,
    paddingBottom: 2,
    borderBottomWidth: 0.75,
    borderBottomColor: "#d4d4d4",
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    color: "#000000",
  },
  // ── Summary ───────────────────────────────────────────────
  summaryText: {
    fontSize: 9,
    color: "#404040",
    lineHeight: 1.35,
  },
  // ── Experience ────────────────────────────────────────────
  expItem: {
    marginBottom: 5,
  },
  expTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 0.5,
  },
  expTitle: {
    fontWeight: 700,
    fontSize: 10,
    color: "#111111",
  },
  expDates: {
    fontSize: 8.5,
    color: "#737373",
  },
  expCompanyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  expCompany: {
    fontSize: 9.5,
    color: "#404040",
  },
  expLocation: {
    fontSize: 8.5,
    color: "#737373",
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 1,
    paddingLeft: 6,
  },
  bulletDot: {
    width: 10,
    fontSize: 9,
    color: "#555555",
    marginTop: 0.5,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
    color: "#262626",
  },
  // ── Education ─────────────────────────────────────────────
  eduItem: {
    marginBottom: 2,
  },
  eduTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 0.5,
  },
  eduSchool: {
    fontWeight: 700,
    fontSize: 10,
    color: "#111111",
  },
  eduDegree: {
    fontSize: 9,
    color: "#525252",
  },
  // ── Skills ────────────────────────────────────────────────
  skillRow: {
    flexDirection: "row",
    marginBottom: 1.5,
  },
  skillCategory: {
    fontWeight: 600,
    fontSize: 9,
    color: "#111111",
    maxWidth: 130,
    marginRight: 8,
    flexShrink: 0,
  },
  skillItems: {
    flex: 1,
    fontSize: 9,
    color: "#404040",
    lineHeight: 1.4,
  },
  // ── Projects ──────────────────────────────────────────────
  projItem: {
    marginBottom: 3,
  },
  projTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  projNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  projName: {
    fontWeight: 700,
    fontSize: 10,
    color: "#111111",
  },
  projUrl: {
    fontSize: 8.5,
    color: "#2563eb",
    textDecoration: "none",
  },
  projTech: {
    fontSize: 8.5,
    color: "#737373",
  },
  projDesc: {
    fontSize: 8.5,
    color: "#525252",
    marginBottom: 1,
  },
  projBulletText: {
    flex: 1,
    fontSize: 8.5,
    lineHeight: 1.4,
    color: "#262626",
  },
  // ── Certifications ────────────────────────────────────────
  certItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  certName: {
    fontWeight: 600,
    fontSize: 9.5,
    color: "#111111",
  },
  certIssuer: {
    fontSize: 8.5,
    color: "#737373",
  },
})

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={s.sectionHeaderRow}>
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  )
}

interface ResumeTemplateProps {
  data: ResumeData
}

export function ResumeTemplate({ data }: ResumeTemplateProps) {
  const { profile, experience, education, skills, projects, certifications } =
    data
  const order = data.sectionOrder ?? DEFAULT_SECTION_ORDER
  const hidden = new Set(data.hiddenSections ?? [])
  const visibleExperience = experience.filter((e) => !e.hidden)
  const visibleEducation = education.filter((e) => !e.hidden)
  const visibleProjects = projects.filter((p) => !p.hidden)

  const renderSection = (id: SectionId) => {
    if (hidden.has(id)) return null
    switch (id) {
      case "skills":
        return skills.length > 0 ? (
          <View key={id}>
            <SectionHeader title="Skills" />
            {skills.map((cat) => (
              <View key={cat.id} style={s.skillRow}>
                {cat.category ? (
                  <Text style={s.skillCategory}>{cat.category}:</Text>
                ) : null}
                <Text style={s.skillItems}>{cat.items.join(", ")}</Text>
              </View>
            ))}
          </View>
        ) : null
      case "experience":
        return visibleExperience.length > 0 ? (
          <View key={id}>
            <SectionHeader title="Work Experience" />
            {visibleExperience.map((exp) => (
              <View key={exp.id} style={s.expItem}>
                <View wrap={false}>
                  <View style={s.expTopRow}>
                    <Text style={s.expTitle}>{exp.title}</Text>
                    <Text style={s.expDates}>
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </Text>
                  </View>
                  <View style={s.expCompanyRow}>
                    <Text style={s.expCompany}>{exp.company}</Text>
                    {exp.location ? (
                      <Text style={s.expLocation}>{exp.location}</Text>
                    ) : null}
                  </View>
                  {exp.bullets[0] && (
                    <View style={s.bullet}>
                      <Text style={s.bulletDot}>•</Text>
                      <Text style={s.bulletText}>{exp.bullets[0]}</Text>
                    </View>
                  )}
                </View>
                {exp.bullets.slice(1).map(
                  (bullet, i) =>
                    bullet && (
                      <View key={i} style={s.bullet}>
                        <Text style={s.bulletDot}>•</Text>
                        <Text style={s.bulletText}>{bullet}</Text>
                      </View>
                    ),
                )}
              </View>
            ))}
          </View>
        ) : null
      case "education":
        return visibleEducation.length > 0 ? (
          <View key={id}>
            <SectionHeader title="Education" />
            {visibleEducation.map((edu) => (
              <View key={edu.id} style={s.eduItem}>
                <View style={s.eduTopRow}>
                  <Text style={s.eduSchool}>{edu.institution}</Text>
                  <Text style={s.expDates}>
                    {edu.startDate} — {edu.endDate}
                  </Text>
                </View>
                <Text style={s.eduDegree}>
                  {edu.degree}
                  {edu.field ? ` in ${edu.field}` : ""}
                  {edu.gpa ? ` — GPA: ${edu.gpa}` : ""}
                  {edu.honors ? ` — ${edu.honors}` : ""}
                </Text>
                {edu.description && (
                  <Text style={s.summaryText}>{edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        ) : null
      case "projects":
        return visibleProjects.length > 0 ? (
          <View key={id}>
            <SectionHeader title="Projects" />
            {visibleProjects.map((proj) => (
              <View key={proj.id} style={s.projItem}>
                <View style={s.projTopRow}>
                  <View style={s.projNameRow}>
                    <Text style={s.projName}>{proj.name}</Text>
                    {proj.url && (
                      <Link
                        src={proj.url.startsWith("http") ? proj.url : `https://${proj.url}`}
                        style={s.projUrl}
                      >
                        {proj.url.replace(/^https?:\/\//, "")}
                      </Link>
                    )}
                  </View>
                  {proj.technologies && (
                    <Text style={s.projTech}>{proj.technologies}</Text>
                  )}
                </View>
                {proj.description && (
                  <Text style={s.projDesc}>{proj.description}</Text>
                )}
                {proj.bullets.map(
                  (bullet, i) =>
                    bullet && (
                      <View key={i} style={s.bullet}>
                        <Text style={s.bulletDot}>•</Text>
                        <Text style={s.projBulletText}>{bullet}</Text>
                      </View>
                    ),
                )}
              </View>
            ))}
          </View>
        ) : null
      case "certifications":
        return certifications.length > 0 ? (
          <View key={id}>
            <SectionHeader title="Certifications" />
            {certifications.map((cert) => (
              <View key={cert.id} style={s.certItem}>
                <View>
                  <Text style={s.certName}>{cert.name}</Text>
                  <Text style={s.certIssuer}>{cert.issuer}</Text>
                </View>
                <Text style={s.expDates}>{cert.date}</Text>
              </View>
            ))}
          </View>
        ) : null
    }
  }

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.name}>{profile.name || "Your Name"}</Text>
          {profile.title && <Text style={s.title}>{profile.title}</Text>}
          {(() => {
            const row1: React.ReactNode[] = []
            const row2: React.ReactNode[] = []
            if (profile.email)
              row1.push(
                <Link key="email" src={`mailto:${profile.email}`} style={s.contactLink}>
                  <Text style={s.contactLink}>{profile.email}</Text>
                </Link>
              )
            if (profile.phone)
              row1.push(
                <Link key="phone" src={`tel:${profile.phone}`} style={s.contactLink}>
                  <Text style={s.contactLink}>{profile.phone}</Text>
                </Link>
              )
            if (profile.location)
              row1.push(
                <Text key="loc" style={s.contactItem}>{profile.location}</Text>
              )
            if (profile.linkedin) {
              const liHandle = profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "").replace(/\/$/, "")
              row2.push(
                <Link key="li" src={`https://linkedin.com/in/${liHandle}`} style={s.contactLink}>
                  <Text style={s.contactLink}>{`linkedin.com/in/${liHandle}`}</Text>
                </Link>
              )
            }
            if (profile.github) {
              const ghHandle = profile.github.replace(/^https?:\/\/(www\.)?github\.com\//, "").replace(/\/$/, "")
              row2.push(
                <Link key="gh" src={`https://github.com/${ghHandle}`} style={s.contactLink}>
                  <Text style={s.contactLink}>{`github.com/${ghHandle}`}</Text>
                </Link>
              )
            }
            if (profile.website) {
              const webHref = profile.website.startsWith("http") ? profile.website : `https://${profile.website}`
              row2.push(
                <Link key="web" src={webHref} style={s.contactLink}>
                  <Text style={s.contactLink}>{profile.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</Text>
                </Link>
              )
            }
            const withSeps = (items: React.ReactNode[]) =>
              items.flatMap((item, i) =>
                i < items.length - 1
                  ? [item, <Text key={`sep-${i}`} style={s.contactSep}>|</Text>]
                  : [item]
              )
            return (
              <>
                {row1.length > 0 && <View style={s.contactRow}>{withSeps(row1)}</View>}
                {row2.length > 0 && <View style={s.contactRow}>{withSeps(row2)}</View>}
              </>
            )
          })()}
        </View>

        {/* Summary */}
        {profile.summary && (
          <View>
            <SectionHeader title="Summary" />
            <Text style={s.summaryText}>{profile.summary}</Text>
          </View>
        )}

        {/* Dynamic sections in user-defined order */}
        {order.map(renderSection).filter(Boolean)}
      </Page>
    </Document>
  )
}
