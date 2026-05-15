'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { CANDIDATES as CAND_SEED } from './candidates';
import { EMPLOYEES as EMP_SEED } from './employees';
import { SEED_CONVERSATIONS, SEED_MESSAGES } from './messaging';
import { SEED_AVAILABILITY } from './availability';
import { PACKETS as PACKET_SEED, ONBOARDING_DOCS } from './onboarding';
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

// ---------------------------------------------------------------------------
// Row ↔ TypeScript converters
// ---------------------------------------------------------------------------

function candidateFromRow(r: Record<string, unknown>): Candidate {
  return {
    id: r.id as string,
    firstName: r.first_name as string,
    lastName: r.last_name as string,
    email: (r.email as string) ?? '',
    phone: (r.phone as string) ?? '',
    appliedFor: r.applied_for as Candidate['appliedFor'],
    appliedToLocationId: r.applied_to_location_id as LocationId,
    appliedOn: r.applied_on as string,
    stage: r.stage as CandidateStage,
    source: r.source as Candidate['source'],
    resumeUrl: (r.resume_url as string) ?? undefined,
    notes: (r.notes as CandidateNote[]) ?? [],
  };
}

function candidateToRow(c: Candidate) {
  return {
    id: c.id,
    first_name: c.firstName,
    last_name: c.lastName,
    email: c.email,
    phone: c.phone,
    applied_for: c.appliedFor,
    applied_to_location_id: c.appliedToLocationId,
    applied_on: c.appliedOn,
    stage: c.stage,
    source: c.source,
    resume_url: c.resumeUrl ?? null,
    notes: c.notes,
    updated_at: new Date().toISOString(),
  };
}

export function employeeFromRow(r: Record<string, unknown>): Employee {
  return {
    id: r.id as string,
    firstName: r.first_name as string,
    lastName: r.last_name as string,
    email: r.email as string,
    phone: (r.phone as string) ?? '',
    role: r.role as Role,
    homeLocationId: r.home_location_id as LocationId,
    hiredOn: r.hired_on as string,
    birthday: (r.birthday as string) ?? undefined,
    certifications: (r.certifications as Employee['certifications']) ?? [],
    trainingProgressByStation:
      (r.training_progress_by_station as Employee['trainingProgressByStation']) ?? {},
    avatarColor: (r.avatar_color as string) ?? '#4FB8C9',
    active: r.active as boolean,
  };
}

function employeeToRow(e: Employee) {
  return {
    id: e.id,
    first_name: e.firstName,
    last_name: e.lastName,
    email: e.email,
    phone: e.phone,
    role: e.role,
    home_location_id: e.homeLocationId,
    hired_on: e.hiredOn,
    birthday: e.birthday ?? null,
    certifications: e.certifications,
    training_progress_by_station: e.trainingProgressByStation,
    avatar_color: e.avatarColor,
    active: e.active,
    updated_at: new Date().toISOString(),
  };
}

function conversationFromRow(r: Record<string, unknown>): Conversation {
  return {
    id: r.id as string,
    type: r.type as Conversation['type'],
    name: r.name as string,
    locationId: (r.location_id as LocationId) ?? undefined,
    participantIds: (r.participant_ids as string[]) ?? [],
    shiftDate: (r.shift_date as string) ?? undefined,
    shiftStartTime: (r.shift_start_time as string) ?? undefined,
    shiftEndTime: (r.shift_end_time as string) ?? undefined,
    shiftLocationId: (r.shift_location_id as LocationId) ?? undefined,
    shiftCovered: (r.shift_covered as boolean) ?? undefined,
    shiftCoveredById: (r.shift_covered_by_id as string) ?? undefined,
    createdBy: r.created_by as string,
    createdAt: r.created_at as string,
  };
}

function conversationToRow(c: Conversation) {
  return {
    id: c.id,
    type: c.type,
    name: c.name,
    location_id: c.locationId ?? null,
    participant_ids: c.participantIds,
    shift_date: c.shiftDate ?? null,
    shift_start_time: c.shiftStartTime ?? null,
    shift_end_time: c.shiftEndTime ?? null,
    shift_location_id: c.shiftLocationId ?? null,
    shift_covered: c.shiftCovered ?? null,
    shift_covered_by_id: c.shiftCoveredById ?? null,
    created_by: c.createdBy,
    created_at: c.createdAt,
    updated_at: new Date().toISOString(),
  };
}

