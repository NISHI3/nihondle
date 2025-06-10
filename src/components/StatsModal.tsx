'use client'

import { GameStats, getWinPercentage } from '@/utils/storage'

interface StatsModalProps {
  stats: GameStats
  isOpen: boolean
  onClose: () => void
}

export default function StatsModal({ stats, isOpen, onClose }: StatsModalProps) {
  if (!isOpen) return null

  const winPercentage = getWinPercentage(stats)
  const maxGuesses = Math.max(...Object.values(stats.guessDistribution))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">統計</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* 統計数値 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
            <div className="text-xs text-gray-500">プレイ回数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{winPercentage}</div>
            <div className="text-xs text-gray-500">勝率(%)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.currentStreak}</div>
            <div className="text-xs text-gray-500">現在の連勝</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.maxStreak}</div>
            <div className="text-xs text-gray-500">最高連勝</div>
          </div>
        </div>

        {/* 推測回数分布 */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">推測回数分布</h3>
          <div className="space-y-1">
            {[1, 2, 3, 4, 5, 6].map(guess => {
              const count = stats.guessDistribution[guess] || 0
              const percentage = maxGuesses > 0 ? (count / maxGuesses) * 100 : 0
              
              return (
                <div key={guess} className="flex items-center gap-2">
                  <span className="w-3 text-sm">{guess}</span>
                  <div className="flex-1 bg-gray-200 rounded h-6 relative">
                    <div 
                      className="bg-gray-600 h-full rounded transition-all duration-300"
                      style={{ width: `${Math.max(percentage, count > 0 ? 10 : 0)}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs text-white font-medium">
                      {count}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          閉じる
        </button>
      </div>
    </div>
  )
}