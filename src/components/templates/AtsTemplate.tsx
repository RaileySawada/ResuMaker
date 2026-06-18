import type { CSSProperties, ReactNode } from "react";
import type { ResumeData, ResumeSectionId } from "../../lib/types";
import { DEFAULT_SECTION_ORDER } from "../../lib/defaultData";
import {
  formatDateRange,
  parseBullets,
  parseCommaList,
} from "../../lib/utils";

export type AtsTemplateVariant = "classic" | "modern" | "minimal" | "cv";

interface Props {
  data: ResumeData;
  variant: AtsTemplateVariant;
}

interface Theme {
  accent: string;
  accentSoft: string;
  ink: string;
  muted: string;
  rule: string;
  fontFamily: string;
  nameFont: string;
  nameSize: string;
  pagePadding: string;
  sectionSpacing: string;
  headingBorder: string;
  headingBackground?: string;
  headingPadding: string;
  headingLetterSpacing: string;
  headerAlign: CSSProperties["textAlign"];
}

const THEMES: Record<AtsTemplateVariant, Theme> = {
  classic: {
    accent: "#16324f",
    accentSoft: "#e8eef4",
    ink: "#18212b",
    muted: "#52606d",
    rule: "#b9c3cc",
    fontFamily: "var(--resume-font-family)",
    nameFont: "var(--resume-font-family)",
    nameSize: "25pt",
    pagePadding: "30pt 38pt",
    sectionSpacing: "11pt",
    headingBorder: "1pt solid #9aa9b7",
    headingPadding: "0 0 3pt",
    headingLetterSpacing: "1.35px",
    headerAlign: "left",
  },
  modern: {
    accent: "#164e63",
    accentSoft: "#ecfeff",
    ink: "#172033",
    muted: "#475569",
    rule: "#94a3b8",
    fontFamily: "var(--resume-font-family)",
    nameFont: "var(--resume-font-family)",
    nameSize: "24pt",
    pagePadding: "27pt 34pt",
    sectionSpacing: "10pt",
    headingBorder: "2pt solid #164e63",
    headingBackground: "#ecfeff",
    headingPadding: "3pt 5pt",
    headingLetterSpacing: "1px",
    headerAlign: "left",
  },
  minimal: {
    accent: "#27272a",
    accentSoft: "#f4f4f5",
    ink: "#27272a",
    muted: "#71717a",
    rule: "#d4d4d8",
    fontFamily: "var(--resume-font-family)",
    nameFont: "var(--resume-font-family)",
    nameSize: "22pt",
    pagePadding: "30pt 38pt",
    sectionSpacing: "11pt",
    headingBorder: "0.75pt solid #d4d4d8",
    headingPadding: "0 0 3pt",
    headingLetterSpacing: "1.8px",
    headerAlign: "left",
  },
  cv: {
    accent: "#78350f",
    accentSoft: "#fef3c7",
    ink: "#292524",
    muted: "#57534e",
    rule: "#a8a29e",
    fontFamily: "Georgia, 'Times New Roman', serif",
    nameFont: "Georgia, 'Times New Roman', serif",
    nameSize: "24pt",
    pagePadding: "28pt 36pt",
    sectionSpacing: "10pt",
    headingBorder: "1pt solid #78350f",
    headingPadding: "0 0 2.5pt",
    headingLetterSpacing: "1px",
    headerAlign: "center",
  },
};

const cleanUrl = (value: string) =>
  value.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const toHref = (value: string) =>
  /^https?:\/\//i.test(value) ? value : `https://${value}`;

