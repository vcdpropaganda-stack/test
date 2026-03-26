import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LGPD | VL Serviços",
  description:
    "Diretrizes de tratamento de dados pessoais e direitos do titular na plataforma VL Serviços.",
};

const sections = [
  {
    title: "1. Compromisso com a proteção de dados",
    paragraphs: [
      "A VL Serviços trata dados pessoais em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018), adotando medidas técnicas, administrativas e organizacionais compatíveis com a natureza da operação da plataforma.",
      "Esta página apresenta, de forma objetiva, os princípios que orientam o tratamento de dados pessoais de clientes, prestadores, administradores, parceiros e visitantes da plataforma.",
    ],
  },
  {
    title: "2. Dados pessoais tratados",
    paragraphs: [
      "Podem ser tratados dados de identificação, contato, autenticação, navegação, contratação, agendamento, atendimento e histórico de interação com a plataforma, sempre de forma compatível com a finalidade informada ao titular.",
      "Quando aplicável, também podem ser tratados registros operacionais, evidências de aceite, dados de suporte e informações necessárias à prevenção de fraude, segurança da conta e cumprimento de obrigações legais.",
    ],
  },
  {
    title: "3. Bases legais aplicáveis",
    paragraphs: [
      "O tratamento pode ocorrer com fundamento em execução de contrato, cumprimento de obrigação legal ou regulatória, exercício regular de direitos, legítimo interesse, proteção ao crédito, prevenção à fraude ou consentimento, conforme o caso concreto.",
      "Quando o consentimento for a base legal aplicável, ele poderá ser revogado a qualquer tempo, observadas as limitações legais e os impactos operacionais dessa revogação.",
    ],
  },
  {
    title: "4. Direitos do titular",
    paragraphs: [
      "O titular pode solicitar confirmação da existência de tratamento, acesso, correção, anonimização, bloqueio, eliminação, portabilidade, informação sobre compartilhamentos e revisão de decisões automatizadas, nos termos da legislação aplicável.",
      "As solicitações poderão ser analisadas conforme requisitos legais, técnicos, operacionais e de segurança, inclusive para verificação de identidade e prevenção de uso indevido por terceiros.",
    ],
  },
  {
    title: "5. Retenção e descarte",
    paragraphs: [
      "Os dados são mantidos somente pelo período necessário para cumprir as finalidades informadas, atender exigências legais, resguardar direitos da plataforma e manter a integridade operacional do serviço.",
      "Após o encerramento da necessidade de uso, os dados poderão ser excluídos, anonimizados ou mantidos de forma restrita quando houver fundamento legal para retenção.",
    ],
  },
];

export default function LgpdPage() {
  return (
    <main id="conteudo" className="page-shell py-16">
      <section className="mx-auto max-w-5xl rounded-[2rem] border border-border bg-white p-8 shadow-sm lg:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
            Legal
          </p>
          <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-slate-950">
            LGPD e direitos do titular
          </h1>
          <p className="mt-6 text-base leading-8 text-muted-strong">
            Diretrizes gerais sobre proteção de dados pessoais, bases legais,
            direitos do titular e compromissos mínimos de governança da
            plataforma VL Serviços.
          </p>
        </div>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
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
