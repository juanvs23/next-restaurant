/**
 * Convert a text string to a URL-friendly slug.
 * Handles Spanish characters (ñ, tildes) and special chars.
 *
 * @example
 * slugify("Café Espresso") // "cafe-espresso"
 * slugify(" ¡Hola, mundo! ") // "hola-mundo"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")               // separa tildes: é → e + combining acute
    .replace(/[\u0300-\u036f]/g, "") // elimina diacríticos
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9\s-]/gi, "")  // solo alfanuméricos, espacios, guiones
    .trim()
    .replace(/[\s_]+/g, "-")        // espacios/underscores → guiones
    .replace(/^-+|-+$/g, "")        // recorta guiones al inicio/final
    .toLowerCase();
}
