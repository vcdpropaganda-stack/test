# Estrutura Inicial Proposta

```text
TESTE-App/
├─ app/
│  ├─ (marketing)/
│  │  ├─ page.tsx
│  │  ├─ afiliados/page.tsx
│  │  └─ institucional/page.tsx
│  ├─ (auth)/
│  │  ├─ login/page.tsx
│  │  └─ cadastro/page.tsx
│  ├─ (marketplace)/
│  │  ├─ servicos/page.tsx
│  │  ├─ servicos/[slug]/page.tsx
│  │  └─ checkout/[bookingId]/page.tsx
│  ├─ dashboard/
│  │  ├─ provider/page.tsx
│  │  ├─ provider/servicos/page.tsx
│  │  ├─ provider/agenda/page.tsx
│  │  └─ client/page.tsx
│  ├─ api/
│  │  ├─ stripe/webhook/route.ts
│  │  ├─ bookings/route.ts
│  │  ├─ services/route.ts
│  │  └─ sendgrid/route.ts
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ ui/
│  ├─ layout/
│  ├─ marketplace/
│  ├─ provider/
│  └─ shared/
├─ lib/
│  ├─ supabase/
│  │  ├─ client.ts
│  │  ├─ server.ts
│  │  └─ middleware.ts
│  ├─ stripe/
│  ├─ sendgrid/
│  ├─ auth/
│  └─ utils/
├─ hooks/
├─ types/
├─ public/
├─ supabase/
│  ├─ schema.sql
│  └─ seed.sql
├─ design.md
├─ backlog.md
└─ prompt.md
```

## Observacoes
- `app/` usa App Router para separar marketing, autenticacao, marketplace e dashboards.
- `components/ui` concentra a base do design system.
- `lib/` recebe integracoes e regras compartilhadas que depois podem ser portadas para mobile.
- `supabase/schema.sql` concentra a estrutura inicial de banco e politicas RLS.
