import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  MessageSquareText,
  WalletCards,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

const workflowSteps = [
  {
    number: "01",
    title: "Descreva o problema com clareza",
    description:
      "Categoria, cidade, orçamento e detalhes entram primeiro para qualificar melhor o pedido.",
  },
  {
    number: "02",
    title: "Receba propostas no mesmo contexto",
    description:
      "Os profissionais respondem com preço, prazo e mensagem, sem tirar o cliente do fluxo.",
  },
  {
    number: "03",
    title: "Compare e escolha o melhor ajuste",
    description:
      "A contratação nasce da comparação entre as propostas e da conversa dentro do pedido.",
  },
];

const customerReasons = [
  {
    title: "Comparação real de propostas",
    description:
      "Preço, prazo e avaliação do profissional aparecem lado a lado, no mesmo job.",
    icon: WalletCards,
  },
  {
    title: "Chat no contexto do pedido",
    description:
      "A conversa continua conectada à necessidade publicada, sem perder histórico ou contexto.",
    icon: MessageSquareText,
  },
  {
    title: "Escolha com mais segurança",
    description:
      "O cliente não precisa adivinhar quem chamar. Ele recebe interesse e decide com mais clareza.",
    icon: BadgeCheck,
  },
];

const providerReasons = [
  "Mural de pedidos por categoria e localização, sem depender da home para gerar demanda.",
  "5 lances grátis por dia para começar a operar sem fricção.",
  "Depois disso, pacote simples de 20 lances por R$ 10 para continuar participando.",
];

export function HomeFoundationSections() {
  return (
    <>
      <section className="border-b border-border bg-white">
        <div className="page-shell py-18">
          <SectionHeading
            eyebrow="Como funciona"
            title="O pedido organiza a jornada inteira do começo ao fim"
            description="A home deixa de vender o catálogo e passa a iniciar a contratação. Esse é o mesmo raciocínio que faz o GetNinjas converter melhor na entrada."
          />

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {workflowSteps.map((step, index) => (
              <article
                key={step.number}
                data-reveal
                data-reveal-delay={120 + index * 60}
                className="border-t border-slate-200 pt-5"
              >
                <p className="text-[0.72rem] font-semibold tracking-[0.26em] text-primary-strong uppercase">
                  {step.number}
                </p>
                <h3 className="mt-4 max-w-xs font-sans text-2xl font-bold tracking-tight text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-4 max-w-sm text-base leading-8 text-muted-strong">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-[linear-gradient(180deg,rgba(248,250,252,0.94),rgba(224,231,255,0.45))]">
        <div className="page-shell grid gap-10 py-18 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionHeading
              eyebrow="Por que funciona"
              title="O cliente ganha clareza. O profissional ganha intenção de compra."
              description="A estrutura certa para serviços locais não começa em uma lista infinita de prestadores. Ela começa no problema concreto que precisa ser resolvido."
            />
          </div>

          <div className="space-y-5">
            {customerReasons.map((item, index) => (
              <div
                key={item.title}
                data-reveal
                data-reveal-delay={120 + index * 45}
                className="flex items-start gap-4 rounded-[1.8rem] border border-white/80 bg-white/88 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] backdrop-blur"
              >
                <div className="rounded-2xl bg-primary-soft p-3 text-primary-strong">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted-strong">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-18">
        <div
          data-reveal
          className="rounded-[2.2rem] border border-slate-900/90 bg-slate-950 p-8 text-white lg:p-12"
        >
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-slate-300 uppercase">
                Para profissionais
              </p>
              <h2 className="mt-4 max-w-2xl font-sans text-4xl font-bold tracking-tight">
                O prestador entra no mural de pedidos e decide onde vale dar lance.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                A demanda nasce do lado do cliente. O profissional entra com
                contexto, proposta e conversa, sem depender da home como catálogo
                principal.
              </p>
            </div>

            <div className="rounded-[1.8rem] border border-white/10 bg-white/6 p-6 backdrop-blur">
              <div className="flex items-center gap-3">
                <BriefcaseBusiness className="h-5 w-5 text-primary-200" />
                <p className="text-sm font-semibold text-white">
                  Regra de entrada para dar lance
                </p>
              </div>
              <div className="mt-5 space-y-4">
                {providerReasons.map((reason) => (
                  <p
                    key={reason}
                    className="border-b border-white/10 pb-4 text-sm leading-7 text-slate-300 last:border-b-0 last:pb-0"
                  >
                    {reason}
                  </p>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/pedidos/novo" className="inline-flex">
                  <Button>Publicar pedido</Button>
                </Link>
                <Link href="/dashboard/provider/pedidos" className="inline-flex">
                  <Button
                    variant="secondary"
                    className="border-white/15 bg-white text-slate-950"
                    icon={<ArrowRight className="h-4 w-4" />}
                  >
                    Entrar como prestador
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
