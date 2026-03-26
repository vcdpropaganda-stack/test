import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos | VL Serviços",
  description: "Termos de uso institucionais da plataforma VL Serviços.",
};

const sections = [
  {
    title: "1. Aceitação e escopo",
    paragraphs: [
      "Ao acessar, navegar, cadastrar-se ou utilizar a VL Serviços, o usuário declara ciência e concordância com estes Termos de Uso e com as políticas complementares aplicáveis à plataforma.",
      "Os presentes termos regulam o uso do ambiente digital, incluindo funcionalidades de cadastro, publicação de serviços, descoberta, agendamento, contratação, comunicação e gestão operacional.",
    ],
  },
  {
    title: "2. Cadastro e contas",
    paragraphs: [
      "O usuário é responsável por fornecer informações verdadeiras, completas e atualizadas, bem como por manter a confidencialidade das credenciais de acesso e restringir seu uso a pessoas autorizadas.",
      "A plataforma poderá adotar procedimentos de validação, bloqueio, revisão ou suspensão de contas quando houver indícios de fraude, uso indevido, descumprimento contratual ou risco à operação.",
    ],
  },
  {
    title: "3. Publicação e contratação de serviços",
    paragraphs: [
      "Prestadores são responsáveis pelo conteúdo, escopo, condições comerciais, qualidade técnica, disponibilidade e veracidade das ofertas publicadas na plataforma.",
      "Clientes devem avaliar atentamente descrição, preço, agenda, condições da oferta e informações do prestador antes de contratar ou solicitar o serviço.",
    ],
  },
  {
    title: "4. Condutas vedadas",
    paragraphs: [
      "É vedado utilizar a plataforma para fraude, spam, assédio, violação de direitos de terceiros, manipulação de avaliações, uso automatizado não autorizado, engenharia reversa indevida ou qualquer atividade contrária à legislação aplicável.",
      "Também é vedada a tentativa de contornar limites técnicos, políticas de assinatura, regras de acesso, mecanismos de segurança ou fluxos operacionais da plataforma.",
    ],
  },
  {
    title: "5. Suspensão, alteração e encerramento",
    paragraphs: [
      "A VL Serviços poderá alterar funcionalidades, layout, fluxos, preços, integrações, planos, políticas e termos a qualquer tempo, preservados os direitos legalmente exigíveis.",
      "Contas ou conteúdos poderão ser suspensos, revisados ou removidos quando houver descumprimento destes termos, risco operacional, exigência legal ou necessidade de proteção do ecossistema da plataforma.",
    ],
  },
];

export default function TermosPage() {
  return (
    <main id="conteudo" className="page-shell py-16">
      <section className="mx-auto max-w-5xl rounded-[2rem] border border-border bg-white p-8 shadow-sm lg:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
            Legal
          </p>
          <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight text-slate-950">
            Termos de uso
          </h1>
          <p className="mt-6 text-base leading-8 text-muted-strong">
            Regras gerais de utilização da plataforma, condições de acesso,
            condutas esperadas, limites operacionais e diretrizes aplicáveis ao
            ecossistema VL Serviços.
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
