export type HelpSection = {
  id: string;
  title: string;
  summary: string;
  steps: string[];
};

export const helpSections: HelpSection[] = [
  {
    id: "comecando",
    title: "Começando",
    summary: "Primeiros passos para entrar na plataforma sem travar.",
    steps: [
      "Acesse a página de cadastro.",
      "Informe nome, telefone, e-mail e senha.",
      "Escolha se a conta será de cliente ou prestador.",
      "Confirme o link enviado por e-mail.",
      "Entre com o mesmo e-mail para acessar sua área.",
    ],
  },
  {
    id: "clientes",
    title: "Como funciona para clientes",
    summary: "Da publicação do pedido até a comparação das propostas.",
    steps: [
      "Entre na home e escolha o tipo de serviço que precisa.",
      "Publique seu pedido com contexto, cidade e orçamento.",
      "Acompanhe as propostas recebidas dentro do mesmo pedido.",
      "Compare preço, prazo e reputação dos profissionais.",
      "Converse pelo chat antes de contratar, se precisar.",
      "Escolha a melhor proposta e acompanhe o andamento pelo painel.",
    ],
  },
  {
    id: "prestadores",
    title: "Como funciona para prestadores",
    summary: "Mural de pedidos, propostas e operação do perfil.",
    steps: [
      "Entre com sua conta de prestador.",
      "Abra o mural de pedidos disponíveis no dashboard.",
      "Filtre as oportunidades por categoria e localização.",
      "Envie sua proposta com valor, prazo e mensagem objetiva.",
      "Acompanhe respostas, contratações e andamento pelo painel.",
      "Mantenha seu perfil e seus anúncios secundários atualizados.",
      "Use o chat para alinhar detalhes quando o cliente abrir conversa.",
    ],
  },
  {
    id: "publicar-servico",
    title: "Como publicar um serviço",
    summary: "O passo a passo para criar um anúncio secundário mais claro e vendável.",
    steps: [
      "Abra o menu de serviços no painel do prestador.",
      "Clique para criar um novo anúncio.",
      "Preencha nome do serviço, descrição e valor inicial.",
      "Defina a duração estimada do atendimento.",
      "Adicione imagem para fortalecer a apresentação do anúncio.",
      "Salve e confira se ele aparece corretamente no catálogo.",
    ],
  },
  {
    id: "agenda",
    title: "Como configurar a agenda",
    summary: "Disponibilidade organizada para reduzir conflitos de horário.",
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
    id: "reserva-pagamento",
    title: "Como reservar e pagar",
    summary: "Fluxo do cliente até a confirmação da reserva.",
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
    id: "cancelar-reagendar",
    title: "Como cancelar ou reagendar",
    summary: "Ajustes rápidos sem precisar começar do zero.",
    steps: [
      "Abra sua área de agendamentos.",
      "Localize o pedido desejado.",
      "Use a opção de cancelamento, se disponível.",
      "Se quiser reagendar, volte para a seleção de novo horário.",
      "Confirme a nova data para atualizar a reserva.",
    ],
  },
  {
    id: "melhorar-presenca-publica",
    title: "Como melhorar sua presença pública como prestador",
    summary: "Boas práticas para aumentar confiança e conversão.",
    steps: [
      "Use um nome público claro e profissional.",
      "Escreva descrições objetivas, sem excesso de texto genérico.",
      "Adicione imagens fortes e coerentes com o serviço.",
      "Publique preços, duração e localidade com clareza.",
      "Mantenha a agenda atualizada para não frustrar o cliente.",
      "Peça avaliações depois de concluir os atendimentos.",
    ],
  },
  {
    id: "suporte",
    title: "Quando acionar a equipe",
    summary: "Casos em que a ajuda humana é o caminho mais rápido.",
    steps: [
      "Se o link de confirmação expirar e você não conseguir entrar.",
      "Se uma reserva ficar com status incoerente.",
      "Se um prestador não conseguir publicar agenda ou serviço.",
      "Se o painel administrativo precisar ajustar plano ou verificação.",
      "Se houver dúvida jurídica, de dados ou responsabilidade operacional.",
    ],
  },
];
