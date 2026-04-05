import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { acceptJobBidAction, submitJobBidAction } from "@/app/pedidos/actions";
import { JobBidCard } from "@/components/jobs/job-bid-card";
import { JobStatusBadge } from "@/components/jobs/job-status-badge";
import { Button } from "@/components/ui/button";
import { ConfigurationNotice } from "@/components/shared/configuration-notice";
import { InputField } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { TextareaField } from "@/components/ui/textarea";
import { getResolvedUserRole } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";
import {
  formatJobBudget,
  formatJobLocation,
  getJobBidStatusLabel,
  getJobDetailForViewer,
  getJobStatusLabel,
} from "@/lib/jobs";
import {
  getProviderBidBalanceText,
  getProviderBidPackPriceText,
  getProviderBidPricingSummaryText,
  getProviderJobBidAllowance,
} from "@/lib/subscription";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type JobDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    message?: string;
  }>;
};

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Pedido ${slug} | VLservice`,
  };
}

export default async function JobDetailPage({
  params,
  searchParams,
}: JobDetailPageProps) {
  const [{ slug }, { message }] = await Promise.all([params, searchParams]);

  if (!hasSupabaseEnv()) {
    return (
      <ConfigurationNotice
        eyebrow="Pedido"
        title="Detalhes temporariamente indisponíveis"
        description="Os dados deste pedido e das propostas dependem da configuração pública do Supabase para carregar corretamente."
        primaryHref="/pedidos"
        primaryLabel="Voltar ao mural"
        secondaryHref="/login"
        secondaryLabel="Ir para o login"
      />
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = await getResolvedUserRole(supabase, user);
  const providerProfileResult =
    user && role === "provider"
      ? await supabase
          .from("provider_profiles")
          .select("id")
          .eq("profile_id", user.id)
          .maybeSingle()
      : { data: null };
  const job = await getJobDetailForViewer(supabase, slug);

  if (!job) {
    notFound();
  }

  const isOwnerClient = Boolean(user && job.client_id === user.id);
  const canBid = role === "provider" && !isOwnerClient && (job.status === "open" || job.status === "has_bids");
  const canAcceptBid = isOwnerClient && (job.status === "open" || job.status === "has_bids");
  const bidAllowance =
    providerProfileResult.data?.id && canBid
      ? await getProviderJobBidAllowance(supabase, providerProfileResult.data.id)
      : null;
  const existingProviderBid = canBid && job.bids.length > 0 ? job.bids[0] : null;

  if (!user && message === "login_required") {
    redirect(`/login?next=/pedidos/${job.slug}`);
  }

  return (
    <main id="conteudo" className="page-shell py-10 sm:py-14">
      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold tracking-[0.24em] text-primary-strong uppercase">
                  {job.category?.name ?? "Pedido de serviço"}
                </p>
                <h1 className="mt-3 font-sans text-4xl font-bold tracking-tight text-slate-950">
                  {job.title}
                </h1>
              </div>
              <JobStatusBadge status={job.status} />
            </div>

            <p className="mt-5 text-base leading-8 text-muted-strong">
              {job.description}
            </p>

            <div className="mt-6 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
              <div className="rounded-[1.25rem] bg-surface-soft p-4">
                <p className="font-semibold text-slate-950">Local</p>
                <p className="mt-2">{formatJobLocation(job)}</p>
              </div>
              <div className="rounded-[1.25rem] bg-surface-soft p-4">
                <p className="font-semibold text-slate-950">Orçamento</p>
                <p className="mt-2">{formatJobBudget(job)}</p>
              </div>
              <div className="rounded-[1.25rem] bg-surface-soft p-4">
                <p className="font-semibold text-slate-950">Prazo desejado</p>
                <p className="mt-2">
                  {job.desired_deadline_at
                    ? new Date(job.desired_deadline_at).toLocaleDateString("pt-BR")
                    : "A combinar"}
                </p>
              </div>
              <div className="rounded-[1.25rem] bg-surface-soft p-4">
                <p className="font-semibold text-slate-950">Comparativo</p>
                <p className="mt-2">
                  {job.bids.length} proposta(s) recebida(s)
                </p>
              </div>
            </div>
          </div>

          {message ? <Notice>{message}</Notice> : null}

          <section className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold tracking-[0.24em] text-primary-strong uppercase">
                  Lances
                </p>
                <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-slate-950">
                  {isOwnerClient
                    ? "Compare as propostas recebidas"
                    : "Propostas visíveis para você neste pedido"}
                </h2>
              </div>
              {job.hired_bid_id ? (
                <p className="text-sm font-semibold text-emerald-700">
                  Pedido já contratado
                </p>
              ) : null}
            </div>

            <div className="mt-6 space-y-4">
              {job.bids.length > 0 ? (
                job.bids.map((bid) => (
                  <JobBidCard
                    key={bid.id}
                    providerName={bid.provider_profile?.display_name ?? "Prestador"}
                    amount={new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      maximumFractionDigits: 0,
                    }).format(bid.amount_cents / 100)}
                    estimatedDays={bid.estimated_days}
                    message={bid.message}
                    statusLabel={getJobBidStatusLabel(bid.status)}
                    rating={bid.average_rating}
                    reviewsCount={bid.reviews_count}
                    footer={
                      canAcceptBid && bid.status !== "accepted" ? (
                        <form action={acceptJobBidAction}>
                          <input type="hidden" name="job_id" value={job.id} />
                          <input type="hidden" name="bid_id" value={bid.id} />
                          <Button type="submit">Contratar este prestador</Button>
                        </form>
                      ) : bid.provider_profile?.public_slug ? (
                        <Link
                          href={`/prestadores/${bid.provider_profile.public_slug}`}
                          className="inline-flex"
                        >
                          <Button variant="secondary" icon={<ArrowRight className="h-4 w-4" />}>
                            Ver perfil
                          </Button>
                        </Link>
                      ) : null
                    }
                  />
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-border bg-surface p-6">
                  <p className="font-semibold text-slate-950">
                    {isOwnerClient
                      ? "Seu pedido ainda não recebeu propostas."
                      : "As propostas ainda não estão disponíveis para você."}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-muted-strong">
                    {isOwnerClient
                      ? "Assim que os prestadores enviarem lances, eles aparecerão aqui para comparação."
                      : "Prestadores veem o pedido e respondem com lance. O cliente compara tudo nesta área."}
                  </p>
                </div>
              )}
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold tracking-[0.24em] text-primary-strong uppercase">
              Resumo
            </p>
            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="font-semibold text-slate-950">Status atual</p>
                <p className="mt-1 text-muted-strong">{getJobStatusLabel(job.status)}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-950">Expira em</p>
                <p className="mt-1 text-muted-strong">
                  {new Date(job.expires_at).toLocaleString("pt-BR")}
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-950">Lances recebidos</p>
                <p className="mt-1 text-muted-strong">{job.bids.length}</p>
              </div>
            </div>
          </section>

          {canBid ? (
            <section className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold tracking-[0.24em] text-primary-strong uppercase">
                Enviar lance
              </p>
              <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-slate-950">
                {existingProviderBid
                  ? "Atualize sua proposta para este pedido"
                  : "Faça sua proposta para este pedido"}
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-strong">
                {getProviderBidPricingSummaryText()}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.25rem] bg-surface-soft p-4 text-sm">
                  <p className="font-semibold text-slate-950">Saldo agora</p>
                  <p className="mt-2 text-muted-strong">
                    {getProviderBidBalanceText(bidAllowance)}
                  </p>
                </div>
                <div className="rounded-[1.25rem] bg-surface-soft p-4 text-sm">
                  <p className="font-semibold text-slate-950">Regra do pacote</p>
                  <p className="mt-2 text-muted-strong">
                    Depois dos 5 grátis, cada pacote libera {getProviderBidPackPriceText()}.
                  </p>
                </div>
              </div>
              {existingProviderBid ? (
                <div className="mt-4">
                  <Notice>
                    Você já enviou uma proposta neste pedido. Editar esse lance não consome
                    novo crédito.
                  </Notice>
                </div>
              ) : null}

              <form action={submitJobBidAction} className="mt-6 space-y-4">
                <input type="hidden" name="job_id" value={job.id} />
                <InputField
                  name="amount_brl"
                  label="Valor da proposta"
                  required
                  placeholder="850"
                  defaultValue={
                    existingProviderBid
                      ? (existingProviderBid.amount_cents / 100)
                          .toFixed(2)
                          .replace(".", ",")
                      : ""
                  }
                />
                <InputField
                  name="estimated_days"
                  type="number"
                  min="1"
                  label="Prazo em dias"
                  placeholder="3"
                  defaultValue={existingProviderBid?.estimated_days ?? ""}
                />
                <TextareaField
                  name="message"
                  label="Mensagem para o cliente"
                  required
                  rows={5}
                  placeholder="Explique como você resolveria o problema, o que está incluso e por que sua proposta faz sentido."
                  defaultValue={existingProviderBid?.message ?? ""}
                />
                <Button type="submit">
                  {existingProviderBid ? "Atualizar lance" : "Enviar lance"}
                </Button>
              </form>
            </section>
          ) : !user ? (
            <section className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold tracking-[0.24em] text-primary-strong uppercase">
                Sou prestador
              </p>
              <p className="mt-3 text-base leading-7 text-muted-strong">
                Entre na conta para ver o mural completo e responder com sua proposta.
              </p>
              <div className="mt-5">
                <Link href={`/login?next=/pedidos/${job.slug}`} className="inline-flex">
                  <Button>Entrar para dar lance</Button>
                </Link>
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
