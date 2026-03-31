import type { Metadata } from "next";
import { Check, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Preços | VLservice",
  description: "Plano único da VLservice com cobrança mensal ou anual.",
};

const plan = {
  name: "UNICO",
  monthlyPrice: "R$ 75,00",
  yearlyFrom: "R$ 900,00",
  yearlyPrice: "R$ 765,00",
  description: "Plano único para prestadores da plataforma.",
  features: [
    "Serviços ilimitados",
    "Orçamentos ilimitados",
    "Agenda integrada",
    "Perfil público",
  ],
};

export default function PrecosPage() {
  const annualSavings = "R$ 135,00";

  return (
    <main id="conteudo" className="page-shell py-16 sm:py-20">
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
          Preços
        </p>
        <h1 className="mt-4 font-sans text-5xl font-bold tracking-tight text-slate-950">
          Plano único, simples e direto.
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-strong">
          Escolha entre cobrança mensal ou anual com desconto.
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-4xl">
        <article className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 text-slate-950 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.45)] sm:p-8">
          <div className="pointer-events-none absolute -left-10 -top-16 h-44 w-44 rounded-full bg-indigo-200/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-cyan-200/50 blur-3xl" />

          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[1.6rem] bg-[linear-gradient(135deg,#0f172a_0%,#111827_45%,#1e293b_100%)] p-6 text-white sm:p-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">{plan.name}</span>
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Mensal</p>
              <p className="mt-2 font-sans text-5xl font-bold tracking-tight">{plan.monthlyPrice}</p>

              <div className="mt-6 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">Anual com desconto</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  De <span className="line-through text-white/70">{plan.yearlyFrom}</span> por{" "}
                  <span className="text-2xl text-emerald-300">{plan.yearlyPrice}</span>
                </p>
                <p className="mt-1 text-sm text-emerald-100">Economia de {annualSavings} por ano</p>
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50/80 p-6 sm:p-7">
              <p className="text-sm leading-7 text-slate-700">{plan.description}</p>

              <ul className="mt-6 space-y-3.5 text-[1.02rem]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 rounded-full bg-emerald-100 p-1 text-emerald-700">
                      <Check className="h-4 w-4 shrink-0" />
                    </span>
                    <span className="font-medium text-slate-900">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3">
                <p className="text-sm font-semibold text-indigo-900">Sem taxas escondidas e cancelamento simples.</p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
