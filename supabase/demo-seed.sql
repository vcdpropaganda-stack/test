do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'user_role'
  ) then
    create type public.user_role as enum ('admin', 'provider', 'client');
  end if;

  if not exists (
    select 1
    from pg_type
    where typname = 'booking_status'
  ) then
    create type public.booking_status as enum (
      'pending',
      'confirmed',
      'completed',
      'cancelled'
    );
  end if;

  if not exists (
    select 1
    from pg_type
    where typname = 'subscription_plan'
  ) then
    create type public.subscription_plan as enum ('basic', 'pro', 'premium');
  end if;
end $$;

with demo_users as (
  select *
  from (
    values
      (
        '00000000-0000-4000-8000-000000000001'::uuid,
        'vitrinelojas+admin@gmail.com',
        'Admin Vitrine',
        'admin'::public.user_role,
        'Admin Vitrine'
      ),
      (
        '00000000-0000-4000-8000-000000000011'::uuid,
        'vitrinelojas+ana@gmail.com',
        'Ana Silva',
        'provider'::public.user_role,
        'Ana Clean'
      ),
      (
        '00000000-0000-4000-8000-000000000012'::uuid,
        'vitrinelojas+bruno@gmail.com',
        'Bruno Costa',
        'provider'::public.user_role,
        'Bruno Tech'
      ),
      (
        '00000000-0000-4000-8000-000000000013'::uuid,
        'vitrinelojas+carla@gmail.com',
        'Carla Oliveira',
        'provider'::public.user_role,
        'Carla Beauty'
      ),
      (
        '00000000-0000-4000-8000-000000000014'::uuid,
        'vocedigitalpropaganda@gmail.com',
        'Você Digital Propaganda',
        'provider'::public.user_role,
        'Você Digital Propaganda'
      ),
      (
        '00000000-0000-4000-8000-000000000021'::uuid,
        'vitrinelojas+cliente1@gmail.com',
        'Mariana Souza',
        'client'::public.user_role,
        'Mariana Souza'
      ),
      (
        '00000000-0000-4000-8000-000000000022'::uuid,
        'vitrinelojas+cliente2@gmail.com',
        'Lucas Pereira',
        'client'::public.user_role,
        'Lucas Pereira'
      ),
      (
        '00000000-0000-4000-8000-000000000023'::uuid,
        'vitrinelojas+cliente3@gmail.com',
        'Fernanda Lima',
        'client'::public.user_role,
        'Fernanda Lima'
      ),
      (
        '00000000-0000-4000-8000-000000000024'::uuid,
        'vitrinelojas+cliente4@gmail.com',
        'Rafael Gomes',
        'client'::public.user_role,
        'Rafael Gomes'
      )
  ) as t(id, email, full_name, role, display_name)
)
insert into auth.users (
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  is_sso_user,
  is_anonymous
)
select
  id,
  'authenticated',
  'authenticated',
  email,
  crypt('Vitrine123!', gen_salt('bf')),
  timezone('utc', now()),
  jsonb_build_object('provider', 'email', 'providers', array['email']),
  jsonb_build_object(
    'role', role::text,
    'full_name', full_name,
    'display_name', display_name
  ),
  timezone('utc', now()),
  timezone('utc', now()),
  false,
  false
from demo_users
on conflict (id) do update
set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = timezone('utc', now());

