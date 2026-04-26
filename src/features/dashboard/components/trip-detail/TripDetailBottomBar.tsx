import type { TripDetail } from '../../types/trip'

interface TripDetailBottomBarProps {
  trip: TripDetail
}

const TripDetailBottomBar = ({ trip }: TripDetailBottomBarProps) => {
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
      <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full gap-4">
        {/* Left: Trip Info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm md:text-base truncate">{trip.name}</p>
          <p className="text-green-600 font-bold text-xs md:text-sm mt-1">
            {formatPrice(trip.price)} total
          </p>
        </div>

        {/* Right: Buttons */}
        <div className="flex gap-2 md:gap-3 flex-wrap md:flex-nowrap">
          <button
            type="button"
            className="border border-gray-300 text-gray-700 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-gray-50 transition-all whitespace-nowrap"
          >
            📤 Share Trip
          </button>

          <button
            type="button"
            className="border border-gray-300 text-gray-700 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-gray-50 transition-all whitespace-nowrap"
          >
            🔖 Save Trip
          </button>

          <button
            type="button"
            className="bg-blue-600 text-white px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-blue-700 transition-all whitespace-nowrap"
          >
            Book This Trip
          </button>
        </div>
      </div>
    </div>
  )
}

export { TripDetailBottomBar }
