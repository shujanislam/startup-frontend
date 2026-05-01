import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'

interface NavbarProps {
  onSearch?: (query: string) => void
  onSubmitTrip?: () => void
  onLogout?: () => void
  isLoggingOut?: boolean
  isAdmin?: boolean
}

const Navbar = ({
  onSearch,
  onSubmitTrip,
  onLogout,
  isLoggingOut = false,
}: NavbarProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const getInitials = (email?: string | null) => {
    if (!email) return '?'
    return email.split('@')[0].slice(0, 2).toUpperCase()
  }

  return (
    <nav className="relative z-50 isolate overflow-visible px-0 py-0">
      <div className="flex min-w-0 items-center justify-end gap-6 sm:gap-3">
          <label className="group/search relative mr-3 flex h-10 w-10 cursor-text items-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-300 ease-out hover:w-56 hover:border-blue-200 hover:bg-white hover:shadow-md focus-within:w-56 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 sm:hover:w-72 sm:focus-within:w-72">
            <svg className="ml-3 h-4 w-4 shrink-0 transition-colors group-hover/search:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
            </svg>
            <input
              type="search"
              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 opacity-0 outline-none transition-opacity duration-200 placeholder:text-slate-400 group-hover/search:opacity-100 group-focus-within/search:opacity-100"
              placeholder="Search destinations"
              value={searchQuery}
              onChange={handleSearch}
              aria-label="Search destinations"
            />
          </label>

          <button
            type="button"
            className="grid h-10 w-10 mr-3 shrink-0 place-items-center rounded-full bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
            onClick={onSubmitTrip}
            aria-label="Add new package"
            title="Add new package"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
            </svg>
          </button>

          <div className="group/profile relative z-50">
            <button
              type="button"
              className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-transparent bg-slate-200 text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-300 focus:border-blue-500 focus:outline-none"
              aria-label="Open profile menu"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
              ) : (
                <span>{getInitials(user?.email)}</span>
              )}
            </button>

            <div className="invisible absolute right-0 top-full z-60 mt-3 w-52 translate-y-2 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover/profile:visible group-hover/profile:translate-y-0 group-hover/profile:opacity-100 group-focus-within/profile:visible group-focus-within/profile:translate-y-0 group-focus-within/profile:opacity-100">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="truncate text-sm font-semibold text-slate-900">{user?.email || 'User'}</p>
                <p className="mt-0.5 text-xs text-slate-500">Account menu</p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0" />
                </svg>
                Go to profile
              </button>

              <button
                type="button"
                onClick={onLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3-3h8.25m0 0-3-3m3 3-3 3" />
                </svg>
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
      </div>
    </nav>
  )
}

export { Navbar }
