import { useState, useMemo } from 'react'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'
import { TripCard } from '../components/TripCard'
import { FeaturedTripCard } from '../components/FeaturedTripCard'
import type { SortType, SeasonType } from '../types/trip'
import { featuredTrip, allTrips } from '../data/mockTrips'
import '../styles/home.css'

const HomePage = () => {
  const [sortBy, setSortBy] = useState<SortType>('all')
  const [season, setSeason] = useState<SeasonType>('all')
  const [maxBudget, setMaxBudget] = useState(10000)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter and sort trips
  const filteredAndSortedTrips = useMemo(() => {
    let filtered = [...allTrips]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (trip) =>
          trip.name.toLowerCase().includes(query) ||
          trip.destination.toLowerCase().includes(query) ||
          trip.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Apply season filter
    if (season !== 'all') {
      filtered = filtered.filter((trip) => trip.season === season)
    }

    // Apply budget filter
    filtered = filtered.filter((trip) => trip.price <= maxBudget)

    // Apply sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'cheapest':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        break
      case 'shortest':
        filtered.sort((a, b) => a.duration - b.duration)
        break
      case 'all':
      default:
        // Keep original order
        break
    }

    return filtered
  }, [sortBy, season, maxBudget, searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleSortChange = (newSort: SortType) => {
    setSortBy(newSort)
  }

  const handleSeasonChange = (newSeason: SeasonType) => {
    setSeason(newSeason)
  }

  const handleBudgetChange = (budget: number) => {
    setMaxBudget(budget)
  }

  return (
    <div className="home-page">
      <Navbar onSearch={handleSearch} />

      <div className="home-container">
        <Sidebar
          onSortChange={handleSortChange}
          onSeasonChange={handleSeasonChange}
          onBudgetChange={handleBudgetChange}
        />

        <main className="home-content">
          {/* Featured Section */}
          <section className="featured-section">
            <p className="featured-label">⭐ Featured This Season</p>
            <FeaturedTripCard trip={featuredTrip} />
          </section>

          {/* All Trips Section */}
          <section className="all-trips-section">
            <div className="section-header">
              <h2 className="section-title">All Trips</h2>
              <span className="trips-count">({filteredAndSortedTrips.length} found)</span>
            </div>

            {filteredAndSortedTrips.length > 0 ? (
              <div className="trips-grid">
                {filteredAndSortedTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🗺️</div>
                <p className="empty-title">No trips found</p>
                <p className="empty-subtitle">Try changing your filters</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export { HomePage }
