import { XMarkIcon } from '@heroicons/react/24/solid'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckAnswer } from '../hooks/useCheckAnswer'
import { useCorrectMark } from '../hooks/useCorrectMark'
import { useWords } from '../hooks/useWords'
import { CheckIcon } from './CheckIcon'

const NUM_OF_WORDS = 10
const CORRECT_DISPLAY_TIME = 1000

export const Practice = (): JSX.Element => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { noDeckSelected, words } = useWords(NUM_OF_WORDS)
  const navigate = useNavigate()
  const checkAnswer = useCheckAnswer()
  const [index, setIndex] = useState<number>(0)
  const [userAnswer, setUserAnswer] = useState<string>('')
  const { isCorrect, showCorrect } = useCorrectMark(CORRECT_DISPLAY_TIME)
  const [answer, setAnswer] = useState<string>('')

  useEffect(() => {
    inputRef.current?.focus()
  }, [words, index])

  if (noDeckSelected) {
    navigate('/')
  }

  const handleAnswerChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const userAnswer = event.target.value
    setUserAnswer(userAnswer)
    const isCorrectAnswer = await checkAnswer(words[index], userAnswer)
    if (!isCorrectAnswer) return
    showCorrect()
    showNextWord()
  }

  const handleSkipClick = async (): Promise<void> => {
    const word = words[index]
    word.skippedCnt++
    await word.save()
    setAnswer(word.answer)
  }

  const handleNextClick = (): void => {
    setAnswer('')
    showNextWord()
  }

  const showNextWord = (): void => {
    const nextIndex = index + 1
    if (nextIndex >= words.length) {
      navigate('/')
    }
    setIndex(nextIndex)
    setUserAnswer('')
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-screen-sm p-5">
        <div className="flex items-center">
          <button
            className="btn-ghost btn-square btn"
            onClick={() => {
              navigate('/')
            }}
          >
            <XMarkIcon className="w-10 sm:w-12" />
          </button>
          <progress
            className="progress progress-primary ml-4 h-4 w-full sm:ml-5 sm:h-5"
            value={index}
            max={words.length}
          ></progress>
        </div>
        {words.length > 0 && (
          <>
            <div className="flex h-28 flex-col items-center sm:h-60">
              <p className="mt-7 text-3xl sm:mt-24">
                {words[index]?.definition}
              </p>
              <div>
                {isCorrect && (
                  <CheckIcon className="w-12 text-green-500 sm:mt-5 sm:w-16" />
                )}
              </div>
              <p className="mt-1 text-2xl sm:mt-8 sm:text-3xl">{answer}</p>
            </div>
            <div className="flex flex-col items-center">
              <div>
                <div>
                  <input
                    type="text"
                    className="input-bordered input-primary input w-72 text-2xl sm:w-96"
                    ref={inputRef}
                    value={userAnswer}
                    onChange={handleAnswerChange}
                    disabled={answer !== ''}
                  />
                </div>
                <div className="flex justify-end">
                  {answer === '' && (
                    <div>
                      <button
                        className="btn-outline btn mt-5"
                        onClick={handleSkipClick}
                      >
                        Skip
                      </button>
                    </div>
                  )}
                  {answer !== '' && (
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
          </>
        )}
      </div>
    </div>
  )
}
