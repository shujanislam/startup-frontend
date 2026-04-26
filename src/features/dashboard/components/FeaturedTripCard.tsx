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

  return (
    <div
      className="relative w-full h-56 sm:h-64 md:h-72 rounded-lg overflow-hidden cursor-pointer mb-6 md:mb-8 group"
      onClick={onClick}
    >
      {/* Background Image */}
      {hasUsableImage ? (
        <img
          src={trip.imageUrl}
          alt={trip.name}
          onError={() => setImageFailed(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className={`absolute inset-0 bg-linear-to-br ${fallbackBackground} flex items-center justify-center`}>
          <span className="text-white/90 text-sm md:text-base font-semibold px-4 text-center">{trip.destination}</span>
        </div>
      )}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/70 pointer-events-none" />

      {/* Badge */}
      <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-amber-400 text-black px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-semibold z-10">
        {trip.badge}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white z-20">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 md:mb-2">{trip.name}</h2>
        <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 mb-3 md:mb-4">{trip.description}</p>

        <div className="flex items-start justify-between gap-4 mb-3 md:mb-4">
          <div>
            <div className="text-lg sm:text-xl font-bold text-green-500">{formatPrice(trip.price)}</div>
            <div className="flex flex-col gap-0.5 md:gap-1 text-xs text-gray-300 mt-1 md:mt-2">
              <span className="flex items-center gap-1.5">
                📍 {trip.destination}
              </span>
              <span className="flex items-center gap-1.5">
                ⏱ {trip.duration} days
              </span>
              <span className="flex items-center gap-1.5">
                ⭐ {trip.rating}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="ml-auto bg-white text-black px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs font-semibold transition-all hover:bg-gray-100 hover:translate-x-1 active:scale-98"
        >
          View Trip →
        </button>
      </div>
    </div>
  )
}

export { FeaturedTripCard }
