import { City } from '@/types/city'
import { getCityById, getAllCities, getRandomCity, getCitiesByPrefecture } from '../city'

describe('City Model', () => {
  describe('getCityById', () => {
    it('should return Tokyo when id is tokyo', () => {
      const city = getCityById('tokyo')
      expect(city).toBeDefined()
      expect(city?.id).toBe('tokyo')
      expect(city?.name).toBe('東京都')
      expect(city?.prefecture).toBe('東京都')
      expect(city?.latitude).toBeCloseTo(35.6762, 2)
      expect(city?.longitude).toBeCloseTo(139.6503, 2)
      expect(city?.population).toBeGreaterThan(10000000)
    })

    it('should return Osaka when id is osaka', () => {
      const city = getCityById('osaka')
      expect(city).toBeDefined()
      expect(city?.id).toBe('osaka')
      expect(city?.name).toBe('大阪市')
      expect(city?.prefecture).toBe('大阪府')
      expect(city?.latitude).toBeCloseTo(34.71, 1)
      expect(city?.longitude).toBeCloseTo(135.53, 1)
    })

    it('should return undefined for invalid id', () => {
      const city = getCityById('invalid-city-id')
      expect(city).toBeUndefined()
    })
  })

  describe('getAllCities', () => {
    it('should return an array of cities', () => {
      const cities = getAllCities()
      expect(Array.isArray(cities)).toBe(true)
      expect(cities.length).toBeGreaterThan(1500)
    })

    it('should have valid city objects', () => {
      const cities = getAllCities()
      const firstCity = cities[0]
      expect(firstCity).toHaveProperty('id')
      expect(firstCity).toHaveProperty('name')
      expect(firstCity).toHaveProperty('prefecture')
      expect(firstCity).toHaveProperty('latitude')
      expect(firstCity).toHaveProperty('longitude')
    })

    it('should include major cities', () => {
      const cities = getAllCities()
      const cityNames = cities.map(c => c.name)
      expect(cityNames).toContain('東京都')
      expect(cityNames).toContain('大阪市')
      expect(cityNames).toContain('名古屋市')
      expect(cityNames).toContain('札幌市')
      expect(cityNames).toContain('福岡市')
    })
  })

  describe('getRandomCity', () => {
    it('should return a valid city', () => {
      const city = getRandomCity()
      expect(city).toBeDefined()
      expect(city.id).toBeTruthy()
      expect(city.name).toBeTruthy()
      expect(city.prefecture).toBeTruthy()
    })

    it('should return different cities on multiple calls', () => {
      const cities = new Set<string>()
      for (let i = 0; i < 20; i++) {
        cities.add(getRandomCity().id)
      }
      expect(cities.size).toBeGreaterThan(5)
    })
  })

  describe('getCitiesByPrefecture', () => {
    it('should return cities for Tokyo', () => {
      const cities = getCitiesByPrefecture('東京都')
      expect(cities.length).toBeGreaterThan(20)
      expect(cities.every(c => c.prefecture === '東京都')).toBe(true)
    })

    it('should return empty array for invalid prefecture', () => {
      const cities = getCitiesByPrefecture('無効県')
      expect(cities).toEqual([])
    })
  })
})