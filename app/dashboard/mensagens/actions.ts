"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { moderateConversationByAdmin, sendConversationMessage } from "@/lib/chat";
import { SUPABASE_ENV_MISSING_MESSAGE, hasSupabaseEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function sendConversationMessageAction(formData: FormData) {
  const conversationId = String(formData.get("conversation_id") ?? "").trim();
  const body = String(formData.get("body") ?? "");

  if (!conversationId || !body.trim()) {
    redirect("/dashboard/mensagens?message=Mensagem inválida.");
  }

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

  try {
    const result = await sendConversationMessage(supabase, user, conversationId, body);
    revalidatePath(`/dashboard/mensagens/${conversationId}`);
    revalidatePath("/dashboard/mensagens");
    revalidatePath("/dashboard/admin");
    if (result.moderation.wasRedacted) {
      redirect(
        `/dashboard/mensagens/${conversationId}?message=Detectamos telefone ou contato na mensagem e mascaramos automaticamente para proteger a conversa.`
      );
    }
    redirect(`/dashboard/mensagens/${conversationId}`);
  } catch (error) {
    if (error instanceof Error && error.message === "conversation_not_found") {
      redirect("/dashboard/mensagens?message=Conversa não encontrada.");
    }
    if (error instanceof Error && error.message === "conversation_forbidden") {
      redirect("/dashboard?message=Acesso negado à conversa.");
    }
    if (error instanceof Error && error.message === "conversation_closed") {
      redirect(`/dashboard/mensagens/${conversationId}?message=Esta conversa foi encerrada.`);
    }
    redirect(`/dashboard/mensagens/${conversationId}?message=Não foi possível enviar a mensagem.`);
  }
}

export async function updateConversationAdminAction(formData: FormData) {
  const conversationId = String(formData.get("conversation_id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const moderationStatus = String(formData.get("moderation_status") ?? "clear").trim();
  const reason = String(formData.get("reason") ?? "").trim();

  if (!conversationId || !["open", "closed"].includes(status)) {
    redirect("/dashboard/admin?message=Ação de conversa inválida.");
  }

  if (!["clear", "flagged", "restricted"].includes(moderationStatus) || !reason) {
    redirect("/dashboard/admin?message=Informe um motivo e um status de moderação válidos.");
  }

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

  const profileResult = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileResult.data?.role !== "admin") {
    redirect("/dashboard");
  }

  try {
    await moderateConversationByAdmin(supabase, user.id, conversationId, {
      status: status as "open" | "closed",
      moderationStatus: moderationStatus as "clear" | "flagged" | "restricted",
      reason,
    });
  } catch {
    redirect("/dashboard/admin?message=Não foi possível atualizar a conversa.");
  }

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/mensagens");
  redirect(
    `/dashboard/admin?message=${encodeURIComponent(
      status === "closed" ? "Conversa encerrada com sucesso." : "Conversa reaberta com sucesso."
    )}`
  );
}
