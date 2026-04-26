import type { TripDetail } from '../../types/trip'

interface TripDetailOverviewProps {
  trip: TripDetail
}

const TripDetailOverview = ({ trip }: TripDetailOverviewProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {/* Card 1: Trip Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Trip Overview</h2>
        <div className="space-y-2">
          <div className="flex justify-between py-2 px-0 border-b border-gray-200">
            <span className="text-gray-600 text-sm">Destination</span>
            <span className="text-gray-900 font-semibold text-sm">{trip.destination}</span>
          </div>
          <div className="flex justify-between py-2 px-0 border-b border-gray-200">
            <span className="text-gray-600 text-sm">Duration</span>
            <span className="text-gray-900 font-semibold text-sm">{trip.duration} days</span>
          </div>
          <div className="flex justify-between py-2 px-0 border-b border-gray-200">
            <span className="text-gray-600 text-sm">Budget</span>
            <span className="text-gray-900 font-semibold text-sm">{formatPrice(trip.price)}</span>
          </div>
          <div className="flex justify-between py-2 px-0 border-b border-gray-200">
            <span className="text-gray-600 text-sm">Season</span>
            <span className="text-gray-900 font-semibold text-sm">
              {trip.season.charAt(0).toUpperCase() + trip.season.slice(1)}
            </span>
          </div>
          <div className="flex justify-between py-2 px-0 border-b border-gray-200">
            <span className="text-gray-600 text-sm">Start Date</span>
            <span className="text-gray-900 font-semibold text-sm">{formatDate(trip.startDate)}</span>
          </div>
          <div className="flex justify-between py-2 px-0">
            <span className="text-gray-600 text-sm">End Date</span>
            <span className="text-gray-900 font-semibold text-sm">
              {formatDate(trip.endDate || trip.startDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Requirements */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📌 Requirements</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Identification</p>
            <p className="text-sm font-semibold text-gray-900">
              {trip.identification ? '✅ Yes, carry ID proof' : '❌ No ID required'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Permit</p>
            <p
              className={`text-sm font-semibold ${
                trip.permit === 'None' ? 'text-gray-500' : 'text-gray-900'
              }`}
            >
              {trip.permit}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export { TripDetailOverview }
