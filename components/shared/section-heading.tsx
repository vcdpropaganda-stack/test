import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  invert?: boolean;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  invert = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      data-reveal
      className={cn("max-w-2xl", className)}
    >
      <p
        className={cn(
          "text-sm font-semibold tracking-[0.24em] uppercase",
          invert ? "text-indigo-200" : "text-primary"
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-3 font-sans text-3xl font-bold tracking-tight sm:text-4xl",
          invert ? "text-white" : "text-slate-950"
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "mt-4 text-base leading-7",
          invert ? "text-slate-200" : "text-muted"
        )}
      >
        {description}
      </p>
    </div>
  );
}
