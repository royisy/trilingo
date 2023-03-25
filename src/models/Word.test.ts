import { db } from '../db'
import { Word } from './Word'

describe('Word', () => {
  beforeAll(async () => {
    const word = new Word(1, 1, 'definition 1', 'answer 1')
    await db.words.add(word)
  })

  it('should save Word', async () => {
    const word = new Word(1, 2, 'definition 2', 'answer 2')
    await word.save()
    const words = await db.words.toArray()
    expect(words).toHaveLength(2)
  })

  it('should update Word', async () => {
    const word = await db.words.get(2)
    expect(word).not.toBeNull()
    if (word != null) {
      expect(word.definition).toBe('definition 2')
      word.definition = 'definition 2 updated'
      await word.save()
    }
    const updatedWord = await db.words.get(2)
    expect(updatedWord?.definition).toBe('definition 2 updated')
  })
})
