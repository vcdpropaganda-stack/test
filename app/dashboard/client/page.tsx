import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Painel do Cliente | VLservice",
  description:
    "Área inicial do cliente para publicar pedidos, comparar lances e acompanhar contratações.",
};

export default async function ClientDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [bookingsResult, reviewsResult] = await Promise.all([
    supabase.from("bookings").select("id, status").eq("client_id", user.id),
    supabase.from("reviews").select("booking_id").eq("client_id", user.id),
  ]);

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
          A partir daqui você publica pedidos, recebe lances dos prestadores e
          acompanha o que já virou contratação.
        </p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <Link href="/dashboard/client/pedidos" className="rounded-[1.5rem] border border-border bg-surface p-6">
          <p className="font-semibold text-slate-950">Meus pedidos</p>
          <p className="mt-3 text-sm text-muted-strong">
            Publique necessidades, compare propostas e contrate sem depender só do catálogo.
          </p>
        </Link>
        <Link href="/dashboard/mensagens" className="rounded-[1.5rem] border border-border bg-surface p-6">
          <p className="font-semibold text-slate-950">Mensagens</p>
          <p className="mt-3 text-sm text-muted-strong">
            Tire dúvidas, solicite WhatsApp e alinhe detalhes com o prestador.
          </p>
        </Link>
        <Link href="/dashboard/client/agendamentos" className="rounded-[1.5rem] border border-border bg-surface p-6">
          <p className="font-semibold text-slate-950">Agendamentos e avaliações</p>
          <p className="mt-3 text-sm text-muted-strong">
            {confirmedBookings} confirmados, {pendingBookings} pendentes e {completedPendingReview} avaliações aguardando você.
          </p>
        </Link>
      </div>
    </main>
  );
}
