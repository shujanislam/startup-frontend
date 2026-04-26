import type { TripDetail } from '../../types/trip'

interface TripDetailVehiclesProps {
  trip: TripDetail
}

const TripDetailVehicles = ({ trip }: TripDetailVehiclesProps) => {
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">🚗 Transportation</h2>
      {trip.vehicles.length > 0 ? (
        <div className="space-y-3">
          {trip.vehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className={`flex items-start justify-between py-3 px-0 ${
                index !== trip.vehicles.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">
                  🚗 {vehicle.name} ({vehicle.carNumber})
                </p>
                <p className="text-gray-600 text-xs mt-1">Driver: {vehicle.driverName}</p>
                <p className="text-gray-600 text-xs">{vehicle.driverPhone}</p>
              </div>
              <p className="text-green-600 font-bold text-sm ml-4 whitespace-nowrap">
                {formatPrice(vehicle.budget)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-sm">No transport details added yet</p>
      )}
    </div>
  )
}

export { TripDetailVehicles }
