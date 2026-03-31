import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { JobCard } from "@/components/jobs/job-card";
import { Notice } from "@/components/ui/notice";
import { getResolvedUserRole } from "@/lib/auth";
import { formatJobBudget, formatJobLocation, getJobBidStatusLabel } from "@/lib/jobs";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getProviderBidBalanceText,
  getProviderBidPackPriceText,
  getProviderBidPricingSummaryText,
  getProviderJobBidAllowance,
} from "@/lib/subscription";

export const metadata: Metadata = {
  title: "Pedidos Disponíveis | Painel do Prestador",
  description:
    "Mural de pedidos aberto para prestadores avaliarem jobs e enviarem lances.",
};

type ProviderJobsPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function ProviderJobsPage({
  searchParams,
}: ProviderJobsPageProps) {
  const { message } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard/provider/pedidos");
  }

  const role = await getResolvedUserRole(supabase, user);

  if (role !== "provider" && role !== "admin") {
    redirect("/dashboard/client/pedidos");
  }

  const providerProfileResult = await supabase
    .from("provider_profiles")
    .select("id, city")
    .eq("profile_id", user.id)
    .maybeSingle();

  const providerProfile = providerProfileResult.data;
  const nowIso = new Date().toISOString();

  const [jobsResult, ownBidsResult, providerServicesResult, bidAllowance] = await Promise.all([
    supabase
      .from("jobs")
      .select(
        `
        id,
        client_id,
        category_id,
        title,
        slug,
        description,
        city,
        neighborhood,
        budget_min_cents,
        budget_max_cents,
        desired_deadline_at,
        status,
        expires_at,
        created_at,
        category:service_categories (
          name,
          slug
        )
      `
      )
      .in("status", ["open", "has_bids"])
      .gt("expires_at", nowIso)
      .neq("client_id", user.id)
      .order("created_at", { ascending: false }),
    providerProfile
      ? supabase
          .from("job_bids")
          .select("job_id, status")
          .eq("provider_profile_id", providerProfile.id)
      : Promise.resolve({ data: [], error: null }),
    providerProfile
      ? supabase
          .from("services")
          .select("category_id")
          .eq("provider_profile_id", providerProfile.id)
          .eq("is_active", true)
      : Promise.resolve({ data: [], error: null }),
    providerProfile
      ? getProviderJobBidAllowance(supabase, providerProfile.id)
      : Promise.resolve(null),
  ]);

  const ownBidMap = new Map(
    (ownBidsResult.data ?? []).map((bid) => [bid.job_id, bid.status])
  );
  const providerCity = providerProfile?.city?.trim().toLocaleLowerCase("pt-BR") ?? null;
  const providerCategoryIds = new Set(
    (providerServicesResult.data ?? [])
      .map((service) => service.category_id)
      .filter((value): value is string => Boolean(value))
  );
  const jobs = (jobsResult.data ?? []).map((job) => ({
    ...job,
    category: Array.isArray(job.category) ? job.category[0] ?? null : job.category,
  }));
  const rankedJobs = jobs
    .map((job) => {
      const matchReasons: string[] = [];
      let matchScore = 0;
      const normalizedJobCity = job.city.trim().toLocaleLowerCase("pt-BR");

      if (providerCity && normalizedJobCity === providerCity) {
        matchScore += 4;
        matchReasons.push("mesma cidade");
      }

      if (job.category_id && providerCategoryIds.has(job.category_id)) {
        matchScore += 3;
        matchReasons.push("na sua categoria");
      }

      const ownBidStatus = ownBidMap.get(job.id) ?? null;

      if (ownBidStatus) {
        matchScore += 100;
      }

      return {
        ...job,
        matchScore,
        matchLabel: ownBidStatus
          ? `Seu lance: ${getJobBidStatusLabel(ownBidStatus)}`
          : matchReasons.length > 0
            ? `Prioridade: ${matchReasons.join(" • ")}`
            : "Novo pedido disponível no mural",
      };
    })
    .sort((left, right) => {
      if (right.matchScore !== left.matchScore) {
        return right.matchScore - left.matchScore;
      }

      return (
        new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
      );
    });
  const prioritizedJobsCount = rankedJobs.filter((job) => job.matchScore > 0).length;

  return (
    <main id="conteudo" className="page-shell py-10 sm:py-14">
      <section className="rounded-[2rem] border border-border bg-slate-950 p-8 text-white">
        <p className="text-sm text-slate-300">Mural do prestador</p>
        <h1 className="mt-3 font-sans text-4xl font-bold tracking-tight">
          Jobs disponíveis para você avaliar e responder com proposta
        </h1>
        <p className="mt-4 max-w-3xl text-slate-300">
          Aqui fica o coração do novo produto: pedidos abertos por clientes, com
          contexto suficiente para você decidir se vale dar lance.
        </p>
        <p className="mt-5 text-sm text-slate-400">
          {prioritizedJobsCount > 0
            ? `${prioritizedJobsCount} pedido(s) estão priorizados por compatibilidade com sua cidade ou categoria.`
            : "Quando seu perfil tiver cidade e serviços ativos, o mural vai priorizar o que combina mais com você."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-200">
          <span className="rounded-full bg-white/10 px-3 py-2">
            {getProviderBidPricingSummaryText()}
          </span>
          <span className="rounded-full bg-white/10 px-3 py-2">
            {getProviderBidBalanceText(bidAllowance)}
          </span>
          <span className="rounded-full bg-white/10 px-3 py-2">
            Pacote extra: {getProviderBidPackPriceText()}
          </span>
        </div>
      </section>

      {message ? <div className="mt-6"><Notice>{message}</Notice></div> : null}

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {rankedJobs.length > 0 ? (
          rankedJobs.map((job) => (
            <JobCard
              key={job.id}
              href={`/pedidos/${job.slug}`}
              title={job.title}
              description={job.description}
              category={job.category?.name ?? null}
              location={formatJobLocation(job)}
              budget={formatJobBudget(job)}
              status={job.status}
              deadline={
                job.desired_deadline_at
                  ? `Prazo até ${new Date(job.desired_deadline_at).toLocaleDateString("pt-BR")}`
                  : "Sem prazo fechado"
              }
              bidsLabel={job.matchLabel}
            />
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-border bg-white p-8 lg:col-span-3">
            <p className="text-lg font-semibold text-slate-950">
              Nenhum pedido aberto no momento.
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-strong">
              Assim que novos jobs compatíveis entrarem no mural, eles aparecerão aqui.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