function messageFromRow(r: Record<string, unknown>): Message {
  return {
    id: r.id as string,
    conversationId: r.conversation_id as string,
    authorId: r.author_id as string,
    authorName: r.author_name as string,
    body: r.body as string,
    announcement: (r.announcement as boolean) ?? undefined,
    pinned: (r.pinned as boolean) ?? undefined,
    readBy: (r.read_by as string[]) ?? [],
    createdAt: r.created_at as string,
  };
}

function messageToRow(m: Message) {
  return {
    id: m.id,
    conversation_id: m.conversationId,
    author_id: m.authorId,
    author_name: m.authorName,
    body: m.body,
    announcement: m.announcement ?? null,
    pinned: m.pinned ?? null,
    read_by: m.readBy,
    created_at: m.createdAt,
  };
}

function availabilityFromRow(r: Record<string, unknown>): Availability {
  return {
    employeeId: r.employee_id as string,
    weekly: (r.weekly as Availability['weekly']) ?? {},
    preferredMinHours: (r.preferred_min_hours as number) ?? 0,
    preferredMaxHours: (r.preferred_max_hours as number) ?? 40,
    notes: (r.notes as string) ?? undefined,
    updatedAt: r.updated_at as string,
  };
}

function availabilityToRow(a: Availability) {
  return {
    employee_id: a.employeeId,
    weekly: a.weekly,
    preferred_min_hours: a.preferredMinHours,
    preferred_max_hours: a.preferredMaxHours,
    notes: a.notes ?? null,
    updated_at: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

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
  const [list, setList] = useState<Candidate[]>([]);

  useEffect(() => {
    supabase
      .from('candidates')
      .select('*')
      .order('applied_on', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setList(data.map((r) => candidateFromRow(r as Record<string, unknown>)));
        }
      });
  }, []);

  const add = useCallback((input: NewCandidateInput) => {
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
    supabase.from('candidates').insert(candidateToRow(candidate)).then(() => {});
    return candidate;
  }, []);

  const update = useCallback((id: string, patch: Partial<Candidate>) => {
    setList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
    supabase
      .from('candidates')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .then(() => {});
  }, []);

  const moveStage = useCallback(
    (id: string, stage: CandidateStage) => {
      update(id, { stage });
    },
    [update],
  );

  const addNote = useCallback((id: string, note: Omit<CandidateNote, 'id' | 'createdAt'>) => {
    const newNote: CandidateNote = {
      ...note,
      id: `n-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setList((prev) => {
      const next = prev.map((c) =>
        c.id === id ? { ...c, notes: [...c.notes, newNote] } : c,
      );
      const updated = next.find((c) => c.id === id);
      if (updated) {
        supabase
          .from('candidates')
          .update({ notes: updated.notes, updated_at: new Date().toISOString() })
          .eq('id', id)
          .then(() => {});
      }
      return next;
    });
  }, []);

  const getById = useCallback((id: string) => list.find((c) => c.id === id), [list]);

  return useMemo(
    () => ({ candidates: list, add, update, moveStage, addNote, getById }),
    [list, add, update, moveStage, addNote, getById],
  );
}

// ---------------------------------------------------------------------------
// Employees
// ---------------------------------------------------------------------------

export function useEmployees() {
  const [list, setList] = useState<Employee[]>([]);

  useEffect(() => {
    supabase
      .from('employees')
      .select('*')
      .order('hired_on', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setList(data.map((r) => employeeFromRow(r as Record<string, unknown>)));
        }
      });
  }, []);

  const add = useCallback((employee: Employee) => {
    setList((prev) => [...prev, employee]);
    supabase.from('employees').insert(employeeToRow(employee)).then(() => {});
    return employee;
  }, []);

  const update = useCallback((id: string, patch: Partial<Employee>) => {
    setList((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, ...patch } : e));
      const updated = next.find((e) => e.id === id);
      if (updated) {
        supabase
          .from('employees')
          .update(employeeToRow(updated))
          .eq('id', id)
          .then(() => {});
      }
      return next;
    });
  }, []);

  const getById = useCallback((id: string) => list.find((e) => e.id === id), [list]);

  const remove = useCallback((id: string) => {
    setList((prev) => prev.filter((e) => e.id !== id));
    supabase.from('employees').delete().eq('id', id).then(() => {});
  }, []);

  return useMemo(
    () => ({ employees: list, add, update, getById, remove }),
    [list, add, update, getById, remove],
  );
}

// ---------------------------------------------------------------------------
// Onboarding packets
// ---------------------------------------------------------------------------

export function usePackets() {
  const [packets, setPackets] = useState<Record<string, OnboardingPacket>>({});

  useEffect(() => {
    supabase
      .from('onboarding_packets')
      .select('*')
      .then(({ data }) => {
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
      supabase
        .from('onboarding_packets')
        .upsert({
          employee_id: packet.employeeId,
          start_date: packet.startDate,
          trainer_employee_id: packet.trainerEmployeeId ?? null,
          tasks: packet.tasks,
          manager_sign_off: null,
          updated_at: new Date().toISOString(),
        })
        .then(() => {});
      return packet;
    },
    [],
  );

  const update = useCallback(
    (employeeId: string, patch: Partial<OnboardingPacket>) => {
      setPackets((prev) => {
        const next = { ...prev, [employeeId]: { ...prev[employeeId], ...patch } };
        const p = next[employeeId];
        supabase
          .from('onboarding_packets')
          .upsert({
            employee_id: p.employeeId,
            start_date: p.startDate,
            trainer_employee_id: p.trainerEmployeeId ?? null,
            tasks: p.tasks,
            manager_sign_off: p.managerSignOff ?? null,
            updated_at: new Date().toISOString(),
          })
          .then(() => {});
        return next;
      });
    },
    [],
  );

  const get = useCallback((employeeId: string) => packets[employeeId], [packets]);

  return useMemo(
    () => ({ packets, create, update, get }),
    [packets, create, update, get],
  );
}

// ---------------------------------------------------------------------------
// Hiring helper — turn a candidate into an Employee
// ---------------------------------------------------------------------------

const palette = ['#4FB8C9', '#1F5FB6', '#C5293A', '#E91E63', '#2A95A8', '#16545F'];

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
// Messaging
// ---------------------------------------------------------------------------

export function useConversations() {
  const [list, setList] = useState<Conversation[]>([]);

  useEffect(() => {
    supabase
      .from('conversations')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setList(data.map((r) => conversationFromRow(r as Record<string, unknown>)));
        }
      });
  }, []);

  const create = useCallback((input: Omit<Conversation, 'id' | 'createdAt'>) => {
    const conv: Conversation = {
      ...input,
      id: `conv:${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setList((prev) => [...prev, conv]);
    supabase.from('conversations').insert(conversationToRow(conv)).then(() => {});
    return conv;
  }, []);

  const update = useCallback((id: string, patch: Partial<Conversation>) => {
    setList((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    supabase
      .from('conversations')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .then(() => {});
  }, []);

  const getById = useCallback(
    (id: string) => list.find((c) => c.id === id),
    [list],
  );

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
  const [list, setList] = useState<Message[]>([]);

  useEffect(() => {
    supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setList(data.map((r) => messageFromRow(r as Record<string, unknown>)));
        }
      });
  }, []);

  const send = useCallback((input: Omit<Message, 'id' | 'createdAt' | 'readBy'>) => {
    const msg: Message = {
      ...input,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      readBy: [input.authorId],
    };
    setList((prev) => [...prev, msg]);
    supabase.from('messages').insert(messageToRow(msg)).then(() => {});
    return msg;
  }, []);

  const markRead = useCallback((conversationId: string, employeeId: string) => {
    setList((prev) => {
      const toUpdate = prev
        .filter((m) => m.conversationId === conversationId && !m.readBy.includes(employeeId))
        .map((m) => ({ ...m, readBy: [...m.readBy, employeeId] }));

      if (toUpdate.length === 0) return prev;

      for (const m of toUpdate) {
        supabase
          .from('messages')
          .update({ read_by: m.readBy })
          .eq('id', m.id)
          .then(() => {});
      }

      const updatedIds = new Set(toUpdate.map((m) => m.id));
      return prev.map((m) => (updatedIds.has(m.id) ? { ...m, readBy: [...m.readBy, employeeId] } : m));
    });
  }, []);

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
  const [map, setMap] = useState<Record<string, Availability>>({});

  useEffect(() => {
    supabase
      .from('availability')
      .select('*')
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        setMap(
          Object.fromEntries(
            data.map((r) => {
              const a = availabilityFromRow(r as Record<string, unknown>);
              return [a.employeeId, a];
            }),
          ),
        );
      });
  }, []);

  const get = useCallback((employeeId: string) => map[employeeId], [map]);

  const upsert = useCallback((a: Availability) => {
    const updated = { ...a, updatedAt: new Date().toISOString() };
    setMap((prev) => ({ ...prev, [a.employeeId]: updated }));
    supabase.from('availability').upsert(availabilityToRow(updated)).then(() => {});
  }, []);

  return useMemo(() => ({ map, get, upsert }), [map, get, upsert]);
}

