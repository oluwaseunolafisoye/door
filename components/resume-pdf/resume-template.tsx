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
import type { ResumeData } from "@/lib/types"

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

const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 9.5,
    paddingHorizontal: 44,
    paddingTop: 16,
    paddingBottom: 24,
    color: "#1a1a1a",
    lineHeight: 1.4,
    backgroundColor: "#ffffff",
  },
  // ── Header ────────────────────────────────────────────────
  header: {
    marginBottom: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#d4d4d4",
    flexDirection: "column",
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 2,
    color: "#111111",
    lineHeight: 1.2,
  },
  title: {
    fontSize: 10.5,
    color: "#525252",
    marginBottom: 8,
    lineHeight: 1.3,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  contactItem: {
    fontSize: 8.5,
    color: "#404040",
  },
  contactLink: {
    fontSize: 8.5,
    color: "#404040",
    textDecoration: "none",
  },
  // ── Section header ────────────────────────────────────────
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 8,
    gap: 6,
  },
  sectionBar: {
    width: 28,
    height: 4,
    backgroundColor: "#111111",
    borderRadius: 1,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: 1.2,
    color: "#111111",
  },
  // ── Summary ───────────────────────────────────────────────
  summaryText: {
    fontSize: 9,
    color: "#404040",
    lineHeight: 1.55,
  },
  // ── Experience ────────────────────────────────────────────
  expItem: {
    marginBottom: 10,
  },
  expTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 1,
  },
  expCompany: {
    fontWeight: 700,
    fontSize: 10,
    color: "#111111",
  },
  expDates: {
    fontSize: 8.5,
    color: "#737373",
  },
  expTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  expTitle: {
    fontSize: 9.5,
    color: "#404040",
  },
  expLocation: {
    fontSize: 8.5,
    color: "#737373",
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 2.5,
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
    lineHeight: 1.5,
    color: "#262626",
  },
  // ── Education ─────────────────────────────────────────────
  eduItem: {
    marginBottom: 7,
  },
  eduTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 1,
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
    marginBottom: 3.5,
  },
  skillCategory: {
    fontWeight: 600,
    fontSize: 9,
    color: "#111111",
    width: 130,
    flexShrink: 0,
  },
  skillItems: {
    flex: 1,
    fontSize: 9,
    color: "#404040",
    lineHeight: 1.5,
  },
  // ── Projects ──────────────────────────────────────────────
  projItem: {
    marginBottom: 9,
  },
  projTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  projName: {
    fontWeight: 700,
    fontSize: 10,
    color: "#111111",
  },
  projTech: {
    fontSize: 8.5,
    color: "#737373",
  },
  projDesc: {
    fontSize: 9,
    color: "#525252",
    marginBottom: 3,
  },
  // ── Certifications ────────────────────────────────────────
  certItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
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
      <View style={s.sectionBar} />
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

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.name}>{profile.name || "Your Name"}</Text>
          {profile.title && <Text style={s.title}>{profile.title}</Text>}
          <View style={s.contactRow}>
            {profile.email && (
              <Link src={`mailto:${profile.email}`} style={s.contactLink}>
                {profile.email}
              </Link>
            )}
            {profile.phone && (
              <Link src={`tel:${profile.phone}`} style={s.contactLink}>
                {profile.phone}
              </Link>
            )}
            {profile.location && (
              <Text style={s.contactItem}>{profile.location}</Text>
            )}
            {profile.linkedin && (
              <Link
                src={profile.linkedin.startsWith("http") ? profile.linkedin : `https://${profile.linkedin}`}
                style={s.contactLink}
              >
                {profile.linkedin}
              </Link>
            )}
            {profile.website && (
              <Link
                src={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                style={s.contactLink}
              >
                {profile.website}
              </Link>
            )}
          </View>
        </View>

        {/* Summary */}
        {profile.summary && (
          <View>
            <SectionHeader title="Summary" />
            <Text style={s.summaryText}>{profile.summary}</Text>
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View>
            <SectionHeader title="Skills" />
            {skills.map((cat) => (
              <View key={cat.id} style={s.skillRow}>
                <Text style={s.skillCategory}>{cat.category}:</Text>
                <Text style={s.skillItems}>{cat.items.join(", ")}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View>
            <SectionHeader title="Work Experience" />
            {experience.map((exp) => (
              <View key={exp.id} style={s.expItem}>
                <View wrap={false}>
                  <Text style={s.expCompany}>{exp.company}</Text>
                  <View style={s.expTitleRow}>
                    <Text style={s.expTitle}>
                      {exp.title}
                      {exp.location ? `, ${exp.location}` : ""}
                    </Text>
                    <Text style={s.expDates}>
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </Text>
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
        )}

        {/* Education */}
        {education.length > 0 && (
          <View>
            <SectionHeader title="Education" />
            {education.map((edu) => (
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
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View>
            <SectionHeader title="Projects" />
            {projects.map((proj) => (
              <View key={proj.id} style={s.projItem}>
                <View style={s.projTopRow}>
                  <Text style={s.projName}>{proj.name}</Text>
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
                        <Text style={s.bulletText}>{bullet}</Text>
                      </View>
                    ),
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <View>
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
        )}
      </Page>
    </Document>
  )
}
