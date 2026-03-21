import type { Metadata } from "next";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  cancelBookingAction,
  goToCheckoutAction,
  rebookBookingAction,
} from "@/app/dashboard/client/agendamentos/actions";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Agendamentos | Painel do Cliente",
  description: "Historico inicial de agendamentos do cliente.",
};

type ClientBookingsPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function ClientBookingsPage({
  searchParams,
}: ClientBookingsPageProps) {
  const { message } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const bookingsResult = await supabase
    .from("bookings")
    .select(
      `
      id,
      status,
      scheduled_start,
      scheduled_end,
      total_price_cents,
      service:services (
        title,
        slug
      ),
      provider_profile:provider_profiles (
        display_name
      )
    `
    )
    .eq("client_id", user.id)
    .order("scheduled_start", { ascending: false });
  const reviewsResult = await supabase
    .from("reviews")
    .select("booking_id")
    .eq("client_id", user.id);

  const bookings = bookingsResult.data ?? [];
  const reviewedBookingIds = new Set((reviewsResult.data ?? []).map((review) => review.booking_id));

  const normalizedBookings = bookings.map((booking) => ({
    ...booking,
    service: Array.isArray(booking.service) ? booking.service[0] ?? null : booking.service,
    provider_profile: Array.isArray(booking.provider_profile)
      ? booking.provider_profile[0] ?? null
      : booking.provider_profile,
  }));

  return (
    <main id="conteudo" className="page-shell py-16">
      <div className="rounded-[2rem] border border-border bg-white p-8">
        <h1 className="font-sans text-4xl font-bold tracking-tight text-slate-950">
          Agendamentos do cliente
        </h1>
        <p className="mt-4 text-muted-strong">
          Historico real de reservas geradas a partir da selecao de horarios no
          marketplace.
        </p>
      </div>
      {message ? <div className="mt-6"><Notice>{message}</Notice></div> : null}
      <div className="mt-8 space-y-4">
        {normalizedBookings.length > 0 ? (
          normalizedBookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded-[2rem] border border-border bg-white p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm text-muted-strong">
                    {format(new Date(booking.scheduled_start), "EEEE, dd 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </p>
                  <h2 className="mt-2 font-sans text-2xl font-bold tracking-tight text-slate-950">
                    {booking.service?.title ?? "Servico"}
                  </h2>
                  <p className="mt-2 text-sm text-muted-strong">
                    Prestador: {booking.provider_profile?.display_name ?? "Prestador"}
                  </p>
                  <p className="mt-2 text-sm text-muted-strong">
                    {format(new Date(booking.scheduled_start), "HH:mm")} -{" "}
                    {format(new Date(booking.scheduled_end), "HH:mm")}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-3 lg:items-end">
                  <span className="rounded-full bg-primary-soft px-3 py-2 text-xs font-semibold text-primary-strong">
                    {booking.status}
                  </span>
                  <p className="text-sm font-semibold text-slate-950">
                    R$ {(booking.total_price_cents / 100).toFixed(2).replace(".", ",")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {booking.status === "pending" ? (
                      <form action={goToCheckoutAction}>
                        <input type="hidden" name="booking_id" value={booking.id} />
                        <Button type="submit" variant="secondary">
                          Ir para checkout
                        </Button>
                      </form>
                    ) : null}

                    {booking.status !== "cancelled" ? (
                      <form action={cancelBookingAction}>
                        <input type="hidden" name="booking_id" value={booking.id} />
                        <Button
                          type="submit"
                          variant="ghost"
                          className="text-danger hover:bg-red-50 hover:text-danger"
                        >
                          Cancelar
                        </Button>
                      </form>
                    ) : null}

                    <form action={rebookBookingAction}>
                      <input type="hidden" name="booking_id" value={booking.id} />
                      <Button type="submit" variant="ghost">
                        Reagendar
                      </Button>
                    </form>
                    {booking.status === "completed" && !reviewedBookingIds.has(booking.id) ? (
                      <Link href={`/dashboard/client/agendamentos/${booking.id}/avaliar`}>
                        <Button variant="secondary">Avaliar</Button>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-border bg-white p-8">
            <p className="text-lg font-semibold text-slate-950">
              Nenhum agendamento encontrado.
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-strong">
              Reserve um horario em qualquer pagina de servico para ver o
              historico aparecer aqui.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
