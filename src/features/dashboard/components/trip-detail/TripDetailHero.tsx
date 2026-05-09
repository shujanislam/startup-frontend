import type { TripDetail } from '../../types/trip'
import { useMemo, useState } from 'react'

interface TripDetailHeroProps {
  trip: TripDetail
  onBack: () => void
  isLiked: boolean
  isLiking: boolean
  onLikeTrip: () => void
}

const TripDetailHero = ({ trip, onBack, isLiked, isLiking, onLikeTrip }: TripDetailHeroProps) => {
  const [imageFailed, setImageFailed] = useState(false)

  const fallbackBackground = useMemo(() => {
    const palettes = [
      'from-blue-600 via-cyan-500 to-teal-400',
      'from-rose-500 via-orange-400 to-amber-300',
      'from-indigo-600 via-violet-500 to-purple-400',
      'from-emerald-600 via-green-500 to-lime-400',
    ]

    const hash = trip.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return palettes[hash % palettes.length]
  }, [trip.name])

  const baseImages = useMemo(() => {
    const images = [trip.imageUrl].filter((url) => url?.trim().length)
    return images
  }, [trip.imageUrl])

  const galleryImages = useMemo(() => baseImages.slice(0, 1), [baseImages])
  const hasUsableImage = galleryImages.length > 0 && !imageFailed
  const ratingLabel = trip.rating > 0 ? `${trip.rating.toFixed(1)}/5` : 'New'

  const renderImage = (src: string, className: string) => (
    <div className={`overflow-hidden rounded-3xl ${className}`}>
      <img
        src={src}
        alt={trip.name}
        onError={() => setImageFailed(true)}
        className="h-full w-full object-cover"
      />
    </div>
  )

  const renderGallery = () => {
    if (!hasUsableImage) {
      return (
        <div
          className={`flex min-h-70 items-center justify-center rounded-3xl bg-linear-to-br ${fallbackBackground}`}
        >
          <span className="px-4 text-center text-base font-semibold text-white/90 md:text-lg">
            {trip.destination}
          </span>
        </div>
      )
    }

    return renderImage(galleryImages[0], 'aspect-[16/9]')
  }

  return (
    <section className="w-full bg-white">
      <div className="w-full px-6 pb-6 pt-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
          >
            <span aria-hidden="true">←</span>
            Back to Trips
          </button>

          <button
            type="button"
            onClick={onLikeTrip}
            disabled={isLiking || isLiked}
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
            aria-label={isLiked ? 'Trip liked' : 'Like trip'}
            title={isLiked ? 'Trip liked' : 'Like trip'}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path
                d="M12 20.25s-6.75-4.35-9-8.1A5.35 5.35 0 0 1 12 6.3a5.35 5.35 0 0 1 9 5.85c-2.25 3.75-9 8.1-9 8.1Z"
                fill={isLiked ? 'currentColor' : 'none'}
              />
            </svg>
          </button>
        </div>

        <div className="mt-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            <span>Trip</span>
            <span aria-hidden="true">/</span>
            <span>{trip.destination}</span>
          </div>

          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h1 className="text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              {trip.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 md:justify-end">
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.5" strokeWidth={1.8} />
                </svg>
                {trip.destination}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="8" strokeWidth={1.8} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l2.8 1.8" />
                </svg>
                {trip.duration} days
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                {ratingLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {renderGallery()}
        </div>
      </div>
    </section>
  )
}

export { TripDetailHero }
