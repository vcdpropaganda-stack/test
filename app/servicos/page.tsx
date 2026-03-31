import type { Metadata } from "next";
import { ServicesCatalog } from "@/components/marketplace/services-catalog";
import {
  getMarketplaceCategories,
  getMarketplaceCities,
  getMarketplaceServices,
} from "@/lib/marketplace";

export const metadata: Metadata = {
  title: "Serviços | VLservice",
  description:
    "Explore os serviços publicados no marketplace VLservice.",
};

export const revalidate = 300;

export default async function ServicesPage() {
  const [services, cities, categories] = await Promise.all([
    getMarketplaceServices({
      sort: "recent",
      includeRatings: false,
    }),
    getMarketplaceCities(),
    getMarketplaceCategories(),
  ]);

  return <ServicesCatalog services={services} cities={cities} categories={categories} />;
}
