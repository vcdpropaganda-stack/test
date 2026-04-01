import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Preços | VLservice",
  description:
    "Plano único da VLservice com cobrança mensal, trimestral ou anual para prestadores de serviço.",
};

const billingCycles = [
  {
    name: "Mensal",
    price: "R$ 75,00",
    note: "Cobrança recorrente todos os meses.",
    highlight: false,
  },
  {
    name: "Trimestral",
    price: "R$ 360,00",
    note: "Cobrança a cada 3 meses.",
    highlight: true,
  },
  {
    name: "Anual",
    price: "R$ 720,00",
    note: "Cobrança única por 12 meses.",
    highlight: false,
  },
] as const;

const features = [
  "Perfil profissional público na plataforma",
  "Recebimento e gestão de pedidos de serviço",
  "Painel para acompanhar propostas e clientes",
  "Agenda e organização da operação em um só lugar",
];

export default function PricingPage() {
  return (
    <main className="bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-primary/15 bg-white/85 px-4 py-2 text-xs font-semibold tracking-[0.24em] text-primary uppercase shadow-[0_16px_40px_rgba(99,102,241,0.12)]">
            Preços
          </span>
          <h1 className="mt-6 font-sans text-4xl leading-tight font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            Um único plano, com três ciclos de cobrança.
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
            A VLservice não trabalha com planos diferentes para mudar recurso.
            O acesso é o mesmo. Você só escolhe como prefere pagar:
            mensalmente, por trimestre ou por ano.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-slate-200/70 bg-white/92 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-6">
              <span className="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase">
                Plano VLservice
              </span>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                Mesma estrutura, só muda o ciclo de cobrança.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Ideal para prestadores que querem captar pedidos, enviar
                propostas e organizar atendimento em uma plataforma focada em
                serviços locais.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {billingCycles.map((cycle) => (
                <article
                  key={cycle.name}
                  className={`rounded-[1.75rem] border p-5 transition ${
                    cycle.highlight
                      ? "border-primary/25 bg-primary/[0.06] shadow-[0_18px_50px_rgba(99,102,241,0.14)]"
                      : "border-slate-200 bg-slate-50/85"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-950">
                      {cycle.name}
                    </h3>
                    {cycle.highlight ? (
                      <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-white uppercase">
                        Destaque
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-slate-950">
                    {cycle.price}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {cycle.note}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  {feature}
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-[2rem] border border-slate-200/70 bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:p-8">
            <span className="text-sm font-semibold tracking-[0.2em] text-white/60 uppercase">
              Como contratar
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
              Escolha o ciclo que encaixa melhor no seu caixa.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/72 sm:text-base">
              O acesso ao sistema continua o mesmo. O que muda aqui é só a
              forma de cobrança.
            </p>

            <div className="mt-8 space-y-3">
              <div className="rounded-2xl border border-white/12 bg-white/6 px-4 py-4">
                <p className="text-sm font-semibold text-white">Mensal</p>
                <p className="mt-1 text-sm text-white/70">
                  Melhor para começar com investimento menor.
                </p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/6 px-4 py-4">
                <p className="text-sm font-semibold text-white">Trimestral</p>
                <p className="mt-1 text-sm text-white/70">
                  Boa opção para quem quer planejar trimestre fechado.
                </p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/6 px-4 py-4">
                <p className="text-sm font-semibold text-white">Anual</p>
                <p className="mt-1 text-sm text-white/70">
                  Indicado para operação estável com visão de longo prazo.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/cadastro?role=provider"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Criar conta como prestador
              </Link>
              <Link
                href="/contato"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/16 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Falar com o time
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
