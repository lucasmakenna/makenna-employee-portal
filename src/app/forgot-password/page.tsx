'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Coffee } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo },
      );
      if (error) throw error;
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <img src="/logo.png" alt="Makenna Koffee Company" className="h-24 w-auto" />
        </div>

        <div className="card p-8 space-y-5">
          {sent ? (
            <div className="text-center space-y-3">
              <Coffee size={32} className="mx-auto text-cyan-400" />
              <h1 className="text-xl font-bold text-ink-700">Check your email</h1>
              <p className="text-sm text-ink-500">
                We sent a password reset link to <strong>{email}</strong>. Check your inbox and click the link to set a new password.
              </p>
              <Link href="/login" className="block text-sm text-cyan-500 hover:underline">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-ink-700 text-center">Reset your password</h1>
              <p className="text-sm text-ink-500 text-center">
                Enter your work email and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  />
                </div>
                {error && (
                  <p className="text-sm text-hibiscus-600 bg-hibiscus-50 rounded-lg px-3 py-2">{error}</p>
                )}
                <button type="submit" className="btn-cyan w-full" disabled={loading || !email}>
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
              <Link href="/login" className="block text-center text-sm text-ink-400 hover:text-ink-700">
                Back to sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
