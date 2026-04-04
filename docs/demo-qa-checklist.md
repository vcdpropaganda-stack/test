# Demo QA Checklist

## Antes De Rodar A Seed

- confirmar `DATABASE_URL` apontando para o banco demo
- confirmar que a build usada na apresentacao e a mesma validada internamente
- confirmar que nao existe dependencia de pagamento real

## Seed E Verificacao

- rodar `npm run demo:seed`
- rodar `npm run demo:verify`
- validar que todos os checks retornaram `PASS`

## Auth

- login do admin funcionando
- login de pelo menos 2 clientes funcionando
- login de pelo menos 2 prestadores funcionando
- senha padrao documentada e validada

## Pedidos

- `/dashboard/client/pedidos` com dados
- `/dashboard/provider/pedidos` com dados
- pedido aberto sem propostas visivel
- pedido com propostas visivel
- pedido contratado visivel
- pedido cancelado visivel

## Propostas

- pagina de pedido com duas propostas funcionando
- status `submitted` visivel
- status `accepted` visivel
- status `rejected` visivel

## Chat

- lista de conversas preenchida
- conversa detalhada com mensagens reais
- conversa fechada visivel em historico
- envio de nova mensagem funcionando no ambiente demo

## Bookings

- booking `pending` visivel
- booking `confirmed` visivel
- booking `completed` visivel
- booking `cancelled` visivel

## Avaliacoes

- review de cliente para prestador visivel
- review de prestador para cliente visivel

## Creditos Demo

- saldo de prestador aparece sem erro
- painel do prestador mostra resumo de lances
- nenhum fluxo exibe cobranca real

## UX

- nenhum botao escuro com texto escuro
- mensagens de erro legiveis
- estados vazios aceitaveis nas paginas secundarias
- mobile e desktop com leitura clara nas telas da demo

## Pre-Apresentacao

- abrir e deixar logadas as contas principais em abas separadas ou perfis separados
- deixar as URLs principais prontas
- testar hard refresh nas paginas do dashboard
- garantir internet estavel

## URLs Para Smoke Test

- `/`
- `/dashboard/client/pedidos`
- `/dashboard/provider/pedidos`
- `/dashboard/mensagens`
- `/dashboard/client/agendamentos`
- `/pedidos`
