import type { TripDetail } from '../../types/trip'

interface TripDetailHeroProps {
  trip: TripDetail
  onBack: () => void
}

const getSeasonEmoji = (season: string) => {
  const seasonMap: Record<string, string> = {
    summer: '☀️',
    winter: '❄️',
    monsoon: '🌧️',
    autumn: '🍂',
    all: '🌍',
  }
  return seasonMap[season] || '🌍'
}

const TripDetailHero = ({ trip, onBack }: TripDetailHeroProps) => {
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  return (
    <div className="relative w-full h-48 md:h-72 lg:h-96 overflow-hidden">
      {/* Background Image */}
      <img
        src={trip.imageUrl}
        alt={trip.name}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />

      {/* Back Button (Top Left) */}
      <button
        type="button"
        onClick={onBack}
        className="absolute top-4 left-4 bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium transition-all z-20"
      >
        ← Back to Trips
      </button>

      {/* Season Badge (Bottom Left) */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 z-20">
        <span>{getSeasonEmoji(trip.season)}</span>
        <span>{trip.season.charAt(0).toUpperCase() + trip.season.slice(1)}</span>
      </div>

      {/* Budget Badge (Bottom Right) */}
      <div className="absolute bottom-4 right-4 bg-white text-green-600 px-3 py-1.5 rounded-full text-sm font-bold z-20">
        {formatPrice(trip.price)}
      </div>
    </div>
  )
}

export { TripDetailHero }
