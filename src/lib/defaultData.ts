import type {
  ResumeData,
  WorkExperience,
  Education,
  SkillGroup,
  Project,
  Certification,
  Language,
  Award,
  VolunteerWork,
} from "./types";
import { generateId } from "./utils";

export const createEmptyResume = (): ResumeData => ({
  personal: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    website: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [{ id: generateId(), category: "", items: "" }],
  projects: [],
  certifications: [],
  languages: [],
  awards: [],
  volunteer: [],
  template: "classic",
});

export const createExperience = (): WorkExperience => ({
  id: generateId(),
  company: "",
  position: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
});

export const createEducation = (): Education => ({
  id: generateId(),
  institution: "",
  degree: "",
  fieldOfStudy: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  gpa: "",
  achievements: "",
});

export const createSkillGroup = (): SkillGroup => ({
  id: generateId(),
  category: "",
  items: "",
});

export const createProject = (): Project => ({
  id: generateId(),
  name: "",
  description: "",
  technologies: "",
  liveUrl: "",
  repoUrl: "",
  startDate: "",
  endDate: "",
});

export const createCertification = (): Certification => ({
  id: generateId(),
  name: "",
  issuer: "",
  issueDate: "",
  expiryDate: "",
  credentialUrl: "",
});

export const createLanguage = (): Language => ({
  id: generateId(),
  name: "",
  proficiency: "Intermediate",
});

export const createAward = (): Award => ({
  id: generateId(),
  title: "",
  issuer: "",
  date: "",
  description: "",
});

export const createVolunteer = (): VolunteerWork => ({
  id: generateId(),
  organization: "",
  role: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
});
