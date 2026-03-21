import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Notice({
  children,
  variant = "info",
}: {
  children: ReactNode;
  variant?: "info" | "success";
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm",
        variant === "info" && "border-primary/15 bg-primary/5 text-primary-strong",
        variant === "success" && "border-success/20 bg-success/10 text-green-800"
      )}
    >
      {children}
    </div>
  );
}
