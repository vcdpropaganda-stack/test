import { hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type MarketplaceService = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image_url: string | null;
  price_cents: number;
  duration_minutes: number;
  featured_rank: number | null;
  created_at: string;
  provider_profile: {
    id?: string;
    display_name: string;
    city: string | null;
    state: string | null;
  } | null;
  average_rating?: number | null;
  reviews_count?: number;
};

type MarketplaceFilters = {
  limit?: number;
  query?: string;
  city?: string;
  sort?: "recent" | "price_asc" | "price_desc";
};

type RawProviderProfile =
  | {
      display_name?: string | null;
      city?: string | null;
      state?: string | null;
      id?: string;
      bio?: string | null;
      is_verified?: boolean;
      plan?: string;
    }
  | Array<{
      display_name?: string | null;
      city?: string | null;
      state?: string | null;
      id?: string;
      bio?: string | null;
      is_verified?: boolean;
      plan?: string;
    }>
  | null;

function normalizeProviderProfile<T extends { provider_profile?: RawProviderProfile }>(
  service: T
) {
  const providerProfile = Array.isArray(service.provider_profile)
    ? service.provider_profile[0] ?? null
    : service.provider_profile ?? null;

  return {
    ...service,
    provider_profile: providerProfile,
  };
}

export async function getMarketplaceServices(
  filters: MarketplaceFilters | number = {}
) {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const resolvedFilters =
    typeof filters === "number" ? { limit: filters } : filters;
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("services")
    .select(
      `
      id,
      slug,
      title,
      description,
      cover_image_url,
      price_cents,
      duration_minutes,
      featured_rank,
      created_at,
      provider_profile:provider_profiles (
        display_name,
        city,
        state
      )
    `
    )
    .eq("is_active", true)
    .order("featured_rank", { ascending: true, nullsFirst: false });

  if (resolvedFilters.query) {
    query = query.or(
      `title.ilike.%${resolvedFilters.query}%,description.ilike.%${resolvedFilters.query}%`
    );
  }

  if (resolvedFilters.city) {
    query = query.eq("provider_profiles.city", resolvedFilters.city);
  }

  if (resolvedFilters.sort === "price_asc") {
    query = query.order("price_cents", { ascending: true });
  } else if (resolvedFilters.sort === "price_desc") {
    query = query.order("price_cents", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  if (resolvedFilters.limit) {
    query = query.limit(resolvedFilters.limit);
  }

  const { data, error } = await query;

  if (error) {
    return [];
  }

  const normalizedServices = ((data ?? []).map((service) =>
    normalizeProviderProfile(service)
  ) ?? []) as MarketplaceService[];
  const serviceIds = normalizedServices.map((service) => service.id);

  if (serviceIds.length === 0) {
    return normalizedServices;
  }

  const { data: reviews } = await supabase
    .from("reviews")
    .select("service_id, rating")
    .in("service_id", serviceIds);

  const reviewStats = new Map<
    string,
    {
      total: number;
      count: number;
    }
  >();

  (reviews ?? []).forEach((review) => {
    const current = reviewStats.get(review.service_id) ?? { total: 0, count: 0 };
    reviewStats.set(review.service_id, {
      total: current.total + review.rating,
      count: current.count + 1,
    });
  });

  return normalizedServices.map((service) => {
    const stats = reviewStats.get(service.id);
    return {
      ...service,
      average_rating: stats ? Number((stats.total / stats.count).toFixed(1)) : null,
      reviews_count: stats?.count ?? 0,
    };
  });
}

export async function getMarketplaceCities() {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const services = await getMarketplaceServices();
  return Array.from(
    new Set(
      services
        .map((service) => service.provider_profile?.city)
        .filter((city): city is string => Boolean(city))
    )
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export async function getMarketplaceServiceBySlug(slug: string) {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("services")
    .select(
      `
      id,
      slug,
      title,
      description,
      cover_image_url,
      price_cents,
      duration_minutes,
      featured_rank,
      created_at,
      provider_profile:provider_profiles (
        id,
        display_name,
        bio,
        city,
        state,
        is_verified,
        plan
      ),
      availability:service_availability (
        id,
        start_at,
        end_at,
        is_available
      )
    `
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    return null;
  }

  const normalized = normalizeProviderProfile(data);
  const { data: bookedSlots } = await supabase
    .from("bookings")
    .select("scheduled_start, scheduled_end, status")
    .eq("service_id", normalized.id)
    .in("status", ["pending", "confirmed"]);
  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      `
      id,
      rating,
      comment,
      created_at,
      client:profiles (full_name)
    `
    )
    .eq("service_id", normalized.id)
    .order("created_at", { ascending: false });

  const normalizedReviews = (reviews ?? []).map((review) => ({
    ...review,
    client: Array.isArray(review.client) ? review.client[0] ?? null : review.client,
  }));
  const averageRating =
    normalizedReviews.length > 0
      ? Number(
          (
            normalizedReviews.reduce((acc, review) => acc + review.rating, 0) /
            normalizedReviews.length
          ).toFixed(1)
        )
      : null;

  return {
    ...normalized,
    booked_slots: bookedSlots ?? [],
    reviews: normalizedReviews,
    average_rating: averageRating,
    reviews_count: normalizedReviews.length,
  };
}

export function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(priceCents / 100);
}

export function getServiceTag(service: MarketplaceService) {
  if (service.featured_rank !== null) {
    return "Em destaque";
  }

  const createdAt = new Date(service.created_at).getTime();
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  if (createdAt >= sevenDaysAgo) {
    return "Novo";
  }

  return "Disponivel";
}
