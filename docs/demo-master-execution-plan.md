# Demo Master Execution Plan

## Objetivo

Entregar uma demo interna completa, convincente e estavel da VLservice para apresentacao a cliente, sem pagamento real, mas com a experiencia inteira simulada:

- contas fake prontas
- login funcionando
- pedidos publicados
- profissionais com perfis e servicos
- propostas e contratacoes
- chat com historico
- agendamentos e checkout simulado
- avaliacoes
- painel admin
- documento unico com todas as credenciais e jornadas de demo

## Principio da Demo

Nao vamos construir "meio sistema". Vamos construir uma demo com cara de produto vivo.

Isso significa:

- todos os fluxos criticos precisam parecer reais
- nenhuma tela principal pode ficar vazia
- nenhum fluxo pode depender de pagamento real
- toda acao sensivel precisa ter simulacao coerente
- todas as contas demo precisam existir, entrar e mostrar contexto relevante

## Meta de Apresentacao

Ao fim, deve ser possivel demonstrar:

1. cliente entra e cria pedido
2. profissional entra e ve pedidos relevantes
3. profissional envia proposta ou desbloqueia contato simulado
4. cliente compara, conversa e contrata
5. sistema avanca status do atendimento
6. cliente e profissional se avaliam
7. admin acompanha tudo e intervem

## Estado Atual Aproveitavel

O projeto ja tem base importante:

- auth e papeis
- pedidos (`jobs`)
- lances (`job_bids`)
- agenda e agendamentos (`service_availability`, `bookings`)
- chat (`conversations`, `conversation_messages`)
- avaliacoes (`reviews`, `client_reviews`)
- creditos do prestador (`job_bid_credit_purchases`)
- admin e dashboards
- seed demo parcial em `supabase/demo-seed.sql`
- script de seed em `scripts/seed-demo.mjs`

## Resultado Final Esperado

Ao final desta execucao, precisamos ter estes artefatos:

- banco demo populado e reproduzivel
- contas fake funcionais
- documento mestre de acessos
- documento de roteiro de demo
- checklist de QA de demo
- seeds idempotentes
- scripts para reset demo
- scripts para publicar e revalidar demo
- funis principais navegaveis sem falhas

## Entregaveis

### 1. Infra de demo

- ambiente Supabase de demo dedicado
- ambiente Vercel de demo dedicado
- variaveis de ambiente separadas
- reset seguro de dados demo
- seeds idempotentes e repetiveis

### 2. Contas demo

- 1 admin
- 4 a 8 profissionais
- 6 a 10 clientes
- contas segmentadas por vertical
- credenciais padronizadas

### 3. Dados demo

- pedidos em multiplos estados
- propostas em multiplos estados
- conversas ja iniciadas
- servicos publicados
- agendas preenchidas
- bookings pendentes, confirmados, concluidos e cancelados
- avaliacoes mutuas
- creditos demo

### 4. Documentacao demo

- documento de contas e acessos
- documento de narrativa de apresentacao
- documento de reset e restauracao
- documento de troubleshooting

### 5. UX de demo

- estados vazios reduzidos ao minimo
- CTAs claros
- contraste e legibilidade auditados
- paginas principais com dados convincentes
- mensagens de status claras

## Trilhas de Trabalho

## Trilha A. Estrategia da Demo

### Objetivo

Definir exatamente o que o cliente vai ver e em qual ordem.

### Tarefas

- definir vertical principal da demo
- definir 3 jornadas principais
- definir narrativa comercial
- decidir o que sera simulado e o que sera real
- congelar escopo da apresentacao

### Saida

- narrativa oficial da demo
- lista de telas obrigatorias
- lista de telas secundarias

## Trilha B. Contas Demo

### Objetivo

Criar um conjunto de contas fake, coerente e facil de operar.

### Estrutura recomendada

