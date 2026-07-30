/**
 * Client-side DB helper. All requests go through /api/db which uses the
 * service role key server-side — the anon key (visible in the browser) never
 * touches Supabase directly, so RLS can safely block direct anon access.
 */

export type DbOp = 'select' | 'insert' | 'update' | 'upsert' | 'delete';

export interface DbOptions {
  data?: unknown;
  select?: string;
  eq?: [string, unknown][];
  or?: string;
  order?: { col: string; asc: boolean };
  single?: boolean;
  onConflict?: string;
  limit?: number;
}

export interface DbResult<T = any> {
  data: T | null;
  error: { message: string } | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function dbCall<T = any>(
  table: string,
  op: DbOp,
  opts: DbOptions = {},
): Promise<DbResult<T>> {
  try {
    const res = await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table, op, ...opts }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { data: null, error: { message: text } };
    }
    return res.json();
  } catch (e) {
    return { data: null, error: { message: String(e) } };
  }
}
