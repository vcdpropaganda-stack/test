"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock3, MapPin, Search } from "lucide-react";

type SearchResult = {
  id: string;
  slug: string;
  title: string;
  provider: string;
  city: string | null;
  price: string;
  duration: string;
  imageUrl: string | null;
};

type HeroSearchProps = {
  initialResults: SearchResult[];
  variant?: "dark" | "light";
};

export function HeroSearch({
  initialResults,
  variant = "dark",
}: HeroSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>(initialResults);
  const [isLoading, setIsLoading] = useState(false);

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;

  useEffect(() => {
    if (!hasQuery) {
      setResults(initialResults);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/services/search?q=${encodeURIComponent(trimmedQuery)}`,
          { signal: controller.signal }
        );
        const data = (await response.json()) as { results?: SearchResult[] };
        setResults(data.results ?? []);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [trimmedQuery, hasQuery, initialResults]);

  const emptyMessage = useMemo(() => {
    if (!hasQuery) {
      return "Os anúncios em destaque aparecem aqui automaticamente.";
    }

    return `Nenhum serviço encontrado para “${trimmedQuery}”.`;
  }, [hasQuery, trimmedQuery]);

  const isLight = variant === "light";

  return (
    <div
      className={
        isLight
          ? "relative rounded-[2rem] border border-slate-200/80 bg-white/92 p-3 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-md sm:p-4"
          : "relative mt-7 rounded-[2rem] border border-white/10 bg-white/8 p-4 backdrop-blur-md"
      }
    >
      <label
        className={
          isLight
            ? "flex items-center gap-3 rounded-[1.75rem] border border-slate-200 bg-white px-5 py-4 text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
            : "flex items-center gap-3 rounded-2xl border border-white/10 bg-white px-4 py-3 text-slate-500 shadow-lg shadow-slate-950/10"
        }
      >
        <Search className="h-4 w-4 shrink-0" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar limpeza, beleza, manutenção..."
          className="w-full bg-transparent text-base text-slate-700 outline-none placeholder:text-slate-500"
          aria-label="Buscar serviços"
        />
      </label>

      {!hasQuery ? (
        <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p
            className={
              isLight
                ? "text-sm font-semibold tracking-[0.18em] text-slate-700 uppercase"
                : "text-sm font-semibold tracking-[0.18em] text-slate-200 uppercase"
            }
          >
            Anúncios em destaque
          </p>
          <p
            className={
              isLight ? "text-sm text-slate-500" : "text-sm text-slate-300"
            }
          >
            Clique em um card para abrir a página do serviço
          </p>
        </div>
      ) : null}

      <div className="mt-4 grid gap-3">
        {results.length > 0 ? (
          results.map((service) => (
            <Link
              key={service.id}
              href={`/servicos/${service.slug}`}
              className={
                isLight
                  ? "grid grid-cols-[5rem_1fr] gap-4 rounded-[1.6rem] border border-slate-200 bg-white p-3.5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:border-primary/30 hover:shadow-[0_18px_40px_rgba(99,102,241,0.12)]"
                  : "grid grid-cols-[5.5rem_1fr] gap-4 rounded-[1.6rem] border border-white/10 bg-white/9 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:bg-white/13"
              }
            >
              <div
                className={
                  isLight
                    ? "relative overflow-hidden rounded-2xl bg-slate-100"
                    : "relative overflow-hidden rounded-2xl bg-white/10"
                }
              >
                {service.imageUrl ? (
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={
                      isLight
                        ? "rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-strong"
                        : "rounded-full bg-accent/18 px-3 py-1 text-xs font-semibold text-amber-300"
                    }
                  >
                    {hasQuery ? "Resultado" : "Em destaque"}
                  </span>
                  <span
                    className={
                      isLight
                        ? "inline-flex items-center gap-1 text-sm font-medium text-slate-500"
                        : "inline-flex items-center gap-1 text-sm font-medium text-slate-200"
                    }
                  >
                    <Clock3 className="h-3.5 w-3.5" />
                    {service.duration}
                  </span>
                </div>
                <p
                  className={
                    isLight
                      ? "mt-3 text-lg font-semibold leading-tight text-slate-950"
                      : "mt-3 text-lg font-semibold leading-tight text-white"
                  }
                >
                  {service.title}
                </p>
                <p
                  className={
                    isLight ? "mt-1 text-sm text-slate-500" : "mt-1 text-sm text-slate-300"
                  }
                >
                  {service.provider}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                  <span
                    className={
                      isLight ? "font-semibold text-slate-950" : "font-semibold text-white"
                    }
                  >
                    {service.price}
                  </span>
                  <span
                    className={
                      isLight
                        ? "inline-flex items-center gap-1 text-slate-500"
                        : "inline-flex items-center gap-1 text-slate-200"
                    }
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    {service.city ?? "Atendimento local"}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div
            className={
              isLight
                ? "rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600"
                : "rounded-2xl border border-white/10 bg-white/8 p-4 text-sm text-slate-300"
            }
          >
            {emptyMessage}
          </div>
        )}
      </div>

      {isLoading ? (
        <p
          className={
            isLight
              ? "mt-3 text-xs font-medium tracking-[0.16em] text-slate-500 uppercase"
              : "mt-3 text-xs font-medium tracking-[0.16em] text-slate-400 uppercase"
          }
        >
          Buscando serviços...
        </p>
      ) : null}
    </div>
  );
}
