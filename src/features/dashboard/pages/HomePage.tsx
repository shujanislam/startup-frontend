import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'
import { TripCard } from '../components/TripCard'
import { FeaturedTripCard } from '../components/FeaturedTripCard'
import type { SortType, SeasonType } from '../types/trip'
import { featuredTrip, allTrips } from '../data/mockTrips'

const HomePage = () => {
  const navigate = useNavigate()
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onSortChange={handleSortChange}
          onSeasonChange={handleSeasonChange}
          onBudgetChange={handleBudgetChange}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          {/* Featured Section */}
          <section className="px-6 md:px-8 pt-8 pb-0 max-w-5xl mx-auto w-full">
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              ⭐ Featured This Season
            </p>
            <FeaturedTripCard trip={featuredTrip} onClick={() => navigate(`/trip/${featuredTrip.id}`)} />
          </section>

          {/* All Trips Section */}
          <section className="px-6 md:px-8 py-8 max-w-5xl mx-auto w-full">
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="text-3xl font-bold text-gray-900">All Trips</h2>
              <span className="text-sm font-medium text-gray-500">
                ({filteredAndSortedTrips.length} found)
              </span>
            </div>

            {filteredAndSortedTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} onClick={() => navigate(`/trip/${trip.id}`)} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-96 text-center">
                <div className="text-5xl mb-4">🗺️</div>
                <p className="text-lg font-semibold text-gray-700 mb-2">No trips found</p>
                <p className="text-sm text-gray-500">Try changing your filters</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export { HomePage }
