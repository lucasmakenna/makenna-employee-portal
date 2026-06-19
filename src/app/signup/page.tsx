'use client';

import { useState } from 'react';
import { Eye, EyeOff, Coffee } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { LOCATIONS } from '@/data/locations';
import { ROLE_LABELS } from '@/types';
import type { Role, LocationId } from '@/types';

const SIGNUP_ROLES: Role[] = ['manager', 'lead', 'trainer'];

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('trainer');
  const [homeLocationId, setHomeLocationId] = useState<LocationId>(LOCATIONS[0].id as LocationId);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const valid = firstName && lastName && email && password.length >= 8 && password === confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          role,
          homeLocationId,
          password,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Could not create account');

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (signInError) throw signInError;

      window.location.href = '/dashboard';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  }

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

        <form onSubmit={handleSubmit} className="card p-8 space-y-4">
          <h1 className="text-xl font-bold text-ink-700 text-center">Create your account</h1>
          <p className="text-center text-xs text-ink-400">
            For managers, shift leads, and trainers. Baristas don't need an account — ask your manager for your employee file link.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">First name</label>
              <input className="input w-full" value={firstName} onChange={(e) => setFirstName(e.target.value)} required autoFocus />
            </div>
            <div>
              <label className="label">Last name</label>
              <input className="input w-full" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="label">Work email</label>
            <input type="email" className="input w-full" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="label">Phone</label>
            <input type="tel" className="input w-full" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(805) 555-0100" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Role</label>
              <select className="input w-full" value={role} onChange={(e) => setRole(e.target.value as Role)}>
                {SIGNUP_ROLES.map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Location</label>
              <select className="input w-full" value={homeLocationId} onChange={(e) => setHomeLocationId(e.target.value as LocationId)}>
                {LOCATIONS.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                className="input w-full pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
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
              required
            />
            {confirm && password !== confirm && (
              <p className="mt-1 text-xs text-hibiscus-500">Passwords don't match.</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-hibiscus-600 bg-hibiscus-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button type="submit" className="btn-cyan w-full" disabled={!valid || loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Coffee size={15} className="animate-pulse" /> Creating account…
              </span>
            ) : (
              'Create account'
            )}
          </button>

          <p className="text-center text-xs text-ink-400">
            Already have an account? <a href="/login" className="text-cyan-500 hover:underline">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
}
