import { ProtectedRoute } from '../features/auth/components/ProtectedRoute.tsx'
import { ProfilePage } from '../features/dashboard/pages/ProfilePage.tsx'

const ProfileRoute = () => {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  )
}

export default ProfileRoute
