import type { Metadata } from "next";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Preços | VL Serviços",
  description: "Plano único da VL Serviços com cobrança mensal ou anual.",
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
  return (
    <main id="conteudo" className="page-shell py-16">
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

      <section className="mx-auto mt-12 max-w-3xl">
        <article className="elevated-card rounded-[2rem] border border-primary bg-slate-950 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]">{plan.name}</p>
          <p className="mt-5 text-sm font-medium uppercase tracking-[0.16em] text-white/70">Mensal</p>
          <p className="mt-2 font-sans text-5xl font-bold tracking-tight">{plan.monthlyPrice}</p>
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.16em] text-white/70">Anual</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            De <span className="line-through opacity-70">{plan.yearlyFrom}</span> por{" "}
            <span className="text-3xl">{plan.yearlyPrice}</span>
          </p>
          <p className="mt-4 text-sm leading-7 opacity-80">{plan.description}</p>
          <ul className="mt-8 space-y-3 text-sm">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
