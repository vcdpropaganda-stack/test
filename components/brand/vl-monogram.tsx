import { cn } from "@/lib/utils";

type VlMonogramProps = {
  className?: string;
  dark?: boolean;
};

export function VlMonogram({ className, dark = false }: VlMonogramProps) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-[1.35rem] border shadow-lg",
        dark
          ? "border-white/15 bg-slate-950 shadow-slate-950/30"
          : "border-slate-200 bg-white shadow-slate-950/10",
        className
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          "absolute inset-0",
          dark
            ? "bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.26),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(239,68,68,0.18),_transparent_32%)]"
            : "bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(239,68,68,0.12),_transparent_32%)]"
        )}
      />
      <svg
        viewBox="0 0 96 96"
        className="relative z-10 h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="48"
          cy="48"
          r="42"
          stroke={dark ? "rgba(255,255,255,0.82)" : "rgba(15,23,42,0.88)"}
          strokeWidth="3.5"
        />
        <path
          d="M26 20L45 76L70 18"
          stroke="#2F46FF"
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 60L38 31L77 58"
          stroke="#E13131"
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
