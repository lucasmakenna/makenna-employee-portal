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

export const SEED_AVAILABILITY: Record<string, Availability> = {};
