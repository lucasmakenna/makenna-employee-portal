import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, name } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json({ error: 'Server not configured for invites' }, { status: 500 });
  }

  // Use service role client — required for admin.inviteUserByEmail
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? supabaseUrl;
  const redirectTo = `${siteUrl}/reset-password`;

  const { error } = await adminClient.auth.admin.inviteUserByEmail(email, {
    redirectTo,
    data: { full_name: name ?? '' },
  });

  if (error) {
    // "User already registered" is not really an error — just re-send
    if (error.message?.includes('already been registered')) {
      // Fall back to a password reset email instead
      const { error: resetError } = await adminClient.auth.admin.generateLink({
        type: 'recovery',
        email,
        options: { redirectTo },
      });
      if (resetError) {
        return NextResponse.json({ error: resetError.message }, { status: 400 });
      }
      return NextResponse.json({ resent: true });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
