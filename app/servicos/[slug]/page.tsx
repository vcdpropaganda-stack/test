import type { Metadata } from "next";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createBookingAction } from "@/app/servicos/[slug]/actions";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { formatPrice, getMarketplaceServiceBySlug } from "@/lib/marketplace";

type ServiceDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ message?: string }>;
};

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getMarketplaceServiceBySlug(slug);

  if (!service) {
    return {
      title: "Servico nao encontrado | TESTE",
    };
  }

  return {
    title: `${service.title} | TESTE`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
  searchParams,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const { message } = await searchParams;
  const service = await getMarketplaceServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const location = service.provider_profile?.city
    ? `${service.provider_profile.city}${service.provider_profile.state ? `, ${service.provider_profile.state}` : ""}`
    : "Atendimento local";
  const availability =
    (service.availability ?? [])
      .filter((slot) => slot.is_available)
      .filter(
        (slot) =>
          !(service.booked_slots ?? []).some(
            (booking) =>
              booking.scheduled_start === slot.start_at &&
              booking.scheduled_end === slot.end_at
          )
      )
      .sort(
        (a, b) =>
          new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
      ) ?? [];

  return (
    <main id="conteudo" className="page-shell py-16">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-white p-8">
            <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
              Servico
            </p>
            <h1 className="mt-4 font-sans text-5xl font-bold tracking-tight text-slate-950">
              {service.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-strong">
              {service.description}
            </p>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-8">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-950">
              O que o cliente encontra aqui
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-muted-strong">
              <li>Descricao clara do servico e proposta de valor.</li>
              <li>Preco base e duracao estimada de atendimento.</li>
              <li>Contexto do prestador e origem do atendimento.</li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-8">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-950">
              Proximos horarios disponiveis
            </h2>
            {message ? <div className="mt-5"><Notice>{message}</Notice></div> : null}
            <div className="mt-6 space-y-3">
              {availability.length > 0 ? (
                availability.slice(0, 8).map((slot) => (
                  <div
                    key={slot.id}
                    className="flex flex-col gap-2 rounded-2xl border border-border bg-surface-soft px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        {format(new Date(slot.start_at), "EEEE, dd 'de' MMMM", {
                          locale: ptBR,
                        })}
                      </p>
                      <p className="mt-1 text-sm text-muted-strong">
                        {format(new Date(slot.start_at), "HH:mm")} -{" "}
                        {format(new Date(slot.end_at), "HH:mm")}
                      </p>
                    </div>
                    <form action={createBookingAction}>
                      <input type="hidden" name="slug" value={service.slug} />
                      <input type="hidden" name="service_id" value={service.id} />
                      <input
                        type="hidden"
                        name="provider_profile_id"
                        value={service.provider_profile?.id ?? ""}
                      />
                      <input
                        type="hidden"
                        name="scheduled_start"
                        value={slot.start_at}
                      />
                      <input
                        type="hidden"
                        name="scheduled_end"
                        value={slot.end_at}
                      />
                      <input
                        type="hidden"
                        name="total_price_cents"
                        value={service.price_cents}
                      />
                      <Button type="submit" variant="secondary">
                        Reservar horario
                      </Button>
                    </form>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-7 text-muted-strong">
                  Este servico ainda nao tem horarios publicados. Assim que o
                  prestador configurar a agenda, os slots aparecerao aqui.
                </p>
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-slate-950 p-8 text-white">
            <p className="text-sm text-slate-300">Prestador</p>
            <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight">
              {service.provider_profile?.display_name ?? "Prestador TESTE"}
            </h2>
            <div className="mt-6 space-y-3 text-sm text-slate-200">
              <p>Preco: {formatPrice(service.price_cents)}</p>
              <p>Duracao: {service.duration_minutes} min</p>
              <p>Local: {location}</p>
              <p>Plano: {service.provider_profile?.plan ?? "basic"}</p>
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <Button disabled={availability.length === 0}>
                {availability.length > 0
                  ? "Selecione um horario abaixo"
                  : "Sem horarios no momento"}
              </Button>
              <Link href="/servicos" className="inline-flex">
                <Button variant="secondary" className="w-full border-white/15 bg-white text-slate-950">
                  Voltar para a vitrine
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-8">
            <p className="text-sm font-semibold text-slate-950">
              Bio do prestador
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-strong">
              {service.provider_profile?.bio ||
                "Este perfil ainda nao adicionou uma bio detalhada. O marketplace ja esta preparado para evoluir esse bloco depois."}
            </p>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-8">
            <p className="text-sm font-semibold text-slate-950">Reputacao</p>
            <p className="mt-3 text-3xl font-bold text-slate-950">
              {service.average_rating ? service.average_rating.toFixed(1) : "--"}
            </p>
            <p className="mt-2 text-sm text-muted-strong">
              {service.reviews_count ?? 0} avaliacoes publicadas
            </p>
          </div>
        </aside>
      </div>

      <section className="mt-8 rounded-[2rem] border border-border bg-white p-8">
        <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-950">
          Avaliacoes de clientes
        </h2>
        <div className="mt-6 space-y-4">
          {(service.reviews ?? []).length > 0 ? (
            service.reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-[1.5rem] border border-border bg-surface p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-slate-950">
                    {review.client?.full_name ?? "Cliente"}
                  </p>
                  <p className="text-sm font-semibold text-primary-strong">
                    Nota {review.rating}/5
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted-strong">
                  {review.comment || "Cliente avaliou o servico sem comentario adicional."}
                </p>
              </article>
            ))
          ) : (
            <p className="text-sm leading-7 text-muted-strong">
              Este servico ainda nao recebeu avaliacoes publicas.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
