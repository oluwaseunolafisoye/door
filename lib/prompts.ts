export const ACTION_VERBS = [
  "Spearheaded",
  "Orchestrated",
  "Engineered",
  "Accelerated",
  "Championed",
  "Implemented",
  "Optimized",
  "Streamlined",
  "Pioneered",
  "Transformed",
  "Architected",
  "Delivered",
  "Drove",
  "Elevated",
  "Established",
  "Executed",
  "Expanded",
  "Facilitated",
  "Generated",
  "Launched",
  "Led",
  "Maximized",
  "Negotiated",
  "Overhauled",
  "Redesigned",
  "Reduced",
  "Revamped",
  "Scaled",
  "Secured",
  "Strengthened",
] as const

export const CARL_EXPLANATION = `The CARL framework structures accomplishments as:
- **Context**: The situation or challenge faced
- **Action**: What you specifically did (using a strong action verb)
- **Result**: The measurable outcome or impact
- **Learning**: (Optional) What was gained or how it applies forward

Example: "Spearheaded the migration of a legacy monolith to microservices architecture (Context), designing and implementing 12 independent services with CI/CD pipelines (Action), reducing deployment time by 75% and improving system uptime to 99.9% (Result)."`

export function buildCVParsingPrompt(rawText: string): string {
  return `You are an expert resume parser. Extract structured data from the following resume text.

Return a JSON object with this exact structure:
{
  "profile": {
    "name": "string",
    "title": "string (job title / professional headline)",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string (URL or empty)",
    "website": "string (URL or empty)",
    "summary": "string (professional summary or objective)"
  },
  "experience": [
    {
      "id": "string (unique id like exp-1)",
      "company": "string",
      "title": "string",
      "location": "string",
      "startDate": "string (e.g. Jan 2020)",
      "endDate": "string (e.g. Present or Dec 2023)",
      "current": boolean,
      "bullets": ["string (each accomplishment as a bullet)"]
    }
  ],
  "education": [
    {
      "id": "string (unique id like edu-1)",
      "institution": "string",
      "degree": "string",
      "field": "string",
      "startDate": "string",
      "endDate": "string",
      "gpa": "string or null",
      "honors": "string or null"
    }
  ],
  "skills": [
    {
      "id": "string (unique id like skill-1)",
      "category": "string (e.g. Programming Languages, Frameworks, Tools)",
      "items": ["string"]
    }
  ],
  "projects": [
    {
      "id": "string (unique id like proj-1)",
      "name": "string",
      "description": "string",
      "technologies": "string",
      "url": "string or null",
      "bullets": ["string"]
    }
  ],
  "certifications": [
    {
      "id": "string (unique id like cert-1)",
      "name": "string",
      "issuer": "string",
      "date": "string"
    }
  ]
}

Parse this resume text:

${rawText}

Return ONLY valid JSON, no markdown fences, no explanation.`
}