function AtsSection({
  title,
  theme,
  children,
}: {
  title: string;
  theme: Theme;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        breakInside: "auto",
        marginBottom: theme.sectionSpacing,
      }}
    >
      <h2
        style={{
          background: theme.headingBackground,
          borderBottom: theme.headingBorder,
          color: theme.accent,
          fontFamily: "var(--resume-font-family)",
          fontSize: "9pt",
          fontWeight: 800,
          letterSpacing: theme.headingLetterSpacing,
          lineHeight: 1.2,
          margin: "0 0 6pt",
          padding: theme.headingPadding,
          textTransform: "uppercase",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function BulletList({
  items,
  theme,
}: {
  items: string[];
  theme: Theme;
}) {
  if (!items.length) return null;

  return (
    <ul
      style={{
        color: theme.ink,
        listStyle: "none",
        fontSize: "9.5pt",
        lineHeight: 1.38,
        margin: "3pt 0 0",
        paddingLeft: 0,
      }}
    >
      {items.map((item, index) => (
        <li
          key={index}
          style={{
            alignItems: "flex-start",
            display: "flex",
            gap: "6pt",
            marginBottom: "2pt",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              background: theme.accent,
              borderRadius: "999px",
              flex: "0 0 3.5pt",
              height: "3.5pt",
              marginTop: "4.3pt",
              width: "3.5pt",
            }}
          />
          <span style={{ flex: 1, minWidth: 0 }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Entry({
  title,
  organization,
  location,
  date,
  details,
  bullets,
  theme,
  compact = false,
}: {
  title: string;
  organization?: string;
  location?: string;
  date?: string;
  details?: string;
  bullets?: string[];
  theme: Theme;
  compact?: boolean;
}) {
  const organizationLine = [organization, location].filter(Boolean).join(" | ");

  return (
    <article
      style={{
        breakInside: "avoid",
        marginBottom: compact ? "5pt" : "8pt",
      }}
    >
      {(title || date) && (
        <div
          style={{
            alignItems: "baseline",
            display: "flex",
            gap: "10pt",
            justifyContent: "space-between",
          }}
        >
          {title && (
            <h3
              style={{
                color: theme.ink,
                flex: 1,
                fontSize: compact ? "9.7pt" : "10.7pt",
                fontWeight: 700,
                lineHeight: 1.25,
                margin: 0,
                minWidth: 0,
              }}
            >
              {title}
            </h3>
          )}
          {date && (
            <span
              style={{
                color: theme.muted,
                flexShrink: 0,
                fontFamily: "var(--resume-font-family)",
                fontSize: compact ? "8pt" : "8.5pt",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {date}
            </span>
          )}
        </div>
      )}
      {organizationLine && (
        <p
          style={{
            color: theme.accent,
            fontSize: "9pt",
            fontWeight: 600,
            lineHeight: 1.3,
            margin: "1pt 0 0",
          }}
        >
          {organizationLine}
        </p>
      )}
      {details && (
        <p
          style={{
            color: theme.muted,
            fontSize: "9pt",
            lineHeight: 1.35,
            margin: "2pt 0 0",
          }}
        >
          {details}
        </p>
      )}
      <BulletList items={bullets ?? []} theme={theme} />
    </article>
  );
}

export default function AtsTemplate({ data, variant }: Props) {
  const theme = THEMES[variant];
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

  const contacts: ReactNode[] = [];
  if (p.email) {
    contacts.push(
      <a key="email" href={`mailto:${p.email}`} style={{ color: "inherit" }}>
        {p.email}
      </a>,
    );
  }
  if (p.phone) {
    contacts.push(
      <a
        key="phone"
        href={`tel:${p.phone.replace(/[^\d+]/g, "")}`}
        style={{ color: "inherit" }}
      >
        {p.phone}
      </a>,
    );
  }
  if (p.location) contacts.push(<span key="location">{p.location}</span>);
  if (p.linkedin) {
    contacts.push(
      <a
        key="linkedin"
        href={toHref(p.linkedin)}
        style={{ color: "inherit" }}
      >
        LinkedIn: {cleanUrl(p.linkedin)}
      </a>,
    );
  }
  if (p.github) {
    contacts.push(
      <a key="github" href={toHref(p.github)} style={{ color: "inherit" }}>
        GitHub: {cleanUrl(p.github)}
      </a>,
    );
  }
  if (p.website) {
    contacts.push(
      <a key="website" href={toHref(p.website)} style={{ color: "inherit" }}>
        Portfolio: {cleanUrl(p.website)}
      </a>,
    );
  }

  const renderResumeSection = (section: ResumeSectionId) => {
    switch (section) {
      case "summary":
        return summary ? (
          <AtsSection key={section} title="Professional Summary" theme={theme}>
            <p
              style={{
                color: theme.ink,
                fontSize: variant === "classic" ? "9.8pt" : "9.5pt",
                lineHeight: 1.48,
                margin: 0,
              }}
            >
              {summary}
            </p>
          </AtsSection>
        ) : null;
      case "skills":
        return skills.some((group) => group.items.trim()) ? (
          <AtsSection key={section} title="Core Skills" theme={theme}>
            {skills
              .filter((group) => group.items.trim())
              .map((group) => (
                <p
                  key={group.id}
                  style={{
                    fontSize: "9.4pt",
                    lineHeight: 1.4,
                    margin: "0 0 3pt",
                  }}
                >
                  {group.category && <strong>{group.category}: </strong>}
                  {parseCommaList(group.items).join(", ")}
                </p>
              ))}
          </AtsSection>
        ) : null;
      case "experience":
        return experience.length > 0 ? (
          <AtsSection key={section} title="Work Experience" theme={theme}>
            {experience.map((item) => (
              <Entry
                key={item.id}
                title={item.position}
                organization={item.company}
                location={item.location}
                date={formatDateRange(
                  item.startDate,
                  item.endDate,
                  item.isCurrent,
                )}
                bullets={parseBullets(item.description)}
                theme={theme}
              />
            ))}
          </AtsSection>
        ) : null;
      case "projects":
        return projects.length > 0 ? (
          <AtsSection key={section} title="Projects" theme={theme}>
            {projects.map((item) => (
              <Entry
                key={item.id}
                title={item.name}
                organization={item.technologies}
                date={formatDateRange(item.startDate, item.endDate, false)}
                details={[
                  item.liveUrl && `Project: ${cleanUrl(item.liveUrl)}`,
                  item.repoUrl && `Repository: ${cleanUrl(item.repoUrl)}`,
                ]
                  .filter(Boolean)
                  .join(" | ")}
                bullets={parseBullets(item.description)}
                theme={theme}
              />
            ))}
          </AtsSection>
        ) : null;
      case "education":
        return education.length > 0 ? (
          <AtsSection key={section} title="Education" theme={theme}>
            {education.map((item) => (
              <Entry
                key={item.id}
                title={[item.degree, item.fieldOfStudy]
                  .filter(Boolean)
                  .join(" in ")}
                organization={item.institution}
                location={item.location}
                date={formatDateRange(
                  item.startDate,
                  item.endDate,
                  item.isCurrent,
                )}
                details={item.gpa ? `GPA: ${item.gpa}` : ""}
                bullets={parseBullets(item.achievements)}
                theme={theme}
              />
            ))}
          </AtsSection>
        ) : null;
      case "certifications":
        return certifications.length > 0 ? (
          <AtsSection
            key={section}
            title="Certifications & Awards"
            theme={theme}
          >
            <div
              style={{
                display: "grid",
                gap: "3pt 16pt",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              }}
            >
              {certifications.map((item) => (
                <div
                  key={item.id}
                  style={{
                    borderLeft: `2pt solid ${theme.accent}`,
                    breakInside: "avoid",
                    padding: "1pt 0 1pt 7pt",
                  }}
                >
                  <Entry
                    title={item.name}
                    organization={item.issuer}
                    date={[
                      item.issueDate &&
                        `Issued ${item.issueDate.slice(0, 7).replace("-", "/")}`,
                      item.expiryDate &&
                        `Expires ${item.expiryDate.slice(0, 7).replace("-", "/")}`,
                    ]
                      .filter(Boolean)
                      .join(" | ")}
                    details={
                      item.credentialUrl
                        ? `Credential: ${cleanUrl(item.credentialUrl)}`
                        : ""
                    }
                    theme={theme}
                    compact
                  />
                </div>
              ))}
            </div>
          </AtsSection>
        ) : null;
      case "extras":
        return (
          <div key={section}>
            {volunteer.length > 0 && (
              <AtsSection title="Volunteer Experience" theme={theme}>
                {volunteer.map((item) => (
                  <Entry
                    key={item.id}
                    title={item.role}
                    organization={item.organization}
                    date={formatDateRange(
                      item.startDate,
                      item.endDate,
                      item.isCurrent,
                    )}
                    bullets={parseBullets(item.description)}
                    theme={theme}
                  />
                ))}
              </AtsSection>
            )}
            {awards.length > 0 && (
              <AtsSection title="Awards" theme={theme}>
                {awards.map((item) => (
                  <Entry
                    key={item.id}
                    title={item.title}
                    organization={item.issuer}
                    date={item.date?.slice(0, 7).replace("-", "/")}
                    details={item.description}
                    theme={theme}
                  />
                ))}
              </AtsSection>
            )}
            {languages.length > 0 && (
              <AtsSection title="Languages" theme={theme}>
                <p style={{ fontSize: "9.5pt", margin: 0 }}>
                  {languages
                    .map((item) => `${item.name} (${item.proficiency})`)
                    .join(", ")}
                </p>
              </AtsSection>
            )}
          </div>
        );
    }
  };

  return (
    <main
      aria-label="Resume"
      style={{
        background: "#fff",
        color: theme.ink,
        display: "flex",
        flex: 1,
        flexDirection: "column",
        fontFamily: theme.fontFamily,
        fontSize: "10pt",
        lineHeight: 1.4,
        minHeight: "var(--resume-a4-height)",
        padding: theme.pagePadding,
        width: "100%",
      }}
    >
      <header
        style={{
          borderBottom: `2pt solid ${theme.accent}`,
          marginBottom: "12pt",
          paddingBottom: "9pt",
          textAlign: theme.headerAlign,
        }}
      >
        {p.fullName && (
          <h1
            style={{
              color: theme.accent,
              fontFamily: theme.nameFont,
              fontSize: theme.nameSize,
              fontWeight: variant === "minimal" ? 500 : 700,
              letterSpacing:
                variant === "classic"
                  ? "-0.55px"
                  : variant === "modern"
                    ? "-0.4px"
                    : 0,
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            {p.fullName}
          </h1>
        )}
        {p.jobTitle && (
          <p
            style={{
              color: theme.muted,
              fontFamily: "var(--resume-font-family)",
              fontSize: variant === "classic" ? "10.5pt" : "10pt",
              fontWeight: 700,
              letterSpacing: variant === "classic" ? "0.25px" : 0,
              margin: "4pt 0 0",
            }}
          >
            {p.jobTitle}
          </p>
        )}
        {contacts.length > 0 && (
          <address
            style={{
              color: theme.muted,
              display: "block",
              fontFamily: "var(--resume-font-family)",
              fontSize: "8.8pt",
              fontStyle: "normal",
              lineHeight: 1.45,
              marginTop: "6pt",
            }}
          >
            {contacts.map((contact, index) => (
              <span key={index}>
                {index > 0 && <span aria-hidden="true"> | </span>}
                {contact}
              </span>
            ))}
          </address>
        )}
      </header>

      {DEFAULT_SECTION_ORDER.map(renderResumeSection)}
    </main>
  );
}
