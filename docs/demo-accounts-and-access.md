# Demo Accounts And Access

## Objetivo

Este documento concentra as contas fake, os cenarios principais e a ordem de uso na apresentacao interna da VLservice.

Regra desta demo:

- ambiente interno
- sem pagamento real
- mesma senha para todas as contas
- dados pensados para apresentar pedidos, propostas, chat, bookings, avaliacoes e operacao

## Credenciais

- senha padrao: `VLservice123!`
- comando para aplicar seed: `npm run demo:seed`
- comando para verificar demo: `npm run demo:verify`
- comando para resetar demo: `npm run demo:reset`

## Contas

| Perfil | Email | Papel | Cidade | Uso principal na demo |
| --- | --- | --- | --- | --- |
| Admin VLservice | `vlservice+admin@gmail.com` | `admin` | Sao Paulo | moderacao, visao geral e suporte |
| Ana Clean | `vlservice+ana@gmail.com` | `provider` | Sao Paulo | limpeza, closet, atendimento recorrente |
| Bruno Tech | `vlservice+bruno@gmail.com` | `provider` | Campinas | suporte tecnico, rede, home office, consultoria |
| Carla Beauty | `vlservice+carla@gmail.com` | `provider` | Sao Paulo | maquiagem, cabelo, eventos |
| Voce Digital Propaganda | `vocedigitalpropaganda@gmail.com` | `provider` | Jundiai | design, branding, web e marketing |
| Mariana Souza | `vlservice+cliente1@gmail.com` | `client` | Sao Paulo | cliente com pedido aberto, booking concluido e pedido cancelado |
| Lucas Pereira | `vlservice+cliente2@gmail.com` | `client` | Campinas | cliente com pedido comparando propostas e booking confirmado |
| Fernanda Lima | `vlservice+cliente3@gmail.com` | `client` | Sao Paulo | cliente com contratacao em andamento e chats ativos |
| Rafael Gomes | `vlservice+cliente4@gmail.com` | `client` | Jundiai | cliente com job concluido e historico forte de branding |

## Pedidos Seedados

| Slug | Cliente | Categoria | Status | O que mostrar |
| --- | --- | --- | --- | --- |
| `faxina-apartamento-vila-mariana` | Mariana | limpeza | `open` | pedido novo sem proposta |
| `estrutura-digital-home-office-campinas` | Lucas | consultoria | `has_bids` | comparacao entre propostas |
| `maquiagem-e-penteado-evento-corporativo` | Fernanda | beleza | `in_progress` | prestador contratado |
| `identidade-visual-clinica-jundiai` | Rafael | design | `completed` | job concluido e historico de entrega |
| `organizacao-de-closet-pinheiros` | Mariana | manutencao | `cancelled` | historico de cancelamento |

## Propostas Seedadas

- `estrutura-digital-home-office-campinas`
- Bruno Tech: proposta `submitted`
- Voce Digital Propaganda: proposta `submitted`

- `maquiagem-e-penteado-evento-corporativo`
- Carla Beauty: proposta `accepted`
- Ana Clean: proposta `rejected`

- `identidade-visual-clinica-jundiai`
- Voce Digital Propaganda: proposta `accepted`
- Bruno Tech: proposta `rejected`

- `organizacao-de-closet-pinheiros`
- Ana Clean: proposta `rejected`

## Chats Seedados

| Conversa | Participantes | Estado | Uso na demo |
| --- | --- | --- | --- |
| Consultoria de home office | Lucas + Bruno | `open` | orcamento e alinhamento comercial |
| Booking de suporte tecnico | Lucas + Bruno | `open` | execucao marcada |
| Booking de maquiagem | Fernanda + Carla | `open` | contratacao em andamento |
| Booking de cartao de visita | Fernanda + VDP | `open` | entrega de design ativa |
| Booking de limpeza concluida | Mariana + Ana | `closed` | historico e prova de uso real |
| Booking de rede e wi-fi | Rafael + Bruno | `open` | suporte pos-servico e ajuste fino |
| Escova cancelada | Mariana + Carla | `closed` | remarcacao e historico de cancelamento |
| Limpeza futura | Rafael + Ana | `open` | alinhamento pre-servico |
| Escova confirmada | Lucas + Carla | `open` | atendimento confirmado com briefing |
| Marca da clinica | Mariana + VDP | `open` | descoberta e estrategia de branding |

Observacao:

- ha historico de mensagens suficiente para a sidebar de conversas e a tela detalhada parecerem vivas
- cada cliente e cada prestador aparece com mais de uma conversa para dar sensacao real de marketplace ativo
- ha conversas abertas, fechadas, futuras, em execucao e de pos-servico

## Bookings Seedados

| Booking | Cliente | Prestador | Status | Uso na demo |
| --- | --- | --- | --- | --- |
| limpeza residencial | Mariana | Ana Clean | `completed` | avaliacoes dos dois lados |
| suporte tecnico residencial | Lucas | Bruno Tech | `confirmed` | checkout demo ja aprovado |
| maquiagem social em domicilio | Fernanda | Carla Beauty | `pending` | checkout demo pendente |
| instalacao de rede e wi-fi | Rafael | Bruno Tech | `completed` | avaliacao do cliente e do prestador |
| cartao de visita | Fernanda | VDP | `confirmed` | fluxo de servico criativo |

## Avaliacoes Seedadas

- reviews de cliente para prestador em bookings concluidos
- client reviews de prestador para cliente em bookings concluidos
- isso permite mostrar reputacao bilateral

## Creditos Demo

- cada prestador tem ao menos um pacote demo em `job_bid_credit_purchases`
- todos os pacotes usam `status = prototype_paid`
- nao existe pagamento real nesta demo

## Jornada Recomendada

### Jornada 1. Cliente comparando propostas

- entrar com `vlservice+cliente2@gmail.com`
- abrir `/dashboard/client/pedidos`
- entrar em `estrutura-digital-home-office-campinas`
- mostrar duas propostas recebidas

### Jornada 2. Prestador vendo mural e saldo

- entrar com `vlservice+bruno@gmail.com`
- abrir `/dashboard/provider/pedidos`
- mostrar pedidos priorizados
- mostrar saldo e resumo de lances

### Jornada 3. Chat e contratacao

- entrar com `vlservice+cliente3@gmail.com`
- abrir `/dashboard/mensagens`
- navegar para a conversa com Carla Beauty
- depois abrir agendamento pendente

### Jornada 4. Historico concluido

- entrar com `vlservice+cliente1@gmail.com`
- abrir agendamentos concluidos
- mostrar conversa encerrada, review e historico

### Jornada 5. Admin

- entrar com `vlservice+admin@gmail.com`
- navegar pelo dashboard/admin
- validar que os dados seedados aparecem de forma coerente

## Paginas Chave Para Abrir Rapido

- `/dashboard/client/pedidos`
- `/dashboard/provider/pedidos`
- `/dashboard/mensagens`
- `/dashboard/client/agendamentos`
- `/dashboard/provider/agenda`
- `/pedidos`

## Notas Operacionais

- esta demo depende de `DATABASE_URL` apontando para o banco demo
- se o ambiente estiver limpo, rode primeiro `npm run demo:seed`
- se houver duvida sobre consistencia, rode `npm run demo:verify`
