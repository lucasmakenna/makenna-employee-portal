'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle2, XCircle, BookOpen, Trophy, ArrowLeft } from 'lucide-react';
import { STUDY_DECKS, StudyDeck } from '@/data/study-questions';

type Mode = 'pick' | 'flashcard' | 'quiz' | 'results';

export default function StudyPage() {
  const [selectedDeck, setSelectedDeck] = useState<StudyDeck | null>(null);
  const [mode, setMode] = useState<Mode>('pick');
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knewIt, setKnewIt] = useState<boolean[]>([]);
  const [quizMode, setQuizMode] = useState<'flashcard' | 'quiz'>('flashcard');

  function startDeck(deck: StudyDeck, type: 'flashcard' | 'quiz') {
    setSelectedDeck(deck);
    setQuizMode(type);
    setCardIndex(0);
    setFlipped(false);
    setKnewIt([]);
    setMode(type === 'quiz' ? 'quiz' : 'flashcard');
  }

  function handleFlip() {
    setFlipped((v) => !v);
  }

  function handleNext() {
    if (!selectedDeck) return;
    if (cardIndex < selectedDeck.questions.length - 1) {
      setCardIndex((i) => i + 1);
      setFlipped(false);
    } else {
      setMode('pick');
      setSelectedDeck(null);
    }
  }

  function handlePrev() {
    if (cardIndex > 0) {
      setCardIndex((i) => i - 1);
      setFlipped(false);
    }
  }

  function handleKnewIt(knew: boolean) {
    if (!selectedDeck) return;
    const next = [...knewIt, knew];
    setKnewIt(next);
    if (cardIndex < selectedDeck.questions.length - 1) {
      setCardIndex((i) => i + 1);
      setFlipped(false);
    } else {
      setMode('results');
    }
  }

  function reset() {
    setSelectedDeck(null);
    setMode('pick');
    setCardIndex(0);
    setFlipped(false);
    setKnewIt([]);
  }

  // ── RESULTS SCREEN ───────────────────────────────────────────────────────
  if (mode === 'results' && selectedDeck) {
    const score = knewIt.filter(Boolean).length;
    const total = selectedDeck.questions.length;
    const passed = score >= selectedDeck.passingScore;

    return (
      <div className="min-h-screen bg-page flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md card p-8 text-center space-y-5">
          {passed ? (
            <Trophy size={48} className="mx-auto text-amber-400" />
          ) : (
            <XCircle size={48} className="mx-auto text-hibiscus-500" />
          )}
          <h1 className="text-2xl font-bold text-ink-700">
            {passed ? 'Nice work! 🎉' : 'Keep studying!'}
          </h1>
          <p className="text-4xl font-bold text-cyan-500">
            {score} / {total}
          </p>
          <p className="text-sm text-ink-500">
            {passed
              ? `You passed! Need ${selectedDeck.passingScore} to pass — you got ${score}.`
              : `Need ${selectedDeck.passingScore} to pass. You got ${score}. Review the ones you missed and try again.`}
          </p>

          {/* Missed questions */}
          {!passed && (
            <div className="text-left space-y-3 mt-4">
              <p className="text-xs font-bold uppercase tracking-widest text-ink-400">Review these</p>
              {selectedDeck.questions.map((q, i) =>
                knewIt[i] === false ? (
                  <div key={i} className="bg-hibiscus-50 rounded-lg p-3 text-sm">
                    <p className="font-medium text-ink-700 mb-1">{q.question}</p>
                    <p className="text-ink-500">{q.answer}</p>
                  </div>
                ) : null,
              )}
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <button
              className="btn-cyan w-full"
              onClick={() => startDeck(selectedDeck, 'quiz')}
            >
              Try Again
            </button>
            <button className="btn-ghost w-full" onClick={reset}>
              Back to Study Decks
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── FLASHCARD / QUIZ SCREEN ──────────────────────────────────────────────
  if ((mode === 'flashcard' || mode === 'quiz') && selectedDeck) {
    const q = selectedDeck.questions[cardIndex];
    const isLast = cardIndex === selectedDeck.questions.length - 1;
    const isQuiz = mode === 'quiz';

    return (
      <div className="min-h-screen bg-page flex flex-col p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 max-w-2xl mx-auto w-full">
          <button onClick={reset} className="flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-400">
              {isQuiz ? 'Quiz' : 'Flashcards'} · {selectedDeck.emoji} {selectedDeck.sectionName}
            </p>
          </div>
          <p className="text-sm text-ink-400">
            {cardIndex + 1} / {selectedDeck.questions.length}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-2xl mx-auto h-1.5 bg-ink-100 rounded-full mb-8">
          <div
            className="h-full bg-cyan-400 rounded-full transition-all duration-300"
            style={{ width: `${((cardIndex + 1) / selectedDeck.questions.length) * 100}%` }}
          />
        </div>

        {/* Card */}
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col items-center justify-center gap-6">
          <div
            className={`w-full cursor-pointer select-none rounded-2xl shadow-lg transition-all duration-300 ${
              flipped ? 'bg-cyan-50 border-2 border-cyan-300' : 'bg-white border-2 border-ink-100'
            }`}
            onClick={handleFlip}
            style={{ minHeight: 260 }}
          >
            <div className="p-8 flex flex-col items-center justify-center h-full gap-4" style={{ minHeight: 260 }}>
              {!flipped ? (
                <>
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-400">Question</p>
                  <p className="text-xl font-semibold text-ink-700 text-center leading-relaxed">{q.question}</p>
                  <p className="text-xs text-ink-400 mt-4">Tap to reveal answer</p>
                </>
              ) : (
                <>
                  <p className="text-xs font-bold uppercase tracking-widest text-cyan-500">Answer</p>
                  <p className="text-base text-ink-700 text-center leading-relaxed">{q.answer}</p>
                </>
              )}
            </div>
          </div>

          {/* Controls */}
          {isQuiz ? (
            // Quiz mode: only show buttons after flipping
            flipped ? (
              <div className="flex gap-3 w-full">
                <button
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-hibiscus-300 bg-hibiscus-50 text-hibiscus-700 font-semibold py-4 text-sm hover:bg-hibiscus-100 transition-colors"
                  onClick={() => handleKnewIt(false)}
                >
                  <XCircle size={18} /> Didn't Know It
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-300 bg-emerald-50 text-emerald-700 font-semibold py-4 text-sm hover:bg-emerald-100 transition-colors"
                  onClick={() => handleKnewIt(true)}
                >
                  <CheckCircle2 size={18} /> Knew It!
                </button>
              </div>
            ) : (
              <p className="text-sm text-ink-400">Tap the card to see the answer, then mark yourself.</p>
            )
          ) : (
            // Flashcard mode: prev / next
            <div className="flex items-center gap-4 w-full justify-between">
              <button
                className="btn-ghost px-6"
                onClick={handlePrev}
                disabled={cardIndex === 0}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="btn-ghost px-6 flex items-center gap-1"
                onClick={handleFlip}
              >
                <RotateCcw size={16} /> Flip
              </button>
              <button
                className="btn-cyan px-6"
                onClick={handleNext}
              >
                {isLast ? 'Done' : <ChevronRight size={20} />}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── DECK PICKER ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-page p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Link href="/training" className="text-ink-400 hover:text-ink-700">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-ink-700">Study Mode</h1>
            <p className="text-sm text-ink-400">Flashcards and quizzes to help you prep.</p>
          </div>
        </div>

        <div className="space-y-4">
          {STUDY_DECKS.map((deck) => (
            <div key={deck.id} className="card p-6 space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{deck.emoji}</span>
                <div>
                  <h2 className="font-bold text-ink-700">{deck.sectionName}</h2>
                  <p className="text-xs text-ink-400">
                    {deck.questions.length} questions · Pass mark: {deck.passingScore}/{deck.questions.length}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  className="flex-1 flex items-center justify-center gap-2 btn-ghost text-sm"
                  onClick={() => startDeck(deck, 'flashcard')}
                >
                  <BookOpen size={15} /> Flashcards
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 btn-cyan text-sm"
                  onClick={() => startDeck(deck, 'quiz')}
                >
                  <Trophy size={15} /> Take Quiz
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🍹</span>
            <div>
              <h2 className="font-bold text-ink-700">Recipe Fill — Drink Recipes</h2>
              <p className="text-xs text-ink-400">Practice pump counts and ingredients for every drink on the menu.</p>
            </div>
          </div>
          <Link href="/recipe-fill" className="btn-cyan text-sm whitespace-nowrap">
            Practice
          </Link>
        </div>
      </div>
    </div>
  );
}
