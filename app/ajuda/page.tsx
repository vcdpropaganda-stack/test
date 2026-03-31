import type { Metadata } from "next";
import Link from "next/link";
import { faqGroups } from "@/content/faq";
import { helpSections } from "@/content/help";

export const metadata: Metadata = {
  title: "Central de Ajuda | VLservice",
  description:
    "Guias passo a passo para cadastro, publicação de serviços, agenda, reserva, checkout e operação na VLservice.",
};

const supportCards = [
  {
    title: "Fluxos para clientes",
    description: "Busca, escolha do serviço, calendário, reserva, checkout e acompanhamento.",
  },
  {
    title: "Fluxos para prestadores",
    description: "Perfil público, serviços, agenda, reservas, reputação e operação diária.",
  },
  {
    title: "Apoio operacional",
    description: "FAQ, páginas legais e suporte da equipe para casos especiais.",
  },
];

export default function AjudaPage() {
  return (
    <main id="conteudo" className="page-shell py-10 sm:py-16">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#ffffff,#eef2ff_65%,#f8fafc)] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] sm:p-8">
          <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
            Central de ajuda
          </p>
          <h1 className="mt-4 font-sans text-[2.5rem] leading-[1.06] font-bold tracking-[-0.035em] text-slate-950 sm:text-[4rem] sm:leading-[1.02]">
            Tudo o que alguém precisa saber para usar a plataforma sem travar.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-strong sm:text-lg">
            Esta central organiza os fluxos principais para clientes, prestadores e
            equipe interna, desde o primeiro cadastro até a reserva, operação do
            serviço e apoio pós-atendimento.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/faq"
              className="rounded-full border border-primary/20 bg-primary-soft px-4 py-2 text-sm font-semibold text-primary-strong"
            >
              Ver FAQ completa
            </Link>
            <Link
              href="/contato"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Falar com a equipe
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-4 md:grid-cols-3">
        {supportCards.map((card) => (
          <article
            key={card.title}
            className="rounded-[1.5rem] border border-border bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]"
          >
            <p className="text-lg font-semibold text-slate-950">{card.title}</p>
            <p className="mt-3 text-sm leading-7 text-muted-strong">{card.description}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-10 grid max-w-6xl gap-8 lg:grid-cols-[0.32fr_0.68fr]">
        <aside className="rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
            Navegação rápida
          </p>
          <nav className="mt-5 space-y-2">
            {helpSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block rounded-2xl border border-transparent bg-surface px-4 py-3 text-sm font-semibold text-slate-800 hover:border-primary/20 hover:text-primary-strong"
              >
                {section.title}
              </a>
            ))}
          </nav>
          <div className="mt-6 rounded-[1.25rem] border border-primary/15 bg-primary-soft p-4">
            <p className="text-sm font-semibold text-primary-strong">Dica rápida</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Se a dúvida for pontual, a FAQ costuma resolver mais rápido. Se for fluxo
              completo, use esta central.
            </p>
          </div>
        </aside>

        <div className="space-y-6">
          {helpSections.map((section) => (
            <article
              id={section.id}
              key={section.id}
              className="elevated-card scroll-mt-28 rounded-[1.75rem] border border-border bg-white p-5 sm:p-7"
            >
              <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
                Guia
              </p>
              <h2 className="mt-2 font-sans text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-strong sm:text-base">
                {section.summary}
              </p>
              <ol className="mt-6 space-y-3">
                {section.steps.map((step, index) => (
                  <li key={step} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary-strong">
                      {index + 1}
                    </div>
                    <p className="pt-0.5 text-sm leading-7 text-muted-strong sm:text-base sm:leading-8">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl rounded-[1.9rem] border border-border bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
              Ainda precisa de ajuda?
            </p>
            <h2 className="mt-2 font-sans text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Continue pelos próximos canais
            </h2>
          </div>
          <Link
            href="/faq"
            className="text-sm font-semibold text-primary-strong hover:text-primary"
          >
            Abrir perguntas frequentes
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-[1.4rem] border border-border bg-surface p-5">
            <p className="font-semibold text-slate-950">FAQ</p>
            <p className="mt-3 text-sm leading-7 text-muted-strong">
              Melhor para dúvidas pontuais e respostas rápidas.
            </p>
          </article>
          <article className="rounded-[1.4rem] border border-border bg-surface p-5">
            <p className="font-semibold text-slate-950">Contato</p>
            <p className="mt-3 text-sm leading-7 text-muted-strong">
              Melhor para suporte humano, comercial ou operação especial.
            </p>
          </article>
          <article className="rounded-[1.4rem] border border-border bg-surface p-5">
            <p className="font-semibold text-slate-950">Páginas legais</p>
            <p className="mt-3 text-sm leading-7 text-muted-strong">
              Melhor para entender privacidade, LGPD, termos e responsabilidades.
            </p>
          </article>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full border border-slate-200 bg-surface px-4 py-2 font-medium text-slate-700">
            {helpSections.length} guias completos
          </span>
          <span className="rounded-full border border-slate-200 bg-surface px-4 py-2 font-medium text-slate-700">
            {faqGroups.reduce((acc, group) => acc + group.items.length, 0)} dúvidas mapeadas
          </span>
        </div>
      </section>
    </main>
  );
}
