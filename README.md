# VLservice

Base do VLservice, um marketplace de pedidos de servico com propostas comparaveis, construida com Next.js, Tailwind CSS, TypeScript e Supabase.

## Arquivos principais
- `design.md`: direcao visual e tokens basicos do design system.
- `backlog.md`: roadmap do produto com foco em pedidos, propostas e contratacao.
- `project-structure.md`: estrutura sugerida para o projeto Next.js.
- `prompt.md`: prompt mestre consolidado para evolucao do produto.
- `docs/product-guardrails.md`: regras de produto e branding que nao podem ser quebradas.
- `docs/acceptance-checklist.md`: checklist de aceite para entregas importantes.
- `supabase/schema.sql`: schema inicial com RLS para `admin`, `provider` e `client`.

## Proximo passo recomendado
Manter `Pedidos` como funcao master, validar ponta a ponta as propostas e impedir regressao da home para modelo de catalogo.