with demo_users as (
  select *
  from (
    values
      ('00000000-0000-4000-8000-000000000001'::uuid, 'vitrinelojas+admin@gmail.com'),
      ('00000000-0000-4000-8000-000000000011'::uuid, 'vitrinelojas+ana@gmail.com'),
      ('00000000-0000-4000-8000-000000000012'::uuid, 'vitrinelojas+bruno@gmail.com'),
      ('00000000-0000-4000-8000-000000000013'::uuid, 'vitrinelojas+carla@gmail.com'),
      ('00000000-0000-4000-8000-000000000014'::uuid, 'vocedigitalpropaganda@gmail.com'),
      ('00000000-0000-4000-8000-000000000021'::uuid, 'vitrinelojas+cliente1@gmail.com'),
      ('00000000-0000-4000-8000-000000000022'::uuid, 'vitrinelojas+cliente2@gmail.com'),
      ('00000000-0000-4000-8000-000000000023'::uuid, 'vitrinelojas+cliente3@gmail.com'),
      ('00000000-0000-4000-8000-000000000024'::uuid, 'vitrinelojas+cliente4@gmail.com')
  ) as t(id, email)
)
insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
select
  gen_random_uuid(),
  id,
  jsonb_build_object('sub', id::text, 'email', email),
  'email',
  id::text,
  timezone('utc', now()),
  timezone('utc', now()),
  timezone('utc', now())
from demo_users
on conflict (provider, provider_id) do update
set
  identity_data = excluded.identity_data,
  updated_at = timezone('utc', now());

update public.profiles
set
  full_name = case id
    when '00000000-0000-4000-8000-000000000001'::uuid then 'Admin Vitrine'
    when '00000000-0000-4000-8000-000000000011'::uuid then 'Ana Silva'
    when '00000000-0000-4000-8000-000000000012'::uuid then 'Bruno Costa'
    when '00000000-0000-4000-8000-000000000013'::uuid then 'Carla Oliveira'
    when '00000000-0000-4000-8000-000000000014'::uuid then 'Você Digital Propaganda'
    when '00000000-0000-4000-8000-000000000021'::uuid then 'Mariana Souza'
    when '00000000-0000-4000-8000-000000000022'::uuid then 'Lucas Pereira'
    when '00000000-0000-4000-8000-000000000023'::uuid then 'Fernanda Lima'
    when '00000000-0000-4000-8000-000000000024'::uuid then 'Rafael Gomes'
    else full_name
  end,
  phone = case id
    when '00000000-0000-4000-8000-000000000011'::uuid then '11980000011'
    when '00000000-0000-4000-8000-000000000012'::uuid then '11980000012'
    when '00000000-0000-4000-8000-000000000013'::uuid then '11980000013'
    when '00000000-0000-4000-8000-000000000014'::uuid then '1140000000'
    else phone
  end,
  role = case id
    when '00000000-0000-4000-8000-000000000001'::uuid then 'admin'::public.user_role
    when '00000000-0000-4000-8000-000000000011'::uuid then 'provider'::public.user_role
    when '00000000-0000-4000-8000-000000000012'::uuid then 'provider'::public.user_role
    when '00000000-0000-4000-8000-000000000013'::uuid then 'provider'::public.user_role
    when '00000000-0000-4000-8000-000000000014'::uuid then 'provider'::public.user_role
    else 'client'::public.user_role
  end
where id in (
  '00000000-0000-4000-8000-000000000001'::uuid,
  '00000000-0000-4000-8000-000000000011'::uuid,
  '00000000-0000-4000-8000-000000000012'::uuid,
  '00000000-0000-4000-8000-000000000013'::uuid,
  '00000000-0000-4000-8000-000000000014'::uuid,
  '00000000-0000-4000-8000-000000000021'::uuid,
  '00000000-0000-4000-8000-000000000022'::uuid,
  '00000000-0000-4000-8000-000000000023'::uuid,
  '00000000-0000-4000-8000-000000000024'::uuid
);

