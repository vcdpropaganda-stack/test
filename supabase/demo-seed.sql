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
        'vlservice+admin@gmail.com',
        'Admin VLservice',
        'admin'::public.user_role,
        'Admin VLservice'
      ),
      (
        '00000000-0000-4000-8000-000000000011'::uuid,
        'vlservice+ana@gmail.com',
        'Ana Silva',
        'provider'::public.user_role,
        'Ana Clean'
      ),
      (
        '00000000-0000-4000-8000-000000000012'::uuid,
        'vlservice+bruno@gmail.com',
        'Bruno Costa',
        'provider'::public.user_role,
        'Bruno Tech'
      ),
      (
        '00000000-0000-4000-8000-000000000013'::uuid,
        'vlservice+carla@gmail.com',
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
        'vlservice+cliente1@gmail.com',
        'Mariana Souza',
        'client'::public.user_role,
        'Mariana Souza'
      ),
      (
        '00000000-0000-4000-8000-000000000022'::uuid,
        'vlservice+cliente2@gmail.com',
        'Lucas Pereira',
        'client'::public.user_role,
        'Lucas Pereira'
      ),
      (
        '00000000-0000-4000-8000-000000000023'::uuid,
        'vlservice+cliente3@gmail.com',
        'Fernanda Lima',
        'client'::public.user_role,
        'Fernanda Lima'
      ),
      (
        '00000000-0000-4000-8000-000000000024'::uuid,
        'vlservice+cliente4@gmail.com',
        'Rafael Gomes',
        'client'::public.user_role,
        'Rafael Gomes'
      )
  ) as t(id, email, full_name, role, display_name)
)
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  email_change_token_new,
  email_change,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  email_change_token_current,
  email_change_confirm_status,
  phone_change,
  phone_change_token,
  reauthentication_token,
  is_sso_user,
  is_anonymous
)
select
  '00000000-0000-0000-0000-000000000000'::uuid,
  id,
  'authenticated',
  'authenticated',
  email,
  crypt('VLservice123!', gen_salt('bf')),
  timezone('utc', now()),
  '',
  timezone('utc', now()),
  '',
  '',
  '',
  jsonb_build_object('provider', 'email', 'providers', array['email']),
  jsonb_build_object(
    'sub', id::text,
    'role', role::text,
    'email', email,
    'phone', '',
    'full_name', full_name,
    'display_name', display_name,
    'email_verified', true,
    'phone_verified', false
  ),
  timezone('utc', now()),
  timezone('utc', now()),
  '',
  0,
  '',
  '',
  '',
  false,
  false
from demo_users
on conflict (id) do update
set
  instance_id = excluded.instance_id,
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  confirmation_token = excluded.confirmation_token,
  confirmation_sent_at = excluded.confirmation_sent_at,
  recovery_token = excluded.recovery_token,
  email_change_token_new = excluded.email_change_token_new,
  email_change = excluded.email_change,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  email_change_token_current = excluded.email_change_token_current,
  email_change_confirm_status = excluded.email_change_confirm_status,
  phone_change = excluded.phone_change,
  phone_change_token = excluded.phone_change_token,
  reauthentication_token = excluded.reauthentication_token,
  updated_at = timezone('utc', now());

