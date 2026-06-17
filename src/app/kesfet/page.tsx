import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TEAM_MAP, flagUrl } from "@/lib/worldcup/teams";

export default async function KesfetPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/kesfet");

  // Load other users' completed simulations (with champion), newest first
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rows } = await (supabase as any)
    .from("simulations")
    .select("share_token, champion, updated_at, profiles(username)")
    .neq("user_id", user.id)
    .not("champion", "is", null)
    .not("user_id", "is", null)
    .order("updated_at", { ascending: false })
    .limit(48);

  const simulations: {
    share_token: string;
    champion: string;
    updated_at: string;
    profiles: { username: string } | null;
  }[] = rows ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-pitch-500">Topluluk</p>
        <h1 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">
          Diğer Tahminler
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          Diğer kullanıcıların şampiyon tahminlerini keşfet ve bracket&apos;larını incele.
        </p>
      </div>

      {simulations.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-line-200 bg-surface py-16 text-center">
          <span className="text-5xl">🔍</span>
          <p className="font-semibold text-ink-900">Henüz başka tahmin yok</p>
          <p className="text-sm text-ink-400">İlk tahminleri arkadaşlarına yaptır!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {simulations.map((sim) => {
            const team = TEAM_MAP[sim.champion];
            const username = sim.profiles?.username ?? "Anonim";
            const initial = username[0].toUpperCase();
            const date = new Date(sim.updated_at).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "short",
            });

            return (
              <Link
                key={sim.share_token}
                href={`/share/${sim.share_token}`}
                className="group flex flex-col gap-4 rounded-2xl border border-line-200 bg-surface p-5 shadow-card transition-all hover:border-pitch-400/40 hover:shadow-[0_8px_32px_rgba(15,138,114,0.08)] hover:-translate-y-0.5"
              >
                {/* User row */}
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pitch-500 text-xs font-extrabold text-white">
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink-900 truncate">@{username}</p>
                    <p className="text-xs text-ink-400">{date}</p>
                  </div>
                  <span className="ml-auto text-xs font-medium text-pitch-500 opacity-0 transition-opacity group-hover:opacity-100">
                    İncele →
                  </span>
                </div>

                {/* Champion */}
                {team ? (
                  <div className="flex items-center gap-3 rounded-xl border border-gold-400/30 bg-gold-50 px-4 py-3">
                    <span className="text-lg">🏆</span>
                    <img
                      src={flagUrl(team.flag ?? "", 40)}
                      alt={team.name}
                      className="h-5 w-7 rounded-sm object-cover"
                    />
                    <span className="text-sm font-extrabold text-ink-900">{team.name}</span>
                  </div>
                ) : (
                  <div className="rounded-xl border border-line-200 bg-surface-soft px-4 py-3 text-sm text-ink-400">
                    Şampiyon belirtilmemiş
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
