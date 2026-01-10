import { useState, useEffect } from 'react'
import { Zap, Trophy, Star, Lock, CheckCircle, TrendingUp, Award, Target, Clock, Flame, Crown, Rocket, Sparkles, Gift, Play, BookOpen, Code, Database } from 'lucide-react'
import { useGame } from './GameProvider'
import { studyGuideService } from '../../lib/dataService'

// Level definitions with progressive challenges
const LEVEL_DEFINITIONS = [
  {
    level: 1,
    name: 'Getting Started',
    challenge: { type: 'flashcards', count: 3, timeLimit: null },
    xpReward: 25,
    description: 'Answer 3 flashcards correctly',
    icon: '🌱',
    color: 'from-green-400 to-emerald-500',
    borderColor: 'border-green-300 dark:border-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    unlockable: null,
  },
  {
    level: 2,
    name: 'Building Momentum',
    challenge: { type: 'flashcards', count: 5, timeLimit: null },
    xpReward: 40,
    description: 'Answer 5 flashcards correctly',
    icon: '⚡',
    color: 'from-yellow-400 to-amber-500',
    borderColor: 'border-yellow-300 dark:border-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    unlockable: 'Speed Bonus',
  },
  {
    level: 3,
    name: 'Question Explorer',
    challenge: { type: 'questions', count: 5, timeLimit: null },
    xpReward: 35,
    description: 'View 5 interview questions',
    icon: '📚',
    color: 'from-blue-400 to-indigo-500',
    borderColor: 'border-blue-300 dark:border-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    unlockable: 'Knowledge Badge',
  },
  {
    level: 4,
    name: 'Speed Learner',
    challenge: { type: 'flashcards', count: 7, timeLimit: 300 },
    xpReward: 60,
    description: 'Answer 7 flashcards in 5 minutes',
    icon: '🚀',
    color: 'from-purple-400 to-pink-500',
    borderColor: 'border-purple-300 dark:border-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    unlockable: 'Time Master',
  },
  {
    level: 5,
    name: 'Knowledge Seeker',
    challenge: { type: 'questions', count: 10, timeLimit: null },
    xpReward: 50,
    description: 'View 10 interview questions',
    icon: '🔍',
    color: 'from-cyan-400 to-teal-500',
    borderColor: 'border-cyan-300 dark:border-cyan-600',
    bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
    unlockable: 'Scholar Badge',
  },
  {
    level: 6,
    name: 'Flashcard Master',
    challenge: { type: 'flashcards', count: 10, timeLimit: null },
    xpReward: 75,
    description: 'Answer 10 flashcards correctly',
    icon: '🎯',
    color: 'from-orange-400 to-red-500',
    borderColor: 'border-orange-300 dark:border-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    unlockable: 'Expert Badge',
  },
  {
    level: 7,
    name: 'Rapid Fire',
    challenge: { type: 'flashcards', count: 12, timeLimit: 240 },
    xpReward: 90,
    description: 'Answer 12 flashcards in 4 minutes',
    icon: '🔥',
    color: 'from-red-400 to-rose-500',
    borderColor: 'border-red-300 dark:border-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    unlockable: 'Speed Demon',
  },
  {
    level: 8,
    name: 'Deep Dive',
    challenge: { type: 'questions', count: 15, timeLimit: null },
    xpReward: 70,
    description: 'View 15 interview questions',
    icon: '🌊',
    color: 'from-indigo-400 to-blue-500',
    borderColor: 'border-indigo-300 dark:border-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    unlockable: 'Deep Thinker',
  },
  {
    level: 9,
    name: 'Expert Mode',
    challenge: { type: 'flashcards', count: 15, timeLimit: 360 },
    xpReward: 110,
    description: 'Answer 15 flashcards in 6 minutes',
    icon: '💎',
    color: 'from-violet-400 to-purple-500',
    borderColor: 'border-violet-300 dark:border-violet-600',
    bgColor: 'bg-violet-50 dark:bg-violet-900/20',
    unlockable: 'Elite Badge',
  },
  {
    level: 10,
    name: 'Legendary',
    challenge: { type: 'flashcards', count: 20, timeLimit: 480 },
    xpReward: 150,
    description: 'Answer 20 flashcards in 8 minutes',
    icon: '👑',
    color: 'from-amber-400 via-yellow-400 to-orange-500',
    borderColor: 'border-amber-300 dark:border-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    unlockable: 'Legend Status',
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
  
  const colors = [
    'from-emerald-400 to-green-500',
    'from-sky-400 to-blue-500',
    'from-fuchsia-400 to-pink-500',
    'from-lime-400 to-emerald-500',
    'from-rose-400 to-pink-500',
  ]
  
  return {
    level: levelNum,
    name: `Level ${levelNum}`,
    challenge: challenges[cycle - 1],
    xpReward: 100 + (multiplier * 25),
    description: `${challenges[cycle - 1].type === 'flashcards' ? 'Answer' : 'View'} ${challenges[cycle - 1].count} ${challenges[cycle - 1].type === 'flashcards' ? 'flashcards' : 'questions'}${challenges[cycle - 1].timeLimit ? ` in ${challenges[cycle - 1].timeLimit / 60} minutes` : ''}`,
    icon: '⭐',
    color: colors[cycle - 1],
    borderColor: 'border-slate-300 dark:border-slate-600',
    bgColor: 'bg-slate-50 dark:bg-slate-900/20',
    unlockable: `Elite Tier ${multiplier}`,
  }
}

const getLevelDefinition = (levelNum) => {
  if (levelNum <= LEVEL_DEFINITIONS.length) {
    return LEVEL_DEFINITIONS[levelNum - 1]
  }
  return getExtendedLevel(levelNum)
}

// Load game progress
const loadQuickStartProgress = () => {
  try {
    const saved = localStorage.getItem('quickStartProgress')
    if (saved) {
      const data = JSON.parse(saved)
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

export function GameMode() {
  const gameState = useGame()
  const [progress] = useState(loadQuickStartProgress)
  const [selectedLevel, setSelectedLevel] = useState(progress.currentLevel)
  const [studyProgress, setStudyProgress] = useState({
    systemDesign: 0,
    frontend: 0,
    overall: 0,
  })
  const [studyItems, setStudyItems] = useState({
    systemDesignViewed: 0,
    frontendConceptsCompleted: 0,
    studyGuideItemsCompleted: 0,
  })

  // Load study progress
  useEffect(() => {
    const loadStudyProgress = async () => {
      // Load study guide progress
      const guideProgress = await studyGuideService.load()
      const completedItems = Object.keys(guideProgress).filter(key => guideProgress[key]).length
      
      // Load System Design progress (from localStorage)
      const systemDesignProgress = JSON.parse(localStorage.getItem('systemDesignProgress') || '{}')
      const systemDesignViewed = Object.keys(systemDesignProgress).filter(key => systemDesignProgress[key]).length
      
      // Load Frontend Fundamentals progress (from localStorage)
      const frontendProgress = JSON.parse(localStorage.getItem('frontendProgress') || '{}')
      const frontendConceptsCompleted = Object.keys(frontendProgress).filter(key => frontendProgress[key]).length
      
      // Calculate progress percentages
      const totalStudyGuideItems = 32 // From Dashboard
      const totalSystemDesignConcepts = 20 // Approximate
      const totalFrontendConcepts = 16 // From concepts array
      
      setStudyItems({
        systemDesignViewed,
        frontendConceptsCompleted,
        studyGuideItemsCompleted: completedItems,
      })
      
      setStudyProgress({
        systemDesign: Math.round((systemDesignViewed / totalSystemDesignConcepts) * 100),
        frontend: Math.round((frontendConceptsCompleted / totalFrontendConcepts) * 100),
        overall: Math.round(((completedItems + systemDesignViewed + frontendConceptsCompleted) / (totalStudyGuideItems + totalSystemDesignConcepts + totalFrontendConcepts)) * 100),
      })
    }
    
    loadStudyProgress()
    
    // Listen for progress updates
    const handleProgressUpdate = () => {
      loadStudyProgress()
    }
    
    window.addEventListener('progressUpdated', handleProgressUpdate)
    window.addEventListener('systemDesignProgress', handleProgressUpdate)
    window.addEventListener('frontendProgress', handleProgressUpdate)
    
    return () => {
      window.removeEventListener('progressUpdated', handleProgressUpdate)
      window.removeEventListener('systemDesignProgress', handleProgressUpdate)
      window.removeEventListener('frontendProgress', handleProgressUpdate)
    }
  }, [])

  // Calculate stats
  const totalLevels = LEVEL_DEFINITIONS.length
  const completedCount = progress.completedLevels.length
  const currentLevel = progress.currentLevel
  const nextLevel = getLevelDefinition(currentLevel)
  const totalXP = LEVEL_DEFINITIONS.slice(0, completedCount).reduce((sum, level) => sum + level.xpReward, 0)
  const potentialXP = LEVEL_DEFINITIONS.slice(completedCount).reduce((sum, level) => sum + level.xpReward, 0)

  // Determine if level should be unlocked based on study progress
  const getLevelUnlockRequirement = (levelNum) => {
    if (levelNum <= 3) return null // First 3 levels always unlocked
    if (levelNum <= 6) return { type: 'systemDesign', min: 30 } // Levels 4-6 need some system design
    if (levelNum <= 8) return { type: 'frontend', min: 40 } // Levels 7-8 need frontend knowledge
    return { type: 'overall', min: 60 } // Higher levels need overall progress
  }

  const isUnlockedByStudy = (levelNum) => {
    const requirement = getLevelUnlockRequirement(levelNum)
    if (!requirement) return true
    
    if (requirement.type === 'systemDesign') {
      return studyProgress.systemDesign >= requirement.min
    }
    if (requirement.type === 'frontend') {
      return studyProgress.frontend >= requirement.min
    }
    if (requirement.type === 'overall') {
      return studyProgress.overall >= requirement.min
    }
    return true
  }

  const isCompleted = (levelNum) => progress.completedLevels.includes(levelNum)
  const isLocked = (levelNum) => {
    // Lock if beyond current level OR if study requirements not met
    if (levelNum > currentLevel) return true
    return !isUnlockedByStudy(levelNum)
  }
  const isCurrent = (levelNum) => levelNum === currentLevel

  const selectedLevelDef = getLevelDefinition(selectedLevel)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-lg shadow-lg border border-yellow-300 dark:border-yellow-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl shadow-lg">
              🎮
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-1">GAME MODE</h2>
              <p className="text-yellow-100 text-sm">Level up your Salesforce interview skills!</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{currentLevel}</div>
            <div className="text-sm text-yellow-100">Current Level</div>
          </div>
        </div>
      </div>

      {/* Study Progress Sync */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg border border-indigo-300 dark:border-indigo-700 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Study Progress Sync
          </h3>
          <div className="text-2xl font-bold">{studyProgress.overall}%</div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4" />
              <span className="text-sm font-semibold">System Design</span>
            </div>
            <div className="text-2xl font-bold">{studyProgress.systemDesign}%</div>
            <div className="text-xs text-indigo-100 mt-1">{studyItems.systemDesignViewed} concepts viewed</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-4 h-4" />
              <span className="text-sm font-semibold">Frontend</span>
            </div>
            <div className="text-2xl font-bold">{studyProgress.frontend}%</div>
            <div className="text-xs text-indigo-100 mt-1">{studyItems.frontendConceptsCompleted} concepts mastered</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-indigo-100">
            💡 Complete study materials to unlock higher game mode levels!
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { section: 'system-design' } }))}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-xs font-semibold text-white transition-colors flex items-center gap-1"
            >
              <Database className="w-3 h-3" />
              Study System Design
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { section: 'frontend-fundamentals' } }))}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-xs font-semibold text-white transition-colors flex items-center gap-1"
            >
              <Code className="w-3 h-3" />
              Study Frontend
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Completed</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{completedCount}</div>
          <div className="text-xs text-slate-500 dark:text-slate-500">/{totalLevels} levels</div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">XP Earned</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalXP}</div>
          <div className="text-xs text-slate-500 dark:text-slate-500">+{potentialXP} available</div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Next Reward</span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">+{nextLevel.xpReward} XP</div>
          <div className="text-xs text-slate-500 dark:text-slate-500">Level {currentLevel}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Progress</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {Math.round((completedCount / totalLevels) * 100)}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-500">To mastery</div>
        </div>
      </div>

      {/* Level Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Rocket className="w-5 h-5 text-orange-500" />
            Level Roadmap
          </h3>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {completedCount} / {totalLevels} completed
          </div>
        </div>
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span><strong>Tip:</strong> Click any unlocked level to start playing!</span>
          </p>
        </div>

        <div className="space-y-3">
          {LEVEL_DEFINITIONS.map((level, index) => {
            const completed = isCompleted(level.level)
            const locked = isLocked(level.level)
            const current = isCurrent(level.level)
            const isSelected = selectedLevel === level.level

            return (
              <div
                key={level.level}
                onClick={() => {
                  if (!locked) {
                    setSelectedLevel(level.level)
                    // Trigger QuickStartGame to open with this level
                    window.dispatchEvent(new CustomEvent('startGameLevel', { 
                      detail: { level: level.level } 
                    }))
                  }
                }}
                className={`relative group transition-all duration-200 ${
                  locked 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:scale-[1.02] cursor-pointer hover:shadow-lg'
                }`}
              >
                <div
                  className={`rounded-xl border-2 p-4 transition-all ${
                    isSelected
                      ? `${level.borderColor} border-4 shadow-lg ${level.bgColor}`
                      : completed
                      ? `border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10`
                      : current
                      ? `border-orange-400 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20 shadow-md animate-pulse`
                      : locked
                      ? 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50'
                      : `border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600`
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Level Icon */}
                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold shadow-lg transition-transform group-hover:scale-110 ${
                        completed
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                          : current
                          ? 'bg-gradient-to-br from-orange-400 to-red-500 animate-pulse'
                          : locked
                          ? 'bg-gradient-to-br from-slate-400 to-slate-500'
                          : `bg-gradient-to-br ${level.color}`
                      }`}
                    >
                      {locked ? <Lock className="w-8 h-8 text-white" /> : level.icon}
                    </div>

                    {/* Level Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                          Level {level.level}
                        </span>
                        {completed && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {current && (
                          <span className="px-2 py-0.5 text-xs font-bold bg-orange-500 text-white rounded-full animate-pulse">
                            CURRENT
                          </span>
                        )}
                        {level.unlockable && (
                          <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded">
                            <Gift className="w-3 h-3 inline mr-1" />
                            {level.unlockable}
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                        {level.name}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {level.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-semibold">
                          <Star className="w-3 h-3" />
                          +{level.xpReward} XP
                        </span>
                        {level.challenge.timeLimit && (
                          <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                            <Clock className="w-3 h-3" />
                            {level.challenge.timeLimit / 60} min
                          </span>
                        )}
                        {level.challenge.type === 'flashcards' && (
                          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                            <Target className="w-3 h-3" />
                            {level.challenge.count} cards
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-col items-end gap-1">
                      {completed && (
                        <div className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold flex items-center gap-1 group-hover:bg-green-600 transition-colors">
                          <Trophy className="w-3 h-3" />
                          COMPLETE
                          {!locked && <span className="ml-1">▶</span>}
                        </div>
                      )}
                      {current && !completed && (
                        <div className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-bold flex items-center gap-1 animate-pulse group-hover:bg-orange-600 transition-colors">
                          <Zap className="w-3 h-3" />
                          START NOW
                        </div>
                      )}
                      {!current && !locked && !completed && (
                        <div className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-bold flex items-center gap-1 group-hover:bg-blue-600 transition-colors">
                          <Play className="w-3 h-3" />
                          PLAY
                        </div>
                      )}
                      {locked && (
                        <div className="px-3 py-1 bg-slate-400 text-white rounded-full text-xs font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          {level.level > currentLevel ? 'LOCKED' : 'STUDY REQUIRED'}
                        </div>
                      )}
                    </div>
                    
                    {/* Unlock Requirement Tooltip */}
                    {locked && !isUnlockedByStudy(level.level) && level.level <= currentLevel && (() => {
                      const requirement = getLevelUnlockRequirement(level.level)
                      if (!requirement) return null
                      const currentProgress = requirement.type === 'systemDesign' ? studyProgress.systemDesign :
                                            requirement.type === 'frontend' ? studyProgress.frontend :
                                            studyProgress.overall
                      const progressPercent = Math.min((currentProgress / requirement.min) * 100, 100)
                      return (
                        <div className="absolute top-full left-0 mt-2 p-3 bg-yellow-100 dark:bg-yellow-900/50 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg text-xs text-yellow-800 dark:text-yellow-200 z-10 shadow-lg min-w-[200px]">
                          <div className="font-semibold mb-2 flex items-center gap-2">
                            <Lock className="w-3 h-3" />
                            Unlock Requirement:
                          </div>
                          <div className="mb-2">
                            {requirement.type === 'systemDesign' && (
                              <>Complete {requirement.min}% of System Design concepts</>
                            )}
                            {requirement.type === 'frontend' && (
                              <>Complete {requirement.min}% of Frontend Fundamentals</>
                            )}
                            {requirement.type === 'overall' && (
                              <>Reach {requirement.min}% overall study progress</>
                            )}
                          </div>
                          <div className="mb-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress:</span>
                              <span className="font-semibold">{currentProgress}% / {requirement.min}%</span>
                            </div>
                            <div className="w-full bg-yellow-200 dark:bg-yellow-800 rounded-full h-2">
                              <div 
                                className="bg-yellow-500 dark:bg-yellow-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-yellow-600 dark:text-yellow-400 text-xs mt-2 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            <span>Study more to unlock this level!</span>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Level Details */}
      {selectedLevelDef && (
        <div className={`bg-gradient-to-br ${selectedLevelDef.bgColor} rounded-xl border-2 ${selectedLevelDef.borderColor} p-6 shadow-lg`}>
          <div className="flex items-start gap-4">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedLevelDef.color} flex items-center justify-center text-4xl shadow-xl`}>
              {selectedLevelDef.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedLevelDef.name}
                </h3>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  (Level {selectedLevelDef.level})
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                {selectedLevelDef.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">XP Reward</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      +{selectedLevelDef.xpReward}
                    </div>
                  </div>
                </div>
                {selectedLevelDef.unlockable && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-lg">
                    <Gift className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Unlock</div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white">
                        {selectedLevelDef.unlockable}
                      </div>
                    </div>
                  </div>
                )}
                {selectedLevelDef.challenge.timeLimit && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Time Limit</div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white">
                        {selectedLevelDef.challenge.timeLimit / 60} min
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6" />
          <h3 className="text-xl font-bold">Ready to Level Up?</h3>
        </div>
        <p className="text-purple-100 mb-4">
          {currentLevel > 1
            ? `You're on Level ${currentLevel}! Keep the momentum going and unlock your next achievement.`
            : "Start your journey by completing Level 1. Each level you complete brings you closer to Salesforce interview mastery!"}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <Flame className="w-4 h-4" />
          <span className="text-purple-100">
            {completedCount > 0
              ? `Amazing progress! ${totalLevels - completedCount} levels remaining to become a legend!`
              : 'Begin your quest for knowledge and unlock epic rewards!'}
          </span>
        </div>
      </div>
    </div>
  )
}
