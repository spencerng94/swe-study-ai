import { Flame } from 'lucide-react'

export function StreakCounter({ streak }) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg shadow-sm border border-orange-200 p-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Flame className="w-8 h-8 text-orange-500 fill-orange-500 animate-pulse" />
          {streak > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{streak > 9 ? '9+' : streak}</span>
            </div>
          )}
        </div>
        <div>
          <div className="text-sm font-medium text-orange-700">
            Study Streak
          </div>
          <div className="text-2xl font-bold text-orange-900">
            {streak} {streak === 1 ? 'day' : 'days'}
          </div>
          {streak === 0 && (
            <div className="text-xs text-orange-600 mt-1">
              Start your streak today!
            </div>
          )}
          {streak > 0 && streak < 3 && (
            <div className="text-xs text-orange-600 mt-1">
              Keep it up! {3 - streak} more for an achievement!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
