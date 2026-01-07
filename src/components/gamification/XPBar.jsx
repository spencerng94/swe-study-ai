import { useEffect, useState } from 'react'
import { Star, Zap } from 'lucide-react'

export function XPBar({ levelProgress, recentXP }) {
  const [showXPAnimation, setShowXPAnimation] = useState(false)

  useEffect(() => {
    if (recentXP > 0) {
      setShowXPAnimation(true)
      const timer = setTimeout(() => setShowXPAnimation(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [recentXP])

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
          <span className="text-sm sm:text-base font-bold text-salesforce-dark-blue dark:text-white">
            Level {levelProgress.level}
          </span>
        </div>
        <div className="text-xs sm:text-sm text-salesforce-gray dark:text-slate-400 whitespace-nowrap">
          {levelProgress.xpInCurrentLevel} / {levelProgress.xpNeededForNextLevel} XP
        </div>
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 sm:h-4 overflow-hidden">
          <div
            className="h-3 sm:h-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${levelProgress.progress}%` }}
          >
            <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
        
        {showXPAnimation && recentXP > 0 && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 animate-xp-gain">
            <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-bold text-xs sm:text-sm">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-500" />
              +{recentXP} XP
            </div>
          </div>
        )}
      </div>
      
      <div className="text-xs text-salesforce-gray dark:text-slate-400 mt-1 line-clamp-1">
        {levelProgress.xpNeededForNextLevel - levelProgress.xpInCurrentLevel} XP until Level {levelProgress.level + 1}
      </div>
    </div>
  )
}
