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
