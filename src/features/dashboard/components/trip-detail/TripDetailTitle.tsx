import type { TripDetail } from '../../types/trip'

interface TripDetailTitleProps {
  trip: TripDetail
}

const TripDetailTitle = ({ trip }: TripDetailTitleProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8 md:mt-12 lg:mt-16">
      {/* Row 1: Title + Rating */}
      <div className="flex justify-between items-start gap-4 mb-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
          {trip.name}
        </h1>
        <div className="text-lg md:text-xl font-semibold text-yellow-500 whitespace-nowrap">
          ⭐ {trip.rating}
        </div>
      </div>

      {/* Row 2: Info Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs md:text-sm font-medium">
          📍 {trip.destination}
        </div>
        <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs md:text-sm font-medium">
          ⏱ {trip.duration} days
        </div>
        <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs md:text-sm font-medium">
          📅 {formatDate(trip.startDate)} → {formatDate(trip.endDate || trip.startDate)}
        </div>
        <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs md:text-sm font-medium">
          🌤️ {trip.season.charAt(0).toUpperCase() + trip.season.slice(1)}
        </div>
      </div>

      {/* Row 3: Tags */}
      {trip.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {trip.tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export { TripDetailTitle }
