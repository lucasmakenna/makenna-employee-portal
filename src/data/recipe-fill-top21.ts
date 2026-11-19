import type { RecipeFillQuestion } from '@/types';

export const TOP_21_DRINKS = [
  // 1. Maui Latte — all 4 fill levels × Hot/Iced
  'Maui Latte (Full Maui) Iced', 'Maui Latte (Full Maui) Hot',
  'Maui Latte (3/4 Maui) Iced', 'Maui Latte (3/4 Maui) Hot',
  'Maui Latte (1/2 Maui) Iced', 'Maui Latte (1/2 Maui) Hot',
  'Maui Latte (1/4 Maui) Iced', 'Maui Latte (1/4 Maui) Hot',
  // 2. Sandy Blonde
  'Sandy Blonde', 'Sandy Blonde Hot',
  // 3. The Legend
  'The Legend', 'The Legend Hot',
  // 4. Horchata Latte
  'Horchata Latte', 'Horchata Latte Hot',
  // 5. Maui Vanilla
  'Maui Vanilla Iced', 'Maui Vanilla Hot',
  // 6. Cookie Butter — Iced only (no hot in bank)
  'Cookie Butter Iced',
  // 7. Cabo San Lucas
  'Cabo San Lucas', 'Cabo San Lucas Hot',
  // 8. The Ben
  'The Ben', 'The Ben Hot',
  // 9. Churro Latte
  'Churro Latte Iced', 'Churro Latte Hot',
  // 10. Heart Attack
  'Heart Attack', 'Heart Attack Hot',
  // 11. North Shore
  'North Shore Iced', 'North Shore Hot',
  // 12. Hawaiian Honey
  'Hawaiian Honey', 'Hawaiian Honey Hot',
  // 13. Honey Bee Latte
  'Honey Bee Latte Iced', 'Honey Bee Latte Hot',
  // 14. Summer Latte
  'Summer Latte', 'Summer Latte Hot',
  // 15. Starburst — single card
  'Starburst',
  // 16. Matcha
  'Matcha Iced', 'Matcha Hot',
  // 17. Shaken Brown Sugar Cinnamon Oat — single card
  'Shaken Brown Sugar Cinnamon Oat',
  // 18. Samoa Sunrise
  'Samoa Sunrise Iced', 'Samoa Sunrise Hot',
  // 19. Mexican Mocha
  'Mexican Mocha', 'Mexican Mocha Hot',
  // 20. The Taylor
  'The Taylor', 'The Taylor Hot',
  // 21. Vanilla Caramel Chiller — single card
  'Vanilla Caramel Chiller',
];

const normDrink = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s*\((iced|hot|slushy|blended|freeze)\)\s*/g, ' ')
    .replace(/\s+(iced|hot|slushy|blended|freeze)\s*$/g, '')
    .trim()
    .replace(/[^a-z0-9]/g, '');

const top21Set = new Set(TOP_21_DRINKS.map(normDrink));

/** Returns all question IDs whose drink is in the Top 21 list. */
export function getTop21QuestionIds(questions: RecipeFillQuestion[]): string[] {
  return questions
    .filter((q) => top21Set.has(normDrink(q.drink)))
    .map((q) => q.id);
}
