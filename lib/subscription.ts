import type { SupabaseClient } from "@supabase/supabase-js";

export const FREE_PROVIDER_JOB_BIDS_PER_DAY = 5;
export const PAID_PROVIDER_JOB_BID_PACK_SIZE = 20;
export const PAID_PROVIDER_JOB_BID_PACK_PRICE_CENTS = 1000;

export type ProviderJobBidAllowance = {
  free_daily_limit: number;
  free_used_today: number;
  free_remaining_today: number;
  paid_pack_size: number;
  paid_pack_price_cents: number;
  paid_credits_available: number;
};

function formatCurrencyFromCents(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(cents / 100);
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
  if (plan === "pro") return "Pro";
  if (plan === "premium") return "Avançado";
  return "Básico";
}

export function getMonthlyQuoteLimitText(plan: string | null | undefined) {
  if (plan === "pro") return "150 orçamentos/mês";
  if (plan === "premium") return "Orçamentos ilimitados";
  return "50 orçamentos/mês";
}