export function buildTailoringPrompt(
  resumeJson: string,
  jobTitle: string,
  company: string,
  jobDescription: string,
): string {
  return `You are an expert career consultant and resume writer. Your task is to tailor a resume and write a cover letter for a specific job application.

## RESUME DATA (current)
${resumeJson}

## TARGET JOB
- **Job Title**: ${jobTitle}
- **Company**: ${company}
- **Job Description**:
${jobDescription}

## INSTRUCTIONS FOR RESUME TAILORING

### PRIME DIRECTIVE: 90%+ KEYWORD MATCH
Your #1 goal is to make this resume look like the job was written specifically for this candidate. The tailored resume MUST contain at least 90% of the keywords, technologies, tools, frameworks, and skills mentioned in the job description. Every single keyword from the JD must appear somewhere in the resume — in the summary, skills, experience bullets, or projects.

### KEYWORD SATURATION STRATEGY
Before writing anything, extract EVERY keyword/skill/technology/tool/methodology from the job description. Then ensure EACH one appears in the resume using this priority:
1. **Skills section**: Add ALL technologies and tools from the JD to the skills section. If the candidate has ANY adjacent experience (e.g., they know React → they can list Next.js; they know Python → they can list Flask/Django; they know AWS → they can list specific services), add those JD keywords to skills.
2. **Experience bullets**: Rewrite bullets to explicitly name the technologies, methodologies, and practices from the JD. If the JD says "microservices" and a bullet describes building "independent services", rewrite it to say "microservices". Use the EXACT terminology from the JD.
3. **Summary**: The professional summary must hit at least 8-10 major keywords from the JD in the first 2-3 sentences.
4. **Projects**: Mention JD-relevant technologies in project descriptions.

### KEYWORD MATCHING RULES
- Use the EXACT terms from the JD. If the JD says "CI/CD pipelines", write "CI/CD pipelines" — not "continuous integration" or "deployment automation"
- If the JD mentions a tool the candidate hasn't used but has used a similar alternative (e.g., JD says "Jest" and candidate used "Mocha"), add BOTH — mention the JD keyword as a known tool alongside the one they used
- Every technology stack keyword (languages, frameworks, databases, cloud services, tools) from the JD MUST appear in the Skills section at minimum
- Soft skills and methodologies from the JD (e.g., "Agile", "cross-functional", "stakeholder management") must appear in experience bullets or summary

### CARL Framework
Rewrite EVERY experience bullet using the CARL framework:
   - Context: Brief situation/challenge
   - Action: What was done (start with a STRONG action verb) — MUST reference JD-specific technologies and practices
   - Result: Measurable outcome with numbers/percentages where possible
   - Learning: (weave in implicitly, don't make it a separate clause)

### Action Verbs
Start each bullet with one of these powerful verbs:
   ${ACTION_VERBS.join(", ")}
   
   NEVER use weak verbs like: Helped, Assisted, Worked on, Was responsible for, Participated in

### Summary
Rewrite the professional summary to be a near-perfect mirror of the JD requirements. It should read like the candidate wrote their summary specifically for this role. Pack it with JD keywords while keeping it natural and confident. Mention the company by name.

### Skills Section
- Reorganize to put the most JD-relevant skills FIRST
- ADD every skill/technology from the JD that the candidate could plausibly know based on their background
- Group them to match JD categories if possible
- The skills section should look like a checklist of the JD requirements

### Quantify
Add metrics wherever plausible (percentages, dollar amounts, team sizes, timelines).

## INSTRUCTIONS FOR COVER LETTER

Write a compelling, professional cover letter that:
- Opens with a specific hook about why the candidate is excited about this role at this company
- In 2-3 body paragraphs, maps the candidate's strongest experiences to the job requirements, using the EXACT keywords and technologies from the JD
- Uses specific examples from the resume (with CARL framing)
- Mentions at least 10-12 JD keywords/technologies throughout the letter
- Closes with enthusiasm and a call to action
- Tone: confident but not arrogant, professional but personable

## OUTPUT FORMAT

Return a JSON object with exactly this structure:
{
  "customizedResume": { <same ResumeData structure as input, with all fields tailored> },
  "coverLetter": {
    "recipientName": "Hiring Manager",
    "recipientTitle": "Hiring Team",
    "company": "${company}",
    "companyAddress": "",
    "opening": "string (first paragraph)",
    "bodyParagraphs": ["string (2-3 paragraphs)"],
    "closing": "string (closing paragraph)",
    "signoff": "Sincerely"
  }
}

Preserve all IDs from the original resume. Return ONLY valid JSON, no markdown fences.`
}

export function buildOptimizationPrompt(
  tailoredResumeJson: string,
  jobDescription: string,
): string {
  return `Analyze how well this tailored resume matches the job description.

## TAILORED RESUME
${tailoredResumeJson}

## JOB DESCRIPTION
${jobDescription}

## INSTRUCTIONS
1. Extract ALL key skills, technologies, tools, frameworks, methodologies, and requirements from the job description — aim for 20-30 keywords. Be thorough — every technical term, tool name, methodology, and soft skill counts.
2. For each keyword, check if it appears ANYWHERE in the resume (summary, experience, skills, projects, education). Only set "found": false if the keyword is truly absent. Be generous — if the resume uses a synonym or the skill is listed in a different form, count it as found.
3. For each experience item, map each bullet to the JD requirement it best addresses. For each bullet provide:
   - A short explanation (1-2 sentences) of how this accomplishment was optimized to match the job description
   - A list of core skills/keywords from the JD that were incorporated into this bullet
4. Produce summary counts.

## OUTPUT FORMAT
Return ONLY this JSON:
{
  "keywords": [
    { "keyword": "string", "found": true, "section": "experience | skills | summary | projects" }
  ],
  "experienceOptimizations": [
    {
      "experienceId": "string (matching experience id)",
      "bulletMappings": [
        { "bulletIndex": 0, "requirementMatched": "short requirement label", "explanation": "1-2 sentence explanation of how this bullet was optimized for the JD", "skills": ["skill1", "skill2"] }
      ]
    }
  ],
  "summary": {
    "keywordsMatched": 0,
    "totalKeywords": 0,
    "bulletsOptimized": 0,
    "requirementsCovered": ["requirement label"],
    "totalRequirements": 0
  }
}

Return ONLY valid JSON, no markdown fences.`
}
