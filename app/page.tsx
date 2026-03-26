import type { Metadata } from "next";
import { getMarketplaceServices, formatPrice } from "@/lib/marketplace";
import { HomeFoundationSections } from "@/components/home/home-foundation-sections";
import { HomeHero } from "@/components/home/home-hero";
import { HomeMarketplaceSection } from "@/components/home/home-marketplace-section";

export const metadata: Metadata = {
  title: "VL Serviços | Marketplace de Serviços Locais",
  description:
    "A plataforma certa para encontrar quem faz. Encontre profissionais de beleza, casa, tecnologia e negócios em minutos.",
};

export const revalidate = 180;

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
        <HomeHero
          activeServicesCount={activeServicesCount}
          spotlightServices={spotlightServices.map((service) => ({
            id: service.id,
            slug: service.slug,
            title: service.title,
            provider:
              service.provider_profile?.display_name ?? "Prestador VL Serviços",
            city: service.provider_profile?.city ?? null,
            price: formatPrice(service.price_cents),
            duration: `${service.duration_minutes} min`,
            imageUrl: service.cover_image_url,
          }))}
        />
        <HomeMarketplaceSection services={homepageServices} />
        <HomeFoundationSections />
      </main>
    </div>
  );
}
