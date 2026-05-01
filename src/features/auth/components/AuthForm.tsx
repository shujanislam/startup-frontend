import { Link } from 'react-router-dom'
import { useState } from 'react'
import heroImage from '../../../assets/Instagram.jpeg'

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
    'w-full rounded-md border border-slate-200 bg-white px-4 py-3.5 mt-2 mb-2 text-md text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100'

  const buttonClassName =
    'w-full rounded-md px-4 py-4 text-md font-semibold transition disabled:cursor-not-allowed disabled:opacity-60'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit(email.trim(), password.trim())
  }

  return (
    <section className="relative grid min-h-screen place-items-center px-3 py-4 sm:px-5 sm:py-7">

      {/* 🔥 MOBILE BACKGROUND IMAGE ONLY */}
      <div
        className="fixed inset-0 -z-10 lg:hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="grid w-full max-w-6xl overflow-hidden rounded-[22px] border border-slate-200/70 shadow-[0_30px_80px_rgba(15,23,42,0.12)] lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:rounded-[30px]">

        {/* 🔥 LEFT IMAGE (DESKTOP ONLY) */}
        <aside className="relative hidden min-h-[620px] overflow-hidden bg-slate-900 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={heroImage}
            alt="Illustration"
          />
        </aside>

        {/* 🔥 FORM */}
        <div
          className="
            grid content-center p-6 sm:p-8 lg:p-14
            bg-white/60 backdrop-blur-md border border-white/50 shadow-lg
            lg:bg-white/95 lg:backdrop-blur-none lg:border-none lg:shadow-none
          "
        >
          <h1 className="mb-4 text-6xl font-semibold font-display leading-tight text-slate-900">
            {isLogin ? (
              <>
                Hey, <br /> Login now!
              </>
            ) : (
              <>
                Hey, <br /> Create your account!
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
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}

            <div className="text-sm text-gray-500">
              Forgot Password? /{' '}
              <span className="underline cursor-pointer">Reset</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`${buttonClassName} bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:scale-[1.01]`}
            >
              {isLoading
                ? 'Please wait...'
                : isLogin
                ? 'Sign In'
                : 'Sign Up'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-center text-xs text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            <span>or</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={onGoogleSignIn}
            disabled={isLoading}
            className={`${buttonClassName} border border-slate-200 bg-white text-slate-900 hover:bg-slate-50`}
          >
            Continue with Google
          </button>

          <p className="mt-5 text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <Link
              className="font-semibold text-blue-600 hover:text-blue-700"
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