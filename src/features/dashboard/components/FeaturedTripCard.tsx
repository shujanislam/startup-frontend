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
      className="relative mb-6 h-64 w-full cursor-pointer overflow-hidden rounded-lg sm:h-72 md:mb-8 md:h-72"
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

      {/* Readability overlays */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/5 via-transparent to-black/45" />
      <div className="pointer-events-none absolute inset-0 backdrop-blur-[2px] [mask-image:linear-gradient(to_top,black_0%,black_34%,transparent_100%)]" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 md:h-44"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.56) 30%, rgba(0,0,0,0.34) 58%, rgba(0,0,0,0.14) 80%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white z-20">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 md:mb-2">{trip.name}</h2>

        <div className="flex items-start justify-between gap-4 mb-3 md:mb-4">
          <div>
            <div className="text-lg sm:text-xl font-bold text-green-500">{formatPrice(trip.price)}</div>
            <div className="flex flex-col gap-0.5 md:gap-1 text-xs text-gray-300 mt-1 md:mt-2">
              <span className="flex items-center gap-1.5">
                ⭐ {trip.rating}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { FeaturedTripCard }
