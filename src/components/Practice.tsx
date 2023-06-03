import { XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckAnswer } from '../hooks/useCheckAnswer'
import { useCorrectMark } from '../hooks/useCorrectMark'
import { useWords } from '../hooks/useWords'
import { type Word } from '../models/Word'
import { CheckIcon } from './CheckIcon'

const NUM_OF_WORDS = 10
const CORRECT_DISPLAY_TIME = 1000

interface WordResult {
  word: Word
  correct: boolean
  skippedCnt: number
}

export const Practice = (): JSX.Element => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { noDeckSelected, words } = useWords(NUM_OF_WORDS)
  const [index, setIndex] = useState<number>(0)
  const [isRevealed, setIsRevealed] = useState<boolean>(false)
  const navigate = useNavigate()
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [isReview, setIsReview] = useState<boolean>(false)
  const checkAnswer = useCheckAnswer()
  const { isCorrect, showCorrect } = useCorrectMark(CORRECT_DISPLAY_TIME)
  const [progress, setProgress] = useState<number>(0)
  const [disabled, setDisabled] = useState<boolean>(false)
  const [showResult, setShowResult] = useState<boolean>(false)
  const [skippedWords, setSkippedWords] = useState<Word[]>([])
  const [result, setResult] = useState<WordResult[]>([])
  const [answer, setAnswer] = useState<string>('')
  const word = isReview ? skippedWords[0] : words[index]
  const showAnswer = answer !== ''

  useEffect(() => {
    inputRef.current?.focus()
  }, [words, index, isRevealed, userAnswer])

  if (noDeckSelected) {
    navigate('/')
  }

  const handleAnswerChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const userAnswer = event.target.value
    setUserAnswer(userAnswer)
    const shouldUpdate = !isReview && !isRevealed
    const isCorrectAnswer = await checkAnswer(word, userAnswer, shouldUpdate)
    if (!isCorrectAnswer) return

    if (!isRevealed) {
      showCorrect()
      setProgress(progress + 1)
      if (progress + 1 === words.length) {
        setDisabled(true)
        await new Promise((resolve) =>
          setTimeout(resolve, CORRECT_DISPLAY_TIME)
        )
        window.scrollTo({ top: 0 })
        setShowResult(true)
      }
    }
    if (isReview) {
      if (isRevealed) {
        const [first, ...rest] = skippedWords
        setSkippedWords([...rest, first])
      } else {
        setSkippedWords(skippedWords.slice(1))
      }
    } else {
      if (isRevealed) {
        setSkippedWords([...skippedWords, word])
      } else {
        setResult([...result, { word, correct: true, skippedCnt: 0 }])
      }
      const nextIndex = index + 1
      if (nextIndex === words.length) {
        setIsReview(true)
      } else {
        setIndex(nextIndex)
      }
    }
    setAnswer('')
    setUserAnswer('')
    setIsRevealed(false)
  }

  const clearInput = (): void => {
    setUserAnswer('')
  }

  const handleRevealClick = async (): Promise<void> => {
    setIsRevealed(true)
    word.skippedCnt++
    await word.save()
    const wordResult = result.find((r) => r.word.id === word.id)
    if (wordResult != null) {
      wordResult.skippedCnt++
    } else {
      setResult([...result, { word, correct: false, skippedCnt: 1 }])
    }
    setAnswer(word.answer)
  }

  if (words.length === 0) {
    return <></>
  }

  if (showResult) {
    return <Result result={result} />
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-screen-sm p-5">
        <div className="flex items-center">
          <QuitButton disabled={disabled} />
          <progress
            className="progress progress-primary ml-2 mr-3 h-4 w-full sm:ml-5 sm:h-5"
            value={progress}
            max={words.length}
          ></progress>
        </div>
        <div className="flex h-8 justify-end pr-3 sm:pt-1">
          {isReview && <p className="badge badge-primary p-3">Review</p>}
        </div>
        <div className="flex h-20 flex-col items-center sm:h-52">
          <p className="-mt-1 text-3xl sm:mt-16">{word?.definition}</p>
          {isCorrect && !showAnswer && (
            <CheckIcon className="-mt-1 w-12 text-green-500 sm:mt-5 sm:w-16" />
          )}
          <p className="mt-1 text-2xl sm:mt-8 sm:text-3xl">{answer}</p>
        </div>
        <div className="flex flex-col items-center">
          <div>
            <div className="relative">
              <input
                type="text"
                className="input-primary input w-72 text-2xl sm:w-96"
                ref={inputRef}
                value={userAnswer}
                onChange={handleAnswerChange}
                disabled={disabled}
              />
              {userAnswer !== '' && (
                <button onClick={clearInput} className="absolute right-3 top-3">
                  <XCircleIcon className="h-6 w-6 text-gray-500" />
                </button>
              )}
            </div>
            <div className="flex justify-end">
              <div>
                <button
                  className="btn-outline btn mt-5"
                  onClick={handleRevealClick}
                  disabled={isRevealed || disabled}
                >
                  {isRevealed ? 'Revealed' : 'Reveal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface QuitButtonProps {
  disabled: boolean
}

const QuitButton = ({ disabled }: QuitButtonProps): JSX.Element => {
  const navigate = useNavigate()

  return (
    <>
      <label
        htmlFor="quit-practice-modal"
        className={`btn-square btn ${disabled ? 'btn-disabled' : 'btn-ghost'}`}
        title="Quit"
      >
        <XMarkIcon className="w-10 sm:w-12" />
      </label>
      <input
        type="checkbox"
        id="quit-practice-modal"
        className="modal-toggle"
      />
      <label htmlFor="quit-practice-modal" className="modal cursor-pointer">
        <label className="modal-box text-xl">
          <p>Quit practice?</p>
          <div className="modal-action">
            <label htmlFor="quit-practice-modal" className="btn-outline btn">
              Cancel
            </label>
            <label
              htmlFor="quit-practice-modal"
              className="btn-primary btn"
              onClick={() => {
                navigate('/')
              }}
            >
              OK
            </label>
          </div>
        </label>
      </label>
    </>
  )
}

interface ResultProps {
  result: WordResult[]
}

const Result = ({ result }: ResultProps): JSX.Element => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center p-5">
      <div>
        <button
          className="btn-primary btn"
          onClick={() => {
            navigate('/')
          }}
        >
          Finish
        </button>
      </div>
      <table className="table-zebra mt-5 table w-96">
        <tbody className="text-lg">
          {result.map((wordResult, index) => (
            <tr key={wordResult.word.id}>
              <td className="text-right">{index + 1}</td>
              <td>{wordResult.word.definition}</td>
              <td>{wordResult.word.answer}</td>
              <td className="flex justify-center text-red-500">
                {wordResult.correct && (
                  <CheckIcon className="w-9 text-green-500" />
                )}
                {!wordResult.correct && `+${wordResult.skippedCnt}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
