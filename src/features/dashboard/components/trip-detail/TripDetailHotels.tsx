import type { TripDetail } from '../../types/trip'

interface TripDetailHotelsProps {
  trip: TripDetail
  isRevealed: boolean
}

const TripDetailHotels = ({ trip, isRevealed }: TripDetailHotelsProps) => {
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full border border-gray-300 bg-white text-gray-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.75 21h16.5M5.25 21V7.5A1.5 1.5 0 0 1 6.75 6h10.5a1.5 1.5 0 0 1 1.5 1.5V21M9 9.75h.008v.008H9v-.008Zm0 3h.008v.008H9v-.008Zm0 3h.008v.008H9v-.008Zm3-6h.008v.008H12v-.008Zm0 3h.008v.008H12v-.008Zm0 3h.008v.008H12v-.008Zm3-6h.008v.008H15v-.008Zm0 3h.008v.008H15v-.008Zm0 3h.008v.008H15v-.008Z" />
          </svg>
        </span>
        <h2 className="text-base font-semibold text-gray-900">Accommodation</h2>
      </div>
      {trip.hotels.length > 0 ? (
        <div className="relative">
          <div className={`space-y-3 transition ${isRevealed ? '' : 'pointer-events-none select-none blur-[5px]'}`}>
          {trip.hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="flex items-start justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-3"
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{hotel.name}</p>
                <p className="mt-1 text-xs text-gray-600">{hotel.address || 'Address not provided'}</p>
                <p className="mt-1 text-xs text-gray-600">{hotel.phone || 'Phone number not provided'}</p>
              </div>
              <p className="ml-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                {formatPrice(hotel.budget)}
              </p>
            </div>
          ))}
          </div>
          {!isRevealed && (
            <div className="absolute inset-0 grid place-items-center rounded-lg bg-white/35">
              <div className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-gray-600">
                Unlock trip to view accommodation details
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm italic text-gray-500">No accommodation details added yet</p>
      )}
    </div>
  )
}

export { TripDetailHotels }
