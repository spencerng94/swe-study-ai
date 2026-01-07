import { createContext, useContext } from 'react'
import { useGameState } from '../../hooks/useGameState'
import { LevelUpCelebration, AchievementUnlock } from './Celebrations'

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const gameState = useGameState()

  return (
    <GameContext.Provider value={gameState}>
      {children}
      <LevelUpCelebration 
        show={gameState.levelUp} 
        onClose={() => {}} 
      />
      <AchievementUnlock 
        achievements={gameState.recentAchievements}
        onClose={() => {}}
      />
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }
  return context
}
