import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Public, read-only lookup by share token — no auth required. Only returns
// fields safe to show the employee themselves: no other employees' data,
// no admin actions, no write path.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('employees')
    .select('id, first_name, last_name, email, phone, role, home_location_id, hired_on, certifications, active')
    .eq('share_token', token)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { data: packetRow } = await supabaseAdmin
    .from('onboarding_packets')
    .select('tasks')
    .eq('employee_id', data.id)
    .single();

  return NextResponse.json({
    employee: {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      phone: data.phone ?? '',
      role: data.role,
      homeLocationId: data.home_location_id,
      hiredOn: data.hired_on,
      certifications: data.certifications ?? [],
      active: data.active,
    },
    tasks: (packetRow?.tasks as unknown[]) ?? [],
  });
}
