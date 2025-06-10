'use client'

import { useState, useRef, useEffect } from 'react'
import { City } from '@/types/city'
import { getAllCities } from '@/models/city'

interface GuessInputProps {
  onGuess: (city: City) => void
  disabled: boolean
}

export default function GuessInput({ onGuess, disabled }: GuessInputProps) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<City[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const cities = getAllCities()

  useEffect(() => {
    if (input.length > 0) {
      const filtered = cities.filter(
        city => 
          city.name.includes(input) ||
          city.prefecture.includes(input)
      ).slice(0, 8)
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
      setSelectedIndex(0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [input, cities])

  const handleSubmit = (city: City) => {
    onGuess(city)
    setInput('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (suggestions.length > 0 && selectedIndex < suggestions.length) {
        handleSubmit(suggestions[selectedIndex])
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="市名を入力..."
        className="w-full px-4 py-3 text-lg text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed placeholder-gray-400"
      />
      {showSuggestions && (
        <div className="absolute top-full mt-1 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-10">
          {suggestions.map((city, index) => (
            <button
              key={city.id}
              onClick={() => handleSubmit(city)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                index === selectedIndex ? 'bg-gray-100' : ''
              } ${
                index === 0 ? 'rounded-t-lg' : ''
              } ${
                index === suggestions.length - 1 ? 'rounded-b-lg' : ''
              }`}
            >
              <div className="font-medium">{city.name}</div>
              <div className="text-sm text-gray-500">{city.prefecture}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}