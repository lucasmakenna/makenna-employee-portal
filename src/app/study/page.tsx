'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowLeft, Shuffle, CheckCircle2, RotateCcw, Trophy, Settings2 } from 'lucide-react';
import allCards from '@/data/study-recipe-cards.json';
import { useCurrentUser } from '@/lib/auth';
import { fetchOverrides, applyOverrides, type StudyOverrides } from '@/lib/study-overrides';

interface RecipeCard {
  id: string;
  drink: string;
  recipe: string;
  category: string;
}

const MASTERED_KEY = 'mk-study-mastered-v1';

function loadMastered(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(MASTERED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function saveMastered(ids: Set<string>) {
  try { localStorage.setItem(MASTERED_KEY, JSON.stringify([...ids])); } catch {}
}

// The Brain Blend's "Most Popular Drinks: Day 1 Study List"
const TOP_21_DRINKS = [
  'Maui Latte', 'Maui Latte Full', 'Sandy Blonde', 'The Legend', 'Cabo San Lucas',
  'Cookie Butter Latte', 'Cookie Butter Iced', 'The Ben',
  'Brown Sugar Cinnamon Cold Brew', 'White Chocolate Macadamia Nut Cold Brew',
  'White Chocolate Mac Cold Brew', 'Shaken Brown Sugar Oat Milk',
  'Shaken Brown Sugar Cinnamon Oat', 'Maui Vanilla', 'Maui Vanilla Iced',
  'Summer Latte', 'Vanilla Caramel Chiller', 'Sandy Kisses Chiller',
  'PB no J Chiller', 'Oreo Chiller', 'The Vacation', 'Starburst', 'Local Juice',
  'Skittles', 'Matcha', 'Matcha Iced', 'Spiced / Vanilla Chai',
  'Spiced/Vanilla Chai', 'Chai Spiced/Vanilla Iced',
];

const CATEGORIES = [
  { id: 'all',                   label: 'All Drinks',            emoji: '🍹' },
  { id: 'top21',                 label: 'Top 21 — Study List',   emoji: '🌟' },
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

function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const TOP_21_KEYS = new Set(TOP_21_DRINKS.map(normalize));
function isTop21(card: RecipeCard): boolean {
  return TOP_21_KEYS.has(normalize(card.drink));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function StudyPage() {
  const { user } = useCurrentUser();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager';

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [deck, setDeck] = useState<RecipeCard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const [justMastered, setJustMastered] = useState(false);
  const [overrides, setOverrides] = useState<StudyOverrides>({ hidden: [], categories: {} });

  const rawCards = allCards as RecipeCard[];
  // Apply admin overrides (hidden + reclassified) to the card list
  const cards = useMemo(() => applyOverrides(rawCards, overrides), [rawCards, overrides]);

  // Load mastered from localStorage on mount
  useEffect(() => { setMastered(loadMastered()); }, []);

  // Load admin overrides from Supabase/localStorage on mount
  useEffect(() => { fetchOverrides().then(setOverrides); }, []);

  const markMastered = useCallback((cardId: string) => {
    setMastered((prev) => {
      const next = new Set(prev);
      next.add(cardId);
      saveMastered(next);
      return next;
    });
    setJustMastered(true);
    setTimeout(() => setJustMastered(false), 1200);
    // Remove this card from the deck and advance
    setDeck((prev) => {
      const next = prev.filter((c) => c.id !== cardId);
      return next;
    });
    setCardIndex((i) => {
      // stay at same index (next card slides in), unless we were at the last card
      return i; // deck shrinks so this naturally wraps
    });
    setFlipped(false);
  }, []);

  const unmaster = useCallback((cardId: string) => {
    setMastered((prev) => {
      const next = new Set(prev);
      next.delete(cardId);
      saveMastered(next);
      return next;
    });
  }, []);

  const resetAllMastered = useCallback(() => {
    setMastered(new Set());
    saveMastered(new Set());
  }, []);

  const filterCards = useCallback((categoryId: string, excludeMastered = true) => {
    let filtered =
      categoryId === 'all' ? cards :
      categoryId === 'top21' ? cards.filter(isTop21) :
      cards.filter((c) => c.category === categoryId);
    if (excludeMastered) {
      filtered = filtered.filter((c) => !mastered.has(c.id));
    }
    return filtered;
  }, [cards, mastered]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: cards.length, top21: cards.filter(isTop21).length };
    for (const c of cards) counts[c.category] = (counts[c.category] || 0) + 1;
    return counts;
  }, [cards]);

  // How many mastered per category
  const masteredCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0, top21: 0 };
    for (const c of cards) {
      if (mastered.has(c.id)) {
        counts.all = (counts.all || 0) + 1;
        if (isTop21(c)) counts.top21 = (counts.top21 || 0) + 1;
        counts[c.category] = (counts[c.category] || 0) + 1;
      }
    }
    return counts;
  }, [cards, mastered]);

  function startDeck(categoryId: string) {
    const filtered = filterCards(categoryId);
    setDeck(shuffle(filtered));
    setActiveCategoryId(categoryId);
    setCardIndex(0);
    setFlipped(false);
    setJustMastered(false);
  }

  function handleNext() {
    if (deck.length === 0) return;
    if (cardIndex < deck.length - 1) {
      setCardIndex((i) => i + 1);
    } else {
      setDeck(shuffle([...deck]));
      setCardIndex(0);
    }
    setFlipped(false);
  }

  function handlePrev() {
    if (cardIndex > 0) {
      setCardIndex((i) => i - 1);
      setFlipped(false);
    }
  }

  // ── FLASHCARD VIEW ───────────────────────────────────────────────────────
  if (activeCategoryId !== null) {
    const cat = CATEGORIES.find((c) => c.id === activeCategoryId);
    const totalInCat = filterCards(activeCategoryId, false).length;
    const masteredInCat = masteredCounts[activeCategoryId] ?? 0;

    // All done in this category
    if (deck.length === 0) {
      return (
        <div className="min-h-screen bg-page flex flex-col items-center justify-center p-8 gap-6">
          <div className="text-6xl">🏆</div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-ink-700 mb-1">
              {masteredInCat === totalInCat ? 'Category mastered!' : 'All remaining cards mastered!'}
            </h2>
            <p className="text-ink-400 text-sm">
              {masteredInCat} of {totalInCat} drinks marked as mastered in {cat?.label}.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const filtered = filterCards(activeCategoryId, false);
                setDeck(shuffle(filtered));
                setCardIndex(0);
                setFlipped(false);
              }}
              className="btn-ghost flex items-center gap-2"
            >
              <RotateCcw size={15} /> Study all (including mastered)
            </button>
            <button
              onClick={() => setActiveCategoryId(null)}
              className="btn-cyan"
            >
              Back to categories
            </button>
          </div>
        </div>
      );
    }

    const card = deck[Math.min(cardIndex, deck.length - 1)];
    const isCardMastered = mastered.has(card.id);

    return (
      <div className="min-h-screen bg-page flex flex-col p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 max-w-2xl mx-auto w-full">
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

        {/* Mastery progress bar */}
        <div className="max-w-2xl mx-auto w-full mb-1 flex items-center justify-between text-[10px] text-ink-400">
          <span>{deck.length} left to study</span>
          <span className="text-emerald-600 font-semibold">{masteredInCat} / {totalInCat} mastered</span>
        </div>
        <div className="w-full max-w-2xl mx-auto h-2 bg-ink-100 rounded-full mb-5 overflow-hidden">
          <div
            className="h-full bg-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${totalInCat > 0 ? (masteredInCat / totalInCat) * 100 : 0}%` }}
          />
        </div>

        {/* Card */}
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col items-center justify-center gap-4">
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

          {/* Mastered button */}
          <button
            onClick={() => isCardMastered ? unmaster(card.id) : markMastered(card.id)}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-sm transition-all duration-200 ${
              justMastered
                ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                : isCardMastered
                ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                : 'bg-white border-2 border-ink-100 text-ink-500 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle2 size={18} />
            {justMastered
              ? 'Mastered! Removed from deck ✓'
              : isCardMastered
              ? 'Mastered ✓ — tap to un-master'
              : 'I\'ve got this — Mark as Mastered'}
          </button>

          {/* Nav */}
          <div className="flex items-center gap-3 w-full">
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
              {cardIndex === deck.length - 1 ? '🔁' : <ChevronRight size={22} />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── CATEGORY PICKER ──────────────────────────────────────────────────────
  const totalMastered = mastered.size;

  return (
    <div className="min-h-screen bg-page p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-ink-400 hover:text-ink-700">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-ink-700">Study Mode</h1>
              <p className="text-sm text-ink-400">Pick a category and flip through full recipes.</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {isAdmin && (
              <Link
                href="/study/manage"
                className="flex items-center gap-1.5 text-xs text-ink-400 hover:text-ink-700 border border-ink-200 rounded-lg px-3 py-1.5 hover:border-ink-400 transition-colors"
              >
                <Settings2 size={13} /> Manage deck
              </Link>
            )}
            {totalMastered > 0 && (
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                  <Trophy size={15} /> {totalMastered} mastered
                </div>
                <button
                  onClick={resetAllMastered}
                  className="text-xs text-ink-400 hover:text-red-500 underline"
                >
                  Reset all
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {CATEGORIES.map((cat) => {
            const total = categoryCounts[cat.id] ?? 0;
            if (!total) return null;
            const masteredCount = masteredCounts[cat.id] ?? 0;
            const remaining = total - masteredCount;
            const isAll = cat.id === 'all';
            const allDone = masteredCount === total;
            return (
              <button
                key={cat.id}
                onClick={() => startDeck(cat.id)}
                className={`card p-5 flex items-center justify-between hover:shadow-md transition-shadow text-left ${
                  isAll ? 'border-2 border-cyan-300 bg-cyan-50' : ''
                } ${allDone ? 'border-2 border-emerald-200 bg-emerald-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{allDone ? '🏆' : cat.emoji}</span>
                  <div>
                    <p className={`font-bold ${allDone ? 'text-emerald-700' : isAll ? 'text-cyan-700' : 'text-ink-700'}`}>
                      {cat.label}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-ink-400">{remaining} to study</p>
                      {masteredCount > 0 && (
                        <p className="text-xs text-emerald-600 font-medium">· {masteredCount} mastered</p>
                      )}
                    </div>
                    {masteredCount > 0 && (
                      <div className="mt-1.5 h-1 w-24 bg-ink-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${(masteredCount / total) * 100}%` }}
                        />
                      </div>
                    )}
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
