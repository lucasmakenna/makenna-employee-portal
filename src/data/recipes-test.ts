import rawData from './recipes-test-questions.json';
import type { RecipesTestQuestion } from '@/types';

const raw = rawData as {
  test_name: string;
  test_id: string;
  description: string;
  total_questions: number;
  difficulty: string;
  questions: RecipesTestQuestion[];
};

export const RECIPES_TEST_META = {
  name: raw.test_name,
  id: raw.test_id,
  description: raw.description,
  totalQuestions: raw.total_questions,
  difficulty: raw.difficulty,
};

export const RECIPES_TEST_QUESTIONS: RecipesTestQuestion[] = raw.questions;

export const RECIPES_QUESTION_MAP: Record<string, RecipesTestQuestion> =
  Object.fromEntries(raw.questions.map((q) => [q.id, q]));
