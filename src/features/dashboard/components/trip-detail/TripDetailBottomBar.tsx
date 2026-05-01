import type { TripDetail } from '../../types/trip'

interface TripDetailBottomBarProps {
  trip: TripDetail
}

const TripDetailBottomBar = ({ trip }: TripDetailBottomBarProps) => {
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Estimated Budget</p>
          <p className="mt-1 text-sm font-bold text-emerald-600 md:text-base">
            {formatPrice(trip.price)} total
          </p>
        </div>

        <div className="flex gap-2 md:gap-3 flex-wrap md:flex-nowrap">
          <button
            type="button"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 md:px-4 md:text-sm"
          >
            Share
          </button>

          <button
            type="button"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 md:px-4 md:text-sm"
          >
            Save
          </button>

          <button
            type="button"
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 md:px-6 md:text-sm"
          >
            Book This Trip
          </button>
        </div>
      </div>
    </div>
  )
}

export { TripDetailBottomBar }
