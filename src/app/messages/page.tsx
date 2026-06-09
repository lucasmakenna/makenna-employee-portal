'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Megaphone,
  MapPin,
  MessageSquare,
  HandHelping,
  Send,
  Plus,
  Pin,
  Users,
  Sparkles,
  Clock,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import Avatar from '@/components/Avatar';
import { useCurrentUser } from '@/lib/auth';
import { useConversations, useMessages, useEmployees } from '@/data/store';
import { fullName } from '@/data/employees';
import { getLocation } from '@/data/locations';
import type { Conversation } from '@/types';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { can } from '@/data/permissions';

export default function MessagesPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const { user, loaded } = useCurrentUser();
  const { conversations, visibleTo, update: updateConv } = useConversations();
  const { send, forConversation, lastMessage, unreadCount, markRead, togglePin } = useMessages();
  const { getById } = useEmployees();
  const [activeId, setActiveId] = useState<string | null>(sp.get('c'));
  const [draft, setDraft] = useState('');
  const [asAnnouncement, setAsAnnouncement] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  const myConvs = useMemo(() => visibleTo(user ?? undefined), [visibleTo, user]);

  const grouped = useMemo(() => {
    const all = myConvs.slice().sort((a, b) => {
      const la = lastMessage(a.id)?.createdAt ?? a.createdAt;
      const lb = lastMessage(b.id)?.createdAt ?? b.createdAt;
      return la < lb ? 1 : -1;
    });
    return {
      allHands: all.filter((c) => c.type === 'all_hands'),
      locations: all.filter((c) => c.type === 'location_channel'),
      shiftCover: all.filter((c) => c.type === 'shift_cover'),
      dms: all.filter((c) => c.type === 'dm'),
    };
  }, [myConvs, lastMessage]);

  const active = activeId ? conversations.find((c) => c.id === activeId) : null;
  const thread = active ? forConversation(active.id) : [];

  useEffect(() => {
    if (active && user) markRead(active.id, user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id]);

  // Auto-scroll to bottom when thread changes or active conversation switches
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.length, activeId]);

  if (!user) return null;

  const handleSend = () => {
    if (!active || !draft.trim()) return;
    send({
      conversationId: active.id,
      authorId: user.id,
      authorName: fullName(user),
      body: draft.trim(),
      announcement: asAnnouncement && can(user.role, 'comms.post_announcement'),
    });
    setDraft('');
    setAsAnnouncement(false);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink-700">Messages</h1>
            <p className="mt-1 text-sm text-ink-400">
              Channels per location, all-hands announcements, DMs, and shift cover.
            </p>
          </div>
          <Link href="/messages/new" className="btn-cyan">
            <Plus size={16} /> New conversation
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          {/* Inbox sidebar */}
          <div className="card overflow-hidden">
            <ConvSection
              title="Announcements"
              icon={<Megaphone size={14} />}
              convs={grouped.allHands}
              activeId={activeId}
              onPick={setActiveId}
              userId={user.id}
              unreadCount={unreadCount}
              lastMessage={lastMessage}
            />
            <ConvSection
              title="Stores"
              icon={<MapPin size={14} />}
              convs={grouped.locations}
              activeId={activeId}
              onPick={setActiveId}
              userId={user.id}
              unreadCount={unreadCount}
              lastMessage={lastMessage}
            />
            <ConvSection
              title="Shift cover"
              icon={<HandHelping size={14} />}
              convs={grouped.shiftCover}
              activeId={activeId}
              onPick={setActiveId}
              userId={user.id}
              unreadCount={unreadCount}
              lastMessage={lastMessage}
            />
            <ConvSection
              title="Direct messages"
              icon={<MessageSquare size={14} />}
              convs={grouped.dms}
              activeId={activeId}
              onPick={setActiveId}
              userId={user.id}
              unreadCount={unreadCount}
              lastMessage={lastMessage}
            />
          </div>

          {/* Thread */}
          <div className="card flex min-h-[60vh] flex-col">
            {!active ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-ink-400">
                <MessageSquare size={36} />
                <p className="text-sm">Pick a conversation from the left.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3 border-b border-ink-100 p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <ConvIcon conv={active} />
                    <div className="min-w-0">
                      <div className="font-bold text-ink-700 truncate">{active.name}</div>
                      <ConvSubtitle conv={active} />
                    </div>
                  </div>
                  {active.type === 'shift_cover' && !active.shiftCovered && (
                    <button
                      onClick={() => updateConv(active.id, { shiftCovered: true, shiftCoveredById: user.id })}
                      className="btn-hibiscus"
                    >
                      <Sparkles size={14} /> I've got it
                    </button>
                  )}
                  {active.type === 'shift_cover' && active.shiftCovered && (
                    <span className="pill bg-emerald-100 text-emerald-800">Covered</span>
                  )}
                </div>

                {/* Pinned messages strip */}
                {thread.some((m) => m.pinned) && (
                  <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1">
                      <Pin size={11} /> Pinned
                    </div>
                    {thread.filter((m) => m.pinned).map((m) => (
                      <div key={m.id} className="flex items-start justify-between gap-2 rounded-lg bg-white border border-amber-200 px-3 py-1.5">
                        <p className="text-xs text-ink-700 line-clamp-1">
                          <span className="font-semibold text-ink-500">{m.authorName.split(' ')[0]}:</span>{' '}
                          {m.body}
                        </p>
                        {can(user.role, 'comms.pin_announcement') && (
                          <button
                            onClick={() => togglePin(m.id)}
                            className="shrink-0 text-amber-400 hover:text-amber-700 transition"
                            title="Unpin"
                          >
                            <Pin size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {thread.length === 0 && (
                    <p className="text-center text-sm text-ink-400 py-12">No messages yet.</p>
                  )}
                  {thread.map((m) => {

                    const isMe = m.authorId === user.id;
                    const author = getById(m.authorId);
                    const canPin = can(user.role, 'comms.pin_announcement');
                    return (
                      <div
                        key={m.id}
                        className={`group flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}
                      >
                        {author && <Avatar employee={author} size="sm" />}
                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                          <div className="flex items-center gap-1 text-xs text-ink-400">
                            <span className="font-semibold text-ink-700">{m.authorName}</span>
                            <span>·</span>
                            <span>{format(parseISO(m.createdAt), 'MMM d, h:mm a')}</span>
                            {m.announcement && (
                              <span className="pill bg-hibiscus-50 text-hibiscus-500 ml-1">
                                <Megaphone size={9} /> Announcement
                              </span>
                            )}
                            {m.pinned && (
                              <span className="pill bg-amber-100 text-amber-600 ml-1">
                                <Pin size={9} /> Pinned
                              </span>
                            )}
                            {canPin && (
                              <button
                                onClick={() => togglePin(m.id)}
                                className="ml-1 opacity-0 group-hover:opacity-100 transition text-ink-400 hover:text-amber-500"
                                title={m.pinned ? 'Unpin' : 'Pin message'}
                              >
                                <Pin size={12} className={m.pinned ? 'text-amber-500' : ''} />
                              </button>
                            )}
                          </div>
                          <div
                            className={`mt-1 rounded-2xl px-3 py-2 text-sm ${
                              m.announcement
                                ? 'bg-hibiscus-50 border border-hibiscus-200 text-hibiscus-800'
                                : isMe
                                ? 'bg-cyan-400 text-white'
                                : 'bg-cyan-50 text-ink-700'
                            }`}
                          >
                            {m.body}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                <div className="border-t border-ink-100 p-3">
                  {can(user.role, 'comms.post_announcement') &&
                    (active.type === 'all_hands' || active.type === 'location_channel') && (
                      <label className="mb-2 flex cursor-pointer items-center gap-2 text-xs text-ink-500">
                        <input
                          type="checkbox"
                          checked={asAnnouncement}
                          onChange={(e) => setAsAnnouncement(e.target.checked)}
                        />
                        Post as announcement (everyone gets a notification)
                      </label>
                    )}
                  <div className="flex gap-2">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder={`Message ${active.name}…`}
                      className="input flex-1"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!draft.trim()}
                      className="btn-cyan disabled:opacity-40"
                    >
                      <Send size={16} /> Send
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ConvIcon({ conv }: { conv: Conversation }) {
  const cls = 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full';
  if (conv.type === 'all_hands')
    return <div className={`${cls} bg-hibiscus-50 text-hibiscus-500`}><Megaphone size={16} /></div>;
  if (conv.type === 'location_channel')
    return <div className={`${cls} bg-cyan-50 text-cyan-500`}><MapPin size={16} /></div>;
  if (conv.type === 'shift_cover')
    return <div className={`${cls} bg-amber-100 text-amber-700`}><HandHelping size={16} /></div>;
  return <div className={`${cls} bg-royal-50 text-royal-400`}><Users size={16} /></div>;
}

function ConvSubtitle({ conv }: { conv: Conversation }) {
  if (conv.type === 'shift_cover' && conv.shiftDate) {
    return (
      <div className="flex items-center gap-1 text-xs text-ink-400">
        <Clock size={11} />
        {conv.shiftDate} · {conv.shiftStartTime}–{conv.shiftEndTime}
        {conv.shiftLocationId && ` · ${getLocation(conv.shiftLocationId)?.name}`}
      </div>
    );
  }
  if (conv.type === 'location_channel' && conv.locationId) {
    return <div className="text-xs text-ink-400">Everyone at {getLocation(conv.locationId)?.name}</div>;
  }
  if (conv.type === 'all_hands') {
    return <div className="text-xs text-ink-400">All 9 locations</div>;
  }
  return null;
}

function ConvSection({
  title,
  icon,
  convs,
  activeId,
  onPick,
  userId,
  unreadCount,
  lastMessage,
}: {
  title: string;
  icon: React.ReactNode;
  convs: Conversation[];
  activeId: string | null;
  onPick: (id: string) => void;
  userId: string;
  unreadCount: (cid: string, eid: string) => number;
  lastMessage: (cid: string) => any;
}) {
  if (convs.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-1.5 border-b border-ink-100 bg-cyan-50/40 px-3 py-2 text-xs font-bold uppercase tracking-wider text-ink-500">
        {icon}
        {title}
      </div>
      {convs.map((c) => {
        const active = c.id === activeId;
        const last = lastMessage(c.id);
        const unread = unreadCount(c.id, userId);
        return (
          <button
            key={c.id}
            onClick={() => onPick(c.id)}
            className={`flex w-full items-start gap-2 border-b border-ink-100 px-3 py-2.5 text-left transition ${
              active ? 'bg-cyan-50' : 'hover:bg-cyan-50/50'
            }`}
          >
            <ConvIcon conv={c} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="truncate text-sm font-semibold text-ink-700">{c.name}</div>
                {unread > 0 && (
                  <span className="pill bg-hibiscus-400 text-white">{unread}</span>
                )}
              </div>
              {last && (
                <div className="truncate text-xs text-ink-400 mt-0.5">
                  <span className="font-medium">{last.authorName.split(' ')[0]}:</span>{' '}
                  {last.body}
                </div>
              )}
              {last && (
                <div className="text-[10px] text-ink-300 mt-0.5">
                  {formatDistanceToNow(parseISO(last.createdAt), { addSuffix: true })}
                </div>
              )}
            </div>
            {c.type === 'shift_cover' && c.shiftCovered && (
              <Pin size={11} className="text-emerald-500 mt-1" />
            )}
          </button>
        );
      })}
    </div>
  );
}
