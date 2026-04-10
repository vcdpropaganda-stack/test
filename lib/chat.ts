import { moderateOutgoingChatMessage } from "@/lib/chat-moderation";
import type { SupabaseClient, User } from "@supabase/supabase-js";

type ConversationParticipantContext = {
  conversation: {
    id: string;
    client_id: string;
    provider_profile_id: string;
    booking_id: string | null;
    status: "open" | "closed";
  };
  isAdmin: boolean;
  isClient: boolean;
  isProvider: boolean;
  providerProfile: {
    id: string;
    profile_id: string;
    whatsapp_number: string | null;
  } | null;
};

export async function getConversationParticipantContext(
  supabase: SupabaseClient,
  user: User,
  conversationId: string
) {
  const [conversationResult, profileResult] = await Promise.all([
    supabase
      .from("conversations")
      .select("id, client_id, provider_profile_id, booking_id, status")
      .eq("id", conversationId)
      .single(),
    supabase.from("profiles").select("role").eq("id", user.id).maybeSingle(),
  ]);

  if (conversationResult.error || !conversationResult.data) {
    throw new Error("conversation_not_found");
  }

  const providerResult = await supabase
    .from("provider_profiles")
    .select("id, profile_id, whatsapp_number")
    .eq("id", conversationResult.data.provider_profile_id)
    .maybeSingle();

  const isClient = conversationResult.data.client_id === user.id;
  const isProvider = providerResult.data?.profile_id === user.id;
  const isAdmin = profileResult.data?.role === "admin";

  if (!isClient && !isProvider && !isAdmin) {
    throw new Error("conversation_forbidden");
  }

  return {
    conversation: conversationResult.data,
    providerProfile: providerResult.data ?? null,
    isAdmin,
    isClient,
    isProvider,
  } satisfies ConversationParticipantContext;
}

export async function sendConversationMessage(
  supabase: SupabaseClient,
  user: User,
  conversationId: string,
  body: string
) {
  const normalizedBody = body
    .replace(/\r\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();

  if (!conversationId || !normalizedBody) {
    throw new Error("message_invalid");
  }

  const context = await getConversationParticipantContext(supabase, user, conversationId);

  if (context.conversation.status === "closed") {
    throw new Error("conversation_closed");
  }

  const moderation = moderateOutgoingChatMessage(normalizedBody);
  const sanitizedBody = moderation.sanitizedBody.trim();

  if (!sanitizedBody) {
    throw new Error("message_invalid");
  }

  const { error } = await supabase.from("conversation_messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    kind: "text",
    body: sanitizedBody,
  });

  if (error) {
    throw new Error("message_send_failed");
  }

  return {
    moderation,
    conversation: context.conversation,
  };
}

export async function updateConversationStatus(
  supabase: SupabaseClient,
  conversationId: string,
  status: "open" | "closed"
) {
  const { error } = await supabase
    .from("conversations")
    .update({ status })
    .eq("id", conversationId);

  if (error) {
    throw new Error("conversation_update_failed");
  }
}

export async function moderateConversationByAdmin(
  supabase: SupabaseClient,
  adminUserId: string,
  conversationId: string,
  input: {
    status: "open" | "closed";
    moderationStatus: "clear" | "flagged" | "restricted";
    reason: string;
  }
) {
  const reason = input.reason.trim();

  if (!reason) {
    throw new Error("moderation_reason_required");
  }

  const updateResult = await supabase
    .from("conversations")
    .update({
      status: input.status,
      moderation_status: input.moderationStatus,
      moderation_reason: reason,
      moderated_by: adminUserId,
      moderated_at: new Date().toISOString(),
    })
    .eq("id", conversationId)
    .select("id, client_id, provider_profile_id")
    .single();

  if (updateResult.error || !updateResult.data) {
    throw new Error("conversation_update_failed");
  }

  const systemBody =
    input.status === "closed"
      ? `Conversa encerrada pela administração: ${reason}`
      : `Conversa atualizada pela administração: ${reason}`;

  const [systemMessageResult, auditLogResult] = await Promise.all([
    supabase.from("conversation_messages").insert({
      conversation_id: conversationId,
      sender_id: adminUserId,
      kind: "system",
      body: systemBody,
    }),
    supabase.from("admin_audit_logs").insert({
      admin_user_id: adminUserId,
      entity_type: "conversation",
      entity_id: conversationId,
      action: input.status === "closed" ? "conversation_closed" : "conversation_reopened",
      reason,
      metadata: {
        moderation_status: input.moderationStatus,
      },
    }),
  ]);

  if (systemMessageResult.error || auditLogResult.error) {
    throw new Error("conversation_audit_failed");
  }
}
