import { type Word } from '../models/Word'

export type WordGroupKey = 'correctCnt' | 'skippedCnt'

/**
 * Returns a limited number of words from the input array,
 * taking into account the specified grouping key.
 * Words are first grouped by the given key, then sorted by the key's value,
 * and finally limited to the specified amount.
 * If there are more words in the last group than needed to reach the limit,
 * the last group is shuffled, and only the required number of words is taken.
 *
 * @param words An array of Word objects to limit.
 * @param limit The maximum number of words to return.
 * @param groupKey The grouping key to use ('correctCnt' or 'skippedCnt').
 * @returns A limited array of Word objects based on the specified limit.
 */
export const limitWords = (
  words: Word[],
  limit: number,
  groupKey: WordGroupKey
): Word[] => {
  const groups = groupByKey(words, groupKey)
  const sortedGroups = sortGroups(groups)
  return getLimitedWords(sortedGroups, limit)
}

const groupByKey = (
  words: Word[],
  key: WordGroupKey
): Record<number, Word[]> => {
  return words.reduce<Record<number, Word[]>>((acc, word) => {
    const keyValue = word[key]
    if (acc[keyValue] == null) {
      acc[keyValue] = []
    }
    acc[keyValue].push(word)
    return acc
  }, {})
}

const sortGroups = (
  groups: Record<number, Word[]>
): Array<[string, Word[]]> => {
  return Object.entries(groups).sort(([a], [b]) => Number(a) - Number(b))
}

const getLimitedWords = (
  groups: Array<[string, Word[]]>,
  limit: number
): Word[] => {
  const limitedWords: Word[] = []
  for (const [, words] of groups) {
    if (limitedWords.length + words.length > limit) {
      const shuffledGroup = shuffleArray(words)
      limitedWords.push(...shuffledGroup.slice(0, limit - limitedWords.length))
      break
    }
    limitedWords.push(...words)
  }
  return limitedWords
}

/**
 * Shuffles an array of Word objects using the Fisher-Yates (Knuth) algorithm.
 *
 * @param array The array of Word objects to shuffle.
 * @returns A new shuffled array of Word objects.
 */
export const shuffleArray = (array: Word[]): Word[] => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}
