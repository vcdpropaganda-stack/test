import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacidade | Vitrine Lojas",
  description: "Política de privacidade institucional da plataforma Vitrine Lojas.",
};

const sections = [
  {
    title: "1. Finalidade desta política",
    paragraphs: [
      "Esta Política de Privacidade descreve como a Vitrine Lojas coleta, utiliza, armazena, compartilha e protege dados pessoais no contexto de navegação, cadastro, contratação, agendamento, atendimento e relacionamento com a plataforma.",
      "O documento serve como base institucional do produto e pode ser complementado por avisos específicos, contratos, termos adicionais, consentimentos e comunicações operacionais.",
    ],
  },
  {
    title: "2. Dados que podem ser coletados",
    paragraphs: [
      "A plataforma poderá tratar dados cadastrais, dados de contato, credenciais de autenticação, dados de perfil, dados de contratação, registros de navegação, preferências de uso, informações de suporte e evidências relacionadas a transações ou agendamentos.",
      "Dependendo da funcionalidade utilizada, também poderão ser tratados dados relacionados à comunicação entre as partes, histórico de atendimento, avaliações e registros técnicos necessários à segurança da operação.",
    ],
  },
  {
    title: "3. Finalidades do tratamento",
    paragraphs: [
      "Os dados poderão ser utilizados para criação e gestão de contas, autenticação, disponibilização de serviços, agendamento, suporte, prevenção à fraude, comunicação operacional, análise de desempenho, cumprimento de obrigações legais e proteção dos direitos da plataforma.",
      "Quando aplicável, dados também poderão ser usados para aprimoramento da experiência, personalização da interface, atendimento de solicitações e melhoria contínua do produto.",
    ],
  },
  {
    title: "4. Compartilhamento de informações",
    paragraphs: [
      "O compartilhamento poderá ocorrer com provedores de infraestrutura, autenticação, banco de dados, hospedagem, analytics, suporte, comunicação e demais parceiros estritamente necessários à operação do serviço.",
      "Informações também poderão ser compartilhadas quando houver obrigação legal, ordem de autoridade competente, necessidade de exercício regular de direitos ou investigação de fraude e abuso da plataforma.",
    ],
  },
  {
    title: "5. Segurança e governança",
    paragraphs: [
      "A Vitrine Lojas adota medidas razoáveis de segurança da informação compatíveis com a natureza dos dados tratados, incluindo controle de acesso, segregação de perfis, monitoramento técnico e restrição de uso indevido.",
      "Apesar dos esforços de proteção, nenhum ambiente digital é absolutamente imune a incidentes, motivo pelo qual práticas adicionais de senha forte, controle de acesso e revisão operacional também são recomendadas aos usuários.",
    ],
  },
  {
    title: "6. Exercício de direitos",
    paragraphs: [
      "Solicitações relacionadas a dados pessoais, privacidade e exercício de direitos poderão ser encaminhadas pelos canais oficiais disponibilizados pela plataforma.",
      "A resposta poderá depender de validação de identidade, contexto da solicitação, obrigações legais e fundamentos que justifiquem retenção, anonimização ou restrição temporária de acesso aos dados.",
    ],
  },
];

export default function PrivacidadePage() {
  return (
    <main id="conteudo" className="page-shell py-16">
      <section className="mx-auto max-w-5xl rounded-[2rem] border border-border bg-white p-8 shadow-sm lg:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
            Legal
          </p>
          <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-slate-950">
            Política de privacidade
          </h1>
          <p className="mt-6 text-base leading-8 text-muted-strong">
            Documento institucional com diretrizes gerais sobre coleta,
            tratamento, armazenamento, compartilhamento e proteção de dados no
            contexto da plataforma Vitrine Lojas.
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
