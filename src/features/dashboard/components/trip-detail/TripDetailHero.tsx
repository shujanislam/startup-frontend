import type { TripDetail } from '../../types/trip'
import { useMemo, useState } from 'react'

interface TripDetailHeroProps {
  trip: TripDetail
  onBack: () => void
  isLiked: boolean
  isLiking: boolean
  onLikeTrip: () => void
}

const TripDetailHero = ({ trip, onBack, isLiked, isLiking, onLikeTrip }: TripDetailHeroProps) => {
  const [imageFailed, setImageFailed] = useState(false)

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  const fallbackBackground = useMemo(() => {
    const palettes = [
      'from-blue-600 via-cyan-500 to-teal-400',
      'from-rose-500 via-orange-400 to-amber-300',
      'from-indigo-600 via-violet-500 to-purple-400',
      'from-emerald-600 via-green-500 to-lime-400',
    ]

    const hash = trip.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return palettes[hash % palettes.length]
  }, [trip.name])

  const hasUsableImage = trip.imageUrl.trim().length > 0 && !imageFailed

  return (
    <div className="relative h-[40vh] min-h-[280px] w-full overflow-hidden md:h-80 lg:h-[28rem]">
      {/* Background Image */}
      {hasUsableImage ? (
        <img
          src={trip.imageUrl}
          alt={trip.name}
          onError={() => setImageFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className={`absolute inset-0 bg-linear-to-br ${fallbackBackground} flex items-center justify-center`}>
          <span className="text-white/90 text-base md:text-lg font-semibold px-4 text-center">{trip.destination}</span>
        </div>
      )}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/70" />

      {/* Back Button (Top Left) */}
      <button
        type="button"
        onClick={onBack}
        className="absolute top-4 left-4 bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium transition-all z-20"
      >
        ← Back to Trips
      </button>

      <button
        type="button"
        onClick={onLikeTrip}
        disabled={isLiking || isLiked}
        className="absolute top-4 right-4 z-20 grid h-10 w-10 place-items-center rounded-full  bg-black/40 hover:bg-black/60 text-white transition disabled:cursor-not-allowed disabled:opacity-80"
        aria-label={isLiked ? 'Trip liked' : 'Like trip'}
        title={isLiked ? 'Trip liked' : 'Like trip'}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path
            d="M12 20.25s-6.75-4.35-9-8.1A5.35 5.35 0 0 1 12 6.3a5.35 5.35 0 0 1 9 5.85c-2.25 3.75-9 8.1-9 8.1Z"
            fill={isLiked ? 'currentColor' : 'none'}
          />
        </svg>
      </button>

      {/* Season Badge (Bottom Left) */}
      <div className="absolute bottom-10 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 z-20 md:bottom-6">
        {/* <span>{getSeasonEmoji(trip.season)}</span> */}
        <span>{trip.season.charAt(0).toUpperCase() + trip.season.slice(1)}</span>
      </div>

      {/* Budget Badge (Bottom Right) */}
      <div className="absolute bottom-10 right-4 bg-white text-green-600 px-3 py-1.5 rounded-full text-sm font-bold z-20 md:bottom-6">
        {formatPrice(trip.price)}
      </div>
    </div>
  )
}

export { TripDetailHero }
