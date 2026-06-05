'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowLeft, Shuffle } from 'lucide-react';
import allCards from '@/data/study-recipe-cards.json';

interface RecipeCard {
  id: string;
  drink: string;
  recipe: string;
  category: string;
}

const CATEGORIES = [
  { id: 'all',                   label: 'All Drinks',            emoji: '🍹' },
  { id: 'Supremes — Iced',       label: 'Supremes — Iced',       emoji: '🧊' },
  { id: 'Supremes — Hot',        label: 'Supremes — Hot',        emoji: '☕' },
  { id: 'Chillers & Blended',    label: 'Chillers & Blended',    emoji: '🌀' },
  { id: 'Cold Brew',             label: 'Cold Brew',             emoji: '🖤' },
  { id: 'Matcha',                label: 'Matcha',                emoji: '🍵' },
  { id: 'Freezes',               label: 'Freezes',               emoji: '❄️' },
  { id: 'Slushies',              label: 'Slushies',              emoji: '🌊' },
  { id: 'Makenna Energy',        label: 'Makenna Energy',        emoji: '⚡' },
  { id: 'Americanos & Shaken',   label: 'Americanos & Shaken',   emoji: '🥃' },
  { id: 'Teas & Refreshers',     label: 'Teas & Refreshers',     emoji: '🍑' },
  { id: 'Specialty',             label: 'Specialty',             emoji: '⭐' },
  { id: 'Seasonal',              label: 'Seasonal',              emoji: '🎃' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function StudyPage() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [deck, setDeck] = useState<RecipeCard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = allCards as RecipeCard[];

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: cards.length };
    for (const c of cards) {
      counts[c.category] = (counts[c.category] || 0) + 1;
    }
    return counts;
  }, [cards]);

  function startDeck(categoryId: string) {
    const filtered = categoryId === 'all' ? cards : cards.filter((c) => c.category === categoryId);
    setDeck(shuffle(filtered));
    setActiveCategoryId(categoryId);
    setCardIndex(0);
    setFlipped(false);
  }

  function handleNext() {
    if (cardIndex < deck.length - 1) {
      setCardIndex((i) => i + 1);
      setFlipped(false);
    } else {
      setDeck(shuffle([...deck]));
      setCardIndex(0);
      setFlipped(false);
    }
  }

  function handlePrev() {
    if (cardIndex > 0) {
      setCardIndex((i) => i - 1);
      setFlipped(false);
    }
  }

  // ── FLASHCARD VIEW ───────────────────────────────────────────────────────
  if (activeCategoryId !== null && deck.length > 0) {
    const cat = CATEGORIES.find((c) => c.id === activeCategoryId);
    const card = deck[cardIndex];
    const isLast = cardIndex === deck.length - 1;

    return (
      <div className="min-h-screen bg-page flex flex-col p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 max-w-2xl mx-auto w-full">
          <button
            onClick={() => setActiveCategoryId(null)}
            className="flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-400 text-center">
            {cat?.emoji} {cat?.label}
          </p>
          <p className="text-sm text-ink-400">{cardIndex + 1} / {deck.length}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-2xl mx-auto h-1.5 bg-ink-100 rounded-full mb-6">
          <div
            className="h-full bg-cyan-400 rounded-full transition-all duration-300"
            style={{ width: `${((cardIndex + 1) / deck.length) * 100}%` }}
          />
        </div>

        {/* Card */}
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col items-center justify-center gap-5">
          <div
            className={`w-full cursor-pointer select-none rounded-2xl shadow-lg transition-all duration-200 ${
              flipped
                ? 'bg-cyan-50 border-2 border-cyan-300'
                : 'bg-white border-2 border-ink-100 hover:border-cyan-200'
            }`}
            onClick={() => setFlipped((v) => !v)}
          >
            {!flipped ? (
              <div className="p-10 flex flex-col items-center justify-center gap-4 min-h-[240px]">
                <p className="text-xs font-bold uppercase tracking-widest text-ink-400">Drink Name</p>
                <p className="text-3xl font-bold text-ink-700 text-center leading-snug">{card.drink}</p>
                <p className="text-xs text-ink-300 mt-4">Tap to see the full recipe →</p>
              </div>
            ) : (
              <div className="p-6 flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-500 text-center">Full Recipe</p>
                <p className="text-sm font-bold text-ink-700 text-center mb-1">{card.drink}</p>
                <div className="text-sm text-ink-700 leading-relaxed whitespace-pre-line">
                  {card.recipe}
                </div>
              </div>
            )}
          </div>

          {/* Nav */}
          <div className="flex items-center gap-3 w-full max-w-2xl">
            <button
              className="btn-ghost px-5 py-3"
              onClick={handlePrev}
              disabled={cardIndex === 0}
            >
              <ChevronLeft size={22} />
            </button>

            <button
              className="flex-1 flex items-center justify-center gap-2 btn-ghost py-3 text-sm"
              onClick={() => { setDeck(shuffle([...deck])); setCardIndex(0); setFlipped(false); }}
            >
              <Shuffle size={15} /> Shuffle
            </button>

            <button className="btn-cyan px-5 py-3" onClick={handleNext}>
              {isLast ? '🔁' : <ChevronRight size={22} />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── CATEGORY PICKER ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-page p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-ink-400 hover:text-ink-700">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-ink-700">Study Mode</h1>
            <p className="text-sm text-ink-400">Pick a category and flip through full recipes.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] ?? 0;
            if (!count) return null;
            const isAll = cat.id === 'all';
            return (
              <button
                key={cat.id}
                onClick={() => startDeck(cat.id)}
                className={`card p-5 flex items-center justify-between hover:shadow-md transition-shadow text-left ${
                  isAll ? 'border-2 border-cyan-300 bg-cyan-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <div>
                    <p className={`font-bold ${isAll ? 'text-cyan-700' : 'text-ink-700'}`}>
                      {cat.label}
                    </p>
                    <p className="text-xs text-ink-400">{count} drinks</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-ink-300" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
