import { Employee } from '@/types';
import { totalSkills, completedSkillsCount } from './training';

export const EMPLOYEES: Employee[] = [];

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
