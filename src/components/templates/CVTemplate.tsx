import type { CSSProperties, ReactNode } from "react";
import type { ResumeData } from "../../lib/types";
import { formatDateRange, parseBullets, parseCommaList } from "../../lib/utils";
import {
  GithubIcon,
  GlobeIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "../Icons";

interface Props {
  data: ResumeData;
}

type SectionProps = {
  title: string;
  children: ReactNode;
  compact?: boolean;
};

const INK = "#1f2933";
const MUTED = "#3f4a56";
const RULE = "#cfd4dc";
const ACCENT = INK;

const styles: Record<string, CSSProperties> = {
  page: {
    width: "100%",
    height: "1123px",
    minHeight: "1123px",
    overflow: "hidden",
    background: "#ffffff",
    color: INK,
    display: "flex",
    flexDirection: "column",
    padding: "30pt 36pt",
    fontFamily: "'Times New Roman', Georgia, serif",
    fontSize: "10.5pt",
    lineHeight: 1.4,
  },
  header: {
    display: "flex",
    gap: "16pt",
    borderBottom: `1.5pt solid ${INK}`,
    paddingBottom: "12pt",
    marginBottom: "12pt",
  },
  photoFrame: {
    width: "82pt",
    height: "100pt",
    flex: "0 0 82pt",
    border: `1pt solid ${INK}`,
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  photoPlaceholder: {
    fontFamily: "'Inter', Arial, sans-serif",
    color: "#9aa3ad",
    fontSize: "8pt",
    fontWeight: 700,
    letterSpacing: "1.2px",
    textTransform: "uppercase",
  },
  headerMain: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },
  name: {
    color: "#111827",
    fontSize: "25pt",
    fontWeight: 700,
    lineHeight: 1.05,
    marginTop: "5pt",
    marginBottom: "3pt",
    textTransform: "uppercase",
  },
  role: {
    color: "#2f3742",
    fontSize: "11pt",
    fontStyle: "italic",
    marginBottom: "8pt",
  },
  contactGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "3pt 14pt",
    color: "#202a36",
    fontFamily: "'Inter', Arial, sans-serif",
    fontSize: "9pt",
    fontWeight: 600,
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "4pt",
    minWidth: 0,
  },
  body: {
    display: "grid",
    gridTemplateColumns: "31% 1fr",
    gap: "18pt",
    minHeight: 0,
  },
  sidebar: {
    borderRight: `0.75pt solid ${RULE}`,
    paddingRight: "14pt",
  },
  main: {
    minWidth: 0,
  },
  sectionTitle: {
    borderBottom: `0.75pt solid ${RULE}`,
    color: INK,
    fontFamily: "'Inter', Arial, sans-serif",
    fontSize: "9pt",
    fontWeight: 800,
    letterSpacing: "1.4px",
    marginBottom: "5pt",
    paddingBottom: "2pt",
    textTransform: "uppercase",
  },
  entryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: "8pt",
  },
  entryTitle: {
    color: "#111827",
    fontSize: "10.5pt",
    fontWeight: 700,
  },
  entryMeta: {
    color: "#3f4a56",
    fontSize: "9.5pt",
    fontStyle: "italic",
    marginTop: "1pt",
  },
  date: {
    color: MUTED,
    flexShrink: 0,
    fontFamily: "'Inter', Arial, sans-serif",
    fontSize: "8.5pt",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  paragraph: {
    color: "#303947",
    fontSize: "10.5pt",
    lineHeight: 1.45,
    margin: 0,
  },
  bullet: {
    display: "flex",
    gap: "5pt",
    color: "#303947",
    fontSize: "10pt",
    lineHeight: 1.38,
    marginTop: "2pt",
  },
  bulletDash: {
    color: ACCENT,
    flexShrink: 0,
  },
  smallText: {
    color: "#303947",
    fontSize: "9.5pt",
    lineHeight: 1.35,
  },
};

function Section({ title, children, compact = false }: SectionProps) {
  return (
    <section style={{ marginBottom: compact ? "7pt" : "10pt" }}>
      <div style={styles.sectionTitle}>{title}</div>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item, index) => (
        <div key={index} style={styles.bullet}>
          <span style={styles.bulletDash}>-</span>
          <span>{item}</span>
        </div>
      ))}
    </>
  );
}

