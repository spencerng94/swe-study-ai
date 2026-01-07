import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw, Eye, EyeOff, Sparkles, CheckCircle, XCircle, MessageSquare, SkipBack, SkipForward, ArrowLeft, ArrowRight } from 'lucide-react'
import { useGame } from './gamification/GameProvider'
import { flashcards as flashcardData } from '../data/flashcards'

function ActiveRecallQuizzer({ initialCategory = 'all' }) {
  const gameState = useGame()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [shuffledCards, setShuffledCards] = useState([...flashcardData])
  const [categoryFilter, setCategoryFilter] = useState(initialCategory)
  const [completedCards, setCompletedCards] = useState(new Set())
  const [tryAnswerMode, setTryAnswerMode] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [aiFeedback, setAiFeedback] = useState(null)
  const [isRating, setIsRating] = useState(false)

  const filteredCards = categoryFilter === 'all'
    ? shuffledCards
    : shuffledCards.filter(card => card.category === categoryFilter)

  const currentCard = filteredCards[currentIndex]
  const categories = ['all', ...new Set(flashcardData.map(c => c.category))]

  const nextCard = useCallback(() => {
    // Award XP when moving to next card (card completed)
    const currentCardId = filteredCards[currentIndex]?.id
    if (currentCardId && !completedCards.has(currentCardId)) {
      setCompletedCards(prev => new Set([...prev, currentCardId]))
      gameState.actions.flashcardComplete()
    }
    
    setShowAnswer(false)
    setUserAnswer('')
    setAiFeedback(null)
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length)
  }, [currentIndex, filteredCards, completedCards, gameState])

  const prevCard = useCallback(() => {
    setShowAnswer(false)
    setUserAnswer('')
    setAiFeedback(null)
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length)
  }, [filteredCards.length])

  const shuffle = () => {
    const shuffled = [...flashcardData].sort(() => Math.random() - 0.5)
    setShuffledCards(shuffled)
    setCurrentIndex(0)
    setShowAnswer(false)
    setUserAnswer('')
    setAiFeedback(null)
    setCompletedCards(new Set()) // Reset completed cards
  }

  // AI Rating Function - Simulates AI analysis of user's answer
  const rateAnswer = async () => {
    if (!userAnswer.trim()) return

    setIsRating(true)
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const correctAnswer = currentCard.answer.toLowerCase()
    const userAnswerLower = userAnswer.toLowerCase()

    // Extract key concepts from the correct answer
    const keyConcepts = extractKeyConcepts(correctAnswer)
    const userConcepts = extractKeyConcepts(userAnswerLower)

    // Calculate score based on concept matching
    let score = 0
    let matchedConcepts = []
    let missingConcepts = []

    keyConcepts.forEach(concept => {
      if (userConcepts.some(uc => uc.includes(concept) || concept.includes(uc))) {
        matchedConcepts.push(concept)
        score += 20
      } else {
        missingConcepts.push(concept)
      }
    })

    // Bonus for length and detail (if answer is substantial)
    if (userAnswer.length > 50) score += 10
    if (userAnswer.length > 100) score += 10

    // Cap score at 100
    score = Math.min(100, score)

    // Generate feedback
    const feedback = generateFeedback(score, matchedConcepts, missingConcepts, correctAnswer, userAnswerLower)

    setAiFeedback({
      score,
      feedback,
      matchedConcepts,
      missingConcepts,
    })

    setIsRating(false)

    // Award bonus XP for attempting to answer
    if (score >= 60) {
      gameState.awardXP(10, 'flashcard_answer_attempt')
    }
  }

  // Extract key concepts from text
  const extractKeyConcepts = (text) => {
    // Remove common words and extract meaningful terms
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'this', 'that', 'these', 'those', 'it', 'they', 'we', 'you', 'he', 'she', 'what', 'when', 'where', 'why', 'how'])
    
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word))
    
    // Get unique words and common phrases
    const uniqueWords = [...new Set(words)]
    const phrases = []
    
    // Extract common technical phrases (2-3 word combinations)
    const wordArray = text.toLowerCase().split(/\s+/)
    for (let i = 0; i < wordArray.length - 1; i++) {
      const phrase = `${wordArray[i]} ${wordArray[i + 1]}`
      if (phrase.length > 5 && !stopWords.has(wordArray[i]) && !stopWords.has(wordArray[i + 1])) {
        phrases.push(phrase)
      }
    }
    
    return [...uniqueWords, ...phrases].slice(0, 15) // Limit to top concepts
  }

  // Generate feedback based on score and analysis
  const generateFeedback = (score, matchedConcepts, missingConcepts, correctAnswer, userAnswer) => {
    let feedback = []
    
    if (score >= 90) {
      feedback.push("Excellent! Your answer demonstrates strong understanding of the concept.")
    } else if (score >= 70) {
      feedback.push("Good job! You've covered most of the key points.")
    } else if (score >= 50) {
      feedback.push("You're on the right track, but there's room for improvement.")
    } else {
      feedback.push("Keep practicing! Review the key concepts and try again.")
    }

    if (matchedConcepts.length > 0) {
      feedback.push(`You correctly mentioned: ${matchedConcepts.slice(0, 3).join(', ')}`)
    }

    if (missingConcepts.length > 0 && score < 80) {
      feedback.push(`Consider including: ${missingConcepts.slice(0, 3).join(', ')}`)
    }

    if (userAnswer.length < 30) {
      feedback.push("Try to provide more detail in your answer. Elaborate on the concepts.")
    }

    return feedback
  }

  useEffect(() => {
    setCategoryFilter(initialCategory)
    setCurrentIndex(0)
    setShowAnswer(false)
    setUserAnswer('')
    setAiFeedback(null)
  }, [initialCategory])

  // Reset answer when card changes
  useEffect(() => {
    setUserAnswer('')
    setAiFeedback(null)
  }, [currentIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't navigate if user is typing in textarea or input (unless it's a number input for navigation)
      if ((e.target.tagName === 'TEXTAREA' || (e.target.tagName === 'INPUT' && e.target.type !== 'number')) && e.key !== 'Home' && e.key !== 'End') {
        return
      }

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault()
        prevCard()
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault()
        nextCard()
      } else if (e.key === 'Home') {
        e.preventDefault()
        goToCard(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        goToCard(filteredCards.length - 1)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentIndex, filteredCards.length, prevCard, nextCard])

  const goToCard = useCallback((index) => {
    if (index >= 0 && index < filteredCards.length) {
      setCurrentIndex(index)
      setShowAnswer(false)
      setUserAnswer('')
      setAiFeedback(null)
    }
  }, [filteredCards.length])
  
  // Award XP when viewing answer (encourages learning)
  useEffect(() => {
    if (showAnswer) {
      // Small reward for engaging with the content
      // Only award once per card per session
    }
  }, [showAnswer])

  if (!currentCard) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-salesforce-gray">No cards found for selected category.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-salesforce-dark-blue mb-2">
          Active Recall Quizzer
        </h2>
        <p className="text-salesforce-gray">
          Test your knowledge of Salesforce full-stack engineering concepts
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-medium text-salesforce-dark-blue">Filter by category:</span>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setCategoryFilter(category)
                setCurrentIndex(0)
                setShowAnswer(false)
                setUserAnswer('')
                setAiFeedback(null)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                categoryFilter === category
                  ? 'bg-salesforce-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
        {/* Try Answer Mode Toggle */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-3">
          <input
            type="checkbox"
            id="tryAnswerMode"
            checked={tryAnswerMode}
            onChange={(e) => {
              setTryAnswerMode(e.target.checked)
              if (!e.target.checked) {
                setUserAnswer('')
                setAiFeedback(null)
              }
            }}
            className="w-4 h-4 text-salesforce-blue rounded focus:ring-salesforce-blue"
          />
          <label htmlFor="tryAnswerMode" className="text-sm font-medium text-salesforce-dark-blue cursor-pointer">
            Try to answer before revealing (AI will rate your answer)
          </label>
        </div>
      </div>

      {/* Flashcard */}
      <div className="bg-white rounded-lg shadow-lg border-2 border-salesforce-blue overflow-hidden">
        {/* Card Header */}
        <div className="bg-salesforce-blue text-white px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-sm font-medium opacity-90">
              {currentCard.category}
            </span>
            <p className="text-xs opacity-75 mt-1">
              Card {currentIndex + 1} of {filteredCards.length}
            </p>
          </div>
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            {showAnswer ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide Answer
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show Answer
              </>
            )}
          </button>
        </div>

        {/* Card Content */}
        <div className="p-8 min-h-[300px] flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-salesforce-dark-blue mb-3">
              Question:
            </h3>
            <p className="text-lg text-gray-800 leading-relaxed">
              {currentCard.question}
            </p>
          </div>

          {/* Try Answer Mode - User Input */}
          {tryAnswerMode && !showAnswer && (
            <div className="mt-6 pt-6 border-t-2 border-gray-200">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-salesforce-dark-blue mb-2">
                  Your Answer:
                </label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here... Try to recall what you know about this concept."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-salesforce-blue focus:ring-2 focus:ring-salesforce-light-blue focus:outline-none resize-none"
                  rows={6}
                  disabled={isRating}
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={rateAnswer}
                  disabled={!userAnswer.trim() || isRating}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-salesforce-blue to-blue-600 text-white rounded-lg hover:from-salesforce-dark-blue hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isRating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      AI is rating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Rate My Answer
                    </>
                  )}
                </button>
                {aiFeedback && (
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="px-4 py-2 text-salesforce-blue border-2 border-salesforce-blue rounded-lg hover:bg-salesforce-light-blue transition-colors font-medium"
                  >
                    Show Correct Answer
                  </button>
                )}
              </div>

              {/* AI Feedback */}
              {aiFeedback && (
                <div className={`mt-4 p-4 rounded-lg border-2 ${
                  aiFeedback.score >= 70 
                    ? 'bg-green-50 border-green-300' 
                    : aiFeedback.score >= 50
                    ? 'bg-yellow-50 border-yellow-300'
                    : 'bg-red-50 border-red-300'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    {aiFeedback.score >= 70 ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-yellow-600" />
                    )}
                    <div>
                      <div className="font-bold text-lg">
                        Score: {aiFeedback.score}/100
                      </div>
                      <div className="text-sm opacity-75">
                        {aiFeedback.score >= 90 ? 'Excellent!' : 
                         aiFeedback.score >= 70 ? 'Good!' : 
                         aiFeedback.score >= 50 ? 'Fair' : 'Needs Improvement'}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {aiFeedback.feedback.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-60" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {showAnswer && (
            <div className="mt-6 pt-6 border-t-2 border-gray-200">
              <h3 className="text-lg font-semibold text-green-700 mb-3">
                Answer:
              </h3>
              <p className="text-base text-gray-700 leading-relaxed">
                {currentCard.answer}
              </p>
              {tryAnswerMode && aiFeedback && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Compare:</strong> Review the correct answer and see how it aligns with your response. 
                    {aiFeedback.score >= 70 
                      ? " Great job on the key concepts!" 
                      : " Focus on the areas mentioned in the feedback above."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card Footer - Enhanced Navigation */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          {/* Progress Bar */}
          <div className="px-6 pt-4 pb-2">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>Card {currentIndex + 1} of {filteredCards.length}</span>
              <span>{Math.round(((currentIndex + 1) / filteredCards.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-salesforce-blue to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / filteredCards.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            {/* Left Side - Previous Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToCard(0)}
                disabled={currentIndex === 0}
                className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="First card (Home)"
              >
                <SkipBack className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={prevCard}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-salesforce-blue transition-all disabled:opacity-30 disabled:cursor-not-allowed font-medium"
                title="Previous (← or A)"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>
            </div>

            {/* Center - Card Number Input */}
            <div className="flex items-center gap-3 flex-1 justify-center max-w-xs">
              <input
                type="number"
                min="1"
                max={filteredCards.length}
                value={currentIndex + 1}
                onChange={(e) => {
                  const num = parseInt(e.target.value)
                  if (!isNaN(num) && num >= 1 && num <= filteredCards.length) {
                    goToCard(num - 1)
                  }
                }}
                className="w-16 px-3 py-2 text-center border-2 border-gray-300 rounded-lg focus:border-salesforce-blue focus:ring-2 focus:ring-salesforce-light-blue focus:outline-none font-semibold"
              />
              <span className="text-gray-600 font-medium">/ {filteredCards.length}</span>
            </div>

            {/* Right Side - Next Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={nextCard}
                disabled={currentIndex === filteredCards.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-salesforce-blue transition-all disabled:opacity-30 disabled:cursor-not-allowed font-medium"
                title="Next (→ or D)"
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => goToCard(filteredCards.length - 1)}
                disabled={currentIndex === filteredCards.length - 1}
                className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Last card (End)"
              >
                <SkipForward className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="px-6 pb-4">
            <div className="text-xs text-gray-500 text-center">
              <span className="inline-flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">←</kbd>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">→</kbd>
                <span className="ml-2">Navigate</span>
              </span>
              <span className="mx-2">•</span>
              <span className="inline-flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">Home</kbd>
                <span className="ml-2">First</span>
              </span>
              <span className="mx-2">•</span>
              <span className="inline-flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">End</kbd>
                <span className="ml-2">Last</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        <button
          onClick={shuffle}
          className="flex items-center gap-2 px-6 py-3 bg-salesforce-blue text-white rounded-lg hover:bg-salesforce-dark-blue transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Shuffle Cards
        </button>
      </div>

      {/* Study Tips */}
      <div className="bg-salesforce-light-blue border border-salesforce-blue rounded-lg p-4">
        <h3 className="font-semibold text-salesforce-dark-blue mb-2">Active Recall Study Tips:</h3>
        <ul className="text-sm text-salesforce-dark-blue space-y-1 list-disc list-inside">
          <li>Try to recall the answer before revealing it</li>
          <li>Review cards you got wrong more frequently</li>
          <li>Use spaced repetition - revisit cards after increasing intervals</li>
          <li>Explain concepts out loud to reinforce understanding</li>
        </ul>
      </div>
    </div>
  )
}

export default ActiveRecallQuizzer
