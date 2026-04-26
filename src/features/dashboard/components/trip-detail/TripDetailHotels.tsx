import type { TripDetail } from '../../types/trip'

interface TripDetailHotelsProps {
  trip: TripDetail
}

const TripDetailHotels = ({ trip }: TripDetailHotelsProps) => {
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">🏨 Accommodation</h2>
      {trip.hotels.length > 0 ? (
        <div className="space-y-3">
          {trip.hotels.map((hotel, index) => (
            <div
              key={hotel.id}
              className={`flex items-start justify-between py-3 px-0 ${
                index !== trip.hotels.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">🏨 {hotel.name}</p>
                <p className="text-gray-600 text-xs mt-1">{hotel.address}</p>
              </div>
              <p className="text-green-600 font-bold text-sm ml-4 whitespace-nowrap">
                {formatPrice(hotel.budget)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-sm">No accommodation details added yet</p>
      )}
    </div>
  )
}

export { TripDetailHotels }
