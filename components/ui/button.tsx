import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  icon?: ReactNode;
};

export function Button({
  className,
  variant = "primary",
  fullWidth = false,
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold",
        fullWidth && "w-full",
        variant === "primary" &&
          "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-strong",
        variant === "secondary" &&
          "border border-border bg-white text-slate-900 hover:border-primary/30 hover:text-primary-strong",
        variant === "ghost" &&
          "bg-transparent text-slate-700 hover:bg-primary-soft hover:text-primary-strong",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
