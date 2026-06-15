'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  GraduationCap,
  MapPin,
  Bell,
  LogOut,
  Flower,
  MessageSquare,
  Calendar,
  FlaskConical,
  PartyPopper,
  ShieldAlert,
  BookOpen,
  Lock,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import clsx from 'clsx';
import { useCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import Avatar from './Avatar';
import { fullName } from '@/data/employees';
import { getLocation } from '@/data/locations';
import { BRAND } from '@/lib/brand';
import { ROLE_LABELS } from '@/types';

// Messages, Availability, and Hiring are hidden for now — this app is
// training-only until that rollout phase begins. Onboarding is still
// needed by admins/managers/trainers to review docs, but is hidden for
// baristas (who use the /activate flow for their own docs, not this list).
const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/onboarding', icon: ClipboardCheck, label: 'Onboarding', hideForBarista: true },
  { href: '/training', icon: GraduationCap, label: 'Training' },
  { href: '/recipe-fill', icon: FlaskConical, label: 'Barista Test' },
  { href: '/study', icon: BookOpen, label: 'Study Mode' },
  { href: '/team', icon: Users, label: 'Team' },
  { href: '/milestones', icon: PartyPopper, label: 'Milestones' },
  { href: '/accountability', icon: ShieldAlert, label: 'Accountability' },
  { href: '/locations', icon: MapPin, label: 'Locations' },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useCurrentUser();
  const loc = user ? getLocation(user.homeLocationId) : null;

  return (
    <div className="flex min-h-screen bg-page">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-100 bg-white md:flex">
        <div className="flex h-24 items-center gap-3 border-b border-ink-100 px-4">
          <img
            src="/logo.png"
            srcSet="/logo.png 1x, /logo@2x.png 2x"
            alt="Makenna Koffee Company"
            className="h-12 w-auto"
          />
          <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-royal-400">
            Team Portal
          </div>
        </div>
        {/* Tri-stripe — the site's signature horizontal accent */}
        <div className="tri-stripe" />
        <nav className="flex-1 p-3">
          {NAV.filter((item) => !(item.hideForBarista && user?.role === 'barista')).map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'mb-1 flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium transition',
                  active
                    ? 'bg-cyan-400 text-white shadow-soft'
                    : 'text-ink-700 hover:bg-cyan-50',
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-ink-100 p-3 space-y-2">
          {user && (
            <div className="flex items-center gap-3 rounded-lg p-2">
              <Avatar employee={user} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-semibold text-ink-700">
                  {fullName(user)}
                </div>
                <div className="truncate text-[11px] uppercase tracking-wider text-ink-400">
                  {ROLE_LABELS[user.role]} · {loc?.name}
                </div>
              </div>
              <button
                onClick={() => {
                  signOut();
                  router.push('/login');
                }}
                title="Sign out"
                className="rounded p-1 text-ink-400 hover:bg-cyan-50 hover:text-ink-700"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-ink-100 bg-white px-4 md:px-6">
          <div className="md:hidden flex items-center gap-2">
            <img src="/logo.png" alt="Makenna Koffee" className="h-7 w-auto" />
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-ink-400">
            {pathname.split('/').filter(Boolean).map((seg, i, arr) => (
              <span key={i} className="flex items-center gap-2">
                <span className={clsx(i === arr.length - 1 && 'font-semibold text-ink-700')}>
                  {seg.charAt(0).toUpperCase() + seg.slice(1)}
                </span>
                {i < arr.length - 1 && <span>/</span>}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-full p-2 text-ink-400 hover:bg-cyan-50">
              <Bell size={18} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-hibiscus-400" />
            </button>
            {user && (
              <ProfileMenu user={user} signOut={() => { signOut(); router.replace('/login'); }} />
            )}
          </div>
        </header>

        {/* Mobile nav strip */}
        <nav className="flex overflow-x-auto border-b border-ink-100 bg-white px-2 py-2 md:hidden">
          {NAV.filter((item) => !(item.hideForBarista && user?.role === 'barista')).map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'mr-1 flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold',
                  active ? 'bg-cyan-400 text-white' : 'text-ink-700',
                )}
              >
                <item.icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        {/* Tri-stripe under the top bar (mobile + desktop main area) */}
        <div className="tri-stripe md:block" />

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

function ProfileMenu({ user, signOut }: { user: import('@/types').Employee; signOut: () => void }) {
  const [open, setOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full p-1 hover:bg-cyan-50"
      >
        <Avatar employee={user} size="sm" />
        <span className="hidden md:inline text-sm font-medium text-ink-700">{user.firstName}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-ink-100 bg-white shadow-lg py-1">
            <div className="px-4 py-2 border-b border-ink-100">
              <p className="text-sm font-semibold text-ink-700">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-ink-400 truncate">{user.email}</p>
            </div>
            <button
              onClick={() => { setOpen(false); setShowPasswordModal(true); }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-ink-700 hover:bg-cyan-50"
            >
              <Lock size={14} />
              Change password
            </button>
            <button
              onClick={() => { setOpen(false); signOut(); }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-hibiscus-600 hover:bg-hibiscus-50"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </>
      )}

      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
    </div>
  );
}

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const valid = password.length >= 8 && password === confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h2 className="text-lg font-bold text-ink-700">Change password</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-ink-100">
            <X size={18} className="text-ink-400" />
          </button>
        </div>
        <div className="p-6">
          {done ? (
            <div className="text-center space-y-3">
              <p className="text-sm text-ink-600">Your password has been updated.</p>
              <button onClick={onClose} className="btn-cyan w-full">Done</button>
            </div>
          ) : (
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
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" className="btn-cyan flex-1" disabled={!valid || loading}>
                  {loading ? 'Updating…' : 'Update password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
