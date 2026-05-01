import type { TripDetail } from '../../types/trip'

interface TripDetailAdditionalProps {
  trip: TripDetail
}

const TripDetailAdditional = ({ trip }: TripDetailAdditionalProps) => {
  if (!trip.additional) {
    return null
  }

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full border border-gray-300 bg-white text-gray-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v3.75m0 3h.008v.008H12v-.008ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </span>
        <h2 className="text-base font-semibold text-gray-900">Additional Information</h2>
      </div>
      <p className="text-sm leading-7 text-gray-700">{trip.additional}</p>
    </div>
  )
}

export { TripDetailAdditional }
