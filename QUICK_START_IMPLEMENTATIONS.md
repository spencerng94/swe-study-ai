# Quick Start Implementation Guides
## High-Impact Features You Can Add Today

---

## 1. Spaced Repetition System (Highest Learning Impact)

### Implementation

Create `src/lib/spacedRepetition.js`:

```javascript
/**
 * SuperMemo 2 Algorithm for Spaced Repetition
 * Quality: 0-5 (0=blackout, 5=perfect recall)
 */

export class SpacedRepetition {
  static calculateNextReview(card, quality) {
    if (quality === null || quality === undefined) {
      // First review
      return {
        interval: 1, // 1 day
        repetitions: 0,
        easeFactor: 2.5,
        nextReview: this.addDays(new Date(), 1)
      }
    }

    // Update ease factor
    let newEaseFactor = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    newEaseFactor = Math.max(1.3, newEaseFactor) // Minimum ease factor

    let newRepetitions = card.repetitions || 0
    let newInterval = 1

    if (quality < 3) {
      // Failed - reset
      newRepetitions = 0
      newInterval = 1
    } else {
      // Passed
      if (newRepetitions === 0) {
        newInterval = 1
      } else if (newRepetitions === 1) {
        newInterval = 6
      } else {
        newInterval = Math.round(card.interval * newEaseFactor)
      }
      newRepetitions++
    }

    return {
      interval: newInterval,
      repetitions: newRepetitions,
      easeFactor: newEaseFactor,
      nextReview: this.addDays(new Date(), newInterval),
      lastReview: new Date(),
      quality
    }
  }

  static addDays(date, days) {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  static getCardsDue(cards) {
    const now = new Date()
    return cards.filter(card => {
      if (!card.nextReview) return true // Never reviewed
      return new Date(card.nextReview) <= now
    })
  }

  static getQualityFromUserResponse(isCorrect, timeToAnswer, hintsUsed) {
    // 5 = Perfect (correct, fast, no hints)
    // 4 = Good (correct, some time or hints)
    // 3 = Hard (correct but struggled)
    // 2 = Incorrect (almost got it)
    // 1 = Incorrect (far off)
    // 0 = Complete blackout

    if (!isCorrect) {
      return hintsUsed > 0 ? 1 : 2
    }

    if (timeToAnswer < 5000 && hintsUsed === 0) return 5 // Fast, no hints
    if (timeToAnswer < 10000 && hintsUsed <= 1) return 4 // Good
    return 3 // Correct but struggled
  }
}
```

### Update Flashcard Component

```javascript
// In Flashcards.jsx
import { SpacedRepetition } from '../lib/spacedRepetition'

const handleAnswer = (isCorrect, timeSpent, hintsUsed) => {
  const quality = SpacedRepetition.getQualityFromUserResponse(
    isCorrect,
    timeSpent,
    hintsUsed
  )
  
  const updatedCard = {
    ...currentCard,
    ...SpacedRepetition.calculateNextReview(currentCard, quality),
    reviewCount: (currentCard.reviewCount || 0) + 1
  }
  
  // Save updated card
  updateCard(updatedCard)
  
  // Award XP based on quality
  if (isCorrect) {
    gameState.actions.flashcardCorrect()
  }
}
```

---

## 2. Active Recall Mode (Type Answer First)

### Implementation

```javascript
// Add to Flashcards.jsx
const [activeRecallMode, setActiveRecallMode] = useState(true)
const [userAnswer, setUserAnswer] = useState('')
const [showAnswer, setShowAnswer] = useState(false)

// Before showing answer, require user input
{activeRecallMode && !showAnswer ? (
  <div className="space-y-4">
    <label className="block">
      <span className="text-sm font-medium">Try to recall the answer:</span>
      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Type what you remember..."
        className="w-full mt-2 p-3 border rounded-lg"
        rows={4}
      />
    </label>
    <button
      onClick={() => {
        setShowAnswer(true)
        // Track that user attempted recall
        trackRecallAttempt(currentCard.id, userAnswer.length > 0)
      }}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
    >
      Show Answer
    </button>
  </div>
) : (
  // Show card answer
)}
```

---

## 3. Enhanced Error Recovery

### Create `src/lib/errorRecovery.js`

```javascript
export class ErrorRecovery {
  static async withRetry(fn, options = {}) {
    const {
      maxRetries = 3,
      initialDelay = 1000,
      maxDelay = 10000,
      exponentialBase = 2,
      retryCondition = () => true
    } = options

    let lastError
    let delay = initialDelay

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error
        
        if (attempt === maxRetries || !retryCondition(error)) {
          throw error
        }

        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, delay))
        delay = Math.min(delay * exponentialBase, maxDelay)
      }
    }

    throw lastError
  }

  static async saveWithRetry(data, saveFn) {
    return this.withRetry(
      () => saveFn(data),
      {
        maxRetries: 3,
        retryCondition: (error) => {
          // Retry on network errors, not validation errors
          return error.code === 'NETWORK_ERROR' || 
                 error.message?.includes('network') ||
                 error.message?.includes('timeout')
        }
      }
    )
  }
}
```

### Update dataService.js

```javascript
import { ErrorRecovery } from './errorRecovery'

export const gameStateService = {
  async save(state) {
    return ErrorRecovery.saveWithRetry(state, async (stateData) => {
      if (!supabase) {
        localStorage.setItem('gameState', JSON.stringify(stateData))
        return true
      }
      
      const userId = getUserId()
      const { error } = await supabase
        .from('game_states')
        .upsert({
          user_id: userId,
          state: stateData,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id })

      if (error) {
        throw new Error(`Save failed: ${error.message}`)
      }
      
      return true
    })
  }
}
```

