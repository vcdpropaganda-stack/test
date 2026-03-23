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
      <article
        data-reveal
        className="elevated-card group relative h-full overflow-hidden rounded-[1.35rem] border border-slate-200/90 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-[0_26px_70px_rgba(15,23,42,0.16)] sm:min-h-[35rem] sm:rounded-[2rem]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(99,102,241,0.07),transparent)] opacity-0 transition duration-300 group-hover:opacity-100" />
        <div className="relative aspect-[0.96] overflow-hidden bg-slate-200 sm:aspect-[4/3]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 50vw, 33vw"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              loading="lazy"
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.34),_transparent_38%),linear-gradient(135deg,_#1e1b4b,_#4338ca_55%,_#818cf8)]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/24 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2.5 text-white sm:gap-3 sm:p-5">
            <div className="min-w-0">
              <span className="inline-flex rounded-full border border-white/20 bg-white/14 px-2 py-1 text-[8px] font-semibold tracking-[0.14em] uppercase backdrop-blur-sm sm:px-3 sm:text-[11px] sm:tracking-[0.18em]">
                {tag}
              </span>
              <p className="mt-1.5 line-clamp-1 text-[0.8rem] leading-tight font-semibold text-white/95 sm:mt-3 sm:text-lg">
                {provider}
              </p>
            </div>
            {rating ? (
              <span
                aria-label={`Avaliação ${rating} de 5`}
                className="flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium backdrop-blur-sm sm:px-3 sm:text-sm"
              >
                <Star className="h-4 w-4 fill-current text-amber-300" />
                {rating}
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium backdrop-blur-sm sm:px-3 sm:text-xs">
                Novo
              </span>
            )}
          </div>
        </div>
        <div className="flex min-h-[13.2rem] flex-col p-2.5 sm:min-h-[19.2rem] sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-primary-soft px-2 py-1 text-[9px] font-semibold text-primary-strong sm:px-3 sm:text-xs">
              {duration ?? "Atendimento agendado"}
            </span>
            <span className="line-clamp-1 w-[5.8rem] text-right text-[9px] font-medium text-muted-strong sm:w-[7.8rem] sm:text-sm">
              {reviewsCount ? `${reviewsCount} avaliações` : "Novo perfil"}
            </span>
          </div>
          <h3 className="mt-2.5 h-[2.05rem] overflow-hidden break-words font-sans text-[0.92rem] leading-[1.02] font-bold tracking-tight text-slate-950 sm:mt-4 sm:h-[5.4rem] sm:text-[2rem] sm:leading-tight">
            {title}
          </h3>
          <p className="mt-1.5 h-[3.1rem] overflow-hidden text-[0.7rem] leading-[1.35] text-muted-strong sm:mt-3 sm:h-[5.15rem] sm:text-sm sm:leading-7">
            {description ??
              "Atendimento com agenda publicada, apresentação clara e fluxo rápido de contratação."}
          </p>
          {duration || location ? (
            <div className="mt-2.5 h-[2.1rem] overflow-hidden text-[0.66rem] leading-[1.2] text-muted-strong sm:mt-4 sm:h-6 sm:text-sm">
              <div className="grid grid-cols-1 gap-1 sm:flex sm:flex-wrap sm:gap-3">
              {duration ? (
                <span className="inline-flex items-center gap-2 whitespace-nowrap">
                  <Clock3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {duration}
                </span>
              ) : null}
              {location ? (
                <span className="inline-flex items-center gap-2 whitespace-nowrap">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {location}
                </span>
              ) : null}
              </div>
            </div>
          ) : null}
          <div className="mt-auto flex items-end justify-between gap-2 pt-3 sm:gap-4 sm:pt-6">
            <div className="min-w-0">
              <p className="text-[9px] font-semibold tracking-[0.14em] text-muted uppercase sm:text-xs sm:tracking-[0.18em]">
                A partir de
              </p>
              <p className="text-[0.98rem] leading-none font-bold text-slate-950 sm:text-3xl">
                {price}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-linear-to-r from-primary-strong via-primary to-[#7c83ff] px-2.5 py-1.5 text-[0.72rem] font-semibold text-white shadow-[0_14px_28px_rgba(99,102,241,0.28)] sm:gap-2 sm:px-5 sm:py-3 sm:text-sm">
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
