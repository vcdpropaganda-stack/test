import type { Metadata } from "next";
import { Search } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { InputField, SelectField } from "@/components/ui/input";
import { ServiceCard } from "@/components/marketplace/service-card";
import {
  formatPrice,
  getMarketplaceCities,
  getMarketplaceServices,
  getServiceTag,
} from "@/lib/marketplace";

export const metadata: Metadata = {
  title: "Servicos | Vitrine Lojas",
  description:
    "Explore os servicos publicados no marketplace Vitrine Lojas.",
};

type ServicesPageProps = {
  searchParams: Promise<{
    q?: string;
    city?: string;
    sort?: "recent" | "price_asc" | "price_desc";
  }>;
};

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const { q = "", city = "", sort = "recent" } = await searchParams;
  const [services, cities] = await Promise.all([
    getMarketplaceServices({
      query: q || undefined,
      city: city || undefined,
      sort,
    }),
    getMarketplaceCities(),
  ]);

  return (
    <main id="conteudo" className="page-shell py-16">
      <SectionHeading
        eyebrow="Marketplace"
        title="Todos os servicos publicados"
        description="Uma listagem publica pronta para crescer com filtros, busca e experiencia de descoberta mais profunda."
      />

      <section className="elevated-card mt-10 rounded-[2rem] border border-border bg-white p-6">
        <form className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr_auto] lg:items-end">
          <div className="relative">
            <InputField
              name="q"
              label="Buscar"
              defaultValue={q}
              placeholder="Busque por nome do servico ou descricao"
              className="pl-11"
            />
            <Search className="pointer-events-none absolute top-[47px] left-4 h-4 w-4 text-muted" />
          </div>

          <SelectField name="city" label="Cidade" defaultValue={city}>
            <option value="">Todas as cidades</option>
            {cities.map((currentCity) => (
              <option key={currentCity} value={currentCity}>
                {currentCity}
              </option>
            ))}
          </SelectField>

          <SelectField name="sort" label="Ordenar" defaultValue={sort}>
            <option value="recent">Mais recentes</option>
            <option value="price_asc">Menor preco</option>
            <option value="price_desc">Maior preco</option>
          </SelectField>

          <button className="min-h-11 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-strong">
            Aplicar filtros
          </button>
        </form>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {services.length > 0 ? (
          services.map((service) => (
            <ServiceCard
              key={service.id}
              href={`/servicos/${service.slug}`}
              title={service.title}
              provider={service.provider_profile?.display_name ?? "Prestador Vitrine Lojas"}
              price={formatPrice(service.price_cents)}
              tag={getServiceTag(service)}
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
              Nenhum servico encontrado com esses filtros.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-strong">
              Ajuste os criterios ou aguarde novos servicos publicados.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
