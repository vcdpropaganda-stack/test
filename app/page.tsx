import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  MapPin,
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
  const heroService = featuredServices[0] ?? null;
  const spotlightServices = featuredServices.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main id="conteudo" className="flex-1">
        <section className="hero-grid relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.12),_transparent_26%)]">
          <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-primary/10 to-transparent" />
          <div className="pointer-events-none absolute -top-24 right-[-10rem] h-[28rem] w-[28rem] rounded-full bg-primary/16 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-8rem] left-[-6rem] h-[18rem] w-[18rem] rounded-full bg-amber-300/16 blur-3xl" />
          <div className="page-shell grid gap-14 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
            <div className="relative z-10">
              <div className="glass-panel mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-sm font-medium text-primary-strong shadow-sm">
                <Sparkles className="h-4 w-4" />
                Marketplace premium para servicos locais
              </div>
              <h1 className="max-w-3xl font-sans text-5xl leading-tight font-bold tracking-tight text-slate-950 sm:text-6xl">
                Descubra servicos com cara de marca forte, agenda viva e
                apresentacao que vende.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                A Vitrine Lojas coloca os melhores prestadores em evidência com
                imagens fortes, reputacao clara, filtros objetivos e uma jornada
                visual muito mais desejavel.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/servicos" className="inline-flex">
                  <Button icon={<ArrowRight className="h-4 w-4" />}>
                    Explorar marketplace
                  </Button>
                </Link>
                <Link href="/dashboard/provider" className="inline-flex">
                  <Button variant="secondary">Entrar como prestador</Button>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-700">
                <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 shadow-sm">
                  {activeServicesCount} servicos destacados
                </span>
                <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 shadow-sm">
                  3 perfis demo ativos
                </span>
                <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 shadow-sm">
                  Booking e checkout prototipo
                </span>
              </div>
              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                <div className="glass-panel elevated-card rounded-3xl border border-white/70 p-5">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <p className="mt-4 text-sm font-semibold text-slate-950">
                    Perfis segregados com RLS
                  </p>
                  <p className="mt-2 text-sm text-muted-strong">
                    Regras distintas para admin, cliente e prestador.
                  </p>
                </div>
                <div className="glass-panel elevated-card rounded-3xl border border-white/70 p-5">
                  <CalendarClock className="h-5 w-5 text-primary" />
                  <p className="mt-4 text-sm font-semibold text-slate-950">
                    Agenda e disponibilidade
                  </p>
                  <p className="mt-2 text-sm text-muted-strong">
                    Fluxo de booking pronto para evoluir com Cal.com ou agenda
                    propria.
                  </p>
                </div>
                <div className="glass-panel elevated-card rounded-3xl border border-white/70 p-5">
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
              <div className="overflow-hidden rounded-[2.25rem] border border-slate-200/70 bg-slate-950 text-white shadow-2xl shadow-slate-950/20">
                <div className="relative min-h-[22rem] p-6">
                  {heroService?.cover_image_url ? (
                    <img
                      src={heroService.cover_image_url}
                      alt={heroService.title}
                      className="absolute inset-0 h-full w-full object-cover opacity-55"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(15,23,42,0.2),rgba(15,23,42,0.86)_65%)]" />
                  <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">Marketplace ao vivo</p>
                    <p className="mt-1 text-2xl font-semibold">Curadoria Vitrine Lojas</p>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
                    {activeServicesCount} servicos em destaque
                  </div>
                  </div>
                  <div className="relative mt-8 rounded-[1.75rem] border border-white/10 bg-white/8 p-4 backdrop-blur-md">
                    <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-500">
                    <Search className="h-4 w-4" />
                    Buscar limpeza, beleza, manutencao...
                    </div>
                    <div className="mt-4 grid gap-3">
                      {spotlightServices.length > 0 ? (
                        spotlightServices.map((service) => (
                          <div
                            key={service.id}
                            className="grid grid-cols-[5rem_1fr] gap-4 rounded-2xl border border-white/10 bg-white/8 p-3"
                          >
                            <div className="relative overflow-hidden rounded-2xl bg-white/10">
                              {service.cover_image_url ? (
                                <img
                                  src={service.cover_image_url}
                                  alt={service.title}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              ) : null}
                            </div>
                            <div>
                              <div className="flex items-center justify-between gap-3">
                                <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-amber-300">
                                  {getServiceTag(service)}
                                </span>
                                <span className="text-sm text-slate-200">
                                  {service.duration_minutes} min
                                </span>
                              </div>
                              <p className="mt-3 font-semibold">{service.title}</p>
                              <p className="mt-1 text-sm text-slate-300">
                                {service.provider_profile?.display_name ?? "Prestador Vitrine Lojas"}
                              </p>
                              <div className="mt-3 flex items-center justify-between text-sm">
                                <span className="font-semibold text-white">
                                  {formatPrice(service.price_cents)}
                                </span>
                                <span className="inline-flex items-center gap-1 text-slate-200">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {service.provider_profile?.city ?? "Atendimento local"}
                                </span>
                              </div>
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
                  imageUrl={service.cover_image_url}
                  description={service.description}
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

        <section className="border-y border-border bg-[linear-gradient(180deg,#ffffff,rgba(224,231,255,0.35))]">
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
