/**
 * Remove spaces of beginning and end, normalize special characters and lower case.
 *
 * @param str
 * @returns
 */
export function normalizeString(str: string): string {
  return str
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .toLowerCase()
}
