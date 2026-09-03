import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "muted",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "muted" | "sage" | "danger" | "paper";
}) {
  const tones = {
    muted: "bg-surface-2 text-muted border-border",
    sage: "bg-sage/15 text-sage border-sage/30",
    danger: "bg-danger/15 text-danger border-danger/30",
    paper: "bg-accent/10 text-fg border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
