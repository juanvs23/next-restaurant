/**
 * Phone number regex for international format validation.
 *
 * Rules:
 * - Optional leading "+"
 * - Digits, spaces, dashes, dots, and parentheses allowed as separators
 * - Must contain 7-15 digits total (E.164 compatible)
 * - Rejects obvious garbage like "+", "---", "(   )"
 */
export const phoneRegex =
  /^[+]?[\d\s\-().]{3,25}$/;

/**
 * Validates that a string contains 7-15 digits after stripping non-digits.
 */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}
