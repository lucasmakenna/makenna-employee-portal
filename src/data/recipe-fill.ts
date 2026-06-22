import rawData from './recipe-fill-questions.json';
import type { RecipeFillQuestion, RecipeFillBlankType, RecipeFillBlank } from '@/types';

const raw = rawData as {
  test_name: string;
  test_id: string;
  description: string;
  total_questions: number;
  options: Record<RecipeFillBlankType, string[]>;
  questions: RecipeFillQuestion[];
};

export const RECIPE_FILL_META = {
  name: raw.test_name,
  id: raw.test_id,
  description: raw.description,
  totalQuestions: raw.total_questions,
};

export const RECIPE_FILL_OPTIONS: Record<RecipeFillBlankType, string[]> = raw.options;

export const RECIPE_FILL_QUESTIONS: RecipeFillQuestion[] = raw.questions;

export const RECIPE_FILL_QUESTION_MAP: Record<string, RecipeFillQuestion> =
  Object.fromEntries(raw.questions.map((q) => [q.id, q]));

export type RecipeFillUnit = { parts: string[]; blanks: RecipeFillBlank[] };

/**
 * Splits a question's literal template text (with "___" placeholders) into
 * scoring/rendering units. A unit boundary is a newline or a literal " + "
 * connector — this matches how older quantity+ingredient "pump pairs" were
 * always written, so old questions parse into the same units they always
 * scored as. Newer questions can mix any number of blanks per unit (e.g. a
 * standalone topping with no quantity, or three blanks on one line).
 */
export function parseTemplateUnits(template: string, blanks: RecipeFillBlank[]): RecipeFillUnit[] {
  const segments = template.split(/\n| \+ /);
  const units: RecipeFillUnit[] = [];
  let cursor = 0;
  for (const seg of segments) {
    const parts = seg.split('___');
    const count = parts.length - 1;
    units.push({ parts, blanks: blanks.slice(cursor, cursor + count) });
    cursor += count;
  }
  return units;
}
