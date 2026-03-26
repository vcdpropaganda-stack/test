import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies | VL Serviços",
  description:
    "Diretrizes de uso de cookies para navegação, preferências, segurança e desempenho na VL Serviços.",
};

const sections = [
  {
    title: "1. O que são cookies",
    paragraphs: [
      "Cookies são pequenos arquivos armazenados no navegador para lembrar preferências, manter sessões, apoiar recursos de segurança e melhorar a experiência de navegação.",
      "Na VL Serviços, eles ajudam a manter consistência de uso, reduzir fricção no fluxo e medir desempenho da plataforma.",
    ],
  },
  {
    title: "2. Como utilizamos cookies",
    paragraphs: [
      "Utilizamos cookies estritamente necessários para funcionamento técnico do site, autenticação, estabilidade de sessão e proteção contra uso indevido.",
      "Também podem ser utilizados cookies de medição para análise de performance, diagnóstico de experiência e priorização de melhorias de produto.",
    ],
  },
  {
    title: "3. Gerenciamento de preferências",
    paragraphs: [
      "Você pode remover ou bloquear cookies diretamente nas configurações do navegador, observando que algumas funcionalidades podem ficar limitadas.",
      "O aviso de cookies da plataforma permite registrar seu aceite para reduzir interrupções durante a navegação.",
    ],
  },
  {
    title: "4. Relação com privacidade e termos",
    paragraphs: [
      "Esta política deve ser lida em conjunto com a Política de Privacidade, LGPD e Termos de Uso da VL Serviços.",
      "Ao continuar navegando e utilizar recursos da plataforma, você reconhece as práticas descritas neste documento.",
    ],
  },
];

export default function PoliticaDeCookiesPage() {
  return (
    <main id="conteudo" className="page-shell py-16">
      <section className="mx-auto max-w-5xl rounded-[2rem] border border-border bg-white p-8 shadow-sm lg:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
            Legal
          </p>
          <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-slate-950">
            Política de cookies
          </h1>
          <p className="mt-6 text-base leading-8 text-muted-strong">
            Diretrizes de uso de cookies para navegação, segurança, preferências
            e análise de desempenho na plataforma VL Serviços.
          </p>
        </div>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6"
            >
              <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-950">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-8 text-muted-strong">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
