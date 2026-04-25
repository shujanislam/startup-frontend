import { ProtectedRoute } from '../features/auth/components/ProtectedRoute.tsx'

import { HomePage } from '../features/dashboard/pages/HomePage.tsx'

const DashboardRoute = () => {
  return (
    <ProtectedRoute>
      <HomePage/>
    </ProtectedRoute>
  )
}

export default DashboardRoute