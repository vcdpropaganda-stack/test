import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClientReviewAction } from "@/app/dashboard/provider/agendamentos/[bookingId]/avaliar-cliente/actions";
import { Button } from "@/components/ui/button";
import { TextareaField } from "@/components/ui/textarea";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Avaliar cliente | VL Serviços",
  description: "Registre como foi a experiência com o cliente.",
};

type ProviderClientReviewPageProps = {
  params: Promise<{ bookingId: string }>;
};

export default async function ProviderClientReviewPage({
  params,
}: ProviderClientReviewPageProps) {
  const { bookingId } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const providerResult = await supabase
    .from("provider_profiles")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (providerResult.error || !providerResult.data) {
    redirect("/dashboard/client");
  }

  const bookingResult = await supabase
    .from("bookings")
    .select(
      `
      id,
      status,
      client:profiles(full_name),
      service:services(title)
    `
    )
    .eq("id", bookingId)
    .eq("provider_profile_id", providerResult.data.id)
    .single();

  if (bookingResult.error || !bookingResult.data) {
    redirect("/dashboard/provider?message=Agendamento não encontrado.");
  }

  const booking = {
    ...bookingResult.data,
    client: Array.isArray(bookingResult.data.client)
      ? bookingResult.data.client[0] ?? null
      : bookingResult.data.client,
    service: Array.isArray(bookingResult.data.service)
      ? bookingResult.data.service[0] ?? null
      : bookingResult.data.service,
  };

  if (booking.status !== "completed") {
    redirect("/dashboard/provider?message=O serviço precisa estar concluído para avaliar o cliente.");
  }

  return (
    <main id="conteudo" className="page-shell py-16">
      <section className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
          Avaliação do cliente
        </p>
        <h1 className="mt-3 font-sans text-4xl font-bold tracking-tight text-slate-950">
          Como foi atender {booking.client?.full_name ?? "este cliente"}?
        </h1>
        <p className="mt-4 text-muted-strong">
          Serviço: {booking.service?.title ?? "Serviço"}.
        </p>

        <form action={createClientReviewAction} className="mt-8 space-y-6">
          <input type="hidden" name="booking_id" value={bookingId} />
          <div>
            <p className="mb-3 text-sm font-medium text-slate-800">Nota do cliente</p>
            <div className="flex flex-wrap gap-3">
              {[5, 4, 3, 2, 1].map((score) => (
                <label
                  key={score}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-semibold text-slate-950 hover:border-primary/30"
                >
                  <input type="radio" name="rating" value={score} required />
                  {score} estrela{score > 1 ? "s" : ""}
                </label>
              ))}
            </div>
          </div>
          <TextareaField
            name="comment"
            label="Comentário"
            rows={5}
            placeholder="Conte como foi a comunicação, pontualidade e colaboração desse cliente."
          />
          <Button type="submit">Salvar avaliação do cliente</Button>
        </form>
      </section>
    </main>
  );
}
