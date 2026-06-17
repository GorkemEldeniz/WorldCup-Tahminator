export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[calc(100vh-57px)] flex-col items-center justify-center overflow-hidden px-4 py-12">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-pitch-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-gold-500/8 blur-3xl" />
      {children}
    </div>
  );
}
