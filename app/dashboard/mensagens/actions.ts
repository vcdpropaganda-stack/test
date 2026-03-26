"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { postSystemConversationMessage } from "@/lib/conversations";
import { moderateOutgoingChatMessage } from "@/lib/chat-moderation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getConversationParticipantContext(conversationId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const conversationResult = await supabase
    .from("conversations")
    .select("id, client_id, provider_profile_id, booking_id")
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
  const body = String(formData.get("body") ?? "").trim();

  if (!conversationId || !body) {
    redirect("/dashboard/mensagens?message=Mensagem inválida.");
  }

  const { supabase, user } = await getConversationParticipantContext(conversationId);
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

export async function requestConversationWhatsappAction(formData: FormData) {
  const conversationId = String(formData.get("conversation_id") ?? "").trim();
  if (!conversationId) {
    redirect("/dashboard/mensagens?message=Conversa inválida.");
  }

  const { user, isClient } = await getConversationParticipantContext(conversationId);

  if (!isClient) {
    redirect(`/dashboard/mensagens/${conversationId}?message=Apenas clientes podem solicitar o WhatsApp.`);
  }

  await postSystemConversationMessage({
    conversationId,
    senderId: user.id,
    kind: "system",
    body: "Solicitação registrada. Por segurança, o chat bloqueia números e contatos diretos automaticamente.",
  });

  revalidatePath(`/dashboard/mensagens/${conversationId}`);
  redirect(`/dashboard/mensagens/${conversationId}?message=Solicitação registrada no histórico.`);
}

export async function shareConversationWhatsappAction(formData: FormData) {
  const conversationId = String(formData.get("conversation_id") ?? "").trim();
  if (!conversationId) {
    redirect("/dashboard/mensagens?message=Conversa inválida.");
  }

  const { user, isProvider } = await getConversationParticipantContext(conversationId);

  if (!isProvider) {
    redirect(`/dashboard/mensagens/${conversationId}?message=Apenas o prestador pode compartilhar o WhatsApp.`);
  }

  await postSystemConversationMessage({
    conversationId,
    senderId: user.id,
    kind: "system",
    body: "Compartilhamento de contato direto bloqueado pela política de segurança do chat.",
  });

  revalidatePath(`/dashboard/mensagens/${conversationId}`);
  redirect(
    `/dashboard/mensagens/${conversationId}?message=Este chat não permite compartilhamento de números de contato.`
  );
}
