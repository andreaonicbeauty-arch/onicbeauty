# ONIC Beauty Backoffice

Mobile-first admin app for ONIC Beauty.

## Stack

- Next.js App Router
- Supabase
- TypeScript
- Custom CSS, no UI framework required

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Add the Supabase publishable/anon key.
3. Install dependencies:

```bash
npm install
npm run dev
```

## Supabase tables proposal

```sql
create table clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  notes text,
  created_at timestamptz default now()
);

create table treatments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  duration_minutes integer not null default 60,
  price numeric(10, 2) not null default 0,
  active boolean not null default true,
  created_at timestamptz default now()
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  treatment_id uuid references treatments(id),
  starts_at timestamptz not null,
  status text not null default 'scheduled',
  notes text,
  created_at timestamptz default now()
);

create table visit_history (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  treatment_id uuid references treatments(id),
  visit_date date not null,
  result_notes text,
  next_recommendation text,
  created_at timestamptz default now()
);
```

Enable Row Level Security before production and create policies for authenticated staff users only.
