import { Flame } from 'lucide-react'

export function StreakCounter({ streak }) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg shadow-sm border border-orange-200 dark:border-orange-800/40 p-3 sm:p-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative flex-shrink-0">
          <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 dark:text-orange-400 fill-orange-500 dark:fill-orange-400 animate-pulse" />
          {streak > 0 && (
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-[10px] sm:text-xs font-bold">{streak > 9 ? '9+' : streak}</span>
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="text-xs sm:text-sm font-medium text-orange-700 dark:text-orange-300">
            Study Streak
          </div>
          <div className="text-lg sm:text-2xl font-bold text-orange-900 dark:text-orange-100">
            {streak} {streak === 1 ? 'day' : 'days'}
          </div>
          {streak === 0 && (
            <div className="text-[10px] sm:text-xs text-orange-600 dark:text-orange-400 mt-0.5 sm:mt-1">
              Start your streak today!
            </div>
          )}
          {streak > 0 && streak < 3 && (
            <div className="text-[10px] sm:text-xs text-orange-600 dark:text-orange-400 mt-0.5 sm:mt-1">
              Keep it up! {3 - streak} more for an achievement!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
