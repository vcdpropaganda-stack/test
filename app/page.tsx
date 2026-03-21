import type { Metadata } from "next";
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
    "A plataforma certa para encontrar quem faz. Encontre profissionais de beleza, casa, tecnologia e negócios em minutos.",
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

function getUniqueSpotlightServices<T extends { slug: string; category: { slug: string } | null }>(
  services: T[],
  limit: number
) {
  const selected: T[] = [];
  const seenCategories = new Set<string>();

  for (const service of services) {
    const categorySlug = service.category?.slug ?? service.slug;

    if (seenCategories.has(categorySlug)) {
      continue;
    }

    selected.push(service);
    seenCategories.add(categorySlug);

    if (selected.length === limit) {
      return selected;
    }
  }

  for (const service of services) {
    if (selected.some((item) => item.slug === service.slug)) {
      continue;
    }

    selected.push(service);

    if (selected.length === limit) {
      break;
    }
  }

  return selected;
}

export default async function Home() {
  const servicesPool = await getMarketplaceServices(18);
  const activeServicesCount = servicesPool.length;
  const spotlightServices = getUniqueSpotlightServices(servicesPool, 3);
  const homepageServices = getUniqueSpotlightServices(servicesPool, 6);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main id="conteudo" className="flex-1">
        <section className="hero-grid relative overflow-hidden border-b border-border bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_52%,#ffffff_100%)]">
          <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-primary/8 to-transparent" />
          <div className="pointer-events-none absolute left-[-8rem] top-24 h-[24rem] w-[24rem] rounded-full bg-primary/12 blur-3xl" />
          <div className="pointer-events-none absolute right-[-6rem] top-16 h-[28rem] w-[28rem] rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-10rem] right-[18%] h-[20rem] w-[20rem] rounded-full bg-amber-300/10 blur-3xl" />
          <div className="page-shell py-12 lg:py-20">
            <div className="relative z-10 mx-auto max-w-6xl">
              <div className="glass-panel mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 px-4 py-2 text-sm font-semibold text-primary-strong shadow-sm">
                <Sparkles className="h-4 w-4" />
                A plataforma certa para encontrar quem faz
              </div>
              <div className="mx-auto max-w-4xl text-center">
                <p className="text-sm font-semibold tracking-[0.32em] text-primary-strong uppercase">
                  Precisa de uma mãozinha? Nós resolvemos. 🤝
                </p>
                <h1 className="mt-5 font-sans text-[3rem] leading-[1.02] font-bold tracking-[-0.05em] text-slate-950 sm:text-[4.1rem] sm:leading-[0.98] lg:text-[5.25rem] lg:leading-[0.96]">
                  A plataforma certa
                  <span className="block">para encontrar quem faz.</span>
                </h1>
                <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-muted-strong sm:text-xl">
                  Quer dar um tapa no visual, consertar o PC ou bombar suas redes
                  sociais? Na Vitrine Lojas, você encontra o especialista ideal em minutos.
                </p>
              </div>
              <div className="mx-auto mt-10 max-w-4xl">
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
                  variant="light"
                />
              </div>
              <div className="mx-auto mt-8 grid max-w-5xl gap-3 text-left sm:grid-cols-3">
                <div className="elevated-card rounded-[1.6rem] border border-white/70 bg-white/88 p-5 backdrop-blur">
                  <p className="text-[0.72rem] font-semibold tracking-[0.26em] text-primary-strong uppercase">
                    Beleza
                  </p>
                  <p className="mt-3 text-base leading-7 text-slate-900">
                    Manicure e maquiagem.
                  </p>
                </div>
                <div className="elevated-card rounded-[1.6rem] border border-white/70 bg-white/88 p-5 backdrop-blur">
                  <p className="text-[0.72rem] font-semibold tracking-[0.26em] text-primary-strong uppercase">
                    Casa e Tech
                  </p>
                  <p className="mt-3 text-base leading-7 text-slate-900">
                    Pintores e técnicos de informática.
                  </p>
                </div>
                <div className="elevated-card rounded-[1.6rem] border border-white/70 bg-slate-950 p-5 text-white">
                  <p className="text-[0.72rem] font-semibold tracking-[0.26em] text-slate-400 uppercase">
                    Negócios
                  </p>
                  <p className="mt-3 text-base leading-7 text-slate-100">
                    Agência de marketing e redes sociais.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/servicos" className="inline-flex">
                  <Button icon={<ArrowRight className="h-4 w-4" />}>
                    Explorar marketplace
                  </Button>
                </Link>
                <Link href="/dashboard/provider" className="inline-flex">
                  <Button variant="secondary">Quero anunciar meus serviços</Button>
                </Link>
              </div>
              <div className="mt-7 text-center">
                <p className="text-base font-semibold tracking-[0.12em] text-slate-700 uppercase">
                  Rápido. Seguro. Profissional.
                </p>
              </div>
              <div className="mx-auto mt-10 grid max-w-5xl grid-cols-3 gap-2 sm:gap-3">
                <div className="elevated-card rounded-[1.25rem] border border-white/70 bg-white/88 p-3 backdrop-blur sm:rounded-[1.6rem] sm:p-4">
                  <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-muted uppercase sm:text-[0.7rem] sm:tracking-[0.22em]">
                    Serviços
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:mt-3 sm:text-3xl">
                    {activeServicesCount}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-strong sm:text-sm sm:leading-6">
                    anúncios com imagem e preço visível
                  </p>
                </div>
                <div className="elevated-card rounded-[1.25rem] border border-white/70 bg-white/88 p-3 backdrop-blur sm:rounded-[1.6rem] sm:p-4">
                  <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-muted uppercase sm:text-[0.7rem] sm:tracking-[0.22em]">
                    Categorias
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:mt-3 sm:text-3xl">
                    10
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-strong sm:text-sm sm:leading-6">
                    áreas entre beleza, casa, tech e negócios
                  </p>
                </div>
                <div className="elevated-card rounded-[1.25rem] border border-white/70 bg-slate-950 p-3 text-white sm:rounded-[1.6rem] sm:p-4">
                  <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-slate-400 uppercase sm:text-[0.7rem] sm:tracking-[0.22em]">
                    Agenda viva
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight sm:mt-3 sm:text-3xl">
                    Datas
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-300 sm:text-sm sm:leading-6">
                    disponibilidade real por horário
                  </p>
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
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {homepageServices.length > 0 ? (
              homepageServices.map((service) => (
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
            <Link href="/servicos" prefetch className="inline-flex">
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
