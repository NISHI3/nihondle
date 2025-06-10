import { Guess } from '@/types/city'
import { getDirectionEmoji } from '@/utils/distance'

interface GuessResultProps {
  guess: Guess
  isTarget: boolean
}

export default function GuessResult({ guess, isTarget }: GuessResultProps) {
  // Worldle風の色分け
  const getProximityColor = (accuracy: number) => {
    if (isTarget) return 'bg-green-500'
    if (accuracy >= 80) return 'bg-green-400'
    if (accuracy >= 50) return 'bg-yellow-400'
    if (accuracy >= 20) return 'bg-orange-400'
    return 'bg-red-400'
  }

  const getProximityEmoji = (accuracy: number) => {
    if (isTarget) return '🟩'
    if (accuracy >= 80) return '🟩'
    if (accuracy >= 50) return '🟨'
    if (accuracy >= 20) return '🟧'
    return '⬜'
  }

  return (
    <div className="grid grid-cols-5 gap-2 p-3 bg-card border border-border rounded-lg">
      {/* 市名 */}
      <div className="col-span-2">
        <div className="font-semibold text-card-foreground">{guess.city.name}</div>
        <div className="text-xs text-gray-500">{guess.city.prefecture}</div>
      </div>

      {/* 距離 */}
      <div className="text-center">
        <div className="text-sm font-medium">{guess.distance}km</div>
        <div className="text-xs text-gray-500">距離</div>
      </div>

      {/* 方向 */}
      <div className="text-center">
        {!isTarget ? (
          <>
            <div className="text-xl">{getDirectionEmoji(guess.direction)}</div>
            <div className="text-xs text-gray-500">方向</div>
          </>
        ) : (
          <>
            <div className="text-xl">🎯</div>
            <div className="text-xs text-gray-500">正解</div>
          </>
        )}
      </div>

      {/* 近接度 */}
      <div className="text-center">
        <div className={`w-8 h-8 mx-auto rounded ${getProximityColor(guess.accuracy)} flex items-center justify-center text-white font-bold text-sm`}>
          {guess.accuracy}%
        </div>
        <div className="text-xs text-gray-500 mt-1">近接度</div>
      </div>
    </div>
  )
}