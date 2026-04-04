import type { Metadata } from "next";
import Link from "next/link";
import { releaseNotes } from "@/lib/release-notes";

export const metadata: Metadata = {
  title: "Atualizações | VLservice",
  description:
    "Histórico das atualizações mais recentes da VLservice com data e resumo das mudanças.",
};

export default function AtualizacoesPage() {
  return (
    <main id="conteudo" className="page-shell py-10 sm:py-14">
      <section className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold tracking-[0.24em] text-primary-strong uppercase">
          Atualizações
        </p>
        <h1 className="mt-3 font-sans text-4xl font-bold tracking-tight text-slate-950">
          Últimas versões publicadas
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-strong">
          Sempre que uma nova atualização entrar, este histórico registra a data e
          o que mudou na plataforma.
        </p>
      </section>

      <section className="mt-8 space-y-4">
        {releaseNotes.map((release) => (
          <article
            key={release.id}
            id={release.id}
            className="rounded-[2rem] border border-border bg-white p-8 shadow-sm scroll-mt-28"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold tracking-[0.2em] text-primary-strong uppercase">
                  {release.versionLabel}
                </p>
                <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-slate-950">
                  {release.title}
                </h2>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                {release.dateLabel}
              </div>
            </div>

            <p className="mt-5 max-w-3xl text-base leading-7 text-muted-strong">
              {release.summary}
            </p>

            <ul className="mt-6 grid gap-3">
              {release.changes.map((change) => (
                <li
                  key={change}
                  className="rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
                >
                  {change}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-primary/35 hover:text-primary-strong"
        >
          Voltar para a home
        </Link>
      </div>
    </main>
  );
}
