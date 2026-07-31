import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Tables the portal is allowed to read/write through this proxy.
// Any table not in this list is rejected.
const ALLOWED_TABLES = new Set([
  'candidates',
  'employees',
  'onboarding_packets',
  'conversations',
  'messages',
  'availability',
  'signature_audit_records',
  'training_progress',
  'training_notes',
  'study_overrides',
  'recipes_test_attempts',
]);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ data: null, error: { message: 'Invalid JSON' } }, { status: 400 });

  const { table, op, data, select = '*', eq: eqFilters, or: orFilter, order, single, onConflict, limit } = body as {
    table: string;
    op: 'select' | 'insert' | 'update' | 'upsert' | 'delete';
    data?: unknown;
    select?: string;
    eq?: [string, unknown][];
    or?: string;
    order?: { col: string; asc: boolean };
    single?: boolean;
    onConflict?: string;
    limit?: number;
  };

  if (!ALLOWED_TABLES.has(table)) {
    return NextResponse.json({ data: null, error: { message: `Table "${table}" not allowed` } }, { status: 403 });
  }

  try {
    let result: { data: unknown; error: { message: string } | null };

    if (op === 'select') {
      let q = supabaseAdmin.from(table).select(select);
      if (eqFilters) for (const [col, val] of eqFilters) q = (q as any).eq(col, val);
      if (orFilter) q = (q as any).or(orFilter);
      if (order) q = (q as any).order(order.col, { ascending: order.asc });
      if (limit) q = (q as any).limit(limit);
      if (single) q = (q as any).single();
      result = await q as any;

    } else if (op === 'insert') {
      result = await supabaseAdmin.from(table).insert(data as any) as any;

    } else if (op === 'update') {
      let q = supabaseAdmin.from(table).update(data as any);
      if (eqFilters) for (const [col, val] of eqFilters) q = (q as any).eq(col, val);
      result = await q as any;

    } else if (op === 'upsert') {
      const opts = onConflict ? { onConflict } : undefined;
      result = await supabaseAdmin.from(table).upsert(data as any, opts) as any;

    } else if (op === 'delete') {
      let q = supabaseAdmin.from(table).delete();
      if (eqFilters) for (const [col, val] of eqFilters) q = (q as any).eq(col, val);
      result = await q as any;

    } else {
      return NextResponse.json({ data: null, error: { message: `Unknown op: ${op}` } }, { status: 400 });
    }

    const { data: resData, error } = result as any;
    if (error) return NextResponse.json({ data: null, error: { message: error.message } });
    return NextResponse.json({ data: resData, error: null });

  } catch (e) {
    return NextResponse.json({ data: null, error: { message: String(e) } }, { status: 500 });
  }
}