update public.provider_profiles
set
  display_name = case profile_id
    when '00000000-0000-4000-8000-000000000011'::uuid then 'Ana Clean'
    when '00000000-0000-4000-8000-000000000012'::uuid then 'Bruno Tech'
    when '00000000-0000-4000-8000-000000000013'::uuid then 'Carla Beauty'
    when '00000000-0000-4000-8000-000000000014'::uuid then 'Você Digital Propaganda'
    else display_name
  end,
  bio = case profile_id
    when '00000000-0000-4000-8000-000000000011'::uuid then 'Especialista em limpeza residencial com atendimento agendado e recorrente.'
    when '00000000-0000-4000-8000-000000000012'::uuid then 'Suporte técnico para computadores, redes e pequenos negócios com atendimento local.'
    when '00000000-0000-4000-8000-000000000013'::uuid then 'Serviços de beleza e autocuidado com experiência sob medida para eventos e rotina.'
    when '00000000-0000-4000-8000-000000000014'::uuid then 'Agência de marketing digital de Jundiaí focada em conversão, posicionamento de marca e crescimento de negócios.'
    else bio
  end,
  city = case profile_id
    when '00000000-0000-4000-8000-000000000011'::uuid then 'São Paulo'
    when '00000000-0000-4000-8000-000000000012'::uuid then 'Campinas'
    when '00000000-0000-4000-8000-000000000013'::uuid then 'São Paulo'
    when '00000000-0000-4000-8000-000000000014'::uuid then 'Jundiaí'
    else city
  end,
  state = case profile_id
    when '00000000-0000-4000-8000-000000000011'::uuid then 'SP'
    when '00000000-0000-4000-8000-000000000012'::uuid then 'SP'
    when '00000000-0000-4000-8000-000000000013'::uuid then 'SP'
    when '00000000-0000-4000-8000-000000000014'::uuid then 'SP'
    else state
  end,
  is_verified = true,
  plan = case profile_id
    when '00000000-0000-4000-8000-000000000011'::uuid then 'premium'::public.subscription_plan
    when '00000000-0000-4000-8000-000000000012'::uuid then 'pro'::public.subscription_plan
    when '00000000-0000-4000-8000-000000000013'::uuid then 'pro'::public.subscription_plan
    when '00000000-0000-4000-8000-000000000014'::uuid then 'premium'::public.subscription_plan
    else plan
  end,
  public_slug = case profile_id
    when '00000000-0000-4000-8000-000000000011'::uuid then 'ana-clean'
    when '00000000-0000-4000-8000-000000000012'::uuid then 'bruno-tech'
    when '00000000-0000-4000-8000-000000000013'::uuid then 'carla-beauty'
    when '00000000-0000-4000-8000-000000000014'::uuid then 'voce-digital-propaganda'
    else public_slug
  end,
  whatsapp_number = case profile_id
    when '00000000-0000-4000-8000-000000000011'::uuid then '+5511990001111'
    when '00000000-0000-4000-8000-000000000012'::uuid then '+5511990002222'
    when '00000000-0000-4000-8000-000000000013'::uuid then '+5511990003333'
    when '00000000-0000-4000-8000-000000000014'::uuid then '+5511990004444'
    else whatsapp_number
  end
where profile_id in (
  '00000000-0000-4000-8000-000000000011'::uuid,
  '00000000-0000-4000-8000-000000000012'::uuid,
  '00000000-0000-4000-8000-000000000013'::uuid,
  '00000000-0000-4000-8000-000000000014'::uuid
);

insert into public.service_categories (name, slug)
values
  ('Limpeza', 'limpeza'),
  ('Tecnologia', 'tecnologia'),
  ('Beleza', 'beleza'),
  ('Manutenção', 'manutencao'),
  ('Consultoria', 'consultoria'),
  ('Eventos', 'eventos'),
  ('Design', 'design'),
  ('Webdesign', 'webdesign'),
  ('Gestão de Tráfego', 'gestao-de-trafego'),
  ('Social Media', 'social-media')
on conflict (slug) do update
set name = excluded.name;

