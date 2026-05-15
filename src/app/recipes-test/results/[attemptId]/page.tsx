'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, RotateCcw, BookOpen } from 'lucide-react';
import { useCurrentUser } from '@/lib/auth';
import { useRecipesTestAttempts } from '@/data/store';
import { RECIPES_TEST_QUESTIONS, RECIPES_QUESTION_MAP } from '@/data/recipes-test';
import { RECIPES_TEST_PASSING_SCORE } from '@/types';
import { format } from 'date-fns';

export default function RecipesTestResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useCurrentUser();
  const { getById, start, complete } = useRecipesTestAttempts();
  const [expandedDrinks, setExpandedDrinks] = useState<Set<string>>(new Set());

  const attemptId = params.attemptId as string;
  const attempt = getById(attemptId);

  useEffect(() => {
    if (!attempt) return;
    // If the attempt is complete but score wasn't computed yet, compute it now
    if (attempt.completedAt && attempt.score == null) {
      complete(attemptId, RECIPES_TEST_QUESTIONS);
    }
  }, [attempt, attemptId, complete]);

  if (!user || !attempt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4 text-ink-400">
        <p>Results not found.</p>
        <button
          onClick={() => router.push('/recipes-test')}
          className="text-cyan-600 underline text-sm"
        >
          Back to Barista Test
        </button>
      </div>
    );
  }

  const questions = attempt.questionOrder.map((id) => RECIPES_QUESTION_MAP[id]).filter(Boolean);
  const totalAnswered = Object.keys(attempt.answers).length;
  const correctCount = questions.filter(
    (q) => attempt.answers[q.id] === q.correct_answer,
  ).length;
  const score = attempt.score ?? Math.round((correctCount / questions.length) * 100);
  const passed = attempt.passed ?? score >= RECIPES_TEST_PASSING_SCORE;

  // Group missed questions by drink
  const missed = questions.filter((q) => attempt.answers[q.id] !== q.correct_answer);
  const missedByDrink = missed.reduce<Record<string, typeof missed>>((acc, q) => {
    if (!acc[q.drink]) acc[q.drink] = [];
    acc[q.drink].push(q);
    return acc;
  }, {});

  // Group all questions by drink for score breakdown
  const byDrink = RECIPES_TEST_QUESTIONS.reduce<Record<string, { total: number; correct: number }>>((acc, q) => {
    if (!acc[q.drink]) acc[q.drink] = { total: 0, correct: 0 };
    acc[q.drink].total++;
    if (attempt.answers[q.id] === q.correct_answer) acc[q.drink].correct++;
    return acc;
  }, {});

  const drinksSorted = Object.entries(byDrink).sort(([, a], [, b]) => {
    const aScore = a.correct / a.total;
    const bScore = b.correct / b.total;
    return aScore - bScore; // worst first
  });

  function toggleDrink(drink: string) {
    setExpandedDrinks((prev) => {
      const next = new Set(prev);
      if (next.has(drink)) next.delete(drink);
      else next.add(drink);
      return next;
    });
  }

  function handleRetake() {
    const newAttempt = start(user!.id, RECIPES_TEST_QUESTIONS.map((q) => q.id));
    if (newAttempt) router.push('/recipes-test/take');
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Score hero */}
      <div
        className={clsx(
          'rounded-2xl p-8 text-center shadow-soft',
          passed ? 'bg-emerald-50 border border-emerald-200' : 'bg-hibiscus-50 border border-hibiscus-200',
        )}
      >
        {passed ? (
          <CheckCircle size={48} className="text-emerald-500 mx-auto mb-3" />
        ) : (
          <XCircle size={48} className="text-hibiscus-400 mx-auto mb-3" />
        )}
        <div className="text-5xl font-black text-ink-800 mb-1">{score}%</div>
        <div className="text-lg font-semibold text-ink-600 mb-1">
          {correctCount} / {questions.length} correct
        </div>
        <div
          className={clsx(
            'inline-block rounded-full px-4 py-1 text-sm font-bold mt-2',
            passed
              ? 'bg-emerald-500 text-white'
              : 'bg-hibiscus-400 text-white',
          )}
        >
          {passed ? 'PASSED' : 'NOT PASSED'}
        </div>
        <p className="text-sm text-ink-500 mt-3">
          {passed
            ? 'Great work! You know your recipes.'
            : `You need ${RECIPES_TEST_PASSING_SCORE}% to pass. Keep practicing and try again.`}
        </p>
        {attempt.completedAt && (
          <p className="text-xs text-ink-400 mt-2">
            Completed {format(new Date(attempt.completedAt), 'MMM d, yyyy · h:mm a')}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={handleRetake}
          className="flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-cyan-500 transition"
        >
          <RotateCcw size={15} />
          Retake Test
        </button>
        <button
          onClick={() => router.push('/recipes-test')}
          className="flex items-center gap-2 rounded-full border border-ink-200 px-5 py-2.5 text-sm font-semibold text-ink-600 hover:bg-ink-50 transition"
        >
          <BookOpen size={15} />
          Back to Overview
        </button>
      </div>

      {/* Score by drink */}
      <div className="rounded-2xl border border-ink-100 bg-white shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-ink-100">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400">Score by Drink</h2>
          <p className="text-xs text-ink-400 mt-0.5">Sorted by weakest first</p>
        </div>
        <ul className="divide-y divide-ink-100">
          {drinksSorted.map(([drink, stats]) => {
            const pct = Math.round((stats.correct / stats.total) * 100);
            const drinkMissed = missedByDrink[drink] || [];
            const isExpanded = expandedDrinks.has(drink);

            return (
              <li key={drink}>
                <button
                  onClick={() => drinkMissed.length > 0 && toggleDrink(drink)}
                  className={clsx(
                    'w-full px-6 py-3 flex items-center gap-4 text-left',
                    drinkMissed.length > 0 && 'hover:bg-cyan-50 transition cursor-pointer',
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-ink-700 truncate">{drink}</span>
                      <span className={clsx(
                        'text-xs font-bold ml-4 shrink-0',
                        pct === 100 ? 'text-emerald-600' : pct >= RECIPES_TEST_PASSING_SCORE ? 'text-cyan-600' : 'text-hibiscus-500',
                      )}>
                        {stats.correct}/{stats.total}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-ink-100 overflow-hidden">
                      <div
                        className={clsx(
                          'h-full rounded-full',
                          pct === 100 ? 'bg-emerald-400' : pct >= RECIPES_TEST_PASSING_SCORE ? 'bg-cyan-400' : 'bg-hibiscus-400',
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  {drinkMissed.length > 0 && (
                    <div className="shrink-0 text-ink-300">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  )}
                </button>

                {/* Missed questions for this drink */}
                {isExpanded && drinkMissed.length > 0 && (
                  <div className="bg-ink-50 px-6 pb-4 space-y-4">
                    {drinkMissed.map((q) => (
                      <div key={q.id} className="pt-4 border-t border-ink-100 first:border-t-0 first:pt-0">
                        <p className="text-sm font-medium text-ink-700 mb-2">{q.question}</p>
                        <div className="space-y-1">
                          {(['a', 'b', 'c', 'd'] as const).map((opt) => {
                            const isCorrectOpt = opt === q.correct_answer;
                            const wasSelected = attempt.answers[q.id] === opt;
                            return (
                              <div
                                key={opt}
                                className={clsx(
                                  'flex items-start gap-2 rounded-lg px-3 py-2 text-xs',
                                  isCorrectOpt
                                    ? 'bg-emerald-50 text-emerald-800'
                                    : wasSelected
                                    ? 'bg-hibiscus-50 text-hibiscus-700'
                                    : 'text-ink-400',
                                )}
                              >
                                <span className="font-bold uppercase shrink-0">{opt}.</span>
                                <span className="flex-1">{q.options[opt]}</span>
                                {isCorrectOpt && <CheckCircle size={13} className="text-emerald-500 shrink-0 mt-0.5" />}
                                {wasSelected && !isCorrectOpt && <XCircle size={13} className="text-hibiscus-400 shrink-0 mt-0.5" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
