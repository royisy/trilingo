import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCheckAnswer } from '../hooks/useCheckAnswer'
import { useMessage } from '../hooks/useMessage'
import { useSelectedDeck } from '../hooks/useSelectedDeck'
import { useWords } from '../hooks/useWords'

const NUM_OF_WORDS = 10
const CORRECT_DISPLAY_TIME = 1000

export const Practice = (): JSX.Element => {
  const { selectedDeck, noDeckSelected } = useSelectedDeck()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const checkAnswer = useCheckAnswer()
  const words = useWords(selectedDeck, NUM_OF_WORDS)
  const [index, setIndex] = useState<number>(0)
  const [userAnswer, setUserAnswer] = useState<string>('')
  const { message, setMessage } = useMessage(CORRECT_DISPLAY_TIME)
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
    const isCorrect = await checkAnswer(words[index], userAnswer)
    if (!isCorrect) return
    setMessage('Correct!')
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
    <>
      <p>
        <Link to="/">Quit</Link>
      </p>
      {words.length > 0 && (
        <>
          <p>
            {index + 1} / {words.length}
          </p>
          <p>{words[index]?.definition}</p>
          <p>{message}</p>
          <p>{answer}</p>
          <p>
            <input
              type="text"
              ref={inputRef}
              value={userAnswer}
              onChange={handleAnswerChange}
              disabled={answer !== ''}
            />
          </p>
          {answer === '' && (
            <p>
              <button onClick={handleSkipClick}>Skip</button>
            </p>
          )}
          {answer !== '' && (
            <p>
              <button onClick={handleNextClick}>Next</button>
            </p>
          )}
        </>
      )}
    </>
  )
}