with provider_refs as (
  select
    profile_id,
    id as provider_profile_id
  from public.provider_profiles
  where profile_id in (
    '00000000-0000-4000-8000-000000000011'::uuid,
    '00000000-0000-4000-8000-000000000012'::uuid,
    '00000000-0000-4000-8000-000000000013'::uuid,
    '00000000-0000-4000-8000-000000000014'::uuid
  )
)
insert into public.services (
  provider_profile_id,
  category_id,
  title,
  slug,
  description,
  cover_image_url,
  price_cents,
  duration_minutes,
  is_active,
  featured_rank
)
select
  pr.provider_profile_id,
  c.id,
  svc.title,
  svc.slug,
  svc.description,
  svc.cover_image_url,
  svc.price_cents,
  svc.duration_minutes,
  true,
  svc.featured_rank
from provider_refs pr
join (
  values
    (
      '00000000-0000-4000-8000-000000000011'::uuid,
      'limpeza',
      'Limpeza residencial completa',
      'limpeza-residencial-completa',
      'Limpeza completa com checklist detalhado, materiais de apoio e opção de recorrência.',
      '/service-images/limpeza.jpg',
      18900,
      180,
      1
    ),
    (
      '00000000-0000-4000-8000-000000000011'::uuid,
      'limpeza',
      'Faxina pós-obra express',
      'faxina-pos-obra-express',
      'Serviço de limpeza pós-obra com foco em entrega rápida e acabamento visual impecável.',
      '/service-images/limpeza.jpg',
      25900,
      240,
      2
    ),
    (
      '00000000-0000-4000-8000-000000000012'::uuid,
      'tecnologia',
      'Suporte técnico residencial',
      'suporte-tecnico-residencial',
      'Instalação, manutenção e diagnóstico para notebooks, desktops, impressoras e wi-fi.',
      '/service-images/tecnologia.jpg',
      14900,
      90,
      3
    ),
    (
      '00000000-0000-4000-8000-000000000012'::uuid,
      'tecnologia',
      'Instalação de rede e wi-fi',
      'instalacao-de-rede-e-wifi',
      'Configuração de roteadores, repetidores e rede local para casas e pequenos escritórios.',
      '/service-images/tecnologia.jpg',
      22900,
      120,
      4
    ),
    (
      '00000000-0000-4000-8000-000000000012'::uuid,
      'consultoria',
      'Consultoria digital para pequenos negócios',
      'consultoria-digital-para-pequenos-negocios',
      'Diagnóstico rápido de presença digital, atendimento no WhatsApp e ajustes para melhorar a conversão local.',
      '/service-images/consultoria.jpg',
      32000,
      90,
      5
    ),
    (
      '00000000-0000-4000-8000-000000000013'::uuid,
      'beleza',
      'Maquiagem social em domicílio',
      'maquiagem-social-em-domicilio',
      'Atendimento em domicílio para eventos, ensaios e compromissos especiais, com acabamento sofisticado.',
      '/service-images/maquiagem.jpg',
      22000,
      75,
      6
    ),
    (
      '00000000-0000-4000-8000-000000000013'::uuid,
      'beleza',
      'Escova e finalização completa',
      'escova-e-finalizacao-completa',
      'Escova modelada com finalização completa para rotina, reuniões e eventos.',
      '/service-images/cabelo.jpg',
      14000,
      60,
      7
    ),
    (
      '00000000-0000-4000-8000-000000000013'::uuid,
      'eventos',
      'Produção de penteado para eventos',
      'producao-de-penteado-para-eventos',
      'Penteados e finalização para casamentos, ensaios, debutantes e eventos corporativos, com atendimento em domicílio.',
      '/service-images/cabelo.jpg',
      26000,
      90,
      8
    ),
    (
      '00000000-0000-4000-8000-000000000011'::uuid,
      'manutencao',
      'Organização e limpeza de closets',
      'organizacao-e-limpeza-de-closets',
      'Serviço focado em organização funcional, limpeza fina e reaproveitamento inteligente do espaço.',
      '/service-images/limpeza.jpg',
      21000,
      150,
      9
    ),
    (
      '00000000-0000-4000-8000-000000000012'::uuid,
      'manutencao',
      'Configuração de home office',
      'configuracao-de-home-office',
      'Montagem de estação produtiva com organização de cabos, monitor, webcam, áudio e ergonomia básica.',
      '/service-images/workspace.jpg',
      19900,
      100,
      10
    ),
    (
      '00000000-0000-4000-8000-000000000013'::uuid,
      'beleza',
      'Design de sobrancelhas',
      'design-de-sobrancelhas',
      'Modelagem com acabamento preciso e consultoria de estilo para valorizar o rosto e a rotina do cliente.',
      '/service-images/maquiagem.jpg',
      9500,
      45,
      11
    ),
    (
      '00000000-0000-4000-8000-000000000014'::uuid,
      'design',
      'Cartão de visita',
      'cartao-de-visita-vcd',
      'Cartão de visita profissional com diagramação comercial, versões para impressão e refinamento visual da marca.',
      '/service-images/workspace.jpg',
      12000,
      7,
      12
    ),
    (
      '00000000-0000-4000-8000-000000000014'::uuid,
      'design',
      'Cartão de visita digital',
      'cartao-de-visita-digital-vcd',
      'Versão digital do seu cartão com layout pensado para WhatsApp, QR code e apresentação rápida da empresa.',
      '/service-images/workspace.jpg',
      9000,
      5,
      13
    ),
    (
      '00000000-0000-4000-8000-000000000014'::uuid,
      'design',
      'Marca',
      'marca-vcd',
      'Criação de marca com conceito visual, estudo de aplicação e direção de posicionamento para o negócio.',
      '/service-images/branding.jpg',
      180000,
      20,
      14
    ),
    (
      '00000000-0000-4000-8000-000000000014'::uuid,
      'design',
      'Identidade visual',
      'identidade-visual-vcd',
      'Sistema visual completo com logo, paleta, tipografia, padrões e materiais-base para comunicar a empresa com consistência.',
      '/service-images/branding.jpg',
      250000,
      30,
      15
    ),
    (
      '00000000-0000-4000-8000-000000000014'::uuid,
      'webdesign',
      'Onepage',
      'onepage-vcd',
      'Página única objetiva para apresentar negócio, proposta, prova social e captar leads com rapidez.',
      '/service-images/workspace.jpg',
      180000,
      20,
      16
    ),
    (
      '00000000-0000-4000-8000-000000000014'::uuid,
      'webdesign',
      'Landing page',
      'landing-page-vcd',
      'Landing page focada em conversão, com estrutura de oferta, copy, CTA e integração para campanhas.',
      '/service-images/workspace.jpg',
      220000,
      25,
      17
    ),
    (
      '00000000-0000-4000-8000-000000000014'::uuid,
      'webdesign',
      'Site full',
      'site-full-vcd',
      'Site institucional completo com arquitetura de páginas, apresentação da empresa e experiência profissional.',
      '/service-images/workspace.jpg',
      450000,
      40,
      18
    ),
    (
      '00000000-0000-4000-8000-000000000014'::uuid,
      'webdesign',
      'Ecommerce',
      'ecommerce-vcd',
      'Loja virtual com estrutura para catálogo, vendas online, meios de pagamento e crescimento digital.',
      '/service-images/workspace.jpg',
      650000,
      50,
      19
    ),
    (
      '00000000-0000-4000-8000-000000000014'::uuid,
      'gestao-de-trafego',
      'Gestão de tráfego',
      'gestao-de-trafego-vcd',
      'Planejamento, criação e otimização de campanhas em Meta e Google com foco em retorno e vendas.',
      '/service-images/marketing.jpg',
      180000,
      30,
      20
    ),
    (
      '00000000-0000-4000-8000-000000000014'::uuid,
      'social-media',
      'Social media',
      'social-media-vcd',
      'Planejamento editorial, criação de conteúdo e gestão de redes sociais para fortalecer a marca e gerar demanda.',
      '/service-images/marketing.jpg',
      160000,
      30,
      21
    )
) as svc(profile_id, category_slug, title, slug, description, cover_image_url, price_cents, duration_minutes, featured_rank)
  on svc.profile_id = pr.profile_id
