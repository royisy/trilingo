import { renderHook, waitFor } from '@testing-library/react'
import { db } from '../db'
import { Word } from '../models/Word'
import { useCheckAnswer } from './useCheckAnswer'

describe('useCheckAnswer', () => {
  it('should return true if user answer is correct', async () => {
    const word = new Word(1, 1, 'definition 1 ', 'answer 1')
    await db.words.add(word)
    const { result } = renderHook(() => useCheckAnswer())
    const shouldUpdate = true
    await waitFor(async () => {
      await expect(
        result.current(word, 'answer 1', shouldUpdate)
      ).resolves.toBe(true)
    })
    const word1 = await db.words.get(1)
    expect(word1?.correctCnt).toBe(1)
    expect(word1?.skippedCnt).toBe(0)
  })

  it('should not increment correctCnt in review', async () => {
    const word = new Word(1, 2, 'definition 2 ', 'answer 2')
    const { result } = renderHook(() => useCheckAnswer())
    const shouldUpdate = false
    await waitFor(async () => {
      await expect(
        result.current(word, 'answer 2', shouldUpdate)
      ).resolves.toBe(true)
    })
    const word2 = await db.words.get(2)
    expect(word2).toBeUndefined()
    expect(word.correctCnt).toBe(0)
    expect(word.skippedCnt).toBe(0)
  })

  it('should return false if user answer is incorrect', async () => {
    const word = new Word(1, 3, 'definition 3 ', 'answer 3')
    await db.words.add(word)
    const { result } = renderHook(() => useCheckAnswer())
    const shouldUpdate = true
    await waitFor(async () => {
      await expect(result.current(word, 'answer', shouldUpdate)).resolves.toBe(
        false
      )
    })
    const word3 = await db.words.get(2)
    expect(word3?.correctCnt).toBe(0)
    expect(word3?.skippedCnt).toBe(0)
  })
})
