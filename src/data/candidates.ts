import { Candidate } from '@/types';

export const CANDIDATES: Candidate[] = [];

export const STAGES = [
  { id: 'applied', label: 'Applied' },
  { id: 'phone_screen', label: 'Phone Screen' },
  { id: 'in_person', label: 'In-Person' },
  { id: 'offer', label: 'Offer' },
  { id: 'hired', label: 'Hired' },
] as const;
