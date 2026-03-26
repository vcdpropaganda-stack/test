import type { Metadata } from "next";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ensureConversation } from "@/lib/conversations";
import { getResolvedUserRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mensagens | VL Serviços",
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

  const role = (await getResolvedUserRole(supabase, user)) ?? "client";

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
        const conversationId = await ensureConversation({
          bookingId: bookingResult.data.id,
          serviceId: bookingResult.data.service_id,
          providerProfileId: bookingResult.data.provider_profile_id,
          clientId: bookingResult.data.client_id,
        });

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

  const conversationsResult =
    role === "provider"
      ? await supabase
          .from("conversations")
          .select(
            `
            id,
            created_at,
            updated_at,
            status,
            service:services(title, slug),
            client:profiles(full_name),
            provider_profile:provider_profiles(profile_id, display_name)
          `
          )
          .order("updated_at", { ascending: false })
      : await supabase
          .from("conversations")
          .select(
            `
            id,
            created_at,
            updated_at,
            status,
            service:services(title, slug),
            client:profiles(full_name),
            provider_profile:provider_profiles(profile_id, display_name)
          `
          )
          .eq("client_id", user.id)
          .order("updated_at", { ascending: false });

  const conversations = (conversationsResult.data ?? [])
    .map((conversation) => ({
      ...conversation,
      service: Array.isArray(conversation.service)
        ? conversation.service[0] ?? null
        : conversation.service,
      client: Array.isArray(conversation.client)
        ? conversation.client[0] ?? null
        : conversation.client,
      provider_profile: Array.isArray(conversation.provider_profile)
        ? conversation.provider_profile[0] ?? null
        : conversation.provider_profile,
    }))
    .filter((conversation) =>
      role === "provider"
        ? conversation.provider_profile?.profile_id === user.id
        : true
    );

  return (
    <main id="conteudo" className="page-shell py-10 sm:py-16">
      <section className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
        <h1 className="font-sans text-4xl font-bold tracking-tight text-slate-950">
          Mensagens da plataforma
        </h1>
        <p className="mt-4 text-muted-strong">
          Converse dentro da VL Serviços em um fluxo parecido com marketplaces de confiança.
        </p>
      </section>

      {params.message ? (
        <div className="mt-6 rounded-[1.5rem] border border-primary/15 bg-primary-soft px-4 py-3 text-sm font-medium text-primary-strong">
          {params.message}
        </div>
      ) : null}

      <section className="mt-8 grid gap-4">
        {conversations.length > 0 ? (
          conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/dashboard/mensagens/${conversation.id}`}
              className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm transition hover:border-primary/20 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    {conversation.service?.title ?? "Serviço"}
                  </p>
                  <p className="mt-2 text-sm text-muted-strong">
                    {role === "provider"
                      ? `Cliente: ${conversation.client?.full_name ?? "Cliente"}`
                      : `Prestador: ${conversation.provider_profile?.display_name ?? "Prestador"}`}
                  </p>
                </div>
                <span className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary-strong">
                  {formatDistanceToNow(new Date(conversation.updated_at), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-border bg-white p-8">
            <p className="text-lg font-semibold text-slate-950">
              Nenhuma conversa ainda.
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-strong">
              Abra um serviço ou um agendamento para iniciar uma conversa entre cliente e prestador.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
