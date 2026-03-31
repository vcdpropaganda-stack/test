import type { Metadata } from "next";
import { HomeFoundationSections } from "@/components/home/home-foundation-sections";
import { HomeHero } from "@/components/home/home-hero";
import { HomeServiceCategories } from "@/components/home/home-service-categories";
import { getMarketplaceCategories } from "@/lib/marketplace";

export const metadata: Metadata = {
  title: "VLservice | Peça um serviço e receba propostas",
  description:
    "Descreva o serviço que você precisa, receba propostas de profissionais e contrate com clareza.",
};

export const revalidate = 180;

export default async function Home() {
  const categories = await getMarketplaceCategories();
  const featuredCategories = categories.slice(0, 12);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main id="conteudo" className="flex-1">
        <HomeHero
          categoryCount={categories.length}
          featuredCategories={featuredCategories.slice(0, 6)}
        />
        <HomeServiceCategories categories={featuredCategories} />
        <HomeFoundationSections />
      </main>
    </div>
  );
}
