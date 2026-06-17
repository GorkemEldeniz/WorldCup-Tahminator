import { HTMLAttributes } from "react";

type Tone = "pitch" | "gold" | "coral" | "neutral";

const TONE_CLASSES: Record<Tone, string> = {
  pitch: "bg-pitch-50 text-pitch-700 ring-1 ring-pitch-500/20",
  gold: "bg-gold-50 text-gold-700 ring-1 ring-gold-400/30",
  coral: "bg-coral-50 text-coral-700 ring-1 ring-coral-500/20",
  neutral: "bg-surface-soft text-ink-600 ring-1 ring-line-200",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${TONE_CLASSES[tone]} ${className}`}
      {...props}
    />
  );
}
