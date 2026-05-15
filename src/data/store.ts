'use client';

/**
 * Lightweight localStorage-backed stores so the demo app feels like a real
 * one — adds, edits, and stage moves persist across reloads.
 *
 * In production these become fetch calls to your backend. The shape of
 * `useCandidates`, `useEmployees`, `usePackets` is what other components
 * consume; swap the implementation in this file when the backend exists.
 */

import { useEffect, useMemo, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { CANDIDATES as CAND_SEED } from './candidates';
import { EMPLOYEES as EMP_SEED } from './employees';
import { PACKETS as PACKET_SEED, ONBOARDING_DOCS } from './onboarding';
import { SEED_CONVERSATIONS, SEED_MESSAGES } from './messaging';
import { SEED_AVAILABILITY } from './availability';
import type {
  Candidate,
  CandidateNote,
  CandidateStage,
  Conversation,
  Employee,
  Message,
  OnboardingPacket,
  Role,
  LocationId,
  Availability,
  RecipesTestAttempt,
  RecipesTestAnswer,
} from '@/types';
import { RECIPES_TEST_PASSING_SCORE } from '@/types';
import type { RecipesTestQuestion } from '@/types';

const KEY_C = 'mk-candidates-v1';
const KEY_E = 'mk-employees-v1';
const KEY_P = 'mk-packets-v1';
const KEY_CONV = 'mk-conversations-v1';
const KEY_MSG = 'mk-messages-v1';
const KEY_AVAIL = 'mk-availability-v1';
const KEY_RTA = 'mk-recipes-test-attempts-v1';

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

function loadOrSeed<T>(key: string, seed: T): T {
  if (typeof window === 'undefined') return seed;
  const raw = window.localStorage.getItem(key);
  if (!raw) {
    window.localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return seed;
  }
}

function save<T>(key: string, val: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(val));
  // Notify other tabs / components on the same tab via a custom event
  window.dispatchEvent(new CustomEvent('mk-store', { detail: key }));
}

function useStored<T>(key: string, seed: T) {
  const [value, setValue] = useState<T>(seed);

  useEffect(() => {
    setValue(loadOrSeed<T>(key, seed));
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === key) setValue(loadOrSeed<T>(key, seed));
    };
    window.addEventListener('mk-store', onChange);
    window.addEventListener('storage', () => setValue(loadOrSeed<T>(key, seed)));
    return () => {
      window.removeEventListener('mk-store', onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const write = useCallback(
    (v: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v;
        save(key, next);
        return next;
      });
    },
    [key],
  );

  return [value, write] as const;
}

// ---------------------------------------------------------------------------
// Candidates
// ---------------------------------------------------------------------------

export type NewCandidateInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  appliedFor: Candidate['appliedFor'];
  appliedToLocationId: LocationId;
  source: Candidate['source'];
  initialNote?: string;
  authorId: string;
  authorName: string;
};

