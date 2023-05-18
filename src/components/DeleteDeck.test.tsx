import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { db } from '../db'
import { AppSetting } from '../models/AppSetting'
import { Deck } from '../models/Deck'
import { DeleteDeck } from './DeleteDeck'

describe('DeleteDeck', () => {
  it('should list decks that are in database', async () => {
    const deck1 = new Deck(1, 'deck 1')
    await db.decks.add(deck1)
    const deck2 = new Deck(2, 'deck 2')
    await db.decks.add(deck2)
    render(<DeleteDeck />)
    await waitFor(() => {
      expect(screen.getByText('deck 1')).toBeInTheDocument()
      expect(screen.getByText('deck 2')).toBeInTheDocument()
    })
  })

  it('should set selectedDeckId null when a deck is deleted', async () => {
    const appSetting = new AppSetting()
    appSetting.selectedDeckId = 1
    await appSetting.save()
    render(<DeleteDeck />)
    const deck1Element = await screen.findByText('deck 1')
    const parentLiElement = deck1Element.parentElement
    const svgElement = parentLiElement?.querySelector('svg')
    expect(svgElement).not.toBeNull()
    if (svgElement == null) return
    fireEvent.click(svgElement)
    await waitFor(async () => {
      const decks = await db.decks.toArray()
      expect(decks).toHaveLength(1)
      expect(decks[0].id).toBe(2)
      expect(decks[0].title).toBe('deck 2')
      const appSetting = await db.appSettings.get(1)
      expect(appSetting?.selectedDeckId).toBe(null)
    })
  })

  it('should not set selectedDeckId null when a deck is deleted', async () => {
    const deck1 = new Deck(1, 'deck 1')
    await db.decks.add(deck1)
    const appSetting = await db.appSettings.get(1)
    expect(appSetting).not.toBeUndefined()
    if (appSetting == null) return
    appSetting.selectedDeckId = 2
    await appSetting.save()
    render(<DeleteDeck />)
    const deck1Element = await screen.findByText('deck 1')
    const parentLiElement = deck1Element.parentElement
    const svgElement = parentLiElement?.querySelector('svg')
    expect(svgElement).not.toBeNull()
    if (svgElement == null) return
    fireEvent.click(svgElement)
    await waitFor(async () => {
      const decks = await db.decks.toArray()
      expect(decks).toHaveLength(1)
      expect(decks[0].id).toBe(2)
      expect(decks[0].title).toBe('deck 2')
      const appSetting = await db.appSettings.get(1)
      expect(appSetting?.selectedDeckId).toBe(2)
    })
  })
})
