import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ | Vitrine Lojas",
  description:
    "Perguntas frequentes sobre cadastro, busca, reservas, agenda, pagamentos simulados e operação da Vitrine Lojas.",
};

const faqGroups = [
  {
    title: "Geral",
    items: [
      {
        question: "O que é a Vitrine Lojas?",
        answer:
          "A Vitrine Lojas é uma plataforma para encontrar, comparar e contratar serviços locais de forma mais clara, visual e organizada.",
      },
      {
        question: "A plataforma é para clientes ou prestadores?",
        answer:
          "Ela atende os dois públicos. Clientes usam a vitrine para encontrar e reservar serviços. Prestadores usam o painel para publicar, organizar horários e acompanhar reservas.",
      },
      {
        question: "Quais tipos de serviço podem aparecer aqui?",
        answer:
          "A plataforma pode reunir serviços de beleza, manutenção, tecnologia, casa, design, marketing, redes sociais e outras categorias locais ou remotas.",
      },
      {
        question: "A Vitrine Lojas já está funcionando como produto real?",
        answer:
          "Hoje a plataforma opera como protótipo funcional. Os fluxos principais já existem, mas alguns pontos ainda estão em evolução para apresentação e operação completa.",
      },
      {
        question: "Preciso baixar aplicativo para usar?",
        answer:
          "Não. A experiência principal acontece na web e pode ser usada direto no navegador do celular, tablet ou computador.",
      },
      {
        question: "Consigo usar no celular sem dificuldade?",
        answer:
          "Sim. A interface foi pensada para navegação responsiva, leitura clara e ações principais acessíveis em telas menores.",
      },
    ],
  },
  {
    title: "Cadastro e acesso",
    items: [
      {
        question: "Como faço meu cadastro?",
        answer:
          "Basta abrir a página de cadastro, informar nome, telefone, e-mail, senha e escolher se a conta será de cliente ou prestador.",
      },
      {
        question: "O cliente precisa informar nome público?",
        answer:
          "Não. O nome público é usado apenas para prestadores. Clientes precisam apenas do nome principal da conta.",
      },
      {
        question: "O prestador precisa de nome público?",
        answer:
          "Sim. O nome público é o nome que aparece na vitrine e nas páginas de serviço para os clientes.",
      },
      {
        question: "O que acontece depois do cadastro?",
        answer:
          "Após o cadastro, a plataforma envia um link de confirmação por e-mail. Depois da confirmação, a pessoa já pode entrar e usar o painel correspondente.",
      },
      {
        question: "E se o link de confirmação expirar?",
        answer:
          "Nesse caso, é preciso solicitar um novo cadastro ou um novo fluxo de acesso para receber outro link válido.",
      },
      {
        question: "Posso ter mais de um tipo de conta?",
        answer:
          "Hoje o cadastro é feito com um papel principal por conta. Se precisar de outro papel, o ideal é criar um acesso específico para essa operação.",
      },
      {
        question: "Esqueci minha senha. O que faço?",
        answer:
          "O ideal é implementar um fluxo de recuperação por e-mail. Se esse fluxo ainda não estiver disponível no ambiente, o acesso deve ser recriado ou redefinido no Supabase.",
      },
      {
        question: "O login é diferente para cliente e prestador?",
        answer:
          "O formulário de login é o mesmo. O que muda é o redirecionamento, que leva cada perfil para sua área correta após a autenticação.",
      },
    ],
  },
  {
    title: "Busca e vitrine",
    items: [
      {
        question: "Como encontro um serviço?",
        answer:
          "Você pode usar a busca principal da home, navegar pela página de serviços, aplicar filtros e abrir a página de cada anúncio.",
      },
      {
        question: "A busca mostra resultados enquanto digito?",
        answer:
          "Sim. A busca principal pode sugerir serviços reais em tempo quase imediato, sem precisar recarregar a página inteira.",
      },
      {
        question: "Posso filtrar por categoria?",
        answer:
          "Sim. A vitrine pode agrupar serviços por categorias e facilitar a descoberta por tipo de necessidade.",
      },
      {
        question: "Posso filtrar por cidade?",
        answer:
          "Sim. Quando os serviços têm localidade cadastrada, a vitrine pode usar essa informação para filtros e navegação.",
      },
      {
        question: "Como sei se o prestador é confiável?",
        answer:
          "A plataforma pode mostrar nome público, cidade, avaliações, nota média, descrição do serviço, disponibilidade e outros sinais que ajudam na decisão.",
      },
      {
        question: "As imagens dos serviços são reais?",
        answer:
          "A plataforma aceita imagens reais dos serviços e também pode usar artes ilustrativas para apresentação do catálogo em protótipos.",
      },
      {
        question: "O que aparece na página do serviço?",
        answer:
          "A página do serviço pode mostrar imagem principal, descrição, preço inicial, duração estimada, dados do prestador, agenda, avaliações e opções de reserva.",
      },
    ],
  },
  {
    title: "Agenda e reservas",
    items: [
      {
        question: "Como funciona a agenda do prestador?",
        answer:
          "O prestador cadastra blocos de disponibilidade por serviço. Esses blocos aparecem para o cliente como datas e horários reserváveis.",
      },
      {
        question: "Por que alguns dias aparecem indisponíveis?",
        answer:
          "Um dia fica indisponível quando todos os horários daquele dia já foram ocupados ou não existe mais nenhum slot livre para aquele serviço.",
      },
      {
        question: "Posso reservar um horário específico?",
        answer:
          "Sim. Depois de escolher um dia com disponibilidade, a interface mostra os horários livres para seleção.",
      },
      {
        question: "O calendário mostra o que está livre e o que está cheio?",
        answer:
          "Sim. A página do serviço pode diferenciar dias com disponibilidade, dias parcialmente livres e dias totalmente ocupados.",
      },
      {
        question: "O cliente consegue reagendar?",
        answer:
          "Sim. O fluxo atual permite reagendamento em cenários suportados, levando o cliente de volta para a seleção de um novo horário.",
      },
      {
        question: "O cliente consegue cancelar?",
        answer:
          "Sim. A área do cliente pode oferecer cancelamento de reservas conforme o estado do pedido.",
      },
      {
        question: "O prestador vê suas reservas?",
        answer:
          "Sim. O painel do prestador mostra agendamentos, próximos atendimentos e ações operacionais relacionadas ao serviço.",
      },
    ],
  },
  {
    title: "Pagamento e checkout",
    items: [
      {
        question: "Os pagamentos já são reais?",
        answer:
          "No ambiente atual, o checkout funciona como protótipo. Ele confirma reservas sem usar cobrança real de cartão.",
      },
      {
        question: "Preciso informar dados bancários para reservar?",
        answer:
          "Não. O fluxo atual foi desenhado para apresentação e demonstração, sem exigir dados sensíveis reais do cliente.",
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
    ],
  },
  {
    title: "Prestadores",
    items: [
      {
        question: "Como publico um serviço?",
        answer:
          "O prestador entra no painel, acessa a área de serviços, preenche título, descrição, preço, duração e salva o anúncio.",
      },
      {
        question: "Posso subir imagem do serviço?",
        answer:
          "Sim. A plataforma já pode usar imagens vinculadas aos serviços para deixar a vitrine mais visual e profissional.",
      },
      {
        question: "Consigo editar meus dados depois?",
        answer:
          "Sim. O prestador pode atualizar nome público, bio, cidade, estado e outras informações do perfil.",
      },
      {
        question: "Posso criar mais de um serviço?",
        answer:
          "Sim. A quantidade pode variar conforme o plano configurado para o prestador dentro da plataforma.",
      },
      {
        question: "Como o meu serviço aparece na vitrine?",
        answer:
          "Depois de salvo e ativo, o serviço pode aparecer na home, na listagem principal e na página de busca, com link próprio e calendário.",
      },
      {
        question: "Consigo ver avaliações dos meus serviços?",
        answer:
          "Sim. Quando o fluxo de avaliação estiver ativo para aquele atendimento, o prestador pode acompanhar reputação e comentários recebidos.",
      },
    ],
  },
  {
    title: "Segurança e dados",
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
          "Em regra, cada usuário vê apenas o que pertence ao próprio perfil, e o prestador vê apenas o que for necessário para operar seus serviços.",
      },
      {
        question: "A plataforma segue LGPD?",
        answer:
          "A base legal do projeto já prevê páginas e estrutura para privacidade, LGPD, termos e responsabilidades, que podem ser refinadas conforme a operação real.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <main id="conteudo" className="page-shell py-14 sm:py-16">
      <section className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold tracking-[0.22em] text-primary uppercase">
          FAQ
        </p>
        <h1 className="mt-4 font-sans text-[2.9rem] leading-[1.04] font-bold tracking-[-0.035em] text-slate-950 sm:text-[3.8rem] sm:leading-[1.02]">
          Perguntas frequentes para tirar dúvidas sem enrolação.
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-strong">
          Reunimos as dúvidas mais comuns de clientes, prestadores e quem está
          conhecendo a plataforma pela primeira vez.
        </p>
      </section>

      <section className="mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-center gap-3 text-sm">
        <Link
          href="/ajuda"
          className="rounded-full border border-primary/20 bg-primary-soft px-4 py-2 font-semibold text-primary-strong"
        >
          Abrir central de ajuda
        </Link>
        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600">
          Cadastro
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600">
          Busca
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600">
          Agenda
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600">
          Reservas
        </span>
        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600">
          Prestadores
        </span>
      </section>

      <section className="mx-auto mt-12 max-w-6xl space-y-10">
        {faqGroups.map((group) => (
          <section key={group.title}>
            <div className="mb-5">
              <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                {group.title}
              </h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {group.items.map((item) => (
                <details
                  key={item.question}
                  className="elevated-card rounded-[1.75rem] border border-border bg-white p-6"
                >
                  <summary className="cursor-pointer list-none text-lg leading-8 font-semibold text-slate-950">
                    {item.question}
                  </summary>
                  <p className="mt-4 text-base leading-8 text-muted-strong">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}
