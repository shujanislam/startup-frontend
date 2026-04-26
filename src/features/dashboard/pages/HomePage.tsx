import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'
import { TripCard } from '../components/TripCard'
import { FeaturedTripCard } from '../components/FeaturedTripCard'
import type { SortType, SeasonType, Trip } from '../types/trip'
import { discoverPackages, type DiscoverMeta } from '../services/packageApi'
import { useAuth } from '../../auth/hooks/useAuth'
import { logoutUser } from '../../auth/services/authService'

const HomePage = () => {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const [trips, setTrips] = useState<Trip[]>([])
  const [meta, setMeta] = useState<DiscoverMeta | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const [sortBy, setSortBy] = useState<SortType>('all')
  const [season, setSeason] = useState<SeasonType>('all')
  const [maxBudget, setMaxBudget] = useState(10000)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  const fetchTrips = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await discoverPackages({
        search: searchQuery || undefined,
        season: season !== 'all' ? season : undefined,
        maxBudget: maxBudget < 10000 ? maxBudget : undefined,
        sortBy,
        page: pageNum,
        limit: 12,
      })
      setTrips((prev) => (append ? [...prev, ...response.data] : response.data))
      setMeta(response.meta)
      setPage(pageNum)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load trips'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, season, maxBudget, sortBy])

  // Debounced fetch on filter/search changes (reset to page 1)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!authLoading) {
        fetchTrips(1, false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, season, maxBudget, sortBy, fetchTrips, authLoading])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, authLoading, navigate])

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

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logoutUser()
      navigate('/login', { replace: true })
    } catch {
      // ignore
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleSubmitTrip = () => {
    // TODO: open create trip modal
    navigate('/dashboard')
  }

  const handleLoadMore = () => {
    if (meta && page < meta.totalPages) {
      fetchTrips(page + 1, true)
    }
  }

  const featured = trips.length > 0 ? { ...trips[0], badge: '🔥 Featured', isFeatured: true } : null
  const remainingTrips = featured ? trips.slice(1) : trips

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Checking session...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar
        onSearch={handleSearch}
        onSubmitTrip={handleSubmitTrip}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onSortChange={handleSortChange}
          onSeasonChange={handleSeasonChange}
          onBudgetChange={handleBudgetChange}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50 pb-24">
          {/* Featured Section */}
          {featured && (
            <section className="px-4 md:px-6 lg:px-8 pt-6 md:pt-8 pb-0 max-w-5xl mx-auto w-full">
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 md:mb-4">
                ⭐ Featured This Season
              </p>
              <FeaturedTripCard
                trip={featured}
                onClick={() => navigate(`/trip/${featured.id}`)}
              />
            </section>
          )}

          {/* All Trips Section */}
          <section className="px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-5xl mx-auto w-full">
            <div className="flex items-baseline gap-3 mb-4 md:mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">All Trips</h2>
              {meta && (
                <span className="text-sm font-medium text-gray-500">
                  ({meta.total} found)
                </span>
              )}
            </div>

            {isLoading && trips.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-64 text-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm text-gray-500">Loading trips...</p>
              </div>
            )}

            {error && trips.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-64 text-center px-4">
                <div className="text-5xl mb-4">⚠️</div>
                <p className="text-lg font-semibold text-gray-700 mb-2">Something went wrong</p>
                <p className="text-sm text-gray-500 mb-4">{error}</p>
                <button
                  type="button"
                  onClick={() => fetchTrips(1, false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
                >
                  Try Again
                </button>
              </div>
            )}

            {!isLoading && !error && remainingTrips.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-64 text-center px-4">
                <div className="text-5xl mb-4">🗺️</div>
                <p className="text-lg font-semibold text-gray-700 mb-2">No trips found</p>
                <p className="text-sm text-gray-500">Try changing your filters</p>
              </div>
            )}

            {remainingTrips.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {remainingTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} onClick={() => navigate(`/trip/${trip.id}`)} />
                ))}
              </div>
            )}

            {/* Load More */}
            {meta && page < meta.totalPages && (
              <div className="flex justify-center mt-8">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Load More Trips'}
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export { HomePage }
