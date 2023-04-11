import { renderHook, waitFor } from '@testing-library/react'
import { db } from '../db'
import { Word } from '../models/Word'
import { useCheckAnswer } from './useCheckAnswer'

describe('useCheckAnswer', () => {
  it('should return true if user answer is correct', async () => {
    const word = new Word(1, 1, 'definition 1 ', 'answer 1')
    await db.words.add(word)
    const { result } = renderHook(() => useCheckAnswer())
    await waitFor(async () => {
      await expect(result.current(word, 'answer 1')).resolves.toBe(true)
    })
    const word1 = await db.words.get(1)
    expect(word1?.correctCnt).toBe(1)
    expect(word1?.skippedCnt).toBe(0)
  })

  it('should return false if user answer is incorrect', async () => {
    const word = new Word(1, 2, 'definition 2 ', 'answer 2')
    await db.words.add(word)
    const { result } = renderHook(() => useCheckAnswer())
    await waitFor(async () => {
      await expect(result.current(word, 'answer')).resolves.toBe(false)
    })
    const word2 = await db.words.get(2)
    expect(word2?.correctCnt).toBe(0)
    expect(word2?.skippedCnt).toBe(0)
  })
})
