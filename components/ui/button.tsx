import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:text-current [&_svg]:shrink-0 [&_span]:text-current",
  {
    variants: {
      variant: {
        default:
          "bg-linear-to-r from-primary-strong via-primary to-[#7c83ff] text-white shadow-[0_16px_35px_rgba(99,102,241,0.32)] hover:-translate-y-0.5 hover:shadow-[0_22px_45px_rgba(99,102,241,0.4)]",
        primary:
          "bg-linear-to-r from-primary-strong via-primary to-[#7c83ff] text-white shadow-[0_16px_35px_rgba(99,102,241,0.32)] hover:-translate-y-0.5 hover:shadow-[0_22px_45px_rgba(99,102,241,0.4)]",
        destructive:
          "bg-red-600 text-white shadow-[0_14px_30px_rgba(220,38,38,0.24)] hover:bg-red-500",
        outline:
          "border border-slate-300 bg-white text-slate-950 shadow-[0_12px_24px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:border-primary/35 hover:bg-slate-50 hover:text-primary-strong hover:shadow-[0_18px_32px_rgba(15,23,42,0.12)]",
        secondary:
          "border border-slate-300 bg-white text-slate-950 shadow-[0_12px_24px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:border-primary/35 hover:bg-slate-50 hover:text-primary-strong hover:shadow-[0_18px_32px_rgba(15,23,42,0.12)]",
        ghost:
          "bg-transparent text-slate-800 shadow-none hover:bg-primary-soft hover:text-primary-strong",
        link: "rounded-none px-0 py-0 font-semibold text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-12 px-5 py-3.5",
        sm: "min-h-10 px-4 py-2.5 text-sm",
        lg: "min-h-14 px-7 py-4 text-base",
        icon: "h-11 w-11 rounded-[1.1rem] p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      fullWidth = false,
      icon,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isPrimary =
      !variant || variant === "default" || variant === "primary";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && "w-full",
          isPrimary && "group relative overflow-hidden !text-white",
          className
        )}
        style={{
          ...(isPrimary ? { color: "#ffffff" } : {}),
          ...style,
        }}
        ref={ref}
        {...props}
      >
        {isPrimary ? (
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_8%,rgba(255,255,255,0.24)_28%,transparent_52%)] opacity-0 transition duration-300 group-hover:translate-x-6 group-hover:opacity-100" />
        ) : null}
        {icon ? (
          <span className="relative z-10 inline-flex shrink-0 items-center">
            {icon}
          </span>
        ) : null}
        {asChild ? (
          <Slottable>{children}</Slottable>
        ) : (
          <span className="relative z-10 inline-flex items-center gap-2">
            {children}
          </span>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
