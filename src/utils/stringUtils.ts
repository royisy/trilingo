/**
 * Trim leading and trailing spaces, normalize special characters, and convert to lowercase.
 *
 * @param str
 * @returns
 */
export const normalizeString = (str: string): string => {
  return str
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .toLowerCase()
}
