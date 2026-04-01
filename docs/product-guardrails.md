# Product Guardrails - VLservice

## North Star

VLservice deve funcionar como um marketplace bid-based de servicos:

`pedido -> proposta -> comparacao -> contratacao`

## Guardrails de Produto

1. `Pedidos` e a feature master.
2. `Catalogo` e uma feature secundaria.
3. A home vende resolucao de problema, nao descoberta passiva de anuncios.
4. O onboarding empurra cada perfil para o fluxo certo.
5. O menu principal deve destacar `Pedidos`.
6. O cliente deve conseguir publicar um pedido em poucos minutos.
7. O prestador deve conseguir avaliar um pedido e dar lance rapidamente.

## Guardrails de Marca

1. Nome oficial: `VLservice`
2. Nunca usar branding legado no codigo, docs, seeds, metadata ou copy.
3. Toda nova pagina deve nascer com branding consistente.

## Guardrails de UX

1. Menos friccao, menos campos, mais clareza.
2. Comparacoes devem ser visuais e escaneaveis.
3. Nenhum passo critico pode depender de conhecimento tecnico do usuario.
4. Mobile-first sempre.

## Guardrails Tecnicos

1. Nao esconder erro real do backend.
2. Nao quebrar RLS por conveniencia.
3. Nao duplicar regras de negocio entre UI e banco sem necessidade.
4. Nao considerar entregue sem lint, build e validacao funcional.

## Guardrails de Homepage

Checklist rapido:

- CTA principal de pedido
- CTA secundario para prestador ver pedidos
- entrada por tipo de servico
- explicacao simples do fluxo
- sem grid principal de anuncios
- sem linguagem de "marketplace tradicional"
