import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:pt-24">
      <div className="mx-auto max-w-4xl text-center">
        <span className="mb-4 inline-block rounded-full bg-gold-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-700 ring-1 ring-gold-400/30">
          2026 FIFA Dünya Kupası
        </span>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-6xl">
          Skoru sen tahmin et,
          <br />
          <span className="text-pitch-500">puanı sen topla.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-ink-600 sm:text-lg">
          Her gün oynanan Dünya Kupası maçlarının skorunu tahmin et. Maç başlamadan
          önce tahminini istediğin zaman güncelle, doğru tahminlerle galibiyet
          serisi yakala ve liderlik tablosunda zirveye oyna.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/matches"
            className="w-full rounded-xl bg-pitch-500 px-8 py-3.5 text-center text-sm font-bold text-white shadow-card-lg transition-colors hover:bg-pitch-600 sm:w-auto"
          >
            Bugünün maçlarını gör
          </Link>
          <Link
            href="/login"
            className="w-full rounded-xl border border-line-200 bg-surface px-8 py-3.5 text-center text-sm font-bold text-ink-900 transition-colors hover:bg-surface-soft sm:w-auto"
          >
            Ücretsiz hesap oluştur
          </Link>
        </div>
      </div>
    </section>
  );
}
