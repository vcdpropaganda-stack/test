import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getMarketplaceServices, getServiceTag, formatPrice } from "@/lib/marketplace";
import { SectionHeading } from "@/components/shared/section-heading";
import { HeroSearch } from "@/components/marketplace/hero-search";
import { ServiceCard } from "@/components/marketplace/service-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Vitrine Lojas | Marketplace de Serviços Locais",
  description:
    "Encontre e gerencie serviços locais com uma experiência premium, segura e pronta para escalar.",
};

export const revalidate = 180;

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

export default async function Home() {
  const featuredServices = await getMarketplaceServices(3);
  const activeServicesCount = featuredServices.length;
  const heroService = featuredServices[0] ?? null;
  const spotlightServices = featuredServices.slice(0, 3);
  const secondService = featuredServices[1] ?? null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main id="conteudo" className="flex-1">
        <section className="hero-grid relative overflow-hidden border-b border-border bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_52%,#ffffff_100%)]">
          <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-primary/8 to-transparent" />
          <div className="pointer-events-none absolute left-[-8rem] top-24 h-[24rem] w-[24rem] rounded-full bg-primary/12 blur-3xl" />
          <div className="pointer-events-none absolute right-[-6rem] top-16 h-[28rem] w-[28rem] rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-10rem] right-[18%] h-[20rem] w-[20rem] rounded-full bg-amber-300/10 blur-3xl" />
          <div className="page-shell grid gap-12 py-12 lg:grid-cols-[1.03fr_0.97fr] lg:items-center lg:gap-16 lg:py-20">
            <div className="relative z-10">
              <div className="glass-panel mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 px-4 py-2 text-sm font-semibold text-primary-strong shadow-sm">
                <Sparkles className="h-4 w-4" />
                Marketplace premium para serviços locais
              </div>
              <h1 className="max-w-4xl font-sans text-[3.3rem] leading-[0.95] font-bold tracking-[-0.05em] text-slate-950 sm:text-[4.35rem] lg:text-[5.5rem]">
                Serviços que parecem
                <span className="block text-primary-strong">marca premium</span>
                <span className="block">antes mesmo do clique.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-strong sm:text-xl">
                A Vitrine Lojas transforma a busca por serviços em uma vitrine
                com desejo, confiança e clareza comercial. Mais imagem, mais
                curadoria e muito menos cara de classificado genérico.
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
              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <div className="elevated-card rounded-[1.6rem] border border-white/70 bg-white/88 p-4 backdrop-blur">
                  <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-muted uppercase">
                    Catálogo vivo
                  </p>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                    {activeServicesCount}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-strong">
                    serviços destacados com imagem, agenda e preço visível
                  </p>
                </div>
                <div className="elevated-card rounded-[1.6rem] border border-white/70 bg-white/88 p-4 backdrop-blur">
                  <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-muted uppercase">
                    Curadoria
                  </p>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                    3
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-strong">
                    perfis demo com posicionamento, nicho e portfólio inicial
                  </p>
                </div>
                <div className="elevated-card rounded-[1.6rem] border border-white/70 bg-slate-950 p-4 text-white">
                  <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                    Fluxo pronto
                  </p>
                  <p className="mt-3 text-3xl font-bold tracking-tight">
                    Booking
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    reserva, checkout protótipo e painel de operação no mesmo fluxo
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="relative overflow-hidden rounded-[2.6rem] border border-slate-200/70 bg-slate-950 text-white shadow-[0_30px_120px_rgba(15,23,42,0.28)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(129,140,248,0.36),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />
                <div className="relative min-h-[24rem] p-5 sm:p-6">
                  {heroService?.cover_image_url ? (
                    <Image
                      src={heroService.cover_image_url}
                      alt={heroService.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="absolute inset-0 h-full w-full object-cover opacity-55"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-[linear-gradient(165deg,rgba(15,23,42,0.28),rgba(15,23,42,0.92)_68%)]" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-300">Seleção editorial</p>
                      <p className="mt-1 text-[1.7rem] font-semibold tracking-tight">
                        Curadoria Vitrine Lojas
                      </p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur-sm">
                      {activeServicesCount} em destaque
                    </div>
                  </div>
                  <HeroSearch
                    initialResults={spotlightServices.map((service) => ({
                      id: service.id,
                      slug: service.slug,
                      title: service.title,
                      provider:
                        service.provider_profile?.display_name ?? "Prestador Vitrine Lojas",
                      city: service.provider_profile?.city ?? null,
                      price: formatPrice(service.price_cents),
                      duration: `${service.duration_minutes} min`,
                      imageUrl: service.cover_image_url,
                    }))}
                  />
                  {secondService ? (
                    <div className="relative mt-4 grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
                      <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                        <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                          Mais desejado
                        </p>
                        <p className="mt-2 text-xl font-semibold leading-tight">
                          {secondService.title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {secondService.provider_profile?.display_name ?? "Prestador Vitrine Lojas"}{" "}
                          com apresentação visual forte e agenda publicada.
                        </p>
                      </div>
                      <div className="rounded-[1.5rem] border border-white/10 bg-primary-contrast/10 p-4">
                        <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                          O que muda
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-200">
                          Imagem, preço, tempo e localidade aparecem com clareza antes da decisão.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell py-18">
          <SectionHeading
            eyebrow="Marketplace"
            title="Serviços reais publicados no marketplace"
            description="A vitrine principal agora lê os anúncios ativos do banco e já funciona como base da descoberta pública."
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
                  Ainda não existem serviços ativos para exibir.
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-strong">
                  Entre como prestador e publique os primeiros serviços para a
                  vitrine ganhar vida.
                </p>
              </div>
            )}
          </div>
          <div className="mt-8">
            <Link href="/servicos" className="inline-flex">
              <Button variant="secondary">Explorar todos os serviços</Button>
            </Link>
          </div>
        </section>

        <section className="border-y border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(238,242,255,0.72))]">
          <div className="page-shell py-18">
            <SectionHeading
              eyebrow="Infraestrutura"
              title="Base sólida para operar, agendar e escalar com consistência"
              description="Os pilares técnicos e operacionais do produto aparecem aqui, fora da dobra principal, com mais espaço para leitura e melhor hierarquia visual."
            />
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {productHighlights.map((item) => (
                <article
                  key={item.title}
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
