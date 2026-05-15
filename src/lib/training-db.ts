'use client';

/**
 * Training progress persistence via Supabase.
 *
 * Each row in `training_progress` represents one employee's progress on one
 * station. On first load we upsert the row so it exists; then every skill
 * toggle and sign-off calls upsert again to keep it current.
 */

import { supabase } from './supabase';

export type StationProgress = {
  stationId: string;
  skillsCompleted: string[];
  signedOffBy?: string;
  signedOffAt?: string;
};

/** Load all station progress rows for one employee. */
export async function loadTrainingProgress(
  employeeId: string,
): Promise<Record<string, StationProgress>> {
  const { data, error } = await supabase
    .from('training_progress')
    .select('station_id, skills_completed, signed_off_by, signed_off_at')
    .eq('employee_id', employeeId);

  if (error) {
    console.error('loadTrainingProgress error:', error.message);
    return {};
  }

  const result: Record<string, StationProgress> = {};
  for (const row of data ?? []) {
    result[row.station_id] = {
      stationId: row.station_id,
      skillsCompleted: row.skills_completed ?? [],
      signedOffBy: row.signed_off_by ?? undefined,
      signedOffAt: row.signed_off_at ?? undefined,
    };
  }
  return result;
}

/** Load progress for ALL employees in one query — used by the training dashboard. */
export async function loadAllTrainingProgress(): Promise<
  Record<string, Record<string, StationProgress>>
> {
  const { data, error } = await supabase
    .from('training_progress')
    .select('employee_id, station_id, skills_completed, signed_off_by, signed_off_at');

  if (error) {
    console.error('loadAllTrainingProgress error:', error.message);
    return {};
  }

  const result: Record<string, Record<string, StationProgress>> = {};
  for (const row of data ?? []) {
    if (!result[row.employee_id]) result[row.employee_id] = {};
    result[row.employee_id][row.station_id] = {
      stationId: row.station_id,
      skillsCompleted: row.skills_completed ?? [],
      signedOffBy: row.signed_off_by ?? undefined,
      signedOffAt: row.signed_off_at ?? undefined,
    };
  }
  return result;
}

/** Save (upsert) one station's progress for an employee. */
export async function saveStationProgress(
  employeeId: string,
  progress: StationProgress,
): Promise<void> {
  const { error } = await supabase.from('training_progress').upsert(
    {
      employee_id: employeeId,
      station_id: progress.stationId,
      skills_completed: progress.skillsCompleted,
      signed_off_by: progress.signedOffBy ?? null,
      signed_off_at: progress.signedOffAt ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'employee_id,station_id' },
  );

  if (error) {
    console.error('saveStationProgress error:', error.message);
  }
}
