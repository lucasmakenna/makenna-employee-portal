'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, UserPlus, X } from 'lucide-react';
import AppShell from '@/components/AppShell';
import Avatar from '@/components/Avatar';
import { useCurrentUser } from '@/lib/auth';
import { fullName } from '@/data/employees';
import { LOCATIONS, getLocation } from '@/data/locations';
import { ROLES, ROLE_LABELS } from '@/types';
import { useEmployees } from '@/data/store';
import type { Employee } from '@/types';

const AVATAR_COLORS = [
  '#4FB8C9', '#C5293A', '#1F5FB6', '#F59E0B', '#10B981',
  '#8B5CF6', '#EC4899', '#64748B',
];

export default function TeamPage() {
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const { employees, add } = useEmployees();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>('all');
  const [loc, setLoc] = useState<string>('all');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  if (!user) return null;

  const canManage = user.role === 'admin' || user.role === 'manager';

  const filtered = employees.filter((e) => {
    if (role !== 'all' && e.role !== role) return false;
    if (loc !== 'all' && e.homeLocationId !== loc) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.firstName.toLowerCase().includes(q) ||
      e.lastName.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q)
    );
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink-700">Team</h1>
            <p className="mt-1 text-sm text-ink-400">
              {filtered.length} of {employees.length} team members
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="input pl-9 w-56"
              />
            </div>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="input w-36">
              <option value="all">All roles</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
            <select value={loc} onChange={(e) => setLoc(e.target.value)} className="input w-44">
              <option value="all">All locations</option>
              {LOCATIONS.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
            {canManage && (
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500 transition"
              >
                <UserPlus size={15} /> Add Employee
              </button>
            )}
          </div>
        </div>

        {employees.length === 0 ? (
          <div className="card p-12 text-center text-ink-400">
            <UserPlus size={32} className="mx-auto mb-3 text-ink-200" />
            <p className="font-semibold text-ink-600">No employees yet</p>
            <p className="mt-1 text-sm">Click "Add Employee" to add your first team member.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <Link
                key={e.id}
                href={`/team/${e.id}`}
                className="card flex items-center gap-4 p-4 transition hover:shadow-card"
              >
                <Avatar employee={e} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold text-ink-700">{fullName(e)}</div>
                  <div className="truncate text-xs text-ink-400">
                    {ROLE_LABELS[e.role]} · {getLocation(e.homeLocationId)?.name}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {e.certifications.map((c) => {
                      const days = Math.round(
                        (new Date(c.expiresOn).getTime() - Date.now()) / 86400000,
                      );
                      return (
                        <span
                          key={c.id}
                          className={`pill text-[10px] ${
                            days < 0
                              ? 'bg-red-100 text-red-800'
                              : days < 30
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-cyan-50 text-ink-700'
                          }`}
                        >
                          {c.name.split(' ')[0]} {days < 0 ? 'Expired' : `${days}d`}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <AddEmployeeModal
          onClose={() => setShowAdd(false)}
          onAdd={(emp) => { add(emp); setShowAdd(false); }}
        />
      )}
    </AppShell>
  );
}

function AddEmployeeModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (emp: Employee) => void;
}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Employee['role']>('barista');
  const [locationId, setLocationId] = useState<Employee['homeLocationId']>(LOCATIONS[0].id as Employee['homeLocationId']);
  const [hiredOn, setHiredOn] = useState(new Date().toISOString().slice(0, 10));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const emp: Employee = {
      id: `emp-${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role,
      homeLocationId: locationId as Employee['homeLocationId'],
      hiredOn,
      certifications: [],
      trainingProgressByStation: {},
      avatarColor: color,
      active: true,
    };
    onAdd(emp);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h2 className="text-lg font-bold text-ink-700">Add Employee</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-ink-100">
            <X size={18} className="text-ink-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              <select className="input w-full" value={role} onChange={(e) => setRole(e.target.value as Employee['role'])}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Location</label>
              <select className="input w-full" value={locationId} onChange={(e) => setLocationId(e.target.value as Employee['homeLocationId'])}>
                {LOCATIONS.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Hire date</label>
            <input type="date" className="input w-full" value={hiredOn} onChange={(e) => setHiredOn(e.target.value)} required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" className="btn-cyan flex-1" disabled={!firstName || !lastName || !email}>
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
