import type { TripDetail } from '../../types/trip'

interface TripDetailCreatorProps {
  trip: TripDetail
}

const TripDetailCreator = ({ trip }: TripDetailCreatorProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
        {/* Submitted By */}
        <div>
          <p className="text-xs text-gray-600 uppercase font-semibold">✍️ Submitted by</p>
          <p className="text-gray-900 font-semibold text-sm mt-2">{trip.createdBy}</p>
        </div>

        {/* Added On */}
        <div>
          <p className="text-xs text-gray-600 uppercase font-semibold">📅 Added on</p>
          <p className="text-gray-900 font-semibold text-sm mt-2">{formatDate(trip.createdAt)}</p>
        </div>
      </div>
    </div>
  )
}

export { TripDetailCreator }
