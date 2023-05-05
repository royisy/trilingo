interface DeckListProps {
  children: JSX.Element
}
export const DeckList = ({ children }: DeckListProps): JSX.Element => {
  return <ul className="menu mt-5 w-80 sm:w-96">{children}</ul>
}
