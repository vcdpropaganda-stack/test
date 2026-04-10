import type { Metadata } from "next";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  CalendarRange,
  MessageSquareText,
  ScrollText,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users2,
} from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Notice } from "@/components/ui/notice";
import {
  updateBookingAdminAction,
  updateProviderAction,
  updateServiceModerationAction,
} from "@/app/dashboard/admin/actions";
import { updateConversationAdminAction } from "@/app/dashboard/mensagens/actions";
import { getAuthEmailsByIds } from "@/lib/admin-auth-users";
import { getConversationListForViewer } from "@/lib/conversations";
import { getProviderPlanLabel } from "@/lib/subscription";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin | VLservice",
  description: "Painel administrativo e operacional da plataforma VLservice.",
};

type AdminDashboardPageProps = {
  searchParams: Promise<{
    message?: string;
    q?: string;
    role_filter?: string;
    service_filter?: string;
    conversation_filter?: string;
  }>;
};

function getStatusLabel(status: string) {
  if (status === "pending") return "Pendente";
  if (status === "confirmed") return "Confirmado";
  if (status === "completed") return "Concluído";
  if (status === "cancelled") return "Cancelado";
  return status;
}

function getPlanLabel(plan: string) {
  return getProviderPlanLabel(plan);
}

function formatDateTime(value: string | null) {
  if (!value) return "Sem data";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

function normalizeSearchValue(value: string | null | undefined) {
  return String(value ?? "").trim().toLocaleLowerCase("pt-BR");
}

function matchesSearch(haystack: Array<string | null | undefined>, query: string) {
  if (!query) return true;

  return haystack
    .join(" ")
    .toLocaleLowerCase("pt-BR")
    .includes(query);
}

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  const { message, q, role_filter, service_filter, conversation_filter } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profileResult = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const role = profileResult.data?.role ?? user.user_metadata.role;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  const [
    profilesCountResult,
    servicesCountResult,
    bookingsCountResult,
    reviewsCountResult,
    profilesByRoleResult,
    providersResult,
    servicesResult,
    bookingsResult,
    recentUsersResult,
    allUsersResult,
    adminConversations,
    auditLogsResult,
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase.from("bookings").select("id", { count: "exact", head: true }),
    supabase.from("reviews").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("role"),
    supabase
      .from("provider_profiles")
      .select(
        `
        id,
        display_name,
        city,
        state,
        is_verified,
        plan,
        profile:profiles (
          id,
          full_name,
          email
        ),
        services (id)
      `
      )
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("services")
      .select(
        `
        id,
        title,
        is_active,
        featured_rank,
        created_at,
        provider_profile:provider_profiles (
          display_name
        )
      `
      )
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("bookings")
      .select(
        `
        id,
        status,
        scheduled_start,
        total_price_cents,
        service:services (title),
        client:profiles (full_name),
        provider_profile:provider_profiles (display_name)
      `
      )
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("profiles")
      .select("id, full_name, email, role, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("profiles")
      .select("id, full_name, email, role, created_at")
      .order("created_at", { ascending: false })
      .limit(24),
    getConversationListForViewer(supabase, user, "admin"),
    supabase
      .from("admin_audit_logs")
      .select("id, action, reason, entity_type, entity_id, created_at, metadata")
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  const profileRoleBuckets = (profilesByRoleResult.data ?? []).reduce(
    (acc, profile) => {
      acc[profile.role] = (acc[profile.role] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const providerRows = (providersResult.data ?? []).map((provider) => ({
    ...provider,
    profile: Array.isArray(provider.profile) ? provider.profile[0] ?? null : provider.profile,
    servicesCount: Array.isArray(provider.services) ? provider.services.length : 0,
  }));
  const recentUserRows = recentUsersResult.data ?? [];
  const allUserRows = allUsersResult.data ?? [];
  const authEmailMap = await getAuthEmailsByIds([
    ...providerRows.map((provider) => provider.profile?.id ?? ""),
    ...recentUserRows.map((profile) => profile.id),
    ...allUserRows.map((profile) => profile.id),
  ]);
  const providerRowsWithResolvedEmail = providerRows.map((provider) => ({
    ...provider,
    resolvedEmail:
      authEmailMap.get(provider.profile?.id ?? "") ?? provider.profile?.email ?? null,
  }));
  const recentUserRowsWithResolvedEmail = recentUserRows.map((profile) => ({
    ...profile,
    resolvedEmail: authEmailMap.get(profile.id) ?? profile.email,
  }));
  const allUserRowsWithResolvedEmail = allUserRows.map((profile) => ({
    ...profile,
    resolvedEmail: authEmailMap.get(profile.id) ?? profile.email,
  }));

  const serviceRows = (servicesResult.data ?? []).map((service) => ({
    ...service,
    provider_profile: Array.isArray(service.provider_profile)
      ? service.provider_profile[0] ?? null
      : service.provider_profile,
  }));

  const bookingRows = (bookingsResult.data ?? []).map((booking) => ({
    ...booking,
    service: Array.isArray(booking.service) ? booking.service[0] ?? null : booking.service,
    client: Array.isArray(booking.client) ? booking.client[0] ?? null : booking.client,
    provider_profile: Array.isArray(booking.provider_profile)
      ? booking.provider_profile[0] ?? null
      : booking.provider_profile,
  }));

  const stats = [
    {
      label: "Usuários totais",
      value: profilesCountResult.count ?? 0,
      hint: `${profileRoleBuckets.client ?? 0} clientes • ${profileRoleBuckets.provider ?? 0} prestadores • ${profileRoleBuckets.admin ?? 0} admins`,
      icon: Users2,
    },
    {
      label: "Serviços publicados",
      value: servicesCountResult.count ?? 0,
      hint: `${serviceRows.filter((service) => service.is_active).length} ativos na leitura atual`,
      icon: Sparkles,
    },
    {
      label: "Agendamentos",
      value: bookingsCountResult.count ?? 0,
      hint: `${bookingRows.filter((booking) => booking.status === "pending").length} pendentes na fila recente`,
      icon: CalendarRange,
    },
    {
      label: "Avaliações",
      value: reviewsCountResult.count ?? 0,
      hint: "Leitura consolidada da reputação do marketplace",
      icon: BadgeCheck,
    },
  ];
  const normalizedQuery = normalizeSearchValue(q);
  const normalizedRoleFilter = String(role_filter ?? "all");
  const normalizedServiceFilter = String(service_filter ?? "all");
  const normalizedConversationFilter = String(conversation_filter ?? "all");

  const filteredProviders = providerRowsWithResolvedEmail.filter((provider) => {
    const matchesRole =
      normalizedRoleFilter === "all" ||
      (normalizedRoleFilter === "verified" && provider.is_verified) ||
      (normalizedRoleFilter === "unverified" && !provider.is_verified) ||
      (normalizedRoleFilter === "basic" && provider.plan === "basic") ||
      (normalizedRoleFilter === "pro" && provider.plan === "pro") ||
      (normalizedRoleFilter === "premium" && provider.plan === "premium");

    return (
      matchesRole &&
      matchesSearch(
        [
          provider.display_name,
          provider.profile?.full_name,
          provider.resolvedEmail,
          provider.city,
          provider.state,
        ],
        normalizedQuery
      )
    );
  });

  const filteredUsers = allUserRowsWithResolvedEmail.filter((profile) => {
    const matchesRole =
      normalizedRoleFilter === "all" ||
      normalizedRoleFilter === profile.role ||
      (normalizedRoleFilter === "verified" && profile.role === "provider") ||
      (normalizedRoleFilter === "unverified" && profile.role === "provider");

    return (
      matchesRole &&
      matchesSearch([profile.full_name, profile.resolvedEmail, profile.role], normalizedQuery)
    );
  });

  const filteredServices = serviceRows.filter((service) => {
    const matchesStatus =
      normalizedServiceFilter === "all" ||
      (normalizedServiceFilter === "active" && service.is_active) ||
      (normalizedServiceFilter === "paused" && !service.is_active) ||
      (normalizedServiceFilter === "featured" && Boolean(service.featured_rank));

    return (
      matchesStatus &&
      matchesSearch(
        [service.title, service.provider_profile?.display_name, String(service.featured_rank ?? "")],
        normalizedQuery
      )
    );
  });

  const filteredConversations = adminConversations.filter((conversation) => {
    const matchesStatus =
      normalizedConversationFilter === "all" ||
      (normalizedConversationFilter === "open" && conversation.status === "open") ||
      (normalizedConversationFilter === "closed" && conversation.status === "closed") ||
      (normalizedConversationFilter === "unread" && conversation.unreadCount > 0);

    return (
      matchesStatus &&
      matchesSearch(
        [
          conversation.counterpartName,
          conversation.serviceTitle,
          conversation.counterpartRoleLabel,
          conversation.lastMessagePreview,
        ],
        normalizedQuery
      )
    );
  });

  const filteredBookings = bookingRows.filter((booking) =>
    matchesSearch(
      [
        booking.service?.title,
        booking.client?.full_name,
        booking.provider_profile?.display_name,
        booking.status,
      ],
      normalizedQuery
    )
  );
  const auditRows = auditLogsResult.data ?? [];
  const pendingServiceCount = serviceRows.filter((service) => !service.is_active).length;
  const openConversationCount = filteredConversations.filter(
    (conversation) => conversation.status === "open"
  ).length;
  const unreadConversationCount = filteredConversations.reduce(
    (total, conversation) => total + conversation.unreadCount,
    0
  );
  const verifiedProvidersCount = providerRowsWithResolvedEmail.filter(
    (provider) => provider.is_verified
  ).length;
  const featuredServicesCount = serviceRows.filter((service) =>
    Boolean(service.featured_rank)
  ).length;
  const totalBookingVolume = filteredBookings.reduce(
    (total, booking) => total + (booking.total_price_cents ?? 0),
    0
  );
  const controlStats = [
    {
      label: "Conversas não lidas",
      value: unreadConversationCount,
      hint: `${openConversationCount} threads abertas para ação`,
      icon: MessageSquareText,
    },
    {
      label: "Prestadores verificados",
      value: verifiedProvidersCount,
      hint: `${filteredProviders.length} prestadores na leitura atual`,
      icon: ShieldCheck,
    },
    {
      label: "Serviços em destaque",
      value: featuredServicesCount,
      hint: `${pendingServiceCount} aguardando ativação`,
      icon: Sparkles,
    },
    {
      label: "Volume agendado",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      }).format(totalBookingVolume / 100),
      hint: `${filteredBookings.length} agendamentos monitorados`,
      icon: Activity,
    },
  ];
  const quickActions = [
    {
      label: "Conversas críticas",
      href: "#conversas",
      hint: "Abrir inbox global e moderar threads",
    },
    {
      label: "Prestadores e planos",
      href: "#prestadores",
      hint: "Verificar perfis e ajustar assinatura",
    },
    {
      label: "Moderação de serviços",
      href: "#servicos",
      hint: "Ativar, pausar e destacar anúncios",
    },
    {
      label: "Auditoria",
      href: "#auditoria",
      hint: "Rastrear ações internas recentes",
    },
  ];
  const workspaceSections = [
    {
      title: "Chats",
      value: filteredConversations.length,
      hint: `${unreadConversationCount} mensagens pendentes de leitura`,
    },
    {
      title: "Clientes",
      value: filteredUsers.filter((profile) => profile.role === "client").length,
      hint: "Base ativa para suporte e operação",
    },
    {
      title: "Prestadores",
      value: filteredProviders.length,
      hint: `${verifiedProvidersCount} perfis já validados`,
    },
    {
      title: "Produtos e serviços",
      value: filteredServices.length,
      hint: `${featuredServicesCount} anúncios destacados`,
    },
  ];

  return (
    <main
      id="conteudo"
      className="page-shell bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_38%,#f8fafc_100%)] py-8 sm:py-12"
    >
      <section className="overflow-hidden rounded-[2rem] border border-slate-900 bg-[linear-gradient(135deg,#020617_0%,#0f172a_45%,#111827_100%)] text-white shadow-[0_32px_80px_rgba(15,23,42,0.24)]">
        <div className="grid gap-8 px-5 py-6 sm:px-7 lg:grid-cols-[minmax(0,1.5fr)_360px] lg:px-8 lg:py-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-slate-300 uppercase">
                ADM master
              </span>
              <span className="text-xs font-medium text-slate-400">
                Operação central da VLservice
              </span>
            </div>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.06em] sm:text-5xl">
              Painel mestre para governar chats, clientes, prestadores e catálogo.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Esta área não replica a experiência do marketplace. Aqui a leitura é
              operacional, com visão consolidada, triagem rápida e decisões por domínio.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {workspaceSections.map((section) => (
                <div
                  key={section.title}
                  className="rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-4"
                >
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                    {section.title}
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">
                    {section.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{section.hint}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-white/10 bg-white/6 p-4 backdrop-blur">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                  Sessão administrativa
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {profileResult.data?.full_name ?? "Equipe interna"}
                </p>
              </div>
              <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                Online
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center justify-between rounded-[1.1rem] border border-white/10 bg-black/18 px-4 py-3 transition hover:border-white/20 hover:bg-white/8"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{action.label}</p>
                    <p className="mt-1 text-sm text-slate-400">{action.hint}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {message ? (
        <div className="mt-6">
          <Notice variant="success">{message}</Notice>
        </div>
      ) : null}

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-950 p-3 text-white">
              <UserCog className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">Filtros operacionais</p>
              <p className="text-sm text-slate-500">
                Cruze entidades e encontre gargalos sem sair do painel.
              </p>
            </div>
          </div>

          <form className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,0.8fr))_auto]">
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Buscar usuário, serviço, conversa ou e-mail"
              className="min-h-11 rounded-full border border-border bg-surface px-4 text-sm text-slate-950 outline-none"
            />
            <select
              name="role_filter"
              defaultValue={normalizedRoleFilter}
              className="min-h-11 rounded-full border border-border bg-surface px-4 text-sm text-slate-950"
            >
              <option value="all">Perfis e planos</option>
              <option value="client">Clientes</option>
              <option value="provider">Prestadores</option>
              <option value="admin">Admins</option>
              <option value="verified">Prestadores verificados</option>
              <option value="unverified">Prestadores sem selo</option>
              <option value="basic">Plano básico</option>
              <option value="pro">Plano pro</option>
              <option value="premium">Plano avançado</option>
            </select>
            <select
              name="service_filter"
              defaultValue={normalizedServiceFilter}
              className="min-h-11 rounded-full border border-border bg-surface px-4 text-sm text-slate-950"
            >
              <option value="all">Todos os serviços</option>
              <option value="active">Serviços ativos</option>
              <option value="paused">Serviços pausados</option>
              <option value="featured">Somente destaques</option>
            </select>
            <select
              name="conversation_filter"
              defaultValue={normalizedConversationFilter}
              className="min-h-11 rounded-full border border-border bg-surface px-4 text-sm text-slate-950"
            >
              <option value="all">Todas as conversas</option>
              <option value="open">Conversas abertas</option>
              <option value="closed">Conversas encerradas</option>
              <option value="unread">Com não lidas</option>
            </select>
            <button className="min-h-11 rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-strong">
              Aplicar filtros
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-strong">
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {filteredUsers.length} usuários
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {filteredProviders.length} prestadores
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {filteredServices.length} serviços
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {filteredConversations.length} conversas
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {filteredBookings.length} agendamentos
            </span>
            {q ||
            normalizedRoleFilter !== "all" ||
            normalizedServiceFilter !== "all" ||
            normalizedConversationFilter !== "all" ? (
              <Link
                href="/dashboard/admin"
                className="rounded-full bg-primary-soft px-3 py-1 font-semibold text-primary-strong"
              >
                Limpar filtros
              </Link>
            ) : null}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)] sm:p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
            Estado do sistema
          </p>
          <div className="mt-4 space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <p className="text-sm font-semibold text-slate-950">Fila de conversas</p>
                <p className="mt-1 text-sm text-slate-500">
                  Threads abertas e pendências de leitura da operação.
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  {openConversationCount}
                </p>
                <p className="text-xs text-slate-500">abertas</p>
              </div>
            </div>
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <p className="text-sm font-semibold text-slate-950">Catálogo</p>
                <p className="mt-1 text-sm text-slate-500">
                  Serviços pendentes e destaques ativos no marketplace.
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  {pendingServiceCount}
                </p>
                <p className="text-xs text-slate-500">pendentes</p>
              </div>
            </div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">Controle humano</p>
                <p className="mt-1 text-sm text-slate-500">
                  Eventos administrativos rastreados na trilha de auditoria.
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  {auditRows.length}
                </p>
                <p className="text-xs text-slate-500">eventos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {controlStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted">{stat.label}</p>
                  <p className="mt-3 font-sans text-4xl font-bold tracking-tight text-slate-950">
                    {stat.value}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-950 p-3 text-white">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-strong">{stat.hint}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)] sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-primary-strong uppercase">
                Mapa operacional
              </p>
              <h2 className="mt-2 font-sans text-3xl font-bold tracking-tight text-slate-950">
                Áreas sob controle do admin master
              </h2>
            </div>
            <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              Visão consolidada
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-950">Fluxo de mensagens</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                O admin consegue abrir qualquer conversa, moderar status, restringir
                conteúdo e documentar motivo sem entrar no painel do usuário final.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-950">Clientes e contas</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                A leitura cruza novas contas, funções e volume para identificar suporte,
                abuso ou crescimento de base.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-950">Prestadores e planos</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Verificação manual, troca de plano e gestão de cobertura operacional em
                um único domínio.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-950">Produtos e catálogo</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Serviços podem ser ativados, pausados e priorizados por destaque a partir
                da mesma console.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)] sm:p-7">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary-soft p-3 text-primary-strong">
              <ScrollText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">Resumo executivo</p>
              <p className="text-sm text-slate-500">
                Leitura rápida para orientar a equipe interna.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Base
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                {profilesCountResult.count ?? 0} contas totais
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {profileRoleBuckets.client ?? 0} clientes, {profileRoleBuckets.provider ?? 0}{" "}
                prestadores e {profileRoleBuckets.admin ?? 0} admins.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Conversas
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                {unreadConversationCount} itens pedem atenção
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Central de mensagens com visão global e ação administrativa imediata.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Receita observada
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalBookingVolume / 100)}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Volume somado dos agendamentos visíveis na leitura operacional.
              </p>
            </div>
          </div>
        </section>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section
          id="conversas"
          className="rounded-[2rem] border border-border bg-white p-5 sm:p-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-primary-strong uppercase">
                Chats
              </p>
              <h2 className="mt-2 font-sans text-3xl font-bold tracking-tight text-slate-950">
                Inbox administrativa global
              </h2>
            </div>
            <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              {openConversationCount} abertas
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {filteredConversations.length > 0 ? filteredConversations.slice(0, 12).map((conversation) => (
              <article
                key={conversation.id}
                className="rounded-[1.4rem] border border-border bg-surface p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-950">
                        {conversation.counterpartName}
                      </h3>
                      <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary-strong">
                        {conversation.statusLabel}
                      </span>
                      {conversation.unreadCount > 0 ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                          {conversation.unreadCount} não lidas
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm text-muted-strong">
                      {conversation.serviceTitle} • {conversation.counterpartRoleLabel} • Última atualização em{" "}
                      {formatDateTime(conversation.lastMessageAt)}
                    </p>
                    <p className="mt-2 text-sm text-muted-strong">
                      {conversation.lastMessagePreview}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 lg:flex-row">
                    <Link
                      href={`/dashboard/mensagens/${conversation.id}`}
                      className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:border-primary/35 hover:text-primary-strong"
                    >
                      Abrir conversa
                    </Link>
                    <form action={updateConversationAdminAction} className="flex">
                      <input type="hidden" name="conversation_id" value={conversation.id} />
                      <div className="flex flex-col gap-2">
                        <input
                          type="hidden"
                          name="status"
                          value={conversation.status === "open" ? "closed" : "open"}
                        />
                        <select
                          name="moderation_status"
                          defaultValue={conversation.status === "open" ? "restricted" : "clear"}
                          className="min-h-10 rounded-full border border-border bg-white px-4 text-sm text-slate-950"
                          aria-label={`Status de moderação da conversa ${conversation.id}`}
                        >
                          <option value="clear">Sem restrição</option>
                          <option value="flagged">Sinalizar</option>
                          <option value="restricted">Restringir</option>
                        </select>
                        <input
                          type="text"
                          name="reason"
                          required
                          placeholder="Motivo da ação administrativa"
                          className="min-h-10 rounded-full border border-border bg-white px-4 text-sm text-slate-950"
                        />
                        <button className="min-h-10 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong">
                          {conversation.status === "open" ? "Encerrar" : "Reabrir"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </article>
            )) : (
              <div className="rounded-[1.4rem] border border-dashed border-border bg-surface p-6 text-sm text-muted-strong">
                Nenhuma conversa encontrada com os filtros atuais.
              </div>
            )}
          </div>
        </section>

        <section
          id="clientes"
          className="rounded-[2rem] border border-border bg-white p-5 sm:p-7"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-primary-strong uppercase">
                Clientes e contas
              </p>
              <h2 className="mt-2 font-sans text-3xl font-bold tracking-tight text-slate-950">
                Novas contas na plataforma
              </h2>
            </div>
            <div className="hidden rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white sm:inline-flex">
              Governança ativa
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {recentUserRowsWithResolvedEmail
              .filter((profile) =>
                matchesSearch([profile.full_name, profile.resolvedEmail, profile.role], normalizedQuery)
              )
              .map((profile) => (
                <article
                  key={profile.id}
                  className="rounded-[1.3rem] border border-border bg-surface px-4 py-3.5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-950">{profile.full_name}</p>
                      <p className="truncate text-sm text-muted-strong">
                        {profile.resolvedEmail}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-strong">
                        {profile.role === "provider"
                          ? "Prestador"
                          : profile.role === "admin"
                            ? "Admin"
                            : "Cliente"}
                      </p>
                      <p className="mt-2 text-xs text-muted">
                        {formatDateTime(profile.created_at)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </section>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section
          id="prestadores"
          className="rounded-[2rem] border border-border bg-white p-5 sm:p-7"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-primary-strong uppercase">
                Prestadores
              </p>
              <h2 className="mt-2 font-sans text-3xl font-bold tracking-tight text-slate-950">
                Gestão de plano e verificação
              </h2>
            </div>
            <div className="hidden rounded-full bg-primary-soft px-4 py-2 text-sm font-semibold text-primary-strong sm:inline-flex">
              {filteredProviders.length} perfis carregados
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {filteredProviders.length > 0 ? filteredProviders.map((provider) => (
              <article
                key={provider.id}
                className="rounded-[1.4rem] border border-border bg-surface p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-950">
                        {provider.display_name}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          provider.is_verified
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {provider.is_verified ? "Verificado" : "Sem selo"}
                      </span>
                      <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary-strong">
                        {getPlanLabel(provider.plan)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-strong">
                      {provider.profile?.full_name ?? "Prestador"} •{" "}
                      {provider.resolvedEmail ?? "Sem e-mail"} •{" "}
                      {provider.city ? `${provider.city}${provider.state ? `, ${provider.state}` : ""}` : "Localidade pendente"}
                    </p>
                    <p className="mt-2 text-sm text-muted-strong">
                      {provider.servicesCount} serviços vinculados
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <form action={updateProviderAction} className="flex">
                      <input type="hidden" name="provider_profile_id" value={provider.id} />
                      <input
                        type="hidden"
                        name="intent"
                        value={provider.is_verified ? "unverify" : "verify"}
                      />
                      <button className="min-h-10 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:border-primary/35 hover:text-primary-strong">
                        {provider.is_verified ? "Remover selo" : "Verificar"}
                      </button>
                    </form>
                    <form action={updateProviderAction} className="flex items-center gap-2">
                      <input type="hidden" name="provider_profile_id" value={provider.id} />
                      <input type="hidden" name="intent" value="plan" />
                      <select
                        name="plan"
                        defaultValue={provider.plan}
                        className="min-h-10 rounded-full border border-border bg-white px-4 text-sm text-slate-950"
                        aria-label={`Atualizar plano de ${provider.display_name}`}
                      >
                        <option value="basic">Básico</option>
                        <option value="pro">Pro</option>
                        <option value="premium">Avançado</option>
                      </select>
                      <button className="min-h-10 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong">
                        Salvar
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            )) : (
              <div className="rounded-[1.4rem] border border-dashed border-border bg-surface p-6 text-sm text-muted-strong">
                Nenhum prestador encontrado com os filtros atuais.
              </div>
            )}
          </div>
        </section>

        <section
          id="servicos"
          className="rounded-[2rem] border border-border bg-white p-5 sm:p-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-primary-strong uppercase">
                Produtos e serviços
              </p>
              <h2 className="mt-2 font-sans text-3xl font-bold tracking-tight text-slate-950">
                Controle dos anúncios publicados
              </h2>
            </div>
            <div className="rounded-full bg-primary-soft px-4 py-2 text-sm font-semibold text-primary-strong">
              {pendingServiceCount} aguardando ativação na leitura atual
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {filteredServices.length > 0 ? filteredServices.map((service) => (
              <article
                key={service.id}
                className="rounded-[1.4rem] border border-border bg-surface p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-950">{service.title}</h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          service.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {service.is_active ? "Ativo" : "Pausado"}
                      </span>
                      {service.featured_rank ? (
                        <span className="rounded-full bg-slate-950 px-2.5 py-1 text-xs font-semibold text-white">
                          Destaque #{service.featured_rank}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm text-muted-strong">
                      Prestador: {service.provider_profile?.display_name ?? "Prestador"} •{" "}
                      Criado em {formatDateTime(service.created_at)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 lg:flex-row">
                    <form action={updateServiceModerationAction} className="flex">
                      <input type="hidden" name="service_id" value={service.id} />
                      <input
                        type="hidden"
                        name="intent"
                        value={service.is_active ? "deactivate" : "activate"}
                      />
                      <button className="min-h-10 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:border-primary/35 hover:text-primary-strong">
                        {service.is_active ? "Pausar anúncio" : "Ativar anúncio"}
                      </button>
                    </form>
                    <form action={updateServiceModerationAction} className="flex items-center gap-2">
                      <input type="hidden" name="service_id" value={service.id} />
                      <input type="hidden" name="intent" value="feature" />
                      <input
                        type="number"
                        name="featured_rank"
                        min="1"
                        max="99"
                        defaultValue={service.featured_rank ?? ""}
                        placeholder="Rank"
                        aria-label={`Atualizar destaque do anúncio ${service.title}`}
                        className="min-h-10 w-24 rounded-full border border-border bg-white px-4 text-sm text-slate-950"
                      />
                      <button className="min-h-10 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong">
                        Salvar destaque
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            )) : (
              <div className="rounded-[1.4rem] border border-dashed border-border bg-surface p-6 text-sm text-muted-strong">
                Nenhum serviço encontrado com os filtros atuais.
              </div>
            )}
          </div>
        </section>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-[2rem] border border-border bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-primary-strong uppercase">
                Usuários cadastrados
              </p>
              <h2 className="mt-2 font-sans text-3xl font-bold tracking-tight text-slate-950">
                Clientes, prestadores e admins
              </h2>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              {filteredUsers.length} contas listadas
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {filteredUsers.length > 0 ? filteredUsers.map((profile) => (
              <article
                key={profile.id}
                className="rounded-[1.3rem] border border-border bg-surface px-4 py-3.5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-950">{profile.full_name}</p>
                    <p className="truncate text-sm text-muted-strong">
                      {profile.resolvedEmail}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-strong">
                      {profile.role === "provider"
                        ? "Prestador"
                        : profile.role === "admin"
                          ? "Admin"
                          : "Cliente"}
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      {formatDateTime(profile.created_at)}
                    </p>
                  </div>
                </div>
              </article>
            )) : (
              <div className="rounded-[1.4rem] border border-dashed border-border bg-surface p-6 text-sm text-muted-strong">
                Nenhum usuário encontrado com os filtros atuais.
              </div>
            )}
          </div>
        </section>

        <section
          id="agendamentos"
          className="rounded-[2rem] border border-border bg-white p-5 sm:p-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-primary-strong uppercase">
                Operação diária
              </p>
              <h2 className="mt-2 font-sans text-3xl font-bold tracking-tight text-slate-950">
                Últimos agendamentos da plataforma
              </h2>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              Ações diretas para suporte interno
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-[1.4rem] border border-border bg-surface p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-950">
                        {booking.service?.title ?? "Serviço"}
                      </h3>
                      <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary-strong">
                        {getStatusLabel(booking.status)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-strong">
                      Cliente: {booking.client?.full_name ?? "Cliente"} • Prestador:{" "}
                      {booking.provider_profile?.display_name ?? "Prestador"} •{" "}
                      {formatDateTime(booking.scheduled_start)}
                    </p>
                    <p className="mt-1 text-sm text-muted-strong">
                      Valor total:{" "}
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format((booking.total_price_cents ?? 0) / 100)}
                    </p>
                  </div>

                  <form
                    action={updateBookingAdminAction}
                    className="flex flex-col gap-2 sm:flex-row sm:items-center"
                  >
                    <input type="hidden" name="booking_id" value={booking.id} />
                    <select
                      name="status"
                      defaultValue={booking.status}
                      aria-label={`Atualizar status do agendamento ${booking.id}`}
                      className="min-h-10 rounded-full border border-border bg-white px-4 text-sm text-slate-950"
                    >
                      <option value="pending">Pendente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="completed">Concluído</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                    <button className="min-h-10 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong">
                      Atualizar status
                    </button>
                  </form>
                </div>
              </article>
            )) : (
              <div className="rounded-[1.4rem] border border-dashed border-border bg-surface p-6 text-sm text-muted-strong">
                Nenhum agendamento encontrado com os filtros atuais.
              </div>
            )}
          </div>
        </section>
      </section>

      <section
        id="auditoria"
        className="mt-8 rounded-[2rem] border border-border bg-white p-5 sm:p-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-primary-strong uppercase">
              Moderação
            </p>
            <h2 className="mt-2 font-sans text-3xl font-bold tracking-tight text-slate-950">
              Controle dos anúncios publicados
            </h2>
          </div>
          <div className="rounded-full bg-primary-soft px-4 py-2 text-sm font-semibold text-primary-strong">
            {pendingServiceCount} aguardando ativação na leitura atual
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {filteredServices.length > 0 ? filteredServices.map((service) => (
            <article
              key={service.id}
              className="rounded-[1.4rem] border border-border bg-surface p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-950">{service.title}</h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        service.is_active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {service.is_active ? "Ativo" : "Pausado"}
                    </span>
                    {service.featured_rank ? (
                      <span className="rounded-full bg-slate-950 px-2.5 py-1 text-xs font-semibold text-white">
                        Destaque #{service.featured_rank}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-muted-strong">
                    Prestador: {service.provider_profile?.display_name ?? "Prestador"} •{" "}
                    Criado em {formatDateTime(service.created_at)}
                  </p>
                </div>

                <div className="flex flex-col gap-2 lg:flex-row">
                  <form action={updateServiceModerationAction} className="flex">
                    <input type="hidden" name="service_id" value={service.id} />
                    <input
                      type="hidden"
                      name="intent"
                      value={service.is_active ? "deactivate" : "activate"}
                    />
                    <button className="min-h-10 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:border-primary/35 hover:text-primary-strong">
                      {service.is_active ? "Pausar anúncio" : "Ativar anúncio"}
                    </button>
                  </form>
                  <form action={updateServiceModerationAction} className="flex items-center gap-2">
                    <input type="hidden" name="service_id" value={service.id} />
                    <input type="hidden" name="intent" value="feature" />
                    <input
                      type="number"
                      name="featured_rank"
                      min="1"
                      max="99"
                      defaultValue={service.featured_rank ?? ""}
                      placeholder="Rank"
                      aria-label={`Atualizar destaque do anúncio ${service.title}`}
                      className="min-h-10 w-24 rounded-full border border-border bg-white px-4 text-sm text-slate-950"
                    />
                    <button className="min-h-10 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong">
                      Salvar destaque
                    </button>
                  </form>
                </div>
              </div>
            </article>
          )) : (
            <div className="rounded-[1.4rem] border border-dashed border-border bg-surface p-6 text-sm text-muted-strong">
              Nenhum serviço encontrado com os filtros atuais.
            </div>
          )}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <article className="rounded-[1.6rem] border border-border bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary-soft p-3 text-primary-strong">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-950">Próximo passo natural</p>
              <p className="text-sm text-muted-strong">Admin ainda mais fechado</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted-strong">
            O painel agora já governa prestadores, anúncios e agendamentos. O próximo
            salto é adicionar buscas internas, paginação, filtros por status e trilha de
            auditoria.
          </p>
        </article>
        <article className="rounded-[1.6rem] border border-border bg-white p-5">
          <p className="text-sm font-semibold tracking-[0.22em] text-primary-strong uppercase">
            Operação
          </p>
          <p className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
            Painel centralizado
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-strong">
            A equipe interna já consegue atuar sem entrar em cada dashboard individual
            para moderar o marketplace.
          </p>
        </article>
        <article className="rounded-[1.6rem] border border-border bg-white p-5">
          <p className="text-sm font-semibold tracking-[0.22em] text-primary-strong uppercase">
            Governança
          </p>
          <p className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
            Mais controle de catálogo
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-strong">
            É possível ativar, pausar, destacar anúncios e ajustar planos de prestadores
            sem precisar editar dados diretamente no banco.
          </p>
        </article>
      </section>
    </main>
  );
}
