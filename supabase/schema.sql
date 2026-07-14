-- ProposalStudio — schéma Supabase
-- À exécuter dans le SQL Editor de votre projet Supabase (base « proposalstudio »).

create extension if not exists pgcrypto;

-- ─── Table des offres ───
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  client text not null default '',
  secteur text not null default '',
  project text not null default '',
  date_label text not null default '',
  amount numeric not null default 0,
  status text not null default 'brouillon'
    check (status in ('brouillon', 'envoyee', 'consultee', 'signee', 'refusee', 'expiree')),
  payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Table des templates ───
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  block_ids jsonb not null default '[]',
  used integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Sécurité (RLS) ───
-- L'app est mono-utilisateur et sans authentification : la clé « anon » a
-- accès complet. Si un jour vous ajoutez l'authentification Supabase,
-- remplacez ces politiques par des politiques par utilisateur.
alter table public.offers enable row level security;
alter table public.templates enable row level security;

drop policy if exists "offers_full_access" on public.offers;
create policy "offers_full_access" on public.offers
  for all using (true) with check (true);

drop policy if exists "templates_full_access" on public.templates;
create policy "templates_full_access" on public.templates
  for all using (true) with check (true);

-- ─── Données de démarrage ───
insert into public.offers (client, secteur, project, date_label, amount, status, created_at) values
  ('Fonderie Delcourt',    'Métallurgie',            'Refonte de la supervision d''atelier — audit UX & discovery', '08 · 07 · 26', 15750, 'envoyee',   '2026-07-08'),
  ('Mécanique Roussel',    'Machines & équipements', 'Discovery application de maintenance préventive',             '02 · 07 · 26', 22400, 'consultee', '2026-07-02'),
  ('Papeteries du Rhône',  'Process industriel',     'Audit UX du portail fournisseurs',                             '28 · 06 · 26',  9900, 'brouillon', '2026-06-28'),
  ('Robinetterie Chambon', 'Métallurgie',            'Accompagnement IA — assistant de gamme',                       '15 · 06 · 26', 28800, 'signee',    '2026-06-15'),
  ('Textiles Berthelot',   'Textile technique',      'Refonte de l''outil de planification',                         '04 · 06 · 26', 18200, 'refusee',   '2026-06-04'),
  ('Aciers Chastagnier',   'Sidérurgie',             'Discovery portail qualité',                                    '12 · 05 · 26', 12600, 'expiree',   '2026-05-12');

insert into public.templates (name, block_ids, used, updated_at) values
  ('Mission audit UX',    '["garde","contexte","objectifs","approche","devis","conditions","signature"]', 12, now() - interval '3 days'),
  ('Discovery complète',  '["garde","profil","contexte","problematique","objectifs","calculateur","approche","devis","conditions","signature"]', 8, now() - interval '1 week'),
  ('Accompagnement IA',   '["garde","profil","contexte","benefices","approche","devis","conditions","signature"]', 5, now() - interval '2 weeks'),
  ('Mission sur-mesure',  '["garde","devis","conditions","signature"]', 3, now() - interval '1 month');
