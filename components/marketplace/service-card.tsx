import Link from "next/link";
import { Clock3, MapPin, Star } from "lucide-react";

type ServiceCardProps = {
  href?: string;
  title: string;
  provider: string;
  price: string;
  tag: string;
  rating?: number | null;
  reviewsCount?: number;
  duration?: string;
  location?: string | null;
};

export function ServiceCard({
  href = "#",
  title,
  provider,
  price,
  rating,
  reviewsCount,
  tag,
  duration,
  location,
}: ServiceCardProps) {
  return (
    <article className="elevated-card overflow-hidden rounded-[2rem] border border-border bg-surface">
      <div
        aria-hidden="true"
        className="aspect-[4/3] bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.34),_transparent_38%),linear-gradient(135deg,_#1e1b4b,_#4338ca_55%,_#818cf8)]"
      />
      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-strong">
            {tag}
          </span>
          {rating ? (
            <span
              aria-label={`Avaliacao ${rating} de 5`}
              className="flex items-center gap-1 text-sm font-medium text-slate-700"
            >
              <Star className="h-4 w-4 fill-current text-amber-400" />
              {rating}
              {reviewsCount ? (
                <span className="text-muted-strong">({reviewsCount})</span>
              ) : null}
            </span>
          ) : (
            <span className="text-sm font-medium text-muted-strong">Novo perfil</span>
          )}
        </div>
        <h3 className="mt-5 font-sans text-xl font-bold tracking-tight text-slate-950">
          {title}
        </h3>
        <p className="mt-2 text-sm text-muted-strong">{provider}</p>
        {duration || location ? (
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-strong">
            {duration ? (
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {duration}
              </span>
            ) : null}
            {location ? (
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {location}
              </span>
            ) : null}
          </div>
        ) : null}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-lg font-bold text-slate-950">{price}</p>
          <Link
            href={href}
            aria-label={`Ver servico ${title}`}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong"
          >
            Ver servico
          </Link>
        </div>
      </div>
    </article>
  );
}
