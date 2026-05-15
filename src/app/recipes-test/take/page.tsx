'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { CheckCircle, XCircle, ChevronRight, X, UserCheck } from 'lucide-react';
import { useCurrentUser } from '@/lib/auth';
import { useRecipesTestAttempts, useEmployees } from '@/data/store';
import { RECIPES_TEST_QUESTIONS, RECIPES_QUESTION_MAP } from '@/data/recipes-test';
import { fullName } from '@/data/employees';
import type { RecipesTestAnswer } from '@/types';

const OPTION_LABELS: RecipesTestAnswer[] = ['a', 'b', 'c', 'd'];

export default function RecipesTestTakePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useCurrentUser();
  const { inProgress, saveAnswer, complete } = useRecipesTestAttempts();
  const { employees } = useEmployees();

  const [selected, setSelected] = useState<RecipesTestAnswer | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  // Track index locally so the question doesn't jump the moment saveAnswer updates the store
  const [currentIndex, setCurrentIndex] = useState(0);

  // If ?for=employeeId is set, the trainer assigned this to someone else
  const forEmployeeId = searchParams.get('for');
  const activeEmployeeId = forEmployeeId ?? user?.id;
  const assignedEmployee = forEmployeeId
    ? employees.find((e) => e.id === forEmployeeId)
    : null;

  const attempt = activeEmployeeId ? inProgress(activeEmployeeId) : undefined;

  // Seed currentIndex from saved answers on first load (handles resume)
  useEffect(() => {
    if (attempt) {
      setCurrentIndex(Object.keys(attempt.answers).length);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!attempt]);

  useEffect(() => {
    if (!user) return;
    if (!attempt) {
      router.replace('/recipes-test');
    }
  }, [user, attempt, router]);

  if (!user || !attempt) return null;

  const total = attempt.questionOrder.length;

  if (currentIndex >= total) {
    complete(attempt.id, RECIPES_TEST_QUESTIONS);
    router.replace(`/recipes-test/results/${attempt.id}`);
    return null;
  }

  const questionId = attempt.questionOrder[currentIndex];
  const question = RECIPES_QUESTION_MAP[questionId];

  if (!question) return null;

  const progressPct = Math.round((currentIndex / total) * 100);
  const correctSoFar = RECIPES_TEST_QUESTIONS.filter(
    (q) => attempt.answers[q.id] === q.correct_answer,
  ).length;

  function handleSelect(answer: RecipesTestAnswer) {
    if (confirmed) return;
    setSelected(answer);
  }

  function handleConfirm() {
    if (!selected || confirmed) return;
    setConfirmed(true);
    saveAnswer(attempt!.id, questionId, selected);
  }

  function handleNext() {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= total) {
      complete(attempt!.id, RECIPES_TEST_QUESTIONS);
      router.push(`/recipes-test/results/${attempt!.id}`);
      return;
    }
    setCurrentIndex(nextIndex);
    setSelected(null);
    setConfirmed(false);
  }

  const isCorrect = confirmed && selected === question.correct_answer;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Hand-off banner */}
      {assignedEmployee && (
        <div className="flex items-center gap-3 rounded-xl bg-cyan-50 border border-cyan-200 px-4 py-3">
          <UserCheck size={18} className="text-cyan-600 shrink-0" />
          <p className="text-sm text-cyan-800">
            <span className="font-semibold">{fullName(assignedEmployee)}</span> is taking this test — their score will be saved to their record.
          </p>
        </div>
      )}

      {/* Progress bar + header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-ink-500">
          <span className="font-semibold text-ink-700">
            Question {currentIndex + 1} <span className="font-normal">of {total}</span>
          </span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-600 font-semibold">{correctSoFar} correct</span>
            <button
              onClick={() => router.push('/recipes-test')}
              className="text-ink-400 hover:text-ink-700 transition"
              title="Exit test"
            >
              <X size={18} />
            </button>
          </div>
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

      {/* Question */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
        <p className="text-base font-semibold text-ink-800 leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Answer options */}
      <div className="space-y-3">
        {OPTION_LABELS.map((opt) => {
          const text = question.options[opt];
          const isSelected = selected === opt;
          const isCorrectOption = opt === question.correct_answer;

          let bg = 'bg-white hover:bg-cyan-50 border-ink-100';
          let textColor = 'text-ink-700';
          let labelBg = 'bg-ink-100 text-ink-500';
          let icon = null;

          if (confirmed) {
            if (isCorrectOption) {
              bg = 'bg-emerald-50 border-emerald-300';
              textColor = 'text-emerald-800';
              labelBg = 'bg-emerald-400 text-white';
              icon = <CheckCircle size={18} className="text-emerald-500 shrink-0" />;
            } else if (isSelected && !isCorrectOption) {
              bg = 'bg-hibiscus-50 border-hibiscus-300';
              textColor = 'text-hibiscus-800';
              labelBg = 'bg-hibiscus-400 text-white';
              icon = <XCircle size={18} className="text-hibiscus-400 shrink-0" />;
            } else {
              bg = 'bg-ink-50 border-ink-100';
              textColor = 'text-ink-400';
              labelBg = 'bg-ink-100 text-ink-400';
            }
          } else if (isSelected) {
            bg = 'bg-cyan-50 border-cyan-300';
            textColor = 'text-cyan-800';
            labelBg = 'bg-cyan-400 text-white';
          }

          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={confirmed}
              className={clsx(
                'w-full flex items-center gap-4 rounded-xl border-2 px-4 py-4 text-left transition',
                bg,
                !confirmed && 'cursor-pointer',
                confirmed && 'cursor-default',
              )}
            >
              <span
                className={clsx(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase',
                  labelBg,
                )}
              >
                {opt}
              </span>
              <span className={clsx('flex-1 text-sm font-medium leading-snug', textColor)}>
                {text}
              </span>
              {icon}
            </button>
          );
        })}
      </div>

      {/* Feedback + action */}
      <div className="flex items-center justify-between min-h-[44px]">
        {confirmed ? (
          <p className={clsx('text-sm font-semibold', isCorrect ? 'text-emerald-600' : 'text-hibiscus-500')}>
            {isCorrect
              ? 'Correct!'
              : `Correct answer: ${question.correct_answer.toUpperCase()}`}
          </p>
        ) : (
          <span />
        )}

        {!confirmed ? (
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className={clsx(
              'flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition',
              selected
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
  );
}
