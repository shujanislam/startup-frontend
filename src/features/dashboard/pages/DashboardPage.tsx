import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth.ts'
import { logoutUser } from '../../auth/services/authService.ts'
import { fetchCurrentUser } from '../services/dashboardApi.ts'
import '../dashboard.css'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [backendUid, setBackendUid] = useState<string>('')
  const [backendEmail, setBackendEmail] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState('Loading your account data...')

  useEffect(() => {
    const loadCurrentUser = async () => {
      setIsLoading(true)

      try {
        const response = await fetchCurrentUser()
        setBackendUid(response.user.uid)
        setBackendEmail(response.user.email)
        setStatusMessage('Your session is active and verified by the backend.')
      } catch (error) {
        setStatusMessage(
          error instanceof Error
            ? error.message
            : 'Unable to load account data from the server.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadCurrentUser()
  }, [])

  const handleSignOut = async () => {
    setIsLoading(true)

    try {
      await logoutUser()
      navigate('/login', { replace: true })
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to sign out.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-card">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">
          Signed in as <strong>{user?.email || user?.uid}</strong>
        </p>
        <p className="dashboard-subtitle">
          Backend user: <strong>{backendEmail || backendUid || 'Loading...'}</strong>
        </p>

        <div className="dashboard-actions">
          <button
            type="button"
            className="btn-signout"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            Sign out
          </button>
        </div>

        <p className="dashboard-status">{statusMessage}</p>
      </section>
    </main>
  )
}

export { DashboardPage }