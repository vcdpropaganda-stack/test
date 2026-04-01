import type { SupabaseClient } from "@supabase/supabase-js";

export const FREE_PROVIDER_JOB_BIDS_PER_DAY = 5;
export const PAID_PROVIDER_JOB_BID_PACK_SIZE = 20;
export const PAID_PROVIDER_JOB_BID_PACK_PRICE_CENTS = 1000;
export const PROVIDER_PLAN_CATALOG = [
  {
    key: "basic",
    label: "Básico",
    priceCents: 7500,
    serviceLimitText: "3 serviços no catálogo",
    quoteLimitText: "50 orçamentos/mês",
    description: "Para começar a operar e testar demanda sem complexidade.",
    features: [
      "3 serviços ativos no catálogo",
      "50 orçamentos por mês",
      "Agenda integrada",
      "Perfil público",
    ],
  },
  {
    key: "pro",
    label: "Pro",
    priceCents: 36000,
    serviceLimitText: "10 serviços no catálogo",
    quoteLimitText: "150 orçamentos/mês",
    description: "Para prestadores com operação recorrente e volume intermediário.",
    features: [
      "10 serviços ativos no catálogo",
      "150 orçamentos por mês",
      "Agenda integrada",
      "Perfil público",
    ],
  },
  {
    key: "premium",
    label: "Avançado",
    priceCents: 72000,
    serviceLimitText: "Serviços ilimitados",
    quoteLimitText: "Orçamentos ilimitados",
    description: "Para quem quer escalar sem travas de catálogo ou volume.",
    features: [
      "Serviços ilimitados no catálogo",
      "Orçamentos ilimitados",
      "Agenda integrada",
      "Perfil público",
    ],
  },
] as const;

export type ProviderPlanKey = (typeof PROVIDER_PLAN_CATALOG)[number]["key"];

export type ProviderJobBidAllowance = {
  free_daily_limit: number;
  free_used_today: number;
  free_remaining_today: number;
  paid_pack_size: number;
  paid_pack_price_cents: number;
  paid_credits_available: number;
};

function formatCurrencyFromCents(
  cents: number,
  digits: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: digits.minimumFractionDigits ?? 0,
    maximumFractionDigits: digits.maximumFractionDigits ?? 0,
  }).format(cents / 100);
}

function getProviderPlanConfig(plan: string | null | undefined) {
  return (
    PROVIDER_PLAN_CATALOG.find((item) => item.key === plan) ??
    PROVIDER_PLAN_CATALOG[0]
  );
}

export async function getProviderJobBidAllowance(
  supabase: SupabaseClient,
  providerProfileId: string
) {
  const result = await supabase
    .rpc("get_provider_job_bid_allowance", {
      provider_profile_uuid: providerProfileId,
    })
    .single();

  if (result.error || !result.data) {
    return null;
  }

  return result.data as ProviderJobBidAllowance;
}

export function getProviderBidPricingSummaryText() {
  return `${FREE_PROVIDER_JOB_BIDS_PER_DAY} lances grátis por dia • ${PAID_PROVIDER_JOB_BID_PACK_SIZE} extras por ${formatCurrencyFromCents(PAID_PROVIDER_JOB_BID_PACK_PRICE_CENTS)}`;
}

export function getProviderBidPackPriceText() {
  return `${PAID_PROVIDER_JOB_BID_PACK_SIZE} lances por ${formatCurrencyFromCents(PAID_PROVIDER_JOB_BID_PACK_PRICE_CENTS)}`;
}

export function getProviderBidBalanceText(
  allowance: Pick<
    ProviderJobBidAllowance,
    "free_remaining_today" | "paid_credits_available"
  > | null
) {
  if (!allowance) {
    return getProviderBidPricingSummaryText();
  }

  if (allowance.free_remaining_today > 0) {
    return `${allowance.free_remaining_today} lance(s) grátis restantes hoje`;
  }

  if (allowance.paid_credits_available > 0) {
    return `${allowance.paid_credits_available} lance(s) disponíveis no pacote pago`;
  }

  return `Você usou os ${FREE_PROVIDER_JOB_BIDS_PER_DAY} grátis de hoje. O próximo lance abre ${getProviderBidPackPriceText()}.`;
}

export function getProviderPlanLabel(plan: string | null | undefined) {
  return getProviderPlanConfig(plan).label;
}

export function getMonthlyQuoteLimitText(plan: string | null | undefined) {
  return getProviderPlanConfig(plan).quoteLimitText;
}

export function getProviderServiceLimitText(plan: string | null | undefined) {
  return getProviderPlanConfig(plan).serviceLimitText;
}

export function getProviderPlanPriceText(plan: string | null | undefined) {
  return formatCurrencyFromCents(getProviderPlanConfig(plan).priceCents, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