---

## 4. Interview Readiness Score

### Create `src/lib/readinessCalculator.js`

```javascript
export class ReadinessCalculator {
  static calculateScore(userData) {
    const {
      masteryScores = {},
      studyDays = 0,
      flashcardsCompleted = 0,
      questionsViewed = 0,
      streak = 0,
      daysUntilInterview = 30
    } = userData

    let score = 0
    const weights = {
      mastery: 0.4,      // 40% - How well you know the material
      coverage: 0.25,     // 25% - How much you've covered
      consistency: 0.2,   // 20% - Study consistency
      engagement: 0.15    // 15% - Overall engagement
    }

    // Mastery Score (0-100)
    const masteryEntries = Object.values(masteryScores)
    const avgMastery = masteryEntries.length > 0
      ? masteryEntries.reduce((a, b) => a + b, 0) / masteryEntries.length
      : 0
    score += (avgMastery / 100) * weights.mastery * 100

    // Coverage Score (0-100)
    const totalTopics = 10 // Adjust based on your topics
    const topicsWithData = Object.keys(masteryScores).length
    const coveragePercent = Math.min(100, (topicsWithData / totalTopics) * 100)
    score += (coveragePercent / 100) * weights.coverage * 100

    // Consistency Score (0-100)
    const expectedDays = Math.max(1, daysUntilInterview)
    const consistencyPercent = Math.min(100, (studyDays / expectedDays) * 100)
    score += (consistencyPercent / 100) * weights.consistency * 100

    // Engagement Score (0-100)
    const flashcardScore = Math.min(100, (flashcardsCompleted / 50) * 100) // 50 = target
    const questionScore = Math.min(100, (questionsViewed / 20) * 100) // 20 = target
    const streakScore = Math.min(100, (streak / 7) * 100) // 7 day streak = 100
    const engagementPercent = (flashcardScore + questionScore + streakScore) / 3
    score += (engagementPercent / 100) * weights.engagement * 100

    return Math.round(Math.min(100, Math.max(0, score)))
  }

  static getRecommendations(score, userData) {
    const recommendations = []

    if (score < 50) {
      recommendations.push({
        priority: 'high',
        message: 'Focus on covering all topics. You\'re missing foundational knowledge.',
        action: 'Complete study guide basics'
      })
    }

    if (userData.streak < 3) {
      recommendations.push({
        priority: 'medium',
        message: 'Build a study streak. Consistency is key to retention.',
        action: 'Study daily for the next week'
      })
    }

    // Add more recommendations based on data

    return recommendations
  }
}
```

### Add to Dashboard

```javascript
import { ReadinessCalculator } from '../lib/readinessCalculator'

const readinessScore = ReadinessCalculator.calculateScore({
  masteryScores: getMasteryScores(),
  studyDays: getStudyDays(),
  flashcardsCompleted: gameState.stats.flashcardsCompleted,
  questionsViewed: gameState.stats.questionsViewed,
  streak: gameState.streak,
  daysUntilInterview: getDaysUntilInterview()
})

// Display score
<div className="readiness-score">
  <h3>Interview Readiness: {readinessScore}%</h3>
  <ProgressBar value={readinessScore} />
  {ReadinessCalculator.getRecommendations(readinessScore, userData).map(rec => (
    <RecommendationCard key={rec.action} {...rec} />
  ))}
</div>
```

---

## 5. Offline Queue System

### Create `src/lib/offlineQueue.js`

```javascript
class OfflineQueue {
  constructor() {
    this.queue = this.loadQueue()
    this.isOnline = navigator.onLine
    this.setupListeners()
  }

  setupListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.processQueue()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  async add(operation) {
    this.queue.push({
      ...operation,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      retries: 0
    })
    this.saveQueue()

    if (this.isOnline) {
      await this.processQueue()
    }
  }

  async processQueue() {
    if (!this.isOnline || this.queue.length === 0) return

    const operations = [...this.queue]
    this.queue = []

    for (const op of operations) {
      try {
        await this.executeOperation(op)
      } catch (error) {
        // Retry later if it fails
        if (op.retries < 3) {
          op.retries++
          this.queue.push(op)
        }
      }
    }

    this.saveQueue()
  }

  async executeOperation(operation) {
    switch (operation.type) {
      case 'save_game_state':
        return gameStateService.save(operation.data)
      case 'save_question':
        return savedQuestionsService.save(operation.data)
      // Add more operation types
    }
  }

  loadQueue() {
    try {
      return JSON.parse(localStorage.getItem('offlineQueue') || '[]')
    } catch {
      return []
    }
  }

  saveQueue() {
    localStorage.setItem('offlineQueue', JSON.stringify(this.queue))
  }
}

export const offlineQueue = new OfflineQueue()
```

---

## 6. Enhanced Error Boundary

### Update ErrorBoundary.jsx

```javascript
import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Log to error tracking service
    if (window.Sentry) {
      window.Sentry.captureException(error, { contexts: { react: errorInfo } })
    }

    this.setState({ errorInfo })
  }

  handleRetry = () => {
    this.setState(prev => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prev.retryCount + 1
    }))
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-red-500 p-8 max-w-2xl w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-800 dark:text-red-200">
                  Oops! Something went wrong
                </h2>
                <p className="text-red-600 dark:text-red-400 mt-1">
                  Don't worry, your progress is safe
                </p>
              </div>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm font-mono text-red-800 dark:text-red-200 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
              >
                <Home className="w-5 h-5" />
                Go Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Reload Page
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-6 text-center">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
```

---

These implementations provide the **highest impact** improvements you can make quickly. Start with spaced repetition and active recall - they'll dramatically improve learning effectiveness!
