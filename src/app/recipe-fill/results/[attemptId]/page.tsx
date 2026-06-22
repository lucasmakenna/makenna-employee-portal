'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, RotateCcw, FlaskConical } from 'lucide-react';
import { useCurrentUser } from '@/lib/auth';
import { useRecipeFillAttempts } from '@/data/store';
import { RECIPE_FILL_QUESTIONS, RECIPE_FILL_QUESTION_MAP, parseTemplateUnits, computeUnitMatches } from '@/data/recipe-fill';
import { RECIPE_FILL_PASSING_SCORE } from '@/types';
import { format } from 'date-fns';

export default function RecipeFillResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useCurrentUser();
  const { getById, start, complete } = useRecipeFillAttempts();
  const [expandedDrinks, setExpandedDrinks] = useState<Set<string>>(new Set());

  const attemptId = params.attemptId as string;
  const attempt = getById(attemptId);

  useEffect(() => {
    if (!attempt) return;
    if (attempt.completedAt && attempt.score == null) {
      complete(attemptId, RECIPE_FILL_QUESTIONS);
    }
  }, [attempt, attemptId, complete]);

  if (!user || !attempt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4 text-ink-400">
        <p>Results not found.</p>
        <button onClick={() => router.push('/recipe-fill')} className="text-cyan-600 underline text-sm">
          Back to Barista Test
        </button>
      </div>
    );
  }

  const questions = attempt.questionOrder.map((id) => RECIPE_FILL_QUESTION_MAP[id]).filter(Boolean);

  // Score by blank accuracy — interchangeable flavor pumps are graded as a
  // set, not position-by-position (order never matters for "2 pumps of
  // peach + 1 pump of vanilla" vs "1 pump of vanilla + 2 pumps of peach").
  let totalBlanks = 0;
  let correctBlanks = 0;
  const questionUnitMatches = new Map<string, boolean[]>();
  for (const q of questions) {
    const units = parseTemplateUnits(q.template, q.blanks);
    const matches = computeUnitMatches(units, (b) => attempt.answers[`${q.id}-${b.index}`] ?? '');
    questionUnitMatches.set(q.id, matches);
    units.forEach((u, i) => {
      totalBlanks += u.blanks.length;
      if (matches[i]) correctBlanks += u.blanks.length;
    });
  }
  const score = attempt.score ?? (totalBlanks > 0 ? Math.round((correctBlanks / totalBlanks) * 100) : 0);
  const passed = attempt.passed ?? score >= RECIPE_FILL_PASSING_SCORE;

  // A question is "missed" if any of its units didn't match
  const missed = questions.filter((q) => (questionUnitMatches.get(q.id) ?? []).some((m) => !m));
  const missedByDrink = missed.reduce<Record<string, typeof missed>>((acc, q) => {
    if (!acc[q.drink]) acc[q.drink] = [];
    acc[q.drink].push(q);
    return acc;
  }, {});

  function toggleDrink(drink: string) {
    setExpandedDrinks((prev) => {
      const next = new Set(prev);
      next.has(drink) ? next.delete(drink) : next.add(drink);
      return next;
    });
  }

  function handleRetake() {
    start(user!.id, RECIPE_FILL_QUESTIONS.map((q) => q.id));
    router.push('/recipe-fill/take');
  }

  return (
    <div className="min-h-screen bg-page">
      <header className="flex items-center justify-between border-b border-ink-100 bg-white px-4 py-3">
        <img src="/logo.png" alt="Makenna Koffee" className="h-8 w-auto" />
        <button
          onClick={() => router.push('/recipe-fill')}
          className="flex items-center gap-2 rounded-full border border-ink-200 px-4 py-1.5 text-sm font-semibold text-ink-600 hover:bg-ink-50 transition"
        >
          Back to Test Home
        </button>
      </header>

      <div className="max-w-2xl mx-auto space-y-6 p-6">
        {/* Score card */}
        <div className={clsx(
          'rounded-2xl border-2 p-8 text-center',
          passed ? 'border-emerald-300 bg-emerald-50' : 'border-hibiscus-300 bg-hibiscus-50',
        )}>
          {passed ? (
            <CheckCircle size={48} className="mx-auto text-emerald-500 mb-3" />
          ) : (
            <XCircle size={48} className="mx-auto text-hibiscus-400 mb-3" />
          )}
          <div className={clsx('text-5xl font-black mb-1', passed ? 'text-emerald-700' : 'text-hibiscus-600')}>
            {score}%
          </div>
          <div className={clsx('text-lg font-bold', passed ? 'text-emerald-700' : 'text-hibiscus-600')}>
            {passed ? 'Passed!' : 'Not Passed Yet'}
          </div>
          <p className={clsx('text-sm mt-1', passed ? 'text-emerald-600' : 'text-hibiscus-500')}>
            Passing score: {RECIPE_FILL_PASSING_SCORE}%
          </p>
          {attempt.completedAt && (
            <p className="text-xs text-ink-400 mt-3">
              Completed {format(new Date(attempt.completedAt), 'MMM d, yyyy · h:mm a')}
            </p>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Questions', value: questions.length },
            { label: 'Blanks Correct', value: `${correctBlanks} / ${totalBlanks}` },
            { label: 'Drinks Missed', value: Object.keys(missedByDrink).length },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-ink-100 bg-white p-4 text-center shadow-soft">
              <div className="text-2xl font-bold text-ink-800">{value}</div>
              <div className="text-xs text-ink-400 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Missed drinks breakdown */}
        {missed.length > 0 && (
          <div className="rounded-2xl border border-ink-100 bg-white shadow-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-ink-100">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400">
                Drinks to Review ({Object.keys(missedByDrink).length})
              </h2>
            </div>
            <ul className="divide-y divide-ink-100">
              {Object.entries(missedByDrink).map(([drink, qs]) => {
                const expanded = expandedDrinks.has(drink);
                return (
                  <li key={drink}>
                    <button
                      onClick={() => toggleDrink(drink)}
                      className="w-full flex items-center gap-3 px-6 py-4 hover:bg-ink-50 transition text-left"
                    >
                      <XCircle size={16} className="text-hibiscus-400 shrink-0" />
                      <span className="flex-1 text-sm font-medium text-ink-700">{drink}</span>
                      <span className="text-xs text-ink-400">{qs.length} size{qs.length !== 1 ? 's' : ''} wrong</span>
                      {expanded ? (
                        <ChevronUp size={14} className="text-ink-300" />
                      ) : (
                        <ChevronDown size={14} className="text-ink-300" />
                      )}
                    </button>

                    {expanded && (
                      <div className="px-6 pb-4 space-y-3">
                        {qs.map((q) => {
                          const units = parseTemplateUnits(q.template, q.blanks);
                          const matches = questionUnitMatches.get(q.id) ?? [];
                          return (
                            <div key={q.id} className="rounded-xl border border-ink-100 bg-ink-50 p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-semibold text-cyan-700 bg-cyan-100 rounded-full px-2 py-0.5">
                                  {q.size}
                                </span>
                              </div>
                              <div className="space-y-1.5">
                                {units.map((unit, unitIdx) => {
                                  const lineCorrect = matches[unitIdx] ?? false;
                                  const theirs = unit.parts
                                    .slice(0, 1)
                                    .concat(
                                      unit.blanks.flatMap((b, i) => [
                                        attempt.answers[`${q.id}-${b.index}`] ?? '—',
                                        unit.parts[i + 1] ?? '',
                                      ]),
                                    )
                                    .join('');
                                  const correctText = unit.parts
                                    .slice(0, 1)
                                    .concat(unit.blanks.flatMap((b, i) => [b.correct, unit.parts[i + 1] ?? '']))
                                    .join('');
                                  return (
                                    <div key={unitIdx} className="grid grid-cols-2 gap-3 text-xs">
                                      <div>
                                        <span className="text-ink-400">Your answer: </span>
                                        <span className={clsx('font-semibold', lineCorrect ? 'text-emerald-700' : 'text-hibiscus-600')}>
                                          {theirs}
                                        </span>
                                      </div>
                                      {!lineCorrect && (
                                        <div>
                                          <span className="text-ink-400">Correct: </span>
                                          <span className="font-semibold text-emerald-700">
                                            {correctText}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRetake}
            className="flex items-center gap-2 rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-50 shadow-soft transition"
          >
            <RotateCcw size={16} /> Retake Test
          </button>
          <button
            onClick={() => router.push('/recipe-fill')}
            className="flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-cyan-500 transition"
          >
            <FlaskConical size={16} /> Barista Test Home
          </button>
        </div>
      </div>
    </div>
  );
}
