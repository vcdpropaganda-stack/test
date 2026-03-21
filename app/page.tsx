import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getMarketplaceServices, getServiceTag, formatPrice } from "@/lib/marketplace";
import { SectionHeading } from "@/components/shared/section-heading";
import { ServiceCard } from "@/components/marketplace/service-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Vitrine Lojas | Marketplace de Servicos Locais",
  description:
    "Encontre e gerencie servicos locais com uma experiencia premium, segura e pronta para escalar.",
};

const pillars = [
  "Arquitetura pronta para web e mobile sem retrabalho de UX.",
  "Fluxos claros, legiveis e consistentes em qualquer etapa do produto.",
  "Padroes de foco, contraste e interacao pensados para acessibilidade real.",
];

export default async function Home() {
  const featuredServices = await getMarketplaceServices(3);
  const activeServicesCount = featuredServices.length;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main id="conteudo" className="flex-1">
        <section className="hero-grid relative overflow-hidden border-b border-border">
          <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-primary/10 to-transparent" />
          <div className="page-shell grid gap-14 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
            <div className="relative z-10">
              <div className="glass-panel mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-sm font-medium text-primary-strong shadow-sm">
                <Sparkles className="h-4 w-4" />
                Marketplace premium para servicos locais
              </div>
              <h1 className="max-w-3xl font-sans text-5xl leading-tight font-bold tracking-tight text-slate-950 sm:text-6xl">
                Conecte clientes a prestadores com uma experiencia segura,
                moderna e pronta para escalar.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                A base da Vitrine Lojas ja nasce com Next.js, Supabase, agendamentos,
                niveis de assinatura e uma identidade visual premium pensada
                para conversao.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/dashboard/provider"
                  className="inline-flex"
                >
                  <Button icon={<ArrowRight className="h-4 w-4" />}>
                    Abrir painel do prestador
                  </Button>
                </Link>
                <Link
                  href="/afiliados"
                  className="inline-flex"
                >
                  <Button variant="secondary">Ver pagina de afiliados</Button>
                </Link>
              </div>
              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                <div className="glass-panel elevated-card rounded-3xl border border-border p-5">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <p className="mt-4 text-sm font-semibold text-slate-950">
                    Perfis segregados com RLS
                  </p>
                  <p className="mt-2 text-sm text-muted-strong">
                    Regras distintas para admin, cliente e prestador.
                  </p>
                </div>
                <div className="glass-panel elevated-card rounded-3xl border border-border p-5">
                  <CalendarClock className="h-5 w-5 text-primary" />
                  <p className="mt-4 text-sm font-semibold text-slate-950">
                    Agenda e disponibilidade
                  </p>
                  <p className="mt-2 text-sm text-muted-strong">
                    Fluxo de booking pronto para evoluir com Cal.com ou agenda
                    propria.
                  </p>
                </div>
                <div className="glass-panel elevated-card rounded-3xl border border-border p-5">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <p className="mt-4 text-sm font-semibold text-slate-950">
                    Assinaturas por plano
                  </p>
                  <p className="mt-2 text-sm text-muted-strong">
                    Base pronta para Stripe em modo de teste.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">Marketplace ao vivo</p>
                    <p className="mt-1 text-2xl font-semibold">Curadoria Vitrine Lojas</p>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
                    {activeServicesCount} servicos em destaque
                  </div>
                </div>
                <div className="mt-6 rounded-3xl bg-white/6 p-4">
                  <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-500">
                    <Search className="h-4 w-4" />
                    Buscar limpeza, beleza, manutencao...
                  </div>
                  <div className="mt-4 grid gap-3">
                    {featuredServices.length > 0 ? (
                      featuredServices.map((service) => (
                        <div
                          key={service.id}
                          className="rounded-2xl border border-white/10 bg-white/8 p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-amber-300">
                              {getServiceTag(service)}
                            </span>
                            <span className="text-sm text-slate-200">
                              {service.duration_minutes} min
                            </span>
                          </div>
                          <p className="mt-4 font-semibold">{service.title}</p>
                          <p className="mt-1 text-sm text-slate-300">
                            {service.provider_profile?.display_name ?? "Prestador Vitrine Lojas"}
                          </p>
                          <div className="mt-4 flex items-center justify-between text-sm">
                            <span className="font-semibold text-white">
                              {formatPrice(service.price_cents)}
                            </span>
                            <Link
                              href={`/servicos/${service.slug}`}
                              className="text-slate-200 underline underline-offset-4"
                            >
                              Ver detalhes
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-white/8 p-4 text-sm text-slate-300">
                        Assim que os prestadores publicarem servicos ativos, eles
                        aparecerao aqui automaticamente.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell py-18">
          <SectionHeading
            eyebrow="Marketplace"
            title="Servicos reais publicados no marketplace"
            description="A vitrine principal agora le os anuncios ativos do banco e ja funciona como base da descoberta publica."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {featuredServices.length > 0 ? (
              featuredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  href={`/servicos/${service.slug}`}
                  title={service.title}
                  provider={service.provider_profile?.display_name ?? "Prestador Vitrine Lojas"}
                  price={formatPrice(service.price_cents)}
                  tag={getServiceTag(service)}
                  rating={service.average_rating}
                  reviewsCount={service.reviews_count}
                  duration={`${service.duration_minutes} min`}
                  location={
                    service.provider_profile?.city
                      ? `${service.provider_profile.city}${service.provider_profile.state ? `, ${service.provider_profile.state}` : ""}`
                      : null
                  }
                />
              ))
            ) : (
              <div className="lg:col-span-3 rounded-[2rem] border border-dashed border-border bg-white p-8">
                <p className="text-lg font-semibold text-slate-950">
                  Ainda nao existem servicos ativos para exibir.
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-strong">
                  Entre como prestador e publique os primeiros servicos para a
                  vitrine ganhar vida.
                </p>
              </div>
            )}
          </div>
          <div className="mt-8">
            <Link href="/servicos" className="inline-flex">
              <Button variant="secondary">Explorar todos os servicos</Button>
            </Link>
          </div>
        </section>

        <section className="border-y border-border bg-white">
          <div className="page-shell grid gap-10 py-18 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <SectionHeading
                eyebrow="Experiencia"
                title="Uma fundacao de UI/UX desenhada para parecer produto serio desde o dia um"
                description="Direcao visual limpa, espacamento consistente, contraste forte e componentes preparados para escalar sem perder refinamento."
              />
            </div>
            <div className="space-y-4">
              {pillars.map((pillar) => (
                <div
                  key={pillar}
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
          <div className="rounded-[2rem] border border-border bg-slate-950 p-8 text-white lg:p-12">
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
                  <Button className="bg-primary hover:bg-primary-strong">
                    Explorar FAQ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
