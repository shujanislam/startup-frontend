import { useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import '../styles/navbar.css'

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
    <nav className="navbar">
      <div className="navbar-container">
        {/* LEFT: Logo */}
        <div className="navbar-left">
          <div className="logo">
            <span className="logo-emoji">🗺️</span>
            <span className="logo-text">BudgetYatra</span>
          </div>
        </div>

        {/* CENTER: Search Bar */}
        <div className="navbar-center">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* RIGHT: Submit Button + Avatar */}
        <div className="navbar-right">
          <button type="button" className="submit-trip-btn" onClick={onSubmitTrip}>
            + Submit Trip
          </button>

          <div className="user-avatar">
            <span className="avatar-text">{getInitials(user?.email)}</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export { Navbar }
