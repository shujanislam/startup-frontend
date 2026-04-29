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
    'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100'
  const buttonClassName =
    'w-full rounded-2xl px-4 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit(email, password)
  }

  return (
    <section className="grid min-h-screen place-items-center bg-linear-to-b from-slate-50 to-blue-50 px-3 py-4 sm:px-5 sm:py-7">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[22px] border border-slate-200/70 bg-white/85 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:rounded-[30px]">
        <aside className="relative hidden min-h-[620px] overflow-hidden bg-slate-900 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={heroImage}
            alt="Collaboration and product planning illustration"
          />
        </aside>

        <div className="grid content-center bg-white/95 p-6 sm:p-8 lg:p-14">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
          
          </p>
          <h1 className="mb-2 text-5xl font-serif leading-tight text-slate-900">
            {isLogin ? <>Hey, <br />Login now !</> : <>Hey, <br />Create account !</>}
          </h1>
          {/* <p className="mb-6 text-sm leading-6 text-slate-600">
            {isLogin
              ? 'Log in to continue to your dashboard.'
              : 'Sign up to access the secured app area.'}
          </p> */}

          <form className="grid gap-3" onSubmit={handleSubmit}>
            <label className="text-sm font-semibold text-slate-600" htmlFor="email">
            
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className={inputClassName}
            />

            <label className="text-sm font-semibold text-slate-600" htmlFor="password">
              
            </label>
            <input
              id="password"
              type="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              className={inputClassName}
            />

            {errorMessage ? (
              <p className="mt-0.5 text-sm text-red-700">{errorMessage}</p>
            ) : null}

            <button
              type="submit"
              className={`${buttonClassName} bg-linear-to-br from-blue-600 to-blue-500 text-white shadow-[0_12px_24px_rgba(37,99,235,0.28)] hover:-translate-y-px disabled:hover:translate-y-0`}
              disabled={isLoading}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-center text-xs text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            <span>or</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            className={`${buttonClassName} border border-slate-200 bg-white text-slate-900 hover:-translate-y-px hover:bg-slate-50 disabled:hover:translate-y-0`}
            onClick={() => void onGoogleSignIn()}
            disabled={isLoading}
          >
            Continue with Google
          </button>

          <p className="mt-5 text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <Link
              className="font-semibold text-blue-600 transition hover:text-blue-700"
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
