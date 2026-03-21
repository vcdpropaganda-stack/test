import { NextResponse } from "next/server";
import { formatPrice, searchMarketplaceServices } from "@/lib/marketplace";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  const services = await searchMarketplaceServices(query, 6);

  return NextResponse.json({
    results: services.map((service) => ({
      id: service.id,
      slug: service.slug,
      title: service.title,
      provider: service.provider_profile?.display_name ?? "Prestador Vitrine Lojas",
      city: service.provider_profile?.city ?? null,
      price: formatPrice(service.price_cents),
      duration: `${service.duration_minutes} min`,
      imageUrl: service.cover_image_url,
    })),
  });
}
