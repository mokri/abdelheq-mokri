import {
  About,
  Archive,
  Awards,
  Certifications,
  Contact,
  ExperienceSection,
  Flagship,
  Hero,
  LatestPosts,
  Research,
  Skills,
  Startups,
} from "@/components/site/Sections";
import { getHomeData, getPublishedPosts } from "@/lib/queries";

// Static page; admin saves call revalidatePath("/") to refresh it on demand.
export const revalidate = 3600;

export default async function HomePage() {
  const [data, posts] = await Promise.all([getHomeData(), getPublishedPosts()]);
  return (
    <>
      <Hero profile={data.profile} />
      <About profile={data.profile} />
      <ExperienceSection experiences={data.experiences} />
      <Flagship flagship={data.flagship} />
      <Research publications={data.publications} profile={data.profile} />
      <Awards awards={data.awards} />
      <Startups startups={data.startups} profile={data.profile} />
      <Skills skillGroups={data.skillGroups} />
      <Certifications certifications={data.certifications} />
      <Archive archive={data.archive} />
      <LatestPosts posts={posts.slice(0, 3)} />
      <Contact profile={data.profile} />
    </>
  );
}