// ---------------------------------------------------------------------------
// Recipes Test Attempts
// ---------------------------------------------------------------------------

export function useRecipesTestAttempts() {
  const [list, setList] = useState<RecipesTestAttempt[]>([]);

  useEffect(() => {
    supabase
      .from('recipes_test_attempts')
      .select('*')
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        setList(
          data.map((row) => ({
            id: row.id,
            employeeId: row.employee_id,
            startedAt: row.started_at,
            completedAt: row.completed_at ?? undefined,
            questionOrder: row.question_order ?? [],
            answers: row.answers ?? {},
            score: row.score ?? undefined,
            passed: row.passed ?? undefined,
          })),
        );
      });
  }, []);

  const start = useCallback((employeeId: string, allQuestionIds: string[]): RecipesTestAttempt => {
    const shuffled = [...allQuestionIds].sort(() => Math.random() - 0.5);
    const attempt: RecipesTestAttempt = {
      id: `rta-${Date.now()}`,
      employeeId,
      startedAt: new Date().toISOString(),
      questionOrder: shuffled,
      answers: {},
    };
    setList((prev) => [attempt, ...prev]);
    supabase
      .from('recipes_test_attempts')
      .insert({
        id: attempt.id,
        employee_id: attempt.employeeId,
        started_at: attempt.startedAt,
        question_order: attempt.questionOrder,
        answers: attempt.answers,
      })
      .then(() => {});
    return attempt;
  }, []);

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
          supabase
            .from('recipes_test_attempts')
            .update({ answers: updated.answers })
            .eq('id', attemptId)
            .then(() => {});
        }
        return next;
      });
    },
    [],
  );

  const complete = useCallback(
    (attemptId: string, questions: RecipesTestQuestion[]) => {
      setList((prev) =>
        prev.map((a) => {
          if (a.id !== attemptId) return a;
          const correct = questions.filter((q) => a.answers[q.id] === q.correct_answer).length;
          const score = Math.round((correct / questions.length) * 100);
          const completed = {
            ...a,
            completedAt: new Date().toISOString(),
            score,
            passed: score >= RECIPES_TEST_PASSING_SCORE,
          };
          supabase
            .from('recipes_test_attempts')
            .update({
              completed_at: completed.completedAt,
              score: completed.score,
              passed: completed.passed,
              answers: completed.answers,
            })
            .eq('id', attemptId)
            .then(() => {});
          return completed;
        }),
      );
    },
    [],
  );

  const getById = useCallback((id: string) => list.find((a) => a.id === id), [list]);

  const getByEmployee = useCallback(
    (employeeId: string) => list.filter((a) => a.employeeId === employeeId),
    [list],
  );

  const inProgress = useCallback(
    (employeeId: string) => list.find((a) => a.employeeId === employeeId && !a.completedAt),
    [list],
  );

  return useMemo(
    () => ({ attempts: list, start, saveAnswer, complete, getById, getByEmployee, inProgress }),
    [list, start, saveAnswer, complete, getById, getByEmployee, inProgress],
  );
}
