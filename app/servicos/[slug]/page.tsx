import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { AvailabilityCalendar } from "@/components/marketplace/availability-calendar";
import { ServiceDetailHighlights } from "@/components/marketplace/service-detail-highlights";
import { ServiceDetailIntro } from "@/components/marketplace/service-detail-intro";
import { ServiceDetailReviews } from "@/components/marketplace/service-detail-reviews";
import { ServiceDetailSidebar } from "@/components/marketplace/service-detail-sidebar";
import { QueryNotice } from "@/components/shared/query-notice";
import {
  getMarketplaceServiceBySlug,
  getMarketplaceServiceMetaBySlug,
  getMarketplacePreviewSlugs,
} from "@/lib/marketplace";

type ServiceDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 120;
export const dynamicParams = true;

function humanizeSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateStaticParams() {
  const slugs = await getMarketplacePreviewSlugs(8);

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getMarketplaceServiceMetaBySlug(slug);

  if (!service) {
    return {
      title: `${humanizeSlug(slug)} | Vitrine Lojas`,
      description:
        "Detalhes do serviço no marketplace Vitrine Lojas.",
    };
  }

  return {
    title: `${service.title} | Vitrine Lojas`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getMarketplaceServiceBySlug(slug);

  if (!service) {
    return (
      <main id="conteudo" className="page-shell py-16">
        <div className="mb-6">
          <Link
            href="/servicos"
            className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:border-primary/30 hover:text-primary-strong"
          >
            Voltar para o marketplace
          </Link>
        </div>
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
            Serviço
          </p>
          <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-slate-950">
            {humanizeSlug(slug)}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-strong">
            Esta página do serviço ainda não carregou todos os dados públicos,
            mas o caminho já existe e continua reservado no marketplace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/servicos"
              className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-strong"
            >
              Ver todos os serviços
            </Link>
            <Link
              href="/contato"
              className="inline-flex rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:border-primary/30 hover:text-primary-strong"
            >
              Solicitar atendimento
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const location = service.provider_profile?.city
    ? `${service.provider_profile.city}${service.provider_profile.state ? `, ${service.provider_profile.state}` : ""}`
    : "Atendimento local";
  const galleryItems = Array.from({ length: 3 }, (_, index) => ({
    id: `${service.id}-${index}`,
    title:
      index === 0
        ? "Capa principal"
        : index === 1
          ? "Aplicação do serviço"
          : "Resultado entregue",
  }));
  const availability =
    (service.availability ?? [])
      .filter((slot) => slot.is_available)
      .filter(
        (slot) =>
          !(service.booked_slots ?? []).some(
            (booking) =>
              booking.scheduled_start === slot.start_at &&
              booking.scheduled_end === slot.end_at
          )
      )
      .sort(
        (a, b) =>
          new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
      ) ?? [];
  const reviewHighlights = [
    "Atendimento profissional, com comunicação clara do início ao fim.",
    "Entrega com boa percepção de valor e apresentação bem resolvida.",
    "Fluxo pensado para reduzir dúvidas e acelerar a contratação.",
  ];

  return (
    <main id="conteudo" className="page-shell py-8 sm:py-10 lg:py-16">
      <div className="mb-6">
        <Link
          href="/servicos"
          className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:border-primary/30 hover:text-primary-strong"
        >
          Voltar para o marketplace
        </Link>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
        <section className="space-y-6">
          <ServiceDetailIntro
            title={service.title}
            description={service.description}
            categoryName={service.category?.name ?? "Serviço"}
            providerName={service.provider_profile?.display_name ?? "Prestador Vitrine Lojas"}
            averageRating={service.average_rating}
            reviewsCount={service.reviews_count}
            location={location}
            imageUrl={service.cover_image_url}
            galleryItems={galleryItems}
          />

          <ServiceDetailHighlights
            reviewsCount={service.reviews_count}
            reviews={service.reviews}
            reviewHighlights={reviewHighlights}
          />

          <div
            id="agenda"
            className="rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:rounded-[2rem] sm:p-8"
          >
            <h2 className="font-sans text-[1.9rem] leading-tight font-bold tracking-[-0.03em] text-slate-950 sm:text-2xl sm:tracking-tight">
              Datas e horários disponíveis
            </h2>
            <Suspense fallback={null}>
              <div className="mt-5">
                <QueryNotice />
              </div>
            </Suspense>
            <div className="mt-6">
              {availability.length > 0 ? (
                <AvailabilityCalendar
                  slug={service.slug}
                  serviceId={service.id}
                  providerProfileId={service.provider_profile?.id ?? ""}
                  totalPriceCents={service.price_cents}
                  availability={service.availability ?? []}
                  bookedSlots={service.booked_slots ?? []}
                />
              ) : (
                <p className="text-sm leading-7 text-muted-strong">
                  Este serviço ainda não tem horários publicados. Assim que o
                  prestador configurar a agenda, os slots aparecerão aqui.
                </p>
              )}
            </div>
          </div>
        </section>

        <ServiceDetailSidebar
          priceCents={service.price_cents}
          durationMinutes={service.duration_minutes}
          availabilityCount={availability.length}
          providerName={service.provider_profile?.display_name ?? "Prestador Vitrine Lojas"}
          providerBio={service.provider_profile?.bio}
          providerPlan={service.provider_profile?.plan}
          averageRating={service.average_rating}
          reviewsCount={service.reviews_count}
          location={location}
        />
      </div>

      <ServiceDetailReviews reviews={service.reviews} />
    </main>
  );
}
