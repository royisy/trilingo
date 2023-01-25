/**
 * Remove spaces, normalize special characters and lower case.
 *
 * @param str 
 * @returns 
 */
export function normalizeString(str: string): string {
    return str
        .replace(/\s/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ß/g, "ss")
        .toLowerCase();
}
