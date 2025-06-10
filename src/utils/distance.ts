export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  if (lat1 === lat2 && lng1 === lng2) return 0

  const R = 6371 // 地球の半径（km）
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

export function calculateDirection(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLng = toRad(lng2 - lng1)
  const y = Math.sin(dLng) * Math.cos(toRad(lat2))
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng)
  let bearing = Math.atan2(y, x)
  bearing = toDeg(bearing)
  return (bearing + 360) % 360
}

export function getDirectionEmoji(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360
  
  if (normalized < 22.5 || normalized >= 337.5) return '↑' // 北
  if (normalized < 67.5) return '↗' // 北東
  if (normalized < 112.5) return '→' // 東
  if (normalized < 157.5) return '↘' // 南東
  if (normalized < 202.5) return '↓' // 南
  if (normalized < 247.5) return '↙' // 南西
  if (normalized < 292.5) return '←' // 西
  return '↖' // 北西
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180
}

function toDeg(radians: number): number {
  return (radians * 180) / Math.PI
}