- `admin@demo.vlservice.local`
- `cliente.mariana@demo.vlservice.local`
- `cliente.lucas@demo.vlservice.local`
- `cliente.fernanda@demo.vlservice.local`
- `cliente.rafael@demo.vlservice.local`
- `provider.ana.clean@demo.vlservice.local`
- `provider.bruno.tech@demo.vlservice.local`
- `provider.carla.beauty@demo.vlservice.local`
- `provider.vdp.marketing@demo.vlservice.local`

### Regras

- senha unica para demo interna
- nome, cidade, categoria e historico coerentes
- avatar e bio consistentes
- cada conta precisa ter um papel claro na apresentacao

### Tarefas tecnicas

- revisar `supabase/demo-seed.sql`
- trocar e-mails se necessario para padrao demo mais limpo
- garantir `auth.users`, `auth.identities`, `profiles` e `provider_profiles`
- validar login de todas as contas
- criar script de verificacao das credenciais

### Saida

- tabela mestra de contas
- conta admin validada
- contas cliente validadas
- contas prestador validadas

## Trilha C. Cenarios de Dados

### Objetivo

Ter o banco "encenando" um marketplace vivo.

### Cenarios obrigatorios

#### Cenario 1. Pedido novo sem proposta

- cliente publica pedido
- pedido aparece no mural do prestador
- admin enxerga o pedido

#### Cenario 2. Pedido com varias propostas

- cliente publica pedido
- 2 ou 3 prestadores enviam proposta
- cliente compara
- cliente escolhe uma proposta

#### Cenario 3. Pedido contratado com chat

- conversa ativa entre cliente e prestador
- proposta aceita
- timeline de contratacao visivel

#### Cenario 4. Agendamento pendente

- booking criado
- checkout simulado disponivel
- status pendente

#### Cenario 5. Agendamento confirmado

- pagamento simulado aprovado
- status confirmado
- historico visivel nos dois lados

#### Cenario 6. Servico concluido com avaliacoes

- booking concluido
- cliente avaliou prestador
- prestador avaliou cliente

#### Cenario 7. Caso cancelado

- booking cancelado
- cliente enxerga o cancelamento
- admin enxerga o evento

#### Cenario 8. Operacao admin

- admin muda plano
- admin modera servico
- admin muda status de booking

### Tarefas tecnicas

- popular `jobs`
- popular `job_bids`
- popular `conversations`
- popular `conversation_messages`
- popular `bookings`
- popular `reviews`
- popular `client_reviews`
- popular `job_bid_credit_purchases`

### Saida

- base demo rica e navegavel
- distribuicao de estados coerente

## Trilha D. Simulacao de Monetizacao

### Objetivo

Demonstrar o modelo de negocio sem pagamento real.

### O que precisa parecer real

- saldo de creditos
- consumo de creditos ao enviar proposta ou desbloquear lead
- feedback claro de saldo restante
- historico de "compra" e "consumo"

### O que nao precisa ser real

- gateway de pagamento
- cobranca no cartao
- nota fiscal
- antifraude de pagamento

### Implementacao recomendada

- manter gateway desligado
- criar modo `demo_payment=true`
- usar compras seedadas e acoes de admin para recarga
- exibir labels visuais como "simulado para ambiente demo"

### Saida

- profissional sente que ha um sistema de saldo
- cliente percebe que a plataforma tem monetizacao

## Trilha E. Chat e Comunicacao

### Objetivo

Ter conversas com cara de uso real.

### Requisitos

- conversas abertas por pedido
- mensagens de cliente e prestador
- algumas conversas ja em andamento
- algumas sem resposta
- algumas com fechamento

### Tarefas

- revisar `conversation_messages`
- criar seeds com mensagens em horarios plausiveis
- variar tipos de conversa
- validar ordenacao e previews

### Saida

- inbox do cliente convincente
- inbox do prestador convincente

## Trilha F. Agenda e Checkout Simulado

### Objetivo

Demonstrar reserva e contratacao sem dinheiro real.

### Requisitos

