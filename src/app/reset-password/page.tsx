'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Listen for Supabase PASSWORD_RECOVERY event — fires when the user
    // lands on this page via the reset link in their email.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });

    // Also check if there's already a recovery session active
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) return;
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      // Sign out so they log in fresh with the new password
      await supabase.auth.signOut();
      setDone(true);
      setTimeout(() => router.replace('/login'), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const passwordValid = password.length >= 8 && password === confirm;

  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <img src="/logo.png" alt="Makenna Koffee Company" className="h-24 w-auto" />
        </div>

        <div className="card p-8 space-y-5">
          {done ? (
            <div className="text-center space-y-3">
              <CheckCircle2 size={40} className="mx-auto text-emerald-500" />
              <h1 className="text-xl font-bold text-ink-700">Password updated!</h1>
              <p className="text-sm text-ink-500">Redirecting you to sign in…</p>
            </div>
          ) : !ready ? (
            <div className="text-center space-y-3">
              <p className="text-sm text-ink-500">Verifying reset link…</p>
              <p className="text-xs text-ink-400">
                If nothing happens,{' '}
                <a href="/forgot-password" className="text-cyan-500 hover:underline">
                  request a new reset link
                </a>.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-ink-700 text-center">Set a new password</h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">New password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      className="input w-full pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      autoFocus
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
                <div>
                  <label className="label">Confirm password</label>
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="input w-full"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                  />
                  {confirm && password !== confirm && (
                    <p className="mt-1 text-xs text-hibiscus-500">Passwords don't match.</p>
                  )}
                </div>
                {error && (
                  <p className="text-sm text-hibiscus-600 bg-hibiscus-50 rounded-lg px-3 py-2">{error}</p>
                )}
                <button
                  type="submit"
                  className="btn-cyan w-full"
                  disabled={!passwordValid || loading}
                >
                  {loading ? 'Updating…' : 'Update password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
