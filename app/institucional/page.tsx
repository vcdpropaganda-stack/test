import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Institucional | VLservice",
  description:
    "Apresentação institucional da plataforma VLservice para clientes, prestadores e parceiros.",
};

const pillars = [
  "Descoberta clara de serviços com apresentação visual mais forte.",
  "Fluxos simples para reservar, reagendar e acompanhar atendimentos.",
  "Base operacional que ajuda prestadores e equipe interna a trabalhar com menos ruído.",
];

const audiences = [
  {
    title: "Para clientes",
    description: "Encontre quem faz, compare opções e reserve com contexto, agenda e preço visíveis.",
  },
  {
    title: "Para prestadores",
    description: "Publique serviços, organize agenda, fortaleça sua apresentação e acompanhe reservas.",
  },
  {
    title: "Para a operação",
    description: "Tenha painel administrativo, moderação de anúncios e controle da plataforma em um só lugar.",
  },
];

export default function InstitucionalPage() {
  return (
    <main id="conteudo" className="page-shell py-10 sm:py-16">
      <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end lg:gap-10">
        <div>
          <span className="w-fit rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            Institucional
          </span>
          <h1 className="mt-5 max-w-3xl font-sans text-[2.7rem] leading-[1.06] font-bold tracking-[-0.035em] text-slate-950 sm:mt-6 sm:text-5xl sm:leading-tight sm:tracking-tight">
            Uma plataforma feita para aproximar clientes e bons prestadores com mais clareza.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-strong sm:mt-6 sm:text-lg">
            A VLservice nasce para organizar a contratação de serviços de forma mais
            legível, visual e confiável, tanto para quem procura quanto para quem vende.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/dashboard/provider" className="inline-flex">
              <Button>Explorar painel</Button>
            </Link>
            <Link href="/contato" className="inline-flex">
              <Button variant="secondary">Falar com o time</Button>
            </Link>
          </div>
        </div>
        <div className="elevated-card rounded-[1.75rem] border border-border bg-white p-6 sm:rounded-[2rem] sm:p-8">
          <p className="text-sm text-muted-strong">Princípios do produto</p>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-muted-strong">
            {pillars.map((pillar) => (
              <li key={pillar}>{pillar}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {audiences.map((audience) => (
          <article
            key={audience.title}
            className="rounded-[1.5rem] border border-border bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]"
          >
            <p className="text-lg font-semibold text-slate-950">{audience.title}</p>
            <p className="mt-3 text-sm leading-7 text-muted-strong">{audience.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[1.75rem] border border-border bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8">
          <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
            Como a plataforma opera
          </p>
          <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-slate-950">
            O fluxo foi desenhado para ser simples dos dois lados.
          </h2>
          <ol className="mt-6 space-y-4">
            {[
              "O cliente busca, filtra, compara e abre a página do serviço.",
              "O prestador publica anúncio, define agenda e recebe reservas.",
              "A equipe interna acompanha o marketplace pelo painel administrativo.",
            ].map((step, index) => (
              <li key={step} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary-strong">
                  {index + 1}
                </div>
                <p className="pt-0.5 text-sm leading-7 text-muted-strong sm:text-base">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </article>

        <article className="rounded-[1.75rem] border border-border bg-slate-950 p-6 text-white shadow-[0_20px_55px_rgba(15,23,42,0.12)] sm:p-8">
          <p className="text-sm font-semibold tracking-[0.22em] text-slate-300 uppercase">
            Compromissos
          </p>
          <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight">
            O que a marca quer passar em toda a experiência
          </h2>
          <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-300 sm:text-base">
            <li>Mais legibilidade do que ruído visual.</li>
            <li>Menos atrito na descoberta e na contratação.</li>
            <li>Mais clareza sobre quem presta, quanto cobra e quando atende.</li>
            <li>Mais consistência entre web, operação interna e futura camada mobile.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
