'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Megaphone,
  MapPin,
  MessageSquare,
  HandHelping,
  Send,
  Users,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import Avatar from '@/components/Avatar';
import { useCurrentUser } from '@/lib/auth';
import { useConversations, useMessages, useEmployees } from '@/data/store';
import { fullName } from '@/data/employees';
import { LOCATIONS, getLocation } from '@/data/locations';
import { can } from '@/data/permissions';
import type { LocationId } from '@/types';

type Mode = 'announcement' | 'location' | 'dm' | 'shift_cover';

export default function NewMessagePage() {
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const { conversations, create } = useConversations();
  const { send } = useMessages();
  const { employees } = useEmployees();

  const [mode, setMode] = useState<Mode>('location');
  const [body, setBody] = useState('');
  const [recipientId, setRecipientId] = useState<string>('');
  const [locationId, setLocationId] = useState<LocationId>(
    user?.homeLocationId ?? LOCATIONS[0].id,
  );
  // Shift cover fields
  const [shiftDate, setShiftDate] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  );
  const [shiftStart, setShiftStart] = useState('07:00');
  const [shiftEnd, setShiftEnd] = useState('15:00');

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  if (!user) return null;

  const canAnnounce = can(user.role, 'comms.post_announcement');

  const handleSend = () => {
    if (!body.trim()) return;
    let convId: string;

    if (mode === 'announcement') {
      convId = 'conv:all-hands';
      send({
        conversationId: convId,
        authorId: user.id,
        authorName: fullName(user),
        body: body.trim(),
        announcement: true,
      });
    } else if (mode === 'location') {
      convId = `conv:loc:${locationId}`;
      // Use existing channel if it exists, otherwise create
      if (!conversations.find((c) => c.id === convId)) {
        create({
          type: 'location_channel',
          name: `${getLocation(locationId)?.name} Team`,
          locationId,
          participantIds: [],
          createdBy: user.id,
        });
      }
      send({
        conversationId: convId,
        authorId: user.id,
        authorName: fullName(user),
        body: body.trim(),
        announcement: canAnnounce,
      });
    } else if (mode === 'dm') {
      if (!recipientId) return;
      // Stable id so the same DM thread is always reused
      const ids = [user.id, recipientId].sort();
      convId = `conv:dm:${ids[0]}:${ids[1]}`;
      const recipient = employees.find((e) => e.id === recipientId);
      if (!conversations.find((c) => c.id === convId)) {
        create({
          type: 'dm',
          name: recipient ? `${fullName(user)} & ${fullName(recipient)}` : 'Direct message',
          participantIds: ids,
          createdBy: user.id,
        });
      }
      send({
        conversationId: convId,
        authorId: user.id,
        authorName: fullName(user),
        body: body.trim(),
      });
    } else {
      // shift_cover — always a new conversation
      const conv = create({
        type: 'shift_cover',
        name: `Cover needed: ${shiftStart}–${shiftEnd} ${getLocation(user.homeLocationId)?.name}`,
        participantIds: [user.id],
        shiftDate,
        shiftStartTime: shiftStart,
        shiftEndTime: shiftEnd,
        shiftLocationId: user.homeLocationId,
        shiftCovered: false,
        createdBy: user.id,
      });
      convId = conv.id;
      send({
        conversationId: convId,
        authorId: user.id,
        authorName: fullName(user),
        body: body.trim(),
      });
    }

    router.push(`/messages?c=${encodeURIComponent(convId)}`);
  };

  const teammates = employees.filter((e) => e.id !== user.id && e.active);

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <Link
          href="/messages"
          className="mb-4 inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700"
        >
          <ArrowLeft size={16} /> Back to messages
        </Link>

        <div className="card p-6">
          <h1 className="text-2xl font-bold text-ink-700">New message</h1>
          <p className="mt-1 text-sm text-ink-400">Pick who you want to reach.</p>

          {/* Mode picker */}
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <ModeBtn
              icon={<MapPin size={16} />}
              label="A specific location"
              hint="Everyone at one store"
              active={mode === 'location'}
              onClick={() => setMode('location')}
            />
            <ModeBtn
              icon={<Megaphone size={16} />}
              label="All locations"
              hint={canAnnounce ? 'Org-wide announcement' : 'Manager / admin only'}
              active={mode === 'announcement'}
              onClick={() => canAnnounce && setMode('announcement')}
              disabled={!canAnnounce}
            />
            <ModeBtn
              icon={<MessageSquare size={16} />}
              label="One person (DM)"
              hint="Direct message"
              active={mode === 'dm'}
              onClick={() => setMode('dm')}
            />
            <ModeBtn
              icon={<HandHelping size={16} />}
              label="Cover my shift"
              hint="Posts to your store"
              active={mode === 'shift_cover'}
              onClick={() => setMode('shift_cover')}
            />
          </div>

          {/* Mode-specific fields */}
          <div className="mt-5 space-y-4">
            {mode === 'location' && (
              <div>
                <label className="label">Which store?</label>
                <select
                  className="input"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value as LocationId)}
                >
                  {LOCATIONS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {mode === 'dm' && (
              <div>
                <label className="label">Send to</label>
                <select
                  className="input"
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                >
                  <option value="">Choose someone…</option>
                  {teammates.map((e) => (
                    <option key={e.id} value={e.id}>
                      {fullName(e)} · {getLocation(e.homeLocationId)?.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {mode === 'shift_cover' && (
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="label">Date</label>
                  <input
                    type="date"
                    className="input"
                    value={shiftDate}
                    onChange={(e) => setShiftDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Start</label>
                  <input
                    type="time"
                    className="input"
                    value={shiftStart}
                    onChange={(e) => setShiftStart(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">End</label>
                  <input
                    type="time"
                    className="input"
                    value={shiftEnd}
                    onChange={(e) => setShiftEnd(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="label">Message</label>
              <textarea
                className="input min-h-[120px]"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={
                  mode === 'announcement'
                    ? 'Drop the announcement here. Be brief — it will hit every employee.'
                    : mode === 'shift_cover'
                    ? 'A quick note on why you need cover (sick, family, etc.)'
                    : 'What do you want to say?'
                }
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
              <Link href="/messages" className="btn-ghost">
                Cancel
              </Link>
              <button
                onClick={handleSend}
                disabled={!body.trim() || (mode === 'dm' && !recipientId)}
                className="btn-cyan disabled:opacity-40"
              >
                <Send size={14} /> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ModeBtn({
  icon,
  label,
  hint,
  active,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition ${
        active
          ? 'border-cyan-400 bg-cyan-50'
          : 'border-ink-100 hover:border-cyan-300'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-500">
        {icon}
      </div>
      <div>
        <div className="text-sm font-bold text-ink-700">{label}</div>
        <div className="text-xs text-ink-400">{hint}</div>
      </div>
    </button>
  );
}
