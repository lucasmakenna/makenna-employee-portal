'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Eye, EyeOff, Tag, RotateCcw, Save, CheckCircle2 } from 'lucide-react';
import allCards from '@/data/study-recipe-cards.json';
import { useCurrentUser } from '@/lib/auth';
import { fetchOverrides, saveOverrides, type StudyOverrides } from '@/lib/study-overrides';

interface RecipeCard {
  id: string;
  drink: string;
  recipe: string;
  category: string;
}

const CATEGORIES = [
  'Supremes — Iced',
  'Supremes — Hot',
  'Chillers & Blended',
  'Cold Brew',
  'Matcha',
  'Freezes',
  'Slushies',
  'Makenna Energy',
  'Americanos & Shaken',
  'Teas & Refreshers',
  'Specialty',
  'Seasonal',
];

export default function StudyManagePage() {
  const router = useRouter();
  const { user, loaded } = useCurrentUser();

  const [overrides, setOverrides] = useState<StudyOverrides>({ hidden: [], categories: {} });
  const [pending, setPending] = useState<StudyOverrides>({ hidden: [], categories: {} });
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reclassifyId, setReclassifyId] = useState<string | null>(null);

  const cards = allCards as RecipeCard[];

  useEffect(() => {
    if (loaded && (!user || !['admin', 'manager'].includes(user.role))) {
      router.replace('/study');
    }
  }, [loaded, user, router]);

  useEffect(() => {
    fetchOverrides().then((o) => {
      setOverrides(o);
      setPending(o);
      setLoading(false);
    });
  }, []);

  const isDirty = useMemo(() => {
    return (
      JSON.stringify([...pending.hidden].sort()) !== JSON.stringify([...overrides.hidden].sort()) ||
      JSON.stringify(pending.categories) !== JSON.stringify(overrides.categories)
    );
  }, [pending, overrides]);

  function toggleHidden(id: string) {
    setPending((prev) => ({
      ...prev,
      hidden: prev.hidden.includes(id)
        ? prev.hidden.filter((h) => h !== id)
        : [...prev.hidden, id],
    }));
    setSaved(false);
  }

  function setCategory(id: string, category: string, originalCategory: string) {
    setPending((prev) => {
      const cats = { ...prev.categories };
      if (category === originalCategory) {
        delete cats[id];
      } else {
        cats[id] = category;
      }
      return { ...prev, categories: cats };
    });
    setReclassifyId(null);
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await saveOverrides(pending);
    setOverrides(pending);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleReset() {
    setPending({ hidden: [], categories: {} });
    setSaved(false);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return cards.filter((c) => {
      const effectiveCat = pending.categories[c.id] ?? c.category;
      if (filterCat && effectiveCat !== filterCat) return false;
      if (q && !c.drink.toLowerCase().includes(q) && !effectiveCat.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [cards, search, filterCat, pending]);

  const hiddenCount = pending.hidden.length;
  const reclassifiedCount = Object.keys(pending.categories).length;

  if (!loaded || loading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <p className="text-ink-400">Loading…</p>
      </div>
    );
  }

  if (!user || !['admin', 'manager'].includes(user.role)) return null;

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-ink-100 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/study" className="text-ink-400 hover:text-ink-700">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-bold text-ink-700 leading-tight">Manage Study Deck</h1>
              <p className="text-xs text-ink-400">
                {hiddenCount > 0 && <span className="text-red-500 font-medium">{hiddenCount} hidden</span>}
                {hiddenCount > 0 && reclassifiedCount > 0 && <span className="text-ink-300"> · </span>}
                {reclassifiedCount > 0 && <span className="text-amber-600 font-medium">{reclassifiedCount} reclassified</span>}
                {hiddenCount === 0 && reclassifiedCount === 0 && <span>All {cards.length} drinks active</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isDirty && (
              <button
                onClick={handleReset}
                className="btn-ghost text-xs flex items-center gap-1"
              >
                <RotateCcw size={13} /> Reset
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!isDirty || saving}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                saved
                  ? 'bg-emerald-100 text-emerald-700'
                  : isDirty
                  ? 'bg-cyan-500 text-white hover:bg-cyan-600'
                  : 'bg-ink-100 text-ink-400 cursor-not-allowed'
              }`}
            >
              {saved ? <><CheckCircle2 size={15} /> Saved!</> : <><Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}</>}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        {/* Info banner */}
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <strong>Admin only.</strong> Hide drinks to remove them from the study deck entirely, or reclassify them to the correct category. Changes save to Supabase and apply for all employees immediately.
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
            <input
              type="text"
              placeholder="Search drinks…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
          </div>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="px-3 py-2 rounded-lg border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <p className="text-xs text-ink-400">{filtered.length} of {cards.length} drinks shown</p>

        {/* Card list */}
        <div className="space-y-1">
          {filtered.map((card) => {
            const isHidden = pending.hidden.includes(card.id);
            const effectiveCat = pending.categories[card.id] ?? card.category;
            const isReclassified = !!pending.categories[card.id];
            const isReclassifying = reclassifyId === card.id;

            return (
              <div
                key={card.id}
                className={`rounded-xl border p-3 transition-all ${
                  isHidden
                    ? 'bg-ink-50 border-ink-100 opacity-60'
                    : isReclassified
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-white border-ink-100'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold text-sm leading-snug ${isHidden ? 'line-through text-ink-400' : 'text-ink-700'}`}>
                      {card.drink}
                    </p>
                    {/* Category row */}
                    {isReclassifying ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setCategory(card.id, cat, card.category)}
                            className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-all ${
                              cat === effectiveCat
                                ? 'bg-cyan-500 text-white border-cyan-500'
                                : 'bg-white text-ink-600 border-ink-200 hover:border-cyan-300 hover:text-cyan-600'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                        <button
                          onClick={() => setReclassifyId(null)}
                          className="px-2 py-0.5 rounded-full text-xs border border-ink-200 text-ink-400 hover:text-ink-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          isReclassified
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-cyan-50 text-ink-500'
                        }`}>
                          {effectiveCat}
                          {isReclassified && (
                            <span className="ml-1 text-ink-400 font-normal">(was: {card.category})</span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!isHidden && !isReclassifying && (
                      <button
                        onClick={() => setReclassifyId(isReclassifying ? null : card.id)}
                        title="Change category"
                        className="p-1.5 rounded-lg text-ink-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      >
                        <Tag size={15} />
                      </button>
                    )}
                    <button
                      onClick={() => toggleHidden(card.id)}
                      title={isHidden ? 'Restore to deck' : 'Remove from deck'}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isHidden
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-ink-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      {isHidden ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
