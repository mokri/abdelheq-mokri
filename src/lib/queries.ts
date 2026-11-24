import "server-only";
import { cache } from "react";
import {
  seedAwards,
  seedCertifications,
  seedExperiences,
  seedPosts,
  seedProfile,
  seedProjects,
  seedPublications,
  seedSkillGroups,
  seedSkills,
  seedStartups,
} from "@/data/seed";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabasePublicClient } from "@/lib/supabase/server";
import type {
  Award,
  Certification,
  Experience,
  HomeData,
  Post,
  Profile,
  Project,
  Publication,
  Skill,
  SkillGroup,
  Startup,
} from "@/lib/types";

const bySort = <T extends { sort_order: number }>(a: T, b: T) => a.sort_order - b.sort_order;

function assemble(parts: {
  profile: Profile;
  experiences: Experience[];
  projects: Project[];
  publications: Publication[];
  startups: Startup[];
  skillGroups: SkillGroup[];
  skills: Skill[];
  certifications: Certification[];
  awards: Award[];
}): HomeData {
  const projects = parts.projects.filter((p) => p.published).sort(bySort);
  return {
    profile: parts.profile,
    experiences: parts.experiences
      .filter((e) => e.published)
      .sort(bySort)
      .map((e) => ({ ...e, projects: projects.filter((p) => p.experience_id === e.id) })),
    flagship: projects.filter((p) => p.kind === "flagship"),
    archive: projects.filter((p) => p.kind === "archive"),
    publications: parts.publications.filter((p) => p.published).sort(bySort),
    startups: parts.startups.filter((s) => s.published).sort(bySort),
    skillGroups: parts.skillGroups
      .filter((g) => g.published)
      .sort(bySort)
      .map((g) => ({
        ...g,
        skills: parts.skills.filter((s) => s.published && s.group_id === g.id).sort(bySort),
      })),
    certifications: parts.certifications.filter((c) => c.published).sort(bySort),
    awards: parts.awards.filter((a) => a.published).sort(bySort),
  };
}

export const getHomeData = cache(async (): Promise<HomeData> => {
  if (!isSupabaseConfigured) {
    return assemble({
      profile: seedProfile,
      experiences: seedExperiences,
      projects: seedProjects,
      publications: seedPublications,
      startups: seedStartups,
      skillGroups: seedSkillGroups,
      skills: seedSkills,
      certifications: seedCertifications,
      awards: seedAwards,
    });
  }

  const db = createSupabasePublicClient();
  const [profile, experiences, projects, publications, startups, skillGroups, skills, certifications, awards] =
    await Promise.all([
      db.from("profile").select("*").eq("id", 1).maybeSingle(),
      db.from("experiences").select("*"),
      db.from("projects").select("*"),
      db.from("publications").select("*"),
      db.from("startups").select("*"),
      db.from("skill_groups").select("*"),
      db.from("skills").select("*"),
      db.from("certifications").select("*"),
      db.from("awards").select("*"),
    ]);

  const firstError = [profile, experiences, projects, publications, startups, skillGroups, skills, certifications, awards].find(
    (r) => r.error,
  )?.error;
  if (firstError) throw new Error(`Failed to load portfolio data: ${firstError.message}`);

  return assemble({
    profile: (profile.data as Profile | null) ?? seedProfile,
    experiences: experiences.data as Experience[],
    projects: projects.data as Project[],
    publications: publications.data as Publication[],
    startups: startups.data as Startup[],
    skillGroups: skillGroups.data as SkillGroup[],
    skills: skills.data as Skill[],
    certifications: certifications.data as Certification[],
    awards: awards.data as Award[],
  });
});

export const getProfile = cache(async (): Promise<Profile> => (await getHomeData()).profile);

const POST_LIST_COLUMNS =
  "id,title,slug,excerpt,cover_image,tags,status,published_at,reading_minutes,created_at,updated_at";

export const getPublishedPosts = cache(async (): Promise<Post[]> => {
  if (!isSupabaseConfigured) {
    return seedPosts.filter((p) => p.status === "published");
  }
  const { data, error } = await createSupabasePublicClient()
    .from("posts")
    .select(POST_LIST_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw new Error(`Failed to load posts: ${error.message}`);
  return (data as Omit<Post, "content_md">[]).map((p) => ({ ...p, content_md: "" }));
});

export const getPublishedPost = cache(async (slug: string): Promise<Post | null> => {
  if (!isSupabaseConfigured) {
    return seedPosts.find((p) => p.slug === slug && p.status === "published") ?? null;
  }
  const { data, error } = await createSupabasePublicClient()
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw new Error(`Failed to load post: ${error.message}`);
  return data as Post | null;
});
