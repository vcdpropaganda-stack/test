import type { Metadata } from "next";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { Clock3, MapPin, ShieldCheck, Star } from "lucide-react";
import { createBookingAction } from "@/app/servicos/[slug]/actions";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import {
  formatPrice,
  getMarketplaceServiceBySlug,
  getMarketplaceServiceSlugs,
} from "@/lib/marketplace";

type ServiceDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ message?: string }>;
};

export const revalidate = 120;

function humanizeSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateStaticParams() {
  const slugs = await getMarketplaceServiceSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getMarketplaceServiceBySlug(slug);

  if (!service) {
    return {
      title: `${humanizeSlug(slug)} | Vitrine Lojas`,
      description:
        "Detalhes do serviço no marketplace Vitrine Lojas.",
    };
  }

  return {
    title: `${service.title} | Vitrine Lojas`,
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
    return (
      <main id="conteudo" className="page-shell py-16">
        <div className="mb-6">
          <Link
            href="/servicos"
            className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:border-primary/30 hover:text-primary-strong"
          >
            Voltar para o marketplace
          </Link>
        </div>
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
            Serviço
          </p>
          <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-slate-950">
            {humanizeSlug(slug)}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-strong">
            Esta página do serviço ainda não carregou todos os dados públicos,
            mas o caminho já existe e continua reservado no marketplace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/servicos"
              className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-strong"
            >
              Ver todos os serviços
            </Link>
            <Link
              href="/contato"
              className="inline-flex rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:border-primary/30 hover:text-primary-strong"
            >
              Solicitar atendimento
            </Link>
          </div>
        </section>
      </main>
    );
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
      <div className="mb-6">
        <Link
          href="/servicos"
          className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:border-primary/30 hover:text-primary-strong"
        >
          Voltar para o marketplace
        </Link>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
            <div className="relative aspect-[16/10] bg-slate-950">
              {service.cover_image_url ? (
                <Image
                  src={service.cover_image_url}
                  alt={service.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="h-full w-full object-cover"
                />
              ) : null}
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                <p className="text-sm font-semibold tracking-[0.22em] text-indigo-100 uppercase">
                  Serviço
                </p>
                <h1 className="mt-4 max-w-3xl font-sans text-5xl font-bold tracking-tight">
                  {service.title}
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200">
                  {service.description}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-8">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-950">
              O que o cliente encontra aqui
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-muted-strong">
              <li>Apresentação visual forte com imagem real do serviço.</li>
              <li>Preço-base, duração estimada e reputação visível.</li>
              <li>Contexto do prestador, localidade e agenda disponível.</li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-8">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-950">
              Próximos horários disponíveis
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
                        Reservar horário
                      </Button>
                    </form>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-7 text-muted-strong">
                  Este serviço ainda não tem horários publicados. Assim que o
                  prestador configurar a agenda, os slots aparecerão aqui.
                </p>
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-slate-950 p-8 text-white">
            <p className="text-sm text-slate-300">Prestador</p>
            <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight">
              {service.provider_profile?.display_name ?? "Prestador Vitrine Lojas"}
            </h2>
            <div className="mt-6 grid gap-3 text-sm text-slate-200">
              <p className="inline-flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-300" />
                {service.average_rating ? `${service.average_rating.toFixed(1)} de média` : "Novo perfil"}
              </p>
              <p className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-indigo-200" />
                {service.duration_minutes} min
              </p>
              <p className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-200" />
                {location}
              </p>
              <p className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Plano {service.provider_profile?.plan ?? "basic"}
              </p>
              <p className="pt-2 text-3xl font-bold text-white">
                {formatPrice(service.price_cents)}
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <Button disabled={availability.length === 0} fullWidth>
                {availability.length > 0
                  ? "Selecione um horário abaixo"
                  : "Sem horários no momento"}
              </Button>
              <Link href="/servicos" className="block">
                <span className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100">
                  Voltar para a vitrine
                </span>
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-8">
            <p className="text-sm font-semibold text-slate-950">
              Biografia do prestador
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-strong">
              {service.provider_profile?.bio ||
                "Este perfil ainda não adicionou uma biografia detalhada. O marketplace já está preparado para evoluir esse bloco depois."}
            </p>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-8">
            <p className="text-sm font-semibold text-slate-950">Reputação</p>
            <p className="mt-3 text-3xl font-bold text-slate-950">
              {service.average_rating ? service.average_rating.toFixed(1) : "--"}
            </p>
            <p className="mt-2 text-sm text-muted-strong">
              {service.reviews_count ?? 0} avaliações publicadas
            </p>
          </div>
        </aside>
      </div>

      <section className="mt-8 rounded-[2rem] border border-border bg-white p-8">
        <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-950">
          Avaliações de clientes
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
                  {review.comment || "Cliente avaliou o serviço sem comentário adicional."}
                </p>
              </article>
            ))
          ) : (
            <p className="text-sm leading-7 text-muted-strong">
              Este serviço ainda não recebeu avaliações públicas.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
