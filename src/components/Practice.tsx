import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCheckAnswer } from '../hooks/useCheckAnswer'
import { useSelectedDeck } from '../hooks/useSelectedDeck'
import { useWords } from '../hooks/useWords'

const NUM_OF_WORDS = 10
const TIME_TO_SHOW_CORRECT = 1000

export const Practice = (): JSX.Element => {
  const { selectedDeck, noDeckSelected } = useSelectedDeck()
  const navigate = useNavigate()
  const words = useWords(selectedDeck, NUM_OF_WORDS)
  const [index, setIndex] = useState<number>(0)
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [answer, setAnswer] = useState<string>('')
  const checkAnswer = useCheckAnswer()

  if (noDeckSelected) {
    navigate('/')
  }

  const handleAnswerChange = async (event: any): Promise<void> => {
    const userAnswer = event.target.value
    setUserAnswer(userAnswer)
    const isCorrect = await checkAnswer(words[index], userAnswer)
    if (!isCorrect) return
    setMessage('Correct!')
    setTimeout(() => {
      setMessage('')
    }, TIME_TO_SHOW_CORRECT)
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

  const elements = (
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
  )
  return (
    <>
      <p>
        <Link to="/">Quit</Link>
      </p>
      {words.length > 0 && elements}
    </>
  )
}
