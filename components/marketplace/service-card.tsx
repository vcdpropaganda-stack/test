import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin, Star } from "lucide-react";

type ServiceCardProps = {
  href?: string;
  title: string;
  provider: string;
  price: string;
  tag: string;
  imageUrl?: string | null;
  description?: string;
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
  imageUrl,
  description,
  rating,
  reviewsCount,
  tag,
  duration,
  location,
}: ServiceCardProps) {
  return (
    <Link href={href} prefetch aria-label={`Ver serviço ${title}`} className="block h-full">
      <article className="elevated-card group h-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(15,23,42,0.14)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              loading="lazy"
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.34),_transparent_38%),linear-gradient(135deg,_#1e1b4b,_#4338ca_55%,_#818cf8)]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/24 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
            <div>
              <span className="inline-flex rounded-full border border-white/20 bg-white/14 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase backdrop-blur-sm">
                {tag}
              </span>
              <p className="mt-3 text-lg font-semibold">{provider}</p>
            </div>
            {rating ? (
              <span
                aria-label={`Avaliação ${rating} de 5`}
                className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-sm"
              >
                <Star className="h-4 w-4 fill-current text-amber-300" />
                {rating}
              </span>
            ) : (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                Novo
              </span>
            )}
          </div>
        </div>
        <div className="flex h-[18.5rem] flex-col p-6">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-strong">
              {duration ?? "Atendimento agendado"}
            </span>
            <span className="text-sm font-medium text-muted-strong">
              {reviewsCount ? `${reviewsCount} avaliações` : "Novo perfil"}
            </span>
          </div>
          <h3 className="mt-5 font-sans text-[2rem] leading-tight font-bold tracking-tight text-slate-950">
            {title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-strong">
            {description ??
              "Atendimento com agenda publicada, apresentação clara e fluxo rápido de contratação."}
          </p>
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
          <div className="mt-auto flex items-end justify-between gap-4 pt-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                A partir de
              </p>
              <p className="text-3xl font-bold text-slate-950">{price}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
              Ver serviço
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
