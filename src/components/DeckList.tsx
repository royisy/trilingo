interface DeckListProps {
  children: JSX.Element
}
export const DeckList = ({ children }: DeckListProps): JSX.Element => {
  return <ul className="menu">{children}</ul>
}
