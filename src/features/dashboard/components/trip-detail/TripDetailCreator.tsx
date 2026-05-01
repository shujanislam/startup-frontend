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
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Submitted by</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{trip.createdBy}</p>
        </div>

        <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Added on</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{formatDate(trip.createdAt)}</p>
        </div>
      </div>
    </div>
  )
}

export { TripDetailCreator }
