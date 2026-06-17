"use client";

const STEPS = [
  { n: 1, label: "Grup Sıralaması" },
  { n: 2, label: "En İyi 3.'ler" },
  { n: 3, label: "Eşleşme" },
  { n: 4, label: "Eleme Turu" },
  { n: 5, label: "Paylaş" },
];

interface Props {
  current: number;
  onNavigate?: (step: number) => void;
}

export function StepIndicator({ current, onNavigate }: Props) {
  return (
    <div className="flex items-center justify-center gap-0 overflow-x-auto py-2">
      {STEPS.map((s, i) => {
        const done = current > s.n;
        const active = current === s.n;
        const clickable = done && !!onNavigate;
        return (
          <div key={s.n} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onNavigate(s.n)}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors
                  ${done ? "bg-pitch-500 text-white" : active ? "bg-gold-500 text-white" : "bg-line-200 text-ink-400"}
                  ${clickable ? "cursor-pointer hover:bg-pitch-600 hover:scale-110 transition-transform" : "cursor-default"}`}
              >
                {done ? "✓" : s.n}
              </button>
              <span
                className={`hidden sm:block text-xs font-medium whitespace-nowrap ${active ? "text-ink-900" : "text-ink-400"}`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-1 h-0.5 w-8 sm:w-12 ${done ? "bg-pitch-500" : "bg-line-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
