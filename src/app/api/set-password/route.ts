import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Find the user by email
  const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers();
  if (listError) return NextResponse.json({ error: listError.message }, { status: 400 });

  const user = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!user) return NextResponse.json({ error: 'No auth account found for this email. Use "Send portal invite" first.' }, { status: 404 });

  // Update their password directly
  const { error } = await adminClient.auth.admin.updateUserById(user.id, { password });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
