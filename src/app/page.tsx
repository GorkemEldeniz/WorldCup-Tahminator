import Link from "next/link";

const STEPS = [
  {
    n: "01",
    icon: "🎯",
    title: "Grupları Sırala",
    desc: "12 gruptaki 4 takımı sürükle-bırak ile sırala. Canlı verilerle gerçek grup sıralamaları yansıtılıyor.",
  },
  {
    n: "02",
    icon: "⭐",
    title: "3.'leri Seç",
    desc: "12 grup üçüncüsü arasından elemeye geçecek en iyi 8 takımı belirle.",
  },
  {
    n: "03",
    icon: "🔀",
    title: "Bracket Oluşur",
    desc: "FIFA algoritması 32 takımı otomatik olarak turnuva ağacına yerleştirir.",
  },
  {
    n: "04",
    icon: "🏆",
    title: "Şampiyonu Belirle",
    desc: "Son 32'den finale her turu oyna, kazanan takımı seç ve şampiyonunu ilan et.",
  },
];

const STATS = [
  { value: "48", label: "Takım" },
  { value: "12", label: "Grup" },
  { value: "64", label: "Maç" },
  { value: "1", label: "Şampiyon" },
];

export default function Home() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-pitch-700">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-pitch-600/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        {/* Grid pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-line-200) 1px, transparent 1px), linear-gradient(90deg, var(--color-line-200) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-pitch-500/40 bg-pitch-600/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-pitch-400 backdrop-blur-sm">
            ⚽ 2026 FIFA World Cup
          </span>

          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Turnuvayı Baştan Sona
            <br />
            <span className="bg-gradient-to-r from-gold-400 to-gold-300 bg-clip-text text-transparent">
              Sen Simüle Et
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pitch-400 sm:text-lg">
            48 takımı gruplardan finale sürükle, en iyi 3.&apos;leri seç, bracket&apos;ı tamamla
            ve şampiyonunu arkadaşlarınla paylaş.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/predict"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gold-500 px-8 py-4 text-base font-extrabold text-white shadow-[0_0_40px_rgba(213,142,31,0.35)] transition-all hover:bg-gold-400 hover:shadow-[0_0_60px_rgba(213,142,31,0.45)] hover:-translate-y-0.5"
            >
              Tahmini Başlat
              <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-14 flex items-center justify-center gap-8 border-t border-pitch-600/60 pt-10">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-extrabold text-white sm:text-3xl">{value}</div>
                <div className="mt-0.5 text-xs font-medium uppercase tracking-wider text-pitch-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section className="bg-surface-soft px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-pitch-500">Nasıl Oynanır?</p>
            <h2 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">
              4 adımda kendi tahmin kartın
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ n, icon, title, desc }) => (
              <div
                key={n}
                className="group relative rounded-2xl border border-line-200 bg-surface p-6 shadow-card transition-all hover:border-pitch-400/40 hover:shadow-[0_8px_32px_rgba(15,138,114,0.08)] hover:-translate-y-1"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-3xl">{icon}</span>
                  <span className="text-xs font-black text-line-200 group-hover:text-pitch-400/30 transition-colors">{n}</span>
                </div>
                <h3 className="mb-2 font-extrabold text-ink-900">{title}</h3>
                <p className="text-sm leading-relaxed text-ink-600">{desc}</p>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-gradient-to-r from-pitch-500 to-gold-500 transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────── */}
      <section className="bg-pitch-700 px-6 py-16 text-center">
        <div className="mx-auto max-w-xl">
          <p className="mb-3 text-pitch-400 text-sm font-semibold">Ücretsiz · Kayıt Gerekiyor</p>
          <h2 className="mb-6 text-2xl font-extrabold text-white sm:text-3xl">
            Şampiyonun kim sence?
          </h2>
          <Link
            href="/predict"
            className="inline-flex items-center gap-2 rounded-2xl border border-pitch-500/50 bg-pitch-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-pitch-500 hover:border-pitch-400"
          >
            Hemen Başla →
          </Link>
        </div>
      </section>
    </div>
  );
}
