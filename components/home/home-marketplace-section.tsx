import Link from "next/link";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceCard } from "@/components/marketplace/service-card";
import { Button } from "@/components/ui/button";
import { formatPrice, getServiceTag, type MarketplaceService } from "@/lib/marketplace";

type HomeMarketplaceSectionProps = {
  services: MarketplaceService[];
};

export function HomeMarketplaceSection({
  services,
}: HomeMarketplaceSectionProps) {
  return (
    <section className="page-shell py-18">
      <SectionHeading
        eyebrow="Marketplace"
        title="Serviços reais publicados no marketplace"
        description="A vitrine principal agora lê os anúncios ativos do banco e já funciona como base da descoberta pública."
      />
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
        {services.length > 0 ? (
          services.map((service) => (
            <ServiceCard
              key={service.id}
              href={`/servicos/${service.slug}`}
              title={service.title}
              provider={service.provider_profile?.display_name ?? "Prestador Vitrine Lojas"}
              price={formatPrice(service.price_cents)}
              tag={getServiceTag(service)}
              imageUrl={service.cover_image_url}
              description={service.description}
              rating={service.average_rating}
              reviewsCount={service.reviews_count}
              duration={`${service.duration_minutes} min`}
              location={
                service.provider_profile?.city
                  ? `${service.provider_profile.city}${service.provider_profile.state ? `, ${service.provider_profile.state}` : ""}`
                  : null
              }
            />
          ))
        ) : (
          <div className="lg:col-span-3 rounded-[2rem] border border-dashed border-border bg-white p-8">
            <p className="text-lg font-semibold text-slate-950">
              Ainda não existem serviços ativos para exibir.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-strong">
              Entre como prestador e publique os primeiros serviços para a
              vitrine ganhar vida.
            </p>
          </div>
        )}
      </div>
      <div className="mt-8">
        <Link href="/servicos" prefetch className="inline-flex">
          <Button variant="secondary">Explorar todos os serviços</Button>
        </Link>
      </div>
    </section>
  );
}
