import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) redirect("/login?next=/profile");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url")
    .eq("id", user.id)
    .single();

  const initial = (profile?.username ?? user.email ?? "?")[0].toUpperCase();

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pitch-500 text-xl font-extrabold text-white shadow-card">
          {initial}
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-ink-900">Profilim</h1>
          <p className="text-sm text-ink-400">{user.email}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-line-200 bg-surface p-6 shadow-card">
        <ProfileForm
          userId={user.id}
          initialUsername={profile?.username ?? ""}
          initialAvatarUrl={profile?.avatar_url ?? null}
        />
      </div>
    </div>
  );
}
