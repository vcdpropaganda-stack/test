import type { Metadata } from "next";
import { Check, Sparkles } from "lucide-react";
import {
  PROVIDER_PLAN_CATALOG,
  getProviderPlanPriceText,
} from "@/lib/subscription";

export const metadata: Metadata = {
  title: "Preços | VLservice",
  description: "Planos do VLservice para prestadores com operação em diferentes estágios.",
};

export default function PrecosPage() {
  return (
    <main id="conteudo" className="page-shell py-16 sm:py-20">
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
          Preços
        </p>
        <h1 className="mt-4 font-sans text-5xl font-bold tracking-tight text-slate-950">
          Planos simples para cada estágio da operação.
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-strong">
          Os valores atuais do VLservice são estes: R$ 75,00, R$ 360,00 e R$ 720,00 por mês.
        </p>
      </section>

      <section className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-3">
        {PROVIDER_PLAN_CATALOG.map((plan) => {
          const isFeatured = plan.key === "pro";

          return (
            <article
              key={plan.key}
              className={`relative overflow-hidden rounded-[2rem] border p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.45)] sm:p-8 ${
                isFeatured
                  ? "border-slate-900 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-950"
              }`}
            >
              <div
                className={`pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full blur-3xl ${
                  isFeatured ? "bg-primary/30" : "bg-indigo-200/45"
                }`}
              />

              <div className="relative z-10">
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${
                    isFeatured
                      ? "border-white/20 bg-white/10"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                    {plan.label}
                  </span>
                </div>

                <p
                  className={`mt-6 text-xs font-semibold uppercase tracking-[0.22em] ${
                    isFeatured ? "text-white/70" : "text-slate-500"
                  }`}
                >
                  Mensal
                </p>
                <p className="mt-2 font-sans text-5xl font-bold tracking-tight">
                  {getProviderPlanPriceText(plan.key)}
                </p>
                <p
                  className={`mt-3 text-sm leading-7 ${
                    isFeatured ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {plan.description}
                </p>

                <ul className="mt-8 space-y-3.5 text-[1.02rem]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 rounded-full p-1 ${
                          isFeatured
                            ? "bg-emerald-300/15 text-emerald-300"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        <Check className="h-4 w-4 shrink-0" />
                      </span>
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div
                  className={`mt-7 rounded-2xl border px-4 py-3 ${
                    isFeatured
                      ? "border-white/10 bg-white/6"
                      : "border-indigo-100 bg-indigo-50"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      isFeatured ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    Sem taxas escondidas e cancelamento simples.
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
