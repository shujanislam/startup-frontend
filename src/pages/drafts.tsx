import { ProtectedRoute } from '../features/auth/components/ProtectedRoute.tsx'
import { DraftsPage } from '../features/dashboard/pages/DraftsPage.tsx'

const DraftsRoute = () => {
  return (
    <ProtectedRoute>
      <DraftsPage />
    </ProtectedRoute>
  )
}

export default DraftsRoute
