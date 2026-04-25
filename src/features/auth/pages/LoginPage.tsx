import { Navigate } from 'react-router-dom'
import { useState } from 'react'
import { AuthForm } from '../components/AuthForm.tsx'
import { useAuth } from '../hooks/useAuth.ts'
import { loginWithEmailPassword, loginWithGoogle } from '../services/authService.ts'
import '../auth.css'

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

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleEmailLogin = async (email: string, password: string) => {
    setErrorMessage(null)
    setIsLoading(true)

    try {
      await loginWithEmailPassword(email, password)
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