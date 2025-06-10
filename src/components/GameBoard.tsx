'use client'

import { useState, useEffect } from 'react'
import { Game } from '@/game/game'
import GuessInput from './GuessInput'
import GuessResult from './GuessResult'
import CityImage from './CityImage'
import StatsModal from './StatsModal'
import { City } from '@/types/city'
import { generateShareText, shareResult } from '@/utils/share'
import { getStats, updateStats, GameStats } from '@/utils/storage'

export default function GameBoard() {
  const [game, setGame] = useState<Game | null>(null)
  const [guesses, setGuesses] = useState<any[]>([])
  const [stats, setStats] = useState<GameStats | null>(null)
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    const newGame = new Game()
    setGame(newGame)
    setGuesses(newGame.getGuesses())
    setStats(getStats())
  }, [])

  useEffect(() => {
    if (game && game.isFinished() && stats && guesses.length > 0) {
      // 統計の更新は一度だけ実行
      const isWon = game.isWon()
      const guessCount = guesses.length
      const today = new Date().toDateString()
      
      // 今日まだ更新していない場合のみ更新
      if (stats.lastPlayedDate !== today) {
        const newStats = updateStats(isWon, guessCount)
        setStats(newStats)
      }
    }
  }, [game?.isFinished(), game?.isWon()])

  const handleGuess = (city: City) => {
    if (!game) return
    
    try {
      game.makeGuess(city)
      setGuesses([...game.getGuesses()])
    } catch (error) {
      console.error(error)
    }
  }

  const handleNewGame = () => {
    if (!game) return
    game.reset()
    setGuesses([])
    setStats(getStats()) // 統計を再読み込み
  }

  const handleShare = async () => {
    if (!game) return
    const gameNumber = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24))
    const shareText = generateShareText(guesses, game.isWon(), gameNumber)
    const success = await shareResult(shareText)
    
    if (success) {
      alert('結果をクリップボードにコピーしました！')
    }
  }

  const handleShowStats = () => {
    setShowStats(true)
  }

  if (!game) return null

  const isFinished = game.isFinished()
  const isWon = game.isWon()
  const remainingAttempts = game.getRemainingAttempts()
  const targetCity = game.getTargetCity()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">NIHONDLE</h1>
            <span className="text-sm text-gray-500">#{Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24))}</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleShowStats}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              📊
            </button>
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
              ⚙️
            </button>
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
              ❓
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-2xl mx-auto px-4 py-6 w-full">
        {/* シルエット表示 */}
        <div className="mb-6">
          <div className="w-72 h-72 mx-auto">
            <CityImage 
              city={targetCity} 
              showDetails={isFinished}
            />
          </div>
        </div>

        {/* 入力エリア */}
        <div className="mb-6">
          <GuessInput 
            onGuess={handleGuess} 
            disabled={isFinished}
          />
          <p className="text-center text-sm text-gray-500 mt-2">
            {remainingAttempts}/{game.getMaxAttempts()} 回目
          </p>
        </div>

        {/* 推測結果 */}
        <div className="space-y-2 mb-6">
          {guesses.map((guess, index) => (
            <GuessResult 
              key={index} 
              guess={guess} 
              isTarget={guess.city.id === targetCity.id}
            />
          ))}
        </div>

        {/* 結果表示 */}
        {isFinished && (
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            {isWon ? (
              <>
                <h2 className="text-2xl font-bold mb-2">
                  🎉 おめでとう！
                </h2>
                <p className="text-gray-600 mb-4">
                  {guesses.length}/6 回で正解
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">
                  残念...
                </h2>
                <p className="text-gray-600 mb-4">
                  正解: <span className="font-bold">{targetCity.name}</span> ({targetCity.prefecture})
                </p>
              </>
            )}
            <div className="flex gap-2 justify-center mb-4">
              <button 
                onClick={handleShowStats}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                📊 統計
              </button>
              <button 
                onClick={handleShare}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                🔗 シェア
              </button>
            </div>
            <button
              onClick={handleNewGame}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              次の問題 →
            </button>
          </div>
        )}
      </div>
      
      {stats && (
        <StatsModal 
          stats={stats}
          isOpen={showStats}
          onClose={() => setShowStats(false)}
        />
      )}
    </div>
  )
}