import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { TripDetail } from '../../types/trip'
import {
  fetchPackageById,
  fetchRevealedPackageIds,
  likePackage,
  revealPackage,
} from '../../services/packageApi'
import { TripDetailHero } from './TripDetailHero'
import { TripDetailTitle } from './TripDetailTitle'
import { TripDetailOverview } from './TripDetailOverview'
import { TripDetailSpots } from './TripDetailSpots'
import { TripDetailHotels } from './TripDetailHotels'
import { TripDetailVehicles } from './TripDetailVehicles'
import { TripDetailLinks } from './TripDetailLinks'
import { TripDetailAdditional } from './TripDetailAdditional'
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
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  const handleBack = () => {
    navigate('/home')
  }

  useEffect(() => {
    const loadTrip = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [data, revealedIds] = await Promise.all([
          fetchPackageById(tripId),
          fetchRevealedPackageIds(),
        ])

        if (!data) {
          setError('Trip not found')
        } else {
          setTrip(data)
          setIsRevealed(revealedIds.includes(tripId))
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load trip details'
        setError(msg)
      } finally {
        setIsLoading(false)
      }
    }
    loadTrip()
  }, [tripId])

  const handleUnlockTrip = async () => {
    if (isRevealed || isUnlocking) {
      return
    }

    setUnlockError(null)
    setIsUnlocking(true)

    try {
      await revealPackage(tripId)
      setIsRevealed(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to unlock trip details'
      setUnlockError(msg)
    } finally {
      setIsUnlocking(false)
    }
  }

  const handleLikeTrip = async () => {
    if (isLiked || isLiking) {
      return
    }

    setLikeError(null)
    setIsLiking(true)

    try {
      const result = await likePackage(tripId)
      setIsLiked(true)

      if (result.alreadyLiked) {
        setLikeError('You have already liked this trip.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to like this trip'
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <TripDetailHero
        trip={trip}
        onBack={handleBack}
        isLiked={isLiked}
        isLiking={isLiking}
        onLikeTrip={handleLikeTrip}
      />
      <div className="relative z-10 -mt-6 rounded-t-3xl bg-gray-50 pt-4 md:mx-auto md:mt-0 md:max-w-4xl md:rounded-none md:bg-transparent md:pt-0">
        <div className="max-w-3xl mx-auto w-full px-4 md:px-6 lg:px-8">
        <TripDetailTitle trip={trip} />
        <TripDetailOverview trip={trip} />
        <TripDetailSpots trip={trip} />
        <TripDetailAdditional trip={trip} />
        <TripDetailHotels trip={trip} isRevealed={isRevealed} />
        <TripDetailVehicles trip={trip} isRevealed={isRevealed} />
        <TripDetailLinks trip={trip} />
        <TripDetailCreator trip={trip} />
        <TripDetailReviews packageId={trip.id} isRevealed={isRevealed} />
        {unlockError && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {unlockError}
          </p>
        )}
        {likeError && (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            {likeError}
          </p>
        )}
        </div>
      </div>
      <TripDetailBottomBar
        trip={trip}
        isRevealed={isRevealed}
        isUnlocking={isUnlocking}
        onUnlockTrip={handleUnlockTrip}
      />
    </div>
  )
}

export { TripDetailPage }
