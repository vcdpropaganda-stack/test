"use client";

import Link from "next/link";
import NumberFlow from "@number-flow/react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type PricingPlan = {
  id: "mensal" | "trimestral" | "anual";
  name: string;
  label: string;
  price: number;
  period: string;
  description: string;
  eyebrow: string;
  highlight?: string;
  cta: string;
  features: string[];
};

const plans: PricingPlan[] = [
  {
    id: "mensal",
    name: "Mensal",
    label: "Mensal",
    price: 75,
    period: "/mês",
    eyebrow: "Entrada leve",
    description:
      "Para começar com investimento menor e entrar rápido no fluxo de pedidos.",
    cta: "Começar no mensal",
    features: [
      "Plano único da VLservice",
      "Receba pedidos e propostas no mesmo painel",
      "Perfil profissional público",
      "Agenda e operação em um só lugar",
    ],
  },
  {
    id: "trimestral",
    name: "Trimestral",
    label: "Trimestral",
    price: 360,
    period: "/trimestre",
    eyebrow: "Ritmo operacional",
    description:
      "Boa opção para organizar trimestre fechado e reduzir atrito de cobrança mensal.",
    cta: "Escolher trimestral",
    features: [
      "Mesmo acesso completo do plano VLservice",
      "Mais previsibilidade no trimestre",
      "Operação mais estável para captar pedidos",
      "Menos interrupção na rotina do prestador",
    ],
  },
  {
    id: "anual",
    name: "Anual",
    label: "Anual",
    price: 720,
    period: "/ano",
    eyebrow: "Mais vantajoso",
    description:
      "Melhor escolha para quem quer margem melhor, previsibilidade e compromisso de longo prazo.",
    highlight: "Melhor opção",
    cta: "Escolher anual",
    features: [
      "Mesmo acesso completo do plano VLservice",
      "Melhor custo por permanência na plataforma",
      "Menos atrito operacional ao longo do ano",
      "Formato ideal para prestador que quer crescer com consistência",
    ],
  },
];

