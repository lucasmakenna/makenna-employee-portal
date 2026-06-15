-- ============================================================
-- Makenna Koffee — Employee File Attachments
-- Run this in the Supabase SQL Editor
-- ============================================================

alter table employees add column if not exists attachments jsonb default '[]'::jsonb;

-- Pre-existing gap: the app has been writing additionalLocationIds since the
-- "+ location" feature shipped, but this column was never added — every
-- employee update has been silently failing to sync until now.
alter table employees add column if not exists additional_location_ids jsonb default '[]'::jsonb;
