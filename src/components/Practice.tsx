import { XMarkIcon } from '@heroicons/react/24/solid'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckAnswer } from '../hooks/useCheckAnswer'
import { useCorrectMark } from '../hooks/useCorrectMark'
import { useWords } from '../hooks/useWords'
import { type Word } from '../models/Word'
import { CheckIcon } from './CheckIcon'

const NUM_OF_WORDS = 10
const CORRECT_DISPLAY_TIME = 1000

export const Practice = (): JSX.Element => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { noDeckSelected, words } = useWords(NUM_OF_WORDS)
  const [index, setIndex] = useState<number>(0)
  const navigate = useNavigate()
  const checkAnswer = useCheckAnswer()
  const [userAnswer, setUserAnswer] = useState<string>('')
  const { isCorrect, showCorrect } = useCorrectMark(CORRECT_DISPLAY_TIME)
  const [progress, setProgress] = useState<number>(0)
  const [isReview, setIsReview] = useState<boolean>(false)
  const [skippedWords, setSkippedWords] = useState<Word[]>([])
  const [answer, setAnswer] = useState<string>('')
  const word = isReview ? skippedWords[0] : words[index]
  const showAnswer = answer !== ''

  useEffect(() => {
    inputRef.current?.focus()
  }, [words, index, skippedWords])

  if (noDeckSelected) {
    navigate('/')
  }

  const handleAnswerChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const userAnswer = event.target.value
    setUserAnswer(userAnswer)
    const isCorrectAnswer = await checkAnswer(word, userAnswer, isReview)
    if (!isCorrectAnswer) return
    showCorrect()
    if (progress + 1 === words.length) {
      navigate('/')
    }
    setProgress(progress + 1)
    if (isReview) {
      setSkippedWords(skippedWords.slice(1))
      setUserAnswer('')
    } else {
      showNextWord()
    }
  }

  const handleSkipClick = async (): Promise<void> => {
    word.skippedCnt++
    await word.save()
    setAnswer(word.answer)
  }

  const handleNextClick = (): void => {
    if (isReview) {
      const [first, ...rest] = skippedWords
      setSkippedWords([...rest, first])
    } else {
      setSkippedWords([...skippedWords, word])
    }
    setAnswer('')
    showNextWord()
  }

  const showNextWord = (): void => {
    const nextIndex = index + 1
    if (nextIndex === words.length) {
      setIsReview(true)
    } else {
      setIndex(nextIndex)
    }
    setUserAnswer('')
  }

  if (words.length === 0) {
    return <></>
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-screen-sm p-5">
        <div className="flex items-center">
          <QuitButton />
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
            <div>
              <input
                type="text"
                className="input-primary input w-72 text-2xl sm:w-96"
                ref={inputRef}
                value={userAnswer}
                onChange={handleAnswerChange}
                disabled={showAnswer}
              />
            </div>
            <div className="flex justify-end">
              {!showAnswer && (
                <div>
                  <button
                    className="btn-outline btn mt-5"
                    onClick={handleSkipClick}
                  >
                    Skip
                  </button>
                </div>
              )}
              {showAnswer && (
                <div>
                  <button
                    className="btn-primary btn mt-5"
                    onClick={handleNextClick}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const QuitButton = (): JSX.Element => {
  const navigate = useNavigate()

  return (
    <>
      <label
        htmlFor="quit-practice-modal"
        className="btn-ghost btn-square btn"
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
