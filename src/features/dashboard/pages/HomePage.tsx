import { useState, useMemo } from 'react'
import { Navbar } from '../components/Navbar.tsx'
import { Sidebar } from '../components/Sidebar.tsx'
import { TripCard } from '../components/TripCard.tsx'
import '../styles/home.css'

type SortType = 'popular' | 'cheapest'

interface TripPlan {
  id: string
  name: string
  budget: number
  destination: string
  duration: number
  startDate: string
  rating: number
  imageUrl?: string
  tags?: string[]
}

// Mock data - replace with API call later
const mockTrips: TripPlan[] = [
  {
    id: '1',
    name: 'Paris Romantic Getaway',
    budget: 2500,
    destination: 'Paris, France',
    duration: 5,
    startDate: '2026-06-15',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop',
    tags: ['Romance', 'Culture', 'Food'],
  },
  {
    id: '2',
    name: 'Tokyo Adventure',
    budget: 1800,
    destination: 'Tokyo, Japan',
    duration: 7,
    startDate: '2026-07-20',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1540959375944-7049f642e8b4?w=400&h=300&fit=crop',
    tags: ['Adventure', 'Culture', 'Tech'],
  },
  {
    id: '3',
    name: 'Bali Beach Escape',
    budget: 1200,
    destination: 'Bali, Indonesia',
    duration: 6,
    startDate: '2026-08-10',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1537225228614-b4fad34a0b60?w=400&h=300&fit=crop',
    tags: ['Beach', 'Relaxation', 'Nature'],
  },
]

const HomePage = () => {
  const [sortType, setSortType] = useState<SortType>('popular')
  const [searchQuery, setSearchQuery] = useState('')

  const sortedAndFilteredTrips = useMemo(() => {
    let filtered = mockTrips.filter((trip) =>
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    if (sortType === 'cheapest') {
      filtered.sort((a, b) => a.budget - b.budget)
    } else {
      // popular - sort by rating
      filtered.sort((a, b) => b.rating - a.rating)
    }

    return filtered
  }, [sortType, searchQuery])

  const handleSortChange = (newSort: SortType) => {
    setSortType(newSort)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="home-page">
      <Navbar onSearch={handleSearch} />

      <div className="home-container">
        <Sidebar onSortChange={handleSortChange} />

        <main className="home-content">
          <section className="trips-section">
            <div className="trips-header">
              <h2 className="trips-title">Discover Trips</h2>
              <p className="trips-subtitle">
                {sortedAndFilteredTrips.length} trips available
              </p>
            </div>

            <div className="trips-grid">
              {sortedAndFilteredTrips.length > 0 ? (
                sortedAndFilteredTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))
              ) : (
                <div className="no-trips">
                  <p>No trips found matching your criteria</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export { HomePage }
