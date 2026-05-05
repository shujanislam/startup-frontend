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
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-slate-200 border-l-[3px] border-l-blue-500 bg-blue-50/40 p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-gray-300 bg-white text-gray-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 6.75h8M8 12h8m-8 5.25h5M5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v13.5A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V5.25A2.25 2.25 0 0 1 5.25 3Z" />
            </svg>
          </span>
          <h2 className="text-base font-semibold text-gray-900">Trip Overview</h2>
        </div>

        <div className="space-y-2">
          {[
            ['Destination', trip.destination],
            ['Duration', `${trip.duration} days`],
            ['Budget', formatPrice(trip.price)],
            ['Season', trip.season.charAt(0).toUpperCase() + trip.season.slice(1)],
            ['Start Date', formatDate(trip.startDate)],
            ['End Date', formatDate(trip.endDate || trip.startDate)],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
              <span className="text-xs font-medium text-[#94a3b8] md:text-sm">{label}</span>
              <span className="text-xs font-semibold text-[#0f172a] md:text-sm">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 border-l-[3px] border-l-orange-400 bg-orange-50/40 p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-gray-300 bg-white text-gray-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </span>
          <h2 className="text-base font-semibold text-gray-900">Requirements</h2>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
            <p className="text-xs font-medium text-[#94a3b8]">Identification</p>
            <p className="mt-1 text-sm font-semibold text-[#0f172a]">
              {trip.identification ? 'Carry ID proof' : 'No ID required'}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
            <p className="text-xs font-medium text-[#94a3b8]">Permit</p>
            <p className="mt-1 text-sm font-semibold text-[#0f172a]">{trip.permit}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export { TripDetailOverview }
