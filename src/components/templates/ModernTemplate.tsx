
import type { ResumeData } from "../../lib/types";
import { formatDateRange, parseBullets, parseCommaList } from "../../lib/utils";
import { MailIcon, PhoneIcon, MapPinIcon, LinkedinIcon, GithubIcon, GlobeIcon } from "../Icons";

interface Props {
  data: ResumeData;
}

const NAVY = "#1b2d55";
const ACCENT = "#4a6fa5";
const LIGHT = "#eef2fa";

export default function ModernTemplate({ data }: Props) {
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

  const SideSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div style={{ marginBottom: "14pt" }}>
      <div
        style={{
          fontSize: "7.5pt",
          fontWeight: "800",
          letterSpacing: "2px",
          textTransform: "uppercase" as const,
          color: LIGHT,
          borderBottom: `1pt solid rgba(255,255,255,0.2)`,
          paddingBottom: "3pt",
          marginBottom: "7pt",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );

  const MainSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div style={{ marginBottom: "14pt" }}>
      <div
        style={{
          fontSize: "9pt",
          fontWeight: "700",
          letterSpacing: "1.5px",
          textTransform: "uppercase" as const,
          color: NAVY,
          display: "flex",
          alignItems: "center",
          gap: "8pt",
          marginBottom: "8pt",
        }}
      >
        <span
          style={{
            flex: 1,
            borderBottom: `2pt solid ${NAVY}`,
            paddingBottom: "2pt",
          }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
        display: "flex",
        flex: 1,
        minHeight: "1123px",
        background: "#fff",
        width: "100%",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "32%",
          background: NAVY,
          padding: "28pt 18pt",
          color: "#fff",
          flexShrink: 0,
        }}
      >
        {/* Name block */}
        <div style={{ marginBottom: "16pt" }}>
          {p.fullName && (
            <div
              style={{
                fontSize: "16pt",
                fontWeight: "800",
                color: "#fff",
                lineHeight: "1.2",
                marginBottom: "4pt",
              }}
            >
              {p.fullName.split(" ").map((n, i) => (
                <div key={i} style={{ color: i === 0 ? "#fff" : LIGHT }}>
                  {n}
                </div>
              ))}
            </div>
          )}
          {p.jobTitle && (
            <div
              style={{
                fontSize: "8.5pt",
                color: "rgba(255,255,255,0.65)",
                letterSpacing: "0.5px",
                marginTop: "4pt",
              }}
            >
              {p.jobTitle}
            </div>
          )}
        </div>

        {/* Contact */}
        {(p.email ||
          p.phone ||
          p.location ||
          p.linkedin ||
          p.github ||
          p.website) && (
          <SideSection title="Contact">
            <div
              style={{
                fontSize: "8pt",
                color: "rgba(255,255,255,0.75)",
                lineHeight: "1.8",
              }}
            >
              {p.email && <div style={{ display: "flex", alignItems: "center", gap: "6pt", marginBottom: "4pt" }}><MailIcon size={10} /> <span>{p.email}</span></div>}
              {p.phone && <div style={{ display: "flex", alignItems: "center", gap: "6pt", marginBottom: "4pt" }}><PhoneIcon size={10} /> <span>{p.phone}</span></div>}
              {p.location && <div style={{ display: "flex", alignItems: "center", gap: "6pt", marginBottom: "4pt" }}><MapPinIcon size={10} /> <span>{p.location}</span></div>}
              {p.linkedin && (
                <div style={{ display: "flex", alignItems: "center", gap: "6pt", marginBottom: "4pt" }}><LinkedinIcon size={10} /> <span>{p.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span></div>
              )}
              {p.github && (
                <div style={{ display: "flex", alignItems: "center", gap: "6pt", marginBottom: "4pt" }}><GithubIcon size={10} /> <span>{p.github.replace(/^https?:\/\/(www\.)?/, "")}</span></div>
              )}
              {p.website && (
                <div style={{ display: "flex", alignItems: "center", gap: "6pt", marginBottom: "4pt" }}><GlobeIcon size={10} /> <span>{p.website.replace(/^https?:\/\//, "")}</span></div>
              )}
            </div>
          </SideSection>
        )}

        {/* Skills */}
        {skills.filter((sg) => sg.items).length > 0 && (
          <SideSection title="Skills">
            {skills
              .filter((sg) => sg.items)
              .map((sg) => (
                <div key={sg.id} style={{ marginBottom: "7pt" }}>
                  {sg.category && (
                    <div
                      style={{
                        fontSize: "7.5pt",
                        fontWeight: "700",
                        color: "rgba(255,255,255,0.55)",
                        marginBottom: "3pt",
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.8px",
                      }}
                    >
                      {sg.category}
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap" as const,
                      gap: "3pt",
                    }}
                  >
                    {parseCommaList(sg.items).map((skill, i) => (
                      <span
                        key={i}
                        style={{
                          background: "rgba(255,255,255,0.12)",
                          border: "0.5pt solid rgba(255,255,255,0.2)",
                          borderRadius: "2pt",
                          padding: "1.5pt 5pt",
                          fontSize: "7.5pt",
                          color: "#fff",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </SideSection>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <SideSection title="Languages">
            {languages.map((l) => (
              <div
                key={l.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "8pt",
                  marginBottom: "3pt",
                }}
              >
                <span style={{ color: "#fff", fontWeight: "600" }}>
                  {l.name}
                </span>
                <span style={{ color: "rgba(255,255,255,0.55)" }}>
                  {l.proficiency}
                </span>
              </div>
            ))}
          </SideSection>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <SideSection title="Certifications">
            {certifications.map((c) => (
              <div key={c.id} style={{ marginBottom: "6pt" }}>
                <div
                  style={{ fontSize: "8pt", color: "#fff", fontWeight: "600" }}
                >
                  {c.name}
                </div>
                <div
                  style={{ fontSize: "7.5pt", color: "rgba(255,255,255,0.55)" }}
                >
                  {c.issuer}
                  {c.issueDate
                    ? ` · ${c.issueDate.slice(0, 7).replace("-", "/")}`
                    : ""}
                </div>
              </div>
            ))}
          </SideSection>
        )}

        {/* Awards */}
        {awards.length > 0 && (
          <SideSection title="Awards">
            {awards.map((a) => (
              <div key={a.id} style={{ marginBottom: "5pt", fontSize: "8pt" }}>
                <div style={{ color: "#fff", fontWeight: "600" }}>
                  {a.title}
                </div>
                {a.issuer && (
                  <div style={{ color: "rgba(255,255,255,0.55)" }}>
                    {a.issuer}
                  </div>
                )}
              </div>
            ))}
          </SideSection>
        )}
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "28pt 24pt",
          fontSize: "9.5pt",
          color: "#222",
          lineHeight: "1.55",
        }}
      >
        {/* Summary */}
        {summary && (
          <MainSection title="Profile">
            <p
              style={{
                fontSize: "9.5pt",
                color: "#444",
                lineHeight: "1.65",
                margin: 0,
              }}
            >
              {summary}
            </p>
          </MainSection>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <MainSection title="Experience">
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: "10pt" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "10pt",
                        color: NAVY,
                      }}
                    >
                      {exp.position}
                    </div>
                    <div
                      style={{
                        fontSize: "8.5pt",
                        color: ACCENT,
                        fontWeight: "600",
                        marginBottom: "3pt",
                      }}
                    >
                      {exp.company}
                      {exp.location ? ` · ${exp.location}` : ""}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "7.5pt",
                      color: "#888",
                      whiteSpace: "nowrap" as const,
                      flexShrink: 0,
                      marginLeft: "8pt",
                      marginTop: "2pt",
                    }}
                  >
                    {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                  </div>
                </div>
                {parseBullets(exp.description).map((b, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "6pt",
                      fontSize: "8.5pt",
                      color: "#333",
                      marginTop: "2pt",
                    }}
                  >
                    <span style={{ color: ACCENT, flexShrink: 0 }}>•</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            ))}
          </MainSection>
        )}

        {/* Education */}
        {education.length > 0 && (
          <MainSection title="Education">
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: "8pt" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "10pt",
                        color: NAVY,
                      }}
                    >
                      {edu.institution}
                    </div>
                    <div
                      style={{
                        fontSize: "8.5pt",
                        color: "#555",
                        marginBottom: "2pt",
                        fontStyle: "italic",
                      }}
                    >
                      {[edu.degree, edu.fieldOfStudy]
                        .filter(Boolean)
                        .join(" in ")}
                      {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "7.5pt",
                      color: "#888",
                      whiteSpace: "nowrap" as const,
                      flexShrink: 0,
                      marginLeft: "8pt",
                    }}
                  >
                    {formatDateRange(edu.startDate, edu.endDate, edu.isCurrent)}
                  </div>
                </div>
                {parseBullets(edu.achievements).map((a, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "6pt",
                      fontSize: "8.5pt",
                      color: "#333",
                      marginTop: "2pt",
                    }}
                  >
                    <span style={{ color: ACCENT, flexShrink: 0 }}>•</span>
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            ))}
          </MainSection>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <MainSection title="Projects">
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: "9pt" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <div
                    style={{ fontWeight: "700", fontSize: "10pt", color: NAVY }}
                  >
                    {proj.name}
                  </div>
                  {(proj.startDate || proj.endDate) && (
                    <div
                      style={{
                        fontSize: "7.5pt",
                        color: "#888",
                        flexShrink: 0,
                        marginLeft: "8pt",
                      }}
                    >
                      {formatDateRange(proj.startDate, proj.endDate, false)}
                    </div>
                  )}
                </div>
                {proj.technologies && (
                  <div
                    style={{
                      fontSize: "8pt",
                      color: ACCENT,
                      marginBottom: "2pt",
                      fontWeight: "600",
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
                      gap: "6pt",
                      fontSize: "8.5pt",
                      color: "#333",
                      marginTop: "2pt",
                    }}
                  >
                    <span style={{ color: ACCENT, flexShrink: 0 }}>•</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            ))}
          </MainSection>
        )}

        {/* Volunteer */}
        {volunteer.length > 0 && (
          <MainSection title="Volunteer">
            {volunteer.map((v) => (
              <div key={v.id} style={{ marginBottom: "8pt" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "10pt",
                        color: NAVY,
                      }}
                    >
                      {v.role}
                    </div>
                    <div
                      style={{
                        fontSize: "8.5pt",
                        color: ACCENT,
                        fontWeight: "600",
                      }}
                    >
                      {v.organization}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "7.5pt",
                      color: "#888",
                      whiteSpace: "nowrap" as const,
                      flexShrink: 0,
                    }}
                  >
                    {formatDateRange(v.startDate, v.endDate, v.isCurrent)}
                  </div>
                </div>
                {parseBullets(v.description).map((b, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "6pt",
                      fontSize: "8.5pt",
                      color: "#333",
                      marginTop: "2pt",
                    }}
                  >
                    <span style={{ color: ACCENT, flexShrink: 0 }}>•</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            ))}
          </MainSection>
        )}
      </div>
    </div>
  );
}