join public.service_categories c
  on c.slug = svc.category_slug
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  cover_image_url = excluded.cover_image_url,
  price_cents = excluded.price_cents,
  duration_minutes = excluded.duration_minutes,
  is_active = excluded.is_active,
  featured_rank = excluded.featured_rank;

delete from public.service_availability
where service_id in (
  select id
  from public.services
  where slug in (
    'limpeza-residencial-completa',
    'faxina-pos-obra-express',
    'suporte-tecnico-residencial',
    'instalacao-de-rede-e-wifi',
    'consultoria-digital-para-pequenos-negocios',
    'maquiagem-social-em-domicilio',
    'escova-e-finalizacao-completa',
    'producao-de-penteado-para-eventos',
    'organizacao-e-limpeza-de-closets',
    'configuracao-de-home-office',
    'design-de-sobrancelhas',
    'cartao-de-visita-vcd',
    'cartao-de-visita-digital-vcd',
    'marca-vcd',
    'identidade-visual-vcd',
    'onepage-vcd',
    'landing-page-vcd',
    'site-full-vcd',
    'ecommerce-vcd',
    'gestao-de-trafego-vcd',
    'social-media-vcd'
  )
);

insert into public.service_availability (service_id, start_at, end_at, is_available)
select
  s.id,
  slot.start_at,
  slot.end_at,
  true
