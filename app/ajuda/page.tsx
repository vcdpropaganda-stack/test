import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Central de Ajuda | Vitrine Lojas",
  description:
    "Guias passo a passo para cadastro, publicação de serviços, agenda, reserva, checkout e operação na Vitrine Lojas.",
};

const helpSections = [
  {
    title: "Começando",
    steps: [
      "Acesse a página de cadastro.",
      "Informe nome, telefone, e-mail e senha.",
      "Escolha se a conta será de cliente ou prestador.",
      "Confirme o link enviado por e-mail.",
      "Entre com o mesmo e-mail para acessar sua área.",
    ],
  },
  {
    title: "Como funciona para clientes",
    steps: [
      "Use a busca da home para procurar um tipo de serviço.",
      "Abra a listagem completa em /servicos para filtrar melhor.",
      "Clique no serviço desejado para ver imagem, descrição, preço e agenda.",
      "Escolha um dia com disponibilidade no calendário.",
      "Selecione um horário e siga para o checkout.",
      "Confirme a reserva e acompanhe tudo em seus agendamentos.",
    ],
  },
  {
    title: "Como funciona para prestadores",
    steps: [
      "Entre com sua conta de prestador.",
      "Acesse o painel e vá para a área de serviços.",
      "Cadastre título, descrição, preço, duração e imagem do serviço.",
      "Depois, acesse a agenda para publicar horários disponíveis.",
      "Acompanhe reservas, confirmações e andamento pelo painel.",
      "Atualize seu perfil para melhorar sua apresentação na vitrine.",
    ],
  },
  {
    title: "Como publicar um serviço",
    steps: [
      "Abra o menu de serviços no painel do prestador.",
      "Clique para criar um novo anúncio.",
      "Preencha nome do serviço, descrição e valor inicial.",
      "Defina a duração estimada do atendimento.",
      "Adicione imagem para fortalecer a apresentação do anúncio.",
      "Salve e confira se ele aparece corretamente na vitrine.",
    ],
  },
  {
    title: "Como configurar a agenda",
    steps: [
      "Abra a área de agenda do prestador.",
      "Escolha o serviço que vai receber horários.",
      "Cadastre os blocos de disponibilidade por data e hora.",
      "Revise se os horários aparecem corretamente no calendário do serviço.",
      "Quando um horário for reservado, ele deixa de aparecer como livre.",
      "Quando todos os horários de um dia acabam, o dia fica indisponível.",
    ],
  },
  {
    title: "Como reservar e pagar",
    steps: [
      "Entre na página do serviço.",
      "Escolha um dia disponível no calendário.",
      "Selecione um horário livre.",
      "Avance para o checkout.",
      "Confirme o pagamento protótipo sem usar dados reais.",
      "Depois disso, o agendamento passa a aparecer no painel do cliente.",
    ],
  },
  {
    title: "Como cancelar ou reagendar",
    steps: [
      "Abra sua área de agendamentos.",
      "Localize o pedido desejado.",
      "Use a opção de cancelamento, se disponível.",
      "Se quiser reagendar, volte para a seleção de novo horário.",
      "Confirme a nova data para atualizar a reserva.",
    ],
  },
  {
    title: "Como melhorar sua vitrine como prestador",
    steps: [
      "Use um nome público claro e profissional.",
      "Escreva descrições objetivas, sem excesso de texto genérico.",
      "Adicione imagens fortes e coerentes com o serviço.",
      "Publique preços, duração e localidade com clareza.",
      "Mantenha a agenda atualizada para não frustrar o cliente.",
      "Peça avaliações depois de concluir os atendimentos.",
    ],
  },
];

export default function AjudaPage() {
  return (
    <main id="conteudo" className="page-shell py-14 sm:py-16">
      <section className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
          Central de ajuda
        </p>
        <h1 className="mt-4 font-sans text-[2.9rem] leading-[1.04] font-bold tracking-[-0.035em] text-slate-950 sm:text-[3.8rem] sm:leading-[1.02]">
          Guias passo a passo para usar a plataforma sem travar.
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-strong">
          Esta central organiza os fluxos principais para clientes e
          prestadores, desde o primeiro cadastro até a reserva e operação do serviço.
        </p>
      </section>

      <section className="mx-auto mt-8 flex max-w-5xl flex-wrap gap-3 text-sm">
        <Link
          href="/faq"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700"
        >
          Ver FAQ completa
        </Link>
        <span className="rounded-full border border-primary/20 bg-primary-soft px-4 py-2 font-semibold text-primary-strong">
          Passo a passo
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600">
          Clientes
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600">
          Prestadores
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600">
          Agenda
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600">
          Checkout
        </span>
      </section>

      <section className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-2">
        {helpSections.map((section) => (
          <article
            key={section.title}
            className="elevated-card rounded-[1.9rem] border border-border bg-white p-7"
          >
            <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-950">
              {section.title}
            </h2>
            <ol className="mt-5 space-y-3">
              {section.steps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary-strong">
                    {index + 1}
                  </div>
                  <p className="pt-0.5 text-base leading-8 text-muted-strong">{step}</p>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </section>
    </main>
  );
}
