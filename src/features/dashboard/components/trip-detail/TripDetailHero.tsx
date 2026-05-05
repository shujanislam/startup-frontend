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
  const seasonLabel = trip.season === 'all' ? 'All' : trip.season.charAt(0).toUpperCase() + trip.season.slice(1)
  const seasonEmoji =
    trip.season === 'summer'
      ? '☀️'
      : trip.season === 'winter'
        ? '❄️'
        : trip.season === 'monsoon'
          ? '🌧️'
          : trip.season === 'autumn'
            ? '🍂'
            : '🌍'

  return (
    <div className="relative h-[40vh] min-h-70 w-full overflow-hidden md:h-80 lg:h-screen">
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
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/85" />

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

      <div className="absolute bottom-10 left-4 z-20 flex flex-col gap-2 md:bottom-6">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
          Estimated Budget
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-sm font-bold text-emerald-700">
          {formatPrice(trip.price)}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/55 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
          {seasonEmoji} {seasonLabel}
        </span>
      </div>
    </div>
  )
}

export { TripDetailHero }
