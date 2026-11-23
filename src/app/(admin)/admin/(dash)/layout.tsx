import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/admin/actions";
import { ENTITIES } from "@/lib/admin/entities";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) redirect("/admin/login");
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="card max-w-md p-8 text-sm text-zinc-400">
          <h1 className="mb-2 text-lg font-semibold text-zinc-100">Not an admin</h1>
          <p className="mb-4">
            Signed in as {user.email}, but this account isn&apos;t in the <code>admins</code> table. Run{" "}
            <code className="text-accent">npm run seed</code> with this email as ADMIN_EMAIL.
          </p>
          <form action={signOut}>
            <button className="btn-ghost">Sign out</button>
          </form>
        </div>
      </main>
    );
  }

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/posts", label: "Blog posts" },
    { href: "/admin/profile", label: "Profile & hero" },
    ...Object.values(ENTITIES).map((e) => ({ href: `/admin/${e.key}`, label: e.label })),
  ];

  return (
    <div className="min-h-screen md:grid md:grid-cols-[230px_1fr]">
      <aside className="border-b border-zinc-800/80 bg-zinc-950 md:sticky md:top-0 md:h-screen md:border-r md:border-b-0">
        <div className="flex items-center justify-between px-5 py-4 md:block">
          <Link href="/admin" className="font-mono text-sm text-accent">
            AM.ai <span className="text-zinc-500">/ admin</span>
          </Link>
          <div className="text-xs text-zinc-500 md:mt-1 md:truncate">{user.email}</div>
        </div>
        <AdminNav links={links} />
        <div className="hidden gap-2 px-3 pt-4 md:flex md:flex-col">
          <Link href="/" target="_blank" className="btn-ghost justify-start">View site ↗</Link>
          <form action={signOut}>
            <button className="btn-ghost w-full justify-start">Sign out</button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-6 md:px-10 md:py-10">{children}</main>
    </div>
  );
}
