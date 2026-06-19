'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Coffee } from 'lucide-react';
import { useCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const { user, loaded } = useCurrentUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loaded && user) router.replace('/dashboard');
  }, [loaded, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });
      if (error) throw error;

      const { data: emp } = await supabase
        .from('employees')
        .select('role')
        .ilike('email', normalizedEmail)
        .single();

      if (emp?.role === 'barista') {
        await supabase.auth.signOut();
        throw new Error('Baristas don’t have portal logins. Ask your manager for your employee file link.');
      }

      window.location.href = '/dashboard';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid email or password';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-6">
      <div className="w-full max-w-sm">
        <div className="tri-stripe rounded-full mb-6" />

        <div className="mb-8 flex flex-col items-center gap-3">
          <img
            src="/logo.png"
            srcSet="/logo.png 1x, /logo@2x.png 2x"
            alt="Makenna Koffee Company"
            className="h-24 w-auto"
          />
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-royal-400">
            Team Portal
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-5">
          <h1 className="text-xl font-bold text-ink-700 text-center">Sign In</h1>

          <div>
            <label className="label">Work Email</label>
            <input
              type="email"
              className="input w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@makennakoffee.com"
              required
              autoFocus
              autoComplete="email"
            />
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                className="input w-full pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                onClick={() => setShowPw((v) => !v)}
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-hibiscus-600 bg-hibiscus-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-cyan w-full"
            disabled={loading || !email || !password}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Coffee size={15} className="animate-pulse" /> Signing in…
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="flex flex-col items-center gap-1">
            <a href="/forgot-password" className="text-xs text-cyan-500 hover:underline">
              Forgot your password?
            </a>
            <p className="text-center text-xs text-ink-400">
              New employee? Open the link from your welcome email to set up your account.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
