import { calculateDistance, calculateDirection, getDirectionEmoji } from '../distance'

describe('Distance Utils', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between Tokyo and Osaka', () => {
      const tokyo = { lat: 35.6762, lng: 139.6503 }
      const osaka = { lat: 34.6937, lng: 135.5023 }
      const distance = calculateDistance(tokyo.lat, tokyo.lng, osaka.lat, osaka.lng)
      expect(distance).toBeCloseTo(392, -1) // 約392km
    })

    it('should calculate distance between Tokyo and Sapporo', () => {
      const tokyo = { lat: 35.6762, lng: 139.6503 }
      const sapporo = { lat: 43.0642, lng: 141.3469 }
      const distance = calculateDistance(tokyo.lat, tokyo.lng, sapporo.lat, sapporo.lng)
      expect(distance).toBeCloseTo(831, -1) // 約831km
    })

    it('should return 0 for same location', () => {
      const distance = calculateDistance(35.6762, 139.6503, 35.6762, 139.6503)
      expect(distance).toBe(0)
    })
  })

  describe('calculateDirection', () => {
    it('should calculate direction from Tokyo to Osaka (west)', () => {
      const tokyo = { lat: 35.6762, lng: 139.6503 }
      const osaka = { lat: 34.6937, lng: 135.5023 }
      const direction = calculateDirection(tokyo.lat, tokyo.lng, osaka.lat, osaka.lng)
      expect(direction).toBeCloseTo(255, 0) // 西南西
    })

    it('should calculate direction from Tokyo to Sapporo (north)', () => {
      const tokyo = { lat: 35.6762, lng: 139.6503 }
      const sapporo = { lat: 43.0642, lng: 141.3469 }
      const direction = calculateDirection(tokyo.lat, tokyo.lng, sapporo.lat, sapporo.lng)
      expect(direction).toBeCloseTo(10, 0) // 北北東
    })

    it('should calculate direction from Tokyo to Fukuoka (southwest)', () => {
      const tokyo = { lat: 35.6762, lng: 139.6503 }
      const fukuoka = { lat: 33.5904, lng: 130.4017 }
      const direction = calculateDirection(tokyo.lat, tokyo.lng, fukuoka.lat, fukuoka.lng)
      expect(direction).toBeCloseTo(257, 0) // 西南西
    })
  })

  describe('getDirectionEmoji', () => {
    it('should return correct emoji for north', () => {
      expect(getDirectionEmoji(0)).toBe('↑')
      expect(getDirectionEmoji(360)).toBe('↑')
    })

    it('should return correct emoji for northeast', () => {
      expect(getDirectionEmoji(45)).toBe('↗')
    })

    it('should return correct emoji for east', () => {
      expect(getDirectionEmoji(90)).toBe('→')
    })

    it('should return correct emoji for southeast', () => {
      expect(getDirectionEmoji(135)).toBe('↘')
    })

    it('should return correct emoji for south', () => {
      expect(getDirectionEmoji(180)).toBe('↓')
    })

    it('should return correct emoji for southwest', () => {
      expect(getDirectionEmoji(225)).toBe('↙')
    })

    it('should return correct emoji for west', () => {
      expect(getDirectionEmoji(270)).toBe('←')
    })

    it('should return correct emoji for northwest', () => {
      expect(getDirectionEmoji(315)).toBe('↖')
    })

    it('should handle boundary values correctly', () => {
      expect(getDirectionEmoji(22)).toBe('↑') // 北
      expect(getDirectionEmoji(23)).toBe('↗') // 北東
      expect(getDirectionEmoji(67)).toBe('↗') // 北東
      expect(getDirectionEmoji(68)).toBe('→') // 東
    })
  })
})