import type { ReactNode } from "react";
import { Star, WalletCards } from "lucide-react";

type JobBidCardProps = {
  providerName: string;
  amount: string;
  estimatedDays?: number | null;
  message: string;
  statusLabel: string;
  rating?: number | null;
  reviewsCount?: number;
  footer?: ReactNode;
};

export function JobBidCard({
  providerName,
  amount,
  estimatedDays,
  message,
  statusLabel,
  rating,
  reviewsCount = 0,
  footer,
}: JobBidCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-slate-950">{providerName}</p>
          <p className="mt-1 text-sm text-muted-strong">{statusLabel}</p>
        </div>
        <div className="text-right">
          <p className="inline-flex items-center gap-2 text-lg font-bold text-slate-950">
            <WalletCards className="h-4 w-4 text-primary-strong" />
            {amount}
          </p>
          <p className="mt-1 text-sm text-muted-strong">
            {estimatedDays ? `${estimatedDays} dia(s) de prazo` : "Prazo a combinar"}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-muted-strong">{message}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-700">
        <span className="inline-flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-400" />
          {rating ? `${rating} (${reviewsCount} avaliações)` : "Novo prestador"}
        </span>
      </div>

      {footer ? <div className="mt-5">{footer}</div> : null}
    </article>
  );
}
