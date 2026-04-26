
import type { ResumeData } from "../../lib/types";
import { formatDateRange, parseBullets, parseCommaList } from "../../lib/utils";
import { MailIcon, PhoneIcon, MapPinIcon, LinkedinIcon, GithubIcon, GlobeIcon } from "../Icons";

interface Props {
  data: ResumeData;
}

const s = {
  page: {
    fontFamily: "'Lora', 'Georgia', serif",
    fontSize: "10pt",
    color: "#1a1a1a",
    lineHeight: "1.5",
    padding: "36pt 44pt",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: "1123px",
    width: "100%",
  } as React.CSSProperties,
  name: {
    fontSize: "24pt",
    fontWeight: "700",
    color: "#0f2044",
    letterSpacing: "-0.5px",
    marginBottom: "2pt",
  } as React.CSSProperties,
  jobTitle: {
    fontSize: "11pt",
    color: "#3b5998",
    fontStyle: "italic",
    marginBottom: "6pt",
  } as React.CSSProperties,
  contactLine: {
    fontSize: "8.5pt",
    color: "#555",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "0 16pt",
    borderTop: "1.5pt solid #0f2044",
    borderBottom: "0.5pt solid #ddd",
    padding: "5pt 0",
    marginBottom: "14pt",
  } as React.CSSProperties,
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "4pt",
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: "9pt",
    fontWeight: "700",
    color: "#0f2044",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    borderBottom: "1pt solid #0f2044",
    paddingBottom: "2pt",
    marginBottom: "8pt",
    marginTop: "14pt",
  } as React.CSSProperties,
  entryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: "8pt",
  } as React.CSSProperties,
  entryTitle: {
    fontWeight: "700",
    fontSize: "10.5pt",
    color: "#111",
  } as React.CSSProperties,
  entryDate: {
    fontSize: "8.5pt",
    color: "#666",
    whiteSpace: "nowrap" as const,
    flexShrink: 0,
  } as React.CSSProperties,
  entrySub: {
    fontSize: "9.5pt",
    color: "#444",
    fontStyle: "italic",
    marginBottom: "3pt",
  } as React.CSSProperties,
  bullet: {
    display: "flex",
    gap: "6pt",
    fontSize: "9.5pt",
    color: "#222",
    marginTop: "2pt",
  } as React.CSSProperties,
  bulletDot: {
    flexShrink: 0,
    marginTop: "0.5pt",
    color: "#3b5998",
    fontStyle: "normal",
  } as React.CSSProperties,
  tag: {
    display: "inline-block",
    background: "#eef2ff",
    color: "#3730a3",
    borderRadius: "3pt",
    padding: "1pt 5pt",
    fontSize: "8pt",
    marginRight: "4pt",
    marginBottom: "3pt",
  } as React.CSSProperties,
  skillRow: {
    display: "flex",
    gap: "4pt",
    marginBottom: "4pt",
    alignItems: "baseline",
    flexWrap: "wrap" as const,
  } as React.CSSProperties,
  skillLabel: {
    fontSize: "9.5pt",
    fontWeight: "700",
    color: "#222",
    minWidth: "90pt",
    flexShrink: 0,
  } as React.CSSProperties,
};

