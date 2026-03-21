"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { FaqGroup } from "@/content/faq";

type FaqBrowserProps = {
  groups: FaqGroup[];
};

export function FaqBrowser({ groups }: FaqBrowserProps) {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<string>("Todas");

  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return groups
      .filter((group) => activeGroup === "Todas" || group.title === activeGroup)
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (!normalizedQuery) {
            return true;
          }

          return (
            item.question.toLowerCase().includes(normalizedQuery) ||
            item.answer.toLowerCase().includes(normalizedQuery)
          );
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [activeGroup, groups, query]);

  const totalQuestions = filteredGroups.reduce((acc, group) => acc + group.items.length, 0);

  return (
    <>
      <section className="mx-auto mt-8 max-w-5xl">
        <div className="rounded-[1.6rem] border border-border bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busque por cadastro, agenda, serviço, pagamento..."
              className="w-full rounded-full border border-border bg-surface py-3 pr-4 pl-11 text-sm text-slate-950 outline-none hover:border-primary/30 focus:border-primary"
              aria-label="Buscar perguntas frequentes"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Todas", ...groups.map((group) => group.title)].map((title) => (
              <button
                key={title}
                type="button"
                onClick={() => setActiveGroup(title)}
                className={`rounded-full px-3 py-2 text-xs font-semibold sm:text-sm ${
                  activeGroup === title
                    ? "bg-primary text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-primary/30 hover:text-primary-strong"
                }`}
              >
                {title}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-strong sm:text-sm">
            <span className="rounded-full bg-primary-soft px-3 py-1.5 font-semibold text-primary-strong">
              {totalQuestions} perguntas visíveis
            </span>
            <Link href="/ajuda" className="font-semibold text-primary-strong hover:text-primary">
              Ir para a central de ajuda
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl space-y-10">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <section key={group.title}>
              <div className="mb-5">
                <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  {group.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted-strong sm:text-base">
                  {group.description}
                </p>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {group.items.map((item) => (
                  <details
                    key={item.question}
                    className="elevated-card rounded-[1.5rem] border border-border bg-white p-5 sm:rounded-[1.75rem] sm:p-6"
                  >
                    <summary className="cursor-pointer list-none text-base leading-7 font-semibold text-slate-950 sm:text-lg sm:leading-8">
                      {item.question}
                    </summary>
                    <p className="mt-4 text-sm leading-7 text-muted-strong sm:text-base sm:leading-8">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))
        ) : (
          <section className="rounded-[1.75rem] border border-dashed border-border bg-white p-8 text-center">
            <p className="text-lg font-semibold text-slate-950">
              Nenhuma pergunta encontrada para esse termo.
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-strong">
              Tente outra palavra-chave ou abra a central de ajuda para seguir o passo a
              passo completo.
            </p>
          </section>
        )}
      </section>
    </>
  );
}
