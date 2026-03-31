import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createReviewAction } from "@/app/dashboard/client/agendamentos/[bookingId]/avaliar/actions";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Avaliar serviço | VLservice",
  description: "Envie uma avaliação após a conclusão do serviço.",
};

type ReviewPageProps = {
  params: Promise<{ bookingId: string }>;
};

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { bookingId } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const bookingResult = await supabase
    .from("bookings")
    .select(
      `
      id,
      status,
      service:services (title),
      provider_profile:provider_profiles (display_name)
    `
    )
    .eq("id", bookingId)
    .eq("client_id", user.id)
    .single();

  if (bookingResult.error || !bookingResult.data) {
    redirect("/dashboard/client/agendamentos?message=Agendamento não encontrado.");
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

  if (booking.status !== "completed") {
    redirect("/dashboard/client/agendamentos?message=O serviço precisa estar concluído para receber avaliação.");
  }

  return (
    <main id="conteudo" className="page-shell py-16">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-border bg-white p-8">
        <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
          Avaliação
        </p>
        <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-slate-950">
          Como foi sua experiência?
        </h1>
        <p className="mt-4 text-muted-strong">
          {booking.service?.title ?? "Serviço"} com{" "}
          {booking.provider_profile?.display_name ?? "Prestador"}.
        </p>

        <form action={createReviewAction} className="mt-8 space-y-5">
          <input type="hidden" name="booking_id" value={booking.id} />

          <div>
            <label htmlFor="rating" className="mb-2 block text-sm font-medium text-slate-800">
              Nota de 1 a 5
            </label>
            <select
              id="rating"
              name="rating"
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-slate-950 outline-none hover:border-primary/30 focus:border-primary"
              defaultValue="5"
            >
              <option value="5">5 - Excelente</option>
              <option value="4">4 - Muito bom</option>
              <option value="3">3 - Bom</option>
              <option value="2">2 - Ruim</option>
              <option value="1">1 - Muito ruim</option>
            </select>
          </div>

          <div>
            <label htmlFor="comment" className="mb-2 block text-sm font-medium text-slate-800">
              Comentário
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={5}
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-slate-950 outline-none hover:border-primary/30 focus:border-primary"
              placeholder="Conte como foi o atendimento, a pontualidade e a qualidade do serviço."
            />
          </div>

          <Button type="submit">Enviar avaliação</Button>
        </form>
      </div>
    </main>
  );
}
