
import type { ResumeData } from "../../lib/types";
import {
  formatCalendarDate,
  formatDateRange,
  parseBullets,
  parseCommaList,
} from "../../lib/utils";
import { MailIcon, PhoneIcon, MapPinIcon, LinkedinIcon, GithubIcon, GlobeIcon } from "../Icons";

interface Props {
  data: ResumeData;
}

export default function MinimalTemplate({ data }: Props) {
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

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div style={{ marginBottom: "12pt" }}>
      <div
        style={{
          fontSize: "7.6pt",
          fontWeight: "700",
          letterSpacing: "2px",
          textTransform: "uppercase" as const,
          color: "#aaa",
          marginBottom: "5pt",
          paddingBottom: "3pt",
          borderBottom: "0.5pt solid #e5e5e5",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );

  const EntryRow = ({
    left,
    right,
    subtitle,
    bullets,
  }: {
    left: string;
    right?: string;
    subtitle?: string;
    bullets?: string[];
  }) => (
    <div style={{ marginBottom: "5pt" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "8pt",
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontWeight: "600",
            fontSize: "10pt",
            color: "#111",
            flex: 1,
            minWidth: 0,
          }}
        >
          {left}
        </span>
        {right && (
          <span
            style={{
              fontSize: "9pt",
              color: "#999",
              whiteSpace: "nowrap" as const,
              flexShrink: 0,
            }}
          >
            {right}
          </span>
        )}
      </div>
      {subtitle && (
        <div
          style={{
            fontSize: "9pt",
            color: "#666",
            marginTop: "1pt",
            marginBottom: "2pt",
          }}
        >
          {subtitle}
        </div>
      )}
      {bullets?.map((b, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: "8pt",
            fontSize: "9pt",
            color: "#444",
            marginTop: "2pt",
            lineHeight: "1.4",
          }}
        >
          <span style={{ flexShrink: 0, color: "#ccc" }}>—</span>
          <span>{b}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div
      style={{
        fontFamily: "var(--resume-font-family)",
        fontSize: "10pt",
        color: "#222",
        lineHeight: "1.35",
        padding: "26pt 30pt",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: "var(--resume-a4-height)",
        width: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "12pt",
          borderBottom: "1.5pt solid #111",
          paddingBottom: "8pt",
        }}
      >
        {p.fullName && (
          <div
            style={{
              fontSize: "20pt",
              fontWeight: "300",
              color: "#111",
              letterSpacing: "-0.5px",
              marginBottom: "2pt",
            }}
          >
            {p.fullName}
          </div>
        )}
        {p.jobTitle && (
          <div style={{ fontSize: "9pt", color: "#777", marginBottom: "5pt" }}>
            {p.jobTitle}
          </div>
        )}
        {(p.birthDate || p.sex || p.civilStatus || p.nationality) && (
          <div style={{ marginBottom: "5pt" }}>
            <div
              style={{
                fontSize: "7.6pt",
                fontWeight: "700",
                letterSpacing: "1.5px",
                textTransform: "uppercase" as const,
                color: "#777",
                marginBottom: "2pt",
              }}
            >
              Personal Information
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap" as const,
                gap: "0 12pt",
                fontSize: "9pt",
                color: "#888",
              }}
            >
              {p.birthDate && <span>Birth Date: {formatCalendarDate(p.birthDate)}</span>}
              {p.sex && <span>Sex: {p.sex}</span>}
              {p.civilStatus && <span>Civil Status: {p.civilStatus}</span>}
              {p.nationality && <span>Nationality: {p.nationality}</span>}
            </div>
          </div>
        )}
        {(p.email || p.phone || p.location || p.linkedin || p.github || p.website) && (
          <div>
            <div
              style={{
                fontSize: "7.6pt",
                fontWeight: "700",
                letterSpacing: "1.5px",
                textTransform: "uppercase" as const,
                color: "#777",
                marginBottom: "2pt",
              }}
            >
              Contact
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap" as const,
                gap: "0 12pt",
                fontSize: "9pt",
                color: "#888",
              }}
            >
              {p.email && <span style={{ display: "flex", alignItems: "center", gap: "4pt" }}><MailIcon size={10} /> {p.email}</span>}
              {p.phone && <span style={{ display: "flex", alignItems: "center", gap: "4pt" }}><PhoneIcon size={10} /> {p.phone}</span>}
              {p.location && <span style={{ display: "flex", alignItems: "center", gap: "4pt" }}><MapPinIcon size={10} /> {p.location}</span>}
              {p.linkedin && (
                <span style={{ display: "flex", alignItems: "center", gap: "4pt" }}><LinkedinIcon size={10} /> {p.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
              )}
              {p.github && (
                <span style={{ display: "flex", alignItems: "center", gap: "4pt" }}><GithubIcon size={10} /> {p.github.replace(/^https?:\/\/(www\.)?/, "")}</span>
              )}
              {p.website && <span style={{ display: "flex", alignItems: "center", gap: "4pt" }}><GlobeIcon size={10} /> {p.website.replace(/^https?:\/\//, "")}</span>}
            </div>
          </div>
        )}
      </div>

      {summary && (
        <Section title="Objectives">
          <p
            style={{
              fontSize: "9pt",
              color: "#555",
              lineHeight: "1.5",
              margin: 0,
            }}
          >
            {summary}
          </p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((exp) => (
            <EntryRow
              key={exp.id}
              left={exp.position}
              right={formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
              subtitle={[exp.company, exp.location].filter(Boolean).join(", ")}
              bullets={parseBullets(exp.description)}
            />
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          {education.map((edu) => (
            <EntryRow
              key={edu.id}
              left={edu.institution}
              right={formatDateRange(edu.startDate, edu.endDate, edu.isCurrent)}
              subtitle={[
                [edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in "),
                edu.gpa ? `GPA ${edu.gpa}` : "",
              ]
                .filter(Boolean)
                .join(" · ")}
              bullets={parseBullets(edu.achievements)}
            />
          ))}
        </Section>
      )}

      {skills.filter((s) => s.items).length > 0 && (
        <Section title="Skills">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3pt 16pt",
            }}
          >
            {skills
              .filter((sg) => sg.items)
              .map((sg) => (
                <div key={sg.id} style={{ fontSize: "9pt", color: "#333" }}>
                  {sg.category && (
                    <span style={{ fontWeight: "600", color: "#111" }}>
                      {sg.category}:{" "}
                    </span>
                  )}
                  {parseCommaList(sg.items).join(", ")}
                </div>
              ))}
          </div>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "5pt" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "10pt",
                    color: "#111",
                  }}
                >
                  {proj.name}
                  {(proj.liveUrl || proj.repoUrl) && (
                    <span
                      style={{
                        fontWeight: "400",
                        fontSize: "9pt",
                        color: "#999",
                        marginLeft: "6pt",
                      }}
                    >
                      {(proj.liveUrl || proj.repoUrl).replace(
                        /^https?:\/\//,
                        "",
                      )}
                    </span>
                  )}
                </span>
                {(proj.startDate || proj.endDate) && (
                  <span
                    style={{
                      fontSize: "9pt",
                      color: "#999",
                      flexShrink: 0,
                      marginLeft: "8pt",
                    }}
                  >
                    {formatDateRange(proj.startDate, proj.endDate, false)}
                  </span>
                )}
              </div>
              {proj.technologies && (
                <div
                  style={{
                    fontSize: "9pt",
                    color: "#888",
                    marginTop: "1pt",
                    marginBottom: "2pt",
                  }}
                >
                  {proj.technologies}
                </div>
              )}
              {parseBullets(proj.description).map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "8pt",
                    fontSize: "9pt",
                    color: "#444",
                    marginTop: "2pt",
                  }}
                >
                  <span style={{ flexShrink: 0, color: "#ccc" }}>—</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications">
          {certifications.map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "8pt",
                marginBottom: "2pt",
                fontSize: "9pt",
                minWidth: 0,
              }}
            >
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: "600" }}>{c.name}</span> · {c.issuer}
              </span>
              <span style={{ color: "#999", flexShrink: 0 }}>
                {c.issueDate?.slice(0, 7).replace("-", "/")}
              </span>
            </div>
          ))}
        </Section>
      )}

      {(languages.length > 0 || awards.length > 0) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 16pt",
          }}
        >
          {languages.length > 0 && (
            <Section title="Languages">
              {languages.map((l) => (
                <div
                  key={l.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "9pt",
                    marginBottom: "2pt",
                  }}
                >
                  <span style={{ fontWeight: "600", color: "#111" }}>
                    {l.name}
                  </span>
                  <span style={{ color: "#888" }}>{l.proficiency}</span>
                </div>
              ))}
            </Section>
          )}
          {awards.length > 0 && (
            <Section title="Awards">
              {awards.map((a) => (
                <div
                  key={a.id}
                  style={{ fontSize: "9pt", marginBottom: "2pt" }}
                >
                  <span style={{ fontWeight: "600" }}>{a.title}</span>
                  {a.issuer && (
                    <span style={{ color: "#777" }}> · {a.issuer}</span>
                  )}
                </div>
              ))}
            </Section>
          )}
        </div>
      )}

      {volunteer.length > 0 && (
        <Section title="Volunteer">
          {volunteer.map((v) => (
            <EntryRow
              key={v.id}
              left={v.role}
              right={formatDateRange(v.startDate, v.endDate, v.isCurrent)}
              subtitle={v.organization}
              bullets={parseBullets(v.description)}
            />
          ))}
        </Section>
      )}
    </div>
  );
}

