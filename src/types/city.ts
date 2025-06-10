export interface City {
  id: string
  name: string
  prefecture: string
  latitude: number
  longitude: number
  population?: number
}

export interface Guess {
  city: City
  distance: number
  direction: number
  accuracy: number
}