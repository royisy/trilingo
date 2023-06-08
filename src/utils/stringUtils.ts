/**
 * Normalizes a string by performing the following operations:
 * 1. Trimming white spaces from both ends.
 * 2. Removing spaces and hyphens.
 * 3. Replacing diacritics with their base characters
 *    using Unicode Normalization Form D (NFD).
 * 4. Replacing the German sharp s (ß) with 'ss'.
 * 5. Converting the string to lowercase.
 *
 * @param str The input string to be normalized.
 * @returns The normalized string.
 */
export const normalizeString = (str: string): string => {
  return str
    .trim()
    .replace(/[\s-]/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .toLowerCase()
}

/**
 * Splits the answer by the user's answer.
 *
 * @param answer
 * @param userAnswer
 * @returns
 */
export const splitAnswerByMatch = (
  answer: string,
  userAnswer: string
): { matchedPart: string; remainingPart: string } => {
  const normalizedUserAnswer = normalizeString(userAnswer)
  let matchEndIndex = 0
  if (normalizedUserAnswer.length > 0) {
    matchEndIndex = answer.split('').findIndex((char, index) => {
      const partialAnswer = answer.slice(0, index + 1)
      const normalizedPartialAnswer = normalizeString(partialAnswer)
      return !normalizedUserAnswer.startsWith(normalizedPartialAnswer)
    })
  }
  let matchedPart = ''
  let remainingPart = ''
  if (matchEndIndex === -1) {
    matchedPart = answer
  } else {
    matchedPart = answer.substring(0, matchEndIndex)
    remainingPart = answer.substring(matchEndIndex)
  }
  return { matchedPart, remainingPart }
}
