import type { Metadata } from "next";
import Link from "next/link";
import { FaqBrowser } from "@/components/help/faq-browser";
import { faqGroups } from "@/content/faq";

export const metadata: Metadata = {
  title: "FAQ | VL Serviços",
  description:
    "Perguntas frequentes sobre cadastro, busca, reservas, agenda, checkout, operação e uso da VL Serviços.",
};

const quickHelpCards = [
  {
    title: "Primeiro acesso",
    description: "Entenda cadastro, confirmação por e-mail e login sem travar.",
  },
  {
    title: "Buscar e reservar",
    description: "Veja como encontrar serviços, escolher datas e confirmar horários.",
  },
  {
    title: "Publicar serviços",
    description: "Prestadores podem organizar perfil, anúncios, agenda e operação.",
  },
];

export default function FaqPage() {
  return (
    <main id="conteudo" className="page-shell py-10 sm:py-16">
      <section className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">FAQ</p>
        <h1 className="mt-4 font-sans text-[2.5rem] leading-[1.06] font-bold tracking-[-0.035em] text-slate-950 sm:text-[3.8rem] sm:leading-[1.02]">
          Perguntas frequentes para resolver dúvidas sem perder tempo.
        </h1>
        <p className="mt-5 text-base leading-8 text-muted-strong sm:text-lg">
          Reunimos as dúvidas mais comuns de clientes, prestadores e da equipe interna
          para deixar o uso da plataforma mais claro do começo ao fim.
        </p>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-4 md:grid-cols-3">
        {quickHelpCards.map((card) => (
          <article
            key={card.title}
            className="rounded-[1.5rem] border border-border bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]"
          >
            <p className="text-lg font-semibold text-slate-950">{card.title}</p>
            <p className="mt-3 text-sm leading-7 text-muted-strong">{card.description}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-center gap-3 text-sm">
        <Link
          href="/ajuda"
          className="rounded-full border border-primary/20 bg-primary-soft px-4 py-2 font-semibold text-primary-strong"
        >
          Abrir central de ajuda
        </Link>
        <Link
          href="/contato"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700"
        >
          Falar com a equipe
        </Link>
      </section>

      <FaqBrowser groups={faqGroups} />
    </main>
  );
}
