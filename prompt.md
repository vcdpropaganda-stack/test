# Prompt de Criacao

Atue como um Engenheiro de Software Full-Stack Senior e Especialista em UI/UX.

Estamos desenvolvendo um marketplace de servicos locais chamado "VL Serviços". O objetivo e conectar clientes a prestadores de servicos, similar ao Workana ou 20pila. O projeto deve ser construido usando **Next.js (App Router), React, Tailwind CSS, TypeScript e Supabase** para o backend/banco de dados.

## Regras de Negocio e Arquitetura
1. **Banco de Dados (Supabase):** Crie a estrutura de tabelas e as politicas de seguranca (RLS) garantindo que existam tres perfis estritamente separados: `admin`, `provider` e `client`.
2. **Design System:** Utilize a paleta de cores focada em Indigo/Roxo Profundo (Primary: `#6366F1`) e fundo Slate 50 (`#F8FAFC`). O design deve ser moderno, clean e passar alta confianca.
3. **Funcionalidades Principais a serem geradas:**
   - **Home (Marketplace):** Listagem de servicos dividida em secoes (Em Alta, Mais Buscados, Novos).
   - **Prestador:** Painel para gerenciar anuncios, calendario para definir disponibilidade e visualizar agendamentos. O prestador deve possuir um sistema de niveis de assinatura simulado via Stripe Test Mode, limitando a quantidade de anuncios.
   - **Cliente:** Capacidade de buscar servicos, ver o perfil do servico, selecionar um horario e realizar um agendamento simulando pagamento. Depois, o cliente pode deixar avaliacao.
   - **Institucional e Afiliados:** Paginas estaticas explicativas e uma rota `/afiliados`.
   - **Comunicacoes:** Estrutura pronta para disparos de e-mail via SendGrid.

## Instrucao de Saida
1. Inicie fornecendo a estrutura de pastas do projeto Next.js.
2. Em seguida, crie o schema SQL para o Supabase abordando a separacao de usuarios, servicos e agendamentos.
3. Construa o codigo pensando em componentizacao limpa, pois no futuro o front-end sera portado para um app mobile via React Native.
