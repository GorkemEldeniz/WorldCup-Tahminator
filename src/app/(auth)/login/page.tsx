import { OAuthButtons } from "@/components/auth/OAuthButtons";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="w-full max-w-sm">
      {/* Brand mark */}
      <div className="mb-8 text-center">
        <span className="text-4xl">⚽</span>
        <p className="mt-2 text-lg font-extrabold tracking-tight text-ink-900">
          WC<span className="text-pitch-500">26</span>{" "}
          <span className="text-gold-500">Tahmin</span>
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-line-200 bg-surface p-8 shadow-card">
        <h1 className="mb-1 text-xl font-extrabold text-ink-900">Hoş geldin</h1>
        <p className="mb-6 text-sm text-ink-600">
          Tahminini oluşturmak ve arkadaşlarınla paylaşmak için giriş yap.
        </p>
        <OAuthButtons redirectTo={next} />
      </div>

      <p className="mt-6 text-center text-xs text-ink-400">
        Giriş yaparak devam etmek ücretsizdir.
      </p>
    </div>
  );
}
