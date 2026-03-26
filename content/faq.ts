export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqGroup = {
  title: string;
  description: string;
  items: FaqItem[];
};

export const faqGroups: FaqGroup[] = [
  {
    title: "Geral",
    description: "Entenda o que é a plataforma, para quem ela serve e como ela funciona.",
    items: [
      {
        question: "O que é a VL Serviços?",
        answer:
          "A VL Serviços é uma plataforma para encontrar, comparar e contratar serviços locais de forma visual, organizada e simples.",
      },
      {
        question: "A plataforma atende clientes ou prestadores?",
        answer:
          "Atende os dois públicos. Clientes usam a vitrine para encontrar e reservar serviços. Prestadores usam o painel para publicar anúncios, controlar agenda e acompanhar reservas.",
      },
      {
        question: "Quais tipos de serviço podem aparecer aqui?",
        answer:
          "A plataforma pode reunir serviços de beleza, casa, manutenção, tecnologia, marketing, design, redes sociais e outros tipos de atendimento local ou remoto.",
      },
      {
        question: "Preciso baixar aplicativo para usar?",
        answer:
          "Não. A experiência principal acontece na web e pode ser usada direto no navegador do celular, tablet ou computador.",
      },
      {
        question: "Funciona bem no celular?",
        answer:
          "Sim. A plataforma foi estruturada para navegação responsiva, leitura clara e ações principais acessíveis em telas menores.",
      },
      {
        question: "A VL Serviços já está pronta para operação real?",
        answer:
          "O ambiente atual já é um protótipo funcional com fluxos reais de cadastro, vitrine, agenda, reserva e dashboards. Alguns pontos ainda seguem em refinamento visual e operacional.",
      },
      {
        question: "Qual é o diferencial da plataforma?",
        answer:
          "A proposta é unir descoberta visual, apresentação mais clara dos serviços, agenda integrada e uma operação simples para cliente e prestador.",
      },
    ],
  },
  {
    title: "Cadastro e acesso",
    description: "Perguntas comuns sobre criação de conta, confirmação e login.",
    items: [
      {
        question: "Como faço meu cadastro?",
        answer:
          "Basta abrir a página de cadastro, informar nome, telefone, e-mail, senha e escolher se a conta será de cliente ou prestador.",
      },
      {
        question: "Cliente precisa informar nome público?",
        answer:
          "Não. Clientes usam apenas o nome principal da conta. O nome público é reservado para prestadores.",
      },
      {
        question: "Prestador precisa informar nome público?",
        answer:
          "Sim. O nome público é o nome que aparece na vitrine e nas páginas de serviço.",
      },
      {
        question: "O que acontece depois do cadastro?",
        answer:
          "Depois do envio do formulário, a plataforma gera um link de confirmação por e-mail. Após a confirmação, o acesso já pode ser usado normalmente.",
      },
      {
        question: "E se o link de confirmação expirar?",
        answer:
          "O usuário precisa receber um novo link válido. O ideal é sempre abrir o e-mail mais recente para concluir a confirmação.",
      },
      {
        question: "Posso ter conta de cliente e prestador ao mesmo tempo?",
        answer:
          "Hoje cada conta nasce com um papel principal. Se precisar operar com outro papel, o mais seguro é criar um acesso específico para esse uso.",
      },
      {
        question: "O login é diferente para cliente e prestador?",
        answer:
          "O formulário é o mesmo. O que muda é o redirecionamento, que leva cada pessoa para o painel correto depois da autenticação.",
      },
      {
        question: "O que faço se esquecer a senha?",
        answer:
          "O caminho ideal é implementar um fluxo de recuperação por e-mail. Em ambientes de demonstração, o acesso também pode ser redefinido manualmente.",
      },
      {
        question: "Posso trocar meu papel depois do cadastro?",
        answer:
          "Isso depende da operação. Em ambientes controlados, a equipe administrativa pode ajustar papéis, mas o ideal é manter papéis claros desde o início.",
      },
    ],
  },
  {
    title: "Busca e vitrine",
    description: "Como encontrar bons serviços com mais rapidez e contexto.",
    items: [
      {
        question: "Como encontro um serviço?",
        answer:
          "Você pode usar a busca principal da home, navegar pela página de serviços, aplicar filtros e abrir a página de cada anúncio.",
      },
      {
        question: "A busca mostra resultados enquanto digito?",
        answer:
          "Sim. A busca principal pode sugerir serviços reais em tempo quase imediato, sem recarregar a página inteira.",
      },
      {
        question: "Posso filtrar por categoria?",
        answer:
          "Sim. A vitrine organiza serviços por categoria para facilitar a descoberta por necessidade.",
      },
      {
        question: "Posso filtrar por cidade?",
        answer:
          "Sim. Quando os serviços têm localidade cadastrada, essa informação pode ser usada em filtros e navegação.",
      },
      {
        question: "Como sei se o prestador é confiável?",
        answer:
          "A decisão pode considerar nome público, cidade, avaliações, nota média, descrição do serviço, agenda e sinais de verificação.",
      },
      {
        question: "O que aparece na página do serviço?",
        answer:
          "A página do serviço pode mostrar imagem principal, descrição, preço inicial, duração estimada, dados do prestador, calendário e avaliações.",
      },
      {
        question: "As imagens dos serviços precisam ser reais?",
        answer:
          "Sempre que possível, sim. Imagens reais ajudam muito na percepção de confiança e valor. Em protótipos, também é possível usar imagens ilustrativas coerentes com o serviço.",
      },
      {
        question: "Os anúncios em destaque aparecem onde?",
        answer:
          "Eles podem ser priorizados na home, na vitrine e em seções de curadoria, conforme a configuração administrativa.",
      },
    ],
  },
  {
    title: "Agenda e reservas",
    description: "Tudo sobre datas disponíveis, horários, reagendamento e cancelamento.",
    items: [
      {
        question: "Como funciona a agenda do prestador?",
        answer:
          "O prestador cadastra blocos de disponibilidade por serviço. Esses blocos aparecem para o cliente como datas e horários reserváveis.",
      },
      {
        question: "Por que alguns dias aparecem indisponíveis?",
        answer:
          "Um dia fica indisponível quando todos os horários daquele dia já foram ocupados ou quando não há nenhum slot livre para aquele serviço.",
      },
      {
        question: "Posso reservar um horário específico?",
        answer:
          "Sim. Depois de escolher um dia com disponibilidade, a interface mostra os horários livres para seleção.",
      },
      {
        question: "O calendário mostra datas livres e cheias?",
        answer:
          "Sim. A página do serviço consegue diferenciar dias livres, parcialmente disponíveis e totalmente ocupados.",
      },
      {
        question: "Posso reagendar meu atendimento?",
        answer:
          "Sim. Quando o fluxo permite, o cliente pode voltar para a seleção de horários e escolher uma nova data.",
      },
      {
        question: "Posso cancelar um agendamento?",
        answer:
          "Sim. A área do cliente pode oferecer cancelamento, conforme o estado atual da reserva.",
      },
      {
        question: "O prestador consegue ver seus agendamentos?",
        answer:
          "Sim. O painel do prestador mostra próximas reservas, confirmações e ações operacionais.",
      },
      {
        question: "O sistema bloqueia horário já reservado?",
        answer:
          "Sim. Quando um slot está pendente ou confirmado, ele deixa de aparecer como livre para novas reservas.",
      },
    ],
  },
  {
    title: "Pagamento e checkout",
    description: "Perguntas sobre reserva, pagamento protótipo e evolução futura.",
    items: [
      {
        question: "Os pagamentos já são reais?",
        answer:
          "No ambiente atual, o checkout funciona como protótipo. Ele confirma reservas sem usar cobrança real de cartão.",
      },
      {
        question: "Preciso informar dados sensíveis para reservar?",
        answer:
          "Não. O fluxo atual foi desenhado para apresentação e demonstração, sem exigir dados bancários reais do cliente.",
      },
      {
        question: "O que acontece depois da reserva?",
        answer:
          "A reserva é criada, o status muda dentro do sistema e o cliente pode acompanhar tudo pelo painel de agendamentos.",
      },
      {
        question: "É possível integrar pagamentos reais no futuro?",
        answer:
          "Sim. A base está preparada para evoluir depois para gateways como Stripe ou outras soluções compatíveis.",
      },
      {
        question: "O prestador recebe confirmação da reserva?",
        answer:
          "Sim. O sistema pode notificar o prestador dentro do painel e, futuramente, por e-mail transacional.",
      },
    ],
  },
  {
    title: "Prestadores",
    description: "Publicação de serviços, perfil, imagens e reputação.",
    items: [
      {
        question: "Como publico um serviço?",
        answer:
          "O prestador entra no painel, acessa a área de serviços, preenche título, descrição, preço, duração e salva o anúncio.",
      },
      {
        question: "Posso subir imagem do serviço?",
        answer:
          "Sim. A plataforma já suporta imagens vinculadas aos serviços para deixar a vitrine mais visual e profissional.",
      },
      {
        question: "Consigo editar meus dados depois?",
        answer:
          "Sim. O prestador pode atualizar nome público, bio, cidade, estado e outras informações do perfil.",
      },
      {
        question: "Posso criar mais de um serviço?",
        answer:
          "Sim. O limite de serviços varia por plano (Básico: 3, Pro: 10 e Avançado: ilimitado). O recebimento de orçamentos também segue limite mensal (Básico: 50/mês, Pro: 150/mês e Avançado: ilimitado).",
      },
      {
        question: "Como meu serviço aparece na vitrine?",
        answer:
          "Depois de salvo e ativo, o serviço pode aparecer na home, na listagem principal e na página de busca, com link próprio e calendário.",
      },
      {
        question: "Consigo acompanhar avaliações?",
        answer:
          "Sim. Quando o fluxo de avaliação está ativo para aquele atendimento, o prestador pode acompanhar reputação e comentários recebidos.",
      },
      {
        question: "Como ganhar mais destaque na plataforma?",
        answer:
          "As melhores práticas são: imagem forte, descrição objetiva, preço claro, agenda atualizada e boa reputação com clientes.",
      },
      {
        question: "A equipe interna pode moderar meu anúncio?",
        answer:
          "Sim. O painel administrativo pode ativar, pausar, destacar anúncios e ajustar o plano do prestador conforme a operação.",
      },
    ],
  },
  {
    title: "Segurança, LGPD e operação",
    description: "Segurança de acesso, dados e responsabilidades da plataforma.",
    items: [
      {
        question: "Como cliente e prestador ficam separados?",
        answer:
          "A separação acontece por papel de acesso e é reforçada no banco com políticas de segurança e leitura controlada.",
      },
      {
        question: "Meus dados ficam protegidos?",
        answer:
          "A plataforma foi estruturada com Supabase e políticas de acesso para evitar exposição indevida de informações entre perfis.",
      },
      {
        question: "Quem pode ver minhas reservas?",
        answer:
          "Cada usuário vê apenas o que pertence ao próprio perfil, enquanto o prestador vê somente o que for necessário para operar seus serviços.",
      },
      {
        question: "A plataforma segue LGPD?",
        answer:
          "A base do projeto já prevê páginas e estrutura para privacidade, LGPD, termos e responsabilidades, que podem ser refinadas conforme a operação real.",
      },
      {
        question: "Existe painel administrativo?",
        answer:
          "Sim. A equipe interna já conta com um painel para governança de prestadores, anúncios, reservas e operação diária.",
      },
      {
        question: "Quem responde por problemas entre cliente e prestador?",
        answer:
          "As responsabilidades contratuais e operacionais devem ser descritas nas páginas legais e podem variar conforme o modelo real da plataforma.",
      },
    ],
  },
];
