import type { Metadata } from "next";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  markBookingCompletedAction,
  markBookingConfirmedAction,
} from "@/app/dashboard/provider/actions";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Painel do Prestador | Vitrine Lojas",
  description:
    "Área inicial do prestador para gerenciar serviços, disponibilidade e assinaturas.",
};

type ProviderDashboardPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function ProviderDashboardPage({
  searchParams,
}: ProviderDashboardPageProps) {
  const { message } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const role = String(user.user_metadata.role ?? "client");

  if (role !== "provider") {
    redirect("/dashboard/client");
  }

  const providerProfileResult = await supabase
    .from("provider_profiles")
    .select("id, plan")
    .eq("profile_id", user.id)
    .single();

  const providerProfile = providerProfileResult.data;
  const activeServicesResult = providerProfile
    ? await supabase
        .from("services")
        .select("id", { count: "exact", head: true })
        .eq("provider_profile_id", providerProfile.id)
        .eq("is_active", true)
    : { count: 0 };
  const bookingsResult = providerProfile
    ? await supabase
        .from("bookings")
        .select(
          `
          id,
          status,
          scheduled_start,
          service:services (title),
          client:profiles (full_name)
        `
        )
        .eq("provider_profile_id", providerProfile.id)
        .order("scheduled_start", { ascending: true })
        .limit(5)
    : { data: [] };

  const bookings = (bookingsResult.data ?? []).map((booking) => ({
    ...booking,
    service: Array.isArray(booking.service) ? booking.service[0] ?? null : booking.service,
    client: Array.isArray(booking.client) ? booking.client[0] ?? null : booking.client,
  }));
  const todayString = new Date().toISOString().slice(0, 10);
  const todayBookingsCount = bookings.filter((booking) =>
    booking.scheduled_start.startsWith(todayString)
  ).length;
  const metrics = [
    {
      label: "Serviços ativos",
      value: String(activeServicesResult.count ?? 0).padStart(2, "0"),
    },
    {
      label: "Agendamentos hoje",
      value: String(todayBookingsCount).padStart(2, "0"),
    },
    {
      label: "Plano atual",
      value: providerProfile?.plan ?? "basic",
    },
  ];

  return (
    <main id="conteudo" className="page-shell py-16">
      <div className="rounded-[2rem] border border-border bg-slate-950 p-8 text-white">
        <p className="text-sm text-slate-300">Dashboard do prestador</p>
        <h1 className="mt-3 font-sans text-4xl font-bold tracking-tight">
          Gerencie anúncios, disponibilidade e conversão em um único lugar.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Esta área já está reservada para o fluxo operacional do provider com
          limites por plano e agenda integrada.
        </p>
        <p className="mt-6 text-sm text-slate-300">
          Sessão ativa: {user.email}
        </p>
      </div>
      {message ? <div className="mt-6"><Notice>{message}</Notice></div> : null}

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {metrics.map((metric) => (
          <section
            key={metric.label}
            className="rounded-[1.5rem] border border-border bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-muted">{metric.label}</p>
            <p className="mt-3 font-sans text-3xl font-bold text-slate-950">
              {metric.value}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Link href="/dashboard/provider/servicos" className="rounded-[1.5rem] border border-border bg-surface p-6">
          <p className="font-semibold text-slate-950">Gerenciar serviços</p>
          <p className="mt-3 text-sm text-muted-strong">
            Cadastre, edite e controle a publicação dos seus anúncios.
          </p>
        </Link>
        <Link href="/dashboard/provider/agenda" className="rounded-[1.5rem] border border-border bg-surface p-6">
          <p className="font-semibold text-slate-950">Abrir agenda</p>
          <p className="mt-3 text-sm text-muted-strong">
            Configure disponibilidade real por serviço.
          </p>
        </Link>
      </div>

      <section className="mt-8 rounded-[2rem] border border-border bg-white p-8">
        <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
          Operação
        </p>
        <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-slate-950">
          Próximos agendamentos do prestador
        </h2>
        <div className="mt-8 space-y-4">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-[1.5rem] border border-border bg-surface p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm text-muted-strong">
                      {format(new Date(booking.scheduled_start), "EEEE, dd 'de' MMMM", {
                        locale: ptBR,
                      })}
                    </p>
                    <p className="mt-2 font-semibold text-slate-950">
                      {booking.service?.title ?? "Serviço"}
                    </p>
                    <p className="mt-1 text-sm text-muted-strong">
                      Cliente: {booking.client?.full_name ?? "Cliente"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {booking.status === "pending" ? (
                      <form action={markBookingConfirmedAction}>
                        <input type="hidden" name="booking_id" value={booking.id} />
                        <Button type="submit" variant="secondary">
                          Confirmar
                        </Button>
                      </form>
                    ) : null}
                    {booking.status === "confirmed" ? (
                      <form action={markBookingCompletedAction}>
                        <input type="hidden" name="booking_id" value={booking.id} />
                        <Button type="submit">Marcar como concluído</Button>
                      </form>
                    ) : null}
                    <span className="rounded-full bg-primary-soft px-3 py-2 text-xs font-semibold text-primary-strong">
                      {booking.status}
                    </span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-border bg-surface p-6">
              <p className="font-semibold text-slate-950">
                Ainda não existem agendamentos para exibir.
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-strong">
                Publique horários na agenda para começar a receber reservas pelo marketplace.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/dashboard/provider/agenda" className="inline-flex">
                  <Button>Configurar agenda</Button>
                </Link>
                <Link href="/dashboard/provider/servicos" className="inline-flex">
                  <Button variant="secondary">Revisar serviços</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
