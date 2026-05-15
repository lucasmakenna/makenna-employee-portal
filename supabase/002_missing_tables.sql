-- ============================================================
-- Makenna Koffee — Missing Tables
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ── onboarding_packets ───────────────────────────────────────
create table if not exists onboarding_packets (
  employee_id           text primary key,
  start_date            text not null,
  trainer_employee_id   text,
  tasks                 jsonb not null default '[]',
  manager_sign_off      jsonb,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);
alter table onboarding_packets disable row level security;

-- ── signature_audit_records ──────────────────────────────────
create table if not exists signature_audit_records (
  id                        text primary key,
  context                   jsonb not null,
  signer_employee_id        text not null,
  signer_legal_name         text not null,
  signed_at_iso             timestamptz not null,
  server_stamped            boolean not null default false,
  ip_address                text,
  fingerprint               jsonb,
  document_hash             text not null,
  document_title            text not null,
  document_bytes            integer,
  signature_image_png       text,
  consent_acknowledged      boolean not null default false,
  prior_record_id           text,
  prior_record_hash         text,
  created_at                timestamptz default now()
);
create index if not exists sig_records_employee_idx on signature_audit_records(signer_employee_id);
alter table signature_audit_records disable row level security;

-- ── recipes_test_attempts ─────────────────────────────────────
create table if not exists recipes_test_attempts (
  id              text primary key,
  employee_id     text not null,
  question_ids    jsonb not null default '[]',
  answers         jsonb not null default '{}',
  started_at      timestamptz not null default now(),
  completed_at    timestamptz,
  score           integer,
  passed          boolean
);
create index if not exists recipes_test_employee_idx on recipes_test_attempts(employee_id);
alter table recipes_test_attempts disable row level security;
