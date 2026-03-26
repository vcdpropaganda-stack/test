import type { Metadata } from "next";
import { BadgeCheck, CalendarRange, ShieldCheck, Sparkles, Users2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Notice } from "@/components/ui/notice";
import {
  updateBookingAdminAction,
  updateProviderAction,
  updateServiceModerationAction,
} from "@/app/dashboard/admin/actions";
import { getProviderPlanLabel } from "@/lib/subscription";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin | VL Serviços",
  description: "Painel administrativo e operacional da plataforma VL Serviços.",
};

type AdminDashboardPageProps = {
  searchParams: Promise<{
    message?: string;
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

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  const { message } = await searchParams;
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
          full_name,
          email
        ),
        services (id)
      `
      )
      .order("created_at", { ascending: false })
      .limit(8),
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
      .limit(8),
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
      .limit(10),
    supabase
      .from("profiles")
      .select("id, full_name, email, role, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
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

  return (
    <main id="conteudo" className="page-shell py-10 sm:py-16">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#020617,#111827_52%,#312e81)] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.24em] text-slate-300 uppercase">
              Admin e operação interna
            </p>
            <h1 className="mt-3 font-sans text-3xl font-bold tracking-tight sm:text-5xl">
              Controle de prestadores, anúncios e operação diária
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Use este painel para governança da plataforma, moderação do marketplace,
              verificação de prestadores, priorização de anúncios e acompanhamento dos
              agendamentos mais recentes.
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-white/10 bg-white/8 px-5 py-4 text-sm text-slate-200 backdrop-blur">
            <p className="font-semibold text-white">
              Admin logado: {profileResult.data?.full_name ?? "Equipe interna"}
            </p>
            <p className="mt-1 text-slate-300">Leitura operacional com ações em tempo real</p>
          </div>
        </div>
      </section>

      {message ? (
        <div className="mt-6">
          <Notice variant="success">{message}</Notice>
        </div>
      ) : null}

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="rounded-[1.5rem] border border-border bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted">{stat.label}</p>
                  <p className="mt-3 font-sans text-4xl font-bold tracking-tight text-slate-950">
                    {stat.value}
                  </p>
                </div>
                <div className="rounded-2xl bg-primary-soft p-3 text-primary-strong">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-strong">{stat.hint}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2rem] border border-border bg-white p-5 sm:p-7">
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
              {providerRows.length} perfis carregados
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {providerRows.map((provider) => (
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
                      {provider.profile?.email ?? "Sem e-mail"} •{" "}
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
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-white p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-primary-strong uppercase">
                Usuários recentes
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
            {(recentUsersResult.data ?? []).map((profile) => (
              <article
                key={profile.id}
                className="rounded-[1.3rem] border border-border bg-surface px-4 py-3.5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-950">{profile.full_name}</p>
                    <p className="truncate text-sm text-muted-strong">{profile.email}</p>
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

      <section className="mt-8 rounded-[2rem] border border-border bg-white p-5 sm:p-7">
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
            Destaques e ativação em um só lugar
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {serviceRows.map((service) => (
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
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-border bg-white p-5 sm:p-7">
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
          {bookingRows.map((booking) => (
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
          ))}
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
            Mais controle de vitrine
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
