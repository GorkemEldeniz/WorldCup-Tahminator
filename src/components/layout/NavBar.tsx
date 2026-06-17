import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function NavBar() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  let username: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();
    username = profile?.username ?? null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line-200/80 bg-surface/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center">
          <img src="/wc26-logo.png" alt="WC26 Tahmin" className="h-11 w-auto" />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-1">
          <Link
            href="/predict"
            className="rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-surface-soft hover:text-ink-900"
          >
            Tahmin Yap
          </Link>

          {user && (
            <Link
              href="/kesfet"
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-surface-soft hover:text-ink-900"
            >
              Keşfet
            </Link>
          )}

          {user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-surface-soft hover:text-ink-900"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pitch-500 text-[10px] font-extrabold text-white">
                  {(username ?? "?")[0].toUpperCase()}
                </span>
                <span className="hidden sm:inline">{username ?? "Profil"}</span>
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-lg border border-line-200 px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-surface-soft hover:text-ink-900"
                >
                  Çıkış
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-pitch-500 px-4 py-2 text-sm font-semibold text-white shadow-card transition-all hover:bg-pitch-600 hover:-translate-y-px"
            >
              Giriş yap
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
