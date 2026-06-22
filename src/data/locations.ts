import { Location } from '@/types';

export const LOCATIONS: Location[] = [
  { id: 'simi-valley', name: 'Simi Valley', city: 'Simi Valley, CA', manager: 'emp-002' },
  { id: 'ventura', name: 'Ventura', city: 'Ventura, CA', manager: 'emp-009' },
  { id: 'camarillo', name: 'Camarillo', city: 'Camarillo, CA' },
  { id: 'valencia', name: 'Valencia', city: 'Valencia, CA' },
  { id: 'orange', name: 'Orange', city: 'Orange, CA' },
  { id: 'westlake', name: 'Westlake Village', city: 'Westlake Village, CA' },
  { id: 'santa-monica', name: 'Santa Monica', city: 'Santa Monica, CA' },
  { id: 'beach-house', name: 'Makenna Beach House', city: 'Ventura, CA' },
  { id: 'coffee-truck', name: 'Makenna Koffee Truck', city: 'Mobile' },
  { id: 'balboa', name: 'Balboa', city: 'Balboa, CA', pin: '8420' },
  { id: 'reseda', name: 'Reseda', city: 'Reseda, CA', pin: '9255' },
];

export function getLocation(id: string) {
  return LOCATIONS.find((l) => l.id === id);
}
