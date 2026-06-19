import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Generates (or returns the existing) share token for an employee's
// read-only file link. Called by a manager/admin from the Team page.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ employeeId: string }> }) {
  const { employeeId } = await params;

  const { data: existing } = await supabaseAdmin
    .from('employees')
    .select('share_token')
    .eq('id', employeeId)
    .single();

  if (existing?.share_token) {
    return NextResponse.json({ shareToken: existing.share_token });
  }

  const shareToken = randomUUID();
  const { error } = await supabaseAdmin
    .from('employees')
    .update({ share_token: shareToken })
    .eq('id', employeeId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ shareToken });
}
