/**
 * Progressive "study levels" for recipe cards.
 *
 * Level 1 — Flavors only: just the flavor ingredients (syrups, sauces,
 *           powders, etc.), no quantities, no sizes.
 * Level 2 — Flavors + quantities, broken out per size.
 * Level 3 — Level 2 plus milk/espresso/dilution amounts per size.
 * Level 4 — Full recipe, exactly as written (build steps, garnish, etc.)
 *
 * This works by classifying each line of the existing recipe text rather
 * than requiring the 387 recipes to be re-authored.
 */

export type StudyLevel = 1 | 2 | 3 | 4;

export const STUDY_LEVELS: { level: StudyLevel; label: string; hint: string }[] = [
  { level: 1, label: 'Level 1 — Flavors', hint: 'Name the flavors used in this drink.' },
  { level: 2, label: 'Level 2 — Flavor amounts', hint: 'Name the flavors and how much of each, by size.' },
  { level: 3, label: 'Level 3 — + Milk & espresso', hint: 'Add milk type/amount and espresso shots, by size.' },
  { level: 4, label: 'Level 4 — Full recipe', hint: 'The complete build, start to finish.' },
];

const SIZE_HEADER_RE = /^●/;

const FLAVOR_LINE_RE = /\b(pumps?|scoops?|drizzles?)\b.*\bof\b|\bcans?\s+of\b|makenna energy can/i;
const DAIRY_LINE_RE = /\b(milk|kona cloud|half and half|espresso shot)/i;
const FILL_TO_RE = /^(fill to|pour over ice and tom-tom)/i;

function classifyLine(line: string): 2 | 3 | 4 {
  if (FLAVOR_LINE_RE.test(line)) return 2;
  if (DAIRY_LINE_RE.test(line) || FILL_TO_RE.test(line)) return 3;
  return 4;
}

const FLAVOR_NAME_RE = /(?:pumps?|scoops?|drizzles?|cans?)\s+of\s+([^,]+?)(?:\s+in\s+\d.*)?$/i;

function extractFlavorName(line: string): string | null {
  const m = line.match(FLAVOR_NAME_RE);
  if (m) return m[1].trim().replace(/[.*]+$/, '').trim();
  if (/makenna energy can/i.test(line)) return 'Makenna Energy';
  return null;
}

/**
 * Returns the recipe text appropriate for the given study level.
 */
export function getLeveledRecipe(recipe: string, level: StudyLevel): string {
  if (level === 4) return recipe;

  const lines = recipe.split('\n');

  if (level === 1) {
    const seen = new Map<string, string>();
    for (const line of lines) {
      if (classifyLine(line) !== 2) continue;
      const name = extractFlavorName(line);
      if (!name) continue;
      const key = name.toLowerCase();
      if (!seen.has(key)) seen.set(key, name);
    }
    if (seen.size === 0) return '(No flavor ingredients — base drink.)';
    return [...seen.values()].map((n) => `• ${n}`).join('\n');
  }

  // Levels 2 & 3: keep size headers + lines at or below the chosen level
  const out: string[] = [];
  let pendingHeader: string | null = null;

  for (const line of lines) {
    if (SIZE_HEADER_RE.test(line)) {
      pendingHeader = line;
      continue;
    }
    if (line.trim() === '') continue;
    const lvl = classifyLine(line);
    if (lvl <= level) {
      if (pendingHeader) {
        if (out.length > 0) out.push('');
        out.push(pendingHeader);
        pendingHeader = null;
      }
      out.push(line);
    }
  }

  return out.length > 0 ? out.join('\n') : '(Nothing to show at this level.)';
}
