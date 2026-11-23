export type Stat = { value: string; label: string };
export type TimelineItem = { date: string; role: string; org: string };
export type ContactLink = { icon: string; label: string; value: string; href: string };

export type Profile = {
  id: number;
  name_first: string;
  name_last: string;
  initials: string;
  hero_label: string;
  typewriter_lines: string[];
  hero_stats: Stat[];
  about_role: string;
  about_tags: string[];
  about_stats: Stat[];
  bio_md: string;
  timeline: TimelineItem[];
  research_keywords: string[];
  startups_footnote: string;
  contact_heading: string;
  contact_sub: string;
  contact_links: ContactLink[];
  avatar_url: string | null;
  seo_title: string;
  seo_description: string;
};

type Base = {
  id: string;
  sort_order: number;
  published: boolean;
};

export type Experience = Base & {
  company: string;
  role: string;
  dates: string;
  employment_type: string;
  description: string;
  tags: string[];
};

export type ProjectKind = "flagship" | "client" | "archive";

export type Project = Base & {
  title: string;
  slug: string;
  kind: ProjectKind;
  experience_id: string | null;
  year: string;
  label: string;
  role: string;
  country: string;
  description: string;
  highlight: string;
  icon: string;
  cover_image: string | null;
  gallery: string[];
  tags: string[];
  url: string | null;
};

export type Publication = Base & {
  venue: string;
  title: string;
  abstract: string;
  authors: string;
  year: string;
  pdf_url: string | null;
  doi_url: string | null;
};

export type Certification = Base & {
  issuer: string;
  title: string;
  description: string;
  date_label: string;
  pdf_url: string | null;
};

export type Startup = Base & {
  year: string;
  emoji: string;
  name: string;
  domain: string;
  description: string;
  note: string;
};

export type Skill = Base & {
  group_id: string;
  name: string;
  level_label: string;
  percent: number;
};

export type SkillGroup = Base & {
  title: string;
  skills?: Skill[];
};

export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_md: string;
  cover_image: string | null;
  tags: string[];
  status: PostStatus;
  published_at: string | null;
  reading_minutes: number;
  created_at: string;
  updated_at: string;
};

export type HomeData = {
  profile: Profile;
  experiences: (Experience & { projects: Project[] })[];
  flagship: Project[];
  archive: Project[];
  publications: Publication[];
  startups: Startup[];
  skillGroups: (SkillGroup & { skills: Skill[] })[];
  certifications: Certification[];
};