from public.services s
join (
  values
    ('limpeza-residencial-completa', timezone('utc', now()) + interval '2 day' + interval '9 hour', timezone('utc', now()) + interval '2 day' + interval '12 hour'),
    ('limpeza-residencial-completa', timezone('utc', now()) + interval '4 day' + interval '13 hour', timezone('utc', now()) + interval '4 day' + interval '16 hour'),
    ('faxina-pos-obra-express', timezone('utc', now()) + interval '3 day' + interval '8 hour', timezone('utc', now()) + interval '3 day' + interval '12 hour'),
    ('suporte-tecnico-residencial', timezone('utc', now()) + interval '1 day' + interval '10 hour', timezone('utc', now()) + interval '1 day' + interval '11 hour 30 minute'),
    ('suporte-tecnico-residencial', timezone('utc', now()) + interval '5 day' + interval '14 hour', timezone('utc', now()) + interval '5 day' + interval '15 hour 30 minute'),
    ('instalacao-de-rede-e-wifi', timezone('utc', now()) + interval '2 day' + interval '15 hour', timezone('utc', now()) + interval '2 day' + interval '17 hour'),
    ('consultoria-digital-para-pequenos-negocios', timezone('utc', now()) + interval '4 day' + interval '10 hour', timezone('utc', now()) + interval '4 day' + interval '11 hour 30 minute'),
    ('maquiagem-social-em-domicilio', timezone('utc', now()) + interval '2 day' + interval '16 hour', timezone('utc', now()) + interval '2 day' + interval '17 hour 15 minute'),
    ('maquiagem-social-em-domicilio', timezone('utc', now()) + interval '6 day' + interval '9 hour', timezone('utc', now()) + interval '6 day' + interval '10 hour 15 minute'),
    ('escova-e-finalizacao-completa', timezone('utc', now()) + interval '1 day' + interval '15 hour', timezone('utc', now()) + interval '1 day' + interval '16 hour'),
    ('escova-e-finalizacao-completa', timezone('utc', now()) + interval '3 day' + interval '11 hour', timezone('utc', now()) + interval '3 day' + interval '12 hour'),
    ('producao-de-penteado-para-eventos', timezone('utc', now()) + interval '5 day' + interval '8 hour', timezone('utc', now()) + interval '5 day' + interval '9 hour 30 minute'),
    ('organizacao-e-limpeza-de-closets', timezone('utc', now()) + interval '7 day' + interval '13 hour', timezone('utc', now()) + interval '7 day' + interval '15 hour 30 minute'),
    ('configuracao-de-home-office', timezone('utc', now()) + interval '2 day' + interval '9 hour', timezone('utc', now()) + interval '2 day' + interval '10 hour 40 minute'),
    ('design-de-sobrancelhas', timezone('utc', now()) + interval '4 day' + interval '16 hour', timezone('utc', now()) + interval '4 day' + interval '16 hour 45 minute'),
    ('cartao-de-visita-vcd', timezone('utc', now()) + interval '1 day' + interval '9 hour', timezone('utc', now()) + interval '1 day' + interval '9 hour 30 minute'),
    ('cartao-de-visita-digital-vcd', timezone('utc', now()) + interval '1 day' + interval '11 hour', timezone('utc', now()) + interval '1 day' + interval '11 hour 30 minute'),
    ('marca-vcd', timezone('utc', now()) + interval '2 day' + interval '14 hour', timezone('utc', now()) + interval '2 day' + interval '15 hour'),
    ('identidade-visual-vcd', timezone('utc', now()) + interval '3 day' + interval '10 hour', timezone('utc', now()) + interval '3 day' + interval '11 hour'),
    ('onepage-vcd', timezone('utc', now()) + interval '4 day' + interval '9 hour', timezone('utc', now()) + interval '4 day' + interval '10 hour'),
    ('landing-page-vcd', timezone('utc', now()) + interval '5 day' + interval '15 hour', timezone('utc', now()) + interval '5 day' + interval '16 hour'),
    ('site-full-vcd', timezone('utc', now()) + interval '6 day' + interval '10 hour', timezone('utc', now()) + interval '6 day' + interval '11 hour'),
    ('ecommerce-vcd', timezone('utc', now()) + interval '7 day' + interval '16 hour', timezone('utc', now()) + interval '7 day' + interval '17 hour'),
    ('gestao-de-trafego-vcd', timezone('utc', now()) + interval '2 day' + interval '11 hour', timezone('utc', now()) + interval '2 day' + interval '12 hour'),
    ('social-media-vcd', timezone('utc', now()) + interval '3 day' + interval '15 hour', timezone('utc', now()) + interval '3 day' + interval '16 hour')
) as slot(slug, start_at, end_at)
  on slot.slug = s.slug;

