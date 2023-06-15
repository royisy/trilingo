import { XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import {
  useEffect,
  useRef,
  useState,
  type ChangeEventHandler,
  type Dispatch,
  type MouseEventHandler,
  type SetStateAction,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckAnswer } from '../hooks/useCheckAnswer'
import { useCorrectMark } from '../hooks/useCorrectMark'
import { useWords } from '../hooks/useWords'
import { type Word } from '../models/Word'
import { type WordResult } from '../models/WordResult'
import { splitAnswerByMatch } from '../utils/stringUtils'
import { PracticeResult } from './PracticeResult'
import { CheckIcon } from './icons/CheckIcon'

const NUM_OF_WORDS = 10
const CORRECT_DISPLAY_TIME = 1000

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
    return <PracticeResult result={result} />
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-screen-sm p-5">
        <div className="flex items-center">
          <QuitButton disabled={disabled} />
          <progress
            className="progress-primary progress ml-1 mr-3 h-4 w-full sm:ml-3 sm:h-5"
            value={progress}
            max={words.length}
          />
        </div>
        <div className="-mt-4 flex h-32 flex-col sm:-mt-3.5 sm:h-56">
          <ReviewBadge isReview={isReview} />
          <Definition word={word} />
          <Answer
            answer={answer}
            userAnswer={userAnswer}
            isCorrect={isCorrect}
          />
        </div>
        <div className="flex flex-col items-center">
          <div>
            <AnswerInput
              setUserAnswer={setUserAnswer}
              inputRef={inputRef}
              userAnswer={userAnswer}
              handleAnswerChange={handleAnswerChange}
              disabled={disabled}
            />
            <RevealButton
              isRevealed={isRevealed}
              handleRevealClick={handleRevealClick}
              disabled={disabled}
            />
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

interface ReviewBadgeProps {
  isReview: boolean
}

const ReviewBadge = ({ isReview }: ReviewBadgeProps): JSX.Element => {
  return (
    <div className="flex h-full justify-end pr-3">
      {isReview && (
        <p className="badge badge-primary mt-3.5 p-2.5 sm:mt-4 sm:p-3">
          Review
        </p>
      )}
    </div>
  )
}

interface DefinitionProps {
  word: Word | undefined
}

const Definition = ({ word }: DefinitionProps): JSX.Element => {
  const definitionLength = word?.definition.length ?? 0
  let definitionFontSize = 'text-3xl'
  if (definitionLength > 25) {
    definitionFontSize = 'text-base'
  } else if (definitionLength > 20) {
    definitionFontSize = 'text-lg'
  } else if (definitionLength > 15) {
    definitionFontSize = 'text-2xl'
  }

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-[55px,1fr,55px] sm:grid-cols-[60px,1fr,60px]">
        <div className="flex justify-end">
          <p className="pr-3 text-sm sm:text-base">{word?.partOfSpeech}</p>
        </div>
        <p className={`whitespace-nowrap sm:text-3xl ${definitionFontSize}`}>
          {word?.definition}
        </p>
      </div>
    </div>
  )
}

interface AnswerProps {
  answer: string
  userAnswer: string
  isCorrect: boolean
}

const Answer = ({
  answer,
  userAnswer,
  isCorrect,
}: AnswerProps): JSX.Element => {
  const showAnswer = answer !== ''
  const { matchedPart, remainingPart } = splitAnswerByMatch(answer, userAnswer)

  return (
    <div className="relative h-full">
      <div
        className="absolute left-1/2 top-1/2 -mt-1.5 flex -translate-x-1/2 -translate-y-1/2
              transform items-center sm:h-56"
      >
        {isCorrect && !showAnswer && (
          <CheckIcon className="w-12 text-green-500" />
        )}
        {showAnswer && (
          <p className="whitespace-nowrap text-2xl sm:text-3xl">
            <span className="text-green-500">{matchedPart}</span>
            {remainingPart}
          </p>
        )}
      </div>
    </div>
  )
}

interface AnswerInputProps {
  setUserAnswer: Dispatch<SetStateAction<string>>
  inputRef: React.RefObject<HTMLInputElement>
  userAnswer: string
  handleAnswerChange: ChangeEventHandler<HTMLInputElement>
  disabled: boolean
}

const AnswerInput = ({
  setUserAnswer,
  inputRef,
  userAnswer,
  handleAnswerChange,
  disabled,
}: AnswerInputProps): JSX.Element => {
  const clearInput = (): void => {
    setUserAnswer('')
  }

  return (
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
  )
}

interface RevealButtonProps {
  handleRevealClick: MouseEventHandler<HTMLButtonElement>
  isRevealed: boolean
  disabled: boolean
}

const RevealButton = ({
  handleRevealClick,
  isRevealed,
  disabled,
}: RevealButtonProps): JSX.Element => {
  return (
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
  )
}
