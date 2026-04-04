# Demo Reset And Troubleshooting

## Comandos

- aplicar seed: `npm run demo:seed`
- verificar demo: `npm run demo:verify`
- resetar demo: `npm run demo:reset`

## Como Funciona O Reset

O reset demo atual:

- reaplica o seed demo
- reconstroi os registros demo conhecidos
- revalida a base ao final

Ele nao depende de pagamento real.

## Problemas Comuns

### `DATABASE_URL is not configured`

Causa:

- variavel de ambiente nao esta definida no shell atual

Acao:

- exportar `DATABASE_URL`
- repetir `npm run demo:reset`

### Login falha para contas demo

Causa:

- seed nao foi aplicada no banco certo
- ambiente aponta para outro projeto Supabase

Acao:

- validar `DATABASE_URL`
- rodar `npm run demo:seed`
- rodar `npm run demo:verify`

### Dashboard sem dados

Causa:

- seed incompleta
- build conectada em ambiente errado

Acao:

- rodar `npm run demo:verify`
- checar se os pedidos e conversas demo existem

### Conversas duplicadas

Causa:

- ambiente teve navegacao manual antes do freeze

Acao:

- rodar `npm run demo:reset`
- evitar usar ambiente demo como ambiente de trabalho diario

## Freeze Recomendado

Antes da apresentacao:

- aplicar `npm run demo:reset`
- verificar `npm run demo:verify`
- congelar a base ate o horario da apresentacao
