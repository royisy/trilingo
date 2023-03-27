import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { type Word } from '../models/Word'
import { getAppSetting } from '../repositories/appSetting'
import { getDeckById } from '../repositories/deck'
import {
  getWordsByCorrectCnt,
  getWordsBySkippedCnt,
} from '../repositories/word'
import { normalizeString } from '../utils/stringUtils'

export const Practice = (): JSX.Element => {
  const NUM_OF_WORDS = 10
  const TIME_TO_SHOW_CORRECT = 1000
  const [words, setWords] = useState<Word[]>([])
  const [index, setIndex] = useState<number>(0)
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [answer, setAnswer] = useState<string>('')
  const navigate = useNavigate()

  const getWords = async (): Promise<void> => {
    const appSetting = await getAppSetting()
    const deckId = appSetting.selectedDeckId
    if (deckId == null) {
      navigate('/')
      return
    }
    const deck = await getDeckById(deckId)
    if (deck == null) {
      throw new Error('Deck not found.')
    }
    let words = await getWordsBySkippedCnt(deckId, NUM_OF_WORDS)
    if (words.length < NUM_OF_WORDS) {
      const wordsByCorrectCnt = await getWordsByCorrectCnt(
        deckId,
        NUM_OF_WORDS - words.length
      )
      words = words.concat(wordsByCorrectCnt)
    }
    if (words.length === 0) {
      throw new Error('No words.')
    }
    words = words.sort(() => Math.random() - 0.5)
    setWords(words)
  }

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

  useEffect(() => {
    if (words.length === 0) {
      void getWords()
    }
  }, [])

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
