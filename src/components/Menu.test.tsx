import { fireEvent, render, screen } from '@testing-library/react'
import { useContext } from 'react'
import { vi } from 'vitest'
import { Menu, MenuComponentContext } from './Menu'

vi.mock('./SelectDeck', () => {
  const SelectDeck = (): JSX.Element => {
    const setMenuComponent = useContext(MenuComponentContext)

    return (
      <>
        <h1> SelectDeck component </h1>
        <button
          onClick={() => {
            setMenuComponent('add-deck')
          }}
        >
          Add deck
        </button>
        <button
          onClick={() => {
            setMenuComponent('delete-deck')
          }}
        >
          Delete deck
        </button>
      </>
    )
  }

  return { SelectDeck }
})

vi.mock('./AddDeck', () => {
  const AddDeck = (): JSX.Element => <h1>AddDeck component</h1>
  AddDeck.displayName = 'AddDeck'
  return { AddDeck }
})

vi.mock('./DeleteDeck', () => {
  const DeleteDeck = (): JSX.Element => <h1>DeleteDeck component</h1>
  DeleteDeck.displayName = 'DeleteDeck'
  return { DeleteDeck }
})

describe('Menu', () => {
  it('should render SelectDeck by default and can switch to AddDeck', () => {
    render(<Menu />)
    expect(screen.getByText('SelectDeck component')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Add deck'))
    expect(screen.getByText('AddDeck component')).toBeInTheDocument()
  })

  it('should render SelectDeck by default and can switch to DeleteDeck', () => {
    render(<Menu />)
    expect(screen.getByText('SelectDeck component')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Delete deck'))
    expect(screen.getByText('DeleteDeck component')).toBeInTheDocument()
  })
})
