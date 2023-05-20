import { renderHook, waitFor } from '@testing-library/react'
import { db } from '../db'
import { AppSetting } from '../models/AppSetting'
import { Deck } from '../models/Deck'
import { Word } from '../models/Word'
import { useWords } from './useWords'

describe('useWords', () => {
  beforeAll(async () => {
    const deck1 = new Deck(1, 'deck 1')
    await db.decks.add(deck1)
    const word1 = new Word(1, 1, 'definition 1', 'answer 1')
    await db.words.add(word1)
    const deck2 = new Deck(2, 'deck 2')
    await db.decks.add(deck2)
    const word2 = new Word(2, 1, 'definition 2', 'answer 2')
    word2.correctCnt = 0
    word2.skippedCnt = 0
    await db.words.add(word2)
    const word3 = new Word(2, 2, 'definition 3', 'answer 3')
    word3.correctCnt = 1
    word3.skippedCnt = 0
    await db.words.add(word3)
    const word4 = new Word(2, 3, 'definition 4', 'answer 4')
    word4.correctCnt = 2
    word4.skippedCnt = 0
    await db.words.add(word4)
  })

  it('should return empty words when deck is null', async () => {
    const { result } = renderHook(() => useWords(2))
    expect(result.current.noDeckSelected).toEqual(false)
    expect(result.current.words).toEqual([])
    await waitFor(() => {
      expect(result.current.noDeckSelected).toEqual(true)
      expect(result.current.words).toEqual([])
    })
  })

  it('should return words when deck is not null', async () => {
    const appSetting = new AppSetting()
    appSetting.selectedDeckId = 2
    await db.appSettings.add(appSetting)
    const { result } = renderHook(() => useWords(2))
    await waitFor(() => {
      expect(result.current.noDeckSelected).toBe(false)
      expect(result.current.words.length).toBe(2)
      expect(result.current.words[0].no).not.toBe(3)
      expect(result.current.words[1].no).not.toBe(3)
    })
  })
})
