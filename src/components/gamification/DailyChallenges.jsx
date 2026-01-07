import { useState, useEffect } from 'react'
import { Target, CheckCircle, Circle, ExternalLink } from 'lucide-react'
import { useGame } from './GameProvider'

const DAILY_CHALLENGES = [
  {
    id: 'flashcards_5',
    name: 'Flashcard Master',
    description: 'Complete 5 flashcards',
    target: 5,
    type: 'flashcards',
    xpReward: 50,
    section: 'flashcards',
  },
  {
    id: 'questions_10',
    name: 'Question Explorer',
    description: 'View 10 interview questions',
    target: 10,
    type: 'questions',
    xpReward: 50,
    section: 'interview-questions',
  },
  {
    id: 'study_30min',
    name: 'Dedicated Learner',
    description: 'Study for 30 minutes',
    target: 30,
    type: 'minutes',
    xpReward: 75,
    section: 'study-guide',
  },
  {
    id: 'tools_3',
    name: 'Tool Master',
    description: 'Use 3 different practice tools',
    target: 3,
    type: 'tools',
    xpReward: 50,
    section: 'js-trivia', // Default to one of the practice tools
  },
]

// Map challenge types to their corresponding sections
const challengeSectionMap = {
  flashcards: 'flashcards',
  questions: 'interview-questions',
  minutes: 'study-guide',
  tools: 'js-trivia', // Can link to any practice tool
}

const getDailyChallengesState = () => {
  try {
    const today = new Date().toDateString()
    const saved = localStorage.getItem('dailyChallenges')
    if (saved) {
      const data = JSON.parse(saved)
      if (data.date === today) {
        return data.challenges || {}
      }
    }
  } catch (e) {
    console.error('Failed to load daily challenges:', e)
  }
  return {}
}

const saveDailyChallengesState = (challenges) => {
  try {
    const today = new Date().toDateString()
    localStorage.setItem('dailyChallenges', JSON.stringify({ date: today, challenges }))
  } catch (e) {
    console.error('Failed to save daily challenges:', e)
  }
}

export function DailyChallenges() {
  const gameState = useGame()
  const [challenges, setChallenges] = useState(getDailyChallengesState)
  const [progress, setProgress] = useState(() => {
    const stats = gameState.stats || {}
    return {
      flashcards: stats.flashcardsCompleted || 0,
      questions: stats.questionsViewed || 0,
      tools: stats.toolsUsed || 0,
      minutes: 0, // Would need to track study time
    }
  })

  const navigateToChallenge = (challenge) => {
    const section = challenge.section || challengeSectionMap[challenge.type]
    if (section) {
      window.dispatchEvent(new CustomEvent('navigate', { 
        detail: { section } 
      }))
    }
  }

  useEffect(() => {
    const stats = gameState.stats || {}
    setProgress({
      flashcards: stats.flashcardsCompleted || 0,
      questions: stats.questionsViewed || 0,
      tools: stats.toolsUsed || 0,
      minutes: 0,
    })
  }, [gameState.stats])

  useEffect(() => {
    // Check for completed challenges
    const newChallenges = { ...challenges }
    let changed = false

    DAILY_CHALLENGES.forEach(challenge => {
      if (newChallenges[challenge.id]?.completed) {
        return // Already completed
      }

      let currentProgress = 0
      switch (challenge.type) {
        case 'flashcards':
          currentProgress = progress.flashcards
          break
        case 'questions':
          currentProgress = progress.questions
          break
        case 'tools':
          currentProgress = progress.tools
          break
        case 'minutes':
          currentProgress = progress.minutes
          break
      }

      if (currentProgress >= challenge.target) {
        newChallenges[challenge.id] = {
          completed: true,
          completedAt: new Date().toISOString(),
        }
        changed = true
        // Award XP
        gameState.awardXP(challenge.xpReward, `daily_challenge_${challenge.id}`)
      } else {
        // Update progress
        if (!newChallenges[challenge.id]) {
          newChallenges[challenge.id] = { completed: false }
        }
        newChallenges[challenge.id].progress = currentProgress
      }
    })

    if (changed) {
      setChallenges(newChallenges)
      saveDailyChallengesState(newChallenges)
    } else {
      // Update progress even if not completed
      DAILY_CHALLENGES.forEach(challenge => {
        if (!newChallenges[challenge.id]?.completed) {
          let currentProgress = 0
          switch (challenge.type) {
            case 'flashcards':
              currentProgress = progress.flashcards
              break
            case 'questions':
              currentProgress = progress.questions
              break
            case 'tools':
              currentProgress = progress.tools
              break
            case 'minutes':
              currentProgress = progress.minutes
              break
          }
          if (!newChallenges[challenge.id]) {
            newChallenges[challenge.id] = { completed: false }
          }
          newChallenges[challenge.id].progress = currentProgress
        }
      })
      setChallenges(newChallenges)
      saveDailyChallengesState(newChallenges)
    }
  }, [progress, gameState])

  const completedCount = Object.values(challenges).filter(c => c.completed).length

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-salesforce-blue" />
          <h3 className="text-lg font-bold text-salesforce-dark-blue">
            Daily Challenges
          </h3>
        </div>
        <div className="text-sm text-salesforce-gray">
          {completedCount} / {DAILY_CHALLENGES.length} completed
        </div>
      </div>

      <div className="space-y-3">
        {DAILY_CHALLENGES.map(challenge => {
          const challengeState = challenges[challenge.id] || { completed: false, progress: 0 }
          const currentProgress = challengeState.progress || 0
          const isCompleted = challengeState.completed || false
          const progressPercent = Math.min(100, (currentProgress / challenge.target) * 100)

          return (
            <div
              key={challenge.id}
              onClick={() => navigateToChallenge(challenge)}
              title={`Click to go to ${challenge.name}`}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${
                isCompleted
                  ? 'bg-green-50 border-green-300 hover:border-green-400'
                  : 'bg-gray-50 border-gray-200 hover:border-salesforce-blue'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-600 fill-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`font-semibold ${
                          isCompleted ? 'text-green-900' : 'text-salesforce-dark-blue'
                        }`}>
                          {challenge.name}
                        </div>
                        <ExternalLink className={`w-4 h-4 ${
                          isCompleted ? 'text-green-600' : 'text-salesforce-blue'
                        }`} />
                      </div>
                      <div className={`text-sm ${
                        isCompleted ? 'text-green-700' : 'text-salesforce-gray'
                      }`}>
                        {challenge.description}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${
                    isCompleted ? 'text-green-700' : 'text-salesforce-blue'
                  }`}>
                    {isCompleted ? '✓ Done' : `+${challenge.xpReward} XP`}
                  </div>
                </div>
              </div>
              
              {!isCompleted && (
                <div>
                  <div className="flex items-center justify-between text-xs text-salesforce-gray mb-1">
                    <span>{currentProgress} / {challenge.target}</span>
                    <span>{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-salesforce-blue to-salesforce-dark-blue h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
