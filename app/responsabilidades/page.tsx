import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Responsabilidades | VLservice",
  description:
    "Diretrizes de responsabilidades entre plataforma, prestadores, clientes e parceiros na VLservice.",
};

const blocks = [
  {
    title: "Responsabilidades da plataforma",
    items: [
      "Disponibilizar infraestrutura digital para publicação, descoberta, contratação e gestão operacional dos serviços.",
      "Adotar medidas razoáveis de segurança da informação, disponibilidade e integridade do ambiente.",
      "Manter regras de uso, políticas institucionais e canais mínimos de suporte e comunicação.",
    ],
  },
  {
    title: "Responsabilidades dos prestadores",
    items: [
      "Publicar informações verdadeiras, atualizadas e compatíveis com os serviços ofertados.",
      "Cumprir prazos, condições comerciais, escopo, atendimento e conduta profissional perante clientes.",
      "Responder por autorizações, licenças, capacidade técnica e obrigações legais relacionadas à atividade exercida.",
    ],
  },
  {
    title: "Responsabilidades dos clientes",
    items: [
      "Fornecer dados corretos para cadastro, contato, agendamento e execução do serviço.",
      "Utilizar a plataforma de boa-fé, sem fraudes, abusos, assédio, uso indevido ou tentativa de burlar regras operacionais.",
      "Observar descrições, escopos, limitações e políticas aplicáveis aos serviços contratados.",
    ],
  },
  {
    title: "Limites de responsabilidade",
    items: [
      "A plataforma atua como ambiente digital de intermediação e gestão, não substituindo a análise individual do serviço pelo contratante.",
      "Sempre que permitido pela legislação aplicável, perdas indiretas, lucros cessantes e danos decorrentes de uso indevido por terceiros poderão ser excluídos ou limitados.",
      "Casos concretos poderão exigir apuração específica, inclusive para prevenção à fraude, cumprimento legal e preservação de provas.",
    ],
  },
];

export default function ResponsabilidadesPage() {
  return (
    <main id="conteudo" className="page-shell py-16">
      <section className="mx-auto max-w-5xl rounded-[2rem] border border-border bg-white p-8 shadow-sm lg:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
            Legal
          </p>
          <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-slate-950">
            Responsabilidades e limites operacionais
          </h1>
          <p className="mt-6 text-base leading-8 text-muted-strong">
            Estrutura institucional para esclarecer deveres mínimos de
            plataforma, prestadores, clientes e demais participantes do
            ecossistema VLservice.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {blocks.map((block) => (
            <section key={block.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-950">
                {block.title}
              </h2>
              <ul className="mt-5 space-y-3 text-sm leading-8 text-muted-strong">
                {block.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
