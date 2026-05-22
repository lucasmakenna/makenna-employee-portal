'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FlaskConical, CheckCircle, XCircle, Clock, Trophy, ChevronRight, RotateCcw, UserCheck, Trash2 } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useCurrentUser } from '@/lib/auth';
import { useRecipeFillAttempts, useEmployees } from '@/data/store';
import { RECIPE_FILL_QUESTIONS, RECIPE_FILL_META } from '@/data/recipe-fill';
import { RECIPE_FILL_PASSING_SCORE } from '@/types';
import { fullName } from '@/data/employees';
import { format } from 'date-fns';

// ── Test size config ──────────────────────────────────────────────────────────
const TEST_SIZES = [
  { id: 'quick',    label: 'Quick Practice',  drinkCount: 20,  description: '~5–10 min' },
  { id: 'standard', label: 'Standard Test',   drinkCount: 50,  description: '~15–20 min' },
  { id: 'full',     label: 'Full Menu',        drinkCount: 9999, description: 'All 309 drinks' },
] as const;
type TestSizeId = typeof TEST_SIZES[number]['id'];

/** Pick `count` random question IDs, keeping all sizes of a selected drink together */
function sampleQuestions(allQuestions: typeof RECIPE_FILL_QUESTIONS, drinkCount: number): string[] {
  // Group by drink
  const drinkMap = new Map<string, string[]>();
  for (const q of allQuestions) {
    if (!drinkMap.has(q.drink)) drinkMap.set(q.drink, []);
    drinkMap.get(q.drink)!.push(q.id);
  }
  // Shuffle drinks
  const drinks = Array.from(drinkMap.keys()).sort(() => Math.random() - 0.5);
  // Take first N drinks
  const selected = drinks.slice(0, drinkCount);
  // Return all question IDs for those drinks
  return selected.flatMap((d) => drinkMap.get(d)!);
}

