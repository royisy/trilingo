import { useNavigate } from 'react-router-dom'
import { type WordResult } from '../models/WordResult'
import { CheckIcon } from './icons/CheckIcon'

interface ResultProps {
  result: WordResult[]
}

export const PracticeResult = ({ result }: ResultProps): JSX.Element => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center p-5">
      <div>
        <button
          className="btn btn-primary"
          onClick={() => {
            navigate('/')
          }}
        >
          Finish
        </button>
      </div>
      <table className="table table-zebra mt-5 max-w-screen-sm">
        <tbody className="text-lg">
          {result.map((wordResult, index) => (
            <tr key={wordResult.word.id}>
              <td className="text-right">{index + 1}</td>
              <td>{wordResult.word.definition}</td>
              <td>{wordResult.word.answer}</td>
              <td className="text-red-500">
                <div className="flex justify-center">
                  {wordResult.correct && (
                    <CheckIcon className="w-9 text-green-500" />
                  )}
                  {!wordResult.correct && `+${wordResult.skippedCnt}`}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
