import { useEffect, useState } from 'react'
import { City } from '@/types/city'
import { getCityShape } from '@/data/cityShapes'

interface CityImageProps {
  city: City
  showDetails: boolean
}

export default function CityImage({ city, showDetails }: CityImageProps) {
  const [imageError, setImageError] = useState(false)

  // 市の形状を表示
  const renderCityShape = () => {
    const shapePath = getCityShape(city.id)
    
    return (
      <svg width="300" height="300" viewBox="0 0 300 300" className="w-full h-full">
        <g transform="translate(0, 0)">
          {/* 影 */}
          <path
            d={shapePath}
            fill="#00000020"
            transform="translate(3, 3)"
          />
          {/* メインの形状 */}
          <path
            d={shapePath}
            fill={showDetails ? '#3B82F6' : '#374151'}
            stroke={showDetails ? '#E5E7EB' : '#6B7280'}
            strokeWidth="2"
            className="transition-all duration-300"
          />
        </g>
        {showDetails && (
          <>
            <text 
              x="150" 
              y="150" 
              textAnchor="middle" 
              dominantBaseline="middle" 
              className="fill-white font-bold text-xl"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
            >
              {city.name}
            </text>
            <text 
              x="150" 
              y="170" 
              textAnchor="middle" 
              dominantBaseline="middle" 
              className="fill-white text-sm"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
            >
              {city.prefecture}
            </text>
          </>
        )}
      </svg>
    )
  }

  // 実際の画像がある場合の処理（将来的に実装）
  const imagePath = `/images/cities/${city.id}.svg`

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-4 shadow-inner">
      <div className="relative w-full h-full">
        {renderCityShape()}
      </div>
    </div>
  )
}