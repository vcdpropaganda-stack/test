import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JobCard } from "@/components/jobs/job-card";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { formatJobBudget, formatJobLocation, getOpenJobs } from "@/lib/jobs";

export const metadata: Metadata = {
  title: "Pedidos de Serviço | VLservice",
  description:
    "Mural de pedidos aberto para clientes publicarem necessidades e prestadores responderem com lances.",
};

export const revalidate = 60;

type JobsPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const { message } = await searchParams;
  const jobs = await getOpenJobs(18);

  return (
    <main id="conteudo" className="page-shell py-10 sm:py-14">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#0f172a,#312e81_60%,#6366f1)] p-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
        <p className="text-sm font-semibold tracking-[0.26em] text-white/70 uppercase">
          Pedidos
        </p>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="font-sans text-4xl font-bold tracking-tight">
              O cliente publica a dor. O prestador entra no mural e dá lance.
            </h1>
            <p className="mt-4 text-base leading-7 text-white/82">
              Esse é o novo fluxo principal do produto. Em vez de depender só do
              catálogo, o cliente abre um pedido e recebe propostas comparáveis.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/pedidos/novo" className="inline-flex">
              <Button>Preciso de um serviço</Button>
            </Link>
            <Link href="/dashboard/provider/pedidos" className="inline-flex">
              <Button variant="secondary" icon={<ArrowRight className="h-4 w-4" />}>
                Sou prestador, ver mural
              </Button>
            </Link>
          </div>
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
            />
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-border bg-white p-8 lg:col-span-3">
            <p className="text-lg font-semibold text-slate-950">
              Ainda não existem pedidos abertos.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-strong">
              Publique o primeiro pedido para inaugurar o mural e começar a receber
              propostas dos prestadores.
            </p>
            <div className="mt-5">
              <Link href="/pedidos/novo" className="inline-flex">
                <Button>Publicar pedido</Button>
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
