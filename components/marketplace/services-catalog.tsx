"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Layers3, Search, SlidersHorizontal } from "lucide-react";
import { MobileFiltersSheet } from "@/components/marketplace/mobile-filters-sheet";
import { ServiceCard } from "@/components/marketplace/service-card";
import {
  type MarketplaceService,
  formatPrice,
  getServiceTag,
} from "@/lib/marketplace";

type SortOption = "recent" | "price_asc" | "price_desc";

type ServicesCatalogProps = {
  services: MarketplaceService[];
  cities: string[];
  categories: Array<{ slug: string; name: string }>;
};

type FilterState = {
  q: string;
  city: string;
  category: string;
  sort: SortOption;
};

const defaultFilters: FilterState = {
  q: "",
  city: "",
  category: "",
  sort: "recent",
};

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function ServicesCatalog({
  services,
  cities,
  categories,
}: ServicesCatalogProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentFilters: FilterState = {
    q: searchParams.get("q") ?? "",
    city: searchParams.get("city") ?? "",
    category: searchParams.get("category") ?? "",
    sort:
      (searchParams.get("sort") as SortOption | null) === "price_asc" ||
      (searchParams.get("sort") as SortOption | null) === "price_desc"
        ? (searchParams.get("sort") as SortOption)
        : "recent",
  };

  const [draftFilters, setDraftFilters] = useState<FilterState>(currentFilters);

  useEffect(() => {
    setDraftFilters(currentFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const normalizedQuery = normalizeText(currentFilters.q.trim());
  const filteredServices = services.filter((service) => {
    if (currentFilters.city && service.provider_profile?.city !== currentFilters.city) {
      return false;
    }

    if (currentFilters.category && service.category?.slug !== currentFilters.category) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = normalizeText(
      [
        service.title,
        service.description,
        service.provider_profile?.display_name ?? "",
        service.category?.name ?? "",
        service.provider_profile?.city ?? "",
      ].join(" ")
    );

    return haystack.includes(normalizedQuery);
  });

  const orderedServices = [...filteredServices].sort((left, right) => {
    if (currentFilters.sort === "price_asc") {
      return left.price_cents - right.price_cents;
    }

    if (currentFilters.sort === "price_desc") {
      return right.price_cents - left.price_cents;
    }

    return (
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
    );
  });

  function buildUrl(next: FilterState) {
    const params = new URLSearchParams();

    if (next.q.trim()) {
      params.set("q", next.q.trim());
    }

    if (next.city) {
      params.set("city", next.city);
    }

    if (next.category) {
      params.set("category", next.category);
    }

    if (next.sort !== "recent") {
      params.set("sort", next.sort);
    }

    return `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
  }

  function applyFilters(next: FilterState) {
    router.push(buildUrl(next), { scroll: false });
  }

  function handleDesktopSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applyFilters(draftFilters);
  }

  const appliedFilters = [
    currentFilters.q
      ? { key: "q", label: `Busca: "${currentFilters.q}"` }
      : null,
    currentFilters.city
      ? { key: "city", label: currentFilters.city }
      : null,
    currentFilters.category
      ? {
          key: "category",
          label:
            categories.find((category) => category.slug === currentFilters.category)
              ?.name ?? currentFilters.category,
        }
      : null,
  ].filter((value): value is { key: string; label: string } => Boolean(value));

  return (
    <main id="conteudo" className="page-shell py-8 sm:py-12">
      <section
        data-reveal
        className="overflow-hidden rounded-[1.35rem] border border-slate-200 bg-[linear-gradient(135deg,#0f172a,#312e81_58%,#6366f1)] px-4 py-4 text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:rounded-[2rem] sm:px-8 sm:py-8"
      >
        <p className="text-[0.68rem] font-semibold tracking-[0.26em] uppercase text-white/72">
          Marketplace
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-3xl">
            <h1 className="text-[1.45rem] leading-[1.06] font-bold tracking-tight text-white sm:text-[2.2rem]">
              Serviços com busca rápida e filtros laterais
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/82 sm:text-base">
              Navegação otimizada para encontrar o anúncio ideal com menos cliques.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm sm:px-4 sm:py-2">
              {orderedServices.length} resultados
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm sm:px-4 sm:py-2">
              {categories.length} categorias
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm sm:px-4 sm:py-2">
              {cities.length} cidades
            </span>
          </div>
        </div>
      </section>

      <div className="mt-6 grid items-start gap-5 lg:mt-8 lg:grid-cols-[20.5rem_minmax(0,1fr)] lg:gap-6">
        <aside className="hidden lg:block lg:sticky lg:top-28">
          <section
            data-reveal
            data-reveal-delay="70"
            className="elevated-card rounded-[1.5rem] border border-border bg-white p-4"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-primary-soft p-2.5 text-primary-strong">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">Filtros aplicados</p>
                <p className="text-xs leading-5 text-muted-strong">
                  Refine a busca no estilo lateral.
                </p>
              </div>
            </div>

            <div className="mb-4 min-h-7">
              {appliedFilters.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {appliedFilters.map((filter) => {
                    const next = { ...currentFilters, [filter.key]: "" };
                    return (
                      <button
                        key={filter.key}
                        type="button"
                        onClick={() => applyFilters(next)}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-primary/30 hover:text-primary-strong"
                      >
                        {filter.label} ×
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-strong">Nenhum filtro ativo.</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setDraftFilters(defaultFilters);
                applyFilters(defaultFilters);
              }}
              className="mb-5 text-xs font-semibold text-primary-strong underline-offset-2 hover:underline"
            >
              Limpar todos
            </button>

            <form className="grid gap-4" onSubmit={handleDesktopSubmit}>
              <div>
                <label
                  htmlFor="services-filter-query"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  Buscar
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    id="services-filter-query"
                    name="q"
                    type="search"
                    value={draftFilters.q}
                    onChange={(event) =>
                      setDraftFilters((current) => ({
                        ...current,
                        q: event.target.value,
                      }))
                    }
                    placeholder="Nome do serviço ou descrição"
                    className="w-full rounded-2xl border border-border bg-surface py-3 pr-4 pl-10 text-sm text-slate-950 placeholder:text-muted outline-none hover:border-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="services-filter-category"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  Categoria
                </label>
                <select
                  id="services-filter-category"
                  name="category"
                  value={draftFilters.category}
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-slate-950 outline-none hover:border-primary/30 focus:border-primary"
                >
                  <option value="">Todas as categorias</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="services-filter-city"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  Cidade
                </label>
                <select
                  id="services-filter-city"
                  name="city"
                  value={draftFilters.city}
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      city: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-slate-950 outline-none hover:border-primary/30 focus:border-primary"
                >
                  <option value="">Todas as cidades</option>
                  {cities.map((currentCity) => (
                    <option key={currentCity} value={currentCity}>
                      {currentCity}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="services-filter-sort"
                  className="mb-2 block text-sm font-medium text-slate-800"
                >
                  Ordenar
                </label>
                <select
                  id="services-filter-sort"
                  name="sort"
                  value={draftFilters.sort}
                  onChange={(event) =>
                    setDraftFilters((current) => ({
                      ...current,
                      sort: event.target.value as SortOption,
                    }))
                  }
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-slate-950 outline-none hover:border-primary/30 focus:border-primary"
                >
                  <option value="recent">Mais recentes</option>
                  <option value="price_asc">Menor preço</option>
                  <option value="price_desc">Maior preço</option>
                </select>
              </div>

              <button className="min-h-11 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(99,102,241,0.24)] transition hover:bg-primary-strong">
                Aplicar filtros
              </button>
            </form>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Categorias rápidas
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const isActive = currentFilters.category === category.slug;
                  return (
                    <button
                      key={category.slug}
                      type="button"
                      onClick={() =>
                        applyFilters({
                          ...currentFilters,
                          category: isActive ? "" : category.slug,
                        })
                      }
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                        isActive
                          ? "bg-primary text-white"
                          : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-primary/30 hover:text-primary-strong"
                      }`}
                    >
                      <Layers3 className="h-3.5 w-3.5" />
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </aside>

        <section className="min-w-0">
          <div className="lg:hidden">
            <MobileFiltersSheet
              q={currentFilters.q}
              city={currentFilters.city}
              category={currentFilters.category}
              sort={currentFilters.sort}
              cities={cities}
              categories={categories}
              onApply={applyFilters}
            />
          </div>

          <div className="mt-4 hidden items-center justify-between rounded-[1.25rem] border border-border bg-white px-4 py-3 lg:flex">
            <p className="text-sm font-medium text-slate-700">
              <span className="font-semibold text-slate-950">
                {orderedServices.length}
              </span>{" "}
              anúncio{orderedServices.length === 1 ? "" : "s"} encontrado
              {orderedServices.length === 1 ? "" : "s"}
            </p>
            <div className="flex items-center gap-2">
              <label
                htmlFor="services-top-sort"
                className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase"
              >
                Ordenar
              </label>
              <select
                id="services-top-sort"
                value={currentFilters.sort}
                onChange={(event) =>
                  applyFilters({
                    ...currentFilters,
                    sort: event.target.value as SortOption,
                  })
                }
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 outline-none hover:border-primary/30 focus:border-primary"
              >
                <option value="recent">Mais recentes</option>
                <option value="price_asc">Menor preço</option>
                <option value="price_desc">Maior preço</option>
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-4 lg:grid-cols-3 lg:gap-5">
            {orderedServices.length > 0 ? (
              orderedServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  href={`/servicos/${service.slug}`}
                  title={service.title}
                  provider={
                    service.provider_profile?.display_name ??
                    "Prestador Vitrine Lojas"
                  }
                  price={formatPrice(service.price_cents)}
                  tag={getServiceTag(service)}
                  imageUrl={service.cover_image_url}
                  description={service.description}
                  rating={service.average_rating}
                  reviewsCount={service.reviews_count}
                  duration={`${service.duration_minutes} min`}
                  location={
                    service.provider_profile?.city
                      ? `${service.provider_profile.city}${
                          service.provider_profile.state
                            ? `, ${service.provider_profile.state}`
                            : ""
                        }`
                      : null
                  }
                />
              ))
            ) : (
              <div className="col-span-2 rounded-[1.6rem] border border-dashed border-border bg-white p-6 lg:col-span-3">
                <p className="text-lg font-semibold text-slate-950">
                  Nenhum serviço encontrado com esses filtros.
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-strong">
                  Ajuste os critérios de busca para ampliar os resultados.
                </p>
                <div className="mt-5">
                  <Link
                    href="/servicos"
                    className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-primary/30 hover:text-primary-strong"
                  >
                    Limpar filtros
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
