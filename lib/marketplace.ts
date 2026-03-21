import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv, hasSupabaseEnv } from "@/lib/env";

export type MarketplaceService = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image_url: string | null;
  category: {
    name: string;
    slug: string;
  } | null;
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

export type MarketplaceSearchResult = {
  id: string;
  slug: string;
  title: string;
  cover_image_url: string | null;
  price_cents: number;
  duration_minutes: number;
  provider_profile: {
    display_name: string;
    city: string | null;
  } | null;
};

type MarketplaceFilters = {
  limit?: number;
  query?: string;
  city?: string;
  category?: string;
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

type RawCategory =
  | {
      name?: string | null;
      slug?: string | null;
    }
  | Array<{
      name?: string | null;
      slug?: string | null;
    }>
  | null;

function normalizeCategory<T extends { category?: RawCategory }>(service: T) {
  const category = Array.isArray(service.category)
    ? service.category[0] ?? null
    : service.category ?? null;

  return {
    ...service,
    category,
  };
}

function createPublicSupabaseClient() {
  const { url, anonKey } = getSupabaseEnv();

  if (!url || !anonKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function getMarketplaceServicesQuery(
  filters: MarketplaceFilters | number = {}
) {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const resolvedFilters =
    typeof filters === "number" ? { limit: filters } : filters;
  const supabase = createPublicSupabaseClient();
  let query = supabase
    .from("services")
    .select(
      `
      id,
      slug,
      title,
      description,
      cover_image_url,
      category:service_categories (
        name,
        slug
      ),
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

  if (resolvedFilters.category) {
    query = query.eq("service_categories.slug", resolvedFilters.category);
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
    normalizeCategory(normalizeProviderProfile(service))
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

const getCachedMarketplaceServices = unstable_cache(
  async (serializedFilters: string) => {
    const parsedFilters = JSON.parse(serializedFilters) as MarketplaceFilters | number;
    return getMarketplaceServicesQuery(parsedFilters);
  },
  ["marketplace-services"],
  { revalidate: 180 }
);

export async function getMarketplaceServices(
  filters: MarketplaceFilters | number = {}
) {
  return getCachedMarketplaceServices(JSON.stringify(filters));
}

export async function searchMarketplaceServices(query: string, limit = 5) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  return getCachedMarketplaceSearchResults(normalizedQuery, limit);
}

const getCachedMarketplaceSearchResults = unstable_cache(
  async (query: string, limit: number) => {
    if (!hasSupabaseEnv()) {
      return [];
    }

    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("services")
      .select(
        `
        id,
        slug,
        title,
        cover_image_url,
        price_cents,
        duration_minutes,
        provider_profile:provider_profiles (
          display_name,
          city
        )
      `
      )
      .eq("is_active", true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order("featured_rank", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return [];
    }

    return ((data ?? []).map((service) =>
      normalizeProviderProfile(service)
    ) ?? []) as MarketplaceSearchResult[];
  },
  ["marketplace-search-results"],
  { revalidate: 120 }
);

const getCachedMarketplaceServiceMetaBySlug = unstable_cache(
  async (slug: string) => {
    if (!hasSupabaseEnv()) {
      return null;
    }

    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("services")
      .select("title, description")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) {
      return null;
    }

    return data;
  },
  ["marketplace-service-meta-by-slug"],
  { revalidate: 300 }
);

export async function getMarketplaceServiceMetaBySlug(slug: string) {
  return getCachedMarketplaceServiceMetaBySlug(slug);
}

const getCachedMarketplaceCities = unstable_cache(
  async () => {
    if (!hasSupabaseEnv()) {
      return [];
    }

    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("provider_profiles")
      .select("city")
      .not("city", "is", null)
      .order("city", { ascending: true });

    if (error) {
      return [];
    }

    return Array.from(
      new Set(
        (data ?? [])
          .map((profile) => profile.city)
          .filter((city): city is string => Boolean(city))
      )
    ).sort((a, b) => a.localeCompare(b, "pt-BR"));
  },
  ["marketplace-cities"],
  { revalidate: 600 }
);

export async function getMarketplaceCities() {
  return getCachedMarketplaceCities();
}

const getCachedMarketplaceCategories = unstable_cache(
  async () => {
    if (!hasSupabaseEnv()) {
      return [];
    }

    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("service_categories")
      .select("name, slug")
      .order("name", { ascending: true });

    if (error) {
      return [];
    }

    return data ?? [];
  },
  ["marketplace-categories"],
  { revalidate: 600 }
);

export async function getMarketplaceCategories() {
  return getCachedMarketplaceCategories();
}

const getCachedMarketplaceSlugs = unstable_cache(
  async () => {
    if (!hasSupabaseEnv()) {
      return [];
    }

    const { url, anonKey } = getSupabaseEnv();

    if (!url || !anonKey) {
      return [];
    }

    const supabase = createPublicSupabaseClient();

    const { data, error } = await supabase
      .from("services")
      .select("slug")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      return [];
    }

    return (data ?? []).map((service) => service.slug).filter(Boolean);
  },
  ["marketplace-service-slugs"],
  { revalidate: 600 }
);

export async function getMarketplaceServiceSlugs() {
  return getCachedMarketplaceSlugs();
}

const getCachedMarketplacePreviewSlugs = unstable_cache(
  async (limit: number) => {
    if (!hasSupabaseEnv()) {
      return [];
    }

    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("services")
      .select("slug, featured_rank, created_at")
      .eq("is_active", true)
      .order("featured_rank", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return [];
    }

    return (data ?? []).map((service) => service.slug).filter(Boolean);
  },
  ["marketplace-preview-slugs"],
  { revalidate: 600 }
);

export async function getMarketplacePreviewSlugs(limit = 8) {
  return getCachedMarketplacePreviewSlugs(limit);
}

const getCachedMarketplaceServiceBySlug = unstable_cache(
  async (slug: string) => {
    if (!hasSupabaseEnv()) {
      return null;
    }

    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("services")
      .select(
        `
        id,
        slug,
        title,
        description,
        cover_image_url,
        category:service_categories (
          name,
          slug
        ),
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

    const normalized = normalizeCategory(normalizeProviderProfile(data));
    const [bookedSlotsResult, reviewsResult] = await Promise.all([
      supabase
        .from("bookings")
        .select("scheduled_start, scheduled_end, status")
        .eq("service_id", normalized.id)
        .gte(
          "scheduled_start",
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        )
        .in("status", ["pending", "confirmed"]),
      supabase
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
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    const normalizedReviews = (reviewsResult.data ?? []).map((review) => ({
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
      booked_slots: bookedSlotsResult.data ?? [],
      reviews: normalizedReviews,
      average_rating: averageRating,
      reviews_count: normalizedReviews.length,
    };
  },
  ["marketplace-service-by-slug"],
  { revalidate: 120 }
);

export async function getMarketplaceServiceBySlug(slug: string) {
  return getCachedMarketplaceServiceBySlug(slug);
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

  return "Disponível";
}
