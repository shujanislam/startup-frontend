import { ProtectedRoute } from '../features/auth/components/ProtectedRoute.tsx'

import { DashboardPage } from '../features/dashboard/pages/DashboardPage.tsx'

const DashboardRoute = () => {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  )
}

export default DashboardRoute