- prestador com slots publicados
- cliente consegue reservar
- checkout funciona como simulacao
- booking muda de status
- prestador confirma e conclui

### Regras de demo

- manter checkout como "pagamento simulado"
- deixar isso transparente no texto
- nunca depender de integracao externa para a apresentacao

### Saida

- fluxo completo de reserva demonstravel

## Trilha G. Reputacao

### Objetivo

Mostrar prova social e confianca.

### Requisitos

- profissionais com media de nota
- clientes com reviews recebidas quando aplicavel
- alguns comentarios bons
- diversidade de casos

### Saida

- paginas de prestador e servico mais confiaveis
- dashboard com dados mais humanos

## Trilha H. Admin e Operacao

### Objetivo

Mostrar que a plataforma e controlavel.

### Requisitos

- admin entra e enxerga usuarios
- admin ve servicos
- admin ve bookings
- admin altera plano
- admin modera servicos
- admin atualiza status

### Extra recomendado

- criar secao "acoes recentes"
- criar bloco de numeros-resumo
- criar filtros de operacao

## Trilha I. Documento Mestre de Acessos

### Objetivo

Criar um documento unico para a equipe usar antes e durante a apresentacao.

### Arquivo recomendado

- `docs/demo-accounts-and-access.md`

### Estrutura do documento

- ambiente
- URL da demo
- senha padrao
- lista de contas
- papel de cada conta
- jornada recomendada para cada login
- observacoes importantes

### Exemplo de secoes

- `Admin`
- `Clientes`
- `Prestadores`
- `Roteiro sugerido de uso`
- `Se algo der errado`

## Trilha J. Documento de Roteiro de Demo

### Objetivo

Permitir apresentar sem improviso.

### Arquivo recomendado

- `docs/demo-presentation-script.md`

### Estrutura

1. abertura
2. problema de negocio
3. jornada do cliente
4. jornada do prestador
5. jornada do admin
6. monetizacao simulada
7. reputacao
8. encerramento

### Regra

- cada bloco da demo deve ter no maximo 3 minutos
- nenhuma acao critica pode depender de digitacao improvisada em tempo real

## Trilha K. QA da Demo

### Objetivo

Garantir que a demo nao quebre ao vivo.

### Checklist de QA

- login de todas as contas
- logout
- redirecionamentos por papel
- publicar pedido
- ver mural de pedidos
- enviar proposta
- abrir conversa
- concluir booking
- avaliar
- admin acessar tudo

### Testes tecnicos

- lint
- build
- smoke test das rotas criticas
- teste com ambiente limpo
- teste em aba anonima
- teste em celular

### Arquivo recomendado

- `docs/demo-qa-checklist.md`

## Trilha L. Script de Reset

### Objetivo

Resetar demo inteira em minutos.

### Entregaveis

- script `scripts/reset-demo.mjs`
- script `scripts/seed-demo.mjs`
- opcional `scripts/verify-demo.mjs`

### Regras

- reset deve ser idempotente
- seed deve funcionar varias vezes
- verificacao deve apontar contas e contagens esperadas

## Plano de Execucao por Fases

## Fase 1. Auditoria da Demo Atual

Prazo: 1 dia

- levantar tudo o que o seed atual ja cria
- identificar buracos de dados
- identificar logins que falham
- identificar telas vazias

## Fase 2. Congelamento de Narrativa

Prazo: 1 dia

- escolher contas que entram na demo
- escolher jornada principal
- escolher jornada reserva

## Fase 3. Enriquecimento do Seed

Prazo: 2 a 3 dias

- ampliar `supabase/demo-seed.sql`
- adicionar mais pedidos
- adicionar propostas
- adicionar conversas
- adicionar bookings
- adicionar avaliacoes

## Fase 4. Documento de Contas

Prazo: 1 dia

- criar `docs/demo-accounts-and-access.md`
- documentar todos os logins e papeis
- padronizar senha e regras

## Fase 5. Ajustes de UX para Demo

Prazo: 2 a 4 dias

