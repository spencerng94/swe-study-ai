import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'gameState'
const XP_PER_LEVEL = 100
const MAX_STREAK = 365

// Achievement definitions
const ACHIEVEMENTS = {
  FIRST_FLASHCARD: {
    id: 'first_flashcard',
    name: 'First Step',
    description: 'Complete your first flashcard',
    icon: '🌟',
    xpReward: 10,
  },
  FLASHCARD_MASTER: {
    id: 'flashcard_master',
    name: 'Flashcard Master',
    description: 'Complete 50 flashcards',
    icon: '🎯',
    xpReward: 100,
    requirement: { type: 'flashcards', count: 50 },
  },
  STUDY_STREAK_3: {
    id: 'streak_3',
    name: 'Getting Started',
    description: 'Maintain a 3-day study streak',
    icon: '🔥',
    xpReward: 50,
    requirement: { type: 'streak', count: 3 },
  },
  STUDY_STREAK_7: {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day study streak',
    icon: '🔥',
    xpReward: 150,
    requirement: { type: 'streak', count: 7 },
  },
  STUDY_STREAK_30: {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day study streak',
    icon: '🔥',
    xpReward: 500,
    requirement: { type: 'streak', count: 30 },
  },
  QUESTION_EXPLORER: {
    id: 'question_explorer',
    name: 'Question Explorer',
    description: 'View 25 interview questions',
    icon: '📚',
    xpReward: 75,
    requirement: { type: 'questions', count: 25 },
  },
  STUDY_GUIDE_COMPLETE: {
    id: 'study_guide_complete',
    name: 'Study Guide Expert',
    description: 'Complete 100% of study guide',
    icon: '✅',
    xpReward: 300,
    requirement: { type: 'studyGuide', percent: 100 },
  },
  LEVEL_5: {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach Level 5',
    icon: '⭐',
    xpReward: 0,
    requirement: { type: 'level', count: 5 },
  },
  LEVEL_10: {
    id: 'level_10',
    name: 'Expert',
    description: 'Reach Level 10',
    icon: '⭐',
    xpReward: 0,
    requirement: { type: 'level', count: 10 },
  },
  DEDICATED_LEARNER: {
    id: 'dedicated_learner',
    name: 'Dedicated Learner',
    description: 'Earn 1000 XP total',
    icon: '💎',
    xpReward: 0,
    requirement: { type: 'totalXP', count: 1000 },
  },
}

// XP reward amounts
const XP_REWARDS = {
  FLASHCARD_COMPLETE: 5,
  FLASHCARD_CORRECT: 10,
  QUESTION_VIEW: 2,
  STUDY_GUIDE_ITEM: 3,
  DAILY_LOGIN: 25,
  LESSON_COMPLETE: 15,
  TOOL_USAGE: 5,
}

const getInitialState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load game state:', e)
  }
  
  return {
    xp: 0,
    totalXP: 0,
    level: 1,
    streak: 0,
    lastActivityDate: null,
    achievements: [],
    stats: {
      flashcardsCompleted: 0,
      questionsViewed: 0,
      studyGuideItemsCompleted: 0,
      lessonsCompleted: 0,
      toolsUsed: 0,
    },
  }
}

const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save game state:', e)
  }
}

