import { Link } from 'react-router-dom'
import { useState } from 'react'

interface AuthFormProps {
  mode: 'login' | 'signup'
  isLoading: boolean
  errorMessage: string | null
  onSubmit: (email: string, password: string) => Promise<void>
  onGoogleSignIn: () => Promise<void>
}

const AuthForm = ({
  mode,
  isLoading,
  errorMessage,
  onSubmit,
  onGoogleSignIn,
}: AuthFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const isLogin = mode === 'login'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit(email, password)
  }

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <p className="auth-kicker">Startup Platform</p>
        <h1>{isLogin ? 'Welcome back' : 'Create your account'}</h1>
        <p className="auth-subtitle">
          {isLogin
            ? 'Log in to continue to your dashboard.'
            : 'Sign up to access the secured app area.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            placeholder="At least 6 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
          />

          {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLogin ? 'Sign in with Email' : 'Create account'}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <button
          type="button"
          className="btn-outline"
          onClick={() => void onGoogleSignIn()}
          disabled={isLoading}
        >
          Continue with Google
        </button>

        <p className="auth-meta">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <Link to={isLogin ? '/signup' : '/login'}>
            {isLogin ? 'Sign up' : 'Log in'}
          </Link>
        </p>
      </div>
    </section>
  )
}

export { AuthForm }