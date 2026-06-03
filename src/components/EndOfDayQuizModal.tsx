'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight, Trophy, AlertTriangle, X, BookOpen } from 'lucide-react';

interface Props {
  skillName: string;
  questions: string[];
  /** Parallel to questions — expected answer for each question, shown to trainer after marking. */
  answers?: string[];
  passingScore: number;
  onPass: () => void;
  onClose: () => void;
}

type Answer = 'correct' | 'incorrect' | null;

export default function EndOfDayQuizModal({
  skillName,
  questions,
  answers,
  passingScore,
  onPass,
  onClose,
}: Props) {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [markedAnswers, setMarkedAnswers] = useState<Answer[]>(Array(questions.length).fill(null));
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  const correctCount = markedAnswers.filter((a) => a === 'correct').length;

  const markAnswer = (answer: 'correct' | 'incorrect') => {
    const next = [...markedAnswers];
    next[currentIndex] = answer;
    setMarkedAnswers(next);
    setShowAnswerKey(false);
  };

  const currentAnswer = markedAnswers[currentIndex];
  const currentExpectedAnswer = answers?.[currentIndex];

  const goNext = () => {
    setShowAnswerKey(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setStep('result');
    }
  };

  const handleResult = () => {
    const finalCorrect = markedAnswers.filter((a) => a === 'correct').length;
    if (finalCorrect >= passingScore) {
      onPass();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4 sticky top-0 bg-white z-10">
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-400">End of Day Review</div>
            <h2 className="text-lg font-bold text-ink-700">{skillName}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Intro screen */}
        {step === 'intro' && (
          <div className="p-6">
            <p className="text-sm text-ink-600 mb-4">
              Read each question aloud to the New Hire. After they answer verbally, tap{' '}
              <span className="font-semibold text-emerald-700">Correct</span> or{' '}
              <span className="font-semibold text-red-600">Incorrect</span>.
              {answers && answers.length > 0 && (
                <> Tap <span className="font-semibold text-blue-600">Show Answer Key</span> before marking if you need a reference.</>
              )}
            </p>
            <div className="rounded-xl bg-cyan-50 p-4 mb-6">
              <div className="text-sm font-semibold text-ink-700">
                {questions.length} questions · Pass with {passingScore}/{questions.length} correct
              </div>
            </div>
            <button
              onClick={() => setStep('quiz')}
              className="btn-primary w-full"
            >
              Start Review
            </button>
          </div>
        )}

        {/* Quiz screen */}
        {step === 'quiz' && (
          <div className="p-6">
            {/* Progress dots */}
            <div className="flex gap-1.5 mb-6">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    markedAnswers[i] === 'correct'
                      ? 'bg-emerald-500'
                      : markedAnswers[i] === 'incorrect'
                      ? 'bg-red-400'
                      : i === currentIndex
                      ? 'bg-cyan-400'
                      : 'bg-ink-100'
                  }`}
                />
              ))}
            </div>

            <div className="text-xs text-ink-400 mb-2">
              Question {currentIndex + 1} of {questions.length}
            </div>
            <p className="text-lg font-semibold text-ink-700 mb-5 leading-snug">
              {questions[currentIndex]}
            </p>

            {/* Answer key — trainer taps to reveal before marking */}
            {currentExpectedAnswer && (
              <div className="mb-4">
                {showAnswerKey ? (
                  <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 mb-1.5">
                      <BookOpen size={13} /> Expected Answer
                    </div>
                    <p className="text-sm text-blue-800 leading-snug">{currentExpectedAnswer}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAnswerKey(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition"
                  >
                    <BookOpen size={12} /> Show Answer Key
                  </button>
                )}
              </div>
            )}

            {/* Mark buttons or result */}
            {currentAnswer === null ? (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  onClick={() => markAnswer('correct')}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-300 bg-emerald-50 py-4 text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition"
                >
                  <CheckCircle2 size={18} /> Correct
                </button>
                <button
                  onClick={() => markAnswer('incorrect')}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 py-4 text-sm font-bold text-red-600 hover:bg-red-100 transition"
                >
                  <XCircle size={18} /> Incorrect
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  className={`flex items-center gap-3 rounded-xl p-4 ${
                    currentAnswer === 'correct'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {currentAnswer === 'correct' ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <XCircle size={20} />
                  )}
                  <span className="font-semibold">
                    Marked as {currentAnswer === 'correct' ? 'Correct' : 'Incorrect'}
                  </span>
                  <button
                    onClick={() => {
                      const next = [...markedAnswers];
                      next[currentIndex] = null;
                      setMarkedAnswers(next);
                    }}
                    className="ml-auto text-xs underline opacity-60 hover:opacity-100 transition"
                  >
                    Undo
                  </button>
                </div>
                <button
                  onClick={goNext}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {currentIndex < questions.length - 1 ? (
                    <>Next question <ChevronRight size={16} /></>
                  ) : (
                    'See results'
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Result screen */}
        {step === 'result' && (
          <div className="p-6 text-center">
            {correctCount >= passingScore ? (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <Trophy size={32} className="text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-ink-700">Review Passed!</h3>
                <p className="mt-2 text-sm text-ink-500">
                  {correctCount} of {questions.length} correct — {passingScore} needed to pass
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <AlertTriangle size={32} className="text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-ink-700">Not Quite There</h3>
                <p className="mt-2 text-sm text-ink-500">
                  {correctCount} of {questions.length} correct — need {passingScore} to pass
                </p>
                <p className="mt-1 text-sm text-ink-500">
                  Review the missed questions and try again.
                </p>
              </>
            )}

            {/* Per-question summary with answer key for incorrect */}
            <div className="mt-5 space-y-2 text-left">
              {questions.map((q, i) => (
                <div key={i}>
                  <div
                    className={`flex items-start gap-3 rounded-lg px-3 py-2 text-sm ${
                      markedAnswers[i] === 'correct'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {markedAnswers[i] === 'correct' ? (
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                    ) : (
                      <XCircle size={16} className="mt-0.5 shrink-0" />
                    )}
                    <span className="line-clamp-2 text-xs">{q}</span>
                  </div>
                  {markedAnswers[i] === 'incorrect' && answers?.[i] && (
                    <div className="ml-6 mt-0.5 rounded-b-lg bg-blue-50 px-3 py-2 text-xs text-blue-700 border-l-2 border-blue-300">
                      <span className="font-semibold">Expected: </span>{answers[i]}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleResult}
              className={`mt-6 w-full rounded-xl py-3 text-sm font-bold transition ${
                correctCount >= passingScore
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-ink-700 text-white hover:bg-ink-800'
              }`}
            >
              {correctCount >= passingScore ? 'Mark Complete ✓' : 'Close & Retry Later'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
