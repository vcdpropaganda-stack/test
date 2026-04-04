# Cleanup Audit Plan

## Context

Auditoria executada na base principal do projeto `VLservice` para identificar:

- codigo morto
- rotas e endpoints orfaos
- redundancias na integracao com Supabase

Este documento tambem serve como plano de execucao da limpeza.

## Achados

### 1. Codigo morto

#### 1.1 Snapshot legado fora do build

- `app-temp/`
  - projeto paralelo inteiro, excluido do build em `tsconfig.json`
  - inclui `node_modules`, configs e scaffold de outro app

#### 1.2 Componentes sem caminho de execucao

- `components/home/home-marketplace-section.tsx`
- `components/jobs/home-jobs-section.tsx`
- `components/jobs/hero-jobs-preview.tsx`
- `components/marketplace/hero-search.tsx`
- `components/layout/header-auth-controls.tsx`
- `components/layout/mobile-header-menu.tsx`
- `components/ui/card.tsx`
- `components/ui/sparkles.tsx`
- `components/ui/timeline-animation.tsx`
- `components/ui/vertical-cut-reveal.tsx`
- `lib/supabase/client.ts`

#### 1.3 Exports e fluxos sem consumo

- `app/dashboard/mensagens/actions.ts`
  - `requestConversationWhatsappAction`
  - `shareConversationWhatsappAction`
- `lib/conversations.ts`
  - `WHATSAPP_REQUEST_FEE_CENTS`
  - `createWhatsappRequestCharge`
- `lib/marketplace.ts`
  - `getMarketplaceServiceSlugs`
- `lib/subscription.ts`
  - `getMonthlyQuoteLimitText`
  - `getProviderServiceLimitText`
  - `getProviderPlanPriceText`

#### 1.4 Import morto confirmado pelo TypeScript

- `components/ui/pulse-fit-hero.tsx`
  - import `React` nao utilizado

### 2. Rotas e endpoints orfaos

- `app/api/services/search/route.ts`
  - endpoint sem consumo no app vivo
  - unico consumidor interno era `components/marketplace/hero-search.tsx`

- fluxo `request_wpp`
  - parametro existe em `app/dashboard/mensagens/page.tsx`
  - nao existe emissao desse query param no frontend atual

- fluxo de compartilhamento/cobranca de WhatsApp no chat
  - actions existem, mas nao sao chamadas por nenhuma UI
  - cobranca prototipo em `whatsapp_request_charges` sem uso efetivo

### 3. Supabase e acesso a dados

#### 3.1 Mistura de clientes de dados

- `app/servicos/[slug]/actions.ts`
  - usa Supabase para auth
  - usa `pg` direto para role, conflito de agenda e criacao de booking

#### 3.2 Validacoes duplicadas

- contexto de cliente dono do booking duplicado em:
  - `app/dashboard/client/agendamentos/actions.ts`
  - `app/checkout/[bookingId]/actions.ts`
  - `app/dashboard/client/agendamentos/[bookingId]/avaliar/actions.ts`

- contexto de prestador duplicado em:
  - `app/dashboard/provider/actions.ts`
  - `app/dashboard/provider/agenda/actions.ts`
  - `app/dashboard/provider/servicos/actions.ts`

#### 3.3 Leituras duplicadas nas paginas publicas

- `app/prestadores/[slug]/page.tsx`
  - `generateMetadata` e pagina consultam os mesmos dados

- `app/servicos/[slug]/page.tsx`
  - `generateMetadata` e pagina usam consultas separadas para o mesmo slug

## Plano de execucao

### Fase 1. Remocoes de alta confianca

- remover `app-temp/`
- remover endpoint `/api/services/search`
- remover componentes mortos sem importadores
- remover cliente browser do Supabase que ficou preso ao header antigo
- remover imports/exports mortos obvios

### Fase 2. Limpeza de fluxos orfaos

- remover branch `request_wpp`
- remover actions de WhatsApp nao consumidas
- remover cobranca prototipo de WhatsApp nao integrada

### Fase 3. Consolidacao Supabase

- criar helper unico para acesso do cliente ao booking
- criar helper unico para contexto de prestador
- substituir repeticoes nas server actions
- eliminar consultas de role/contexto espalhadas quando houver helper comum

### Fase 4. Reducao de leituras duplicadas

- reaproveitar fetch cacheado nas paginas publicas por slug
- evitar consultas extras entre `generateMetadata` e `page` quando possivel

### Fase 5. Validacao

- `npm run lint`
- `npx tsc --noEmit`
- smoke test das rotas principais impactadas

## Execucao desta rodada

Nesta rodada, a execucao deve cobrir:

- fases 1, 2 e 3 integralmente
- fase 4 no que for seguro sem alterar comportamento funcional
- fase 5 ao final

## Status apos execucao

- fase 1 executada
- fase 2 executada
- fase 3 executada
- fase 4 executada parcialmente com deduplicacao por `slug` nas paginas publicas
- fase 5 executada com `npm run lint`, `npx tsc --noEmit` e `npx tsc --noEmit --noUnusedLocals --noUnusedParameters`
