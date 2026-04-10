export interface GoogleReview {
  text: { text: string };
  rating: number;
}

/**
 * Common patterns people use when mentioning dishes in reviews:
 * "the X was amazing", "loved the X", "try the X", "best X",
 * "ordered the X", "recommend the X", "had the X", "get the X"
 */
const DISH_PATTERNS = [
  /\bthe\s+([A-Za-z][A-Za-z' ]{1,30}?)\s+(?:was|is|are|were)\s+(?:amazing|incredible|delicious|fantastic|excellent|great|good|perfect|outstanding|superb|divine|heavenly|wonderful|tasty|flavorful|fresh|tender|crispy|juicy|savory)/gi,
  /\bloved?\s+the\s+([A-Za-z][A-Za-z' ]{1,30}?)(?:\s*[.!,;]|\s+and\b|\s+but\b|\s+too\b|\s+so\b|\s+here\b|$)/gi,
  /\btry\s+the\s+([A-Za-z][A-Za-z' ]{1,30}?)(?:\s*[.!,;]|\s+and\b|\s+but\b|\s+if\b|\s+when\b|\s+it\b|$)/gi,
  /\bbest\s+([A-Za-z][A-Za-z' ]{1,30}?)\s+(?:I've|I\s+have|we've|we\s+have|ever|in\s+town|in\s+the|around|you'll)/gi,
  /\bordered\s+the\s+([A-Za-z][A-Za-z' ]{1,30}?)(?:\s*[.!,;]|\s+and\b|\s+which\b|\s+it\b|$)/gi,
  /\brecommend\s+the\s+([A-Za-z][A-Za-z' ]{1,30}?)(?:\s*[.!,;]|\s+and\b|\s+if\b|\s+it\b|$)/gi,
  /\bhad\s+the\s+([A-Za-z][A-Za-z' ]{1,30}?)(?:\s*[.!,;]|\s+and\b|\s+which\b|\s+it\b|$)/gi,
  /\bget\s+the\s+([A-Za-z][A-Za-z' ]{1,30}?)(?:\s*[.!,;]|\s+and\b|\s+if\b|\s+it\b|$)/gi,
  /\bknown\s+for\s+(?:its?\s+|the\s+)?([A-Za-z][A-Za-z' ]{1,30}?)(?:\s*[.!,;]|\s+and\b|$)/gi,
  /\bmust[- ]try\s+(?:is\s+the\s+|the\s+)?([A-Za-z][A-Za-z' ]{1,30}?)(?:\s*[.!,;]|\s+and\b|$)/gi,
];

/** Words that are clearly not dish names — filter these out */
const STOP_WORDS = new Set([
  "food", "place", "restaurant", "service", "staff", "experience",
  "atmosphere", "ambiance", "vibe", "decor", "location", "price",
  "prices", "menu", "portion", "portions", "meal", "dinner",
  "lunch", "breakfast", "brunch", "wait", "waiter", "waitress",
  "server", "table", "view", "music", "owner", "chef",
  "everything", "something", "anything", "nothing", "thing",
  "spot", "joint", "eatery", "establishment",
]);

const MAX_DISHES = 5;

function capitalize(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function isValidDish(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 3) return false;

  const words = trimmed.toLowerCase().split(/\s+/);
  // Reject if every word is a stop word
  if (words.every((w) => STOP_WORDS.has(w))) return false;
  // Reject single stop words
  if (words.length === 1 && STOP_WORDS.has(words[0])) return false;

  return true;
}

function extractFromText(text: string): string[] {
  const found: string[] = [];

  for (const pattern of DISH_PATTERNS) {
    // Reset lastIndex for global regexes
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const dish = match[1].trim();
      if (isValidDish(dish)) {
        found.push(capitalize(dish));
      }
    }
  }

  return found;
}

/**
 * Extracts up to 5 dish names from Google Places review text
 * and/or editorial summary using lightweight heuristic patterns.
 */
export function extractDishes(
  reviews: GoogleReview[],
  editorialSummary?: string
): string[] {
  const allDishes: string[] = [];

  // Extract from editorial summary first (higher signal)
  if (editorialSummary) {
    allDishes.push(...extractFromText(editorialSummary));
  }

  // Extract from reviews (higher-rated reviews first for better signal)
  const sortedReviews = [...reviews].sort((a, b) => b.rating - a.rating);
  for (const review of sortedReviews) {
    if (review.text?.text) {
      allDishes.push(...extractFromText(review.text.text));
    }
  }

  // Deduplicate (case-insensitive) and cap at MAX_DISHES
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const dish of allDishes) {
    const key = dish.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(dish);
    }
    if (unique.length >= MAX_DISHES) break;
  }

  return unique;
}
