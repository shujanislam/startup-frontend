import type { TripDetail } from '../../types/trip'

interface TripDetailSpotsProps {
  trip: TripDetail
}

const TripDetailSpots = ({ trip }: TripDetailSpotsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">📍 Places to Visit</h2>
      {trip.spots.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {trip.spots.map((spot) => (
            <span
              key={spot}
              className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-sm font-medium inline-block"
            >
              📍 {spot}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-sm">No spots listed</p>
      )}
    </div>
  )
}

export { TripDetailSpots }
