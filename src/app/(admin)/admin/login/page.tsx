import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-sm p-8">
        <div className="mb-6">
          <div className="font-mono text-sm text-accent">AM.ai / admin</div>
          <h1 className="mt-2 text-2xl font-semibold">Sign in</h1>
        </div>
        {isSupabaseConfigured ? (
          <LoginForm next={next?.startsWith("/admin") ? next : "/admin"} />
        ) : (
          <div className="space-y-3 text-sm text-zinc-400">
            <p>Supabase isn&apos;t configured yet, so the admin is disabled. The public site is running on the built-in seed data.</p>
            <p>
              Copy <code className="text-accent">.env.example</code> to <code className="text-accent">.env.local</code>, fill in your
              Supabase keys, run the migration and <code className="text-accent">npm run seed</code>, then restart the dev server.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
