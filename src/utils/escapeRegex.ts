/**
 * Escape special regex characters in a string.
 * Use before passing user input to `new RegExp()` or `$regex`.
 *
 * @example
 * escapeRegex("Maria + Luis") // "Maria \\+ Luis"
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
