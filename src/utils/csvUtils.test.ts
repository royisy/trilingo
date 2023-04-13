import { vi, type Mock } from 'vitest'
import { getCsv } from './csvUtils'

describe('getCsv', () => {
  it('should return an array of objects', async () => {
    const csvText =
      'no,definition,answer\n' +
      '1,definition 1,answer 1\n' +
      '2,definition 2,answer 2\n'
    global.fetch = vi.fn(() => ({
      ok: true,
      text: () => csvText,
    })) as Mock

    const csvObjects = await getCsv<{
      no: number
      definition: string
      answer: string
    }>('https://example.com/deck.csv')
    expect(csvObjects).toHaveLength(2)
    expect(csvObjects[0]).toHaveProperty('no', 1)
    expect(csvObjects[0]).toHaveProperty('definition', 'definition 1')
    expect(csvObjects[0]).toHaveProperty('answer', 'answer 1')
    expect(csvObjects[1]).toHaveProperty('no', 2)
    expect(csvObjects[1]).toHaveProperty('definition', 'definition 2')
    expect(csvObjects[1]).toHaveProperty('answer', 'answer 2')
  })
})
