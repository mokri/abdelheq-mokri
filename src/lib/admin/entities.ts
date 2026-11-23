/**
 * Declarative description of every admin-editable content type.
 * Plain data only (no functions) so it can be shared by server actions and client forms.
 */

export type SubField = {
  name: string;
  label: string;
  type: "text" | "textarea";
  placeholder?: string;
};

export type Field = {
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "markdown-short"
    | "number"
    | "url"
    | "tags"
    | "select"
    | "relation"
    | "image"
    | "images"
    | "file"
    | "checkbox"
    | "list";
  required?: boolean;
  help?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  /** For type "relation": table to load options from + column used as label. */
  relation?: { table: EntityKey; labelField: string; emptyLabel?: string };
  /** For type "list": shape of each row (jsonb array of objects). */
  itemFields?: SubField[];
  /** Storage folder for uploads. */
  folder?: string;
  /** For type "file": accepted MIME types. */
  accept?: string;
  /** Number range. */
  min?: number;
  max?: number;
  /** Half-width on desktop. */
  half?: boolean;
};

export type EntityKey =
  | "experiences"
  | "projects"
  | "publications"
  | "certifications"
  | "startups"
  | "skill_groups"
  | "skills";

export type EntityConfig = {
  key: EntityKey;
  label: string;
  singular: string;
  description: string;
  /** Column shown as the row title in lists, plus secondary columns. */
  titleField: string;
  subtitleFields: string[];
  /** Optional filter tabs on the list page (by a field value). */
  filter?: { field: string; label: string; options?: { value: string; label: string }[]; relation?: Field["relation"] };
  fields: Field[];
  defaults: Record<string, unknown>;
};

const KIND_OPTIONS = [
  { value: "flagship", label: "Flagship" },
  { value: "client", label: "Client work (under an experience)" },
  { value: "archive", label: "Archive / earlier work" },
];

export const ENTITIES: Record<EntityKey, EntityConfig> = {
  experiences: {
    key: "experiences",
    label: "Experiences",
    singular: "Experience",
    description: "Jobs shown in the Experience section. Projects can be linked to an experience.",
    titleField: "company",
    subtitleFields: ["role", "dates"],
    fields: [
      { name: "company", label: "Company", type: "text", required: true, half: true },
      { name: "role", label: "Role / title", type: "text", required: true, half: true },
      { name: "dates", label: "Dates", type: "text", placeholder: "Oct 2024 – Present", half: true },
      { name: "employment_type", label: "Type / location", type: "text", placeholder: "Full-time · Remote", half: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "tags", label: "Tags", type: "tags" },
      { name: "published", label: "Published", type: "checkbox" },
    ],
    defaults: { company: "", role: "", dates: "", employment_type: "", description: "", tags: [], published: true },
  },

  projects: {
    key: "projects",
    label: "Projects",
    singular: "Project",
    description: "Flagship projects, client work linked to an experience, and the earlier-work archive.",
    titleField: "title",
    subtitleFields: ["kind", "year", "role"],
    filter: { field: "kind", label: "Kind", options: KIND_OPTIONS },
    fields: [
      { name: "title", label: "Title", type: "text", required: true, half: true },
      { name: "slug", label: "Slug", type: "text", help: "Leave empty to generate from the title.", half: true },
      { name: "kind", label: "Kind", type: "select", options: KIND_OPTIONS, required: true, half: true },
      {
        name: "experience_id",
        label: "Linked experience",
        type: "relation",
        relation: { table: "experiences", labelField: "company", emptyLabel: "— none —" },
        help: "Client-work projects appear as image cards under this experience.",
        half: true,
      },
      { name: "year", label: "Year", type: "text", placeholder: "2022", half: true },
      { name: "country", label: "Country", type: "text", half: true },
      { name: "role", label: "Your role", type: "text", placeholder: "Product Owner", half: true },
      { name: "label", label: "Card label (flagship)", type: "text", placeholder: "AGENTIC TOOL", half: true },
      { name: "icon", label: "Emoji icon", type: "text", placeholder: "🗺️", half: true },
      { name: "url", label: "Project URL", type: "url", half: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "highlight", label: "Highlight line (flagship)", type: "text" },
      { name: "tags", label: "Tags / tech", type: "tags" },
      { name: "cover_image", label: "Cover image", type: "image", folder: "projects" },
      { name: "gallery", label: "Gallery", type: "images", folder: "projects" },
      { name: "published", label: "Published", type: "checkbox" },
    ],
    defaults: {
      title: "", slug: "", kind: "flagship", experience_id: null, year: "", country: "", role: "", label: "",
      icon: "", url: "", description: "", highlight: "", tags: [], cover_image: null, gallery: [], published: true,
    },
  },

  publications: {
    key: "publications",
    label: "Papers",
    singular: "Paper",
    description: "Research & Publications section.",
    titleField: "title",
    subtitleFields: ["venue"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "venue", label: "Venue", type: "text", placeholder: "ISPR 2025 · First-authored", half: true },
      { name: "year", label: "Year", type: "text", half: true },
      { name: "authors", label: "Authors", type: "text" },
      { name: "abstract", label: "Abstract", type: "textarea" },
      { name: "pdf_url", label: "PDF", type: "file", folder: "papers", accept: "application/pdf", half: true },
      { name: "doi_url", label: "DOI / publisher link", type: "url", half: true },
      { name: "published", label: "Published", type: "checkbox" },
    ],
    defaults: { title: "", venue: "", year: "", authors: "", abstract: "", pdf_url: null, doi_url: "", published: true },
  },

  certifications: {
    key: "certifications",
    label: "Certificates",
    singular: "Certificate",
    description: "Certifications grid.",
    titleField: "title",
    subtitleFields: ["issuer", "date_label"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "issuer", label: "Issuer", type: "text", required: true, half: true },
      { name: "date_label", label: "Date", type: "text", placeholder: "Dec 2021", half: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "pdf_url", label: "Certificate PDF", type: "file", folder: "certificates", accept: "application/pdf,image/*" },
      { name: "published", label: "Published", type: "checkbox" },
    ],
    defaults: { title: "", issuer: "", date_label: "", description: "", pdf_url: null, published: true },
  },

  startups: {
    key: "startups",
    label: "Startups",
    singular: "Startup",
    description: "The “Bets on Myself” flip cards.",
    titleField: "name",
    subtitleFields: ["year", "domain"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, half: true },
      { name: "year", label: "Year", type: "text", half: true },
      { name: "emoji", label: "Emoji", type: "text", half: true },
      { name: "domain", label: "Domain", type: "text", placeholder: "AI Agents · PropTech", half: true },
      { name: "description", label: "Description (card back)", type: "textarea" },
      { name: "note", label: "Note", type: "text", placeholder: "Current Focus" },
      { name: "published", label: "Published", type: "checkbox" },
    ],
    defaults: { name: "", year: "", emoji: "", domain: "", description: "", note: "", published: true },
  },

  skill_groups: {
    key: "skill_groups",
    label: "Skill groups",
    singular: "Skill group",
    description: "Columns of the Technical Skills section.",
    titleField: "title",
    subtitleFields: [],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "published", label: "Published", type: "checkbox" },
    ],
    defaults: { title: "", published: true },
  },

  skills: {
    key: "skills",
    label: "Skills",
    singular: "Skill",
    description: "Individual skill bars.",
    titleField: "name",
    subtitleFields: ["level_label", "percent"],
    filter: { field: "group_id", label: "Group", relation: { table: "skill_groups", labelField: "title" } },
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      {
        name: "group_id",
        label: "Group",
        type: "relation",
        relation: { table: "skill_groups", labelField: "title" },
        required: true,
        half: true,
      },
      { name: "level_label", label: "Level", type: "text", placeholder: "Advanced", half: true },
      { name: "percent", label: "Bar %", type: "number", min: 0, max: 100, half: true },
      { name: "published", label: "Published", type: "checkbox" },
    ],
    defaults: { name: "", group_id: "", level_label: "", percent: 80, published: true },
  },
};

