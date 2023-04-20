/**
 * Normalizes a string by performing the following operations:
 * 1. Trimming white spaces from both ends.
 * 2. Replacing diacritics with their base characters
 *    using Unicode Normalization Form D (NFD).
 * 3. Replacing the German sharp s (ß) with 'ss'.
 * 4. Converting the string to lowercase.
 *
 * @param str The input string to be normalized.
 * @returns The normalized string.
 */
export const normalizeString = (str: string): string => {
  return str
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .toLowerCase()
}
