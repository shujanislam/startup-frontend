import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth.ts'
import { logoutUser } from '../../auth/services/authService.ts'
import { fetchCurrentUser } from '../services/dashboardApi.ts'

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
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-50 to-slate-200 px-4 py-8">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-300/70 bg-white/95 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.14)] backdrop-blur">
        <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Dashboard</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Signed in as <strong>{user?.email || user?.uid}</strong>
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Backend user: <strong>{backendEmail || backendUid || 'Loading...'}</strong>
        </p>

        <div className="my-6 flex justify-end">
          <button
            type="button"
            className="rounded-full bg-linear-to-br from-slate-900 to-blue-700 px-5 py-3 text-sm font-bold text-white shadow-[0_16px_30px_rgba(29,78,216,0.22)] transition hover:-translate-y-px hover:shadow-[0_20px_34px_rgba(29,78,216,0.3)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            Sign out
          </button>
        </div>

        <p className="rounded-2xl bg-blue-50 px-4 py-4 text-sm leading-6 text-blue-900">
          {statusMessage}
        </p>
      </section>
    </main>
  )
}

export { DashboardPage }
