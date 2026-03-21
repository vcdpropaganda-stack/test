import type { Metadata } from "next";
import { CalendarClock, ChartNoAxesCombined, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Recursos | Vitrine Lojas",
  description:
    "Conheça os recursos principais do SaaS Vitrine Lojas para operação, conversão e escala.",
};

const resources = [
  {
    title: "Marketplace com descoberta guiada",
    description:
      "Home, busca e páginas de serviço pensadas para reduzir fricção e aumentar conversão.",
    icon: Sparkles,
  },
  {
    title: "Agenda e disponibilidade",
    description:
      "Fluxos preparados para booking, disponibilidade e acompanhamento em tempo real.",
    icon: CalendarClock,
  },
  {
    title: "Governanca e seguranca",
    description:
      "RLS, papéis segregados e base pronta para operação segura com Supabase.",
    icon: ShieldCheck,
  },
  {
    title: "Escala de operação",
    description:
      "Assinaturas, limites por plano e estrutura de dashboard para cliente e prestador.",
    icon: ChartNoAxesCombined,
  },
];

export default function RecursosPage() {
  return (
    <main id="conteudo" className="page-shell py-16">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
          Recursos
        </p>
        <h1 className="mt-4 font-sans text-5xl font-bold tracking-tight text-slate-950">
          Tudo o que um SaaS sério precisa para crescer com consistência.
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-strong">
          O projeto foi estruturado para parecer premium, ser fácil de usar e
          continuar robusto quando o produto evoluir para mais módulos.
        </p>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        {resources.map((resource) => (
          <article
            key={resource.title}
            className="elevated-card rounded-[2rem] border border-border bg-white p-8"
          >
            <resource.icon className="h-6 w-6 text-primary" />
            <h2 className="mt-5 font-sans text-2xl font-bold tracking-tight text-slate-950">
              {resource.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-strong">
              {resource.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
