import { useState } from 'react'
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
  isAdmin = false,
}: NavbarProps) => {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

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
    <nav className="sticky top-0 w-full h-16 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="flex items-center justify-between h-full px-4 md:px-6 gap-4 max-w-6xl mx-auto">
        {/* LEFT: Logo + Hamburger */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🗺️</span>
            <span className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">BudgetYatra</span>
          </div>
        </div>

        {/* CENTER: Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-xs mx-4">
          <div className="relative w-full flex items-center bg-gray-100 rounded-full px-4 py-2 border border-gray-200 transition-all focus-within:bg-white focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
            <span className="text-base mr-2 text-gray-600 flex-shrink-0">🔍</span>
            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Mobile Search Toggle */}
        <button
          type="button"
          className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          aria-label="Toggle search"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* RIGHT: Desktop Actions */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          {isAdmin && (
            <div className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 whitespace-nowrap">
              Admin User
            </div>
          )}

          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium transition-all hover:bg-blue-700 hover:shadow-md active:scale-98 whitespace-nowrap"
            onClick={onSubmitTrip}
          >
            + Submit Trip
          </button>

          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all hover:bg-gray-300 hover:border-2 hover:border-gray-400 border-2 border-transparent">
            <span className="text-xs font-semibold text-gray-700">
              {getInitials(user?.email)}
            </span>
          </div>

          <button
            type="button"
            className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium transition-all hover:bg-black hover:shadow-md active:scale-98 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={onLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 border-t border-gray-100">
          <div className="relative w-full flex items-center bg-gray-100 rounded-full px-4 py-2 border border-gray-200 mt-3">
            <span className="text-base mr-2 text-gray-600 flex-shrink-0">🔍</span>
            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={handleSearch}
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 px-4 py-4 space-y-3">
          <button
            type="button"
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium transition-all hover:bg-blue-700 active:scale-98"
            onClick={() => {
              setMobileMenuOpen(false)
              onSubmitTrip?.()
            }}
          >
            + Submit Trip
          </button>

          <div className="flex items-center gap-3 py-2 px-1">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 border-2 border-transparent">
              <span className="text-xs font-semibold text-gray-700">
                {getInitials(user?.email)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.email || 'User'}</p>
            </div>
          </div>

          {isAdmin && (
            <div className="w-full px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-sm font-semibold text-amber-800">
              Admin User Active
            </div>
          )}

          <button
            type="button"
            className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg text-sm font-medium transition-all hover:bg-black active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={() => {
              setMobileMenuOpen(false)
              onLogout?.()
            }}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      )}
    </nav>
  )
}

export { Navbar }
