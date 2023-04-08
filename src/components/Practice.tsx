import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWords } from '../hooks/useWords'
import { normalizeString } from '../utils/stringUtils'

export const Practice = (): JSX.Element => {
  const NUM_OF_WORDS = 10
  const TIME_TO_SHOW_CORRECT = 1000

  const navigate = useNavigate()
  const handleDeckIdMissing = useCallback(() => {
    navigate('/')
  }, [navigate])
  const words = useWords(NUM_OF_WORDS, handleDeckIdMissing)
  const [index, setIndex] = useState<number>(0)
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [answer, setAnswer] = useState<string>('')

  const handleAnswerChange = async (event: any): Promise<void> => {
    const word = words[index]
    const userAnswer = event.target.value
    setUserAnswer(userAnswer)
    if (normalizeString(word.answer) !== normalizeString(userAnswer)) {
      return
    }
    word.correctCnt++
    await word.save()
    setMessage('Correct!')
    setTimeout(() => {
      setMessage('')
    }, TIME_TO_SHOW_CORRECT)
    nextWord()
  }

  const handleSkipClick = async (): Promise<void> => {
    const word = words[index]
    word.skippedCnt++
    await word.save()
    setAnswer(word.answer)
  }

  const handleNextClick = (): void => {
    setAnswer('')
    nextWord()
  }

  const nextWord = (): void => {
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
