'use client';

import { dbCall } from './db-client';

export type DailyReview = {
  id: string;
  traineeId: string;
  trainerId: string;
  trainingDay: number;
  rating: number;
  notes: string;
  dayEnded: boolean;
  createdAt: string;
  updatedAt: string;
};

type ReviewRow = {
  id: string;
  trainee_id: string;
  trainer_id: string;
  training_day: number;
  rating: number;
  notes: string | null;
  day_ended: boolean;
  created_at: string;
  updated_at: string;
};

function rowToReview(row: ReviewRow): DailyReview {
  return {
    id: row.id,
    traineeId: row.trainee_id,
    trainerId: row.trainer_id,
    trainingDay: row.training_day,
    rating: row.rating,
    notes: row.notes ?? '',
    dayEnded: row.day_ended,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Load all reviews for a specific trainee. */
export async function loadReviewsForTrainee(traineeId: string): Promise<DailyReview[]> {
  const { data, error } = await dbCall<ReviewRow[]>(
    'trainer_daily_reviews',
    'select',
    {
      select: '*',
      eq: [['trainee_id', traineeId]],
      order: { col: 'training_day', asc: true },
    },
  );
  if (error) {
    console.error('loadReviewsForTrainee error:', error.message);
    return [];
  }
  return (data ?? []).map(rowToReview);
}

/** Load all reviews for a list of trainees in one query. */
export async function loadAllReviews(): Promise<DailyReview[]> {
  const { data, error } = await dbCall<ReviewRow[]>(
    'trainer_daily_reviews',
    'select',
    { select: '*', order: { col: 'training_day', asc: true } },
  );
  if (error) {
    console.error('loadAllReviews error:', error.message);
    return [];
  }
  return (data ?? []).map(rowToReview);
}

/** Upsert (insert or update) a daily review. Conflict key: trainee_id + training_day. */
export async function saveReview(review: {
  traineeId: string;
  trainerId: string;
  trainingDay: number;
  rating: number;
  notes: string;
  dayEnded: boolean;
}): Promise<{ id: string } | null> {
  const { data, error } = await dbCall<{ id: string }[]>(
    'trainer_daily_reviews',
    'upsert',
    {
      data: {
        trainee_id: review.traineeId,
        trainer_id: review.trainerId,
        training_day: review.trainingDay,
        rating: review.rating,
        notes: review.notes,
        day_ended: review.dayEnded,
        updated_at: new Date().toISOString(),
      },
      onConflict: 'trainee_id,training_day',
      select: 'id',
    },
  );
  if (error) {
    console.error('saveReview error:', error.message);
    return null;
  }
  return data?.[0] ?? null;
}