insert into public.bookings (
  id,
  service_id,
  client_id,
  provider_profile_id,
  status,
  scheduled_start,
  scheduled_end,
  total_price_cents,
  notes
)
select
  b.id,
  s.id,
  b.client_id,
  s.provider_profile_id,
  b.status,
  b.scheduled_start,
  b.scheduled_end,
  b.total_price_cents,
  b.notes
from (
  values
    (
      '10000000-0000-4000-8000-000000000001'::uuid,
      'limpeza-residencial-completa',
      '00000000-0000-4000-8000-000000000021'::uuid,
      'completed'::public.booking_status,
      timezone('utc', now()) - interval '6 day',
      timezone('utc', now()) - interval '6 day' + interval '3 hour',
      18900,
      'Apartamento de 2 quartos.'
    ),
    (
      '10000000-0000-4000-8000-000000000002'::uuid,
      'suporte-tecnico-residencial',
      '00000000-0000-4000-8000-000000000022'::uuid,
      'confirmed'::public.booking_status,
      timezone('utc', now()) + interval '1 day' + interval '10 hour',
      timezone('utc', now()) + interval '1 day' + interval '11 hour 30 minute',
      14900,
      'Notebook com lentidao e problema no wifi.'
    ),
    (
      '10000000-0000-4000-8000-000000000003'::uuid,
      'maquiagem-social-em-domicilio',
      '00000000-0000-4000-8000-000000000023'::uuid,
      'pending'::public.booking_status,
      timezone('utc', now()) + interval '2 day' + interval '16 hour',
      timezone('utc', now()) + interval '2 day' + interval '17 hour 15 minute',
      22000,
      'Evento corporativo no fim da tarde.'
    ),
    (
      '10000000-0000-4000-8000-000000000004'::uuid,
      'instalacao-de-rede-e-wifi',
      '00000000-0000-4000-8000-000000000024'::uuid,
      'completed'::public.booking_status,
      timezone('utc', now()) - interval '3 day',
      timezone('utc', now()) - interval '3 day' + interval '2 hour',
      22900,
      'Escritorio pequeno com dois roteadores.'
    ),
    (
      '10000000-0000-4000-8000-000000000005'::uuid,
      'escova-e-finalizacao-completa',
      '00000000-0000-4000-8000-000000000021'::uuid,
      'cancelled'::public.booking_status,
      timezone('utc', now()) - interval '1 day',
      timezone('utc', now()) - interval '1 day' + interval '1 hour',
      14000,
      'Cliente precisou remarcar por agenda.'
    ),
    (
      '10000000-0000-4000-8000-000000000006'::uuid,
      'limpeza-residencial-completa',
      '00000000-0000-4000-8000-000000000024'::uuid,
      'confirmed'::public.booking_status,
      timezone('utc', now()) + interval '2 day' + interval '9 hour',
      timezone('utc', now()) + interval '2 day' + interval '12 hour',
      18900,
      'Dia ja fechado para limpeza completa.'
    ),
    (
      '10000000-0000-4000-8000-000000000007'::uuid,
      'escova-e-finalizacao-completa',
      '00000000-0000-4000-8000-000000000022'::uuid,
      'confirmed'::public.booking_status,
      timezone('utc', now()) + interval '3 day' + interval '11 hour',
      timezone('utc', now()) + interval '3 day' + interval '12 hour',
      14000,
      'Horario ja ocupado para atendimento em salao.'
    ),
    (
      '10000000-0000-4000-8000-000000000008'::uuid,
      'cartao-de-visita-vcd',
      '00000000-0000-4000-8000-000000000023'::uuid,
      'confirmed'::public.booking_status,
      timezone('utc', now()) + interval '1 day' + interval '9 hour',
      timezone('utc', now()) + interval '1 day' + interval '9 hour 30 minute',
      7900,
      'Briefing fechado para entrega rapida.'
    ),
    (
      '10000000-0000-4000-8000-000000000009'::uuid,
      'marca-vcd',
      '00000000-0000-4000-8000-000000000021'::uuid,
      'pending'::public.booking_status,
      timezone('utc', now()) + interval '2 day' + interval '14 hour',
      timezone('utc', now()) + interval '2 day' + interval '15 hour',
      59000,
      'Dia reservado para descoberta e direcionamento de marca.'
    )
) as b(id, service_slug, client_id, status, scheduled_start, scheduled_end, total_price_cents, notes)
join public.services s
  on s.slug = b.service_slug
on conflict (id) do update
set
  status = excluded.status,
  scheduled_start = excluded.scheduled_start,
  scheduled_end = excluded.scheduled_end,
  total_price_cents = excluded.total_price_cents,
  notes = excluded.notes;

insert into public.reviews (
  booking_id,
  service_id,
  client_id,
  provider_profile_id,
  rating,
  comment
)
select
  b.id,
  b.service_id,
  b.client_id,
  b.provider_profile_id,
  r.rating,
  r.comment
from (
  values
    (
      '10000000-0000-4000-8000-000000000001'::uuid,
      5,
      'Atendimento impecável, pontual e com acabamento excelente. Contrataria novamente sem pensar.'
    ),
    (
      '10000000-0000-4000-8000-000000000004'::uuid,
      4,
      'Resolveu a instalação da rede com rapidez e deixou tudo funcionando muito melhor.'
    )
) as r(booking_id, rating, comment)
join public.bookings b
  on b.id = r.booking_id
on conflict (booking_id) do update
set
  rating = excluded.rating,
  comment = excluded.comment;
