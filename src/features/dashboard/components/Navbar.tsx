import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth.ts'
import { logoutUser } from '../../auth/services/authService.ts'
import '../styles/navbar.css'

interface NavbarProps {
  onSearch?: (query: string) => void
  logoSrc?: string
}

const Navbar = ({ onSearch, logoSrc = '/vite.svg' }: NavbarProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logoutUser()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <img src={logoSrc} alt="Logo" className="logo-img" />
          <span className="logo-text">TripPlanner</span>
        </div>

        {/* Search Bar Section */}
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search trips..."
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
          />
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          <span className="user-email">{user?.email || 'User'}</span>
          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </nav>
  )
}

export { Navbar }
