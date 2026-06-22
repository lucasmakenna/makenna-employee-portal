'use client';

import { Suspense } from 'react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { CheckCircle, XCircle, ChevronRight, X, UserCheck } from 'lucide-react';
import { useCurrentUser } from '@/lib/auth';
import { useRecipeFillAttempts, useEmployees } from '@/data/store';
import { RECIPE_FILL_QUESTIONS, RECIPE_FILL_QUESTION_MAP, RECIPE_FILL_OPTIONS, parseTemplateUnits, computeUnitMatches, correctBlankIndices } from '@/data/recipe-fill';
import { fullName } from '@/data/employees';
import type { RecipeFillBlank, RecipeFillBlankType } from '@/types';

/** Groups question IDs by drink, preserving first-occurrence order from the shuffled list. */
function buildDrinkGroups(questionOrder: string[]) {
  const drinkOrder: string[] = [];
  const byDrink: Record<string, string[]> = {};
  for (const id of questionOrder) {
    const q = RECIPE_FILL_QUESTION_MAP[id];
    if (!q) continue;
    if (!byDrink[q.drink]) {
      drinkOrder.push(q.drink);
      byDrink[q.drink] = [];
    }
    byDrink[q.drink].push(id);
  }
  return drinkOrder.map((drink) => ({ drink, questionIds: byDrink[drink] }));
}

/** Derive S/M/L/XL labels from a drink's actual ranked sizes, not hardcoded oz values. */
const SIZE_RANK_LABELS: Record<number, string[]> = {
  1: [''],
  2: ['S', 'L'],
  3: ['S', 'M', 'L'],
  4: ['S', 'M', 'L', 'XL'],
};
function getSizeLabels(sizes: string[]): Record<string, string> {
  const sorted = [...sizes].sort((a, b) => parseInt(a) - parseInt(b));
  const labels = SIZE_RANK_LABELS[sorted.length] ?? sorted.map((_, i) => `Size ${i + 1}`);
  return Object.fromEntries(sorted.map((s, i) => [s, labels[i]]));
}

function blankKey(questionId: string, blank: RecipeFillBlank) {
  return `${questionId}-${blank.index}`;
}

function RecipeFillTakeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useCurrentUser();
  const { inProgress, saveAnswer, complete } = useRecipeFillAttempts();
  const { employees } = useEmployees();

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

  const forEmployeeId = searchParams.get('for');
  const activeEmployeeId = forEmployeeId ?? user?.id;
  const assignedEmployee = forEmployeeId ? employees.find((e) => e.id === forEmployeeId) : null;

  const attempt = activeEmployeeId ? inProgress(activeEmployeeId) : undefined;

  // Build drink groups once per attempt
  const drinkGroups = useMemo(
    () => (attempt ? buildDrinkGroups(attempt.questionOrder) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [attempt?.id],
  );
  const totalGroups = drinkGroups.length;

  // Resume: find first group that has any unanswered questions
  useEffect(() => {
    if (!attempt || drinkGroups.length === 0) return;
    const answeredKeys = new Set(Object.keys(attempt.answers));
    const resumeIdx = drinkGroups.findIndex((g) =>
      g.questionIds.some((qId) => {
        const q = RECIPE_FILL_QUESTION_MAP[qId];
        return q?.blanks.some((b) => !answeredKeys.has(blankKey(qId, b)));
      }),
    );
    setCurrentGroupIndex(resumeIdx >= 0 ? resumeIdx : drinkGroups.length);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!attempt, drinkGroups.length]);

  useEffect(() => {
    if (!user) return;
    if (!attempt) router.replace('/recipe-fill');
  }, [user, attempt, router]);

  const resetGroup = useCallback(() => {
    setSelections({});
    setConfirmed(false);
  }, []);

  if (!user || !attempt) return null;

  if (currentGroupIndex >= totalGroups) {
    complete(attempt.id, RECIPE_FILL_QUESTIONS);
    router.replace(`/recipe-fill/results/${attempt.id}`);
    return null;
  }

  const group = drinkGroups[currentGroupIndex];
  const groupQuestions = group.questionIds.map((id) => RECIPE_FILL_QUESTION_MAP[id]).filter(Boolean);

  // Sort sizes smallest → largest by oz value
  const sortedQuestions = [...groupQuestions].sort(
    (a, b) => parseInt(a.size) - parseInt(b.size),
  );
  // Build per-drink size labels (relative ranking, not fixed oz mapping)
  const sizeLabels = getSizeLabels(sortedQuestions.map((q) => q.size));

  const progressPct = Math.round((currentGroupIndex / totalGroups) * 100);

  function allAnswered() {
    return sortedQuestions.every((q) =>
      q.blanks.every((b) => (selections[blankKey(q.id, b)] ?? '') !== ''),
    );
  }

  function handleConfirm() {
    if (!allAnswered() || confirmed) return;
    setConfirmed(true);
    sortedQuestions.forEach((q) => {
      q.blanks.forEach((b) => {
        saveAnswer(attempt!.id, blankKey(q.id, b), selections[blankKey(q.id, b)] ?? '');
      });
    });
  }

  function handleNext() {
    const next = currentGroupIndex + 1;
    if (next >= totalGroups) {
      complete(attempt!.id, RECIPE_FILL_QUESTIONS);
      router.push(`/recipe-fill/results/${attempt!.id}`);
      return;
    }
    setCurrentGroupIndex(next);
    resetGroup();
  }

  const allGroupCorrect =
    confirmed &&
    sortedQuestions.every((q) => {
      const units = parseTemplateUnits(q.template, q.blanks);
      return computeUnitMatches(units, (b) => selections[blankKey(q.id, b)] ?? '').every(Boolean);
    });

  return (
    <div className="min-h-screen bg-page">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-ink-100 bg-white px-4 py-3">
        <img src="/logo.png" alt="Makenna Koffee" className="h-8 w-auto" />
        <button
          onClick={() => router.push('/recipe-fill')}
          className="flex items-center gap-2 rounded-full border border-ink-200 px-4 py-1.5 text-sm font-semibold text-ink-600 hover:bg-ink-50 transition"
        >
          <X size={15} /> Exit test
        </button>
      </header>

      <div className="max-w-2xl mx-auto space-y-6 p-6">
        {/* Hand-off banner */}
        {assignedEmployee && (
          <div className="flex items-center gap-3 rounded-xl bg-cyan-50 border border-cyan-200 px-4 py-3">
            <UserCheck size={18} className="text-cyan-600 shrink-0" />
            <p className="text-sm text-cyan-800">
              <span className="font-semibold">{fullName(assignedEmployee)}</span> is taking this test — their score will be saved to their record.
            </p>
          </div>
        )}

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-ink-500">
            <span className="font-semibold text-ink-700">
              Drink {currentGroupIndex + 1} <span className="font-normal">of {totalGroups}</span>
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-ink-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Drink name */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
            {group.drink}
          </span>
          <span className="text-xs text-ink-400">
            {sortedQuestions.map((q) => sizeLabels[q.size]).join(' · ')}
          </span>
        </div>

        {/* Recipe card — one section per size */}
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft space-y-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            Fill in the recipe for each size
          </p>

          {sortedQuestions.map((q) => {
            const units = parseTemplateUnits(q.template, q.blanks);
            const getVal = (b: RecipeFillBlank) => selections[blankKey(q.id, b)] ?? '';
            const correctIdx = confirmed ? correctBlankIndices(q, getVal) : new Set<number>();

            const sizeAllCorrect = confirmed && q.blanks.every((b) => correctIdx.has(b.index));

            return (
              <div key={q.id} className="space-y-3">
                {/* Size header */}
                <div className="flex items-center gap-2">
                  <span className={clsx(
                    'rounded-full px-2.5 py-0.5 text-xs font-bold',
                    !confirmed
                      ? 'bg-ink-100 text-ink-600'
                      : sizeAllCorrect
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-hibiscus-100 text-hibiscus-700',
                  )}>
                    {sizeLabels[q.size]} ({q.size})
                  </span>
                  {confirmed && (
                    sizeAllCorrect
                      ? <CheckCircle size={15} className="text-emerald-500" />
                      : <XCircle size={15} className="text-hibiscus-400" />
                  )}
                </div>

                {/* Ingredient rows */}
                <div className="space-y-2 pl-1">
                  {units.map((unit, unitIdx) => (
                    <div key={unitIdx} className="flex flex-wrap items-center gap-1.5">
                      {unit.parts[0] && <span className="text-sm text-ink-500 font-medium">{unit.parts[0]}</span>}
                      {unit.blanks.map((blank, blankIdx) => {
                        const key = blankKey(q.id, blank);
                        const val = selections[key] ?? '';
                        const isCorrect = correctIdx.has(blank.index);
                        return (
                          <span key={blank.index} className="flex items-center gap-1.5">
                            <select
                              value={val}
                              disabled={confirmed}
                              onChange={(e) => setSelections((prev) => ({ ...prev, [key]: e.target.value }))}
                              className={clsx(
                                'rounded-xl border-2 px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-100',
                                blank.type === 'quantity' ? '' : 'flex-1 min-w-40',
                                !confirmed
                                  ? val ? 'border-cyan-300 bg-cyan-50 text-cyan-800' : 'border-ink-200 bg-white text-ink-500'
                                  : isCorrect ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-hibiscus-300 bg-hibiscus-50 text-hibiscus-800',
                              )}
                            >
                              <option value="">{blank.type === 'quantity' ? '— qty —' : '— select —'}</option>
                              {RECIPE_FILL_OPTIONS[blank.type as RecipeFillBlankType].map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                            {unit.parts[blankIdx + 1] && (
                              <span className="text-sm text-ink-500 font-medium">{unit.parts[blankIdx + 1]}</span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Correct answers revealed after wrong */}
                {confirmed && !sizeAllCorrect && (
                  <div className="ml-1 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 space-y-1">
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">Correct — {sizeLabels[q.size]}</p>
                    {units.map((unit, unitIdx) => (
                      <p key={unitIdx} className="text-sm text-emerald-800">
                        {unit.parts[0]}
                        {unit.blanks.map((blank, blankIdx) => (
                          <span key={blank.index}>
                            <span className="font-bold">{blank.correct}</span>
                            {unit.parts[blankIdx + 1]}
                          </span>
                        ))}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Feedback + action */}
        <div className="flex items-center justify-between min-h-[44px]">
          {confirmed ? (() => {
            // Count correct units (a unit = all its blanks correct) across all sizes
            let totalUnits = 0;
            let correctUnits = 0;
            sortedQuestions.forEach((q) => {
              const units = parseTemplateUnits(q.template, q.blanks);
              const matches = computeUnitMatches(units, (b) => selections[blankKey(q.id, b)] ?? '');
              totalUnits += units.length;
              correctUnits += matches.filter(Boolean).length;
            });
            return (
              <p className={clsx('text-sm font-semibold', correctUnits === totalUnits ? 'text-emerald-600' : 'text-hibiscus-500')}>
                {correctUnits}/{totalUnits} answers correct
              </p>
            );
          })() : (
            <span />
          )}

          {!confirmed ? (
            <button
              onClick={handleConfirm}
              disabled={!allAnswered()}
              className={clsx(
                'flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition',
                allAnswered()
                  ? 'bg-cyan-400 text-white hover:bg-cyan-500 shadow-soft'
                  : 'bg-ink-100 text-ink-400 cursor-not-allowed',
              )}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-cyan-500 transition"
            >
              {currentGroupIndex + 1 >= totalGroups ? 'See Results' : 'Next Drink'}
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RecipeFillTakePage() {
  return (
    <Suspense fallback={null}>
      <RecipeFillTakeInner />
    </Suspense>
  );
}
