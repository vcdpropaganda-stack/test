import { createSupabaseServerClient } from "@/lib/supabase/server";

type ConversationContext = {
  serviceId: string;
  providerProfileId: string;
  clientId: string;
  bookingId?: string | null;
};

export async function ensureConversation({
  serviceId,
  providerProfileId,
  clientId,
  bookingId = null,
}: ConversationContext) {
  const supabase = await createSupabaseServerClient();

  if (bookingId) {
    const existingByBooking = await supabase
      .from("conversations")
      .select("id")
      .eq("booking_id", bookingId)
      .limit(1)
      .maybeSingle();

    if (existingByBooking.data?.id) {
      return existingByBooking.data.id;
    }
  }

  const existing = await supabase
    .from("conversations")
    .select("id, booking_id")
    .eq("service_id", serviceId)
    .eq("provider_profile_id", providerProfileId)
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing.data?.id) {
    if (bookingId && !existing.data.booking_id) {
      await supabase
        .from("conversations")
        .update({ booking_id: bookingId })
        .eq("id", existing.data.id);
    }

    return existing.data.id;
  }

  if (!bookingId) {
    const providerPlanResult = await supabase
      .from("provider_profiles")
      .select("plan")
      .eq("id", providerProfileId)
      .maybeSingle();

    const providerPlan = providerPlanResult.data?.plan ?? "basic";
    const limitsResult = await supabase
      .from("subscription_limits")
      .select("max_quote_requests_per_month")
      .eq("plan", providerPlan)
      .maybeSingle();

    const monthlyLimit = limitsResult.data?.max_quote_requests_per_month ?? null;

    if (monthlyLimit !== null) {
      const now = new Date();
      const monthStartUtc = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0)
      );

      const monthlyQuotesCount = await supabase
        .from("conversations")
        .select("id", { count: "exact", head: true })
        .eq("provider_profile_id", providerProfileId)
        .is("booking_id", null)
        .gte("created_at", monthStartUtc.toISOString());

      if ((monthlyQuotesCount.count ?? 0) >= monthlyLimit) {
        throw new Error("provider_monthly_quote_limit_reached");
      }
    }
  }

  const created = await supabase
    .from("conversations")
    .insert({
      service_id: serviceId,
      provider_profile_id: providerProfileId,
      client_id: clientId,
      booking_id: bookingId,
    })
    .select("id")
    .single();

  if (created.error || !created.data) {
    throw new Error("conversation_create_failed");
  }

  return created.data.id;
}

export async function postSystemConversationMessage(params: {
  conversationId: string;
  senderId: string;
  kind: "system" | "whatsapp_request" | "whatsapp_share";
  body: string;
}) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("conversation_messages").insert({
    conversation_id: params.conversationId,
    sender_id: params.senderId,
    kind: params.kind,
    body: params.body,
  });
}

export const WHATSAPP_REQUEST_FEE_CENTS = 200;

export async function createWhatsappRequestCharge(params: {
  conversationId: string;
  clientId: string;
  amountCents?: number;
}) {
  const supabase = await createSupabaseServerClient();
  const amountCents = params.amountCents ?? WHATSAPP_REQUEST_FEE_CENTS;

  const { error } = await supabase.from("whatsapp_request_charges").insert({
    conversation_id: params.conversationId,
    client_id: params.clientId,
    amount_cents: amountCents,
    status: "paid",
    payment_reference: `prototype_wpp_${Date.now()}`,
  });

  if (error) {
    throw new Error("whatsapp_charge_failed");
  }
}
