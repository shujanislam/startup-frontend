import type { TripDetail } from '../../types/trip'

interface TripDetailSpotsProps {
  trip: TripDetail
}

const TripDetailSpots = ({ trip }: TripDetailSpotsProps) => {
  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full border border-gray-300 bg-white text-gray-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" />
            <circle cx="12" cy="10" r="2.5" strokeWidth={1.8} />
          </svg>
        </span>
        <h2 className="text-base font-semibold text-gray-900">Places to Visit</h2>
      </div>
      {trip.spots.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {trip.spots.map((spot) => (
            <span
              key={spot}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700"
            >
              <svg className="h-3.5 w-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" />
                <circle cx="12" cy="10" r="2.5" strokeWidth={1.8} />
              </svg>
              {spot}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm italic text-gray-500">No spots listed</p>
      )}
    </div>
  )
}

export { TripDetailSpots }
