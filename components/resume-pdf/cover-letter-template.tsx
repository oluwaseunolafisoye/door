"use client"

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer"
import type { CoverLetterData, ProfileData } from "@/lib/types"

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
    fontSize: 10.5,
    paddingHorizontal: 50,
    paddingTop: 40,
    paddingBottom: 50,
    color: "#1a1a1a",
    lineHeight: 1.6,
    backgroundColor: "#ffffff",
  },
  // ── Sender address (top right) ────────────────────────────
  senderRow: {
    flexDirection: "row",
    marginBottom: 28,
  },
  senderBlock: {
    width: 160,
  },
  senderLine: {
    fontSize: 10,
    color: "#404040",
  },
  senderDate: {
    fontSize: 10,
    color: "#404040",
    marginTop: 2,
  },
  // ── Recipient (left, below sender) ───────────────────────
  recipient: {
    marginBottom: 24,
  },
  recipientLine: {
    fontSize: 10.5,
    color: "#1a1a1a",
  },
  // ── Subject title ─────────────────────────────────────────
  subject: {
    fontSize: 11,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 18,
    color: "#111111",
  },
  // ── Body ─────────────────────────────────────────────────
  salutation: {
    marginBottom: 10,
  },
  paragraph: {
    marginBottom: 10,
    textAlign: "justify" as const,
  },
  closing: {
    marginTop: 20,
  },
  signoff: {
    marginBottom: 4,
  },
})

interface CoverLetterTemplateProps {
  data: CoverLetterData
  senderProfile: ProfileData
  jobTitle?: string
}

export function CoverLetterTemplate({
  data,
  senderProfile,
  jobTitle,
}: CoverLetterTemplateProps) {
  const today = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const subjectLine =
    jobTitle && data.company
      ? `Cover Letter for the Role of ${jobTitle} at ${data.company}`
      : data.company
        ? `Cover Letter – ${data.company}`
        : "Cover Letter"

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Sender address top-right */}
        <View style={s.senderRow}>
          <View style={{ width: 700 }} />
          <View style={s.senderBlock}>
            {data.senderAddress || senderProfile.location
              ? (data.senderAddress || senderProfile.location)
                  .split("\n")
                  .filter(Boolean)
                  .map((line, i) => (
                    <Text key={i} style={s.senderLine}>
                      {line}
                    </Text>
                  ))
              : null}
            <Text style={s.senderDate}>{today}.</Text>
          </View>
        </View>

        {/* Recipient below, left */}
        <View style={s.recipient}>
          {data.recipientName && (
            <Text style={s.recipientLine}>{data.recipientName},</Text>
          )}
          {data.recipientTitle && (
            <Text style={s.recipientLine}>{data.recipientTitle},</Text>
          )}
          {data.company && <Text style={s.recipientLine}>{data.company},</Text>}
          {data.companyAddress && (
            <Text style={s.recipientLine}>{data.companyAddress}.</Text>
          )}
        </View>

        {/* Subject title */}
        <Text style={s.subject}>{subjectLine}</Text>

        {/* Salutation */}
        <Text style={s.salutation}>
          Dear {data.recipientName || "Hiring Manager"},
        </Text>

        {data.opening && <Text style={s.paragraph}>{data.opening}</Text>}

        {data.bodyParagraphs.map(
          (para, i) =>
            para && (
              <Text key={i} style={s.paragraph}>
                {para}
              </Text>
            )
        )}

        {data.closing && <Text style={s.paragraph}>{data.closing}</Text>}

        <View style={s.closing}>
          <Text style={s.signoff}>{data.signoff || "Yours sincerely"},</Text>
          <Text>{senderProfile.name}</Text>
        </View>
      </Page>
    </Document>
  )
}
