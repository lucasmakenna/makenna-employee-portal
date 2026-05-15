import { Conversation, LocationId, Message } from '@/types';
import { LOCATIONS } from './locations';

/** Auto-create a location channel for every store and one all-hands channel. */
export const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv:all-hands',
    type: 'all_hands',
    name: 'All Hands',
    participantIds: [],
    createdBy: 'emp-001',
    createdAt: '2024-01-01T00:00:00Z',
  },
  ...LOCATIONS.map<Conversation>((l) => ({
    id: `conv:loc:${l.id}`,
    type: 'location_channel',
    name: `${l.name} Team`,
    locationId: l.id as LocationId,
    participantIds: [],
    createdBy: 'emp-001',
    createdAt: '2024-01-01T00:00:00Z',
  })),
  // A demo shift-cover request
  {
    id: 'conv:cover-1',
    type: 'shift_cover',
    name: 'Cover needed: Sat 1–8pm Simi',
    participantIds: ['emp-005'],
    shiftDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
    shiftStartTime: '13:00',
    shiftEndTime: '20:00',
    shiftLocationId: 'simi-valley',
    shiftCovered: false,
    createdBy: 'emp-005',
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  // A demo DM
  {
    id: 'conv:dm:emp-002:emp-005',
    type: 'dm',
    name: 'Sabrina Reyes & Diego Ramirez',
    participantIds: ['emp-002', 'emp-005'],
    createdBy: 'emp-002',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export const SEED_MESSAGES: Message[] = [
  // All Hands
  {
    id: 'msg-1',
    conversationId: 'conv:all-hands',
    authorId: 'emp-001',
    authorName: 'Lucas Kim',
    body: 'Welcome to the new team portal! Drop questions in your store channel.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    announcement: true,
    pinned: true,
    readBy: ['emp-001'],
  },
  {
    id: 'msg-2',
    conversationId: 'conv:all-hands',
    authorId: 'emp-002',
    authorName: 'Sabrina Reyes',
    body: 'Summer menu drops Monday — recipe cards by Friday.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    announcement: true,
    readBy: ['emp-001', 'emp-002'],
  },
  // Simi Valley channel
  {
    id: 'msg-3',
    conversationId: 'conv:loc:simi-valley',
    authorId: 'emp-002',
    authorName: 'Sabrina Reyes',
    body: 'Tomorrow we open at 5:30 sharp. Diego, please come 15 min early to walk through opening.',
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    readBy: ['emp-002'],
  },
  {
    id: 'msg-4',
    conversationId: 'conv:loc:simi-valley',
    authorId: 'emp-005',
    authorName: 'Diego Ramirez',
    body: 'Got it! 👍',
    createdAt: new Date(Date.now() - 7 * 3600000).toISOString(),
    readBy: ['emp-002', 'emp-005'],
  },
  // Shift cover
  {
    id: 'msg-5',
    conversationId: 'conv:cover-1',
    authorId: 'emp-005',
    authorName: 'Diego Ramirez',
    body: 'Hey team — anyone able to take my Sat 1–8 at Simi? Family thing came up. Owe you one.',
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    readBy: ['emp-005'],
  },
  // DM
  {
    id: 'msg-6',
    conversationId: 'conv:dm:emp-002:emp-005',
    authorId: 'emp-002',
    authorName: 'Sabrina Reyes',
    body: 'How did your first week feel? Anything I can do better on the schedule?',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    readBy: ['emp-002'],
  },
];
