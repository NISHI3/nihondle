import { Guess } from '@/types/city'

export function generateShareText(guesses: Guess[], isWon: boolean, gameNumber: number): string {
  const attempts = guesses.length
  const maxAttempts = 6
  
  let shareText = `Nihondle #${gameNumber} ${isWon ? attempts : 'X'}/${maxAttempts}\n\n`
  
  // 各推測を絵文字で表現
  guesses.forEach((guess) => {
    const isCorrect = guess.distance === 0
    if (isCorrect) {
      shareText += '🟩'
    } else if (guess.accuracy >= 80) {
      shareText += '🟩'
    } else if (guess.accuracy >= 50) {
      shareText += '🟨'
    } else if (guess.accuracy >= 20) {
      shareText += '🟧'
    } else {
      shareText += '⬜'
    }
    
    // 方向を表す矢印
    if (!isCorrect) {
      const direction = guess.direction
      if (direction >= 337.5 || direction < 22.5) shareText += '⬆️'
      else if (direction < 67.5) shareText += '↗️'
      else if (direction < 112.5) shareText += '➡️'
      else if (direction < 157.5) shareText += '↘️'
      else if (direction < 202.5) shareText += '⬇️'
      else if (direction < 247.5) shareText += '↙️'
      else if (direction < 292.5) shareText += '⬅️'
      else shareText += '↖️'
    }
    
    shareText += '\n'
  })
  
  shareText += '\nhttps://nihondle.example.com'
  
  return shareText
}

export async function shareResult(shareText: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Nihondle',
        text: shareText
      })
      return true
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }
  
  // フォールバック: クリップボードにコピー
  try {
    await navigator.clipboard.writeText(shareText)
    return true
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    return false
  }
}