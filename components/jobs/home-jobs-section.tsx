import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JobCard } from "@/components/jobs/job-card";
import { Button } from "@/components/ui/button";
import { formatJobBudget, formatJobLocation, type JobSummary } from "@/lib/jobs";

type HomeJobsSectionProps = {
  jobs: JobSummary[];
};

export function HomeJobsSection({ jobs }: HomeJobsSectionProps) {
  return (
    <section className="page-shell py-12 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.26em] text-primary-strong uppercase">
            Pedidos de serviço
          </p>
          <h2 className="mt-3 font-sans text-4xl font-bold tracking-tight text-slate-950">
            Mural aberto para clientes publicarem a dor e prestadores darem lance
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-strong">
            Esse é o fluxo principal: o cliente descreve a necessidade, o prestador
            avalia o pedido e responde com proposta.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/pedidos/novo" className="inline-flex">
            <Button>Publicar pedido</Button>
          </Link>
          <Link href="/pedidos" className="inline-flex">
            <Button variant="secondary" icon={<ArrowRight className="h-4 w-4" />}>
              Ver mural completo
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {jobs.map((job) => (
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
                ? `Prazo desejado até ${new Date(job.desired_deadline_at).toLocaleDateString("pt-BR")}`
                : "Sem prazo fechado"
            }
          />
        ))}
      </div>
    </section>
  );
}