function formatPriceLabel(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function PricingSelector({
  selectedId,
  onChange,
}: {
  selectedId: PricingPlan["id"];
  onChange: (value: PricingPlan["id"]) => void;
}) {
  return (
    <div className="flex justify-center">
      <div className="inline-flex rounded-full border border-white/10 bg-white/6 p-1 shadow-[0_14px_34px_rgba(2,6,23,0.18)] backdrop-blur-xl">
        {plans.map((plan) => {
          const selected = plan.id === selectedId;

          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onChange(plan.id)}
              className={cn(
                "relative min-w-28 rounded-full px-5 py-3 text-sm font-semibold transition sm:min-w-32",
                selected ? "text-white" : "text-white/72 hover:text-white"
              )}
            >
              {selected ? (
                <motion.span
                  layoutId="pricing-selector-pill"
                  className={cn(
                    "absolute inset-0 rounded-full",
                    plan.id === "anual"
                      ? "bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 shadow-[0_10px_28px_rgba(251,191,36,0.32)]"
                      : "bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_10px_28px_rgba(59,130,246,0.28)]"
                  )}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10",
                  selected && plan.id === "anual" ? "text-slate-950" : ""
                )}
              >
                {plan.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function PricingSection4() {
  const [selectedPlanId, setSelectedPlanId] =
    useState<PricingPlan["id"]>("anual");

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? plans[2],
    [selectedPlanId]
  );

  return (
    <section className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#050816_0%,#09132c_24%,#0d1730_58%,#050816_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.42),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(180deg,rgba(255,255,255,0.6),rgba(255,255,255,0.12))]" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col px-4 pb-20 pt-24 sm:px-6 lg:px-10 lg:pt-30">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/7 px-4 py-2 text-xs font-semibold tracking-[0.24em] text-white/72 uppercase backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Preços VLservice
          </span>

          <h1 className="mx-auto mt-7 max-w-4xl text-balance text-4xl font-semibold leading-[0.94] tracking-[-0.06em] text-white sm:text-6xl lg:text-[5.3rem]">
            Um plano único.
            <span className="block text-white/72">Três ciclos de cobrança.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/68 sm:text-xl">
            Nada de recurso duplicado ou tabela confusa. Você escolhe só como
            quer pagar. O acesso é o mesmo. O anual já entra em destaque por
            ser a opção mais vantajosa.
          </p>
        </div>

        <div className="mt-10">
          <PricingSelector
            selectedId={selectedPlanId}
            onChange={setSelectedPlanId}
          />
        </div>

        <div className="mx-auto mt-12 grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1.1fr)_320px] lg:items-center">
          <div className="perspective-[2000px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPlan.id}
                initial={{ opacity: 0, rotateX: -10, rotateY: 90, scale: 0.96 }}
                animate={{ opacity: 1, rotateX: 0, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateX: 8, rotateY: -90, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "relative overflow-hidden rounded-[2.5rem] border p-7 shadow-[0_30px_100px_rgba(2,6,23,0.45)] backdrop-blur-2xl sm:p-10",
                  selectedPlan.id === "anual"
                    ? "border-amber-300/35 bg-[linear-gradient(135deg,rgba(255,248,220,0.18),rgba(20,16,8,0.88)_26%,rgba(10,12,20,0.96)_100%)]"
                    : selectedPlan.id === "trimestral"
                      ? "border-blue-400/28 bg-[linear-gradient(135deg,rgba(96,165,250,0.16),rgba(15,23,42,0.92)_24%,rgba(9,15,32,0.96)_100%)]"
                      : "border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(15,23,42,0.92)_24%,rgba(6,10,18,0.96)_100%)]"
                )}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_24%)]" />

                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={cn(
                          "rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.2em] uppercase",
                          selectedPlan.id === "anual"
                            ? "border-amber-300/40 bg-amber-300/16 text-amber-100"
                            : "border-white/12 bg-white/8 text-white/72"
                        )}
                      >
                        {selectedPlan.eyebrow}
                      </span>
                      {selectedPlan.highlight ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/45 bg-amber-300/16 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-amber-100 uppercase">
                          <Star className="h-3.5 w-3.5" />
                          {selectedPlan.highlight}
                        </span>
                      ) : null}
                    </div>

                    <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                      {selectedPlan.name}
                    </h2>
                    <p className="mt-4 max-w-lg text-base leading-8 text-white/70 sm:text-lg">
                      {selectedPlan.description}
                    </p>
                  </div>

                  <div className="rounded-[2rem] border border-white/10 bg-black/24 px-6 py-5">
                    <p className="text-sm font-semibold tracking-[0.14em] text-white/52 uppercase">
                      Valor do ciclo
                    </p>
                    <div className="mt-3 flex items-end gap-2">
                      <span className="text-2xl font-semibold text-white/82">R$</span>
                      <NumberFlow
                        value={selectedPlan.price}
                        format={{
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }}
                        className="text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl"
                      />
                    </div>
                    <p className="mt-2 text-base text-white/54">
                      {selectedPlan.period}
                    </p>
                  </div>
                </div>

                <div className="relative mt-10 grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
                  <div className="rounded-[2rem] border border-white/10 bg-black/22 p-6">
                    <p className="text-sm font-semibold tracking-[0.18em] text-white/52 uppercase">
                      O que você leva
                    </p>
                    <ul className="mt-5 space-y-4">
                      {selectedPlan.features.map((feature) => (
                        <li key={feature} className="flex gap-3">
                          <span
                            className={cn(
                              "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                              selectedPlan.id === "anual"
                                ? "bg-amber-300/16 text-amber-100"
                                : "bg-white/10 text-white/90"
                            )}
                          >
                            <Check className="h-4 w-4" />
                          </span>
                          <span className="text-sm leading-7 text-white/74 sm:text-base">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6">
                      <p className="text-sm font-semibold text-white">Plano único</p>
                      <p className="mt-2 text-sm leading-7 text-white/64">
                        A VLservice não troca recurso por ciclo. Muda só a forma
                        de cobrança.
                      </p>
                    </div>

                    <div
                      className={cn(
                        "rounded-[2rem] border p-6",
                        selectedPlan.id === "anual"
                          ? "border-amber-300/28 bg-amber-300/10"
                          : "border-white/10 bg-white/6"
                      )}
                    >
                      <p className="text-sm font-semibold text-white">
                        {selectedPlan.id === "anual"
                          ? "Melhor opção para margem"
                          : "Comparação simples"}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-white/64">
                        {selectedPlan.id === "anual"
                          ? "Deixamos o anual como padrão porque ele é o ciclo mais interessante para retenção e margem do negócio."
                          : "Se preferir mais flexibilidade de entrada, você ainda pode começar no mensal ou no trimestral sem perder acesso."}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Link
                        href="/cadastro?role=provider"
                        className={cn(
                          "inline-flex min-h-13 flex-1 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition",
                          selectedPlan.id === "anual"
                            ? "bg-amber-300 text-slate-950 shadow-[0_16px_36px_rgba(251,191,36,0.22)] hover:bg-amber-200"
                            : "bg-white text-slate-950 hover:bg-slate-100"
                        )}
                      >
                        {selectedPlan.cta}
                      </Link>
                      <Link
                        href="/contato"
                        className="inline-flex min-h-13 flex-1 items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        Falar com o time
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="grid gap-3">
            {plans.map((plan) => {
              const active = plan.id === selectedPlanId;

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={cn(
                    "rounded-[1.8rem] border px-5 py-5 text-left transition",
                    active
                      ? plan.id === "anual"
                        ? "border-amber-300/34 bg-amber-300/10 shadow-[0_18px_40px_rgba(251,191,36,0.12)]"
                        : "border-blue-400/26 bg-blue-400/10 shadow-[0_18px_40px_rgba(59,130,246,0.1)]"
                      : "border-white/10 bg-white/5 hover:bg-white/8"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-white">{plan.name}</p>
                      <p className="mt-1 text-sm text-white/56">{plan.period}</p>
                    </div>
                    {plan.id === "anual" ? (
                      <span className="rounded-full border border-amber-300/34 bg-amber-300/14 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-amber-100 uppercase">
                        Prioridade
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
                    R$ {formatPriceLabel(plan.price)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
