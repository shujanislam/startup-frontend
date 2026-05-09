import { Link } from 'react-router-dom'
import { useState } from 'react'
import heroImage from '../../../assets/pikachu.jpg'
import logoBlack from '../../../assets/logo-black.png'

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

  const inputClassName =
    'w-full rounded-2xl border border-white/35 bg-white/15 px-4 py-3.5 mt-2 mb-2 text-md text-white shadow-inner outline-none transition placeholder:text-white/70 focus:border-white/70 focus:ring-4 focus:ring-white/30 lg:rounded-md lg:border-slate-200 lg:bg-white lg:text-slate-900 lg:placeholder:text-slate-400 lg:focus:border-blue-600 lg:focus:ring-blue-100'

  const buttonClassName =
    'w-full rounded-2xl px-4 py-4 text-md font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 lg:rounded-md'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit(email.trim(), password.trim())
  }

  return (
    <section className="relative grid min-h-screen place-items-center px-3 py-4 sm:px-5 sm:py-7">

      {/* 🔥 MOBILE BACKGROUND IMAGE ONLY */}
      <div
        className="fixed inset-0 -z-20 scale-105 blur-[5px] lg:hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="fixed inset-0 -z-10 bg-black/40 lg:hidden" />

      <div className="grid w-full max-w-6xl overflow-hidden lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:rounded-[30px] lg:border lg:border-slate-200/70 lg:shadow-[0_30px_80px_rgba(15,23,42,0.12)]">

        {/* 🔥 LEFT IMAGE (DESKTOP ONLY) */}
        <aside className="relative hidden min-h-155 overflow-hidden bg-slate-900 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={heroImage}
            alt="Illustration"
          />
        </aside>

        {/* 🔥 FORM */}
        <div
          className="
            grid -translate-y-4 content-center p-6 sm:p-8 lg:translate-y-0 lg:p-14
            bg-transparent text-white
            lg:bg-white/95 lg:text-slate-900
          "
        >
          <div className="mb-4 flex justify-center lg:hidden">
            <img src={logoBlack} alt="Alpine" className="h-15 w-auto" />
          </div>
          <h1 className="mb-4 text-center text-4xl font-medium font-display leading-tight text-white sm:text-5xl lg:text-left lg:text-slate-900">
            {isLogin ? (
              <>
                Hey, <br /> <span className="whitespace-nowrap">Login now!</span>
              </>
            ) : (
              <>
                Hey, <br /> <span className="whitespace-nowrap">Create account!</span>
              </>
            )}
          </h1>

          <form className="grid gap-3" onSubmit={handleSubmit}>
            <input
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClassName}
            />

            <input
              type="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className={inputClassName}
            />

            {errorMessage && (
              <p className="text-sm text-red-200 lg:text-red-600">{errorMessage}</p>
            )}

            <div className="text-sm text-white/80 lg:text-gray-500">
              Forgot Password? /{' '}
              <span className="underline cursor-pointer">Reset</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`${buttonClassName} bg-linear-to-r from-gray-950 to-gray-700 text-white shadow-lg hover:scale-[1.01]`}
            >
              {isLoading
                ? 'Please wait...'
                : isLogin
                ? 'Sign In'
                : 'Sign Up'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-center text-xs text-white/70 lg:text-slate-400">
            <span className="h-px flex-1 bg-white/30 lg:bg-slate-200" />
            <span>or</span>
            <span className="h-px flex-1 bg-white/30 lg:bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={onGoogleSignIn}
            disabled={isLoading}
            className={`${buttonClassName} border border-white/40 bg-white/15 text-white hover:bg-white/25 lg:border-slate-200 lg:bg-white lg:text-slate-900 lg:hover:bg-slate-50`}
          >
            Continue with Google
          </button>

          <p className="mt-5 text-center text-sm text-white/80 lg:text-slate-500">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <Link
              className="font-semibold text-white hover:text-white lg:text-gray-950 lg:hover:text-gray-950"
              to={isLogin ? '/signup' : '/login'}
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export { AuthForm }