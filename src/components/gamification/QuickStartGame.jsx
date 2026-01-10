import { useState, useEffect, useCallback } from 'react'
import { Zap, Trophy, Star, CheckCircle, X, Play, Target, TrendingUp, Sparkles, Award, Lightbulb, Eye, Type, List, Bookmark, BookmarkCheck } from 'lucide-react'
import { savedGameFlashcardsService } from '../../lib/dataService'
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
  const [answerMode, setAnswerMode] = useState('free') // 'free' or 'multiple-choice'
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState([])
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [isSaved, setIsSaved] = useState(false)
  const [levelCategoryCounts, setLevelCategoryCounts] = useState({ systemDesign: 0, frontend: 0 })

  // Generate multiple choice options from flashcards
  const generateMultipleChoiceOptions = useCallback((flashcard) => {
    if (!flashcard) return
    
    // Get the correct answer
    const correctAnswer = flashcard.answer
    const currentCategoryId = flashcard.categoryId
    
    // Define related categories (e.g., data-skew and ldv are related)
    const relatedCategories = {
      'data-skew': ['ldv'], // Data Skew is related to LDV
      'ldv': ['data-skew'], // LDV is related to Data Skew
      'css-grid': [], // No related categories for CSS Grid
      'web-vitals': [], // No related categories for Web Vitals
      'js-frontend': [], // JavaScript is standalone
    }
    
    // Priority 1: Get flashcards from the same category
    let candidateFlashcards = flashcards.filter(f => 
      f.id !== flashcard.id && 
      f.categoryId === currentCategoryId
    )
    
    // Priority 2: If not enough, include related categories
    if (candidateFlashcards.length < 3 && relatedCategories[currentCategoryId]) {
      const relatedIds = relatedCategories[currentCategoryId]
      const relatedFlashcards = flashcards.filter(f => 
        f.id !== flashcard.id && 
        relatedIds.includes(f.categoryId)
      )
      candidateFlashcards = [...candidateFlashcards, ...relatedFlashcards]
    }
    
    // Priority 3: If still not enough, use all other flashcards (last resort)
    if (candidateFlashcards.length < 3) {
      const otherFlashcards = flashcards.filter(f => 
        f.id !== flashcard.id && 
        !candidateFlashcards.some(c => c.id === f.id)
      )
      candidateFlashcards = [...candidateFlashcards, ...otherFlashcards]
    }
    
    // Shuffle candidates
    const shuffledCandidates = [...candidateFlashcards].sort(() => Math.random() - 0.5)
    const wrongAnswers = []
    const usedIds = new Set()
    const neededWrongAnswers = 3
    
    // Check if question asks for something "specifically" - need to filter general answers
    const questionLower = flashcard.question.toLowerCase()
    const isSpecificQuestion = questionLower.includes('specifically') || 
                               questionLower.includes('specific') ||
                               questionLower.includes('what is the') && questionLower.includes('problem')
    
    // Extract wrong answers from candidates
    for (const otherCard of shuffledCandidates) {
      if (wrongAnswers.length >= neededWrongAnswers) break
      if (usedIds.has(otherCard.id)) continue
      
      usedIds.add(otherCard.id)
      // Use first sentence or key part of answer as wrong option
      // Prefer full first sentence if it's meaningful
      const sentences = otherCard.answer.split(/[.!?]/).filter(s => s.trim().length > 0)
      let wrongAnswer = ''
      
      if (sentences.length > 0) {
        // Use first sentence if it's substantial (at least 20 chars)
        if (sentences[0].trim().length >= 20) {
          wrongAnswer = sentences[0].trim()
        } else if (sentences.length > 1) {
          // Combine first two sentences if first is short
          wrongAnswer = sentences.slice(0, 2).join('. ').trim()
        } else {
          // Fallback to substring if only one short sentence
          wrongAnswer = otherCard.answer.substring(0, 120).trim()
        }
      } else {
        wrongAnswer = otherCard.answer.substring(0, 120).trim()
      }
      
      // Ensure we have a meaningful wrong answer (at least 15 chars, max 200)
      let cleanedAnswer = wrongAnswer.length > 200 
        ? wrongAnswer.substring(0, 200).trim() + '...'
        : wrongAnswer.trim()
      
      // If question asks for something specific, filter out overly general answers
      if (isSpecificQuestion) {
        // Check if this answer is too general (doesn't address the specificity)
        // For "Account Data Skew specifically", filter out general "Data Skew" definitions
        const answerLower = cleanedAnswer.toLowerCase()
        const questionWords = flashcard.question.toLowerCase().match(/\b\w{4,}\b/g) || []
        
        // If wrong answer is a general definition that doesn't address the specific question
        // and doesn't contain key terms from the question, skip it
        if (questionWords.length > 0) {
          const hasRelevantTerm = questionWords.some(word => {
            // Check if answer contains relevant terms (but not just the base term)
            // e.g., for "Account Data Skew", look for "account" or "10k" or "contacts" etc.
            const specificTerms = ['account', 'sharing', 'contact', 'opportunity', '10k', 'threshold', 'million']
            return specificTerms.some(term => answerLower.includes(term)) || 
                   answerLower.includes(word + ' ') || 
                   answerLower.includes(' ' + word)
          })
          
          // If it's a general definition and doesn't have relevant terms, prefer answers with more context
          const isGeneralDefinition = (answerLower.includes('occurs when') || 
                                       answerLower.includes('refers to') ||
                                       answerLower.includes('is when')) &&
                                      !hasRelevantTerm
          
          if (isGeneralDefinition) {
            // Try to get more context from the answer if it's too general
            if (sentences.length > 1) {
              // Use more sentences to provide context
              cleanedAnswer = sentences.slice(0, Math.min(3, sentences.length)).join('. ').trim()
              if (cleanedAnswer.length > 250) {
                cleanedAnswer = cleanedAnswer.substring(0, 250).trim() + '...'
              }
            } else {
              // Skip this answer if it's too general and we can't get more context
              continue
            }
          }
        }
      }
      
      if (cleanedAnswer && cleanedAnswer.length >= 15) {
        // Avoid duplicate wrong answers (check substring similarity)
        const isSimilar = wrongAnswers.some(existing => {
          const similarity = existing.toLowerCase().includes(cleanedAnswer.toLowerCase().substring(0, 20)) ||
                           cleanedAnswer.toLowerCase().includes(existing.toLowerCase().substring(0, 20))
          return similarity
        })
        
        // Also check if wrong answer is too similar to correct answer
        const tooSimilarToCorrect = correctAnswer.toLowerCase().includes(cleanedAnswer.toLowerCase().substring(0, 30)) ||
                                    cleanedAnswer.toLowerCase().includes(correctAnswer.toLowerCase().substring(0, 30))
        
        if (!isSimilar && !tooSimilarToCorrect) {
          wrongAnswers.push(cleanedAnswer)
        }
      }
    }
    
    // Fill remaining slots if we don't have enough unique wrong answers
    while (wrongAnswers.length < neededWrongAnswers && shuffledCandidates.length > usedIds.size) {
      const remaining = shuffledCandidates.filter(c => !usedIds.has(c.id))
      if (remaining.length > 0) {
        const otherCard = remaining[Math.floor(Math.random() * remaining.length)]
        usedIds.add(otherCard.id)
        const sentences = otherCard.answer.split(/[.!?]/).filter(s => s.trim().length > 0)
        let wrongAnswer = sentences.length > 0 
          ? sentences[0].trim() 
          : otherCard.answer.substring(0, 120).trim()
        
        // Apply same filtering logic for specific questions
        let cleanedAnswer = wrongAnswer.length > 200 
          ? wrongAnswer.substring(0, 200).trim() + '...'
          : wrongAnswer.trim()
        
        if (isSpecificQuestion) {
          const answerLower = cleanedAnswer.toLowerCase()
          const questionWords = flashcard.question.toLowerCase().match(/\b\w{4,}\b/g) || []
          
          if (questionWords.length > 0) {
            const hasRelevantTerm = questionWords.some(word => {
              const specificTerms = ['account', 'sharing', 'contact', 'opportunity', '10k', 'threshold', 'million']
              return specificTerms.some(term => answerLower.includes(term)) || 
                     answerLower.includes(word + ' ') || 
                     answerLower.includes(' ' + word)
            })
            
            const isGeneralDefinition = (answerLower.includes('occurs when') || 
                                         answerLower.includes('refers to') ||
                                         answerLower.includes('is when')) &&
                                        !hasRelevantTerm
            
            if (isGeneralDefinition && sentences.length > 1) {
              cleanedAnswer = sentences.slice(0, Math.min(3, sentences.length)).join('. ').trim()
              if (cleanedAnswer.length > 250) {
                cleanedAnswer = cleanedAnswer.substring(0, 250).trim() + '...'
              }
            } else if (isGeneralDefinition) {
              continue // Skip this answer
            }
          }
        }
          
        if (cleanedAnswer && cleanedAnswer.length >= 15) {
          const isSimilar = wrongAnswers.some(existing => {
            return existing.toLowerCase().includes(cleanedAnswer.toLowerCase().substring(0, 20)) ||
                   cleanedAnswer.toLowerCase().includes(existing.toLowerCase().substring(0, 20))
          })
          const tooSimilarToCorrect = correctAnswer.toLowerCase().includes(cleanedAnswer.toLowerCase().substring(0, 30)) ||
                                      cleanedAnswer.toLowerCase().includes(correctAnswer.toLowerCase().substring(0, 30))
          
          if (!isSimilar && !tooSimilarToCorrect) {
            wrongAnswers.push(cleanedAnswer)
          }
        }
      } else {
        break
      }
    }
    
    // Create options: correct answer + 3 wrong answers (always 4 total)
    const options = [
      { id: 'correct', text: correctAnswer.trim(), isCorrect: true }
    ]
    
    // Add exactly 3 wrong answers
    wrongAnswers.slice(0, 3).forEach((wrong, idx) => {
      options.push({
        id: `wrong-${idx}`,
        text: wrong.trim(),
        isCorrect: false
      })
    })
    
    // Shuffle options
    const shuffled = options.sort(() => Math.random() - 0.5)
    setMultipleChoiceOptions(shuffled)
    setSelectedChoice(null)
  }, [])

  // Categorize flashcards into System Design and Frontend Fundamentals
  const getFlashcardCategory = (flashcard) => {
    const systemDesignCategories = ['ldv', 'data-skew']
    return systemDesignCategories.includes(flashcard.categoryId) ? 'systemDesign' : 'frontend'
  }

  // Get flashcards by category
  const getFlashcardsByCategory = (category) => {
    if (category === 'systemDesign') {
      return flashcards.filter(f => ['ldv', 'data-skew'].includes(f.categoryId))
    } else {
      return flashcards.filter(f => !['ldv', 'data-skew'].includes(f.categoryId))
    }
  }

  // Select next flashcard ensuring balanced categories
  const selectNextFlashcard = useCallback(() => {
    if (!currentChallenge || currentChallenge.type !== 'flashcards') return null

    const totalNeeded = currentChallenge.count
    const completed = challengeProgress.completed
    const remaining = totalNeeded - completed

    // Calculate target for each category
    const targetEach = Math.ceil(totalNeeded / 2)
    const systemDesignNeeded = Math.max(0, targetEach - levelCategoryCounts.systemDesign)
    const frontendNeeded = Math.max(0, targetEach - levelCategoryCounts.frontend)

    // Determine which category to pick from
    let categoryToUse = null
    if (systemDesignNeeded > 0 && frontendNeeded > 0) {
      // Both needed - alternate based on which has less
      categoryToUse = levelCategoryCounts.systemDesign <= levelCategoryCounts.frontend ? 'systemDesign' : 'frontend'
    } else if (systemDesignNeeded > 0) {
      categoryToUse = 'systemDesign'
    } else if (frontendNeeded > 0) {
      categoryToUse = 'frontend'
    } else {
      // Both targets met, but still have remaining - alternate
      categoryToUse = levelCategoryCounts.systemDesign <= levelCategoryCounts.frontend ? 'systemDesign' : 'frontend'
    }

    // Get available flashcards for the selected category
    const categoryFlashcards = getFlashcardsByCategory(categoryToUse)
    if (categoryFlashcards.length === 0) {
      // Fallback to all flashcards if category is empty
      const randomCard = flashcards[Math.floor(Math.random() * flashcards.length)]
      return randomCard
    }

    // Pick a random card from the category
    const randomCard = categoryFlashcards[Math.floor(Math.random() * categoryFlashcards.length)]
    return randomCard
  }, [currentChallenge, challengeProgress.completed, levelCategoryCounts])

  // Load flashcard if challenge exists on mount
  useEffect(() => {
    if (currentChallenge && currentChallenge.type === 'flashcards' && !currentFlashcard) {
      const selectedCard = selectNextFlashcard()
      if (selectedCard) {
        setCurrentFlashcard(selectedCard)
        generateMultipleChoiceOptions(selectedCard)
        // Update category counts
        const category = getFlashcardCategory(selectedCard)
        setLevelCategoryCounts(prev => ({
          ...prev,
          [category]: prev[category] + 1
        }))
      }
    }
  }, [currentChallenge, currentFlashcard, generateMultipleChoiceOptions, selectNextFlashcard, getFlashcardCategory])

  // Check if current flashcard is saved
  useEffect(() => {
    const checkSaved = async () => {
      if (currentFlashcard) {
        const saved = await savedGameFlashcardsService.isSaved(currentFlashcard.id)
        setIsSaved(saved)
      } else {
        setIsSaved(false)
      }
    }
    checkSaved()
    
    // Listen for updates (in case flashcard is unsaved from SavedGameQuestions)
    const handleUpdate = () => {
      checkSaved()
    }
    window.addEventListener('savedGameFlashcardsUpdated', handleUpdate)
    
    return () => {
      window.removeEventListener('savedGameFlashcardsUpdated', handleUpdate)
    }
  }, [currentFlashcard])

  // Handle saving flashcard
  const handleSaveFlashcard = async () => {
    if (!currentFlashcard) return
    
    const success = await savedGameFlashcardsService.save(currentFlashcard)
    if (success) {
      setIsSaved(true)
      // Show a brief confirmation
      const btn = document.querySelector('[data-save-btn]')
      if (btn) {
        btn.classList.add('animate-pulse')
        setTimeout(() => btn.classList.remove('animate-pulse'), 500)
      }
    }
  }

  // Update multiple choice when flashcard changes
  useEffect(() => {
    if (currentFlashcard && answerMode === 'multiple-choice') {
      generateMultipleChoiceOptions(currentFlashcard)
    }
  }, [currentFlashcard, answerMode, generateMultipleChoiceOptions])

  // Listen for startGameLevel events from GameMode
  useEffect(() => {
    const handleStartLevel = (event) => {
      const { level } = event.detail
      const currentProgress = loadQuickStartProgress()
      
      // Allow starting any unlocked level (can replay completed levels)
      if (level <= currentProgress.currentLevel) {
        // Open modal first
        setIsOpen(true)
        
        // Start challenge after a brief delay to ensure modal is open
        setTimeout(() => {
          const levelDef = getLevelDefinition(level)
          const challenge = {
            ...levelDef.challenge,
            level: level,
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
          
          // Reset category counts for new challenge
          setLevelCategoryCounts({ systemDesign: 0, frontend: 0 })
          
          // Load first flashcard if needed (will be selected in useEffect with balanced logic)
          if (challenge.type === 'flashcards') {
            // Don't set flashcard here, let the useEffect handle it with balanced selection
          }
          
          // Update progress (but don't change currentLevel - only mark challenge as active)
          const updatedProgress = { 
            ...currentProgress, 
            currentChallenge: challenge 
          }
          setProgress(updatedProgress)
          saveQuickStartProgress(updatedProgress)
        }, 100)
      }
    }

    window.addEventListener('startGameLevel', handleStartLevel)
    return () => window.removeEventListener('startGameLevel', handleStartLevel)
  }, [generateMultipleChoiceOptions])

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
    setSelectedChoice(null)
    setIsCorrect(null)
    setHintLevel(0)
    setShowHint(false)
    setAnswerMode('free')
    
    // Reset category counts for new challenge
    setLevelCategoryCounts({ systemDesign: 0, frontend: 0 })
    
    // Load first flashcard if needed (will be selected in useEffect with balanced logic)
    if (challenge.type === 'flashcards') {
      // Don't set flashcard here, let the useEffect handle it with balanced selection
    }
    
    // Update progress
    const newProgress = { ...progress, currentChallenge: challenge }
    setProgress(newProgress)
    saveQuickStartProgress(newProgress)
  }, [progress, generateMultipleChoiceOptions])

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

  // Handle flashcard answer submission
  const handleFlashcardAnswer = () => {
    if (!currentFlashcard) return
    
    let correct = false
    
    if (answerMode === 'free') {
      if (!userAnswer.trim()) return
    
    // Simple keyword matching for correctness (in a real app, this would be more sophisticated)
    const answerLower = currentFlashcard.answer.toLowerCase()
    const userAnswerLower = userAnswer.toLowerCase()
    const keywords = answerLower.split(' ').filter(w => w.length > 4)
    const matches = keywords.filter(kw => userAnswerLower.includes(kw)).length
      correct = matches >= Math.min(2, keywords.length * 0.3) // At least 30% keyword match
    } else if (answerMode === 'multiple-choice') {
      if (!selectedChoice) return
      const selectedOption = multipleChoiceOptions.find(opt => opt.id === selectedChoice)
      correct = selectedOption ? selectedOption.isCorrect : false
    }
    
    setIsCorrect(correct)
    // Update progress but don't auto-advance - user clicks Continue button
    setChallengeProgress(prev => ({
          ...prev,
      correct: correct ? prev.correct + 1 : prev.correct,
    }))
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
    
    // First, process <text> tags before other formatting
    // This ensures they're styled correctly even if the answer contains them as-is
    let processedAnswer = answer
      .replace(/<text>([^<]*?)<\/text>/gi, '<text>$1</text>')
    
    // Split by numbered lists (1), 2), etc.)
    let formatted = processedAnswer
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
      
      // Style <text> tags as inline code with red text (handle both escaped and unescaped)
      line = line.replace(/&lt;text&gt;([^&]*?)&lt;\/text&gt;/gi, '<code class="px-1.5 py-0.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded text-sm font-mono font-semibold">$1</code>')
      line = line.replace(/<text>([^<]*?)<\/text>/gi, '<code class="px-1.5 py-0.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded text-sm font-mono font-semibold">$1</code>')
      
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
      {/* GAME MODE Button - Bottom Left */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 px-4 py-3 lg:px-5 lg:py-4 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white shadow-2xl border-2 border-yellow-300/50 dark:border-yellow-400/30 flex items-center gap-2 hover:shadow-yellow-500/40 hover:scale-105 active:scale-95 transition-all duration-200 touch-manipulation group animate-pulse hover:animate-none font-bold text-sm lg:text-base"
        aria-label="GAME MODE"
      >
        <Zap className="w-5 h-5 lg:w-6 lg:h-6 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">GAME MODE</span>
        <span className="sm:hidden">🎮</span>
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
                <h2 className="text-2xl font-bold text-white">GAME MODE</h2>
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
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="text-lg font-bold text-slate-900 dark:text-white flex-1">
                            {currentFlashcard.question}
                          </div>
                          <button
                            onClick={handleSaveFlashcard}
                            disabled={isSaved}
                            data-save-btn
                            className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                              isSaved
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 cursor-not-allowed'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400'
                            }`}
                            title={isSaved ? 'Already saved' : 'Save this question'}
                          >
                            {isSaved ? (
                              <BookmarkCheck className="w-5 h-5" />
                            ) : (
                              <Bookmark className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        
                        {/* Answer Mode Tabs */}
                        {!showAnswer && (
                          <div className="mb-4">
                            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                              <button
                                onClick={() => {
                                  setAnswerMode('free')
                                  setSelectedChoice(null)
                                }}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                  answerMode === 'free'
                                    ? 'bg-blue-500 text-white shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                              >
                                <Type className="w-4 h-4" />
                                Free Answer
                              </button>
                              <button
                                onClick={() => {
                                  setAnswerMode('multiple-choice')
                                  setUserAnswer('')
                                  if (!multipleChoiceOptions.length) {
                                    generateMultipleChoiceOptions(currentFlashcard)
                                  }
                                }}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                  answerMode === 'multiple-choice'
                                    ? 'bg-blue-500 text-white shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                              >
                                <List className="w-4 h-4" />
                                Multiple Choice
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Answer Input Section */}
                        {!showAnswer && (
                          <div className="space-y-4">
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

                            {/* Free Answer Mode */}
                            {answerMode === 'free' && (
                              <div className="space-y-3">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                  Type your answer:
                                </label>
                                <textarea
                                  value={userAnswer}
                                  onChange={(e) => setUserAnswer(e.target.value)}
                                  placeholder="Type your answer here..."
                                  className="w-full p-4 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:outline-none resize-none"
                                  rows={4}
                                />
                              </div>
                            )}

                            {/* Multiple Choice Mode */}
                            {answerMode === 'multiple-choice' && multipleChoiceOptions.length > 0 && (
                              <div className="space-y-3">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                  Select the correct answer:
                                </label>
                                <div className="space-y-2">
                                  {multipleChoiceOptions.map((option, idx) => (
                                    <button
                                      key={option.id}
                                      onClick={() => setSelectedChoice(option.id)}
                                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                        selectedChoice === option.id
                                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md'
                                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
                                      }`}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                          selectedChoice === option.id
                                            ? 'border-blue-500 bg-blue-500'
                                            : 'border-slate-400 dark:border-slate-500'
                                        }`}>
                                          {selectedChoice === option.id && (
                                            <CheckCircle className="w-4 h-4 text-white" />
                                          )}
                                          {selectedChoice !== option.id && (
                                            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{String.fromCharCode(65 + idx)}</span>
                                          )}
                                        </div>
                                        <span className="text-sm text-slate-700 dark:text-slate-300 flex-1 leading-relaxed whitespace-normal break-words">
                                          {(() => {
                                            // Parse inline code (text within backticks)
                                            const parts = []
                                            const text = option.text
                                            const codeRegex = /`([^`]+)`/g
                                            let lastIndex = 0
                                            let match
                                            let key = 0
                                            
                                            while ((match = codeRegex.exec(text)) !== null) {
                                              // Add text before the code
                                              if (match.index > lastIndex) {
                                                parts.push(
                                                  <span key={key++}>
                                                    {text.substring(lastIndex, match.index)}
                                                  </span>
                                                )
                                              }
                                              // Add the code with styling
                                              parts.push(
                                                <code
                                                  key={key++}
                                                  className="bg-gray-100 dark:bg-slate-700 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded text-xs font-mono"
                                                >
                                                  {match[1]}
                                                </code>
                                              )
                                              lastIndex = match.index + match[0].length
                                            }
                                            // Add remaining text after last code
                                            if (lastIndex < text.length) {
                                              parts.push(
                                                <span key={key++}>
                                                  {text.substring(lastIndex)}
                                                </span>
                                              )
                                            }
                                            // If no code found, return original text
                                            return parts.length > 0 ? parts : text
                                          })()}
                                        </span>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Submit and Hint Buttons */}
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
                                onClick={handleFlashcardAnswer}
                                disabled={
                                  (answerMode === 'free' && !userAnswer.trim()) ||
                                  (answerMode === 'multiple-choice' && !selectedChoice) ||
                                  isCorrect !== null
                                }
                                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center justify-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Submit Answer
                              </button>
                          <button
                            onClick={() => setShowAnswer(true)}
                                className="px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                                <Eye className="w-4 h-4" />
                            Show Answer
                          </button>
                            </div>

                            {/* Feedback after submission */}
                            {isCorrect !== null && (
                              <>
                                <div className={`p-4 rounded-lg flex items-center gap-3 ${
                                  isCorrect 
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-300 dark:border-green-700' 
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-2 border-red-300 dark:border-red-700'
                                }`}>
                                  {isCorrect ? (
                                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                                  ) : (
                                    <X className="w-6 h-6 flex-shrink-0" />
                                  )}
                                  <div className="flex-1">
                                    <div className="font-semibold mb-1">
                                      {isCorrect ? '🎉 Excellent! You got it right!' : '❌ Not quite. Review the answer below.'}
                                    </div>
                                    {!isCorrect && (
                                      <div className="text-sm opacity-90">
                                        Try again or view the answer to learn more.
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Continue Button for correct answers */}
                                {isCorrect && (
                                  <button
                                    onClick={() => {
                                      // Move to next card
                                      setChallengeProgress(prev => {
                                        const newCompleted = prev.completed + 1
                                        
                                        if (newCompleted >= currentChallenge.count) {
                                          setTimeout(() => {
                                            handleChallengeComplete(true)
                                          }, 100)
                                        } else {
                                          // Load next flashcard with balanced category selection
                                          const selectedCard = selectNextFlashcard()
                                          if (selectedCard) {
                                            setCurrentFlashcard(selectedCard)
                                            generateMultipleChoiceOptions(selectedCard)
                                            // Update category counts
                                            const category = getFlashcardCategory(selectedCard)
                                            setLevelCategoryCounts(prev => ({
                                              ...prev,
                                              [category]: prev[category] + 1
                                            }))
                                          }
                                          setShowAnswer(false)
                                          setUserAnswer('')
                                          setSelectedChoice(null)
                                          setIsCorrect(null)
                                          setHintLevel(0)
                                          setShowHint(false)
                                        }
                                        
                                        return {
                                          ...prev,
                                          completed: newCompleted,
                                        }
                                      })
                                    }}
                                    className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold transition-all flex items-center justify-center gap-2"
                                  >
                                    {challengeProgress.completed + 1 >= currentChallenge.count ? (
                                      <>
                                        <Trophy className="w-5 h-5" />
                                        Complete Challenge
                                      </>
                                    ) : (
                                      <>
                                        <Play className="w-5 h-5" />
                                        Next Question
                                      </>
                                    )}
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        
                        {/* Answer Display */}
                        {showAnswer && (
                          <div className="space-y-4">
                            <div className="p-5 rounded-lg bg-white/80 dark:bg-slate-900/80 border-2 border-blue-200 dark:border-blue-700">
                              <div className="flex items-center gap-2 mb-3">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Correct Answer</span>
                              </div>
                              <div 
                                className="text-sm text-slate-700 dark:text-slate-300 prose prose-sm max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: formatAnswer(currentFlashcard.answer) }}
                              />
                            </div>
                            
                            {/* Your Answer (if submitted) */}
                              {isCorrect !== null && (
                              <div className={`p-4 rounded-lg border-2 ${
                                  isCorrect 
                                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' 
                                  : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                                }`}>
                                <div className="flex items-center gap-2 mb-2">
                                  {isCorrect ? (
                                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                  ) : (
                                    <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                                  )}
                                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Your Answer: {isCorrect ? 'Correct!' : 'Needs Review'}
                                  </span>
                                </div>
                                {answerMode === 'free' && userAnswer && (
                                  <div className="text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 mt-2">
                                    "{userAnswer}"
                                  </div>
                                )}
                                {answerMode === 'multiple-choice' && selectedChoice && (
                                  <div className="text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 mt-2">
                                    {multipleChoiceOptions.find(opt => opt.id === selectedChoice)?.text}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Continue Button */}
                            <button
                              onClick={() => {
                                // Move to next card
                                setChallengeProgress(prev => {
                                  const newCompleted = prev.completed + 1
                                  
                                  if (newCompleted >= currentChallenge.count) {
                                    setTimeout(() => {
                                      handleChallengeComplete(true)
                                    }, 100)
                                  } else {
                                    // Load next flashcard with balanced category selection
                                    const selectedCard = selectNextFlashcard()
                                    if (selectedCard) {
                                      setCurrentFlashcard(selectedCard)
                                      generateMultipleChoiceOptions(selectedCard)
                                      // Update category counts
                                      const category = getFlashcardCategory(selectedCard)
                                      setLevelCategoryCounts(prev => ({
                                        ...prev,
                                        [category]: prev[category] + 1
                                      }))
                                    }
                                    setShowAnswer(false)
                                    setUserAnswer('')
                                    setSelectedChoice(null)
                                    setIsCorrect(null)
                                    setHintLevel(0)
                                    setShowHint(false)
                                  }
                                  
                                  return {
                                    ...prev,
                                    completed: newCompleted,
                                  }
                                })
                              }}
                              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold transition-all flex items-center justify-center gap-2"
                            >
                              {challengeProgress.completed + 1 >= currentChallenge.count ? (
                                <>
                                  <Trophy className="w-5 h-5" />
                                  Complete Challenge
                                </>
                              ) : (
                                <>
                                  <Play className="w-5 h-5" />
                                  Next Question
                                </>
                              )}
                              </button>
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
