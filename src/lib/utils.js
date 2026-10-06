/**
 * Utility for combining CSS class names
 */
export function cn(...inputs) {
  return inputs
    .flat()
    .filter(Boolean)
    .join(' ');
}
