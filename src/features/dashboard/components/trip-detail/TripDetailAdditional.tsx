import type { TripDetail } from '../../types/trip'

interface TripDetailAdditionalProps {
  trip: TripDetail
}

const TripDetailAdditional = ({ trip }: TripDetailAdditionalProps) => {
  if (!trip.additional) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 border-l-4 border-yellow-400">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">💡 Additional Information</h2>
      <p className="text-gray-700 leading-relaxed text-sm">{trip.additional}</p>
    </div>
  )
}

export { TripDetailAdditional }
