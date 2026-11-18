'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Star, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import AppShell from '@/components/AppShell';
import Avatar from '@/components/Avatar';
import { useCurrentUser } from '@/lib/auth';
import { isInTraining, fullName } from '@/data/employees';
import { useEmployees } from '@/data/store';
import { loadAllReviews, saveReview, type DailyReview } from '@/lib/daily-review-db';

const TOTAL_DAYS = 14;

export default function DailyReviewPage() {
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const { employees } = useEmployees();

  const [reviews, setReviews] = useState<DailyReview[]>([]);
  const [selectedTraineeId, setSelectedTraineeId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [rating, setRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  useEffect(() => {
    loadAllReviews().then(setReviews);
  }, []);

  const trainees = employees.filter((e) => e.active && isInTraining(e));

  const selectedTrainee = trainees.find((e) => e.id === selectedTraineeId) ?? null;

  const reviewsForTrainee = reviews
    .filter((r) => r.traineeId === selectedTraineeId)
    .sort((a, b) => a.trainingDay - b.trainingDay);

  const reviewByDay = Object.fromEntries(reviewsForTrainee.map((r) => [r.trainingDay, r]));

  // When switching trainee, pre-fill to the first incomplete day
  const selectTrainee = useCallback(
    (id: string) => {
      setSelectedTraineeId(id);
      setSavedMsg('');
      const traineeReviews = reviews.filter((r) => r.traineeId === id);
      const completedDays = new Set(traineeReviews.map((r) => r.trainingDay));
      const nextDay = Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).find(
        (d) => !completedDays.has(d),
      ) ?? TOTAL_DAYS;
      setSelectedDay(nextDay);
      // Pre-fill if there's an existing review for that day
      const existing = traineeReviews.find((r) => r.trainingDay === nextDay);
      setRating(existing?.rating ?? 0);
      setNotes(existing?.notes ?? '');
    },
    [reviews],
  );

  const selectDay = (day: number) => {
    setSelectedDay(day);
    setSavedMsg('');
    const existing = reviewByDay[day];
    setRating(existing?.rating ?? 0);
    setNotes(existing?.notes ?? '');
  };

  const handleSave = async (endDay: boolean) => {
    if (!user || !selectedTraineeId || rating === 0) return;
    setSaving(true);
    setSavedMsg('');
    const result = await saveReview({
      traineeId: selectedTraineeId,
      trainerId: user.id,
      trainingDay: selectedDay,
      rating,
      notes,
      dayEnded: endDay,
    });
    if (result) {
      const updated = await loadAllReviews();
      setReviews(updated);
      setSavedMsg(endDay ? 'Day marked complete.' : 'Review saved.');
    } else {
      setSavedMsg('Something went wrong — try again.');
    }
    setSaving(false);
  };

  if (!loaded || !user) return null;

  // Restrict to trainer / manager / admin
  if (!['trainer', 'manager', 'admin'].includes(user.role)) {
    return (
      <AppShell>
        <p className="text-sm text-ink-400">You don't have access to this page.</p>
      </AppShell>
    );
  }

  const daysCompleted = reviewsForTrainee.filter((r) => r.dayEnded).length;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-ink-700">End of day training reviews</h1>
          <p className="mt-1 text-sm text-ink-400">
            Rate trainee performance at the end of each training day — days 1 through 14.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          {/* Trainee list */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-3">
              Trainees · {trainees.length}
            </p>
            {trainees.length === 0 && (
              <p className="text-sm text-ink-400">No trainees currently in training.</p>
            )}
            {trainees.map((e) => {
              const traineeReviews = reviews.filter((r) => r.traineeId === e.id);
              const done = traineeReviews.filter((r) => r.dayEnded).length;
              const active = e.id === selectedTraineeId;
              return (
                <button
                  key={e.id}
                  onClick={() => selectTrainee(e.id)}
                  className={`w-full text-left card p-3 transition hover:shadow-card flex items-center gap-3 ${
                    active ? 'ring-2 ring-cyan-400' : ''
                  }`}
                >
                  <Avatar employee={e} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-ink-700 truncate">{fullName(e)}</div>
                    <div className="text-xs text-ink-400">
                      {done}/{TOTAL_DAYS} days reviewed
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-ink-300 shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Review panel */}
          <div>
            {!selectedTrainee ? (
              <div className="card p-8 text-center text-sm text-ink-400">
                Select a trainee to view or add a review.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Trainee header */}
                <div className="card p-4 flex items-center gap-3">
                  <Avatar employee={selectedTrainee} size="md" />
                  <div>
                    <div className="font-bold text-ink-700">{fullName(selectedTrainee)}</div>
                    <div className="text-xs text-ink-400">
                      {daysCompleted} of {TOTAL_DAYS} training days complete
                    </div>
                  </div>
                  <div className="ml-auto flex gap-1 flex-wrap justify-end max-w-[200px]">
                    {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((d) => {
                      const r = reviewByDay[d];
                      return (
                        <button
                          key={d}
                          onClick={() => selectDay(d)}
                          title={`Day ${d}`}
                          className={`w-7 h-7 rounded-full text-xs font-semibold transition ${
                            d === selectedDay
                              ? 'bg-cyan-400 text-white'
                              : r?.dayEnded
                              ? 'bg-emerald-100 text-emerald-700'
                              : r
                              ? 'bg-cyan-50 text-cyan-600 border border-cyan-200'
                              : 'bg-ink-50 text-ink-400 hover:bg-cyan-50'
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Review form */}
                <div className="card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-semibold text-ink-700">Day {selectedDay}</div>
                      {reviewByDay[selectedDay]?.dayEnded && (
                        <span className="pill bg-emerald-100 text-emerald-700 mt-1">
                          <CheckCircle2 size={11} /> Day complete
                        </span>
                      )}
                      {reviewByDay[selectedDay] && !reviewByDay[selectedDay].dayEnded && (
                        <span className="pill bg-cyan-50 text-cyan-600 mt-1">
                          <Clock size={11} /> Draft saved
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-ink-400">
                      {reviewByDay[selectedDay]
                        ? `Last saved ${new Date(reviewByDay[selectedDay].updatedAt).toLocaleDateString()}`
                        : 'No review yet'}
                    </div>
                  </div>

                  {/* Star rating */}
                  <div className="mb-4">
                    <label className="label">Overall performance</label>
                    <div className="flex items-center gap-2 mt-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setRating(n)}
                          onMouseEnter={() => setHoveredStar(n)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="p-0.5 transition-transform hover:scale-110"
                        >
                          <Star
                            size={32}
                            className={
                              n <= (hoveredStar || rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-ink-200'
                            }
                          />
                        </button>
                      ))}
                      {rating > 0 && (
                        <span className="ml-2 text-sm text-ink-400">
                          {['', 'Needs improvement', 'Below expectations', 'Meeting expectations', 'Above expectations', 'Excellent'][rating]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-5">
                    <label className="label">Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder="Notes for today (optional)…"
                      className="input resize-none"
                    />
                  </div>

                  {savedMsg && (
                    <p className={`mb-3 text-sm ${savedMsg.includes('went wrong') ? 'text-hibiscus-600' : 'text-emerald-600'}`}>
                      {savedMsg}
                    </p>
                  )}

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => handleSave(false)}
                      disabled={saving || rating === 0}
                      className="btn-ghost"
                    >
                      Save review
                    </button>
                    <button
                      onClick={() => handleSave(true)}
                      disabled={saving || rating === 0}
                      className="btn-cyan"
                    >
                      Save &amp; end training day
                    </button>
                  </div>
                  {rating === 0 && (
                    <p className="mt-2 text-xs text-ink-400 text-right">Select a star rating to save.</p>
                  )}
                </div>

                {/* Past reviews */}
                {reviewsForTrainee.length > 0 && (
                  <div className="card p-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-ink-400 mb-4">
                      Review history
                    </h2>
                    <div className="space-y-3">
                      {reviewsForTrainee.map((r) => (
                        <div
                          key={r.id}
                          className="flex items-start gap-4 py-2 border-b border-ink-50 last:border-0"
                        >
                          <div className="w-16 shrink-0">
                            <div className="text-sm font-semibold text-ink-700">Day {r.trainingDay}</div>
                            {r.dayEnded ? (
                              <span className="pill bg-emerald-50 text-emerald-700 text-[10px]">Complete</span>
                            ) : (
                              <span className="pill bg-cyan-50 text-cyan-600 text-[10px]">Draft</span>
                            )}
                          </div>
                          <div className="flex gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <Star
                                key={n}
                                size={14}
                                className={n <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-ink-200'}
                              />
                            ))}
                          </div>
                          <div className="flex-1 min-w-0">
                            {r.notes ? (
                              <p className="text-xs text-ink-500 italic truncate">{r.notes}</p>
                            ) : (
                              <p className="text-xs text-ink-300">No notes</p>
                            )}
                          </div>
                          <div className="text-xs text-ink-300 shrink-0">
                            {new Date(r.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
