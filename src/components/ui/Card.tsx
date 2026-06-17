import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-line-200 bg-surface shadow-card ${className}`}
      {...props}
    />
  );
}
