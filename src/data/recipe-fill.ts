import rawData from './recipe-fill-questions.json';
import type { RecipeFillQuestion, RecipeFillBlankType } from '@/types';

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
