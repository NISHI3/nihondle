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
  const [guesses, setGuesses] = useState(game?.getGuesses() || [])

  useEffect(() => {
    const newGame = new Game()
    setGame(newGame)
    setGuesses(newGame.getGuesses())
  }, [])

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
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
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

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-center text-lg font-semibold text-gray-700 mb-4">
              この市はどこ？
            </h2>
            <div className="w-64 h-64 mx-auto mb-4 relative">
              <CityImage 
                city={targetCity} 
                showDetails={isFinished}
              />
            </div>
            <p className="text-center text-gray-700">
              残り回数: <span className="font-bold text-xl">{remainingAttempts}</span> / {game.getMaxAttempts()}
            </p>
          </div>

          <GuessInput 
            onGuess={handleGuess} 
            disabled={isFinished}
          />
        </div>

        <div className="space-y-3 mb-6">
          {guesses.map((guess, index) => (
            <GuessResult 
              key={index} 
              guess={guess} 
              isTarget={guess.city.id === targetCity.id}
            />
          ))}
        </div>

        {isFinished && (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            {isWon ? (
              <>
                <h2 className="text-2xl font-bold text-green-600 mb-2">
                  正解！🎉
                </h2>
                <p className="text-gray-700 mb-4">
                  {guesses.length}回目で正解しました！
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-red-600 mb-2">
                  残念...😢
                </h2>
                <p className="text-gray-700 mb-4">
                  正解は <span className="font-bold">{targetCity.name}</span> （{targetCity.prefecture}）でした
                </p>
              </>
            )}
            <div className="flex gap-2 justify-center mb-4">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
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
    </div>
  )
}