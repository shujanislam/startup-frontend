import type { TripDetail } from '../../types/trip'

interface TripDetailLinksProps {
  trip: TripDetail
}

const TripDetailLinks = ({ trip }: TripDetailLinksProps) => {
  if (trip.affiliateLinks.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">🔗 Useful Links</h2>
      <div className="flex flex-col gap-2">
        {trip.affiliateLinks.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium text-sm inline-block group"
          >
            {link.title}
            <span className="ml-1 group-hover:translate-x-1 transition-transform inline-block">
              ↗
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

export { TripDetailLinks }
