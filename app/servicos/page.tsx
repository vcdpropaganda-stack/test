import type { Metadata } from "next";
import { Layers3, Search, SlidersHorizontal } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { InputField, SelectField } from "@/components/ui/input";
import { ServiceCard } from "@/components/marketplace/service-card";
import {
  getMarketplaceCategories,
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
    category?: string;
    sort?: "recent" | "price_asc" | "price_desc";
  }>;
};

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const { q = "", city = "", category = "", sort = "recent" } = await searchParams;
  const [services, cities, categories] = await Promise.all([
    getMarketplaceServices({
      query: q || undefined,
      city: city || undefined,
      category: category || undefined,
      sort,
    }),
    getMarketplaceCities(),
    getMarketplaceCategories(),
  ]);

  return (
    <main id="conteudo" className="page-shell py-16">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#0f172a,#312e81_58%,#6366f1)] px-8 py-10 text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
        <SectionHeading
          eyebrow="Marketplace"
          title="Todos os servicos publicados"
          description="Descubra servicos com imagem real, reputacao visivel, agenda pronta e apresentacao muito mais clara para conversao."
          invert
        />
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
            {services.length} servicos ativos
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
            {categories.length} categorias
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
            {cities.length} cidades mapeadas
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
            Clique em qualquer card para abrir a pagina do servico
          </span>
        </div>
      </section>

      <section className="elevated-card mt-10 rounded-[2rem] border border-border bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-primary-soft p-3 text-primary-strong">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">Filtros do marketplace</p>
            <p className="text-sm text-muted-strong">
              Refine por busca, categoria, cidade e ordenacao.
            </p>
          </div>
        </div>
        <form className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto] lg:items-end">
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

          <SelectField name="category" label="Categoria" defaultValue={category}>
            <option value="">Todas as categorias</option>
            {categories.map((currentCategory) => (
              <option key={currentCategory.slug} value={currentCategory.slug}>
                {currentCategory.name}
              </option>
            ))}
          </SelectField>

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
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((currentCategory) => {
            const isActive = currentCategory.slug === category;
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            if (city) params.set("city", city);
            if (sort) params.set("sort", sort);
            if (!isActive) params.set("category", currentCategory.slug);

            return (
              <a
                key={currentCategory.slug}
                href={`/servicos${params.toString() ? `?${params.toString()}` : ""}`}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                  isActive
                    ? "bg-slate-950 text-white"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-primary/30 hover:text-primary-strong"
                }`}
              >
                <Layers3 className="h-4 w-4" />
                {currentCategory.name}
              </a>
            );
          })}
        </div>
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
