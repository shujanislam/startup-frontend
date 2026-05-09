import type { FeaturedTrip } from '../types/trip'
import { useMemo, useState } from 'react'

interface FeaturedTripCardProps {
  trip: FeaturedTrip
  onClick?: () => void
}

const FeaturedTripCard = ({ trip, onClick }: FeaturedTripCardProps) => {
  const [imageFailed, setImageFailed] = useState(false)

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  const fallbackBackground = useMemo(() => {
    const palettes = [
      'from-sky-500 via-cyan-400 to-teal-300',
      'from-orange-500 via-amber-400 to-yellow-300',
      'from-indigo-500 via-violet-400 to-fuchsia-300',
      'from-emerald-500 via-lime-400 to-green-300',
    ]

    const hash = trip.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return palettes[hash % palettes.length]
  }, [trip.name])

  const hasUsableImage = trip.imageUrl.trim().length > 0 && !imageFailed
  const nights = Math.max(trip.duration - 1, 0)
  const durationText =
    nights > 0
      ? `${trip.duration} ${trip.duration === 1 ? 'Day' : 'Days'}, ${nights} ${nights === 1 ? 'Night' : 'Nights'}`
      : `${trip.duration} ${trip.duration === 1 ? 'Day' : 'Days'}`

  return (
    <button
      type="button"
      className="group relative block h-[320px] w-full cursor-pointer overflow-hidden rounded-[10px] bg-slate-100 text-left sm:h-[460px] lg:h-[60vh] lg:min-h-[500px] xl:h-[62vh] 2xl:h-[64vh]"
      onClick={onClick}
      aria-label={`View featured trip ${trip.name}`}
    >
      {hasUsableImage ? (
        <img
          src={trip.imageUrl}
          alt={trip.name}
          onError={() => setImageFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      ) : (
        <div className={`absolute inset-0 flex items-center justify-center bg-linear-to-br ${fallbackBackground}`}>
          <span className="px-4 text-center text-base font-semibold text-white/90 md:text-lg">{trip.destination}</span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/10 via-black/20 to-black/90" />
      <div className="absolute left-4 top-4 flex max-w-[calc(100%-2rem)] flex-wrap gap-2 sm:left-5 sm:top-5">
        <span className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-sm">
          Featured Trip
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 text-white sm:p-7">
        <div>
          <h2 className="line-clamp-2 text-2xl font-semibold leading-tight sm:text-4xl">
            {trip.name}
          </h2>
          <p className="mt-3 text-md text-gray-300 font-semibold sm:text-xl">Starting at {formatPrice(trip.price)}</p>

          <div className="mt-3 flex w-full items-center justify-between gap-4 text-sm font-normal text-gray-400 sm:text-base">
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
    </button>
  )
}

export { FeaturedTripCard }
