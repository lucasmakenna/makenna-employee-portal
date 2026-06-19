import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Self-serve signup for staff who need a portal login (manager / lead /
// trainer only — admin is reserved for owners, baristas don't get accounts).
// Creates the auth user (pre-confirmed, so they can sign in immediately)
// and the matching employee row in one step.
const ALLOWED_ROLES = new Set(['manager', 'lead', 'trainer']);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { firstName, lastName, email, phone, role, homeLocationId, hiredOn, password } = body ?? {};

  if (!firstName || !lastName || !email || !role || !homeLocationId || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (!ALLOWED_ROLES.has(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const { data: existing } = await supabaseAdmin
    .from('employees')
    .select('id')
    .ilike('email', normalizedEmail)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: 'An account with this email already exists. Use Sign In instead.' }, { status: 409 });
  }

  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
  });

  if (authError || !authUser?.user) {
    return NextResponse.json({ error: authError?.message ?? 'Could not create account' }, { status: 400 });
  }

  const employeeId = `emp-${Date.now()}`;
  const colors = ['#4FB8C9', '#C5293A', '#1F5FB6', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899', '#64748B'];
  const avatarColor = colors[Math.floor(Math.random() * colors.length)];

  const { error: empError } = await supabaseAdmin.from('employees').insert({
    id: employeeId,
    first_name: firstName,
    last_name: lastName,
    email: normalizedEmail,
    phone: phone ?? '',
    role,
    home_location_id: homeLocationId,
    additional_location_ids: [],
    hired_on: hiredOn || new Date().toISOString().slice(0, 10),
    certifications: [],
    training_progress_by_station: {},
    avatar_color: avatarColor,
    active: true,
    attachments: [],
    auth_user_id: authUser.user.id,
    updated_at: new Date().toISOString(),
  });

  if (empError) {
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
    return NextResponse.json({ error: empError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, employeeId });
}
