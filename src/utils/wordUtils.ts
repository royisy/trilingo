import { type Word } from '../models/Word'

export type WordGroupKey = 'correctCnt' | 'skippedCnt'

export const getColor = (correctCnt: number, skippedCnt: number): string => {
  if (correctCnt > 0) {
    return 'green'
  } else if (skippedCnt > 0) {
    return 'red'
  } else {
    return 'gray'
  }
}

export const getOpacity = (
  correctCnt: number,
  skippedCnt: number,
  minCorrectCnt: number,
  minSkippedCnt: number,
  maxCorrectCnt: number,
  maxSkippedCnt: number
): string => {
  if (correctCnt === 0 && skippedCnt === 0) {
    return '50'
  }

  const MIN_OPACITY = 30
  const MAX_OPACITY = 100
  const OPACITY_RANGE = MAX_OPACITY - MIN_OPACITY
  const ROUND_TO = 10

  const value = correctCnt > 0 ? correctCnt : skippedCnt
  const minValue = correctCnt > 0 ? minCorrectCnt : minSkippedCnt
  const maxValue = correctCnt > 0 ? maxCorrectCnt : maxSkippedCnt
  const valueRange = maxValue - minValue
  const valueRatio = (value - minValue) / valueRange
  const opacity = Math.round(valueRatio * OPACITY_RANGE) + MIN_OPACITY
  const roundedOpacity = Math.round(opacity / ROUND_TO) * ROUND_TO

  return roundedOpacity.toString()
}

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