export function useCandidates() {
  const [list, setList] = useStored<Candidate[]>(KEY_C, CAND_SEED);

  const add = useCallback(
    (input: NewCandidateInput) => {
      const id = `cand-${Date.now()}`;
      const candidate: Candidate = {
        id,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        appliedFor: input.appliedFor,
        appliedToLocationId: input.appliedToLocationId,
        appliedOn: new Date().toISOString(),
        stage: 'applied',
        source: input.source,
        notes: input.initialNote
          ? [
              {
                id: `n-${Date.now()}`,
                authorId: input.authorId,
                authorName: input.authorName,
                body: input.initialNote.trim(),
                createdAt: new Date().toISOString(),
              },
            ]
          : [],
      };
      setList((prev) => [candidate, ...prev]);
      return candidate;
    },
    [setList],
  );

  const update = useCallback(
    (id: string, patch: Partial<Candidate>) => {
      setList((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    },
    [setList],
  );

  const moveStage = useCallback(
    (id: string, stage: CandidateStage) => {
      update(id, { stage });
    },
    [update],
  );

  const addNote = useCallback(
    (id: string, note: Omit<CandidateNote, 'id' | 'createdAt'>) => {
      setList((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                notes: [
                  ...c.notes,
                  {
                    ...note,
                    id: `n-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            : c,
        ),
      );
    },
    [setList],
  );

  const getById = useCallback(
    (id: string) => list.find((c) => c.id === id),
    [list],
  );

  return useMemo(
    () => ({ candidates: list, add, update, moveStage, addNote, getById }),
    [list, add, update, moveStage, addNote, getById],
  );
}

// ---------------------------------------------------------------------------
// Employees
// ---------------------------------------------------------------------------

export function useEmployees() {
  const [list, setList] = useStored<Employee[]>(KEY_E, EMP_SEED);

  const add = useCallback(
    (employee: Employee) => {
      setList((prev) => [...prev, employee]);
      return employee;
    },
    [setList],
  );

  const update = useCallback(
    (id: string, patch: Partial<Employee>) => {
      setList((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
    },
    [setList],
  );

  const getById = useCallback(
    (id: string) => list.find((e) => e.id === id),
    [list],
  );

  return useMemo(
    () => ({ employees: list, add, update, getById }),
    [list, add, update, getById],
  );
}

// ---------------------------------------------------------------------------
// Onboarding packets
// ---------------------------------------------------------------------------

export function usePackets() {
  const [packets, setPackets] = useStored<Record<string, OnboardingPacket>>(
    KEY_P,
    PACKET_SEED,
  );

  // Load from Supabase on mount and merge into local state
  useEffect(() => {
    supabase.from('onboarding_packets').select('*').then(({ data }) => {
      if (!data || data.length === 0) return;
      setPackets((prev) => {
        const merged = { ...prev };
        for (const row of data) {
          merged[row.employee_id] = {
            employeeId: row.employee_id,
            startDate: row.start_date,
            trainerEmployeeId: row.trainer_employee_id ?? undefined,
            tasks: row.tasks ?? [],
            managerSignOff: row.manager_sign_off ?? undefined,
          };
        }
        return merged;
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create = useCallback(
    (employeeId: string, startDate: string, trainerEmployeeId?: string) => {
      const packet: OnboardingPacket = {
        employeeId,
        startDate,
        trainerEmployeeId,
        tasks: ONBOARDING_DOCS.map((d) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          required: d.required,
          signed: false,
        })),
      };
      setPackets((prev) => ({ ...prev, [employeeId]: packet }));
      supabase.from('onboarding_packets').upsert({
        employee_id: packet.employeeId,
        start_date: packet.startDate,
        trainer_employee_id: packet.trainerEmployeeId ?? null,
        tasks: packet.tasks,
        manager_sign_off: null,
        updated_at: new Date().toISOString(),
      }).then(() => {});
      return packet;
    },
    [setPackets],
  );

  const update = useCallback(
    (employeeId: string, patch: Partial<OnboardingPacket>) => {
      setPackets((prev) => {
        const next = { ...prev, [employeeId]: { ...prev[employeeId], ...patch } };
        const p = next[employeeId];
        supabase.from('onboarding_packets').upsert({
          employee_id: p.employeeId,
          start_date: p.startDate,
          trainer_employee_id: p.trainerEmployeeId ?? null,
          tasks: p.tasks,
          manager_sign_off: p.managerSignOff ?? null,
          updated_at: new Date().toISOString(),
        }).then(() => {});
        return next;
      });
    },
    [setPackets],
  );

  const get = useCallback(
    (employeeId: string) => packets[employeeId],
    [packets],
  );

  return useMemo(
    () => ({ packets, create, update, get }),
    [packets, create, update, get],
  );
}

// ---------------------------------------------------------------------------
// Hiring helper — turn a candidate into an Employee + OnboardingPacket
// ---------------------------------------------------------------------------

const palette = ['#4FB8C9', '#1F5FB6', '#C5293A', '#E91E63', '#2A95A8', '#16545F'];

// ---------------------------------------------------------------------------
// Messaging
// ---------------------------------------------------------------------------

export function useConversations() {
  const [list, setList] = useStored<Conversation[]>(KEY_CONV, SEED_CONVERSATIONS);

  const create = useCallback(
    (input: Omit<Conversation, 'id' | 'createdAt'>) => {
      const conv: Conversation = {
        ...input,
        id: `conv:${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setList((prev) => [...prev, conv]);
      return conv;
    },
    [setList],
  );

  const update = useCallback(
    (id: string, patch: Partial<Conversation>) => {
      setList((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    },
    [setList],
  );

  const getById = useCallback(
    (id: string) => list.find((c) => c.id === id),
    [list],
  );

  /**
   * Filter conversations relevant to a given employee:
   *  - all_hands: visible to everyone
   *  - location_channel: visible if the employee works at that location, OR
   *    the employee is admin (sees all locations)
   *  - dm: only if the employee is a participant
   *  - shift_cover: visible if the shift is at the employee's location, or
   *    they're a participant, or they're admin
   */
  const visibleTo = useCallback(
    (employee: Employee | undefined) => {
      if (!employee) return [];
      return list.filter((c) => {
        if (c.type === 'all_hands') return true;
        if (c.type === 'location_channel') {
          return employee.role === 'admin' || c.locationId === employee.homeLocationId;
        }
        if (c.type === 'dm') return c.participantIds.includes(employee.id);
        if (c.type === 'shift_cover') {
          return (
            employee.role === 'admin' ||
            c.shiftLocationId === employee.homeLocationId ||
            c.participantIds.includes(employee.id)
          );
        }
        return false;
      });
    },
    [list],
  );

  return useMemo(
    () => ({ conversations: list, create, update, getById, visibleTo }),
    [list, create, update, getById, visibleTo],
  );
}

export function useMessages() {
  const [list, setList] = useStored<Message[]>(KEY_MSG, SEED_MESSAGES);

  const send = useCallback(
    (input: Omit<Message, 'id' | 'createdAt' | 'readBy'>) => {
      const msg: Message = {
        ...input,
        id: `msg-${Date.now()}`,
        createdAt: new Date().toISOString(),
        readBy: [input.authorId],
      };
      setList((prev) => [...prev, msg]);
      return msg;
    },
    [setList],
  );

  const markRead = useCallback(
    (conversationId: string, employeeId: string) => {
      setList((prev) =>
        prev.map((m) =>
          m.conversationId === conversationId && !m.readBy.includes(employeeId)
            ? { ...m, readBy: [...m.readBy, employeeId] }
            : m,
        ),
      );
    },
    [setList],
  );

  const forConversation = useCallback(
    (conversationId: string) =>
      list
        .filter((m) => m.conversationId === conversationId)
        .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1)),
    [list],
  );

  const lastMessage = useCallback(
    (conversationId: string) => {
      const msgs = list.filter((m) => m.conversationId === conversationId);
      return msgs.length === 0 ? null : msgs[msgs.length - 1];
    },
    [list],
  );

  const unreadCount = useCallback(
    (conversationId: string, employeeId: string) =>
      list.filter(
        (m) => m.conversationId === conversationId && !m.readBy.includes(employeeId),
      ).length,
    [list],
  );

  return useMemo(
    () => ({ messages: list, send, markRead, forConversation, lastMessage, unreadCount }),
    [list, send, markRead, forConversation, lastMessage, unreadCount],
  );
}

// ---------------------------------------------------------------------------
// Availability
// ---------------------------------------------------------------------------

export function useAvailability() {
  const [map, setMap] = useStored<Record<string, Availability>>(
    KEY_AVAIL,
    SEED_AVAILABILITY,
  );

  const get = useCallback((employeeId: string) => map[employeeId], [map]);

  const upsert = useCallback(
    (a: Availability) => {
      setMap((prev) => ({ ...prev, [a.employeeId]: { ...a, updatedAt: new Date().toISOString() } }));
    },
    [setMap],
  );

  return useMemo(() => ({ map, get, upsert }), [map, get, upsert]);
}

export function buildEmployeeFromCandidate(
  candidate: Candidate,
  startDate: string,
  trainerEmployeeId: string | undefined,
  role: Role = 'barista',
): Employee {
  return {
    id: `emp-new-${Date.now()}`,
    firstName: candidate.firstName,
    lastName: candidate.lastName,
    email: candidate.email,
    phone: candidate.phone,
    role,
    homeLocationId: candidate.appliedToLocationId,
    hiredOn: startDate,
    certifications: [],
    trainingProgressByStation: {},
    avatarColor: palette[Math.floor(Math.random() * palette.length)],
    active: true,
  };
}

// ---------------------------------------------------------------------------
// Recipes Test Attempts
// ---------------------------------------------------------------------------

export function useRecipesTestAttempts() {
  const [list, setList] = useStored<RecipesTestAttempt[]>(KEY_RTA, []);

  // Load from Supabase on mount and merge into local state
  useEffect(() => {
    supabase.from('recipes_test_attempts').select('*').then(({ data }) => {
      if (!data || data.length === 0) return;
      setList((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        const fromDb: RecipesTestAttempt[] = data.map((row) => ({
          id: row.id,
          employeeId: row.employee_id,
          startedAt: row.started_at,
          completedAt: row.completed_at ?? undefined,
          questionOrder: row.question_order ?? [],
          answers: row.answers ?? {},
          score: row.score ?? undefined,
          passed: row.passed ?? undefined,
        }));
        const merged = [...prev];
        for (const a of fromDb) {
          if (!existingIds.has(a.id)) merged.push(a);
        }
        return merged;
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = useCallback(
    (employeeId: string, allQuestionIds: string[]): RecipesTestAttempt => {
      const shuffled = [...allQuestionIds].sort(() => Math.random() - 0.5);
      const attempt: RecipesTestAttempt = {
        id: `rta-${Date.now()}`,
        employeeId,
        startedAt: new Date().toISOString(),
        questionOrder: shuffled,
        answers: {},
      };
      setList((prev) => [attempt, ...prev]);
      supabase.from('recipes_test_attempts').insert({
        id: attempt.id,
        employee_id: attempt.employeeId,
        started_at: attempt.startedAt,
        question_order: attempt.questionOrder,
        answers: attempt.answers,
      }).then(() => {});
      return attempt;
    },
    [setList],
  );

  const saveAnswer = useCallback(
    (attemptId: string, questionId: string, answer: RecipesTestAnswer) => {
      setList((prev) => {
        const next = prev.map((a) =>
          a.id === attemptId
            ? { ...a, answers: { ...a.answers, [questionId]: answer } }
            : a,
        );
        const updated = next.find((a) => a.id === attemptId);
        if (updated) {
          supabase.from('recipes_test_attempts').update({
            answers: updated.answers,
          }).eq('id', attemptId).then(() => {});
        }
        return next;
      });
    },
    [setList],
  );

  const complete = useCallback(
    (attemptId: string, questions: RecipesTestQuestion[]) => {
      setList((prev) =>
        prev.map((a) => {
          if (a.id !== attemptId) return a;
          const correct = questions.filter(
            (q) => a.answers[q.id] === q.correct_answer,
          ).length;
          const score = Math.round((correct / questions.length) * 100);
          const completed = {
            ...a,
            completedAt: new Date().toISOString(),
            score,
            passed: score >= RECIPES_TEST_PASSING_SCORE,
          };
          supabase.from('recipes_test_attempts').update({
            completed_at: completed.completedAt,
            score: completed.score,
            passed: completed.passed,
            answers: completed.answers,
          }).eq('id', attemptId).then(() => {});
          return completed;
        }),
      );
    },
    [setList],
  );

  const getById = useCallback(
    (id: string) => list.find((a) => a.id === id),
    [list],
  );

  const getByEmployee = useCallback(
    (employeeId: string) => list.filter((a) => a.employeeId === employeeId),
    [list],
  );

  const inProgress = useCallback(
    (employeeId: string) =>
      list.find((a) => a.employeeId === employeeId && !a.completedAt),
    [list],
  );

  return useMemo(
    () => ({ attempts: list, start, saveAnswer, complete, getById, getByEmployee, inProgress }),
    [list, start, saveAnswer, complete, getById, getByEmployee, inProgress],
  );
}