export default function RecipeFillPage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { attempts, start, inProgress } = useRecipeFillAttempts();
  const { employees } = useEmployees();
  const [assignTo, setAssignTo] = useState('');
  const [testSize, setTestSize] = useState<TestSizeId>('standard');

  if (!user) return null;

  const myAttempts = attempts.filter((a) => a.employeeId === user.id && a.completedAt);
  const myBest = myAttempts.reduce<number | null>((best, a) => {
    if (a.score == null) return best;
    return best == null || a.score > best ? a.score : best;
  }, null);
  const hasPassed = myAttempts.some((a) => a.passed);
  const activeAttempt = inProgress(user.id);

  const canAssign = ['admin', 'manager', 'lead', 'trainer'].includes(user.role);
  const isManager = user.role === 'admin' || user.role === 'manager';

  const assignableEmployees = employees.filter((e) => e.active && e.id !== user.id);
  const selectedEmployee = assignableEmployees.find((e) => e.id === assignTo);
  const assigneeActiveAttempt = assignTo ? inProgress(assignTo) : undefined;

  const selectedSize = TEST_SIZES.find((s) => s.id === testSize) ?? TEST_SIZES[1];

  function handleStart() {
    if (activeAttempt) {
      router.push('/recipe-fill/take');
      return;
    }
    const ids = sampleQuestions(RECIPE_FILL_QUESTIONS, selectedSize.drinkCount);
    start(user!.id, ids);
    router.push('/recipe-fill/take');
  }

  function handleAssignStart() {
    if (!assignTo) return;
    if (!assigneeActiveAttempt) {
      const ids = sampleQuestions(RECIPE_FILL_QUESTIONS, selectedSize.drinkCount);
      start(assignTo, ids);
    }
    router.push(`/recipe-fill/take?for=${assignTo}`);
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">
            <FlaskConical size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink-800">Barista Test</h1>
            <p className="text-sm text-ink-500 mt-0.5">
              309 drinks · Passing score {RECIPE_FILL_PASSING_SCORE}% · Select the correct pump amounts and ingredients for each drink
            </p>
          </div>
        </div>

        {/* Assign Test Card (trainer+) */}
        {canAssign && (
          <div className="rounded-2xl border-2 border-cyan-200 bg-cyan-50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserCheck size={18} className="text-cyan-600" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-700">Assign Test to a Barista</h2>
            </div>
            <p className="text-sm text-ink-500 mb-4">
              Select an employee, start the test, then hand them the device to complete it.
            </p>
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-48">
                <label className="block text-xs font-semibold text-ink-500 mb-1.5 uppercase tracking-wider">
                  Employee
                </label>
                <select
                  value={assignTo}
                  onChange={(e) => setAssignTo(e.target.value)}
                  className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="">Select a barista…</option>
                  {assignableEmployees.map((emp) => {
                    const empAttempts = attempts.filter((a) => a.employeeId === emp.id && a.completedAt);
                    const passed = empAttempts.some((a) => a.passed);
                    const hasInProgress = !!inProgress(emp.id);
                    return (
                      <option key={emp.id} value={emp.id}>
                        {fullName(emp)}{passed ? ' ✓ Passed' : ''}{hasInProgress ? ' (in progress)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
              <button
                onClick={handleAssignStart}
                disabled={!assignTo}
                className="flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-cyan-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {assigneeActiveAttempt ? (
                  <>
                    <ChevronRight size={16} />
                    Resume for {selectedEmployee ? selectedEmployee.firstName : '…'}
                  </>
                ) : (
                  <>
                    <FlaskConical size={16} />
                    Start for {selectedEmployee ? selectedEmployee.firstName : '…'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Test size selector */}
        {!activeAttempt && (
          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400 mb-3">Test Size</h2>
            <div className="flex flex-wrap gap-2">
              {TEST_SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setTestSize(s.id)}
                  className={`flex flex-col rounded-xl border-2 px-4 py-3 text-left transition ${
                    testSize === s.id
                      ? 'border-cyan-400 bg-cyan-50'
                      : 'border-ink-100 hover:border-cyan-200'
                  }`}
                >
                  <span className="text-sm font-bold text-ink-700">{s.label}</span>
                  <span className="text-xs text-ink-400 mt-0.5">
                    {s.id === 'full' ? 'All 309 drinks' : `${s.drinkCount} drinks`} · {s.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* My Status */}
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400 mb-4">Your Status</h2>
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              {hasPassed ? (
                <CheckCircle size={28} className="text-emerald-500" />
              ) : myBest != null ? (
                <XCircle size={28} className="text-hibiscus-400" />
              ) : (
                <Clock size={28} className="text-ink-300" />
              )}
              <div>
                <div className="text-lg font-bold text-ink-800">
                  {hasPassed ? 'Passed' : myBest != null ? 'Not Passed Yet' : 'Not Started'}
                </div>
                {myBest != null && (
                  <div className="text-sm text-ink-500">Best score: {myBest}%</div>
                )}
              </div>
            </div>

            {myAttempts.length > 0 && (
              <div className="flex gap-6 text-sm text-ink-500">
                <div>
                  <span className="font-semibold text-ink-700">{myAttempts.length}</span> attempt{myAttempts.length !== 1 ? 's' : ''}
                </div>
                <div>
                  Last:{' '}
                  <span className="font-semibold text-ink-700">
                    {format(new Date(myAttempts[0].completedAt!), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            )}

            <div className="ml-auto">
              {activeAttempt ? (
                <button
                  onClick={handleStart}
                  className="flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-cyan-500 transition"
                >
                  <ChevronRight size={16} />
                  Resume Test
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  className="flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-cyan-500 transition"
                >
                  {myAttempts.length > 0 ? <RotateCcw size={16} /> : <FlaskConical size={16} />}
                  {myAttempts.length > 0 ? 'Retake Test' : 'Start Test'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Past Attempts */}
        {myAttempts.length > 0 && (
          <div className="rounded-2xl border border-ink-100 bg-white shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-ink-100">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400">Your Attempts</h2>
            </div>
            <ul className="divide-y divide-ink-100">
              {myAttempts.slice(0, 10).map((attempt) => (
                <li key={attempt.id}>
                  <button
                    onClick={() => router.push(`/recipe-fill/results/${attempt.id}`)}
                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-cyan-50 transition text-left"
                  >
                    {attempt.passed ? (
                      <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle size={18} className="text-hibiscus-400 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-ink-700">
                        Score: {attempt.score}%
                        <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${attempt.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-hibiscus-50 text-hibiscus-600'}`}>
                          {attempt.passed ? 'Pass' : 'Fail'}
                        </span>
                      </div>
                      <div className="text-xs text-ink-400 mt-0.5">
                        {format(new Date(attempt.completedAt!), 'MMM d, yyyy · h:mm a')}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-ink-300 shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Admin: clear all in-progress */}
        {isManager && attempts.some((a) => !a.completedAt) && (
          <div className="rounded-2xl border border-hibiscus-200 bg-hibiscus-50 p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-hibiscus-700">
                {attempts.filter((a) => !a.completedAt).length} in-progress session{attempts.filter((a) => !a.completedAt).length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-hibiscus-500 mt-0.5">These will show as "in progress" in the assign dropdown. Clear them to start fresh.</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('mk-recipe-fill-attempts-v1');
                window.location.reload();
              }}
              className="flex items-center gap-2 rounded-full bg-hibiscus-400 px-4 py-2 text-sm font-semibold text-white hover:bg-hibiscus-500 transition shrink-0"
            >
              <Trash2 size={14} /> Clear all
            </button>
          </div>
        )}

        {/* Team Overview */}
        {isManager && (
          <div className="rounded-2xl border border-ink-100 bg-white shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-ink-100 flex items-center gap-2">
              <Trophy size={16} className="text-cyan-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400">Team Results</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-100 text-xs uppercase tracking-wider text-ink-400">
                    <th className="px-6 py-3 text-left font-semibold">Employee</th>
                    <th className="px-6 py-3 text-left font-semibold">Status</th>
                    <th className="px-6 py-3 text-left font-semibold">Best Score</th>
                    <th className="px-6 py-3 text-left font-semibold">Attempts</th>
                    <th className="px-6 py-3 text-left font-semibold">Last Taken</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {employees
                    .filter((e) => e.active)
                    .map((emp) => {
                      const empAttempts = attempts.filter(
                        (a) => a.employeeId === emp.id && a.completedAt,
                      );
                      const best = empAttempts.reduce<number | null>((b, a) => {
                        if (a.score == null) return b;
                        return b == null || a.score > b ? a.score : b;
                      }, null);
                      const passed = empAttempts.some((a) => a.passed);
                      const last = empAttempts[0];
                      return (
                        <tr key={emp.id} className="hover:bg-cyan-50 transition">
                          <td className="px-6 py-3 font-medium text-ink-700">{fullName(emp)}</td>
                          <td className="px-6 py-3">
                            {empAttempts.length === 0 ? (
                              <span className="text-xs text-ink-400">Not started</span>
                            ) : passed ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                <CheckCircle size={11} /> Passed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-hibiscus-600 bg-hibiscus-50 px-2 py-0.5 rounded-full">
                                <XCircle size={11} /> Not passed
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-3 text-ink-600">{best != null ? `${best}%` : '—'}</td>
                          <td className="px-6 py-3 text-ink-600">{empAttempts.length || '—'}</td>
                          <td className="px-6 py-3 text-ink-500 text-xs">
                            {last ? format(new Date(last.completedAt!), 'MMM d, yyyy') : '—'}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
