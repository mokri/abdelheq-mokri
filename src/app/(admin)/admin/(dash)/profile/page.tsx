import { EntityForm } from "@/components/admin/EntityForm";
import { PROFILE_FIELDS } from "@/lib/admin/entities";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { seedProfile } from "@/data/seed";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("profile").select("*").eq("id", 1).maybeSingle();
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold">Profile &amp; hero</h1>
      <p className="mt-1 mb-8 text-sm text-zinc-400">Hero, About card, bio, timeline, research keywords, contact links and SEO.</p>
      <EntityForm mode="profile" fields={PROFILE_FIELDS} initial={data ?? seedProfile} options={{}} />
    </div>
  );
}