export const ENTITY_KEYS = Object.keys(ENTITIES) as EntityKey[];

export const PROFILE_FIELDS: Field[] = [
  { name: "name_first", label: "First name", type: "text", required: true, half: true },
  { name: "name_last", label: "Last name", type: "text", required: true, half: true },
  { name: "initials", label: "Initials (logo / avatar)", type: "text", half: true },
  { name: "avatar_url", label: "Avatar", type: "image", folder: "profile", half: true },
  { name: "hero_label", label: "Hero label", type: "text" },
  { name: "typewriter_lines", label: "Typewriter lines (max 4)", type: "tags", help: "Press Enter after each line." },
  {
    name: "hero_stats",
    label: "Hero stats",
    type: "list",
    itemFields: [
      { name: "value", label: "Value", type: "text" },
      { name: "label", label: "Label", type: "text" },
    ],
  },
  { name: "about_role", label: "About card role", type: "text" },
  { name: "about_tags", label: "About card tags", type: "tags" },
  {
    name: "about_stats",
    label: "About card stats",
    type: "list",
    itemFields: [
      { name: "value", label: "Value", type: "text" },
      { name: "label", label: "Label", type: "text" },
    ],
  },
  { name: "bio_md", label: "Bio (Markdown)", type: "markdown-short", help: "Blank line between paragraphs. **bold** supported." },
  {
    name: "timeline",
    label: "About timeline",
    type: "list",
    itemFields: [
      { name: "date", label: "Dates", type: "text" },
      { name: "role", label: "Role", type: "text" },
      { name: "org", label: "Organisation", type: "text" },
    ],
  },
  { name: "research_keywords", label: "Research keywords", type: "tags" },
  { name: "startups_footnote", label: "Startups footnote (Markdown)", type: "markdown-short" },
  { name: "contact_heading", label: "Contact heading", type: "textarea", help: "New line = line break." },
  { name: "contact_sub", label: "Contact subheading", type: "text" },
  {
    name: "contact_links",
    label: "Contact links",
    type: "list",
    itemFields: [
      { name: "icon", label: "Icon", type: "text" },
      { name: "label", label: "Label", type: "text" },
      { name: "value", label: "Shown value", type: "text" },
      { name: "href", label: "Link", type: "text" },
    ],
  },
  { name: "seo_title", label: "SEO title", type: "text" },
  { name: "seo_description", label: "SEO description", type: "textarea" },
];
