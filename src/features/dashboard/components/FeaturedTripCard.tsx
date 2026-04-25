import type { FeaturedTrip } from '../types/trip'

interface FeaturedTripCardProps {
  trip: FeaturedTrip
  onClick?: () => void
}

const FeaturedTripCard = ({ trip, onClick }: FeaturedTripCardProps) => {
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  return (
    <div
      className="relative w-full h-72 rounded-lg overflow-hidden cursor-pointer mb-8 group"
      onClick={onClick}
    >
      {/* Background Image */}
      <img
        src={trip.imageUrl}
        alt={trip.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 pointer-events-none" />

      {/* Badge */}
      <div className="absolute top-4 left-4 bg-amber-400 text-black px-3 py-1.5 rounded-full text-xs font-semibold z-10">
        {trip.badge}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
        <h2 className="text-2xl font-bold mb-2">{trip.name}</h2>
        <p className="text-sm text-gray-200 line-clamp-2 mb-4">{trip.description}</p>

        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="text-xl font-bold text-green-500">{formatPrice(trip.price)}</div>
            <div className="flex flex-col gap-1 text-xs text-gray-300 mt-2">
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
          className="ml-auto bg-white text-black px-4 py-2 rounded-full text-xs font-semibold transition-all hover:bg-gray-100 hover:translate-x-1 active:scale-98"
        >
          View Trip →
        </button>
      </div>
    </div>
  )
}

export { FeaturedTripCard }
