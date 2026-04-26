import { useNavigate } from 'react-router-dom'
import type { TripDetail } from '../../types/trip'
import { tripDetails } from '../../data/mockTrips'
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
  const trip = tripDetails[tripId] as TripDetail | undefined

  const handleBack = () => {
    navigate('/home')
  }

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🗺️</div>
          <p className="text-xl font-semibold text-gray-900 mb-2">Trip not found</p>
          <p className="text-gray-600 mb-6">The trip you're looking for doesn't exist.</p>
          <button
            type="button"
            onClick={handleBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
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
