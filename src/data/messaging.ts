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
];

export const SEED_MESSAGES: Message[] = [];