- remover telas vazias desnecessarias
- melhorar copy de estados
- sinalizar simulacao onde for preciso
- corrigir contrastes e erros visuais

## Fase 6. QA Integrado

Prazo: 1 a 2 dias

- rodar checks tecnicos
- rodar roteiro completo ponta a ponta
- validar em producao demo

## Fase 7. Congelamento da Apresentacao

Prazo: 0.5 dia

- escolher as contas exatas da demo
- decidir ordem da navegacao
- preparar backup de jornada

## Backlog Tecnico Especifico

### Banco

- revisar seed para auth + public schema
- adicionar dados completos para `jobs`
- adicionar dados completos para `job_bids`
- adicionar dados completos para `conversations`
- adicionar dados completos para `conversation_messages`
- adicionar dados completos para `bookings`
- adicionar dados completos para `reviews`
- adicionar dados completos para `client_reviews`
- adicionar creditos demo

### Backend

- criar verificacao de seed
- criar reset demo
- criar modo de simulacao de pagamento
- criar flags de ambiente demo

### Frontend

- revisar estados vazios
- revisar mensagens de erro
- revisar labels de status
- revisar CTA e navegacao entre dashboards
- revisar timeline de booking e pedidos

### Operacao

- documento de acessos
- documento de roteiro
- checklist de validacao
- checklist pre-demo

## Estrutura Recomendada de Contas

### Admin

- 1 conta
- serve para mostrar moderacao e visao global

### Clientes

- 1 cliente com pedido novo
- 1 cliente com pedido com varias propostas
- 1 cliente com booking confirmado
- 1 cliente com servico concluido e avaliacao

### Prestadores

- 1 prestador premium com varios servicos
- 1 prestador tech com credito e leads
- 1 prestador beauty com agenda cheia
- 1 prestador marketing com perfil premium

## Estrutura Recomendada de Pedidos

- 2 pedidos abertos sem lance
- 3 pedidos com 2 ou 3 lances
- 1 pedido contratado
- 1 pedido cancelado
- 1 pedido concluido
- 1 pedido expirado

## Estrutura Recomendada de Conversas

- 1 conversa de descoberta
- 1 conversa com proposta negociada
- 1 conversa com agendamento marcado
- 1 conversa de pos-atendimento

## Estrutura Recomendada de Servicos

- limpeza residencial
- faxina pos-obra
- suporte tecnico
- instalacao de rede
- maquiagem social
- design de sobrancelhas
- servicos de design/marketing

## Criterios de Pronto

Uma demo so pode ser considerada pronta quando:

- todas as contas entram sem erro
- nenhuma rota principal quebra
- nenhum dashboard principal fica vazio
- toda historia de demo tem dados suficientes
- o roteiro completo roda sem improviso tecnico
- a equipe consegue resetar e repetir

## Riscos

- usar dados demais e perder coerencia
- usar dados de menos e deixar telas vazias
- depender de pagamento real
- nao documentar credenciais
- apresentar com seed diferente da que foi validada
- ter ambiente demo e producao misturados

## Medidas de Mitigacao

- freeze da seed antes da apresentacao
- documento unico de acessos
- script de reset
- smoke test no dia da demo
- usuario backup por papel
- jornada backup pronta

## Proxima Etapa Recomendada

Depois deste plano, a execucao ideal e criar em ordem:

1. `docs/demo-accounts-and-access.md`
2. enriquecimento de `supabase/demo-seed.sql`
3. `scripts/verify-demo.mjs`
4. `docs/demo-presentation-script.md`
5. `docs/demo-qa-checklist.md`

## Observacao Importante

O projeto ja tem uma base demo promissora, inclusive com contas seedadas e senha padrao em `scripts/seed-demo.mjs`. O caminho mais rapido nao e reinventar a demo, e sim profissionalizar o que ja existe:

- expandir os seeds
- organizar os acessos
- encenar os estados de negocio
- eliminar qualquer dependencia externa critica
