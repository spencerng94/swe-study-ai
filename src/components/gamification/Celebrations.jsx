import { useEffect, useState } from 'react'
import { Trophy, Sparkles } from 'lucide-react'

export function LevelUpCelebration({ show, onClose }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (show) {
      // Create confetti particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        delay: Math.random() * 500,
        duration: 2000 + Math.random() * 1000,
        color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][
          Math.floor(Math.random() * 5)
        ],
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => {
        onClose()
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Confetti particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-3 h-3 rounded-full animate-confetti-fall"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: particle.color,
              animationDelay: `${particle.delay}ms`,
              animationDuration: `${particle.duration}ms`,
            }}
          />
        ))}
      </div>

      {/* Level Up Message */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center animate-bounce-in pointer-events-auto">
        <div className="mb-4">
          <Sparkles className="w-16 h-16 text-yellow-500 mx-auto animate-pulse" />
        </div>
        <h2 className="text-4xl font-bold text-salesforce-dark-blue mb-2">
          Level Up!
        </h2>
        <p className="text-xl text-salesforce-gray">
          Congratulations on reaching the next level!
        </p>
      </div>
    </div>
  )
}

export function AchievementUnlock({ achievements, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (achievements.length === 0) return

    const timer = setTimeout(() => {
      if (currentIndex < achievements.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        setTimeout(onClose, 2000)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [achievements, currentIndex, onClose])

  if (achievements.length === 0) return null

  const achievement = achievements[currentIndex]

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-2xl p-6 max-w-sm animate-slide-in-right pointer-events-auto">
        <div className="flex items-start gap-4">
          <div className="text-5xl animate-bounce">{achievement.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-white" />
              <span className="text-white font-bold text-lg">Achievement Unlocked!</span>
            </div>
            <div className="text-white font-semibold mb-1">{achievement.name}</div>
            <div className="text-white/90 text-sm">{achievement.description}</div>
            {achievement.xpReward > 0 && (
              <div className="mt-2 text-white font-bold">
                +{achievement.xpReward} XP
              </div>
            )}
            {achievements.length > 1 && (
              <div className="mt-2 text-white/80 text-xs">
                {currentIndex + 1} of {achievements.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
