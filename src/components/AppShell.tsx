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
  BookOpen,
} from 'lucide-react';
import clsx from 'clsx';
import { useCurrentUser } from '@/lib/auth';
import Avatar from './Avatar';
import ResetDemoButton from './ResetDemoButton';
import { fullName } from '@/data/employees';
import { getLocation } from '@/data/locations';
import { BRAND } from '@/lib/brand';
import { ROLE_LABELS } from '@/types';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/availability', icon: Calendar, label: 'Availability' },
  { href: '/hiring', icon: Users, label: 'Hiring' },
  { href: '/onboarding', icon: ClipboardCheck, label: 'Onboarding' },
  { href: '/training', icon: GraduationCap, label: 'Training' },
  { href: '/recipes-test', icon: BookOpen, label: 'Barista Test' },
  { href: '/team', icon: Users, label: 'Team' },
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
          {NAV.map((item) => {
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
          {user?.role === 'admin' && <ResetDemoButton />}
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
          {NAV.map((item) => {
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
              onClick={() => { setOpen(false); signOut(); }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-hibiscus-600 hover:bg-hibiscus-50"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
