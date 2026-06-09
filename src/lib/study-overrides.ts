/**
 * Study card overrides — persisted in Supabase so all devices see admin changes.
 * Falls back to localStorage if Supabase is unavailable.
 *
 * Supabase: requires a `study_overrides` table with columns:
 *   id         text PRIMARY KEY  (always 'singleton')
 *   hidden     jsonb             (array of card IDs)
 *   categories jsonb             (object: cardId → new category string)
 *   updated_at timestamptz
 *
 * SQL to create:
 *   create table study_overrides (
 *     id text primary key default 'singleton',
 *     hidden jsonb not null default '[]',
 *     categories jsonb not null default '{}',
 *     updated_at timestamptz not null default now()
 *   );
 *   alter table study_overrides enable row level security;
 *   create policy "allow_all" on study_overrides for all using (true) with check (true);
 */

import { supabase } from '@/lib/supabase';

const LOCAL_KEY = 'mk-study-overrides-v1';
const ROW_ID = 'singleton';

export interface StudyOverrides {
  /** Card IDs that are hidden from the study deck entirely */
  hidden: string[];
  /** Card ID → new category string (reclassification) */
  categories: Record<string, string>;
}

const EMPTY: StudyOverrides = { hidden: [], categories: {} };

function readLocal(): StudyOverrides {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : EMPTY;
  } catch { return EMPTY; }
}

function writeLocal(o: StudyOverrides) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(o)); } catch {}
}

/** Fetch overrides — tries Supabase, falls back to localStorage */
export async function fetchOverrides(): Promise<StudyOverrides> {
  try {
    const { data, error } = await supabase
      .from('study_overrides')
      .select('hidden, categories')
      .eq('id', ROW_ID)
      .single();
    if (!error && data) {
      const o: StudyOverrides = {
        hidden: Array.isArray(data.hidden) ? data.hidden : [],
        categories: (data.categories && typeof data.categories === 'object') ? data.categories as Record<string,string> : {},
      };
      writeLocal(o); // keep local in sync
      return o;
    }
  } catch {}
  return readLocal();
}

/** Save overrides — tries Supabase, always writes localStorage too */
export async function saveOverrides(o: StudyOverrides): Promise<void> {
  writeLocal(o);
  try {
    await supabase
      .from('study_overrides')
      .upsert({ id: ROW_ID, hidden: o.hidden, categories: o.categories, updated_at: new Date().toISOString() });
  } catch {}
}

/** Apply overrides to a card array (hide removed, remap categories) */
export function applyOverrides<T extends { id: string; category: string }>(
  cards: T[],
  overrides: StudyOverrides,
): T[] {
  const hiddenSet = new Set(overrides.hidden);
  return cards
    .filter((c) => !hiddenSet.has(c.id))
    .map((c) =>
      overrides.categories[c.id]
        ? { ...c, category: overrides.categories[c.id] }
        : c,
    );
}
