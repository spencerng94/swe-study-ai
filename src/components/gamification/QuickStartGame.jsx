import { useState, useEffect, useCallback } from 'react'
import { Zap, Trophy, Star, CheckCircle, X, Play, Target, TrendingUp, Sparkles, Award, Lightbulb, Eye } from 'lucide-react'
import { useGame } from './GameProvider'
import { flashcards } from '../../data/flashcards'

// Level definitions with progressive challenges
const LEVEL_DEFINITIONS = [
  {
    level: 1,
    name: 'Getting Started',
    challenge: { type: 'flashcards', count: 3, timeLimit: null },
    xpReward: 25,
    description: 'Answer 3 flashcards correctly',
    icon: '🌱',
  },
  {
    level: 2,
    name: 'Building Momentum',
    challenge: { type: 'flashcards', count: 5, timeLimit: null },
    xpReward: 40,
    description: 'Answer 5 flashcards correctly',
    icon: '⚡',
  },
  {
    level: 3,
    name: 'Question Explorer',
    challenge: { type: 'questions', count: 5, timeLimit: null },
    xpReward: 35,
    description: 'View 5 interview questions',
    icon: '📚',
  },
  {
    level: 4,
    name: 'Speed Learner',
    challenge: { type: 'flashcards', count: 7, timeLimit: 300 }, // 5 minutes
    xpReward: 60,
    description: 'Answer 7 flashcards in 5 minutes',
    icon: '🚀',
  },
  {
    level: 5,
    name: 'Knowledge Seeker',
    challenge: { type: 'questions', count: 10, timeLimit: null },
    xpReward: 50,
    description: 'View 10 interview questions',
    icon: '🔍',
  },
  {
    level: 6,
    name: 'Flashcard Master',
    challenge: { type: 'flashcards', count: 10, timeLimit: null },
    xpReward: 75,
    description: 'Answer 10 flashcards correctly',
    icon: '🎯',
  },
  {
    level: 7,
    name: 'Rapid Fire',
    challenge: { type: 'flashcards', count: 12, timeLimit: 240 }, // 4 minutes
    xpReward: 90,
    description: 'Answer 12 flashcards in 4 minutes',
    icon: '🔥',
  },
  {
    level: 8,
    name: 'Deep Dive',
    challenge: { type: 'questions', count: 15, timeLimit: null },
    xpReward: 70,
    description: 'View 15 interview questions',
    icon: '🌊',
  },
  {
    level: 9,
    name: 'Expert Mode',
    challenge: { type: 'flashcards', count: 15, timeLimit: 360 }, // 6 minutes
    xpReward: 110,
    description: 'Answer 15 flashcards in 6 minutes',
    icon: '💎',
  },
  {
    level: 10,
    name: 'Legendary',
    challenge: { type: 'flashcards', count: 20, timeLimit: 480 }, // 8 minutes
    xpReward: 150,
    description: 'Answer 20 flashcards in 8 minutes',
    icon: '👑',
  },
]

// Extended levels (11+)
const getExtendedLevel = (levelNum) => {
  const baseLevel = 10
  const multiplier = Math.floor((levelNum - 1) / 5) + 1
  const cycle = ((levelNum - 1) % 5) + 1
  
  const challenges = [
    { type: 'flashcards', count: 15 + (multiplier * 5), timeLimit: 360 + (multiplier * 60) },
    { type: 'questions', count: 15 + (multiplier * 5), timeLimit: null },
    { type: 'flashcards', count: 20 + (multiplier * 5), timeLimit: 480 + (multiplier * 60) },
    { type: 'questions', count: 20 + (multiplier * 5), timeLimit: null },
    { type: 'flashcards', count: 25 + (multiplier * 5), timeLimit: 600 + (multiplier * 60) },
  ]
  
  return {
    level: levelNum,
    name: `Level ${levelNum}`,
    challenge: challenges[cycle - 1],
    xpReward: 100 + (multiplier * 25),
    description: `${challenges[cycle - 1].type === 'flashcards' ? 'Answer' : 'View'} ${challenges[cycle - 1].count} ${challenges[cycle - 1].type === 'flashcards' ? 'flashcards' : 'questions'}${challenges[cycle - 1].timeLimit ? ` in ${challenges[cycle - 1].timeLimit / 60} minutes` : ''}`,
    icon: '⭐',
  }
}

