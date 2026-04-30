export type TemplateType = "classic" | "modern" | "minimal";
export type LanguageProficiency =
  | "Native"
  | "Fluent"
  | "Advanced"
  | "Intermediate"
  | "Basic";

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  birthDate: string;
  sex: string;
  civilStatus: string;
  nationality: string;
  linkedin: string;
  github: string;
  website: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string; // newline-separated bullet points
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  gpa: string;
  achievements: string; // newline-separated
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string; // comma-separated
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string; // comma-separated
  liveUrl: string;
  repoUrl: string;
  startDate: string;
  endDate: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialUrl: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: LanguageProficiency;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface VolunteerWork {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: SkillGroup[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  awards: Award[];
  volunteer: VolunteerWork[];
  template: TemplateType;
}
