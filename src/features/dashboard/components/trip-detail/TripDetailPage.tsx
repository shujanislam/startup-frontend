import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { TripDetail } from '../../types/trip'
import {
  fetchPackageById,
  fetchLikedPackageIds,
  likePackage,
  revealPackage,
  unlikePackage,
} from '../../services/packageApi'
import { TripDetailHero } from './TripDetailHero'
import { TripDetailHotels } from './TripDetailHotels'
import { TripDetailVehicles } from './TripDetailVehicles'
import { TripDetailLinks } from './TripDetailLinks'
import { TripDetailCreator } from './TripDetailCreator'
import { TripDetailReviews } from './TripDetailReviews'
import { TripDetailBottomBar } from './TripDetailBottomBar'

interface TripDetailPageProps {
  tripId: string
}

const TripDetailPage = ({ tripId }: TripDetailPageProps) => {
  const navigate = useNavigate()
  const [trip, setTrip] = useState<TripDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unlockError, setUnlockError] = useState<string | null>(null)
  const [likeError, setLikeError] = useState<string | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [canViewSensitive, setCanViewSensitive] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  const handleBack = () => {
    navigate('/home')
  }

  useEffect(() => {
    let isMounted = true

    const loadTrip = async () => {
      setIsLoading(true)
      setError(null)
      setLikeError(null)
      setIsLiked(false)

      try {
        const [tripResponse, likedIdsResponse] = await Promise.allSettled([
          fetchPackageById(tripId),
          fetchLikedPackageIds(),
        ])

        if (!isMounted) {
          return
        }

        if (tripResponse.status === 'rejected') {
          const msg = tripResponse.reason instanceof Error
            ? tripResponse.reason.message
            : 'Failed to load trip details'
          setError(msg)
          return
        }

        const response = tripResponse.value

        if (!response.data) {
          setError('Trip not found')
        } else {
          setTrip(response.data)
          setIsRevealed(response.isRevealed)
          setCanViewSensitive(response.canViewSensitive)
        }

        if (likedIdsResponse.status === 'fulfilled') {
          setIsLiked(likedIdsResponse.value.includes(tripId))
        }
      } catch (err: unknown) {
        if (!isMounted) {
          return
        }

        const msg = err instanceof Error ? err.message : 'Failed to load trip details'
        setError(msg)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadTrip()

    return () => {
      isMounted = false
    }
  }, [tripId])

  const handleUnlockTrip = async () => {
    if (isRevealed || isUnlocking) {
      return
    }

    setUnlockError(null)
    setIsUnlocking(true)

    try {
      await revealPackage(tripId)

      const refreshed = await fetchPackageById(tripId)
      setTrip(refreshed.data)
      setIsRevealed(refreshed.isRevealed)
      setCanViewSensitive(refreshed.canViewSensitive)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to unlock trip details'
      setUnlockError(msg)
    } finally {
      setIsUnlocking(false)
    }
  }

  const handleLikeTrip = async () => {
    if (isLiking) {
      return
    }

    setLikeError(null)
    setIsLiking(true)

    try {
      if (isLiked) {
        await unlikePackage(tripId)
        setIsLiked(false)
        return
      }

      const result = await likePackage(tripId)
      setIsLiked(true)

      if (result.alreadyLiked) {
        setLikeError('You have already liked this trip.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update this trip'
      setLikeError(msg)
    } finally {
      setIsLiking(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading trip details...</p>
        </div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🗺️</div>
          <p className="text-xl font-semibold text-gray-900 mb-2">
            {error?.includes('not found') ? 'Trip not found' : 'Something went wrong'}
          </p>
          <p className="text-gray-600 mb-6 text-sm">{error || 'The trip you are looking for does not exist.'}</p>
          <button
            type="button"
            onClick={handleBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold text-sm transition-all"
          >
            Go Back to Trips
          </button>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => `₹${price.toLocaleString()}`

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const dateRange = trip.endDate
    ? `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`
    : formatDate(trip.startDate)

  const facilities = [
    trip.hotels.length > 0
      ? `${trip.hotels.length} accommodation option${trip.hotels.length === 1 ? '' : 's'}`
      : null,
    trip.vehicles.length > 0
      ? `${trip.vehicles.length} transport option${trip.vehicles.length === 1 ? '' : 's'}`
      : null,
    trip.identification ? 'Government ID required' : 'No ID required',
    trip.permit ? `Permit: ${trip.permit}` : null,
  ].filter(Boolean)

  return (
    <div className="flex min-h-screen flex-col bg-white pb-24">
      <TripDetailHero
        trip={trip}
        onBack={handleBack}
        isLiked={isLiked}
        isLiking={isLiking}
        onLikeTrip={handleLikeTrip}
      />

      <main className="w-full px-6 pb-16 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        {likeError && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {likeError}
          </div>
        )}

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Description</p>
              <p className="mt-3 text-base leading-7 text-slate-600">{trip.description}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Activities</p>
              {trip.spots.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {trip.spots.map((spot) => (
                    <div key={spot} className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-slate-900" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{spot}</p>
                        {!isRevealed && (
                          <p className="mt-1 text-sm text-slate-500">Details will be shared after unlock.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">Activities will be shared soon.</p>
              )}
            </div>

            {trip.additional && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Additional</p>
                <p className="mt-3 text-base leading-7 text-slate-600">{trip.additional}</p>
              </div>
            )}

            <div className="space-y-6">
              <TripDetailHotels trip={trip} isRevealed={canViewSensitive} />
              <TripDetailVehicles trip={trip} isRevealed={canViewSensitive} />
              <TripDetailLinks trip={trip} />
              <TripDetailCreator trip={trip} />
            </div>

            <TripDetailReviews packageId={trip.id} isRevealed={isRevealed} />
          </section>

          <aside className="space-y-6">
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Starting at</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-slate-950">{formatPrice(trip.price)}</span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} aria-hidden="true">★</span>
                  ))}
                </div>
                <span>{trip.rating > 0 ? `${trip.rating.toFixed(1)}/5 Reviews` : 'New trip'}</span>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Dates</p>
                <div className="mt-3 grid gap-2">
                  <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    {dateRange}
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Facilities</p>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  {facilities.length > 0 ? (
                    facilities.map((facility) => (
                      <div key={facility} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-slate-400" />
                        <span>{facility}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">Facilities will be shared after unlock.</p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleUnlockTrip}
                disabled={isRevealed || isUnlocking}
                className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${
                  isRevealed
                    ? 'bg-emerald-600'
                    : isUnlocking
                      ? 'bg-slate-600'
                      : 'bg-slate-900 hover:bg-slate-800'
                } disabled:cursor-not-allowed`}
              >
                {isRevealed ? 'Trip Unlocked' : isUnlocking ? 'Unlocking...' : 'Unlock Trip'}
              </button>

              {!isRevealed && (
                <p className="mt-3 text-xs text-slate-500">
                  Unlock to view accommodation, transport, and contact details.
                </p>
              )}

              {unlockError && (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {unlockError}
                </p>
              )}
            </div>
          </aside>
        </div>
      </main>

      <TripDetailBottomBar
        isRevealed={isRevealed}
        isUnlocking={isUnlocking}
        onUnlockTrip={handleUnlockTrip}
      />
    </div>
  )
}

export { TripDetailPage }
