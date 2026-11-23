/**
 * Seeds Supabase with the portfolio content from src/data/seed.ts and creates the admin user.
 *
 *   npm run seed            → upsert all content (safe to re-run; rows keep stable ids)
 *   npm run seed -- --admin-only  → only create/refresh the admin user
 *
 * Needs in .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD.
 * Re-running overwrites seeded rows with the values in seed.ts, so after you start editing
 * in the admin, only re-run with --admin-only.
 */
import { createClient } from "@supabase/supabase-js";
import {
  seedCertifications,
  seedExperiences,
  seedPosts,
  seedProfile,
  seedProjects,
  seedPublications,
  seedSkillGroups,
  seedSkills,
  seedStartups,
} from "../src/data/seed";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const db = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

async function upsert(table: string, rows: object[]) {
  const { error } = await db.from(table).upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`  ✓ ${table} (${rows.length})`);
}

async function seedContent() {
  console.log("Seeding content…");
  await upsert("profile", [seedProfile]);
  await upsert("experiences", seedExperiences);
  await upsert("projects", seedProjects);
  await upsert("publications", seedPublications);
  await upsert("certifications", seedCertifications);
  await upsert("startups", seedStartups);
  await upsert("skill_groups", seedSkillGroups);
  await upsert("skills", seedSkills);
  // The example post is inserted as a draft so nothing is published in your name without review.
  await upsert(
    "posts",
    seedPosts.map(({ created_at: _c, updated_at: _u, ...p }) => ({ ...p, status: "draft", published_at: null })),
  );
}

async function seedAdmin() {
  if (!adminEmail || !adminPassword) {
    console.log("Skipping admin user (set ADMIN_EMAIL and ADMIN_PASSWORD to create one).");
    return;
  }
  console.log("Ensuring admin user…");
  let userId: string | undefined;
  const created = await db.auth.admin.createUser({ email: adminEmail, password: adminPassword, email_confirm: true });
  if (created.data.user) {
    userId = created.data.user.id;
    console.log(`  ✓ created ${adminEmail}`);
  } else {
    // Already exists → find it and reset the password to the one in .env.local.
    for (let page = 1; !userId; page++) {
      const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw error;
      userId = data.users.find((u) => u.email?.toLowerCase() === adminEmail.toLowerCase())?.id;
      if (data.users.length < 200) break;
    }
    if (!userId) throw new Error(`Could not create or find ${adminEmail}: ${created.error?.message}`);
    const { error } = await db.auth.admin.updateUserById(userId, { password: adminPassword });
    if (error) throw error;
    console.log(`  ✓ ${adminEmail} already existed — password updated`);
  }
  const { error } = await db.from("admins").upsert({ user_id: userId });
  if (error) throw new Error(`admins: ${error.message}`);
  console.log("  ✓ granted admin");
}

const adminOnly = process.argv.includes("--admin-only");
(adminOnly ? seedAdmin() : seedContent().then(seedAdmin))
  .then(() => console.log("Done."))
  .catch((e) => {
    console.error("Seed failed:", e instanceof Error ? e.message : e);
    process.exit(1);
  });
