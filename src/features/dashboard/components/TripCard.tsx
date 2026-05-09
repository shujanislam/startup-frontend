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

  const showSecondaryAction = Boolean(secondaryActionLabel && onSecondaryAction)
  const nights = Math.max(trip.duration - 1, 0)
  const durationText =
    nights > 0
      ? `${trip.duration} ${trip.duration === 1 ? 'Day' : 'Days'}, ${nights} ${nights === 1 ? 'Night' : 'Nights'}`
      : `${trip.duration} ${trip.duration === 1 ? 'Day' : 'Days'}`

  const handleSecondaryActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onSecondaryAction?.()
  }

  return (
    <div
      className="group relative h-[350px] cursor-pointer overflow-hidden rounded-[8px] bg-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:h-[380px]"
      onClick={onClick}
    >
      {hasUsableImage ? (
        <img
          src={trip.imageUrl}
          alt={trip.name}
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className={`flex h-full w-full items-center justify-center bg-linear-to-br ${fallbackBackground}`}>
          <span className="px-3 text-center text-sm font-semibold text-white/90">{trip.destination}</span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/0 via-black/10 to-black/80" />

      <div className="absolute left-4 top-4 z-10 max-w-[62%] rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-sm backdrop-blur">
        <span className="line-clamp-1">{trip.destination}</span>
      </div>

      {showSecondaryAction && (
        <button
          type="button"
          onClick={handleSecondaryActionClick}
          disabled={isSecondaryActionLoading}
          className="absolute right-4 top-4 z-20 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800 shadow-sm transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSecondaryActionLoading ? 'Updating...' : secondaryActionLabel}
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 text-white">
        <h3 className="line-clamp-2 text-xl font-semibold leading-tight">{trip.name}</h3>
        <p className="mt-3 text-lg font-semibold">Starting at {formatPrice(trip.price)}</p>

        <div className="mt-2 flex items-center justify-between gap-3 text-sm font-semibold">
          <span>{durationText}</span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            Learn More
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-5-5 5 5-5 5" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}

export { TripCard }
