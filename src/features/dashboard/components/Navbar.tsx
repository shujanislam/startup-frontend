import { useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'

interface NavbarProps {
  onSearch?: (query: string) => void
  onSubmitTrip?: () => void
}

const Navbar = ({ onSearch, onSubmitTrip }: NavbarProps) => {
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
    <nav className="sticky top-0 w-full h-16 bg-white border-b border-gray-200 shadow-sm z-100">
      <div className="flex items-center justify-between h-full px-6 gap-6 max-w-6xl mx-auto">
        {/* LEFT: Logo */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🗺️</span>
            <span className="text-xl font-bold text-gray-900 tracking-tight">BudgetYatra</span>
          </div>
        </div>

        {/* CENTER: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xs">
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

        {/* RIGHT: Submit Button + Avatar */}
        <div className="flex items-center gap-4 flex-shrink-0">
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
        </div>
      </div>
    </nav>
  )
}

export { Navbar }
