import { Navigate } from 'react-router-dom'
import { useState } from 'react'
import { AuthForm } from '../components/AuthForm.tsx'
import { useAuth } from '../hooks/useAuth.ts'
import { loginWithGoogle, signupWithEmailPassword } from '../services/authService.ts'
import '../auth.css'

const toErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unable to create your account right now. Please try again.'
}

const SignupPage = () => {
  const { user, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSignup = async (email: string, password: string) => {
    setErrorMessage(null)
    setIsLoading(true)

    try {
      await signupWithEmailPassword(email, password)
    } catch (error) {
      setErrorMessage(toErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
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
      mode="signup"
      isLoading={isLoading}
      errorMessage={errorMessage}
      onSubmit={handleSignup}
      onGoogleSignIn={handleGoogleSignup}
    />
  )
}

export { SignupPage }