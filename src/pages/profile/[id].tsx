import { ProtectedRoute } from '../../features/auth/components/ProtectedRoute.tsx'
import { ProfilePage } from '../../features/dashboard/pages/ProfilePage.tsx'

const ProfileByIdRoute = () => {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  )
}

export default ProfileByIdRoute
