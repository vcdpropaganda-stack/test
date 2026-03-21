import type { Metadata } from "next";
import { Suspense } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Check,
  ChevronRight,
  Clock3,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";
import { createBookingAction } from "@/app/servicos/[slug]/actions";
import { QueryNotice } from "@/components/shared/query-notice";
import { Button } from "@/components/ui/button";
import {
  formatPrice,
  getMarketplaceServiceBySlug,
  getMarketplaceServiceSlugs,
} from "@/lib/marketplace";

type ServiceDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 120;
export const dynamic = "force-static";

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
}: ServiceDetailPageProps) {
  const { slug } = await params;
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
  const galleryItems = Array.from({ length: 5 }, (_, index) => ({
    id: `${service.id}-${index}`,
    title:
      index === 0
        ? "Capa principal"
        : index === 1
          ? "Aplicação do serviço"
          : index === 2
            ? "Resultado entregue"
            : index === 3
              ? "Apresentação comercial"
              : "Detalhe visual",
  }));
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
  const completePrice = Math.round(service.price_cents * 1.45);
  const standardPrice = Math.round(service.price_cents * 1.2);
  const reviewHighlights = [
    "Atendimento profissional, com comunicação clara do início ao fim.",
    "Entrega com boa percepção de valor e apresentação bem resolvida.",
    "Fluxo pensado para reduzir dúvidas e acelerar a contratação.",
  ];

  return (
    <main id="conteudo" className="page-shell py-8 sm:py-10 lg:py-16">
      <div className="mb-6">
        <Link
          href="/servicos"
          className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:border-primary/30 hover:text-primary-strong"
        >
          Voltar para o marketplace
        </Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
        <section className="space-y-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:rounded-[2rem] sm:p-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-strong">
              <span className="rounded-full bg-primary-soft px-3 py-1 font-semibold text-primary-strong">
                {service.category?.name ?? "Serviço"}
              </span>
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-emerald-500" />
                Prestador verificado no marketplace
              </span>
            </div>
            <h1 className="mt-4 max-w-4xl font-sans text-[2.2rem] leading-[0.96] font-bold tracking-[-0.04em] text-slate-950 sm:mt-5 sm:text-5xl sm:leading-tight sm:tracking-tight">
              {service.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-strong sm:mt-6 sm:gap-x-6 sm:gap-y-3">
              <span className="font-semibold text-slate-950">
                {service.provider_profile?.display_name ?? "Prestador Vitrine Lojas"}
              </span>
              <span className="inline-flex items-center gap-2">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {service.average_rating ? `${service.average_rating.toFixed(1)} de média` : "Novo perfil"}
              </span>
              <span>{service.reviews_count ?? 0} avaliações</span>
              <span>{location}</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:rounded-[2rem]">
            <div className="relative aspect-[1.05/1] bg-slate-950 sm:aspect-[16/10]">
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
              <div className="absolute inset-x-0 bottom-0 hidden p-8 text-white sm:block">
                <p className="text-sm font-semibold tracking-[0.22em] text-indigo-100 uppercase">
                  Serviço
                </p>
                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200">
                  {service.description}
                </p>
              </div>
            </div>
            <div className="border-t border-slate-200 p-5 sm:hidden">
              <p className="text-[0.72rem] font-semibold tracking-[0.22em] text-primary uppercase">
                Serviço
              </p>
              <p className="mt-3 text-base leading-7 text-muted-strong">
                {service.description}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-slate-200 p-4 sm:grid-cols-5 sm:gap-3 sm:p-5">
              {galleryItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`relative aspect-[1.2/1] overflow-hidden rounded-[1rem] border sm:rounded-2xl ${
                    index === 0 ? "border-slate-950 shadow-sm" : "border-slate-200"
                  } bg-slate-100`}
                >
                  {service.cover_image_url ? (
                    <Image
                      src={service.cover_image_url}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 20vw, 120px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:rounded-[2rem] sm:p-8">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <h2 className="font-sans text-[1.9rem] leading-tight font-bold tracking-[-0.03em] text-slate-950 sm:text-2xl sm:tracking-tight">
                Resumo do serviço
              </h2>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                O que está incluso
              </span>
            </div>
            <ul className="mt-5 space-y-4 text-base leading-8 text-muted-strong sm:mt-6">
              <li className="flex items-start gap-3">
                <Check className="mt-1 h-5 w-5 text-emerald-500" />
                Apresentação visual forte com imagem real do serviço.
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-1 h-5 w-5 text-emerald-500" />
                Preço-base, duração estimada e reputação visível.
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-1 h-5 w-5 text-emerald-500" />
                Contexto do prestador, localidade e agenda disponível.
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-1 h-5 w-5 text-emerald-500" />
                Jornada pensada para conversão, clareza comercial e prova social.
              </li>
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:rounded-[2rem] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
                  Avaliações
                </p>
                <h2 className="mt-2 font-sans text-[1.9rem] leading-tight font-bold tracking-[-0.03em] text-slate-950 sm:text-2xl sm:tracking-tight">
                  O que clientes valorizam neste perfil
                </h2>
              </div>
              <span className="hidden items-center gap-2 text-sm font-semibold text-slate-950 sm:inline-flex">
                Ver tudo
                <ChevronRight className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <article className="rounded-[1.5rem] border border-border bg-surface p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-600 text-lg font-semibold text-white">
                    {(service.provider_profile?.display_name ?? "V").slice(0, 1)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">
                      Cliente verificado
                    </p>
                    <p className="text-sm text-muted-strong">
                      {service.reviews_count ?? 0} avaliações publicadas
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-lg leading-8 text-slate-800">
                  {service.reviews?.[0]?.comment ||
                    "Atendimento muito bem estruturado, com resposta rápida, boa comunicação e sensação clara de serviço bem conduzido do começo ao fim."}
                </p>
              </article>
              <div className="rounded-[1.5rem] border border-border bg-slate-50 p-6">
                <p className="font-semibold text-slate-950">Destaques recorrentes</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-strong">
                  {reviewHighlights.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Star className="mt-0.5 h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:rounded-[2rem] sm:p-8">
            <h2 className="font-sans text-[1.9rem] leading-tight font-bold tracking-[-0.03em] text-slate-950 sm:text-2xl sm:tracking-tight">
              Próximos horários disponíveis
            </h2>
            <Suspense fallback={null}>
              <div className="mt-5">
                <QueryNotice />
              </div>
            </Suspense>
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

        <aside className="order-first space-y-6 lg:order-none lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-[0_20px_55px_rgba(15,23,42,0.08)] sm:rounded-[2rem]">
            <div className="grid grid-cols-3 border-b border-border bg-slate-50 text-[0.72rem] sm:text-sm">
              {[
                { label: "Essencial", price: service.price_cents },
                { label: "Intermediário", price: standardPrice },
                { label: "Completo", price: completePrice },
              ].map((pack, index) => (
                <div
                  key={pack.label}
                  className={`px-2 py-3 text-center font-semibold sm:px-4 sm:py-4 ${
                    index === 0
                      ? "border-b-2 border-slate-950 bg-white text-slate-950"
                      : "text-slate-400"
                  }`}
                >
                  {pack.label}
                </div>
              ))}
            </div>
            <div className="p-5 sm:p-8">
              <p className="text-[2.3rem] font-bold tracking-tight text-slate-950 sm:text-4xl">
                {formatPrice(service.price_cents)}
              </p>
              <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
                Solução com foco em clareza comercial, presença visual forte e uma entrega pronta para gerar confiança desde o primeiro contato.
              </p>

              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-3 text-sm font-semibold text-slate-700 sm:gap-x-5">
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  {service.duration_minutes} min
                </span>
                <span className="inline-flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  1 revisão inicial
                </span>
              </div>

              <ul className="mt-6 space-y-3 text-sm leading-7 text-muted-strong">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 text-slate-950" />
                  Briefing e alinhamento do escopo.
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 text-slate-950" />
                  Execução com apresentação visual clara.
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 text-slate-950" />
                  Ajustes para entrega mais clara ao cliente.
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 text-slate-950" />
                  Agendamento integrado pelo marketplace.
                </li>
              </ul>

              <div className="mt-8 flex flex-col gap-3">
                <Button disabled={availability.length === 0} fullWidth>
                  {availability.length > 0
                    ? "Selecionar horário"
                    : "Sem horários no momento"}
                </Button>
                <Link href="/contato" className="block">
                  <span className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-50">
                    Falar com a equipe
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:rounded-[2rem] sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-base font-semibold text-white sm:h-14 sm:w-14 sm:text-lg">
                {(service.provider_profile?.display_name ?? "P").slice(0, 1)}
              </div>
              <div>
                <p className="text-sm text-muted-strong">Prestador</p>
                <h2 className="font-sans text-[1.9rem] leading-tight font-bold tracking-[-0.03em] text-slate-950 sm:text-3xl sm:tracking-tight">
                  {service.provider_profile?.display_name ?? "Prestador Vitrine Lojas"}
                </h2>
              </div>
            </div>
            <div className="mt-6 grid gap-3 text-sm text-slate-700">
              <p className="inline-flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                {service.average_rating ? `${service.average_rating.toFixed(1)} de média` : "Novo perfil"}
              </p>
              <p className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-primary-strong" />
                {service.duration_minutes} min
              </p>
              <p className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-strong" />
                {location}
              </p>
              <p className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Plano {service.provider_profile?.plan ?? "basic"}
              </p>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:rounded-[2rem] sm:p-8">
            <p className="text-sm font-semibold text-slate-950">
              Biografia do prestador
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-strong">
              {service.provider_profile?.bio ||
                "Este perfil ainda não adicionou uma biografia detalhada. O marketplace já está preparado para evoluir esse bloco depois."}
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:rounded-[2rem] sm:p-8">
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

      <section className="mt-8 rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:rounded-[2rem] sm:p-8">
        <h2 className="font-sans text-[1.9rem] leading-tight font-bold tracking-[-0.03em] text-slate-950 sm:text-2xl sm:tracking-tight">
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
