interface DeckListProps {
  children: JSX.Element
}
export const DeckList = ({ children }: DeckListProps): JSX.Element => {
  return <ul className="menu w-96 bg-base-100">{children}</ul>
}
