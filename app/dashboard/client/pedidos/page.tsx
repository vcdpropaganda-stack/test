import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { JobCard } from "@/components/jobs/job-card";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { getResolvedUserRole } from "@/lib/auth";
import { formatJobBudget, formatJobLocation } from "@/lib/jobs";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Meus Pedidos | Painel do Cliente",
  description:
    "Acompanhe seus pedidos publicados, lances recebidos e contratações em andamento.",
};

type ClientJobsPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function ClientJobsPage({
  searchParams,
}: ClientJobsPageProps) {
  const { message } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard/client/pedidos");
  }

  const role = await getResolvedUserRole(supabase, user);

  if (role === "provider") {
    redirect("/dashboard/provider/pedidos");
  }

  const jobsResult = await supabase
    .from("jobs")
    .select(
      `
      id,
      client_id,
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
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  const jobs = (jobsResult.data ?? []).map((job) => ({
    ...job,
    category: Array.isArray(job.category) ? job.category[0] ?? null : job.category,
  }));

  const bidsResult =
    jobs.length > 0
      ? await supabase
          .from("job_bids")
          .select("job_id, status")
          .in(
            "job_id",
            jobs.map((job) => job.id)
          )
      : { data: [], error: null };

  const bidsCountMap = new Map<string, number>();

  (bidsResult.data ?? []).forEach((bid) => {
    bidsCountMap.set(bid.job_id, (bidsCountMap.get(bid.job_id) ?? 0) + 1);
  });

  return (
    <main id="conteudo" className="page-shell py-10 sm:py-14">
      <section className="rounded-[2rem] border border-border bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm text-muted">Painel do cliente</p>
            <h1 className="mt-3 font-sans text-4xl font-bold tracking-tight text-slate-950">
              Seus pedidos publicados e os lances que chegaram
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-strong">
              A partir daqui você compara propostas, escolhe o melhor prestador e
              acompanha o andamento do job contratado.
            </p>
          </div>
          <Link href="/pedidos/novo" className="inline-flex">
            <Button icon={<Plus className="h-4 w-4" />}>Novo pedido</Button>
          </Link>
        </div>
      </section>

      {message ? <div className="mt-6"><Notice>{message}</Notice></div> : null}

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {jobs.length > 0 ? (
          jobs.map((job) => (
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
              bidsLabel={`${bidsCountMap.get(job.id) ?? 0} proposta(s)`}
            />
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-border bg-white p-8 lg:col-span-3">
            <p className="text-lg font-semibold text-slate-950">
              Você ainda não publicou nenhum pedido.
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-strong">
              Descreva a necessidade, publique no mural e deixe os prestadores virem até você com proposta.
            </p>
            <div className="mt-5">
              <Link href="/pedidos/novo" className="inline-flex">
                <Button>Novo pedido</Button>
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
