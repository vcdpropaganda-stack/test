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
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold whitespace-nowrap shadow-sm disabled:cursor-not-allowed disabled:opacity-55",
        fullWidth && "w-full",
        variant === "primary" &&
          "bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-strong",
        variant === "secondary" &&
          "border border-slate-300 bg-white text-slate-950 hover:border-primary/35 hover:bg-slate-50 hover:text-primary-strong",
        variant === "ghost" &&
          "bg-transparent text-slate-800 hover:bg-primary-soft hover:text-primary-strong",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
