-- ============================================================
-- Makenna Koffee Employee Portal — Supabase Schema
-- Run this in the Supabase SQL Editor (dashboard.supabase.com)
-- ============================================================

-- Enable UUID extension (may already be enabled)
create extension if not exists "pgcrypto";

-- ── candidates ──────────────────────────────────────────────
create table if not exists candidates (
  id                      text primary key,
  first_name              text not null,
  last_name               text not null,
  email                   text,
  phone                   text,
  applied_for             text not null,
  applied_to_location_id  text not null,
  applied_on              timestamptz not null,
  stage                   text not null default 'applied',
  source                  text not null,
  resume_url              text,
  notes                   jsonb not null default '[]',
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

-- ── employees ────────────────────────────────────────────────
create table if not exists employees (
  id                              text primary key,
  first_name                      text not null,
  last_name                       text not null,
  email                           text not null unique,
  phone                           text,
  role                            text not null,
  home_location_id                text not null,
  hired_on                        text not null,
  birthday                        text,
  certifications                  jsonb not null default '[]',
  training_progress_by_station    jsonb not null default '{}',
  avatar_color                    text not null default '#4FB8C9',
  active                          boolean not null default true,
  auth_user_id                    uuid references auth.users(id),
  created_at                      timestamptz default now(),
  updated_at                      timestamptz default now()
);

-- ── conversations ────────────────────────────────────────────
create table if not exists conversations (
  id                  text primary key,
  type                text not null,
  name                text not null,
  location_id         text,
  participant_ids     text[] not null default '{}',
  shift_date          text,
  shift_start_time    text,
  shift_end_time      text,
  shift_location_id   text,
  shift_covered       boolean,
  shift_covered_by_id text,
  created_by          text not null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz default now()
);

-- ── messages ─────────────────────────────────────────────────
create table if not exists messages (
  id              text primary key,
  conversation_id text not null references conversations(id) on delete cascade,
  author_id       text not null,
  author_name     text not null,
  body            text not null,
  announcement    boolean,
  pinned          boolean,
  read_by         text[] not null default '{}',
  created_at      timestamptz not null default now()
);

-- ── availability ─────────────────────────────────────────────
create table if not exists availability (
  employee_id           text primary key,
  weekly                jsonb not null default '{}',
  preferred_min_hours   int not null default 0,
  preferred_max_hours   int not null default 40,
  notes                 text,
  updated_at            timestamptz default now()
);

-- ── Row Level Security ───────────────────────────────────────
-- Keeping disabled for now — the app enforces its own permission
-- layer via src/data/permissions.ts. Enable per-table RLS once
-- Supabase Auth is fully wired and you're ready for production.

alter table candidates        disable row level security;
alter table employees         disable row level security;
alter table conversations     disable row level security;
alter table messages          disable row level security;
alter table availability      disable row level security;

-- ── Indexes ──────────────────────────────────────────────────
create index if not exists messages_conversation_id_idx on messages(conversation_id);
create index if not exists messages_created_at_idx on messages(created_at);
create index if not exists employees_email_idx on employees(email);
