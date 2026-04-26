import { useParams } from 'react-router-dom'
import { TripDetailPage } from '../../features/dashboard/components/trip-detail/TripDetailPage'
import { ProtectedRoute } from '../../features/auth/components/ProtectedRoute'

const TripRoute = () => {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-900">Trip not found</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <TripDetailPage tripId={id} />
    </ProtectedRoute>
  )
}

export default TripRoute
