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
  title: "Serviços | Vitrine Lojas",
  description:
    "Explore os serviços publicados no marketplace Vitrine Lojas.",
};

export const revalidate = 180;

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
    <main id="conteudo" className="page-shell py-10 sm:py-16">
      <section
        data-reveal
        className="overflow-hidden rounded-[1.35rem] border border-slate-200 bg-[linear-gradient(135deg,#0f172a,#312e81_58%,#6366f1)] px-4 py-4 text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:rounded-[2rem] sm:px-8 sm:py-10"
      >
        <div className="sm:hidden">
          <p className="text-[0.68rem] font-semibold tracking-[0.26em] uppercase text-white/72">
            Marketplace
          </p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-[1.45rem] leading-[1.04] font-bold tracking-tight text-white">
                Todos os serviços
              </h1>
              <p className="mt-1 text-sm leading-5 text-white/78">
                Explore e abra o anúncio ideal.
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[0.72rem] font-semibold text-white backdrop-blur-sm">
              {services.length} ativos
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-[0.68rem]">
            <span className="rounded-2xl border border-white/12 bg-white/10 px-2.5 py-2 text-center text-white/88 backdrop-blur-sm">
              {categories.length} categorias
            </span>
            <span className="rounded-2xl border border-white/12 bg-white/10 px-2.5 py-2 text-center text-white/88 backdrop-blur-sm">
              {cities.length} cidades
            </span>
            <span className="rounded-2xl border border-white/12 bg-white/10 px-2.5 py-2 text-center text-white/88 backdrop-blur-sm">
              Abra um card
            </span>
          </div>
        </div>

        <div className="hidden sm:block">
          <SectionHeading
            eyebrow="Marketplace"
            title="Todos os serviços publicados"
            description="Descubra serviços com imagem real, reputação visível, agenda pronta e apresentação muito mais clara para conversão."
            invert
          />
        </div>

        <div className="mt-5 hidden flex-wrap gap-2 text-xs sm:mt-6 sm:flex sm:gap-3 sm:text-sm">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm sm:px-4 sm:py-2">
            {services.length} serviços ativos
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm sm:px-4 sm:py-2">
            {categories.length} categorias
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm sm:px-4 sm:py-2">
            {cities.length} cidades mapeadas
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm sm:px-4 sm:py-2">
            Clique em qualquer card para abrir a página do serviço
          </span>
        </div>
      </section>

      <section
        data-reveal
        data-reveal-delay="70"
        className="elevated-card mt-6 rounded-[1.6rem] border border-border bg-white p-4 sm:mt-10 sm:rounded-[2rem] sm:p-6"
      >
        <div className="mb-5 flex items-center gap-3 sm:mb-6">
          <div className="rounded-2xl bg-primary-soft p-2.5 text-primary-strong sm:p-3">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">Filtros do marketplace</p>
            <p className="text-xs leading-5 text-muted-strong sm:text-sm">
              Refine por busca, categoria, cidade e ordenação.
            </p>
          </div>
        </div>
        <form className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto] lg:items-end">
          <div className="relative">
            <InputField
              name="q"
              label="Buscar"
              defaultValue={q}
              placeholder="Busque por nome do serviço ou descrição"
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
            <option value="price_asc">Menor preço</option>
            <option value="price_desc">Maior preço</option>
          </SelectField>

          <button className="min-h-11 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-strong">
            Aplicar filtros
          </button>
        </form>
        <div className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
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
                className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm ${
                  isActive
                    ? "bg-primary text-white"
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

      <div className="mt-6 grid grid-cols-1 gap-4 min-[430px]:grid-cols-2 sm:mt-10 sm:gap-4 lg:grid-cols-3 lg:gap-6">
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
              Nenhum serviço encontrado com esses filtros.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-strong">
              Ajuste os critérios ou aguarde novos serviços publicados.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
