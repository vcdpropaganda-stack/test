import type { Metadata } from "next";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, CreditCard, Smartphone } from "lucide-react";
import { redirect } from "next/navigation";
import { confirmBookingAction } from "@/app/checkout/[bookingId]/actions";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Checkout | VLservice",
  description: "Confirmação de pagamento e agendamento no marketplace VLservice.",
};

type CheckoutPageProps = {
  params: Promise<{ bookingId: string }>;
  searchParams: Promise<{ message?: string }>;
};

export default async function CheckoutPage({
  params,
  searchParams,
}: CheckoutPageProps) {
  const { bookingId } = await params;
  const { message } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Entre para concluir o checkout.");
  }

  const bookingResult = await supabase
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
    .eq("id", bookingId)
    .eq("client_id", user.id)
    .single();

  if (bookingResult.error || !bookingResult.data) {
    redirect("/dashboard/client/agendamentos?message=Checkout não encontrado.");
  }

  const booking = {
    ...bookingResult.data,
    service: Array.isArray(bookingResult.data.service)
      ? bookingResult.data.service[0] ?? null
      : bookingResult.data.service,
    provider_profile: Array.isArray(bookingResult.data.provider_profile)
      ? bookingResult.data.provider_profile[0] ?? null
      : bookingResult.data.provider_profile,
  };

  return (
    <main id="conteudo" className="page-shell py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.9fr]">
        <section className="rounded-[2rem] border border-border bg-white p-8">
          <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
            Checkout demo
          </p>
          <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-slate-950">
            Confirme seu agendamento
          </h1>
          <p className="mt-4 max-w-2xl text-muted-strong">
            Este fluxo é um protótipo de apresentação. Nenhum dado real de
            pagamento é solicitado aqui.
          </p>
          {message ? <div className="mt-6"><Notice>{message}</Notice></div> : null}

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,_#0f172a,_#312e81,_#6366f1)] p-6 text-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                  Cartão demo
                </span>
                <CreditCard className="h-5 w-5 text-white/80" />
              </div>
              <p className="mt-10 text-2xl font-semibold tracking-[0.28em]">
                4242 4242 4242 4242
              </p>
              <div className="mt-8 flex items-center justify-between text-sm text-white/80">
                <span>VL SERVIÇOS PROTOTYPE</span>
                <span>12/34</span>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border bg-surface-soft p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary-soft p-3 text-primary-strong">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-950">Pagamento fake</p>
                  <p className="text-sm text-muted-strong">
                    Clique para aprovar instantaneamente no protótipo.
                  </p>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-dashed border-border bg-white px-4 py-4 text-sm text-muted-strong">
                Nenhum formulário é exibido. A interação vai direto para
                pagamento aprovado para facilitar sua apresentação.
              </div>
            </div>
          </div>
        </section>

        <aside className="rounded-[2rem] border border-border bg-slate-950 p-8 text-white">
          <p className="text-sm text-slate-300">Resumo do pedido</p>
          <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight">
            {booking.service?.title ?? "Serviço"}
          </h2>
          <div className="mt-6 space-y-3 text-sm text-slate-200">
            <p>Prestador: {booking.provider_profile?.display_name ?? "Prestador"}</p>
            <p>
              Data:{" "}
              {format(new Date(booking.scheduled_start), "EEEE, dd 'de' MMMM", {
                locale: ptBR,
              })}
            </p>
            <p>
              Horário: {format(new Date(booking.scheduled_start), "HH:mm")} -{" "}
              {format(new Date(booking.scheduled_end), "HH:mm")}
            </p>
            <p>
              Total: R$ {(booking.total_price_cents / 100).toFixed(2).replace(".", ",")}
            </p>
            <p>Status atual: {booking.status}</p>
          </div>

          <form action={confirmBookingAction} className="mt-8">
            <input type="hidden" name="booking_id" value={booking.id} />
            <input type="hidden" name="payment_method" value="demo-card" />
            <Button
              type="submit"
              disabled={booking.status === "confirmed" || booking.status === "cancelled"}
              className="w-full"
            >
              {booking.status === "confirmed"
                ? "Agendamento já confirmado"
                : booking.status === "cancelled"
                  ? "Agendamento cancelado"
                  : "Pagar com cartão fake e confirmar"}
            </Button>
          </form>

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
            Ambiente de demonstração sem coleta de dados financeiros.
          </div>
        </aside>
      </div>
    </main>
  );
}
