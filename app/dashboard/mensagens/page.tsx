import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ChatShell } from "@/components/chat/chat-shell";
import { ensureConversation } from "@/lib/conversations";
import { getResolvedUserRole } from "@/lib/auth";
import {
  type ConversationViewerRole,
  getConversationListForViewer,
} from "@/lib/conversations";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mensagens | VLservice",
  description: "Converse com clientes e prestadores dentro da plataforma.",
};

type MessagesPageProps = {
  searchParams: Promise<{
    booking?: string;
    service?: string;
    provider?: string;
    request_wpp?: string;
    message?: string;
  }>;
};

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const params = await searchParams;
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

  if (params.booking) {
    const bookingResult = await supabase
      .from("bookings")
      .select("id, service_id, client_id, provider_profile_id")
      .eq("id", params.booking)
      .single();

    if (bookingResult.data) {
      const providerOwner = await supabase
        .from("provider_profiles")
        .select("profile_id")
        .eq("id", bookingResult.data.provider_profile_id)
        .maybeSingle();

      const canAccess =
        bookingResult.data.client_id === user.id ||
        providerOwner.data?.profile_id === user.id ||
        role === "admin";

      if (canAccess) {
        let conversationId = "";

        try {
          conversationId = await ensureConversation({
            bookingId: bookingResult.data.id,
            serviceId: bookingResult.data.service_id,
            providerProfileId: bookingResult.data.provider_profile_id,
            clientId: bookingResult.data.client_id,
          });
        } catch (error) {
          console.error("MessagesPage booking conversation failed", {
            bookingId: bookingResult.data.id,
            serviceId: bookingResult.data.service_id,
            providerProfileId: bookingResult.data.provider_profile_id,
            clientId: bookingResult.data.client_id,
            viewerId: user.id,
            error,
          });
          redirect(
            "/dashboard/mensagens?message=Não foi possível abrir a conversa deste agendamento agora. Tente novamente."
          );
        }

        redirect(`/dashboard/mensagens/${conversationId}`);
      }

      redirect("/dashboard/mensagens?message=Você não tem acesso a esta conversa.");
    }
  }

  if (params.service && params.provider) {
    if (role === "client") {
      let conversationId = "";

      try {
        conversationId = await ensureConversation({
          serviceId: params.service,
          providerProfileId: params.provider,
          clientId: user.id,
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "provider_monthly_quote_limit_reached"
        ) {
          redirect(
            "/dashboard/mensagens?message=Este prestador atingiu o limite mensal de orçamentos do plano atual."
          );
        }
        redirect(
          "/dashboard/mensagens?message=Não foi possível abrir a conversa agora. Tente novamente."
        );
      }

      if (params.request_wpp === "1") {
        redirect(
          `/dashboard/mensagens/${conversationId}?message=Este chat bloqueia compartilhamento de contatos diretos por segurança.`
        );
      }

      redirect(`/dashboard/mensagens/${conversationId}`);
    }

    if (role === "provider" || role === "admin") {
      const providerResult = await supabase
        .from("provider_profiles")
        .select("id, profile_id")
        .eq("id", params.provider)
        .maybeSingle();

      const canAccessProvider =
        role === "admin" || providerResult.data?.profile_id === user.id;

      if (!canAccessProvider) {
        redirect("/dashboard/mensagens?message=Você não tem acesso a esse prestador.");
      }

      const latestConversation = await supabase
        .from("conversations")
        .select("id")
        .eq("service_id", params.service)
        .eq("provider_profile_id", params.provider)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestConversation.data?.id) {
        redirect(`/dashboard/mensagens/${latestConversation.data.id}`);
      }

      redirect(
        "/dashboard/mensagens?message=Ainda não há conversa com cliente para este serviço."
      );
    }
  }

  const conversations = await getConversationListForViewer(supabase, user, role);

  return <ChatShell role={role} conversations={conversations} notice={params.message ?? null} />;
}
