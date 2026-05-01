import type { TripDetail } from '../../types/trip'

interface TripDetailVehiclesProps {
  trip: TripDetail
  isRevealed: boolean
}

const TripDetailVehicles = ({ trip, isRevealed }: TripDetailVehiclesProps) => {
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full border border-gray-300 bg-white text-gray-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.25 18.75a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm10.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM2.25 9.75h11.466a1.5 1.5 0 0 1 1.2.6l2.25 3a1.5 1.5 0 0 0 1.2.6H21v2.25a1.5 1.5 0 0 1-1.5 1.5h-.75M2.25 9.75V16.5a1.5 1.5 0 0 0 1.5 1.5h1.5m0 0h8.5m-11.5-8.25 1.5-4.5A1.5 1.5 0 0 1 5.175 4.5h8.85a1.5 1.5 0 0 1 1.425 1.05l1.2 3.6" />
          </svg>
        </span>
        <h2 className="text-base font-semibold text-gray-900">Transportation</h2>
      </div>
      {trip.vehicles.length > 0 ? (
        <div className="relative">
          <div className={`space-y-3 transition ${isRevealed ? '' : 'pointer-events-none select-none blur-[5px]'}`}>
          {trip.vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex items-start justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-3"
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {vehicle.name} ({vehicle.carNumber})
                </p>
                <p className="mt-1 text-xs text-gray-600">Driver: {vehicle.driverName || 'Not assigned'}</p>
                <p className="text-xs text-gray-600">{vehicle.driverPhone || 'Phone not available'}</p>
              </div>
              <p className="ml-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                {formatPrice(vehicle.budget)}
              </p>
            </div>
          ))}
          </div>
          {!isRevealed && (
            <div className="absolute inset-0 grid place-items-center rounded-lg bg-white/35">
              <div className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-gray-600">
                Unlock trip to view transport details
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm italic text-gray-500">No transport details added yet</p>
      )}
    </div>
  )
}

export { TripDetailVehicles }
