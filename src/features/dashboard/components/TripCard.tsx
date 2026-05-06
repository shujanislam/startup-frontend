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

  const displayTags = trip.tags.slice(0, 3)
  const showSecondaryAction = Boolean(secondaryActionLabel && onSecondaryAction)
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

  const handleSecondaryActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onSecondaryAction?.()
  }

  return (
    <div
      className="group relative h-72 cursor-pointer overflow-hidden rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-lg"
      onClick={onClick}
    >
      {hasUsableImage ? (
        <img
          src={trip.imageUrl}
          alt={trip.name}
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className={`h-full w-full bg-linear-to-br ${fallbackBackground} flex items-center justify-center`}>
          <span className="px-3 text-center text-sm font-semibold text-white/90">{trip.destination}</span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/85" />

      {showSecondaryAction && (
        <button
          type="button"
          onClick={handleSecondaryActionClick}
          disabled={isSecondaryActionLoading}
          className="absolute right-3 top-3 z-10 rounded-lg border border-amber-200 bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSecondaryActionLoading ? 'Updating...' : secondaryActionLabel}
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-10 p-3 text-white">
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="mt-2 line-clamp-1 text-base font-semibold leading-snug">{trip.name}</h3>
          </div>
          <span className="text-sm font-medium">⭐ {trip.rating}</span>
        </div>
        <span className="text-sm font-semibold text-emerald-200">{formatPrice(trip.price)}</span>
        
        {displayTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/25 bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export { TripCard }
