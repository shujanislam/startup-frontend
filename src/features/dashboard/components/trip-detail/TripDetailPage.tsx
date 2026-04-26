import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { TripDetail } from '../../types/trip'
import { fetchPackageById } from '../../services/packageApi'
import { TripDetailHero } from './TripDetailHero'
import { TripDetailTitle } from './TripDetailTitle'
import { TripDetailOverview } from './TripDetailOverview'
import { TripDetailSpots } from './TripDetailSpots'
import { TripDetailHotels } from './TripDetailHotels'
import { TripDetailVehicles } from './TripDetailVehicles'
import { TripDetailLinks } from './TripDetailLinks'
import { TripDetailAdditional } from './TripDetailAdditional'
import { TripDetailCreator } from './TripDetailCreator'
import { TripDetailBottomBar } from './TripDetailBottomBar'

interface TripDetailPageProps {
  tripId: string
}

const TripDetailPage = ({ tripId }: TripDetailPageProps) => {
  const navigate = useNavigate()
  const [trip, setTrip] = useState<TripDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleBack = () => {
    navigate('/home')
  }

  useEffect(() => {
    const loadTrip = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchPackageById(tripId)
        if (!data) {
          setError('Trip not found')
        } else {
          setTrip(data)
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
      <TripDetailHero trip={trip} onBack={handleBack} />
      <div className="max-w-3xl mx-auto w-full px-4 md:px-6 lg:px-8">
        <TripDetailTitle trip={trip} />
        <TripDetailOverview trip={trip} />
        <TripDetailSpots trip={trip} />
        <TripDetailHotels trip={trip} />
        <TripDetailVehicles trip={trip} />
        <TripDetailLinks trip={trip} />
        <TripDetailAdditional trip={trip} />
        <TripDetailCreator trip={trip} />
      </div>
      <TripDetailBottomBar trip={trip} />
    </div>
  )
}

export { TripDetailPage }
