import { HomePage } from '../features/dashboard/pages/HomePage.tsx'
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute.tsx'

const Home = () => {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  )
}

export default Home