with demo_users as (
  select *
  from (
    values
      (
        '00000000-0000-4000-8000-000000000001'::uuid,
        'vlservice+admin@gmail.com',
        'Admin VLservice',
        'admin'::public.user_role,
        'Admin VLservice'
      ),
      (
        '00000000-0000-4000-8000-000000000011'::uuid,
        'vlservice+ana@gmail.com',
        'Ana Silva',
        'provider'::public.user_role,
        'Ana Clean'
      ),
      (
        '00000000-0000-4000-8000-000000000012'::uuid,
        'vlservice+bruno@gmail.com',
        'Bruno Costa',
        'provider'::public.user_role,
        'Bruno Tech'
      ),
      (
        '00000000-0000-4000-8000-000000000013'::uuid,
        'vlservice+carla@gmail.com',
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
        'vlservice+cliente1@gmail.com',
        'Mariana Souza',
        'client'::public.user_role,
        'Mariana Souza'
      ),
      (
        '00000000-0000-4000-8000-000000000022'::uuid,
        'vlservice+cliente2@gmail.com',
        'Lucas Pereira',
        'client'::public.user_role,
        'Lucas Pereira'
      ),
      (
        '00000000-0000-4000-8000-000000000023'::uuid,
        'vlservice+cliente3@gmail.com',
        'Fernanda Lima',
        'client'::public.user_role,
        'Fernanda Lima'
      ),
      (
        '00000000-0000-4000-8000-000000000024'::uuid,
        'vlservice+cliente4@gmail.com',
        'Rafael Gomes',
        'client'::public.user_role,
        'Rafael Gomes'
      )
  ) as t(id, email, full_name, role, display_name)
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
  jsonb_build_object(
    'sub', id::text,
    'role', role::text,
    'email', email,
    'phone', '',
    'full_name', full_name,
    'display_name', display_name,
    'email_verified', true,
    'phone_verified', false
  ),
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
    when '00000000-0000-4000-8000-000000000001'::uuid then 'Admin VLservice'
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

delete from public.client_reviews
where booking_id in (
  '10000000-0000-4000-8000-000000000001'::uuid,
  '10000000-0000-4000-8000-000000000004'::uuid
);

insert into public.client_reviews (
  booking_id,
  client_id,
  provider_profile_id,
  rating,
  comment
)
select
  b.id,
  b.client_id,
  b.provider_profile_id,
  r.rating,
  r.comment
from (
  values
    (
      '10000000-0000-4000-8000-000000000001'::uuid,
      5,
      'Cliente muito clara nas instrucoes, liberou acesso no horario combinado e facilitou toda a execucao.'
    ),
    (
      '10000000-0000-4000-8000-000000000004'::uuid,
      4,
      'Passou o contexto tecnico com objetividade e aprovou rapidamente os testes finais da rede.'
    )
) as r(booking_id, rating, comment)
join public.bookings b
  on b.id = r.booking_id;

delete from public.job_bid_credit_purchases
where payment_reference like 'demo-pack-%';

with provider_refs as (
  select
    id as provider_profile_id,
    profile_id
  from public.provider_profiles
  where profile_id in (
    '00000000-0000-4000-8000-000000000011'::uuid,
    '00000000-0000-4000-8000-000000000012'::uuid,
    '00000000-0000-4000-8000-000000000013'::uuid,
    '00000000-0000-4000-8000-000000000014'::uuid
  )
)
insert into public.job_bid_credit_purchases (
  provider_profile_id,
  credits_total,
  credits_used,
  amount_cents,
  status,
  payment_reference,
  created_at
)
select
  pr.provider_profile_id,
  pack.credits_total,
  pack.credits_used,
  pack.amount_cents,
  'prototype_paid',
  pack.payment_reference,
  timezone('utc', now()) - pack.created_offset
from provider_refs pr
join (
  values
    (
      '00000000-0000-4000-8000-000000000011'::uuid,
      20,
      3,
      1000,
      'demo-pack-ana-001',
      interval '15 day'
    ),
    (
      '00000000-0000-4000-8000-000000000012'::uuid,
      20,
      8,
      1000,
      'demo-pack-bruno-001',
      interval '10 day'
    ),
    (
      '00000000-0000-4000-8000-000000000013'::uuid,
      20,
      12,
      1000,
      'demo-pack-carla-001',
      interval '8 day'
    ),
    (
      '00000000-0000-4000-8000-000000000014'::uuid,
      20,
      5,
      1000,
      'demo-pack-vdp-001',
      interval '6 day'
    )
) as pack(profile_id, credits_total, credits_used, amount_cents, payment_reference, created_offset)
  on pack.profile_id = pr.profile_id;

delete from public.job_bids
where job_id in (
  select id
  from public.jobs
  where slug in (
    'faxina-apartamento-vila-mariana',
    'estrutura-digital-home-office-campinas',
    'maquiagem-e-penteado-evento-corporativo',
    'identidade-visual-clinica-jundiai',
    'organizacao-de-closet-pinheiros'
  )
);

delete from public.jobs
where slug in (
  'faxina-apartamento-vila-mariana',
  'estrutura-digital-home-office-campinas',
  'maquiagem-e-penteado-evento-corporativo',
  'identidade-visual-clinica-jundiai',
  'organizacao-de-closet-pinheiros'
);

insert into public.jobs (
  id,
  client_id,
  category_id,
  title,
  slug,
  description,
  city,
  neighborhood,
  budget_min_cents,
  budget_max_cents,
  desired_deadline_at,
  status,
  expires_at,
  created_at,
  updated_at
)
select
  j.id,
  j.client_id,
  c.id,
  j.title,
  j.slug,
  j.description,
  j.city,
  j.neighborhood,
  j.budget_min_cents,
  j.budget_max_cents,
  j.desired_deadline_at,
  'open'::public.job_status,
  j.expires_at,
  j.created_at,
  j.updated_at
from (
  values
    (
      '20000000-0000-4000-8000-000000000001'::uuid,
      '00000000-0000-4000-8000-000000000021'::uuid,
      'limpeza',
      'Faxina completa para apartamento na Vila Mariana',
      'faxina-apartamento-vila-mariana',
      'Preciso de uma faxina completa em apartamento de 2 quartos, com foco em cozinha, banheiros e janelas. Quero alguem que ja trabalhe com checklist e possa voltar mensalmente se der certo.',
      'São Paulo',
      'Vila Mariana',
      18000,
      22000,
      timezone('utc', now()) + interval '2 day',
      timezone('utc', now()) + interval '5 day',
      timezone('utc', now()) - interval '3 hour',
      timezone('utc', now()) - interval '3 hour'
    ),
    (
      '20000000-0000-4000-8000-000000000002'::uuid,
      '00000000-0000-4000-8000-000000000022'::uuid,
      'consultoria',
      'Organizar atendimento digital e home office da clinica',
      'estrutura-digital-home-office-campinas',
      'Quero revisar o fluxo do WhatsApp, organizar o atendimento remoto da clinica e melhorar a configuracao do home office para equipe pequena. Busco alguem que una operacao e visao digital.',
      'Campinas',
      'Cambuí',
      30000,
      45000,
      timezone('utc', now()) + interval '5 day',
      timezone('utc', now()) + interval '6 day',
      timezone('utc', now()) - interval '10 hour',
      timezone('utc', now()) - interval '9 hour'
    ),
    (
      '20000000-0000-4000-8000-000000000003'::uuid,
      '00000000-0000-4000-8000-000000000023'::uuid,
      'beleza',
      'Maquiagem e penteado para evento corporativo',
      'maquiagem-e-penteado-evento-corporativo',
      'Tenho um evento corporativo importante e preciso de maquiagem social com penteado leve para fotos, palco e networking. Atendimento em domicilio na parte da tarde.',
      'São Paulo',
      'Bela Vista',
      24000,
      32000,
      timezone('utc', now()) + interval '3 day',
      timezone('utc', now()) + interval '4 day',
      timezone('utc', now()) - interval '1 day',
      timezone('utc', now()) - interval '20 hour'
    ),
    (
      '20000000-0000-4000-8000-000000000004'::uuid,
      '00000000-0000-4000-8000-000000000024'::uuid,
      'design',
      'Identidade visual para clinica odontologica',
      'identidade-visual-clinica-jundiai',
      'Busco identidade visual nova para clinica odontologica, com logo, paleta, aplicacoes basicas e direcionamento para materiais comerciais. O briefing ja esta estruturado e a decisao precisa ser agil.',
      'Jundiaí',
      'Anhangabaú',
      180000,
      250000,
      timezone('utc', now()) - interval '12 day',
      timezone('utc', now()) - interval '8 day',
      timezone('utc', now()) - interval '16 day',
      timezone('utc', now()) - interval '9 day'
    ),
    (
      '20000000-0000-4000-8000-000000000005'::uuid,
      '00000000-0000-4000-8000-000000000021'::uuid,
      'manutencao',
      'Organizacao de closet e limpeza fina em Pinheiros',
      'organizacao-de-closet-pinheiros',
      'Quero reorganizar um closet com dobra, descarte leve e limpeza fina. O horario inicial ficou ruim para mim e o pedido acabou sendo cancelado, mas quero manter o historico da negociacao para a demo.',
      'São Paulo',
      'Pinheiros',
      18000,
      24000,
      timezone('utc', now()) + interval '7 day',
      timezone('utc', now()) + interval '3 day',
      timezone('utc', now()) - interval '2 day',
      timezone('utc', now()) - interval '1 day'
    )
) as j(
  id,
  client_id,
  category_slug,
  title,
  slug,
  description,
  city,
  neighborhood,
  budget_min_cents,
  budget_max_cents,
  desired_deadline_at,
  expires_at,
  created_at,
  updated_at
)
join public.service_categories c
  on c.slug = j.category_slug;

with provider_refs as (
  select
    id as provider_profile_id,
    profile_id
  from public.provider_profiles
  where profile_id in (
    '00000000-0000-4000-8000-000000000011'::uuid,
    '00000000-0000-4000-8000-000000000012'::uuid,
    '00000000-0000-4000-8000-000000000013'::uuid,
    '00000000-0000-4000-8000-000000000014'::uuid
  )
),
job_refs as (
  select id, slug
  from public.jobs
  where slug in (
    'faxina-apartamento-vila-mariana',
    'estrutura-digital-home-office-campinas',
    'maquiagem-e-penteado-evento-corporativo',
    'identidade-visual-clinica-jundiai',
    'organizacao-de-closet-pinheiros'
  )
)
insert into public.job_bids (
  id,
  job_id,
  provider_profile_id,
  amount_cents,
  estimated_days,
  message,
  status,
  created_at,
  updated_at
)
select
  bid.id,
  jr.id,
  pr.provider_profile_id,
  bid.amount_cents,
  bid.estimated_days,
  bid.message,
  bid.status,
  bid.created_at,
  bid.updated_at
from (
  values
    (
      '21000000-0000-4000-8000-000000000001'::uuid,
      'estrutura-digital-home-office-campinas',
      '00000000-0000-4000-8000-000000000012'::uuid,
      32000,
      4,
      'Posso revisar estrutura de atendimento, mapear gargalos do WhatsApp e ajustar a operacao do home office com um plano simples de execucao.',
      'submitted'::public.job_bid_status,
      timezone('utc', now()) - interval '8 hour',
      timezone('utc', now()) - interval '8 hour'
    ),
    (
      '21000000-0000-4000-8000-000000000002'::uuid,
      'estrutura-digital-home-office-campinas',
      '00000000-0000-4000-8000-000000000014'::uuid,
      39000,
      5,
      'Entrego um diagnostico de atendimento com melhorias de posicionamento, organizacao de fluxo e sugestoes para conversao no digital.',
      'submitted'::public.job_bid_status,
      timezone('utc', now()) - interval '7 hour',
      timezone('utc', now()) - interval '7 hour'
    ),
    (
      '21000000-0000-4000-8000-000000000003'::uuid,
      'maquiagem-e-penteado-evento-corporativo',
      '00000000-0000-4000-8000-000000000013'::uuid,
      26000,
      2,
      'Levo kit completo, preparo pele e penteado leve para durar o evento inteiro com acabamento fotografico.',
      'accepted'::public.job_bid_status,
      timezone('utc', now()) - interval '22 hour',
      timezone('utc', now()) - interval '20 hour'
    ),
    (
      '21000000-0000-4000-8000-000000000004'::uuid,
      'maquiagem-e-penteado-evento-corporativo',
      '00000000-0000-4000-8000-000000000011'::uuid,
      28000,
      3,
      'Consigo apoiar na preparacao do ambiente e na organizacao do atendimento, mas voce teria mais aderencia com profissional de beleza dedicada.',
      'rejected'::public.job_bid_status,
      timezone('utc', now()) - interval '21 hour',
      timezone('utc', now()) - interval '19 hour'
    ),
    (
      '21000000-0000-4000-8000-000000000005'::uuid,
      'identidade-visual-clinica-jundiai',
      '00000000-0000-4000-8000-000000000014'::uuid,
      210000,
      12,
      'Posso conduzir estrategia, conceito, sistema visual e materiais-base para sua clinica com entregas organizadas por etapa.',
      'accepted'::public.job_bid_status,
      timezone('utc', now()) - interval '14 day',
      timezone('utc', now()) - interval '11 day'
    ),
    (
      '21000000-0000-4000-8000-000000000006'::uuid,
      'identidade-visual-clinica-jundiai',
      '00000000-0000-4000-8000-000000000012'::uuid,
      190000,
      7,
      'Posso ajudar mais no ambiente digital e configuracoes de apoio, mas a parte visual completa exigiria parceria criativa.',
      'rejected'::public.job_bid_status,
      timezone('utc', now()) - interval '13 day',
      timezone('utc', now()) - interval '11 day'
    ),
    (
      '21000000-0000-4000-8000-000000000007'::uuid,
      'organizacao-de-closet-pinheiros',
      '00000000-0000-4000-8000-000000000011'::uuid,
      21000,
      2,
      'Consigo fazer a organizacao completa em uma manha com checklist de descarte, categorizacao e limpeza fina no final.',
      'rejected'::public.job_bid_status,
      timezone('utc', now()) - interval '28 hour',
      timezone('utc', now()) - interval '24 hour'
    )
) as bid(
  id,
  job_slug,
  provider_profile_profile_id,
  amount_cents,
  estimated_days,
  message,
  status,
  created_at,
  updated_at
)
join job_refs jr
  on jr.slug = bid.job_slug
join provider_refs pr
  on pr.profile_id = bid.provider_profile_profile_id;

update public.jobs
set
  status = 'in_progress'::public.job_status,
  hired_bid_id = '21000000-0000-4000-8000-000000000003'::uuid,
  updated_at = timezone('utc', now()) - interval '18 hour'
where slug = 'maquiagem-e-penteado-evento-corporativo';

update public.jobs
set
  status = 'completed'::public.job_status,
  hired_bid_id = '21000000-0000-4000-8000-000000000005'::uuid,
  updated_at = timezone('utc', now()) - interval '7 day'
where slug = 'identidade-visual-clinica-jundiai';

update public.jobs
set
  status = 'cancelled'::public.job_status,
  hired_bid_id = null,
  updated_at = timezone('utc', now()) - interval '23 hour'
where slug = 'organizacao-de-closet-pinheiros';

delete from public.conversations
where id in (
  '30000000-0000-4000-8000-000000000001'::uuid,
  '30000000-0000-4000-8000-000000000002'::uuid,
  '30000000-0000-4000-8000-000000000003'::uuid,
  '30000000-0000-4000-8000-000000000004'::uuid,
  '30000000-0000-4000-8000-000000000005'::uuid,
  '30000000-0000-4000-8000-000000000006'::uuid,
  '30000000-0000-4000-8000-000000000007'::uuid,
  '30000000-0000-4000-8000-000000000008'::uuid,
  '30000000-0000-4000-8000-000000000009'::uuid,
  '30000000-0000-4000-8000-000000000010'::uuid
)
or booking_id in (
  '10000000-0000-4000-8000-000000000001'::uuid,
  '10000000-0000-4000-8000-000000000002'::uuid,
  '10000000-0000-4000-8000-000000000003'::uuid,
  '10000000-0000-4000-8000-000000000004'::uuid,
  '10000000-0000-4000-8000-000000000005'::uuid,
  '10000000-0000-4000-8000-000000000006'::uuid,
  '10000000-0000-4000-8000-000000000007'::uuid,
  '10000000-0000-4000-8000-000000000008'::uuid,
  '10000000-0000-4000-8000-000000000009'::uuid
);

with provider_refs as (
  select
    id as provider_profile_id,
    profile_id
  from public.provider_profiles
  where profile_id in (
    '00000000-0000-4000-8000-000000000011'::uuid,
    '00000000-0000-4000-8000-000000000012'::uuid,
    '00000000-0000-4000-8000-000000000013'::uuid,
    '00000000-0000-4000-8000-000000000014'::uuid
  )
),
service_refs as (
  select id, slug, provider_profile_id
  from public.services
  where slug in (
    'consultoria-digital-para-pequenos-negocios',
    'suporte-tecnico-residencial',
    'instalacao-de-rede-e-wifi',
    'maquiagem-social-em-domicilio',
    'escova-e-finalizacao-completa',
    'cartao-de-visita-vcd',
    'limpeza-residencial-completa',
    'marca-vcd'
  )
)
insert into public.conversations (
  id,
  service_id,
  booking_id,
  client_id,
  provider_profile_id,
  status,
  created_at,
  updated_at
)
select
  convo.id,
  sr.id,
  convo.booking_id,
  convo.client_id,
  pr.provider_profile_id,
  convo.status,
  convo.created_at,
  convo.updated_at
from (
  values
    (
      '30000000-0000-4000-8000-000000000001'::uuid,
      'consultoria-digital-para-pequenos-negocios',
      null::uuid,
      '00000000-0000-4000-8000-000000000022'::uuid,
      '00000000-0000-4000-8000-000000000012'::uuid,
      'open'::public.conversation_status,
      timezone('utc', now()) - interval '7 hour',
      timezone('utc', now()) - interval '2 hour'
    ),
    (
      '30000000-0000-4000-8000-000000000002'::uuid,
      'suporte-tecnico-residencial',
      '10000000-0000-4000-8000-000000000002'::uuid,
      '00000000-0000-4000-8000-000000000022'::uuid,
      '00000000-0000-4000-8000-000000000012'::uuid,
      'open'::public.conversation_status,
      timezone('utc', now()) - interval '20 hour',
      timezone('utc', now()) - interval '90 minute'
    ),
    (
      '30000000-0000-4000-8000-000000000003'::uuid,
      'maquiagem-social-em-domicilio',
      '10000000-0000-4000-8000-000000000003'::uuid,
      '00000000-0000-4000-8000-000000000023'::uuid,
      '00000000-0000-4000-8000-000000000013'::uuid,
      'open'::public.conversation_status,
      timezone('utc', now()) - interval '12 hour',
      timezone('utc', now()) - interval '70 minute'
    ),
    (
      '30000000-0000-4000-8000-000000000004'::uuid,
      'cartao-de-visita-vcd',
      '10000000-0000-4000-8000-000000000008'::uuid,
      '00000000-0000-4000-8000-000000000023'::uuid,
      '00000000-0000-4000-8000-000000000014'::uuid,
      'open'::public.conversation_status,
      timezone('utc', now()) - interval '16 hour',
      timezone('utc', now()) - interval '50 minute'
    ),
    (
      '30000000-0000-4000-8000-000000000005'::uuid,
      'limpeza-residencial-completa',
      '10000000-0000-4000-8000-000000000001'::uuid,
      '00000000-0000-4000-8000-000000000021'::uuid,
      '00000000-0000-4000-8000-000000000011'::uuid,
      'closed'::public.conversation_status,
      timezone('utc', now()) - interval '7 day',
      timezone('utc', now()) - interval '5 day'
    ),
    (
      '30000000-0000-4000-8000-000000000006'::uuid,
      'instalacao-de-rede-e-wifi',
      '10000000-0000-4000-8000-000000000004'::uuid,
      '00000000-0000-4000-8000-000000000024'::uuid,
      '00000000-0000-4000-8000-000000000012'::uuid,
      'open'::public.conversation_status,
      timezone('utc', now()) - interval '3 day 6 hour',
      timezone('utc', now()) - interval '3 hour'
    ),
    (
      '30000000-0000-4000-8000-000000000007'::uuid,
      'escova-e-finalizacao-completa',
      '10000000-0000-4000-8000-000000000005'::uuid,
      '00000000-0000-4000-8000-000000000021'::uuid,
      '00000000-0000-4000-8000-000000000013'::uuid,
      'closed'::public.conversation_status,
      timezone('utc', now()) - interval '1 day 8 hour',
      timezone('utc', now()) - interval '1 day'
    ),
    (
      '30000000-0000-4000-8000-000000000008'::uuid,
      'limpeza-residencial-completa',
      '10000000-0000-4000-8000-000000000006'::uuid,
      '00000000-0000-4000-8000-000000000024'::uuid,
      '00000000-0000-4000-8000-000000000011'::uuid,
      'open'::public.conversation_status,
      timezone('utc', now()) - interval '14 hour',
      timezone('utc', now()) - interval '35 minute'
    ),
    (
      '30000000-0000-4000-8000-000000000009'::uuid,
      'escova-e-finalizacao-completa',
      '10000000-0000-4000-8000-000000000007'::uuid,
      '00000000-0000-4000-8000-000000000022'::uuid,
      '00000000-0000-4000-8000-000000000013'::uuid,
      'open'::public.conversation_status,
      timezone('utc', now()) - interval '9 hour',
      timezone('utc', now()) - interval '25 minute'
    ),
    (
      '30000000-0000-4000-8000-000000000010'::uuid,
      'marca-vcd',
      '10000000-0000-4000-8000-000000000009'::uuid,
      '00000000-0000-4000-8000-000000000021'::uuid,
      '00000000-0000-4000-8000-000000000014'::uuid,
      'open'::public.conversation_status,
      timezone('utc', now()) - interval '22 hour',
      timezone('utc', now()) - interval '40 minute'
    )
) as convo(
  id,
  service_slug,
  booking_id,
  client_id,
  provider_profile_profile_id,
  status,
  created_at,
  updated_at
)
join provider_refs pr
  on pr.profile_id = convo.provider_profile_profile_id
join service_refs sr
  on sr.slug = convo.service_slug
 and sr.provider_profile_id = pr.provider_profile_id;

insert into public.conversation_messages (
  id,
  conversation_id,
  sender_id,
  kind,
  body,
  created_at
)
values
  (
    '31000000-0000-4000-8000-000000000001'::uuid,
    '30000000-0000-4000-8000-000000000001'::uuid,
    '00000000-0000-4000-8000-000000000022'::uuid,
    'text',
    'Oi, quero organizar o atendimento da clinica e o home office da equipe. Voce atende esse tipo de estrutura?',
    timezone('utc', now()) - interval '7 hour'
  ),
  (
    '31000000-0000-4000-8000-000000000002'::uuid,
    '30000000-0000-4000-8000-000000000001'::uuid,
    '00000000-0000-4000-8000-000000000012'::uuid,
    'text',
    'Atendo sim. Posso mapear o fluxo do WhatsApp, revisar equipamentos e deixar um plano simples para o time seguir.',
    timezone('utc', now()) - interval '6 hour 40 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000003'::uuid,
    '30000000-0000-4000-8000-000000000001'::uuid,
    '00000000-0000-4000-8000-000000000022'::uuid,
    'text',
    'Perfeito. Vou comparar sua proposta com outra opcao e te retorno ainda hoje.',
    timezone('utc', now()) - interval '5 hour 50 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000004'::uuid,
    '30000000-0000-4000-8000-000000000001'::uuid,
    '00000000-0000-4000-8000-000000000012'::uuid,
    'text',
    'Combinado. Se fechar, ja deixo o diagnostico inicial pronto para nossa primeira sessao.',
    timezone('utc', now()) - interval '2 hour'
  ),
  (
    '31000000-0000-4000-8000-000000000005'::uuid,
    '30000000-0000-4000-8000-000000000002'::uuid,
    '00000000-0000-4000-8000-000000000022'::uuid,
    'text',
    'Fechei o atendimento tecnico. Amanhã o notebook principal e o wifi precisam ficar redondos antes da equipe entrar.',
    timezone('utc', now()) - interval '20 hour'
  ),
  (
    '31000000-0000-4000-8000-000000000006'::uuid,
    '30000000-0000-4000-8000-000000000002'::uuid,
    '00000000-0000-4000-8000-000000000012'::uuid,
    'text',
    'Pode deixar. Vou levar repetidor para teste e ja chego com checklist de rede, impressora e backup rapido.',
    timezone('utc', now()) - interval '19 hour 20 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000007'::uuid,
    '30000000-0000-4000-8000-000000000002'::uuid,
    '00000000-0000-4000-8000-000000000022'::uuid,
    'text',
    'Excelente. O predio libera entrada a partir das 9h40 e a recepcao ja foi avisada.',
    timezone('utc', now()) - interval '18 hour 35 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000008'::uuid,
    '30000000-0000-4000-8000-000000000002'::uuid,
    '00000000-0000-4000-8000-000000000012'::uuid,
    'text',
    'Perfeito. Chego um pouco antes e te atualizo aqui assim que iniciar os testes.',
    timezone('utc', now()) - interval '90 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000009'::uuid,
    '30000000-0000-4000-8000-000000000003'::uuid,
    '00000000-0000-4000-8000-000000000023'::uuid,
    'text',
    'Quero uma maquiagem elegante e penteado leve para fotos do evento. Minha roupa ja esta definida em tons neutros.',
    timezone('utc', now()) - interval '12 hour'
  ),
  (
    '31000000-0000-4000-8000-000000000010'::uuid,
    '30000000-0000-4000-8000-000000000003'::uuid,
    '00000000-0000-4000-8000-000000000013'::uuid,
    'text',
    'Perfeito. Vou seguir uma linha sofisticada, pele leve e cabelo alinhado para aguentar palco e networking.',
    timezone('utc', now()) - interval '11 hour 35 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000011'::uuid,
    '30000000-0000-4000-8000-000000000003'::uuid,
    '00000000-0000-4000-8000-000000000023'::uuid,
    'text',
    'Adorei. Ja reservei o horario e vou te mandar referencia das fotos que gosto.',
    timezone('utc', now()) - interval '10 hour 50 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000012'::uuid,
    '30000000-0000-4000-8000-000000000003'::uuid,
    '00000000-0000-4000-8000-000000000013'::uuid,
    'text',
    'Fechado. Levo tudo comigo e deixo um tempo final para ajuste fino antes de voce sair.',
    timezone('utc', now()) - interval '70 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000013'::uuid,
    '30000000-0000-4000-8000-000000000004'::uuid,
    '00000000-0000-4000-8000-000000000023'::uuid,
    'text',
    'Gostei bastante do portfolio. Precisamos de um cartao de visita agil para evento comercial da semana que vem.',
    timezone('utc', now()) - interval '16 hour'
  ),
  (
    '31000000-0000-4000-8000-000000000014'::uuid,
    '30000000-0000-4000-8000-000000000004'::uuid,
    '00000000-0000-4000-8000-000000000014'::uuid,
    'text',
    'Consigo desenhar uma versao impressa e uma digital com QR code, mantendo coerencia com a marca atual.',
    timezone('utc', now()) - interval '15 hour 15 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000015'::uuid,
    '30000000-0000-4000-8000-000000000004'::uuid,
    '00000000-0000-4000-8000-000000000023'::uuid,
    'text',
    'Fechado. O briefing ja esta aprovado internamente e a urgencia e entregar ainda esta semana.',
    timezone('utc', now()) - interval '14 hour 45 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000016'::uuid,
    '30000000-0000-4000-8000-000000000004'::uuid,
    '00000000-0000-4000-8000-000000000014'::uuid,
    'text',
    'Perfeito. Ja inicio o rascunho e te atualizo por aqui com a primeira proposta visual.',
    timezone('utc', now()) - interval '50 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000017'::uuid,
    '30000000-0000-4000-8000-000000000005'::uuid,
    '00000000-0000-4000-8000-000000000021'::uuid,
    'text',
    'Obrigada pelo atendimento. A limpeza ficou excelente e vou chamar novamente no proximo mes.',
    timezone('utc', now()) - interval '7 day'
  ),
  (
    '31000000-0000-4000-8000-000000000018'::uuid,
    '30000000-0000-4000-8000-000000000005'::uuid,
    '00000000-0000-4000-8000-000000000011'::uuid,
    'text',
    'Fico feliz que tenha gostado. Ja deixei sua preferencia registrada para facilitar os proximos agendamentos.',
    timezone('utc', now()) - interval '6 day 23 hour'
  ),
  (
    '31000000-0000-4000-8000-000000000019'::uuid,
    '30000000-0000-4000-8000-000000000005'::uuid,
    '00000000-0000-4000-8000-000000000021'::uuid,
    'text',
    'Perfeito. A plataforma ajudou bastante porque consegui acompanhar tudo sem desencontro.',
    timezone('utc', now()) - interval '6 day 22 hour 30 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000020'::uuid,
    '30000000-0000-4000-8000-000000000005'::uuid,
    '00000000-0000-4000-8000-000000000011'::uuid,
    'text',
    'Conte comigo. Quando quiser repetir o servico, me chama direto pela conversa da plataforma.',
    timezone('utc', now()) - interval '5 day'
  ),
  (
    '31000000-0000-4000-8000-000000000021'::uuid,
    '30000000-0000-4000-8000-000000000006'::uuid,
    '00000000-0000-4000-8000-000000000024'::uuid,
    'text',
    'A instalacao anterior melhorou bastante, mas ainda queria revisar a distribuicao do wifi nas salas menores.',
    timezone('utc', now()) - interval '3 day 6 hour'
  ),
  (
    '31000000-0000-4000-8000-000000000022'::uuid,
    '30000000-0000-4000-8000-000000000006'::uuid,
    '00000000-0000-4000-8000-000000000012'::uuid,
    'text',
    'Claro. Posso ajustar os canais, medir sinal em cada ponto e deixar um mapa simples para a equipe.',
    timezone('utc', now()) - interval '3 day 5 hour 35 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000023'::uuid,
    '30000000-0000-4000-8000-000000000006'::uuid,
    '00000000-0000-4000-8000-000000000024'::uuid,
    'text',
    'Perfeito. Preciso tambem de orientacao para o roteador da recepcao, porque o atendimento cai em alguns horarios.',
    timezone('utc', now()) - interval '3 day 4 hour 50 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000024'::uuid,
    '30000000-0000-4000-8000-000000000006'::uuid,
    '00000000-0000-4000-8000-000000000012'::uuid,
    'text',
    'Fechado. Revisei o historico e levo os equipamentos certos para resolver isso de uma vez.',
    timezone('utc', now()) - interval '3 hour'
  ),
  (
    '31000000-0000-4000-8000-000000000025'::uuid,
    '30000000-0000-4000-8000-000000000007'::uuid,
    '00000000-0000-4000-8000-000000000021'::uuid,
    'text',
    'Precisei cancelar a escova porque uma reuniao entrou em cima da hora. Queria saber se consigo remarcar depois.',
    timezone('utc', now()) - interval '1 day 8 hour'
  ),
  (
    '31000000-0000-4000-8000-000000000026'::uuid,
    '30000000-0000-4000-8000-000000000007'::uuid,
    '00000000-0000-4000-8000-000000000013'::uuid,
    'text',
    'Sem problema. Posso segurar um novo horario para a semana que vem e manter o mesmo valor.',
    timezone('utc', now()) - interval '1 day 7 hour 30 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000027'::uuid,
    '30000000-0000-4000-8000-000000000007'::uuid,
    '00000000-0000-4000-8000-000000000021'::uuid,
    'text',
    'Otimo. Assim que eu confirmar a agenda, volto por aqui para reabrir o atendimento.',
    timezone('utc', now()) - interval '1 day 7 hour'
  ),
  (
    '31000000-0000-4000-8000-000000000028'::uuid,
    '30000000-0000-4000-8000-000000000007'::uuid,
    '00000000-0000-4000-8000-000000000013'::uuid,
    'text',
    'Combinado. Ja deixei sua ficha separada para conseguirmos remarcar rapido.',
    timezone('utc', now()) - interval '1 day'
  ),
  (
    '31000000-0000-4000-8000-000000000029'::uuid,
    '30000000-0000-4000-8000-000000000008'::uuid,
    '00000000-0000-4000-8000-000000000024'::uuid,
    'text',
    'Quero alinhar a limpeza completa do sabado e combinar acesso ao condominio sem depender do porteiro.',
    timezone('utc', now()) - interval '14 hour'
  ),
  (
    '31000000-0000-4000-8000-000000000030'::uuid,
    '30000000-0000-4000-8000-000000000008'::uuid,
    '00000000-0000-4000-8000-000000000011'::uuid,
    'text',
    'Sem problema. Se voce me mandar o nome completo do visitante, ja deixo tudo pronto para entrada sem atraso.',
    timezone('utc', now()) - interval '13 hour 20 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000031'::uuid,
    '30000000-0000-4000-8000-000000000008'::uuid,
    '00000000-0000-4000-8000-000000000024'::uuid,
    'text',
    'Perfeito. Tambem quero foco no quarto de hospedes e nas janelas da sala, porque vou receber visita.',
    timezone('utc', now()) - interval '12 hour 45 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000032'::uuid,
    '30000000-0000-4000-8000-000000000008'::uuid,
    '00000000-0000-4000-8000-000000000011'::uuid,
    'text',
    'Anotado. Montei um roteiro de atendimento com essa prioridade e te atualizo quando estiver a caminho.',
    timezone('utc', now()) - interval '35 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000033'::uuid,
    '30000000-0000-4000-8000-000000000009'::uuid,
    '00000000-0000-4000-8000-000000000022'::uuid,
    'text',
    'Queria uma escova mais alinhada para gravar videos da empresa. O horario confirmado continua valendo?',
    timezone('utc', now()) - interval '9 hour'
  ),
  (
    '31000000-0000-4000-8000-000000000034'::uuid,
    '30000000-0000-4000-8000-000000000009'::uuid,
    '00000000-0000-4000-8000-000000000013'::uuid,
    'text',
    'Continua sim. Posso fazer uma finalizacao com mais movimento ou uma linha mais polida, depende da imagem que voce quer passar.',
    timezone('utc', now()) - interval '8 hour 20 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000035'::uuid,
    '30000000-0000-4000-8000-000000000009'::uuid,
    '00000000-0000-4000-8000-000000000022'::uuid,
    'text',
    'Prefiro algo mais limpo e profissional. Depois te mando a paleta da marca para alinhar com o visual.',
    timezone('utc', now()) - interval '7 hour 35 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000036'::uuid,
    '30000000-0000-4000-8000-000000000009'::uuid,
    '00000000-0000-4000-8000-000000000013'::uuid,
    'text',
    'Perfeito. Ja deixei separado um acabamento mais natural e elegante para camera.',
    timezone('utc', now()) - interval '25 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000037'::uuid,
    '30000000-0000-4000-8000-000000000010'::uuid,
    '00000000-0000-4000-8000-000000000021'::uuid,
    'text',
    'Quero estruturar a marca da clinica e sair desta primeira reuniao com direcionamento claro de posicionamento.',
    timezone('utc', now()) - interval '22 hour'
  ),
  (
    '31000000-0000-4000-8000-000000000038'::uuid,
    '30000000-0000-4000-8000-000000000010'::uuid,
    '00000000-0000-4000-8000-000000000014'::uuid,
    'text',
    'Excelente. Vou entrar com benchmarking, referencias visuais e uma proposta de voz de marca para facilitar a decisao.',
    timezone('utc', now()) - interval '21 hour 10 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000039'::uuid,
    '30000000-0000-4000-8000-000000000010'::uuid,
    '00000000-0000-4000-8000-000000000021'::uuid,
    'text',
    'Perfeito. Minha principal duvida hoje e como comunicar mais premium sem parecer distante dos pacientes.',
    timezone('utc', now()) - interval '20 hour 15 minute'
  ),
  (
    '31000000-0000-4000-8000-000000000040'::uuid,
    '30000000-0000-4000-8000-000000000010'::uuid,
    '00000000-0000-4000-8000-000000000014'::uuid,
    'text',
    'Esse equilibrio da para construir bem. Vou te trazer caminhos de linguagem e identidade que mantenham proximidade e autoridade.',
    timezone('utc', now()) - interval '40 minute'
  )
on conflict (id) do update
set
  body = excluded.body,
  created_at = excluded.created_at;

do $$
begin
  if to_regclass('public.conversation_reads') is null then
    return;
  end if;

  delete from public.conversation_reads
  where conversation_id in (
    '30000000-0000-4000-8000-000000000001'::uuid,
    '30000000-0000-4000-8000-000000000002'::uuid,
    '30000000-0000-4000-8000-000000000003'::uuid,
    '30000000-0000-4000-8000-000000000004'::uuid,
    '30000000-0000-4000-8000-000000000005'::uuid,
    '30000000-0000-4000-8000-000000000006'::uuid,
    '30000000-0000-4000-8000-000000000007'::uuid,
    '30000000-0000-4000-8000-000000000008'::uuid,
    '30000000-0000-4000-8000-000000000009'::uuid,
    '30000000-0000-4000-8000-000000000010'::uuid
  );

  insert into public.conversation_reads (
    conversation_id,
    user_id,
    last_read_at,
    last_read_message_id
  )
  values
    (
      '30000000-0000-4000-8000-000000000001'::uuid,
      '00000000-0000-4000-8000-000000000022'::uuid,
      timezone('utc', now()) - interval '5 hour 50 minute',
      '31000000-0000-4000-8000-000000000003'::uuid
    ),
    (
      '30000000-0000-4000-8000-000000000001'::uuid,
      '00000000-0000-4000-8000-000000000012'::uuid,
      timezone('utc', now()) - interval '2 hour',
      '31000000-0000-4000-8000-000000000004'::uuid
    ),
    (
      '30000000-0000-4000-8000-000000000002'::uuid,
      '00000000-0000-4000-8000-000000000022'::uuid,
      timezone('utc', now()) - interval '18 hour 35 minute',
      '31000000-0000-4000-8000-000000000007'::uuid
    ),
    (
      '30000000-0000-4000-8000-000000000002'::uuid,
      '00000000-0000-4000-8000-000000000012'::uuid,
      timezone('utc', now()) - interval '90 minute',
      '31000000-0000-4000-8000-000000000008'::uuid
    ),
    (
      '30000000-0000-4000-8000-000000000003'::uuid,
      '00000000-0000-4000-8000-000000000023'::uuid,
      timezone('utc', now()) - interval '10 hour 50 minute',
      '31000000-0000-4000-8000-000000000011'::uuid
    ),
    (
      '30000000-0000-4000-8000-000000000003'::uuid,
      '00000000-0000-4000-8000-000000000013'::uuid,
      timezone('utc', now()) - interval '70 minute',
      '31000000-0000-4000-8000-000000000012'::uuid
    ),
    (
      '30000000-0000-4000-8000-000000000004'::uuid,
      '00000000-0000-4000-8000-000000000023'::uuid,
      timezone('utc', now()) - interval '14 hour 45 minute',
      '31000000-0000-4000-8000-000000000015'::uuid
    ),
    (
      '30000000-0000-4000-8000-000000000004'::uuid,
      '00000000-0000-4000-8000-000000000014'::uuid,
      timezone('utc', now()) - interval '50 minute',
      '31000000-0000-4000-8000-000000000016'::uuid
    ),
    (
      '30000000-0000-4000-8000-000000000005'::uuid,
      '00000000-0000-4000-8000-000000000021'::uuid,
      timezone('utc', now()) - interval '6 day 22 hour 30 minute',
      '31000000-0000-4000-8000-000000000019'::uuid
    ),
    (
      '30000000-0000-4000-8000-000000000005'::uuid,
      '00000000-0000-4000-8000-000000000011'::uuid,
      timezone('utc', now()) - interval '5 day',
      '31000000-0000-4000-8000-000000000020'::uuid
    ),
    (
      '30000000-0000-4000-8000-000000000006'::uuid,
      '00000000-0000-4000-8000-000000000024'::uuid,
      timezone('utc', now()) - interval '3 day 4 hour 50 minute',
      '31000000-0000-4000-8000-000000000023'::uuid
    ),
    (
      '30000000-0000-4000-8000-000000000006'::uuid,
      '00000000-0000-4000-8000-000000000012'::uuid,
      timezone('utc', now()) - interval '3 hour',
      '31000000-0000-4000-8000-000000000024'::uuid
    ),
    (
      '30000000-0000-4000-8000-000000000007'::uuid,
      '00000000-0000-4000-8000-000000000021'::uuid,
      timezone('utc', now()) - interval '1 day 7 hour',
      '31000000-0000-4000-8000-000000000027'::uuid
    ),
    (
      '30000000-0000-4000-8000-000000000007'::uuid,
      '00000000-0000-4000-8000-000000000013'::uuid,
      timezone('utc', now()) - interval '1 day',
      '31000000-0000-4000-8000-000000000028'::uuid
    ),
    (
      '30000000-0000-4000-8000-000000000008'::uuid,
      '00000000-0000-4000-8000-000000000024'::uuid,
      timezone('utc', now()) - interval '12 hour 45 minute',
      '31000000-0000-4000-8000-000000000031'::uuid
    ),
    (
      '30000000-0000-4000-8000-000000000008'::uuid,
      '00000000-0000-4000-8000-000000000011'::uuid,
      timezone('utc', now()) - interval '35 minute',
      '31000000-0000-4000-8000-000000000032'::uuid
    ),
    (
      '30000000-0000-4000-8000-000000000009'::uuid,
      '00000000-0000-4000-8000-000000000022'::uuid,
      timezone('utc', now()) - interval '7 hour 35 minute',
      '31000000-0000-4000-8000-000000000035'::uuid
    ),
    (
      '30000000-0000-4000-8000-000000000009'::uuid,
      '00000000-0000-4000-8000-000000000013'::uuid,
      timezone('utc', now()) - interval '25 minute',
      '31000000-0000-4000-8000-000000000036'::uuid
    ),
    (
      '30000000-0000-4000-8000-000000000010'::uuid,
      '00000000-0000-4000-8000-000000000021'::uuid,
      timezone('utc', now()) - interval '20 hour 15 minute',
      '31000000-0000-4000-8000-000000000039'::uuid
    ),
    (
      '30000000-0000-4000-8000-000000000010'::uuid,
      '00000000-0000-4000-8000-000000000014'::uuid,
      timezone('utc', now()) - interval '40 minute',
      '31000000-0000-4000-8000-000000000040'::uuid
    )
  on conflict (conversation_id, user_id) do update
  set
    last_read_at = excluded.last_read_at,
    last_read_message_id = excluded.last_read_message_id,
    updated_at = timezone('utc', now());
end $$;
