"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { moderateOutgoingChatMessage } from "@/lib/chat-moderation";
import { SUPABASE_ENV_MISSING_MESSAGE, hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getConversationParticipantContext(conversationId: string) {
  if (!hasSupabaseEnv()) {
    redirect(`/login?message=${encodeURIComponent(SUPABASE_ENV_MISSING_MESSAGE)}`);
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const conversationResult = await supabase
    .from("conversations")
    .select("id, client_id, provider_profile_id, booking_id, status")
    .eq("id", conversationId)
    .single();

  if (conversationResult.error || !conversationResult.data) {
    redirect("/dashboard/mensagens?message=Conversa não encontrada.");
  }

  const providerResult = await supabase
    .from("provider_profiles")
    .select("id, profile_id, whatsapp_number")
    .eq("id", conversationResult.data.provider_profile_id)
    .maybeSingle();

  const isClient = conversationResult.data.client_id === user.id;
  const isProvider = providerResult.data?.profile_id === user.id;

  if (!isClient && !isProvider) {
    redirect("/dashboard?message=Acesso negado à conversa.");
  }

  return {
    supabase,
    user,
    conversation: conversationResult.data,
    providerProfile: providerResult.data ?? null,
    isClient,
    isProvider,
  };
}

export async function sendConversationMessageAction(formData: FormData) {
  const conversationId = String(formData.get("conversation_id") ?? "").trim();
  const body = String(formData.get("body") ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();

  if (!conversationId || !body) {
    redirect("/dashboard/mensagens?message=Mensagem inválida.");
  }

  const { supabase, user, conversation } = await getConversationParticipantContext(conversationId);

  if (conversation.status === "closed") {
    redirect(`/dashboard/mensagens/${conversationId}?message=Esta conversa foi encerrada.`);
  }

  const moderation = moderateOutgoingChatMessage(body);
  const sanitizedBody = moderation.sanitizedBody.trim();

  if (!sanitizedBody) {
    redirect(`/dashboard/mensagens/${conversationId}?message=Mensagem inválida.`);
  }

  const { error } = await supabase.from("conversation_messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    kind: "text",
    body: sanitizedBody,
  });

  if (error) {
    redirect(`/dashboard/mensagens/${conversationId}?message=Não foi possível enviar a mensagem.`);
  }

  revalidatePath(`/dashboard/mensagens/${conversationId}`);
  revalidatePath("/dashboard/mensagens");
  if (moderation.wasRedacted) {
    redirect(
      `/dashboard/mensagens/${conversationId}?message=Detectamos telefone ou contato na mensagem e mascaramos automaticamente para proteger a conversa.`
    );
  }

  redirect(`/dashboard/mensagens/${conversationId}`);
}