const getLevelDefinition = (levelNum) => {
  if (levelNum <= LEVEL_DEFINITIONS.length) {
    return LEVEL_DEFINITIONS[levelNum - 1]
  }
  return getExtendedLevel(levelNum)
}

// Load/save game progress
const loadQuickStartProgress = () => {
  try {
    const saved = localStorage.getItem('quickStartProgress')
    if (saved) {
      const data = JSON.parse(saved)
      // Reset daily if needed
      const today = new Date().toDateString()
      if (data.date !== today) {
        return { currentLevel: 1, completedLevels: [], date: today, currentChallenge: null }
      }
      return data
    }
  } catch (e) {
    console.error('Failed to load QuickStart progress:', e)
  }
  return { currentLevel: 1, completedLevels: [], date: new Date().toDateString(), currentChallenge: null }
}

const saveQuickStartProgress = (progress) => {
  try {
    localStorage.setItem('quickStartProgress', JSON.stringify(progress))
  } catch (e) {
    console.error('Failed to save QuickStart progress:', e)
  }
}

export function QuickStartGame() {
  const gameState = useGame()
  const [isOpen, setIsOpen] = useState(false)
  const [progress, setProgress] = useState(loadQuickStartProgress)
  const [currentChallenge, setCurrentChallenge] = useState(progress.currentChallenge)
  const [challengeProgress, setChallengeProgress] = useState({
    completed: 0,
    correct: 0,
    startTime: null,
    timeRemaining: null,
  })
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationData, setCelebrationData] = useState({ level: 0, xp: 0, nextLevel: 0 })
  const [currentFlashcard, setCurrentFlashcard] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [isCorrect, setIsCorrect] = useState(null)
  const [hintLevel, setHintLevel] = useState(0) // 0 = no hint, 1 = keywords, 2 = partial
  const [showHint, setShowHint] = useState(false)

  // Load flashcard if challenge exists on mount
  useEffect(() => {
    if (currentChallenge && currentChallenge.type === 'flashcards' && !currentFlashcard) {
      const randomCard = flashcards[Math.floor(Math.random() * flashcards.length)]
      setCurrentFlashcard(randomCard)
    }
  }, [currentChallenge, currentFlashcard])

  // Initialize challenge
  const startChallenge = useCallback(() => {
    const levelDef = getLevelDefinition(progress.currentLevel)
    const challenge = {
      ...levelDef.challenge,
      level: progress.currentLevel,
      startTime: Date.now(),
    }
    
    setCurrentChallenge(challenge)
    setChallengeProgress({
      completed: 0,
      correct: 0,
      startTime: Date.now(),
      timeRemaining: challenge.timeLimit || null,
    })
    setShowAnswer(false)
    setUserAnswer('')
    setIsCorrect(null)
    setHintLevel(0)
    setShowHint(false)
    
    // Load first flashcard if needed
    if (challenge.type === 'flashcards') {
      const randomCard = flashcards[Math.floor(Math.random() * flashcards.length)]
      setCurrentFlashcard(randomCard)
    }
    
    // Update progress
    const newProgress = { ...progress, currentChallenge: challenge }
    setProgress(newProgress)
    saveQuickStartProgress(newProgress)
  }, [progress])

  // Timer for time-limited challenges
  useEffect(() => {
    if (!currentChallenge || !currentChallenge.timeLimit) return
    
    const interval = setInterval(() => {
      setChallengeProgress(prev => {
        if (!prev.startTime) return prev
        const elapsed = Math.floor((Date.now() - prev.startTime) / 1000)
        const remaining = currentChallenge.timeLimit - elapsed
        
        if (remaining <= 0) {
          clearInterval(interval)
          // Time's up - challenge failed
          handleChallengeComplete(false)
          return { ...prev, timeRemaining: 0 }
        }
        
        return { ...prev, timeRemaining: remaining }
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [currentChallenge])

  // Handle flashcard answer
  const handleFlashcardAnswer = () => {
    if (!currentFlashcard || !userAnswer.trim()) return
    
    // Simple keyword matching for correctness (in a real app, this would be more sophisticated)
    const answerLower = currentFlashcard.answer.toLowerCase()
    const userAnswerLower = userAnswer.toLowerCase()
    const keywords = answerLower.split(' ').filter(w => w.length > 4)
    const matches = keywords.filter(kw => userAnswerLower.includes(kw)).length
    const correct = matches >= Math.min(2, keywords.length * 0.3) // At least 30% keyword match
    
    setIsCorrect(correct)
    
    setTimeout(() => {
      setChallengeProgress(prev => {
        const newCompleted = prev.completed + 1
        const newCorrect = correct ? prev.correct + 1 : prev.correct
        
        // Check if challenge is complete
        if (newCompleted >= currentChallenge.count) {
          setTimeout(() => {
            handleChallengeComplete(true)
          }, 100)
        } else {
          // Load next flashcard
          const randomCard = flashcards[Math.floor(Math.random() * flashcards.length)]
          setCurrentFlashcard(randomCard)
          setShowAnswer(false)
          setUserAnswer('')
          setIsCorrect(null)
          setHintLevel(0)
          setShowHint(false)
        }
        
        return {
          ...prev,
          completed: newCompleted,
          correct: newCorrect,
        }
      })
    }, 2000)
  }

  // Handle question view (for question challenges)
  const handleQuestionView = () => {
    setChallengeProgress(prev => {
      const newCompleted = prev.completed + 1
      
      // Check if challenge is complete
      if (newCompleted >= currentChallenge.count) {
        setTimeout(() => {
          handleChallengeComplete(true)
        }, 100)
      }
      
      return { ...prev, completed: newCompleted }
    })
  }

  // Complete challenge
  const handleChallengeComplete = (success) => {
    if (success) {
      const completedLevel = progress.currentLevel
      const levelDef = getLevelDefinition(completedLevel)
      const nextLevel = completedLevel + 1
      
      // Award XP
      const xpAmount = levelDef.xpReward
      gameState.awardXP(xpAmount, 'quickstart')
      
      // Update progress
      const newCompletedLevels = [...progress.completedLevels, completedLevel]
      const newProgress = {
        ...progress,
        currentLevel: nextLevel,
        completedLevels: newCompletedLevels,
        currentChallenge: null,
      }
      setProgress(newProgress)
      saveQuickStartProgress(newProgress)
      
      // Set celebration data
      setCelebrationData({
        level: completedLevel,
        xp: xpAmount,
        nextLevel: nextLevel,
      })
      
      // Show celebration
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
      
      // Reset challenge state
      setCurrentChallenge(null)
      setChallengeProgress({ completed: 0, correct: 0, startTime: null, timeRemaining: null })
      setCurrentFlashcard(null)
      setShowAnswer(false)
      setUserAnswer('')
      setIsCorrect(null)
    } else if (!success) {
      // Challenge failed - reset
      setCurrentChallenge(null)
      setChallengeProgress({ completed: 0, correct: 0, startTime: null, timeRemaining: null })
      setCurrentFlashcard(null)
      setShowAnswer(false)
      setUserAnswer('')
      setIsCorrect(null)
      setHintLevel(0)
      setShowHint(false)
      
      const newProgress = { ...progress, currentChallenge: null }
      setProgress(newProgress)
      saveQuickStartProgress(newProgress)
    }
  }

  // Format time
  const formatTime = (seconds) => {
    if (!seconds) return null
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Format answer with better styling
  const formatAnswer = (answer) => {
    try {
      if (!answer) return ''
    
    // Split by numbered lists (1), 2), etc.)
    let formatted = answer
      // Handle numbered lists (1), 2), 3), etc.)
      .replace(/(\d+\))\s+/g, '\n\n$1 ')
      // Handle numbered lists with periods (1., 2., etc.)
      .replace(/(\d+\.)\s+/g, '\n\n$1 ')
      // Handle colon-separated key points
      .replace(/:\s+/g, ':\n  • ')
      // Handle semicolon-separated items
      .replace(/;\s+/g, ';\n  • ')
      // Clean up multiple newlines
      .replace(/\n{3,}/g, '\n\n')
      .trim()
    
    // Split into lines and process
    const lines = formatted.split('\n')
    const processedLines = lines.map((line, index) => {
      line = line.trim()
      if (!line) return ''
      
      // Check if it's a numbered list item
      if (/^\d+[\)\.]\s/.test(line)) {
        return `<div class="mb-2 pl-4"><span class="font-semibold text-blue-600 dark:text-blue-400">${line.match(/^\d+[\)\.]\s/)[0]}</span><span class="ml-2">${line.replace(/^\d+[\)\.]\s/, '')}</span></div>`
      }
      
      // Check if it starts with bullet
      if (line.startsWith('•')) {
        return `<div class="mb-1 pl-4 text-slate-700 dark:text-slate-300">${line}</div>`
      }
      
      // Check for key terms (words in quotes or ALL CAPS)
      line = line.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded text-sm font-mono">$1</code>')
      line = line.replace(/([A-Z][A-Z\s]+)/g, (match) => {
        if (match.length > 2 && match.length < 20) {
          return `<strong class="text-purple-600 dark:text-purple-400">${match}</strong>`
        }
        return match
      })
      
      // Regular paragraph
      if (index === 0) {
        return `<p class="mb-3 text-slate-800 dark:text-slate-200 leading-relaxed">${line}</p>`
      }
      return `<p class="mb-2 text-slate-700 dark:text-slate-300 leading-relaxed">${line}</p>`
    })
    
    return processedLines.filter(l => l).join('')
    } catch (error) {
      console.error('Error formatting answer:', error)
      return `<p class="text-slate-700 dark:text-slate-300">${answer}</p>`
    }
  }

  // Extract hints from answer
  const getHints = (answer) => {
    if (!answer) return { keywords: [], partial: '' }
    
    // Extract key terms (capitalized words, quoted terms, important nouns)
    const words = answer.split(/[,\s]+/)
    const keywords = words
      .filter(w => {
        const word = w.replace(/[^a-zA-Z0-9]/g, '')
        return word.length > 5 && 
               /^[A-Z]/.test(w) || 
               word.match(/^(index|query|data|object|function|method|class|variable|scope|closure|event|loop|async|promise)/i)
      })
      .slice(0, 5)
      .map(w => w.replace(/[^\w]/g, ''))
    
    // Get first sentence or first 100 characters as partial hint
    const sentences = answer.split(/[.!?]\s+/)
    const partial = sentences[0]?.substring(0, 100) || answer.substring(0, 100)
    
    return { keywords, partial }
  }

  const handleShowHint = () => {
    if (hintLevel < 2) {
      setHintLevel(hintLevel + 1)
      setShowHint(true)
    }
  }

  const progressPercent = currentChallenge 
    ? (challengeProgress.completed / currentChallenge.count) * 100 
    : 0

  const currentLevelDef = getLevelDefinition(progress.currentLevel)

  return (
    <>
      {/* Quick Start Button - Bottom Left */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 text-white shadow-2xl border-2 border-yellow-300/50 dark:border-yellow-400/30 flex items-center justify-center hover:shadow-yellow-500/40 hover:scale-110 active:scale-95 transition-all duration-200 touch-manipulation group animate-pulse hover:animate-none"
        aria-label="Quick Start Game"
      >
        <Zap className="w-6 h-6 lg:w-7 lg:h-7 group-hover:rotate-12 transition-transform" />
        {progress.currentLevel > 1 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-red-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold animate-bounce">
            {progress.currentLevel}
          </div>
        )}
      </button>

      {/* Game Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200/80 dark:border-slate-800/80">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
                  {currentLevelDef.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Quick Start</h2>
                  <p className="text-sm text-yellow-100">Level {progress.currentLevel}: {currentLevelDef.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Level Info */}
              {!currentChallenge && (
                <div className="text-center space-y-4">
                  <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-slate-800 dark:to-slate-700 border-2 border-yellow-200 dark:border-yellow-700">
                    <div className="text-6xl mb-2">{currentLevelDef.icon}</div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      {currentLevelDef.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-3">
                      {currentLevelDef.description}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-400 font-semibold">
                      <Trophy className="w-5 h-5" />
                      <span>+{currentLevelDef.xpReward} XP Reward</span>
                    </div>
                  </div>

                  {/* Progress Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="text-2xl font-bold text-salesforce-blue dark:text-blue-400">
                        {progress.completedLevels.length}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Levels Completed</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="text-2xl font-bold text-orange-500">
                        Level {progress.currentLevel}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Current Level</div>
                    </div>
                  </div>

                  <button
                    onClick={startChallenge}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Start Challenge
                  </button>
                </div>
              )}

              {/* Active Challenge */}
              {currentChallenge && (
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Progress: {challengeProgress.completed} / {currentChallenge.count}
                      </span>
                      {challengeProgress.timeRemaining !== null && (
                        <span className={`text-sm font-bold ${
                          challengeProgress.timeRemaining < 60 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          ⏱️ {formatTime(challengeProgress.timeRemaining)}
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-full transition-all duration-300 shadow-sm"
                        style={{ width: `${progressPercent}%` }}
                      >
                        <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      </div>
                    </div>
                  </div>

                  {/* Flashcard Challenge */}
                  {currentChallenge.type === 'flashcards' && (
                    <>
                      {!currentFlashcard ? (
                        <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-2 border-blue-200 dark:border-blue-700 text-center">
                          <div className="text-4xl mb-2">🔄</div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            Loading flashcard...
                          </div>
                        </div>
                      ) : (
                    <div className="space-y-4">
                      <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-2 border-blue-200 dark:border-blue-700">
                        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">
                          {currentFlashcard.category}
                        </div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                          {currentFlashcard.question}
                        </div>
                        
                        {!showAnswer && (
                          <div className="space-y-3">
                            {/* Hint Section */}
                            {showHint && hintLevel > 0 && (() => {
                              const hints = getHints(currentFlashcard.answer)
                              return (
                                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                    <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">Hint {hintLevel}/2</span>
                                  </div>
                                  {hintLevel === 1 && hints.keywords.length > 0 && (
                                    <div className="text-sm text-yellow-700 dark:text-yellow-400">
                                      <p className="mb-2 font-medium">Key terms to look for:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {hints.keywords.map((keyword, idx) => (
                                          <span key={idx} className="px-2 py-1 bg-yellow-200 dark:bg-yellow-800 rounded-md font-mono text-xs">
                                            {keyword}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {hintLevel === 2 && (
                                    <div className="text-sm text-yellow-700 dark:text-yellow-400 italic">
                                      "{hints.partial}..."
                                    </div>
                                  )}
                                </div>
                              )
                            })()}
                            
                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              {hintLevel < 2 && (
                                <button
                                  onClick={handleShowHint}
                                  className="flex-1 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                                >
                                  <Lightbulb className="w-4 h-4" />
                                  {hintLevel === 0 ? 'Get Hint' : 'More Hint'}
                                </button>
                              )}
                              <button
                                onClick={() => setShowAnswer(true)}
                                className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                Show Answer
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {showAnswer && (
                          <div className="space-y-4">
                            <div className="p-5 rounded-lg bg-white/80 dark:bg-slate-900/80 border-2 border-blue-200 dark:border-blue-700">
                              <div className="flex items-center gap-2 mb-3">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Answer</span>
                              </div>
                              <div 
                                className="text-sm text-slate-700 dark:text-slate-300 prose prose-sm max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: formatAnswer(currentFlashcard.answer) }}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Did you understand this? (Type key points)
                              </label>
                              <textarea
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Type what you learned..."
                                className="w-full p-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none resize-none"
                                rows={3}
                              />
                              {isCorrect !== null && (
                                <div className={`p-3 rounded-lg flex items-center gap-2 ${
                                  isCorrect 
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                }`}>
                                  {isCorrect ? (
                                    <CheckCircle className="w-5 h-5" />
                                  ) : (
                                    <X className="w-5 h-5" />
                                  )}
                                  <span className="font-semibold">
                                    {isCorrect ? 'Great! You got it!' : 'Keep trying! Review the answer.'}
                                  </span>
                                </div>
                              )}
                              <button
                                onClick={handleFlashcardAnswer}
                                disabled={!userAnswer.trim() || isCorrect !== null}
                                className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
                              >
                                Submit Answer
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                      )}
                    </>
                  )}

                  {/* Question Challenge */}
                  {currentChallenge.type === 'questions' && (
                    <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 border-2 border-purple-200 dark:border-purple-700 text-center space-y-4">
                      <div className="text-4xl mb-2">📚</div>
                      <div className="text-lg font-semibold text-slate-900 dark:text-white">
                        View Interview Questions
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">
                        Navigate to the Interview Questions section and view {currentChallenge.count} questions to complete this challenge.
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
                        <Target className="w-4 h-4" />
                        <span>{currentChallenge.count - challengeProgress.completed} more to go!</span>
                      </div>
                      <button
                        onClick={handleQuestionView}
                        className="px-6 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-semibold transition-colors shadow-lg hover:shadow-xl"
                      >
                        Mark as Viewed (+1)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center">
          <div className="text-center space-y-4 animate-bounce-in">
            <div className="text-8xl mb-4 animate-bounce">🎉</div>
            <div className="text-4xl font-bold text-white drop-shadow-lg">
              Level {celebrationData.level} Complete!
            </div>
            <div className="text-2xl text-yellow-300 font-semibold drop-shadow-lg flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              +{celebrationData.xp} XP Earned!
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-xl text-white/90 drop-shadow-lg">
              You've reached Level {celebrationData.nextLevel}!
            </div>
          </div>
        </div>
      )}
    </>
  )
}
