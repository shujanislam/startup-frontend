import type { TripDetail } from '../../types/trip'

interface TripDetailTitleProps {
  trip: TripDetail
}

const TripDetailTitle = ({ trip }: TripDetailTitleProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8 md:mt-12 lg:mt-16">
      {/* Row 1: Title + Rating */}
      <div className="flex justify-between items-start gap-4 mb-4">
        <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
          {trip.name}
        </h1>
        <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3 py-1 text-base font-semibold text-gray-500 md:text-lg">
          <span className="text-gray-400">☆</span>
          <span className="text-gray-400">{trip.rating}</span>
        </div>
      </div>

      {/* Row 2: Info Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-600 md:text-sm">
          <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" />
            <circle cx="12" cy="10" r="2.5" strokeWidth={1.8} />
          </svg>
          {trip.destination}
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-600 md:text-sm">
          <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="8" strokeWidth={1.8} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l2.8 1.8" />
          </svg>
          {trip.duration} days
        </div>
      </div>

      {/* Row 3: Tags */}
      {/* {trip.tags.length > 0 && ( */}
      {/*   <div className="flex flex-wrap gap-2"> */}
      {/*     {trip.tags.map((tag) => ( */}
      {/*       <span */}
      {/*         key={tag} */}
      {/*         className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600" */}
      {/*       > */}
      {/*         {tag} */}
      {/*       </span> */}
      {/*     ))} */}
      {/*   </div> */}
      {/* )} */}

      <div className="mt-8 rounded-xl bg-gray-50">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-900">Description</p>
        <p className="mt-2 text-sm leading-6 text-gray-700">{trip.description}</p>
      </div>
    </div>
  )
}

export { TripDetailTitle }
