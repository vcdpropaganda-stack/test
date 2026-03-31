import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin, WalletCards } from "lucide-react";
import { JobStatusBadge } from "@/components/jobs/job-status-badge";

type JobCardProps = {
  href: string;
  title: string;
  description: string;
  category?: string | null;
  location: string;
  budget: string;
  status: "open" | "has_bids" | "in_progress" | "completed" | "cancelled" | "expired";
  deadline?: string | null;
  bidsLabel?: string | null;
};

export function JobCard({
  href,
  title,
  description,
  category,
  location,
  budget,
  status,
  deadline,
  bidsLabel,
}: JobCardProps) {
  return (
    <Link href={href} className="block h-full">
      <article className="elevated-card group flex h-full flex-col rounded-[1.7rem] border border-border bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/20">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {category ? (
              <p className="text-[0.72rem] font-semibold tracking-[0.24em] text-primary-strong uppercase">
                {category}
              </p>
            ) : null}
            <h3 className="mt-2 font-sans text-2xl font-bold tracking-tight text-slate-950">
              {title}
            </h3>
          </div>
          <JobStatusBadge status={status} />
        </div>

        <p className="mt-4 text-sm leading-7 text-muted-strong">
          {description}
        </p>

        <div className="mt-5 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary-strong" />
            {location}
          </span>
          <span className="inline-flex items-center gap-2">
            <WalletCards className="h-4 w-4 text-primary-strong" />
            {budget}
          </span>
          {deadline ? (
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-primary-strong" />
              {deadline}
            </span>
          ) : null}
          {bidsLabel ? <span className="text-muted-strong">{bidsLabel}</span> : null}
        </div>

        <div className="mt-auto pt-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(99,102,241,0.22)]">
            Ver pedido
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </article>
    </Link>
  );
}
