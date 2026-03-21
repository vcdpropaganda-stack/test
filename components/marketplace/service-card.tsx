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
    <Link href={href} prefetch aria-label={`Ver serviço ${title}`} className="block h-full min-w-0">
      <article className="elevated-card group h-full overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(15,23,42,0.14)] sm:rounded-[2rem]">
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
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-white sm:gap-3 sm:p-5">
            <div>
              <span className="inline-flex rounded-full border border-white/20 bg-white/14 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase backdrop-blur-sm sm:px-3 sm:text-[11px] sm:tracking-[0.18em]">
                {tag}
              </span>
              <p className="mt-2 line-clamp-1 text-sm font-semibold sm:mt-3 sm:text-lg">{provider}</p>
            </div>
            {rating ? (
              <span
                aria-label={`Avaliação ${rating} de 5`}
                className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium backdrop-blur-sm sm:px-3 sm:text-sm"
              >
                <Star className="h-4 w-4 fill-current text-amber-300" />
                {rating}
              </span>
            ) : (
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm sm:px-3 sm:text-xs">
                Novo
              </span>
            )}
          </div>
        </div>
        <div className="flex h-[15.25rem] flex-col p-3.5 sm:h-[18.5rem] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary-strong sm:px-3 sm:text-xs">
              {duration ?? "Atendimento agendado"}
            </span>
            <span className="text-[11px] font-medium text-muted-strong sm:text-sm">
              {reviewsCount ? `${reviewsCount} avaliações` : "Novo perfil"}
            </span>
          </div>
          <h3 className="mt-3 line-clamp-2 font-sans text-[1.35rem] leading-[1.02] font-bold tracking-tight text-slate-950 sm:mt-5 sm:text-[2rem] sm:leading-tight">
            {title}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-strong sm:mt-3 sm:line-clamp-3 sm:text-sm sm:leading-7">
            {description ??
              "Atendimento com agenda publicada, apresentação clara e fluxo rápido de contratação."}
          </p>
          {duration || location ? (
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-strong sm:mt-4 sm:gap-3 sm:text-sm">
              {duration ? (
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {duration}
                </span>
              ) : null}
              {location ? (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {location}
                </span>
              ) : null}
            </div>
          ) : null}
          <div className="mt-auto flex items-end justify-between gap-3 pt-4 sm:gap-4 sm:pt-6">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.16em] text-muted uppercase sm:text-xs sm:tracking-[0.18em]">
                A partir de
              </p>
              <p className="text-2xl font-bold text-slate-950 sm:text-3xl">{price}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-white sm:gap-2 sm:bg-slate-950 sm:px-5 sm:py-3 sm:text-sm">
              <span className="hidden sm:inline">Ver serviço</span>
              <span className="sm:hidden">Abrir</span>
              <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
