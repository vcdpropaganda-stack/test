import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Painel do Cliente | Vitrine Lojas",
  description:
    "Área inicial do cliente para acompanhar agendamentos e serviços favoritos.",
};

export default async function ClientDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const bookingsResult = await supabase
    .from("bookings")
    .select("id, status")
    .eq("client_id", user.id);
  const reviewsResult = await supabase
    .from("reviews")
    .select("booking_id")
    .eq("client_id", user.id);

  const bookings = bookingsResult.data ?? [];
  const reviewedBookingIds = new Set((reviewsResult.data ?? []).map((review) => review.booking_id));
  const completedPendingReview = bookings.filter(
    (booking) => booking.status === "completed" && !reviewedBookingIds.has(booking.id)
  ).length;
  const pendingBookings = bookings.filter((booking) => booking.status === "pending").length;
  const confirmedBookings = bookings.filter((booking) => booking.status === "confirmed").length;

  return (
    <main id="conteudo" className="page-shell py-16">
      <div className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
        <p className="text-sm text-muted">Dashboard do cliente</p>
        <h1 className="mt-3 font-sans text-4xl font-bold tracking-tight text-slate-950">
          Olá, {user.user_metadata.full_name ?? user.email}
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Esta área já está pronta para evoluir com histórico de agendamentos,
          favoritos, pagamentos e avaliações.
        </p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <Link href="/dashboard/client/agendamentos" className="rounded-[1.5rem] border border-border bg-surface p-6">
          <p className="font-semibold text-slate-950">Meus agendamentos</p>
          <p className="mt-3 text-sm text-muted-strong">
            {confirmedBookings} confirmados e {pendingBookings} pendentes.
          </p>
        </Link>
        <section className="rounded-[1.5rem] border border-border bg-surface p-6">
          <p className="font-semibold text-slate-950">Serviços favoritos</p>
          <p className="mt-3 text-sm text-muted-strong">
            Base reservada para wishlist e histórico de descoberta.
          </p>
        </section>
        <Link href="/dashboard/client/agendamentos" className="rounded-[1.5rem] border border-border bg-surface p-6">
          <p className="font-semibold text-slate-950">Avaliações pendentes</p>
          <p className="mt-3 text-sm text-muted-strong">
            {completedPendingReview} serviços aguardando sua avaliação.
          </p>
        </Link>
      </div>
    </main>
  );
}
