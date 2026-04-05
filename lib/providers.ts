import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/env";

export async function getProviderProfileBySlug(slug: string) {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const providerResult = await supabase
    .from("provider_profiles")
    .select(
      `
      id,
      profile_id,
      display_name,
      public_slug,
      bio,
      city,
      state,
      is_verified,
      plan,
      whatsapp_number,
      profile:profiles (
        full_name,
        avatar_url
      )
    `
    )
    .eq("public_slug", slug)
    .maybeSingle();

  if (providerResult.error || !providerResult.data) {
    return null;
  }

  const provider = {
    ...providerResult.data,
    profile: Array.isArray(providerResult.data.profile)
      ? providerResult.data.profile[0] ?? null
      : providerResult.data.profile,
  };

  const [servicesResult, reviewsResult] = await Promise.all([
    supabase
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
        category:service_categories (
          name,
          slug
        )
      `
      )
      .eq("provider_profile_id", provider.id)
      .eq("is_active", true)
      .order("featured_rank", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("reviews")
      .select("id, rating, comment, created_at, client:profiles(full_name)")
      .eq("provider_profile_id", provider.id)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const services = (servicesResult.data ?? []).map((service) => ({
    ...service,
    category: Array.isArray(service.category) ? service.category[0] ?? null : service.category,
  }));
  const reviews = (reviewsResult.data ?? []).map((review) => ({
    ...review,
    client: Array.isArray(review.client) ? review.client[0] ?? null : review.client,
  }));
  const averageRating =
    reviews.length > 0
      ? Number(
          (
            reviews.reduce((acc, review) => acc + review.rating, 0) /
            reviews.length
          ).toFixed(1)
        )
      : null;

  return {
    ...provider,
    services,
    reviews,
    averageRating,
    reviewsCount: reviews.length,
  };
}
