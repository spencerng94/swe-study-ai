import { Trophy, Lock } from 'lucide-react'
import { useState } from 'react'

export function Achievements({ achievements, allAchievements }) {
  const [showAll, setShowAll] = useState(false)
  
  const allAchievementsList = Object.values(allAchievements || {})
  const unlockedIds = new Set((achievements || []).map(a => a.id))
  
  const displayedAchievements = showAll 
    ? allAchievementsList 
    : allAchievementsList.filter(a => unlockedIds.has(a.id)).slice(0, 6)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h3 className="text-lg font-bold text-salesforce-dark-blue">
            Achievements
          </h3>
        </div>
        <div className="text-sm text-salesforce-gray">
          {unlockedIds.size} / {allAchievementsList.length} unlocked
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayedAchievements.map(achievement => {
          const isUnlocked = unlockedIds.has(achievement.id)
          return (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                isUnlocked
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-md'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div className="text-4xl">
                  {isUnlocked ? achievement.icon : '🔒'}
                </div>
                <div className="w-full">
                  <div className={`font-bold text-sm mb-1 ${
                    isUnlocked ? 'text-salesforce-dark-blue' : 'text-gray-500'
                  }`}>
                    {achievement.name}
                  </div>
                  <div className={`text-xs ${
                    isUnlocked ? 'text-salesforce-gray' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </div>
                  {isUnlocked && achievement.xpReward > 0 && (
                    <div className="text-xs text-yellow-600 font-medium mt-1">
                      +{achievement.xpReward} XP
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {allAchievementsList.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full py-2 text-sm font-medium text-salesforce-blue hover:text-salesforce-dark-blue hover:bg-salesforce-light-blue rounded-lg transition-colors"
        >
          {showAll ? 'Show Less' : `Show All (${allAchievementsList.length})`}
        </button>
      )}
    </div>
  )
}
