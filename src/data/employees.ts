import { Employee } from '@/types';
import { totalSkills, completedSkillsCount } from './training';

const palette = ['#2B1810', '#D4A574', '#5C3A28', '#956A36', '#3D241A', '#B8894E', '#8C6347'];

export const EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    firstName: 'Lucas',
    lastName: 'Kim',
    email: 'lucas@makennakoffee.com',
    phone: '(805) 555-0101',
    role: 'admin',
    homeLocationId: 'simi-valley',
    hiredOn: '2018-03-12',
    birthday: '06-21',
    certifications: [
      { id: 'c1', name: 'Food Handler', issuedOn: '2025-09-01', expiresOn: '2028-09-01' },
      { id: 'c2', name: 'Harassment Prevention', issuedOn: '2025-04-15', expiresOn: '2027-04-15' },
    ],
    trainingProgressByStation: {},
    avatarColor: palette[0],
    active: true,
  },
  {
    id: 'emp-002',
    firstName: 'Sabrina',
    lastName: 'Reyes',
    email: 'sabrina@makennakoffee.com',
    phone: '(805) 555-0102',
    role: 'manager',
    homeLocationId: 'simi-valley',
    hiredOn: '2019-08-04',
    birthday: '02-14',
    certifications: [
      { id: 'c3', name: 'Food Handler', issuedOn: '2025-08-22', expiresOn: '2028-08-22' },
      { id: 'c4', name: 'Harassment Prevention', issuedOn: '2025-03-10', expiresOn: '2027-03-10' },
    ],
    trainingProgressByStation: {
      'compliance-culture': { stationId: 'compliance-culture', skillsCompleted: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5'], signedOffBy: 'emp-001', signedOffAt: '2019-09-01T12:00:00Z' },
      'food-safety-pos': { stationId: 'food-safety-pos', skillsCompleted: ['fs-1', 'fs-2', 'fs-3', 'fs-4', 'fs-5', 'fs-6'], signedOffBy: 'emp-001', signedOffAt: '2019-09-01T12:00:00Z' },
      'barista-basics-1': { stationId: 'barista-basics-1', skillsCompleted: ['bb1-1', 'bb1-2', 'bb1-3', 'bb1-4', 'bb1-5'], signedOffBy: 'emp-001', signedOffAt: '2019-09-01T12:00:00Z' },
      'barista-basics-2': { stationId: 'barista-basics-2', skillsCompleted: ['bb2-1', 'bb2-2', 'bb2-3', 'bb2-4', 'bb2-5'], signedOffBy: 'emp-001', signedOffAt: '2019-09-01T12:00:00Z' },
      'opening': { stationId: 'opening', skillsCompleted: ['op-1', 'op-2', 'op-3', 'op-4'], signedOffBy: 'emp-001', signedOffAt: '2019-09-01T12:00:00Z' },
      'bar-routine': { stationId: 'bar-routine', skillsCompleted: ['br-1', 'br-2'], signedOffBy: 'emp-001', signedOffAt: '2019-09-01T12:00:00Z' },
      'peak-prep': { stationId: 'peak-prep', skillsCompleted: ['pp-1', 'pp-2', 'pp-3'], signedOffBy: 'emp-001', signedOffAt: '2019-09-01T12:00:00Z' },
      'closing': { stationId: 'closing', skillsCompleted: ['cl-1', 'cl-2'], signedOffBy: 'emp-001', signedOffAt: '2019-09-01T12:00:00Z' },
      'supervised-practice': { stationId: 'supervised-practice', skillsCompleted: ['sp-1', 'sp-2', 'sp-3'], signedOffBy: 'emp-001', signedOffAt: '2019-09-01T12:00:00Z' },
      'final-review': { stationId: 'final-review', skillsCompleted: ['fr-1', 'fr-2', 'fr-3'], signedOffBy: 'emp-001', signedOffAt: '2019-09-01T12:00:00Z' },
    },
    avatarColor: palette[1],
    active: true,
  },
  {
    id: 'emp-009',
    firstName: 'Gilberto',
    lastName: 'Ruiz',
    email: 'gil@makennakoffee.com',
    phone: '(805) 555-0109',
    role: 'manager',
    homeLocationId: 'ventura',
    hiredOn: '2020-01-15',
    birthday: '09-04',
    certifications: [
      { id: 'c14', name: 'Food Handler', issuedOn: '2025-09-15', expiresOn: '2028-09-15' },
      { id: 'c15', name: 'Harassment Prevention', issuedOn: '2024-12-02', expiresOn: '2026-12-02' },
    ],
    trainingProgressByStation: {
      'compliance-culture': { stationId: 'compliance-culture', skillsCompleted: ['cc-1', 'cc-2', 'cc-3', 'cc-4', 'cc-5'], signedOffBy: 'emp-001', signedOffAt: '2020-02-15T12:00:00Z' },
      'food-safety-pos': { stationId: 'food-safety-pos', skillsCompleted: ['fs-1', 'fs-2', 'fs-3', 'fs-4', 'fs-5', 'fs-6'], signedOffBy: 'emp-001', signedOffAt: '2020-02-15T12:00:00Z' },
      'barista-basics-1': { stationId: 'barista-basics-1', skillsCompleted: ['bb1-1', 'bb1-2', 'bb1-3', 'bb1-4', 'bb1-5'], signedOffBy: 'emp-001', signedOffAt: '2020-02-20T12:00:00Z' },
      'barista-basics-2': { stationId: 'barista-basics-2', skillsCompleted: ['bb2-1', 'bb2-2', 'bb2-3', 'bb2-4', 'bb2-5'], signedOffBy: 'emp-001', signedOffAt: '2020-02-25T12:00:00Z' },
      'opening': { stationId: 'opening', skillsCompleted: ['op-1', 'op-2', 'op-3', 'op-4'], signedOffBy: 'emp-001', signedOffAt: '2020-02-28T12:00:00Z' },
      'bar-routine': { stationId: 'bar-routine', skillsCompleted: ['br-1', 'br-2'], signedOffBy: 'emp-001', signedOffAt: '2020-03-04T12:00:00Z' },
      'peak-prep': { stationId: 'peak-prep', skillsCompleted: ['pp-1', 'pp-2', 'pp-3'], signedOffBy: 'emp-001', signedOffAt: '2020-03-08T12:00:00Z' },
      'closing': { stationId: 'closing', skillsCompleted: ['cl-1', 'cl-2'], signedOffBy: 'emp-001', signedOffAt: '2020-03-10T12:00:00Z' },
      'supervised-practice': { stationId: 'supervised-practice', skillsCompleted: ['sp-1', 'sp-2', 'sp-3'], signedOffBy: 'emp-001', signedOffAt: '2020-03-14T12:00:00Z' },
      'final-review': { stationId: 'final-review', skillsCompleted: ['fr-1', 'fr-2', 'fr-3'], signedOffBy: 'emp-001', signedOffAt: '2020-03-18T12:00:00Z' },
    },
    avatarColor: palette[1],
    active: true,
  },
];

export function fullName(e: { firstName: string; lastName: string }) {
  return `${e.firstName} ${e.lastName}`;
}
export function initials(e: { firstName: string; lastName: string }) {
  return `${e.firstName[0]}${e.lastName[0]}`;
}
export function getEmployee(id: string) {
  return EMPLOYEES.find((e) => e.id === id);
}

/**
 * Returns true if the employee still has training to complete.
 * "In training" is a derived state, not a role — a barista who's been with us
 * 5 years is just a barista, not a trainee.
 */
export function isInTraining(employee: Employee): boolean {
  const total = totalSkills();
  const done = completedSkillsCount(employee.trainingProgressByStation);
  return done < total;
}

/** Subset that's still working through the curriculum. */
export function traineesInProgress(): Employee[] {
  return EMPLOYEES.filter((e) => e.active && isInTraining(e));
}
