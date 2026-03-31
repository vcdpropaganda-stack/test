import { unstable_cache } from "next/cache";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv, hasSupabaseEnv } from "@/lib/env";

export type JobStatus =
  | "open"
  | "has_bids"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "expired";

export type JobBidStatus = "submitted" | "accepted" | "rejected" | "withdrawn";

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

type RawProviderProfile =
  | {
      id?: string;
      display_name?: string | null;
      public_slug?: string | null;
      city?: string | null;
      state?: string | null;
    }
  | Array<{
      id?: string;
      display_name?: string | null;
      public_slug?: string | null;
      city?: string | null;
      state?: string | null;
    }>
  | null;

export type JobSummary = {
  id: string;
  client_id: string;
  title: string;
  slug: string;
  description: string;
  city: string;
  neighborhood: string | null;
  budget_min_cents: number | null;
  budget_max_cents: number | null;
  desired_deadline_at: string | null;
  status: JobStatus;
  expires_at: string;
  created_at: string;
  category: {
    name: string;
    slug: string;
  } | null;
};

export type JobBid = {
  id: string;
  job_id: string;
  provider_profile_id: string;
  amount_cents: number;
  estimated_days: number | null;
  message: string;
  status: JobBidStatus;
  created_at: string;
  provider_profile: {
    id?: string;
    display_name: string;
    public_slug?: string | null;
    city: string | null;
    state: string | null;
  } | null;
  average_rating: number | null;
  reviews_count: number;
};

export type JobDetail = JobSummary & {
  hired_bid_id: string | null;
  bids: JobBid[];
};

function normalizeCategory<T extends { category?: RawCategory }>(value: T) {
  const category = Array.isArray(value.category) ? value.category[0] ?? null : value.category ?? null;

  return {
    ...value,
    category: category
      ? {
          name: category.name ?? "Sem categoria",
          slug: category.slug ?? "",
        }
      : null,
  };
}

