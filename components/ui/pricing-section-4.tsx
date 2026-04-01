"use client";

import Link from "next/link";
import NumberFlow from "@number-flow/react";
import { motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { Check, Shield, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles as SparklesComp } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";

type PricingPlan = {
  id: "mensal" | "trimestral" | "anual";
  name: string;
  description: string;
  price: number;
  period: string;
  cta: string;
  tone: "soft" | "featured";
  popular?: boolean;
  includesTitle: string;
  includes: string[];
};

const plans: PricingPlan[] = [
  {
    id: "mensal",
    name: "Mensal",
    description: "Entrada mais leve para começar a usar a operação de pedidos.",
    price: 75,
    period: "/mês",
    cta: "Começar no mensal",
    tone: "soft" as const,
    includesTitle: "Inclui no plano:",
    includes: [
      "Perfil profissional público na VLservice",
      "Recebimento e gestão de pedidos de serviço",
      "Painel para acompanhar propostas e clientes",
      "Agenda integrada para organizar a operação",
    ],
  },
  {
    id: "trimestral",
    name: "Trimestral",
    description: "Melhor para quem quer organizar trimestre fechado de caixa.",
    price: 360,
    period: "/trimestre",
    cta: "Escolher trimestral",
    tone: "featured" as const,
    popular: true,
    includesTitle: "Mesmo acesso, com ciclo trimestral:",
    includes: [
      "Mesmos recursos do plano VLservice",
      "Menos preocupação com cobrança todo mês",
      "Estrutura ideal para operação recorrente",
      "Fluxo focado em pedidos, propostas e contratação",
    ],
  },
  {
    id: "anual",
    name: "Anual",
    description: "Ciclo de longo prazo para prestadores com operação estável.",
    price: 720,
    period: "/ano",
    cta: "Escolher anual",
    tone: "soft" as const,
    includesTitle: "Mesmo acesso, com visão anual:",
    includes: [
      "Plano único da VLservice sem mudar recursos",
      "Mais previsibilidade financeira ao longo do ano",
      "Base sólida para crescer com menos atrito operacional",
      "Acompanhamento completo de pedidos e clientes",
    ],
  },
];

const periodLabels = ["Mensal", "Trimestral", "Anual"] as const;

function formatPriceLabel(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function PricingSwitch({
  selected,
  onSwitch,
}: {
  selected: number;
  onSwitch: (value: number) => void;
}) {
  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full border border-white/12 bg-neutral-900/85 p-1">
        {periodLabels.map((label, index) => (
          <button
            key={label}
            onClick={() => onSwitch(index)}
            className={cn(
              "relative z-10 h-10 rounded-full px-4 py-1 text-sm font-medium transition-colors sm:px-6",
              selected === index ? "text-white" : "text-gray-300"
            )}
          >
            {selected === index ? (
              <motion.span
                layoutId="pricing-switch"
                className="absolute inset-0 rounded-full border-4 border-blue-600 bg-gradient-to-t from-blue-500 to-blue-600 shadow-sm shadow-blue-600"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            ) : null}
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PricingSection4() {
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(1);
  const pricingRef = useRef<HTMLDivElement>(null);
  const selectedPlan = useMemo(() => plans[selectedPlanIndex], [selectedPlanIndex]);

  const revealVariants = {
    visible: (index: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: index * 0.12,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  return (
    <section
      className="relative mx-auto min-h-screen overflow-x-hidden bg-[#030712]"
      ref={pricingRef}
    >
      <TimelineContent
        animationNum={0}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute top-0 h-96 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:70px_80px]" />
        <SparklesComp
          density={1800}
          direction="bottom"
          speed={1}
          color="#FFFFFF"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </TimelineContent>

      <TimelineContent
        animationNum={1}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute left-0 top-[-114px] h-[113.625vh] w-full overflow-hidden"
      >
        <div
          className="absolute left-[-568px] right-[-568px] top-0 h-[2053px] rounded-full"
          style={{
            border: "200px solid rgba(49,49,245,0.78)",
            filter: "blur(92px)",
            WebkitFilter: "blur(92px)",
          }}
        />
      </TimelineContent>

      <div className="absolute left-[10%] right-[10%] top-0 z-0 h-full w-[80%] opacity-60 mix-blend-multiply">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgba(32,108,232,0.72) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <article className="mx-auto mb-10 max-w-3xl space-y-4 text-center">
          <TimelineContent
            as="div"
            animationNum={2}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-white/72 uppercase">
              <Sparkles className="h-4 w-4" />
              Preços VLservice
            </span>
          </TimelineContent>

          <h1 className="text-4xl font-medium tracking-[-0.05em] text-white sm:text-5xl">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.12}
              staggerFrom="first"
              reverse
              containerClassName="justify-center"
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 40,
                delay: 0,
              }}
            >
              Um plano unico. Tres ciclos de cobranca.
            </VerticalCutReveal>
          </h1>

          <TimelineContent
            as="p"
            animationNum={3}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="mx-auto max-w-2xl text-base leading-8 text-gray-300 sm:text-lg"
          >
            A VLservice nao vende recurso diferente por plano. O acesso ao
            sistema e o mesmo. O que muda e so a forma de cobranca:
            mensal, trimestral ou anual.
          </TimelineContent>

          <TimelineContent
            as="div"
            animationNum={4}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <PricingSwitch
              selected={selectedPlanIndex}
              onSwitch={setSelectedPlanIndex}
            />
          </TimelineContent>
        </article>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan, index) => {
              const selected = index === selectedPlanIndex;

              return (
                <TimelineContent
                  key={plan.id}
                  as="div"
                  animationNum={5 + index}
                  timelineRef={pricingRef}
                  customVariants={revealVariants}
                >
                  <Card
                    className={cn(
                      "relative h-full rounded-[1.9rem] border text-white transition duration-300",
                      selected
                        ? "border-blue-500/50 bg-gradient-to-b from-[#161b35] via-[#0f1327] to-[#090b15] shadow-[0_-13px_120px_0_rgba(9,0,255,0.35)]"
                        : "border-neutral-800 bg-gradient-to-b from-neutral-900 via-neutral-900 to-[#10121d]"
                    )}
                  >
                    {plan.popular ? (
                      <div className="absolute right-4 top-4 rounded-full border border-blue-400/40 bg-blue-500/18 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-blue-100 uppercase">
                        Destaque
                      </div>
                    ) : null}

                    <CardHeader className="text-left">
                      <h3 className="text-3xl font-semibold">{plan.name}</h3>
                      <div className="mt-2 flex items-end gap-1">
                        <span className="text-2xl font-semibold text-white/90">
                          R$
                        </span>
                        <NumberFlow
                          value={plan.price}
                          format={{
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }}
                          className="text-4xl font-semibold"
                        />
                        <span className="mb-1 ml-1 text-sm text-gray-300">
                          {plan.period}
                        </span>
                      </div>
                      <p className="text-sm leading-7 text-gray-300">
                        {plan.description}
                      </p>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <button
                        type="button"
                        onClick={() => setSelectedPlanIndex(index)}
                        className={cn(
                          "mb-6 w-full rounded-xl border p-4 text-base font-semibold",
                          selected
                            ? "border-blue-500 bg-gradient-to-t from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-800/50"
                            : "border-neutral-800 bg-gradient-to-t from-neutral-950 to-neutral-700 text-white shadow-lg shadow-neutral-950/50"
                        )}
                      >
                        {plan.cta}
                      </button>

                      <div className="space-y-3 border-t border-neutral-700 pt-4">
                        <h4 className="mb-3 text-base font-medium">
                          {plan.includesTitle}
                        </h4>
                        <ul className="space-y-3">
                          {plan.includes.map((feature) => (
                            <li key={feature} className="flex gap-2">
                              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                                <Check className="h-3.5 w-3.5 text-white/90" />
                              </span>
                              <span className="text-sm leading-6 text-gray-300">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TimelineContent>
              );
            })}
          </div>

          <TimelineContent
            as="aside"
            animationNum={9}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 text-white shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8"
          >
            <div className="flex items-center gap-2 text-white/70">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase">
                Plano selecionado
              </span>
            </div>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
              {selectedPlan.name}
            </h2>
            <p className="mt-4 text-base leading-8 text-white/72">
              {selectedPlan.description}
            </p>

            <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-black/28 p-5">
              <p className="text-sm font-semibold text-white/70">Valor do ciclo</p>
              <p className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
                R$ {formatPriceLabel(selectedPlan.price)}
              </p>
              <p className="mt-2 text-sm text-white/60">{selectedPlan.period}</p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-sm font-semibold text-white">Mesmo acesso</p>
                <p className="mt-1 text-sm leading-6 text-white/68">
                  Todos os ciclos usam a mesma estrutura do produto.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-sm font-semibold text-white">Foco em pedidos</p>
                <p className="mt-1 text-sm leading-6 text-white/68">
                  Cliente publica a dor, prestadores enviam propostas e o
                  contratante escolhe a melhor.
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
          </TimelineContent>
        </div>
      </div>
    </section>
  );
}
