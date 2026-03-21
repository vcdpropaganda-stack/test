import type { Metadata } from "next";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Preços | Vitrine Lojas",
  description:
    "Planos iniciais da Vitrine Lojas para prestadores com progressão clara de recursos.",
};

const plans = [
  {
    name: "Básico",
    price: "R$ 49",
    description: "Para prestadores iniciando operação digital.",
    features: ["Até 3 serviços", "Agenda básica", "Perfil público"],
  },
  {
    name: "Pro",
    price: "R$ 119",
    description: "Para quem precisa de mais volume e apresentação mais forte.",
    features: ["Até 10 serviços", "Destaque no marketplace", "Métricas básicas"],
  },
  {
    name: "Avançado",
    price: "R$ 249",
    description: "Para operações em crescimento com foco em escala e marca.",
    features: ["Serviços ilimitados", "Posicionamento prioritário", "Suporte prioritário"],
  },
];

export default function PrecosPage() {
  return (
    <main id="conteudo" className="page-shell py-16">
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
          Preços
        </p>
        <h1 className="mt-4 font-sans text-5xl font-bold tracking-tight text-slate-950">
          Planos claros, sem ruído e preparados para crescer com o produto.
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-strong">
          A base de assinatura do prestador já conversa com o schema do
          Supabase e com a futura integração com Stripe.
        </p>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <article
            key={plan.name}
            className={`elevated-card rounded-[2rem] border p-8 ${
              index === 1
                ? "border-primary bg-slate-950 text-white"
                : "border-border bg-white text-slate-950"
            }`}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em]">
              {plan.name}
            </p>
            <p className="mt-5 font-sans text-5xl font-bold tracking-tight">
              {plan.price}
              <span className="text-base font-medium opacity-70">/mes</span>
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
        ))}
      </section>
    </main>
  );
}
