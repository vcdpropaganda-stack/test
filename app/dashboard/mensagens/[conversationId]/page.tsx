import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ChatShell } from "@/components/chat/chat-shell";
import { getResolvedUserRole } from "@/lib/auth";
import {
  type ConversationViewerRole,
  getConversationDetailForViewer,
  getConversationListForViewer,
  markConversationAsRead,
} from "@/lib/conversations";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Conversa | VLservice",
  description: "Conversa interna entre cliente e prestador.",
};

type ConversationDetailPageProps = {
  params: Promise<{ conversationId: string }>;
  searchParams: Promise<{ message?: string }>;
};

export default async function ConversationDetailPage({
  params,
  searchParams,
}: ConversationDetailPageProps) {
  const { conversationId } = await params;
  const { message } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const resolvedRole = (await getResolvedUserRole(supabase, user)) ?? "client";
  const role: ConversationViewerRole =
    resolvedRole === "provider" || resolvedRole === "admin" ? resolvedRole : "client";

  const [conversations, activeConversation] = await Promise.all([
    getConversationListForViewer(supabase, user, role),
    getConversationDetailForViewer(supabase, conversationId, user),
  ]);

  if (!activeConversation) {
    redirect("/dashboard/mensagens?message=Acesso negado ou conversa não encontrada.");
  }

  await markConversationAsRead(supabase, conversationId, user.id);

  return (
    <ChatShell
      role={role}
      conversations={conversations}
      activeConversation={activeConversation}
      notice={message ?? null}
    />
  );
}
