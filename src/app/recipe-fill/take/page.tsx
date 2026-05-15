'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { CheckCircle, XCircle, ChevronRight, X, UserCheck } from 'lucide-react';
import { useCurrentUser } from '@/lib/auth';
import { useRecipeFillAttempts, useEmployees } from '@/data/store';
import { RECIPE_FILL_QUESTIONS, RECIPE_FILL_QUESTION_MAP } from '@/data/recipe-fill';
import { fullName } from '@/data/employees';
import type { RecipeFillBlank } from '@/types';

export default function RecipeFillTakePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useCurrentUser();
  const { inProgress, saveAnswer, complete } = useRecipeFillAttempts();
  const { employees } = useEmployees();

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const forEmployeeId = searchParams.get('for');
  const activeEmployeeId = forEmployeeId ?? user?.id;
  const assignedEmployee = forEmployeeId ? employees.find((e) => e.id === forEmployeeId) : null;

  const attempt = activeEmployeeId ? inProgress(activeEmployeeId) : undefined;

  useEffect(() => {
    if (attempt) {
      // Resume: count answered questions (each question has N blanks, all saved at confirm)
      const answeredQuestionIds = new Set(
        Object.keys(attempt.answers).map((key) => key.split('-').slice(0, -1).join('-')),
      );
      const resumeIndex = attempt.questionOrder.findIndex((id) => !answeredQuestionIds.has(id));
      setCurrentIndex(resumeIndex >= 0 ? resumeIndex : attempt.questionOrder.length);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!attempt]);

  useEffect(() => {
    if (!user) return;
    if (!attempt) router.replace('/recipe-fill');
  }, [user, attempt, router]);

  const resetQuestion = useCallback(() => {
    setSelections({});
    setConfirmed(false);
  }, []);

  if (!user || !attempt) return null;

  const total = attempt.questionOrder.length;

  if (currentIndex >= total) {
    complete(attempt.id, RECIPE_FILL_QUESTIONS);
    router.replace(`/recipe-fill/results/${attempt.id}`);
    return null;
  }

  const questionId = attempt.questionOrder[currentIndex];
  const question = RECIPE_FILL_QUESTION_MAP[questionId];
  if (!question) return null;

  const progressPct = Math.round((currentIndex / total) * 100);

  function blankKey(blank: RecipeFillBlank) {
    return `${questionId}-${blank.index}`;
  }

  function allAnswered() {
    return question.blanks.every((b) => (selections[blankKey(b)] ?? '') !== '');
  }

  function handleConfirm() {
    if (!allAnswered() || confirmed) return;
    setConfirmed(true);
    question.blanks.forEach((b) => {
      saveAnswer(attempt!.id, blankKey(b), selections[blankKey(b)] ?? '');
    });
  }

  function handleNext() {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= total) {
      complete(attempt!.id, RECIPE_FILL_QUESTIONS);
      router.push(`/recipe-fill/results/${attempt!.id}`);
      return;
    }
    setCurrentIndex(nextIndex);
    resetQuestion();
  }

  // Group blanks into pairs: [qty, ingredient], [qty, ingredient], ...
  const pairs: [RecipeFillBlank, RecipeFillBlank][] = [];
  for (let i = 0; i < question.blanks.length; i += 2) {
    pairs.push([question.blanks[i], question.blanks[i + 1]]);
  }

  const allCorrect =
    confirmed && question.blanks.every((b) => (selections[blankKey(b)] ?? '') === b.correct);

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
              Question {currentIndex + 1} <span className="font-normal">of {total}</span>
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-ink-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Drink tag */}
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
            {question.drink}
          </span>
          <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-500">
            {question.size}
          </span>
        </div>

        {/* Recipe card with inline dropdowns */}
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-2">
            Fill in the recipe
          </p>

          {pairs.map(([qtyBlank, ingBlank], pairIdx) => {
            const qtyKey = blankKey(qtyBlank);
            const ingKey = blankKey(ingBlank);
            const qtyVal = selections[qtyKey] ?? '';
            const ingVal = selections[ingKey] ?? '';

            const qtyCorrect = qtyVal === qtyBlank.correct;
            const ingCorrect = ingVal === ingBlank.correct;

            return (
              <div key={pairIdx} className="flex flex-wrap items-center gap-2">
                {/* Quantity dropdown */}
                <select
                  value={qtyVal}
                  disabled={confirmed}
                  onChange={(e) => setSelections((prev) => ({ ...prev, [qtyKey]: e.target.value }))}
                  className={clsx(
                    'rounded-xl border-2 px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-100',
                    !confirmed
                      ? qtyVal
                        ? 'border-cyan-300 bg-cyan-50 text-cyan-800'
                        : 'border-ink-200 bg-white text-ink-500'
                      : qtyCorrect
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      : 'border-hibiscus-300 bg-hibiscus-50 text-hibiscus-800',
                  )}
                >
                  <option value="">— qty —</option>
                  {qtyBlank.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <span className="text-sm text-ink-500 font-medium">pumps of</span>

                {/* Ingredient dropdown */}
                <select
                  value={ingVal}
                  disabled={confirmed}
                  onChange={(e) => setSelections((prev) => ({ ...prev, [ingKey]: e.target.value }))}
                  className={clsx(
                    'flex-1 min-w-40 rounded-xl border-2 px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-100',
                    !confirmed
                      ? ingVal
                        ? 'border-cyan-300 bg-cyan-50 text-cyan-800'
                        : 'border-ink-200 bg-white text-ink-500'
                      : ingCorrect
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      : 'border-hibiscus-300 bg-hibiscus-50 text-hibiscus-800',
                  )}
                >
                  <option value="">— ingredient —</option>
                  {ingBlank.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                {/* Feedback icons after confirm */}
                {confirmed && (
                  <div className="flex items-center gap-1">
                    {qtyCorrect && ingCorrect ? (
                      <CheckCircle size={18} className="text-emerald-500" />
                    ) : (
                      <XCircle size={18} className="text-hibiscus-400" />
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Correct answers revealed after wrong */}
          {confirmed && !allCorrect && (
            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 space-y-1">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">Correct Recipe</p>
              {pairs.map(([qtyBlank, ingBlank], pairIdx) => (
                <p key={pairIdx} className="text-sm text-emerald-800">
                  <span className="font-bold">{qtyBlank.correct}</span> pumps of{' '}
                  <span className="font-bold">{ingBlank.correct}</span>
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Feedback + action */}
        <div className="flex items-center justify-between min-h-[44px]">
          {confirmed ? (
            <p className={clsx('text-sm font-semibold', allCorrect ? 'text-emerald-600' : 'text-hibiscus-500')}>
              {allCorrect ? 'Perfect! All correct.' : 'Some blanks were wrong — see the correct recipe above.'}
            </p>
          ) : (
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
              {currentIndex + 1 >= total ? 'See Results' : 'Next Question'}
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