const cleanUrl = (value: string) =>
  value.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export default function CVTemplate({ data }: Props) {
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

  const contacts = [
    p.email && {
      icon: <MailIcon size={11} strokeWidth={2.4} />,
      value: p.email,
    },
    p.phone && {
      icon: <PhoneIcon size={11} strokeWidth={2.4} />,
      value: p.phone,
    },
    p.location && {
      icon: <MapPinIcon size={11} strokeWidth={2.4} />,
      value: p.location,
    },
    p.linkedin && {
      icon: <LinkedinIcon size={11} strokeWidth={2.4} />,
      value: cleanUrl(p.linkedin),
    },
    p.github && {
      icon: <GithubIcon size={11} strokeWidth={2.4} />,
      value: cleanUrl(p.github),
    },
    p.website && {
      icon: <GlobeIcon size={11} strokeWidth={2.4} />,
      value: cleanUrl(p.website),
    },
  ].filter(Boolean) as { icon: ReactNode; value: string }[];

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.photoFrame}>
          {p.photo ? (
            <img src={p.photo} alt="" style={styles.photo} draggable={false} />
          ) : (
            <span style={styles.photoPlaceholder}>Photo</span>
          )}
        </div>

        <div style={styles.headerMain}>
          {p.fullName && <div style={styles.name}>{p.fullName}</div>}
          {p.jobTitle && <div style={styles.role}>{p.jobTitle}</div>}

          {contacts.length > 0 && (
            <div style={styles.contactGrid}>
              {contacts.map((contact, index) => (
                <div key={index} style={styles.contactItem}>
                  {contact.icon}
                  <span>{contact.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      <div style={styles.body}>
        <aside style={styles.sidebar}>
          {education.length > 0 && (
            <Section title="Education">
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: "7pt" }}>
                  <div style={styles.entryTitle}>{edu.institution}</div>
                  <div style={styles.entryMeta}>
                    {[edu.degree, edu.fieldOfStudy]
                      .filter(Boolean)
                      .join(" in ")}
                  </div>
                  <div style={styles.smallText}>
                    {formatDateRange(edu.startDate, edu.endDate, edu.isCurrent)}
                    {edu.gpa ? ` | GPA ${edu.gpa}` : ""}
                    {edu.location ? ` | ${edu.location}` : ""}
                  </div>
                  <BulletList items={parseBullets(edu.achievements)} />
                </div>
              ))}
            </Section>
          )}

          {skills.filter((skill) => skill.items).length > 0 && (
            <Section title="Core Skills">
              {skills
                .filter((skill) => skill.items)
                .map((skill) => (
                  <div key={skill.id} style={{ marginBottom: "5pt" }}>
                    {skill.category && (
                      <div style={{ ...styles.entryTitle, fontSize: "9.5pt" }}>
                        {skill.category}
                      </div>
                    )}
                    <div style={styles.smallText}>
                      {parseCommaList(skill.items).join(", ")}
                    </div>
                  </div>
                ))}
            </Section>
          )}

          {languages.length > 0 && (
            <Section title="Languages" compact>
              {languages.map((language) => (
                <div
                  key={language.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "6pt",
                    marginBottom: "3pt",
                    ...styles.smallText,
                  }}
                >
                  <strong>{language.name}</strong>
                  <span>{language.proficiency}</span>
                </div>
              ))}
            </Section>
          )}

          {certifications.length > 0 && (
            <Section title="Certifications" compact>
              {certifications.map((certification) => (
                <div key={certification.id} style={{ marginBottom: "5pt" }}>
                  <div style={{ ...styles.entryTitle, fontSize: "9.5pt" }}>
                    {certification.name}
                  </div>
                  <div style={styles.smallText}>
                    {certification.issuer}
                    {certification.issueDate
                      ? ` | ${certification.issueDate.slice(0, 7).replace("-", "/")}`
                      : ""}
                  </div>
                </div>
              ))}
            </Section>
          )}
        </aside>

        <main style={styles.main}>
          {summary && (
            <Section title="Professional Summary">
              <p style={styles.paragraph}>{summary}</p>
            </Section>
          )}

          {experience.length > 0 && (
            <Section title="Experience">
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: "8pt" }}>
                  <div style={styles.entryHeader}>
                    <div style={styles.entryTitle}>{exp.position}</div>
                    <div style={styles.date}>
                      {formatDateRange(
                        exp.startDate,
                        exp.endDate,
                        exp.isCurrent,
                      )}
                    </div>
                  </div>
                  <div style={styles.entryMeta}>
                    {[exp.company, exp.location].filter(Boolean).join(" | ")}
                  </div>
                  <BulletList items={parseBullets(exp.description)} />
                </div>
              ))}
            </Section>
          )}

          {projects.length > 0 && (
            <Section title="Selected Project(s)">
              {projects.map((project) => (
                <div key={project.id} style={{ marginBottom: "7pt" }}>
                  <div style={styles.entryHeader}>
                    <div style={styles.entryTitle}>{project.name}</div>
                    {(project.startDate || project.endDate) && (
                      <div style={styles.date}>
                        {formatDateRange(
                          project.startDate,
                          project.endDate,
                          false,
                        )}
                      </div>
                    )}
                  </div>
                  {project.technologies && (
                    <div style={styles.entryMeta}>{project.technologies}</div>
                  )}
                  <BulletList items={parseBullets(project.description)} />
                </div>
              ))}
            </Section>
          )}

          {awards.length > 0 && (
            <Section title="Honors and Awards" compact>
              {awards.map((award) => (
                <div key={award.id} style={{ marginBottom: "4pt" }}>
                  <div style={styles.entryHeader}>
                    <div style={styles.entryTitle}>{award.title}</div>
                    {award.date && (
                      <div style={styles.date}>
                        {award.date.slice(0, 7).replace("-", "/")}
                      </div>
                    )}
                  </div>
                  <div style={styles.smallText}>
                    {[award.issuer, award.description]
                      .filter(Boolean)
                      .join(" | ")}
                  </div>
                </div>
              ))}
            </Section>
          )}

          {volunteer.length > 0 && (
            <Section title="Volunteer Service" compact>
              {volunteer.map((item) => (
                <div key={item.id} style={{ marginBottom: "6pt" }}>
                  <div style={styles.entryHeader}>
                    <div style={styles.entryTitle}>{item.role}</div>
                    <div style={styles.date}>
                      {formatDateRange(
                        item.startDate,
                        item.endDate,
                        item.isCurrent,
                      )}
                    </div>
                  </div>
                  <div style={styles.entryMeta}>{item.organization}</div>
                  <BulletList items={parseBullets(item.description)} />
                </div>
              ))}
            </Section>
          )}
        </main>
      </div>
    </div>
  );
}
