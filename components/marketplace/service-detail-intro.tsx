import Image from "next/image";
import { BadgeCheck, Star } from "lucide-react";

type ServiceDetailIntroProps = {
  title: string;
  description: string;
  categoryName: string;
  providerName: string;
  averageRating: number | null | undefined;
  reviewsCount: number | undefined;
  location: string;
  imageUrl: string | null;
  galleryItems: Array<{ id: string; title: string }>;
};

export function ServiceDetailIntro({
  title,
  description,
  categoryName,
  providerName,
  averageRating,
  reviewsCount,
  location,
  imageUrl,
  galleryItems,
}: ServiceDetailIntroProps) {
  return (
    <>
      <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:hidden">
        <div className="relative aspect-[1.04] bg-slate-950">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/76 via-slate-950/18 to-transparent" />
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:rounded-[2rem] sm:p-8">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-strong">
          <span className="rounded-full bg-primary-soft px-3 py-1 font-semibold text-primary-strong">
            {categoryName}
          </span>
          <span className="inline-flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-emerald-500" />
            Prestador verificado no marketplace
          </span>
        </div>
        <h1 className="mt-4 max-w-4xl font-sans text-[2.2rem] leading-[0.96] font-bold tracking-[-0.04em] text-slate-950 sm:mt-5 sm:text-5xl sm:leading-tight sm:tracking-tight">
          {title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-strong sm:mt-6 sm:gap-x-6 sm:gap-y-3">
          <span className="font-semibold text-slate-950">{providerName}</span>
          <span className="inline-flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {averageRating ? `${averageRating.toFixed(1)} de média` : "Novo perfil"}
          </span>
          <span>{reviewsCount ?? 0} avaliações</span>
          <span>{location}</span>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:block sm:rounded-[2rem]">
        <div className="relative aspect-[1.05/1] bg-slate-950 sm:aspect-[16/10]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 hidden p-8 text-white sm:block">
            <p className="text-sm font-semibold tracking-[0.22em] text-indigo-100 uppercase">
              Serviço
            </p>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200">
              {description}
            </p>
          </div>
        </div>
        <div className="border-t border-slate-200 p-5 sm:hidden">
          <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-primary uppercase">
            Serviço
          </p>
          <p className="mt-3 text-base leading-7 text-muted-strong">{description}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 border-t border-slate-200 p-3 sm:gap-3 sm:p-5">
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              className={`relative aspect-[1.2/1] overflow-hidden rounded-[1rem] border sm:rounded-2xl ${
                index === 0 ? "border-slate-950 shadow-sm" : "border-slate-200"
              } bg-slate-100`}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 20vw, 120px"
                  className="object-cover"
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
