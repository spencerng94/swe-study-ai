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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-salesforce-dark-blue">
            Level {levelProgress.level}
          </span>
        </div>
        <div className="text-sm text-salesforce-gray">
          {levelProgress.xpInCurrentLevel} / {levelProgress.xpNeededForNextLevel} XP
        </div>
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${levelProgress.progress}%` }}
          >
            <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
        
        {showXPAnimation && recentXP > 0 && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 animate-xp-gain">
            <div className="flex items-center gap-1 text-yellow-600 font-bold text-sm">
              <Zap className="w-4 h-4 fill-yellow-500" />
              +{recentXP} XP
            </div>
          </div>
        )}
      </div>
      
      <div className="text-xs text-salesforce-gray mt-1">
        {levelProgress.xpNeededForNextLevel - levelProgress.xpInCurrentLevel} XP until Level {levelProgress.level + 1}
      </div>
    </div>
  )
}
