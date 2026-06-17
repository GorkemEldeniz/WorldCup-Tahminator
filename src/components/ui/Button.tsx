import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-pitch-500 hover:bg-pitch-600 text-white shadow-card disabled:hover:bg-pitch-500",
  secondary:
    "bg-gold-400 hover:bg-gold-500 text-ink-900 shadow-card disabled:hover:bg-gold-400",
  ghost:
    "bg-surface hover:bg-surface-soft text-ink-900 border border-line-200",
  danger:
    "bg-coral-500 hover:bg-coral-600 text-white shadow-card",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
