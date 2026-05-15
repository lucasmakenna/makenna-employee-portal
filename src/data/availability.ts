import { Availability, DayOfWeek, TimeBlock } from '@/types';

export const DAYS: { id: DayOfWeek; label: string }[] = [
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
  { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thu' },
  { id: 'fri', label: 'Fri' },
  { id: 'sat', label: 'Sat' },
  { id: 'sun', label: 'Sun' },
];

export const BLOCKS: { id: TimeBlock; label: string; range: string }[] = [
  { id: 'morning',   label: 'Morning',   range: '5a–10a' },
  { id: 'midday',    label: 'Midday',    range: '10a–2p' },
  { id: 'afternoon', label: 'Afternoon', range: '2p–6p' },
  { id: 'evening',   label: 'Evening',   range: '6p–10p' },
];

/** Cycle through availability statuses on tap. */
export function nextStatus(s?: 'available' | 'preferred' | 'unavailable') {
  if (!s || s === 'available') return 'preferred' as const;
  if (s === 'preferred') return 'unavailable' as const;
  return 'available' as const;
}

export const SEED_AVAILABILITY: Record<string, Availability> = {
  'emp-005': {
    employeeId: 'emp-005',
    weekly: {
      mon: { morning: 'preferred', midday: 'preferred', afternoon: 'available', evening: 'unavailable' },
      tue: { morning: 'preferred', midday: 'preferred', afternoon: 'available', evening: 'unavailable' },
      wed: { morning: 'unavailable', midday: 'unavailable', afternoon: 'unavailable', evening: 'unavailable' },
      thu: { morning: 'preferred', midday: 'available', afternoon: 'available', evening: 'unavailable' },
      fri: { morning: 'preferred', midday: 'preferred', afternoon: 'available', evening: 'unavailable' },
      sat: { morning: 'available', midday: 'available', afternoon: 'available', evening: 'available' },
      sun: { morning: 'unavailable', midday: 'unavailable', afternoon: 'unavailable', evening: 'unavailable' },
    },
    preferredMinHours: 25,
    preferredMaxHours: 35,
    notes: 'Wednesdays: school day. No availability.',
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  'emp-006': {
    employeeId: 'emp-006',
    weekly: {
      mon: { morning: 'unavailable', midday: 'available', afternoon: 'preferred', evening: 'preferred' },
      tue: { morning: 'unavailable', midday: 'available', afternoon: 'preferred', evening: 'preferred' },
      wed: { morning: 'unavailable', midday: 'available', afternoon: 'preferred', evening: 'preferred' },
      thu: { morning: 'unavailable', midday: 'available', afternoon: 'preferred', evening: 'preferred' },
      fri: { morning: 'unavailable', midday: 'available', afternoon: 'preferred', evening: 'preferred' },
      sat: { morning: 'preferred', midday: 'preferred', afternoon: 'available', evening: 'available' },
      sun: { morning: 'preferred', midday: 'preferred', afternoon: 'available', evening: 'available' },
    },
    preferredMinHours: 20,
    preferredMaxHours: 30,
    notes: 'Mornings: in class until 11.',
    updatedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
};
