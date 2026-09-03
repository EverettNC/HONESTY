import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Chip({
  active,
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-sm px-3 text-sm transition-[background-color,color] duration-quick ease-out",
        active ? "bg-accent text-accent-fg" : "text-muted hover:bg-surface-2 hover:text-fg",
        className,
      )}
      {...props}
    />
  );
}
