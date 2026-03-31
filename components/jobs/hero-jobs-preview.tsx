import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin, WalletCards } from "lucide-react";

export type HeroJobPreviewItem = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  location: string;
  budget: string;
  deadline: string | null;
};

type HeroJobsPreviewProps = {
  jobs: HeroJobPreviewItem[];
};

export function HeroJobsPreview({ jobs }: HeroJobsPreviewProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-slate-950 p-6 text-white shadow-[0_28px_90px_rgba(15,23,42,0.22)]">
      <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-primary/20 to-transparent" />
      <div className="relative z-10">
        <p className="text-[0.7rem] font-semibold tracking-[0.26em] text-slate-300 uppercase">
          Mural ao vivo
        </p>
        <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight">
          Pedidos reais entrando para receber lance
        </h2>
        <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
          O cliente publica a dor, o prestador compara o contexto e responde com
          proposta. Esse é o centro do produto agora.
        </p>

        <div className="mt-6 space-y-3">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Link
                key={job.id}
                href={`/pedidos/${job.slug}`}
                className="block rounded-[1.5rem] border border-white/10 bg-white/6 p-4 transition hover:border-primary/35 hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-primary-200 uppercase">
                      {job.category ?? "Pedido de serviço"}
                    </p>
                    <p className="mt-2 text-lg font-semibold leading-tight text-white">
                      {job.title}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary-200" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <WalletCards className="h-4 w-4 text-primary-200" />
                    {job.budget}
                  </span>
                  {job.deadline ? (
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-primary-200" />
                      {job.deadline}
                    </span>
                  ) : null}
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-white/18 bg-white/5 p-5">
              <p className="font-semibold text-white">
                O mural está pronto para receber os primeiros pedidos.
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Publique uma necessidade agora e a plataforma começa a girar em
                torno dos lances.
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <Link href="/pedidos" className="font-semibold text-white underline decoration-white/25 underline-offset-4">
            Abrir mural completo
          </Link>
          <span className="text-slate-500">|</span>
          <Link
            href="/dashboard/provider/pedidos"
            className="font-semibold text-primary-200 underline decoration-primary-200/35 underline-offset-4"
          >
            Entrar como prestador
          </Link>
        </div>
      </div>
    </section>
  );
}
