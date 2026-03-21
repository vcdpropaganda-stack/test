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
        "group relative inline-flex min-h-12 items-center justify-center overflow-hidden rounded-full px-5 py-3.5 text-sm font-semibold whitespace-nowrap shadow-sm disabled:cursor-not-allowed disabled:opacity-55",
        fullWidth && "w-full",
        variant === "primary" &&
          "bg-linear-to-r from-primary-strong via-primary to-[#7c83ff] text-white shadow-[0_16px_35px_rgba(99,102,241,0.32)] hover:-translate-y-0.5 hover:shadow-[0_22px_45px_rgba(99,102,241,0.4)]",
        variant === "secondary" &&
          "border border-slate-300 bg-white text-slate-950 shadow-[0_12px_24px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:border-primary/35 hover:bg-slate-50 hover:text-primary-strong hover:shadow-[0_18px_32px_rgba(15,23,42,0.12)]",
        variant === "ghost" &&
          "bg-transparent text-slate-800 hover:bg-primary-soft hover:text-primary-strong",
        className
      )}
      {...props}
    >
      {variant === "primary" ? (
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_8%,rgba(255,255,255,0.24)_28%,transparent_52%)] opacity-0 transition duration-300 group-hover:translate-x-6 group-hover:opacity-100" />
      ) : null}
      <span className="relative z-10 inline-flex items-center gap-2">
        {icon}
        {children}
      </span>
    </button>
  );
}
