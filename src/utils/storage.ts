export interface GameStats {
  gamesPlayed: number
  gamesWon: number
  currentStreak: number
  maxStreak: number
  guessDistribution: { [key: number]: number }
  lastPlayedDate: string
}

const STORAGE_KEY = 'nihondle-stats'

export function getStats(): GameStats {
  if (typeof window === 'undefined') {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      lastPlayedDate: ''
    }
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    const defaultStats: GameStats = {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      lastPlayedDate: ''
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStats))
    return defaultStats
  }

  return JSON.parse(stored)
}

export function updateStats(isWon: boolean, guessCount: number): GameStats {
  const stats = getStats()
  const today = new Date().toDateString()
  
  // 同じ日に複数回プレイした場合は更新しない
  if (stats.lastPlayedDate === today) {
    return stats
  }

  stats.gamesPlayed++
  
  if (isWon) {
    stats.gamesWon++
    stats.currentStreak++
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak)
    stats.guessDistribution[guessCount] = (stats.guessDistribution[guessCount] || 0) + 1
  } else {
    stats.currentStreak = 0
  }
  
  stats.lastPlayedDate = today
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  }
  
  return stats
}

export function getWinPercentage(stats: GameStats): number {
  if (stats.gamesPlayed === 0) return 0
  return Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
}