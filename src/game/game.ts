import { City, Guess } from '@/types/city'
import { getRandomCity } from '@/models/city'
import { calculateDistance, calculateDirection } from '@/utils/distance'

export class Game {
  private targetCity: City
  private guesses: Guess[]
  private maxAttempts: number = 6
  private isGameWon: boolean = false
  private isGameFinished: boolean = false

  constructor() {
    this.targetCity = getRandomCity()
    this.guesses = []
  }

  getTargetCity(): City {
    return this.targetCity
  }

  setTargetCity(city: City): void {
    this.targetCity = city
  }

  getGuesses(): Guess[] {
    return [...this.guesses]
  }

  getMaxAttempts(): number {
    return this.maxAttempts
  }

  getRemainingAttempts(): number {
    return this.maxAttempts - this.guesses.length
  }

  isFinished(): boolean {
    return this.isGameFinished
  }

  isWon(): boolean {
    return this.isGameWon
  }

  makeGuess(city: City): Guess {
    if (this.isGameFinished) {
      throw new Error('Game is finished')
    }

    const distance = calculateDistance(
      city.latitude,
      city.longitude,
      this.targetCity.latitude,
      this.targetCity.longitude
    )

    const direction = calculateDirection(
      city.latitude,
      city.longitude,
      this.targetCity.latitude,
      this.targetCity.longitude
    )

    // 精度の計算
    let accuracy: number
    if (distance === 0) {
      accuracy = 100
    } else {
      // 1000kmで精度が0%になるように設定
      accuracy = Math.max(0, Math.round(100 * (1 - distance / 1000)))
    }

    const guess: Guess = {
      city,
      distance,
      direction,
      accuracy
    }

    this.guesses.push(guess)

    // 正解チェック
    if (city.id === this.targetCity.id) {
      this.isGameWon = true
      this.isGameFinished = true
    } else if (this.guesses.length >= this.maxAttempts) {
      this.isGameFinished = true
    }

    return guess
  }

  reset(): void {
    this.targetCity = getRandomCity()
    this.guesses = []
    this.isGameWon = false
    this.isGameFinished = false
  }
}