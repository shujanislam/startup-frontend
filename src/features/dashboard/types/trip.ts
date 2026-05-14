export type SortType = 'all' | 'popular' | 'cheapest' | 'newest' | 'shortest'
export type SeasonType = 'all' | 'summer' | 'winter' | 'monsoon' | 'autumn'
export type PackageStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected'

export interface Hotel {
  id: string
  name: string
  address: string
  phone: string
  budget: number
}

export interface Vehicle {
  id: string
  name: string
  carNumber: string
  driverName: string
  driverPhone: string
  budget: number
}

export interface Link {
  title: string
  url: string
}

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

export interface TripDetail extends Trip {
  endDate?: string
  spots: string[]
  hotels: Hotel[]
  vehicles: Vehicle[]
  identification: boolean
  permit: string
  affiliateLinks: Link[]
  additional: string
  createdBy: string
  createdById?: string
  createdAt: string
}

export interface PackageSummary extends Trip {
  approved: boolean
  status: PackageStatus
  createdBy: string
  createdAt: string
  updatedAt: string
  submittedAt?: string
  reviewedAt?: string
  rejectionReason?: string
}

export interface DraftPackageSummary {
  id: string
  name: string
  destination: string
  imageUrl: string
  updatedAt: string
  status: PackageStatus
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
