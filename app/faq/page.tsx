import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Vitrine Lojas",
  description:
    "Perguntas frequentes sobre funcionamento, planos e operação da plataforma Vitrine Lojas.",
};

const faqs = [
  {
    question: "A Vitrine Lojas é um marketplace ou um SaaS?",
    answer:
      "Ela nasce como os dois: uma experiência de marketplace para descoberta e agendamento, com uma estrutura de SaaS para gestão, assinatura e operação.",
  },
  {
    question: "O produto já está preparado para mobile?",
    answer:
      "Sim. A arquitetura foi pensada para reaproveitar regras, componentes e integrações no futuro app com React Native.",
  },
  {
    question: "Como os perfis de cliente e prestador são separados?",
    answer:
      "A separação acontece desde o cadastro e é reforçada no banco por roles e políticas RLS no Supabase.",
  },
  {
    question: "Os pagamentos já estão conectados?",
    answer:
      "A base foi preparada para Stripe em modo de teste, com planos e limitações por assinatura já refletidos no schema.",
  },
];

export default function FaqPage() {
  return (
    <main id="conteudo" className="page-shell py-16">
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
          FAQ
        </p>
        <h1 className="mt-4 font-sans text-5xl font-bold tracking-tight text-slate-950">
          Perguntas frequentes com linguagem clara e sem fricção.
        </h1>
      </section>

      <section className="mx-auto mt-12 max-w-4xl space-y-4">
        {faqs.map((item) => (
          <details
            key={item.question}
            className="elevated-card rounded-[2rem] border border-border bg-white p-6"
          >
            <summary className="cursor-pointer list-none text-lg font-semibold text-slate-950">
              {item.question}
            </summary>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-strong">
              {item.answer}
            </p>
          </details>
        ))}
      </section>
    </main>
  );
}