const calculateLevel = (xp) => {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

const getXPForNextLevel = (level) => {
  return level * XP_PER_LEVEL
}

const getCurrentLevelProgress = (xp) => {
  const level = calculateLevel(xp)
  const xpForCurrentLevel = (level - 1) * XP_PER_LEVEL
  const xpInCurrentLevel = xp - xpForCurrentLevel
  const xpNeededForNextLevel = XP_PER_LEVEL
  const progress = (xpInCurrentLevel / xpNeededForNextLevel) * 100
  
  return {
    level,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    progress: Math.min(100, Math.max(0, progress)),
  }
}

const checkAchievements = (state, newState) => {
  const unlocked = []
  const currentAchievements = new Set(state.achievements || [])
  
  Object.values(ACHIEVEMENTS).forEach(achievement => {
    if (currentAchievements.has(achievement.id)) {
      return // Already unlocked
    }
    
    let shouldUnlock = false
    
    if (achievement.requirement) {
      const { type, count, percent } = achievement.requirement
      
      switch (type) {
        case 'flashcards':
          shouldUnlock = newState.stats.flashcardsCompleted >= count
          break
        case 'streak':
          shouldUnlock = newState.streak >= count
          break
        case 'questions':
          shouldUnlock = newState.stats.questionsViewed >= count
          break
        case 'studyGuide':
          const studyGuideProgress = JSON.parse(localStorage.getItem('studyGuideProgress') || '{}')
          const completedItems = Object.keys(studyGuideProgress).filter(key => studyGuideProgress[key]).length
          const totalItems = 32
          const progress = (completedItems / totalItems) * 100
          shouldUnlock = progress >= (percent || 100)
          break
        case 'level':
          shouldUnlock = newState.level >= count
          break
        case 'totalXP':
          shouldUnlock = newState.totalXP >= count
          break
      }
    }
    
    if (shouldUnlock) {
      unlocked.push(achievement)
      if (achievement.xpReward > 0) {
        newState.xp += achievement.xpReward
        newState.totalXP += achievement.xpReward
      }
    }
  })
  
  if (unlocked.length > 0) {
    newState.achievements = [...(newState.achievements || []), ...unlocked.map(a => a.id)]
  }
  
  return unlocked
}

const updateStreak = (state) => {
  const today = new Date().toDateString()
  const lastDate = state.lastActivityDate ? new Date(state.lastActivityDate).toDateString() : null
  
  if (lastDate === today) {
    // Already logged in today
    return state.streak
  }
  
  if (!lastDate) {
    // First time
    return 1
  }
  
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()
  
  if (lastDate === yesterdayStr) {
    // Continuing streak
    return Math.min(MAX_STREAK, (state.streak || 0) + 1)
  }
  
  // Streak broken
  return 1
}

export function useGameState() {
  const [state, setState] = useState(getInitialState)
  const [levelUp, setLevelUp] = useState(false)
  const [recentAchievements, setRecentAchievements] = useState([])
  const [recentXP, setRecentXP] = useState(0)

  // Load state on mount
  useEffect(() => {
    const loadedState = getInitialState()
    
    // Check for daily login bonus
    const today = new Date().toDateString()
    const lastDate = loadedState.lastActivityDate ? new Date(loadedState.lastActivityDate).toDateString() : null
    
    if (lastDate !== today && lastDate !== null) {
      // Award daily login bonus (will be applied in the awardXP call below)
      loadedState.xp += XP_REWARDS.DAILY_LOGIN
      loadedState.totalXP = (loadedState.totalXP || 0) + XP_REWARDS.DAILY_LOGIN
    }
    
    // Update streak if needed
    const newStreak = updateStreak(loadedState)
    if (newStreak !== loadedState.streak) {
      loadedState.streak = newStreak
    }
    loadedState.lastActivityDate = new Date().toISOString()
    
    // Recalculate level
    const levelProgress = getCurrentLevelProgress(loadedState.xp)
    if (levelProgress.level !== loadedState.level) {
      loadedState.level = levelProgress.level
    }
    
    saveState(loadedState)
    setState(loadedState)
  }, [])

  // Award XP
  const awardXP = useCallback((amount, source = 'activity') => {
    setState(prevState => {
      const newState = {
        ...prevState,
        xp: prevState.xp + amount,
        totalXP: (prevState.totalXP || 0) + amount,
        lastActivityDate: new Date().toISOString(),
      }
      
      // Update streak
      const newStreak = updateStreak(newState)
      if (newStreak !== newState.streak) {
        newState.streak = newStreak
      }
      
      // Check for level up
      const oldLevel = calculateLevel(prevState.xp)
      const newLevel = calculateLevel(newState.xp)
      
      if (newLevel > oldLevel) {
        setLevelUp(true)
        setTimeout(() => setLevelUp(false), 5000)
      }
      
      // Check achievements
      const unlocked = checkAchievements(prevState, newState)
      if (unlocked.length > 0) {
        setRecentAchievements(unlocked)
        setTimeout(() => setRecentAchievements([]), 5000)
      }
      
      // Show XP gain animation
      setRecentXP(amount)
      setTimeout(() => setRecentXP(0), 2000)
      
      // Recalculate level
      newState.level = newLevel
      
      saveState(newState)
      return newState
    })
  }, [])

  // Award XP for specific actions
  const actions = {
    flashcardComplete: () => {
      setState(prev => {
        const newStats = {
          ...prev.stats,
          flashcardsCompleted: (prev.stats.flashcardsCompleted || 0) + 1,
        }
        return { ...prev, stats: newStats }
      })
      awardXP(XP_REWARDS.FLASHCARD_COMPLETE, 'flashcard')
    },
    flashcardCorrect: () => awardXP(XP_REWARDS.FLASHCARD_CORRECT, 'flashcard_correct'),
    questionView: () => {
      setState(prev => {
        const newStats = {
          ...prev.stats,
          questionsViewed: (prev.stats.questionsViewed || 0) + 1,
        }
        return { ...prev, stats: newStats }
      })
      awardXP(XP_REWARDS.QUESTION_VIEW, 'question')
    },
    studyGuideItem: () => {
      setState(prev => {
        const newStats = {
          ...prev.stats,
          studyGuideItemsCompleted: (prev.stats.studyGuideItemsCompleted || 0) + 1,
        }
        return { ...prev, stats: newStats }
      })
      awardXP(XP_REWARDS.STUDY_GUIDE_ITEM, 'study_guide')
    },
    lessonComplete: () => {
      setState(prev => {
        const newStats = {
          ...prev.stats,
          lessonsCompleted: (prev.stats.lessonsCompleted || 0) + 1,
        }
        return { ...prev, stats: newStats }
      })
      awardXP(XP_REWARDS.LESSON_COMPLETE, 'lesson')
    },
    toolUsage: (toolName) => {
      setState(prev => {
        const newStats = {
          ...prev.stats,
          toolsUsed: (prev.stats.toolsUsed || 0) + 1,
        }
        return { ...prev, stats: newStats }
      })
      awardXP(XP_REWARDS.TOOL_USAGE, 'tool')
    },
    dailyLogin: () => awardXP(XP_REWARDS.DAILY_LOGIN, 'daily_login'),
  }

  const levelProgress = getCurrentLevelProgress(state.xp)
  const xpForNextLevel = getXPForNextLevel(state.level)

  return {
    ...state,
    levelProgress,
    xpForNextLevel,
    levelUp,
    recentAchievements,
    recentXP,
    awardXP,
    actions,
    achievements: Object.values(ACHIEVEMENTS).filter(a => 
      (state.achievements || []).includes(a.id)
    ),
    allAchievements: ACHIEVEMENTS,
  }
}
