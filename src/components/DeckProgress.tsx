import { type Word } from '../models/Word'

interface DeckProgressProps {
  words: Word[]
}

export const DeckProgress = ({ words }: DeckProgressProps): JSX.Element => {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Definition</th>
            <th>Answer</th>
            <th>Correct</th>
            <th>Skipped</th>
          </tr>
        </thead>
        <tbody>
          {words.map((word) => (
            <tr key={word.no}>
              <td>{word.no}</td>
              <td>{word.definition}</td>
              <td>{word.answer}</td>
              <td>{word.correctCnt}</td>
              <td>{word.skippedCnt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
