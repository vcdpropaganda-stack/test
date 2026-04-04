import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { MapPin, ShieldCheck, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { ServiceCard } from "@/components/marketplace/service-card";
import { ShareLinkButton } from "@/components/shared/share-link-button";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/marketplace";
import { getProviderProfileBySlug } from "@/lib/providers";

type ProviderPageProps = {
  params: Promise<{ slug: string }>;
};

const getCachedProviderProfileBySlug = cache((slug: string) =>
  getProviderProfileBySlug(slug)
);

export async function generateMetadata({
  params,
}: ProviderPageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getCachedProviderProfileBySlug(slug);

  if (!provider) {
    return {
      title: "Prestador | VLservice",
      description: "Perfil público do prestador na VLservice.",
    };
  }

  return {
    title: `${provider.display_name} | Prestador na VLservice`,
    description:
      provider.bio ||
      `Conheça ${provider.display_name}, seus serviços e avaliações na VLservice.`,
  };
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const { slug } = await params;
  const provider = await getCachedProviderProfileBySlug(slug);

  if (!provider) {
    notFound();
  }

  const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://vlservice.vercel.app"}/prestadores/${provider.public_slug}`;
  const location = provider.city
    ? `${provider.city}${provider.state ? `, ${provider.state}` : ""}`
    : "Atendimento local";

  return (
    <main id="conteudo" className="page-shell py-10 sm:py-16">
      <section className="rounded-[2rem] border border-border bg-white p-8 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
              Prestador em destaque
            </p>
            <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-slate-950">
              {provider.display_name}
            </h1>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted-strong">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-strong" />
                {location}
              </span>
              <span className="inline-flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                {provider.averageRating ? `${provider.averageRating} de média` : "Novo perfil"}
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                {provider.is_verified ? "Perfil verificado" : "Perfil ativo"}
              </span>
            </div>
            <p className="mt-6 max-w-3xl text-base leading-8 text-muted-strong">
              {provider.bio ||
                "Este prestador ainda não adicionou uma biografia detalhada, mas já possui presença pública no marketplace."}
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-slate-950 p-6 text-white">
            <p className="text-sm text-slate-300">Compartilhar perfil</p>
            <p className="mt-3 text-sm leading-7 text-slate-200">
              Envie este link para clientes e aumente a confiança antes do primeiro contato.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <ShareLinkButton
                url={profileUrl}
                title={`Perfil de ${provider.display_name}`}
                text={`Conheça ${provider.display_name} na VLservice`}
                className="w-full"
              />
              {provider.services[0] ? (
                <Link href={`/servicos/${provider.services[0].slug}`} className="inline-flex">
                  <Button variant="secondary" className="w-full border-white/15 bg-white text-slate-950">
                    Ver primeiro serviço
                  </Button>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
              Serviços publicados
            </p>
            <h2 className="mt-2 font-sans text-3xl font-bold tracking-tight text-slate-950">
              O que {provider.display_name} oferece
            </h2>
          </div>
          <p className="text-sm text-muted-strong">{provider.services.length} serviços ativos</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
          {provider.services.map((service) => (
            <ServiceCard
              key={service.id}
              href={`/servicos/${service.slug}`}
              title={service.title}
              provider={provider.display_name}
              price={formatPrice(service.price_cents)}
              tag={service.featured_rank !== null ? "Em destaque" : "Disponível"}
              imageUrl={service.cover_image_url}
              description={service.description}
              rating={provider.averageRating}
              reviewsCount={provider.reviewsCount}
              duration={`${service.duration_minutes} min`}
              location={location}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
