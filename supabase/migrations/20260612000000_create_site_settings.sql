create table if not exists public.site_settings (
  id text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

create policy "Public site settings are readable"
  on public.site_settings
  for select
  using (true);

create policy "Public low-risk site settings are writable"
  on public.site_settings
  for insert
  with check (id in ('chatbot_openrouter_model'));

create policy "Public low-risk site settings are updatable"
  on public.site_settings
  for update
  using (id in ('chatbot_openrouter_model'))
  with check (id in ('chatbot_openrouter_model'));

insert into public.site_settings (id, value)
values (
  'chatbot_openrouter_model',
  '{"modelId":"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free","modelLabel":"Nemotron 3 Nano Omni 30B"}'::jsonb
)
on conflict (id) do nothing;