function normalizeProviderProfile<T extends { provider_profile?: RawProviderProfile }>(value: T) {
  const providerProfile = Array.isArray(value.provider_profile)
    ? value.provider_profile[0] ?? null
    : value.provider_profile ?? null;

  return {
    ...value,
    provider_profile: providerProfile
      ? {
          id: providerProfile.id,
          display_name: providerProfile.display_name ?? "Prestador",
          public_slug: providerProfile.public_slug ?? null,
          city: providerProfile.city ?? null,
          state: providerProfile.state ?? null,
        }
      : null,
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

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatJobBudget(job: {
  budget_min_cents: number | null;
  budget_max_cents: number | null;
}) {
  if (job.budget_min_cents !== null && job.budget_max_cents !== null) {
    if (job.budget_min_cents === job.budget_max_cents) {
      return formatCurrency(job.budget_min_cents);
    }

    return `${formatCurrency(job.budget_min_cents)} a ${formatCurrency(job.budget_max_cents)}`;
  }

  if (job.budget_min_cents !== null) {
    return `A partir de ${formatCurrency(job.budget_min_cents)}`;
  }

  if (job.budget_max_cents !== null) {
    return `Até ${formatCurrency(job.budget_max_cents)}`;
  }

  return "Orçamento a combinar";
}

export function formatJobLocation(job: { city: string; neighborhood: string | null }) {
  return job.neighborhood ? `${job.neighborhood}, ${job.city}` : job.city;
}

export function getJobStatusLabel(status: JobStatus) {
  switch (status) {
    case "open":
      return "Aberto";
    case "has_bids":
      return "Com lances";
    case "in_progress":
      return "Em andamento";
    case "completed":
      return "Concluído";
    case "cancelled":
      return "Cancelado";
    case "expired":
      return "Expirado";
    default:
      return status;
  }
}

export function getJobBidStatusLabel(status: JobBidStatus) {
  switch (status) {
    case "submitted":
      return "Proposta enviada";
    case "accepted":
      return "Prestador contratado";
    case "rejected":
      return "Não selecionado";
    case "withdrawn":
      return "Proposta retirada";
    default:
      return status;
  }
}

export function getJobStatusClasses(status: JobStatus) {
  switch (status) {
    case "open":
      return "bg-emerald-50 text-emerald-700";
    case "has_bids":
      return "bg-primary-soft text-primary-strong";
    case "in_progress":
      return "bg-amber-50 text-amber-700";
    case "completed":
      return "bg-slate-900 text-white";
    case "cancelled":
    case "expired":
      return "bg-slate-200 text-slate-700";
    default:
      return "bg-slate-200 text-slate-700";
  }
}

async function getOpenJobsQuery(limit = 12) {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const supabase = createPublicSupabaseClient();
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
      id,
      client_id,
      title,
      slug,
      description,
      city,
      neighborhood,
      budget_min_cents,
      budget_max_cents,
      desired_deadline_at,
      status,
      expires_at,
      created_at,
      category:service_categories (
        name,
        slug
      )
    `
    )
    .in("status", ["open", "has_bids"])
    .gt("expires_at", nowIso)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return [];
  }

  return ((data ?? []).map((job) => normalizeCategory(job)) ?? []) as JobSummary[];
}

const getCachedOpenJobs = unstable_cache(
  async (limit: number) => getOpenJobsQuery(limit),
  ["open-jobs"],
  { revalidate: 60 }
);

export async function getOpenJobs(limit = 12) {
  return getCachedOpenJobs(limit);
}

export async function getJobDetailForViewer(
  supabase: SupabaseClient,
  slug: string
) {
  const { data: jobData, error: jobError } = await supabase
    .from("jobs")
    .select(
      `
      id,
      client_id,
      title,
      slug,
      description,
      city,
      neighborhood,
      budget_min_cents,
      budget_max_cents,
      desired_deadline_at,
      status,
      expires_at,
      created_at,
      hired_bid_id,
      category:service_categories (
        name,
        slug
      )
    `
    )
    .eq("slug", slug)
    .maybeSingle();

  if (jobError || !jobData) {
    return null;
  }

  const normalizedJob = normalizeCategory(jobData) as JobSummary & {
    hired_bid_id: string | null;
  };

  const { data: bidsData } = await supabase
    .from("job_bids")
    .select(
      `
      id,
      job_id,
      provider_profile_id,
      amount_cents,
      estimated_days,
      message,
      status,
      created_at,
      provider_profile:provider_profiles (
        id,
        display_name,
        public_slug,
        city,
        state
      )
    `
    )
    .eq("job_id", normalizedJob.id)
    .order("amount_cents", { ascending: true })
    .order("created_at", { ascending: true });

  const normalizedBids = ((bidsData ?? []).map((bid) =>
    normalizeProviderProfile(bid)
  ) ?? []) as Array<
    Omit<JobBid, "average_rating" | "reviews_count"> & {
      average_rating?: number | null;
      reviews_count?: number;
    }
  >;

  const providerProfileIds = normalizedBids
    .map((bid) => bid.provider_profile_id)
    .filter(Boolean);

  let ratingMap = new Map<string, { total: number; count: number }>();

  if (providerProfileIds.length > 0) {
    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("provider_profile_id, rating")
      .in("provider_profile_id", providerProfileIds);

    ratingMap = (reviewsData ?? []).reduce((map, review) => {
      const current = map.get(review.provider_profile_id) ?? { total: 0, count: 0 };
      map.set(review.provider_profile_id, {
        total: current.total + review.rating,
        count: current.count + 1,
      });
      return map;
    }, new Map<string, { total: number; count: number }>());
  }

  return {
    ...normalizedJob,
    bids: normalizedBids.map((bid) => {
      const ratingStats = ratingMap.get(bid.provider_profile_id);

      return {
        ...bid,
        average_rating: ratingStats
          ? Number((ratingStats.total / ratingStats.count).toFixed(1))
          : null,
        reviews_count: ratingStats?.count ?? 0,
      };
    }),
  } as JobDetail;
}
