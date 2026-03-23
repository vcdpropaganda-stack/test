"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { InputField, SelectField } from "@/components/ui/input";

type MobileFiltersSheetProps = {
  q: string;
  city: string;
  category: string;
  sort: "recent" | "price_asc" | "price_desc";
  cities: string[];
  categories: Array<{ slug: string; name: string }>;
  onApply?: (next: {
    q: string;
    city: string;
    category: string;
    sort: "recent" | "price_asc" | "price_desc";
  }) => void;
};

export function MobileFiltersSheet({
  q,
  city,
  category,
  sort,
  cities,
  categories,
  onApply,
}: MobileFiltersSheetProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const original = document.body.style.overflow;

    if (open) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!onApply) {
      return;
    }

    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onApply({
      q: String(formData.get("q") ?? ""),
      city: String(formData.get("city") ?? ""),
      category: String(formData.get("category") ?? ""),
      sort: (String(formData.get("sort") ?? "recent") as
        | "recent"
        | "price_asc"
        | "price_desc"),
    });
    setOpen(false);
  }

  return (
    <div className="sm:hidden">
      <div className="rounded-[1.5rem] border border-slate-200 bg-white/92 p-3 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
            <div className="line-clamp-1 rounded-full border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-9 text-sm text-muted-strong">
              {q || "Buscar serviços"}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-950 shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
          >
            <SlidersHorizontal className="h-4 w-4 text-primary-strong" />
            Filtros
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[70]">
          <button
            type="button"
            aria-label="Fechar filtros"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
          />
          <div className="absolute inset-x-3 bottom-3 max-h-[85vh] overflow-y-auto rounded-[1.8rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] p-4 shadow-[0_28px_90px_rgba(15,23,42,0.24)] backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.72rem] font-semibold tracking-[0.22em] uppercase text-primary-strong/75">
                  Refinar busca
                </p>
                <p className="mt-1 text-lg font-bold tracking-tight text-slate-950">
                  Filtros do marketplace
                </p>
              </div>
              <button
                type="button"
                aria-label="Fechar filtros"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-[1.15rem] border border-slate-200 bg-white/90 text-slate-950 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="mt-4 grid gap-4" onSubmit={handleSubmit}>
              <div className="relative">
                <InputField
                  name="q"
                  label="Buscar"
                  defaultValue={q}
                  placeholder="Nome do serviço ou descrição"
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

              <button
                type="submit"
                className="min-h-11 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(99,102,241,0.28)]"
              >
                Aplicar filtros
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
