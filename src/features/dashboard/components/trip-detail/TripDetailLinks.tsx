import type { TripDetail } from '../../types/trip'

interface TripDetailLinksProps {
  trip: TripDetail
}

const TripDetailLinks = ({ trip }: TripDetailLinksProps) => {
  if (trip.affiliateLinks.length === 0) {
    return null
  }

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full border border-gray-300 bg-white text-gray-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m13.5 10.5 6-6m0 0h-4.5m4.5 0V9m-9 6-6 6m0 0H9m-4.5 0v-4.5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.25 6.75h-1.5A2.25 2.25 0 0 0 4.5 9v8.25a2.25 2.25 0 0 0 2.25 2.25H15a2.25 2.25 0 0 0 2.25-2.25v-1.5" />
          </svg>
        </span>
        <h2 className="text-base font-semibold text-gray-900">Useful Links</h2>
      </div>
      <div className="flex flex-col gap-2">
        {trip.affiliateLinks.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-gray-300 hover:bg-white"
          >
            <span className="truncate">{link.title}</span>
            <span className="ml-2 inline-block text-gray-500 transition-transform group-hover:translate-x-0.5">
              ↗
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

export { TripDetailLinks }
