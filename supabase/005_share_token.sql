-- ============================================================
-- Makenna Koffee — Employee File share links
-- Run this in the Supabase SQL Editor
-- ============================================================

alter table employees add column if not exists share_token uuid;

create unique index if not exists employees_share_token_idx
  on employees (share_token)
  where share_token is not null;
