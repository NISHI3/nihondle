import { Game } from '../game'
import { City } from '@/types/city'

const mockTokyo: City = {
  id: 'tokyo',
  name: '東京都',
  prefecture: '東京都',
  latitude: 35.6762,
  longitude: 139.6503,
  population: 14000000
}

const mockOsaka: City = {
  id: 'osaka',
  name: '大阪市',
  prefecture: '大阪府',
  latitude: 34.6937,
  longitude: 135.5023,
  population: 2750000
}

const mockSapporo: City = {
  id: 'sapporo',
  name: '札幌市',
  prefecture: '北海道',
  latitude: 43.0642,
  longitude: 141.3469,
  population: 1970000
}

describe('Game', () => {
  let game: Game

  beforeEach(() => {
    game = new Game()
  })

  describe('initialization', () => {
    it('should initialize with a target city', () => {
      expect(game.getTargetCity()).toBeDefined()
      expect(game.getTargetCity()).toHaveProperty('id')
      expect(game.getTargetCity()).toHaveProperty('name')
    })

    it('should initialize with empty guesses', () => {
      expect(game.getGuesses()).toEqual([])
    })

    it('should initialize with max attempts of 6', () => {
      expect(game.getMaxAttempts()).toBe(6)
    })

    it('should not be finished initially', () => {
      expect(game.isFinished()).toBe(false)
    })

    it('should not be won initially', () => {
      expect(game.isWon()).toBe(false)
    })
  })

  describe('setTargetCity', () => {
    it('should set a specific target city', () => {
      game.setTargetCity(mockTokyo)
      expect(game.getTargetCity()).toEqual(mockTokyo)
    })
  })

  describe('makeGuess', () => {
    beforeEach(() => {
      game.setTargetCity(mockTokyo)
    })

    it('should add a guess with correct distance and direction', () => {
      const result = game.makeGuess(mockOsaka)
      expect(result).toBeDefined()
      expect(result.city).toEqual(mockOsaka)
      expect(result.distance).toBeCloseTo(392, -1)
      expect(result.direction).toBeCloseTo(73, 0)
      expect(result.accuracy).toBeCloseTo(61, 0)
    })

    it('should add guess to guesses list', () => {
      game.makeGuess(mockOsaka)
      expect(game.getGuesses()).toHaveLength(1)
      expect(game.getGuesses()[0].city).toEqual(mockOsaka)
    })

    it('should calculate correct accuracy for exact match', () => {
      const result = game.makeGuess(mockTokyo)
      expect(result.accuracy).toBe(100)
      expect(result.distance).toBe(0)
    })

    it('should calculate accuracy based on distance', () => {
      game.setTargetCity(mockTokyo)
      const result1 = game.makeGuess(mockOsaka) // 約400km
      expect(result1.accuracy).toBeGreaterThan(50)
      expect(result1.accuracy).toBeLessThan(100)

      const result2 = game.makeGuess(mockSapporo) // 約830km
      expect(result2.accuracy).toBeGreaterThan(0)
      expect(result2.accuracy).toBeLessThan(result1.accuracy)
    })

    it('should not allow guesses after max attempts', () => {
      for (let i = 0; i < 6; i++) {
        game.makeGuess(mockOsaka)
      }
      expect(() => game.makeGuess(mockSapporo)).toThrow('Game is finished')
    })

    it('should not allow guesses after winning', () => {
      game.makeGuess(mockTokyo)
      expect(() => game.makeGuess(mockOsaka)).toThrow('Game is finished')
    })
  })

  describe('game state', () => {
    beforeEach(() => {
      game.setTargetCity(mockTokyo)
    })

    it('should be won when guessing correctly', () => {
      game.makeGuess(mockTokyo)
      expect(game.isWon()).toBe(true)
      expect(game.isFinished()).toBe(true)
    })

    it('should be finished after max attempts', () => {
      for (let i = 0; i < 6; i++) {
        game.makeGuess(mockOsaka)
      }
      expect(game.isFinished()).toBe(true)
      expect(game.isWon()).toBe(false)
    })

    it('should track remaining attempts', () => {
      expect(game.getRemainingAttempts()).toBe(6)
      game.makeGuess(mockOsaka)
      expect(game.getRemainingAttempts()).toBe(5)
      game.makeGuess(mockSapporo)
      expect(game.getRemainingAttempts()).toBe(4)
    })
  })

  describe('reset', () => {
    it('should reset game state', () => {
      game.setTargetCity(mockTokyo)
      game.makeGuess(mockOsaka)
      game.makeGuess(mockSapporo)
      
      game.reset()
      
      expect(game.getGuesses()).toEqual([])
      expect(game.isFinished()).toBe(false)
      expect(game.isWon()).toBe(false)
      expect(game.getRemainingAttempts()).toBe(6)
      expect(game.getTargetCity()).toBeDefined()
    })
  })
})