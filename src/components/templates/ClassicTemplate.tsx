import type { ResumeData } from "../../lib/types";
import {
  formatCalendarDate,
  formatDateRange,
  parseBullets,
  parseCommaList,
} from "../../lib/utils";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  LinkedinIcon,
  GithubIcon,
  GlobeIcon,
} from "../Icons";

interface Props {
  data: ResumeData;
}

const s = {
  page: {
    fontFamily: "var(--resume-font-family)",
    fontSize: "10pt",
    color: "#1a1a1a",
    lineHeight: "1.35",
    padding: "24pt 28pt",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: "var(--resume-a4-height)",
    width: "100%",
  } as React.CSSProperties,
  name: {
    fontSize: "21pt",
    fontWeight: "700",
    color: "#111",
    letterSpacing: "-0.3px",
    marginBottom: "2pt",
  } as React.CSSProperties,
  jobTitle: {
    fontSize: "9.5pt",
    color: "#444",
    fontStyle: "italic",
    marginBottom: "5pt",
  } as React.CSSProperties,
  topTitle: {
    fontSize: "7.5pt",
    fontWeight: "700",
    letterSpacing: "1.2px",
    textTransform: "uppercase" as const,
    color: "#333",
    marginBottom: "2pt",
  } as React.CSSProperties,
  topRow: {
    fontSize: "8.25pt",
    color: "#555",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "2pt 12pt",
    borderTop: "1pt solid #111",
    borderBottom: "0.5pt solid #ddd",
    padding: "4pt 0",
    marginBottom: "8pt",
  } as React.CSSProperties,
  topItem: {
    display: "flex",
    alignItems: "center",
    gap: "4pt",
    minWidth: 0,
  } as React.CSSProperties,
  summaryText: {
    fontSize: "9pt",
    color: "#333",
    lineHeight: "1.45",
    margin: 0,
  } as React.CSSProperties,
  bodyGrid: {
    display: "grid",
    gridTemplateColumns: "1.6fr 1fr",
    gap: "0 14pt",
    alignItems: "start",
    minWidth: 0,
  } as React.CSSProperties,
  section: {
    marginBottom: "8pt",
    minWidth: 0,
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: "8.6pt",
    fontWeight: "700",
    color: "#111",
    letterSpacing: "1.8px",
    textTransform: "uppercase" as const,
    borderBottom: "1pt solid #111",
    paddingBottom: "2pt",
    marginBottom: "6pt",
  } as React.CSSProperties,
  entry: {
    marginBottom: "6pt",
    minWidth: 0,
  } as React.CSSProperties,
  entryHeader: {
    display: "flex",
    alignItems: "baseline",
    gap: "8pt",
    minWidth: 0,
  } as React.CSSProperties,
  entryTitle: {
    fontWeight: "700",
    fontSize: "9.5pt",
    color: "#111",
    flex: 1,
    minWidth: 0,
  } as React.CSSProperties,
  entryDate: {
    fontSize: "7.8pt",
    color: "#666",
    whiteSpace: "nowrap" as const,
    flexShrink: 0,
  } as React.CSSProperties,
  entrySub: {
    fontSize: "8.5pt",
    color: "#555",
    fontStyle: "italic",
    marginBottom: "2pt",
    minWidth: 0,
  } as React.CSSProperties,
  bullet: {
    display: "flex",
    gap: "5pt",
    fontSize: "8.7pt",
    color: "#222",
    marginTop: "1pt",
    minWidth: 0,
  } as React.CSSProperties,
  bulletMark: {
    flexShrink: 0,
    color: "#666",
  } as React.CSSProperties,
  simpleRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "8pt",
    justifyContent: "space-between",
    marginBottom: "3pt",
    minWidth: 0,
  } as React.CSSProperties,
  simpleLeft: {
    fontSize: "8.7pt",
    color: "#222",
    flex: 1,
    minWidth: 0,
  } as React.CSSProperties,
  skillRow: {
    marginBottom: "4pt",
    fontSize: "8.7pt",
    color: "#333",
    minWidth: 0,
  } as React.CSSProperties,
  skillLabel: {
    fontWeight: "700",
    color: "#111",
  } as React.CSSProperties,
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={s.section}>
    <div style={s.sectionTitle}>{title}</div>
    {children}
  </div>
);

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

  const hasPersonalInfo = Boolean(
    p.birthDate || p.sex || p.civilStatus || p.nationality,
  );

  return (
    <div style={s.page}>
      <div style={{ marginBottom: "3pt" }}>
        {p.fullName && <div style={s.name}>{p.fullName}</div>}
        {p.jobTitle && <div style={s.jobTitle}>{p.jobTitle}</div>}
      </div>

      {hasPersonalInfo && (
        <>
          <div style={s.topTitle}>Personal Information</div>
          <div style={s.topRow}>
            {p.birthDate && (
              <span style={s.topItem}>Birth Date: {formatCalendarDate(p.birthDate)}</span>
            )}
            {p.sex && <span style={s.topItem}>Sex: {p.sex}</span>}
            {p.civilStatus && (
              <span style={s.topItem}>Civil Status: {p.civilStatus}</span>
            )}
            {p.nationality && (
              <span style={s.topItem}>Nationality: {p.nationality}</span>
            )}
          </div>
        </>
      )}

      {(p.email || p.phone || p.location || p.linkedin || p.github || p.website) && (
        <>
          <div style={s.topTitle}>Contact</div>
          <div
            style={{
              ...s.topRow,
              borderTop: hasPersonalInfo ? "0.5pt solid #ddd" : "1pt solid #111",
              marginBottom: "10pt",
            }}
          >
            {p.email && (
              <span style={s.topItem}>
                <MailIcon size={11} /> {p.email}
              </span>
            )}
            {p.phone && (
              <span style={s.topItem}>
                <PhoneIcon size={11} /> {p.phone}
              </span>
            )}
            {p.location && (
              <span style={s.topItem}>
                <MapPinIcon size={11} /> {p.location}
              </span>
            )}
            {p.linkedin && (
              <span style={s.topItem}>
                <LinkedinIcon size={11} /> {p.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
              </span>
            )}
            {p.github && (
              <span style={s.topItem}>
                <GithubIcon size={11} /> {p.github.replace(/^https?:\/\/(www\.)?/, "")}
              </span>
            )}
            {p.website && (
              <span style={s.topItem}>
                <GlobeIcon size={11} /> {p.website.replace(/^https?:\/\//, "")}
              </span>
            )}
          </div>
        </>
      )}

      {summary && (
        <Section title="Objectives">
          <p style={s.summaryText}>{summary}</p>
        </Section>
      )}

      <div style={s.bodyGrid}>
        <div style={{ minWidth: 0 }}>
          {experience.length > 0 && (
            <Section title="Work Experience">
              {experience.map((exp) => (
                <div key={exp.id} style={s.entry}>
                  <div style={s.entryHeader}>
                    <div style={s.entryTitle}>{exp.position}</div>
                    <div style={s.entryDate}>
                      {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                    </div>
                  </div>
                  <div style={s.entrySub}>
                    {exp.company}
                    {exp.location ? ` - ${exp.location}` : ""}
                  </div>
                  {parseBullets(exp.description).map((b, i) => (
                    <div key={i} style={s.bullet}>
                      <span style={s.bulletMark}>-</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              ))}
            </Section>
          )}

          {education.length > 0 && (
            <Section title="Education">
              {education.map((edu) => (
                <div key={edu.id} style={s.entry}>
                  <div style={s.entryHeader}>
                    <div style={s.entryTitle}>{edu.institution}</div>
                    <div style={s.entryDate}>
                      {formatDateRange(edu.startDate, edu.endDate, edu.isCurrent)}
                    </div>
                  </div>
                  <div style={s.entrySub}>
                    {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}
                    {edu.location ? ` - ${edu.location}` : ""}
                    {edu.gpa ? ` - GPA: ${edu.gpa}` : ""}
                  </div>
                  {parseBullets(edu.achievements).map((a, i) => (
                    <div key={i} style={s.bullet}>
                      <span style={s.bulletMark}>-</span>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              ))}
            </Section>
          )}

          {projects.length > 0 && (
            <Section title="Projects">
              {projects.map((proj) => (
                <div key={proj.id} style={s.entry}>
                  <div style={s.entryHeader}>
                    <div style={s.entryTitle}>{proj.name}</div>
                    {(proj.startDate || proj.endDate) && (
                      <div style={s.entryDate}>
                        {formatDateRange(proj.startDate, proj.endDate, false)}
                      </div>
                    )}
                  </div>
                  {(proj.liveUrl || proj.repoUrl) && (
                    <div style={s.entrySub}>
                      {(proj.liveUrl || proj.repoUrl).replace(/^https?:\/\//, "")}
                    </div>
                  )}
                  {proj.technologies && (
                    <div style={s.entrySub}>Tech: {proj.technologies}</div>
                  )}
                  {parseBullets(proj.description).map((b, i) => (
                    <div key={i} style={s.bullet}>
                      <span style={s.bulletMark}>-</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              ))}
            </Section>
          )}
        </div>

        <div style={{ minWidth: 0 }}>
          {skills.filter((sg) => sg.items).length > 0 && (
            <Section title="Skills">
              {skills
                .filter((sg) => sg.items)
                .map((sg) => (
                  <div key={sg.id} style={s.skillRow}>
                    {sg.category && (
                      <span style={s.skillLabel}>{sg.category}: </span>
                    )}
                    {parseCommaList(sg.items).join(", ")}
                  </div>
                ))}
            </Section>
          )}

          {certifications.length > 0 && (
            <Section title="Certifications">
              {certifications.map((c) => (
                <div key={c.id} style={s.simpleRow}>
                  <span style={s.simpleLeft}>
                    <strong>{c.name}</strong>
                    {c.issuer ? ` - ${c.issuer}` : ""}
                  </span>
                  <span style={s.entryDate}>
                    {c.issueDate ? c.issueDate.slice(0, 7).replace("-", "/") : ""}
                  </span>
                </div>
              ))}
            </Section>
          )}

          {languages.length > 0 && (
            <Section title="Languages">
              {languages.map((l) => (
                <div key={l.id} style={s.simpleRow}>
                  <span style={s.simpleLeft}>
                    <strong>{l.name}</strong>
                  </span>
                  <span style={s.entryDate}>{l.proficiency}</span>
                </div>
              ))}
            </Section>
          )}

          {awards.length > 0 && (
            <Section title="Awards & Achievements">
              {awards.map((a) => (
                <div key={a.id} style={s.entry}>
                  <div style={s.simpleLeft}>
                    <strong>{a.title}</strong>
                    {a.issuer ? ` - ${a.issuer}` : ""}
                  </div>
                  {a.description && (
                    <div style={{ ...s.entrySub, marginTop: "1pt" }}>{a.description}</div>
                  )}
                </div>
              ))}
            </Section>
          )}

          {volunteer.length > 0 && (
            <Section title="Volunteer Work">
              {volunteer.map((v) => (
                <div key={v.id} style={s.entry}>
                  <div style={s.entryHeader}>
                    <div style={s.entryTitle}>{v.role}</div>
                    <div style={s.entryDate}>
                      {formatDateRange(v.startDate, v.endDate, v.isCurrent)}
                    </div>
                  </div>
                  <div style={s.entrySub}>{v.organization}</div>
                  {parseBullets(v.description).map((b, i) => (
                    <div key={i} style={s.bullet}>
                      <span style={s.bulletMark}>-</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
