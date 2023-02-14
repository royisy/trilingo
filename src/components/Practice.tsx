import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { type Word } from '../models/Word'
import { AppSettingRepository } from '../repositories/AppSettingRepository'
import { DeckRepository } from '../repositories/DeckRepository'
import { WordRepository } from '../repositories/WordRepository'
import { normalizeString } from '../utils/stringUtils'

export function Practice(): JSX.Element {
  const NUM_OF_WORDS = 10
  const TIME_TO_SHOW_CORRECT = 1000
  const [words, setWords] = useState<Word[]>([])
  const [index, setIndex] = useState<number>(0)
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const navigate = useNavigate()

  async function getWords(): Promise<void> {
    const appSettingRepo = new AppSettingRepository()
    const appSetting = await appSettingRepo.get()
    const deckId = appSetting.selectedDeckId
    if (deckId == null) {
      throw new Error('Incorrect transition.')
    }
    const deckRepo = new DeckRepository()
    const deck = await deckRepo.getById(deckId)
    if (deck == null) {
      throw new Error('Deck not found.')
    }
    const wordRepo = new WordRepository()
    let words = await wordRepo.getBySkippedCnt(deckId, NUM_OF_WORDS)
    if (words.length < NUM_OF_WORDS) {
      const wordsByCorrectCnt = await wordRepo.getByCorrectCnt(
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

  function handleAnswerChange(event: any): void {
    const word = words[index]
    const userAnswer = event.target.value
    setUserAnswer(userAnswer)
    if (normalizeString(word.answer) !== normalizeString(userAnswer)) {
      return
    }
    word.correctCnt++
    word.save()
    setMessage('Correct!')
    setTimeout(() => {
      setMessage('')
    }, TIME_TO_SHOW_CORRECT)
    nextWord()
  }

  function handleSkipClick(): void {
    const word = words[index]
    word.skippedCnt++
    word.save()
    setMessage(word.answer)
    setShowAnswer(true)
  }

  function handleNextClick(): void {
    setMessage('')
    setShowAnswer(false)
    nextWord()
  }

  function nextWord(): void {
    const nextIndex = index + 1
    if (nextIndex >= NUM_OF_WORDS) {
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
        {index + 1} / {NUM_OF_WORDS}
      </p>
      <p>{words[index]?.definition}</p>
      <p>{message}</p>
      <p>
        <input
          type="text"
          value={userAnswer}
          onChange={handleAnswerChange}
          disabled={showAnswer}
        />
      </p>
      {!showAnswer && (
        <p>
          <button onClick={handleSkipClick}>Skip</button>
        </p>
      )}
      {showAnswer && (
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
