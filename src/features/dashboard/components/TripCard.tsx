import type { Trip } from '../types/trip'
import { useMemo, useState } from 'react'

interface TripCardProps {
  trip: Trip
  onClick?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
  isSecondaryActionLoading?: boolean
}

const TripCard = ({
  trip,
  onClick,
  secondaryActionLabel,
  onSecondaryAction,
  isSecondaryActionLoading = false,
}: TripCardProps) => {
  const [imageFailed, setImageFailed] = useState(false)

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  const fallbackBackground = useMemo(() => {
    const palettes = [
      'from-rose-400 via-orange-300 to-amber-300',
      'from-cyan-500 via-sky-400 to-indigo-400',
      'from-emerald-500 via-teal-400 to-cyan-300',
      'from-fuchsia-500 via-pink-400 to-rose-300',
      'from-violet-500 via-purple-400 to-indigo-300',
    ]

    const hash = trip.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return palettes[hash % palettes.length]
  }, [trip.name])

  const hasUsableImage = trip.imageUrl.trim().length > 0 && !imageFailed

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

  const displayTags = trip.tags.slice(0, 3)
  const showSecondaryAction = Boolean(secondaryActionLabel && onSecondaryAction)

  const handleViewClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onClick?.()
  }

  const handleSecondaryActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onSecondaryAction?.()
  }

  return (
    <div
      className="flex flex-col bg-white border border-gray-100 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer h-full shadow-sm hover:shadow-lg hover:border-gray-300 group"
      onClick={onClick}
    >
      {/* Image Section with Badges */}
      <div className="relative w-full h-44 overflow-hidden bg-gray-100">
        {hasUsableImage ? (
          <img
            src={trip.imageUrl}
            alt={trip.name}
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full bg-linear-to-br ${fallbackBackground} flex items-center justify-center`}>
            <span className="text-white/90 text-sm font-semibold px-3 text-center">{trip.destination}</span>
          </div>
        )}

        {/* Top Right: Budget Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-xs font-semibold text-green-600 border border-white/50 z-10">
          {formatPrice(trip.price)}
        </div>

        {/* Top Left: Season Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-white border border-white/20 z-10">
          <span className="text-sm">{getSeasonEmoji(trip.season)}</span>
          <span className="text-xs font-semibold">
            {trip.season === 'all' ? 'All' : trip.season.charAt(0).toUpperCase() + trip.season.slice(1)}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <h3 className="text-base font-semibold text-gray-900 leading-snug">
          {trip.name}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {trip.description}
        </p>

        {/* Info Row */}
        <div className="flex gap-2 flex-wrap text-xs text-gray-600">
          <span className="flex items-center gap-1 whitespace-nowrap">
            📍 {trip.destination}
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            ⏱ {trip.duration}d
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            ⭐ {trip.rating}
          </span>
        </div>

        {/* Tags Row */}
        {displayTags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Button */}
        <div className={`mt-auto grid gap-2 ${showSecondaryAction ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <button
            type="button"
            onClick={handleViewClick}
            className="px-3 py-2.5 bg-blue-600 text-white rounded-md text-xs font-semibold transition-all duration-200 w-full hover:bg-blue-700 hover:shadow-md active:scale-98"
          >
            View Full Plan
          </button>

          {showSecondaryAction && (
            <button
              type="button"
              onClick={handleSecondaryActionClick}
              disabled={isSecondaryActionLoading}
              className="px-3 py-2.5 bg-amber-100 text-amber-800 rounded-md text-xs font-semibold transition-all duration-200 w-full hover:bg-amber-200 hover:shadow-md active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSecondaryActionLoading ? 'Updating...' : secondaryActionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export { TripCard }
