import Link from "next/link";
import { CalendarClock, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

const pillars = [
  "Arquitetura pronta para web e mobile sem retrabalho de UX.",
  "Fluxos claros, legíveis e consistentes em qualquer etapa do produto.",
  "Padrões de foco, contraste e interação pensados para acessibilidade real.",
];

const productHighlights = [
  {
    title: "Perfis segregados com RLS",
    description: "Regras distintas para admin, cliente e prestador.",
    icon: ShieldCheck,
  },
  {
    title: "Agenda e disponibilidade",
    description: "Fluxo de booking pronto para evoluir com Cal.com ou agenda própria.",
    icon: CalendarClock,
  },
  {
    title: "Assinaturas por plano",
    description: "Base pronta para Stripe em modo de teste.",
    icon: CreditCard,
  },
];

export function HomeFoundationSections() {
  return (
    <>
      <section className="border-y border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(238,242,255,0.72))]">
        <div className="page-shell py-18">
          <SectionHeading
            eyebrow="Infraestrutura"
            title="Base sólida para operar, agendar e escalar com consistência"
            description="Os pilares técnicos e operacionais do produto aparecem aqui, fora da dobra principal, com mais espaço para leitura e melhor hierarquia visual."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {productHighlights.map((item, index) => (
              <article
                key={item.title}
                data-reveal
                data-reveal-delay={120 + index * 60}
                className="elevated-card rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_20px_50px_rgba(99,102,241,0.08)] backdrop-blur"
              >
                <div className="inline-flex rounded-2xl bg-primary-soft p-3 text-primary-strong">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 max-w-xs font-sans text-2xl font-bold tracking-tight text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-sm text-base leading-8 text-muted-strong">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-[linear-gradient(180deg,#ffffff,rgba(224,231,255,0.35))]">
        <div className="page-shell grid gap-10 py-18 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionHeading
              eyebrow="Experiência"
              title="Uma fundação de UI/UX desenhada para parecer produto sério desde o dia um"
              description="Direção visual limpa, espaçamento consistente, contraste forte e componentes preparados para escalar sem perder refinamento."
            />
          </div>
          <div className="space-y-4">
            {pillars.map((pillar, index) => (
              <div
                key={pillar}
                data-reveal
                data-reveal-delay={120 + index * 45}
                className="elevated-card flex items-start gap-4 rounded-3xl border border-border bg-surface p-5"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
                <p className="text-sm leading-7 text-muted-strong">{pillar}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-18">
        <div
          data-reveal
          className="rounded-[2rem] border border-border bg-slate-950 p-8 text-white lg:p-12"
        >
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-slate-300 uppercase">
                Pronto para crescer
              </p>
              <h2 className="mt-4 max-w-2xl font-sans text-4xl font-bold tracking-tight">
                Marketing, onboarding, dashboards e estrutura institucional em
                uma mesma linguagem visual.
              </h2>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
              <Link href="/precos" className="inline-flex">
                <Button variant="secondary" className="border-white/15 bg-white text-slate-950">
                  Ver planos
                </Button>
              </Link>
              <Link href="/faq" className="inline-flex">
                <Button>Explorar FAQ</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
