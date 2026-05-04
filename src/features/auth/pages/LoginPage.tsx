import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AuthForm } from '../components/AuthForm.tsx'
import { useAuth } from '../hooks/useAuth.ts'
import { loginWithEmailPassword, loginWithGoogle } from '../services/authService.ts'
import { loginBackendUser, syncBackendUser } from '../services/backendAuthService.ts'
import { fetchCurrentUser } from '../../dashboard/services/dashboardApi.ts'

const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unable to sign in right now. Please try again.'
}

const LoginPage = () => {
  const { user, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [redirectPath, setRedirectPath] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    if (loading || !user) {
      setRedirectPath(null)
      return () => {
        isMounted = false
      }
    }

    fetchCurrentUser()
      .then((response) => {
        if (!isMounted) return
        const completed = response.user.onboardingComplete === true
        setRedirectPath(completed ? '/home' : '/onboarding')
      })
      .catch(() => {
        if (!isMounted) return
        setRedirectPath('/home')
      })

    return () => {
      isMounted = false
    }
  }, [loading, user])

  if (!loading && user) {
    if (!redirectPath) {
      return (
        <main className="grid min-h-screen place-items-center bg-gray-50 px-4">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="text-sm text-gray-500">Loading your profile...</p>
          </div>
        </main>
      )
    }

    return <Navigate to={redirectPath} replace />
  }

  const handleEmailLogin = async (email: string, password: string) => {
    setErrorMessage(null)
    setIsLoading(true)

    try {
      await loginWithEmailPassword(email, password)
      await loginBackendUser({ email, password })
    } catch (error) {
      setErrorMessage(toErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setErrorMessage(null)
    setIsLoading(true)

    try {
      await loginWithGoogle()
      await syncBackendUser()
    } catch (error) {
      setErrorMessage(toErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthForm
      mode="login"
      isLoading={isLoading}
      errorMessage={errorMessage}
      onSubmit={handleEmailLogin}
      onGoogleSignIn={handleGoogleLogin}
    />
  )
}

export { LoginPage }
