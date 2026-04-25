export type SortType = 'all' | 'popular' | 'cheapest' | 'newest' | 'shortest'
export type SeasonType = 'all' | 'summer' | 'winter' | 'monsoon' | 'autumn'

export interface Trip {
  id: string
  name: string
  description: string
  destination: string
  duration: number // in days
  startDate: string // YYYY-MM-DD format
  price: number // in rupees
  season: SeasonType
  tags: string[]
  rating: number // 0-5
  imageUrl: string
  isFeatured?: boolean
}

export interface FeaturedTrip extends Trip {
  badge: string
}

export interface FilterState {
  sortBy: SortType
  season: SeasonType
  maxBudget: number
  searchQuery: string
}