export default function ClassicTemplate({ data }: Props) {
  const {
    personal: p,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    awards,
    volunteer,
  } = data;
  const hasExp = experience.length > 0;

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={{ marginBottom: "2pt" }}>
        {p.fullName && <div style={s.name}>{p.fullName}</div>}
        {p.jobTitle && <div style={s.jobTitle}>{p.jobTitle}</div>}
      </div>

      {/* Contact */}
      <div style={s.contactLine}>
        {p.email && <span style={s.contactItem}><MailIcon size={12} /> {p.email}</span>}
        {p.phone && <span style={s.contactItem}><PhoneIcon size={12} /> {p.phone}</span>}
        {p.location && <span style={s.contactItem}><MapPinIcon size={12} /> {p.location}</span>}
        {p.linkedin && (
          <span style={s.contactItem}>
            <LinkedinIcon size={12} /> {p.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
          </span>
        )}
        {p.github && (
          <span style={s.contactItem}>
            <GithubIcon size={12} /> {p.github.replace(/^https?:\/\/(www\.)?/, "")}
          </span>
        )}
        {p.website && (
          <span style={s.contactItem}>
            <GlobeIcon size={12} /> {p.website.replace(/^https?:\/\//, "")}
          </span>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <>
          <div style={s.sectionTitle}>
            {hasExp ? "Professional Summary" : "Objective"}
          </div>
          <p style={{ fontSize: "9.5pt", color: "#333", lineHeight: "1.6" }}>
            {summary}
          </p>
        </>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <>
          <div style={s.sectionTitle}>Work Experience</div>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "10pt" }}>
              <div style={s.entryHeader}>
                <span style={s.entryTitle}>{exp.position}</span>
                <span style={s.entryDate}>
                  {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                </span>
              </div>
              <div style={s.entrySub}>
                {exp.company}
                {exp.location ? ` · ${exp.location}` : ""}
              </div>
              {parseBullets(exp.description).map((b, i) => (
                <div key={i} style={s.bullet}>
                  <span style={s.bulletDot}>▸</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Education */}
      {education.length > 0 && (
        <>
          <div style={s.sectionTitle}>Education</div>
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "8pt" }}>
              <div style={s.entryHeader}>
                <span style={s.entryTitle}>{edu.institution}</span>
                <span style={s.entryDate}>
                  {formatDateRange(edu.startDate, edu.endDate, edu.isCurrent)}
                </span>
              </div>
              <div style={s.entrySub}>
                {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}
                {edu.location ? ` · ${edu.location}` : ""}
                {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
              </div>
              {parseBullets(edu.achievements).map((a, i) => (
                <div key={i} style={s.bullet}>
                  <span style={s.bulletDot}>▸</span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Skills */}
      {skills.filter((sg) => sg.items).length > 0 && (
        <>
          <div style={s.sectionTitle}>Skills</div>
          {skills
            .filter((sg) => sg.items)
            .map((sg) => (
              <div key={sg.id} style={s.skillRow}>
                {sg.category && (
                  <span style={s.skillLabel}>{sg.category}:</span>
                )}
                <span style={{ fontSize: "9.5pt", color: "#333" }}>
                  {parseCommaList(sg.items).join(" · ")}
                </span>
              </div>
            ))}
        </>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <>
          <div style={s.sectionTitle}>Projects</div>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "8pt" }}>
              <div style={s.entryHeader}>
                <span
                  style={{
                    ...s.entryTitle,
                    display: "flex",
                    alignItems: "center",
                    gap: "6pt",
                  }}
                >
                  {proj.name}
                  {(proj.liveUrl || proj.repoUrl) && (
                    <span
                      style={{
                        fontSize: "8pt",
                        color: "#3b5998",
                        fontWeight: "normal",
                        fontStyle: "italic",
                      }}
                    >
                      {proj.liveUrl
                        ? proj.liveUrl.replace(/^https?:\/\//, "")
                        : proj.repoUrl.replace(/^https?:\/\//, "")}
                    </span>
                  )}
                </span>
                {(proj.startDate || proj.endDate) && (
                  <span style={s.entryDate}>
                    {formatDateRange(proj.startDate, proj.endDate, false)}
                  </span>
                )}
              </div>
              {proj.technologies && (
                <div style={{ ...s.entrySub, marginBottom: "3pt" }}>
                  Tech: {proj.technologies}
                </div>
              )}
              {parseBullets(proj.description).map((b, i) => (
                <div key={i} style={s.bullet}>
                  <span style={s.bulletDot}>▸</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <>
          <div style={s.sectionTitle}>Certifications</div>
          {certifications.map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4pt",
              }}
            >
              <span style={{ fontSize: "9.5pt", color: "#111" }}>
                <strong>{c.name}</strong> · {c.issuer}
              </span>
              <span style={s.entryDate}>
                {c.issueDate ? c.issueDate.slice(0, 7).replace("-", "/") : ""}
                {c.expiryDate
                  ? ` – ${c.expiryDate.slice(0, 7).replace("-", "/")}`
                  : ""}
              </span>
            </div>
          ))}
        </>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <>
          <div style={s.sectionTitle}>Languages</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4pt 20pt" }}>
            {languages.map((l) => (
              <span key={l.id} style={{ fontSize: "9.5pt", color: "#222" }}>
                <strong>{l.name}</strong>
                {l.proficiency && (
                  <span style={{ color: "#666" }}> ({l.proficiency})</span>
                )}
              </span>
            ))}
          </div>
        </>
      )}

      {/* Awards */}
      {awards.length > 0 && (
        <>
          <div style={s.sectionTitle}>Awards & Achievements</div>
          {awards.map((a) => (
            <div
              key={a.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "3pt",
              }}
            >
              <span style={{ fontSize: "9.5pt" }}>
                <strong>{a.title}</strong>
                {a.issuer ? ` · ${a.issuer}` : ""}
                {a.description && (
                  <span style={{ color: "#555" }}> — {a.description}</span>
                )}
              </span>
              {a.date && (
                <span style={s.entryDate}>
                  {a.date.slice(0, 7).replace("-", "/")}
                </span>
              )}
            </div>
          ))}
        </>
      )}

      {/* Volunteer */}
      {volunteer.length > 0 && (
        <>
          <div style={s.sectionTitle}>Volunteer Work</div>
          {volunteer.map((v) => (
            <div key={v.id} style={{ marginBottom: "8pt" }}>
              <div style={s.entryHeader}>
                <span style={s.entryTitle}>{v.role}</span>
                <span style={s.entryDate}>
                  {formatDateRange(v.startDate, v.endDate, v.isCurrent)}
                </span>
              </div>
              <div style={s.entrySub}>{v.organization}</div>
              {parseBullets(v.description).map((b, i) => (
                <div key={i} style={s.bullet}>
                  <span style={s.bulletDot}>▸</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
