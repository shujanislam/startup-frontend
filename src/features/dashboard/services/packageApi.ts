import apiClient from '../../../lib/apiClient.ts'
import type {
  Hotel,
  Vehicle,
  Link,
  PackageSummary,
  Trip,
  TripDetail,
  SeasonType,
  SortType,
} from '../types/trip.ts'

// ─────────────────────────────────────────────
// Query & Response Contracts
// ─────────────────────────────────────────────

export interface DiscoverQuery {
  search?: string
  destination?: string
  season?: SeasonType
  minBudget?: number
  maxBudget?: number
  minDuration?: number
  maxDuration?: number
  tags?: string[]
  sortBy?: SortType
  page?: number
  limit?: number
}

export interface DiscoverMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface DiscoverResponse {
  message: string
  data: Trip[]
  meta: DiscoverMeta
}

// ─────────────────────────────────────────────
// Raw API Shapes (what the backend actually returns)
// ─────────────────────────────────────────────

export interface ApiHotel {
  _id: string
  name: string
  address: string
  phoneNumber?: string
  budget: number
}

export interface ApiVehicle {
  _id: string
  car: string
  carNumber: string
  driverName?: string
  driverPhoneNumber: string
  budget: number
}

export interface ApiPackage {
  _id: string
  name: string
  description: string
  coverImage: string
  season: string
  budget: number
  destination: string
  spots: string[]
  duration: number
  startDate: string
  endDate: string
  identification: boolean
  permit: string
  tags?: string[]
  affiliateLinks?: string[]
  additional?: string
  createdBy: string
  approved: boolean
  createdAt: string
  updatedAt: string
  hotels?: ApiHotel[] | string[]
  vehicles?: ApiVehicle[] | string[]
  // NOTE: Backend does not yet expose a real rating or popularity metric.
  // rating and popularity-based sorting are approximated until the API supports them.
}

// Derived from ApiPackage — avoids duplicating fields manually.
// Omit server-generated fields the client should never send.
export type CreatePackagePayload = Omit<
  ApiPackage,
  '_id' | 'createdBy' | 'approved' | 'createdAt' | 'updatedAt'
>

export type UpdatePackagePayload = Partial<CreatePackagePayload>

// ─────────────────────────────────────────────
// Sort Mapping
// ─────────────────────────────────────────────

type BackendSort = { sortBy: string; order: 'asc' | 'desc' }

const SORT_MAP: Record<SortType, BackendSort> = {
  cheapest:  { sortBy: 'budget',    order: 'asc'  },
  newest:    { sortBy: 'createdAt', order: 'desc' },
  shortest:  { sortBy: 'duration',  order: 'asc'  },
  // TODO: replace with a real popularity field (e.g. bookingCount) once the backend exposes it.
  popular:   { sortBy: 'createdAt', order: 'desc' },
  all:       { sortBy: 'createdAt', order: 'desc' },
}

function mapSortTypeToBackend(sortBy: SortType): BackendSort {
  return SORT_MAP[sortBy] ?? SORT_MAP.all
}

// ─────────────────────────────────────────────
// Mappers: API → Domain
// ─────────────────────────────────────────────

function mapApiHotel(h: ApiHotel | string): Hotel {
  if (typeof h === 'string') {
    // Backend returned an unpopulated reference — surface a safe placeholder.
    return { id: h, name: 'Unknown Hotel', address: '', phone: '', budget: 0 }
  }
  return {
    id:      h._id,
    name:    h.name,
    address: h.address,
    phone:   h.phoneNumber ?? '',
    budget:  h.budget,
  }
}

function mapApiVehicle(v: ApiVehicle | string): Vehicle {
  if (typeof v === 'string') {
    return { id: v, name: 'Unknown Vehicle', carNumber: '', driverName: '', driverPhone: '', budget: 0 }
  }
  return {
    id:          v._id,
    name:        v.car,
    carNumber:   v.carNumber,
    driverName:  v.driverName ?? '',
    driverPhone: v.driverPhoneNumber,
    budget:      v.budget,
  }
}

function mapApiAffiliateLinks(links?: string[]): Link[] {
  if (!links?.length) return []
  return links.map((url) => {
    try {
      const hostname = new URL(url).hostname.replace('www.', '')
      return { title: `Book on ${hostname}`, url }
    } catch {
      return { title: 'External Link', url }
    }
  })
}

/** Shared base fields present in both Trip and TripDetail. */
function mapApiPackageBase(pkg: ApiPackage) {
  return {
    id:          pkg._id,
    name:        pkg.name,
    description: pkg.description,
    destination: pkg.destination,
    duration:    pkg.duration,
    startDate:   pkg.startDate,
    price:       pkg.budget,
    season:      pkg.season as SeasonType,
    tags:        pkg.tags ?? [],
    imageUrl:    pkg.coverImage,
    isFeatured:  false,
    // Rating is hardcoded until the API returns a real aggregate.
    // TODO: replace with `pkg.rating` once available.
    rating:      0,
  }
}

export function mapApiPackageToTrip(pkg: ApiPackage): Trip {
  return mapApiPackageBase(pkg)
}

export function mapApiPackageToPackageSummary(pkg: ApiPackage): PackageSummary {
  return {
    ...mapApiPackageBase(pkg),
    approved: pkg.approved,
    createdBy: pkg.createdBy,
    createdAt: pkg.createdAt,
    updatedAt: pkg.updatedAt,
  }
}

export function mapApiPackageToTripDetail(pkg: ApiPackage): TripDetail {
  return {
    ...mapApiPackageBase(pkg),
    endDate:        pkg.endDate,
    spots:          pkg.spots ?? [],
    hotels:         (pkg.hotels ?? []).map((h) => mapApiHotel(h as ApiHotel | string)),
    vehicles:       (pkg.vehicles ?? []).map((v) => mapApiVehicle(v as ApiVehicle | string)),
    identification: pkg.identification,
    permit:         pkg.permit,
    affiliateLinks: mapApiAffiliateLinks(pkg.affiliateLinks),
    additional:     pkg.additional ?? '',
    createdBy:      pkg.createdBy,
    createdAt:      pkg.createdAt,
  }
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Strips undefined values so they aren't serialised as "undefined" in query strings. */
function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>
}

// ─────────────────────────────────────────────
// API Calls
// ─────────────────────────────────────────────

export const discoverPackages = async (query: DiscoverQuery): Promise<DiscoverResponse> => {
  const { sortBy, tags, season, page, limit, ...rest } = query
  const sortParams = mapSortTypeToBackend(sortBy ?? 'all')

  const rawParams = {
    ...rest,
    ...sortParams,
    page:  page  ?? 1,
    limit: limit ?? 12,
    // Omit season entirely when 'all' — backend interprets absence as no filter.
    ...(season && season !== 'all' ? { season } : {}),
    // Serialise tag array as a comma-separated string for the backend.
    ...(tags?.length ? { tags: tags.join(',') } : {}),
  }

  const params = stripUndefined(rawParams)

  const { data } = await apiClient.get<{
    message: string
    data: ApiPackage[]
    meta: DiscoverMeta
  }>('/packages/discover-package', { params })

  return {
    message: data.message,
    data:    data.data.map(mapApiPackageToTrip),
    meta:    data.meta,
  }
}

export const fetchPackageById = async (id: string): Promise<TripDetail> => {
  // Throws on non-2xx; let the caller decide how to handle errors.
  const { data } = await apiClient.get<ApiPackage>(`/packages/view-package/${id}`)
  return mapApiPackageToTripDetail(data)
}

export const fetchAllPackages = async (): Promise<Trip[]> => {
  const { data } = await apiClient.get<ApiPackage[]>('/packages/get-packages')
  return data.map(mapApiPackageToTrip)
}

export const fetchPendingPackages = async (): Promise<PackageSummary[]> => {
  const { data } = await apiClient.get<ApiPackage[]>('/packages/pending-packages')
  return data.map(mapApiPackageToPackageSummary)
}

export const createPackage = async (payload: CreatePackagePayload): Promise<TripDetail> => {
  const { data } = await apiClient.post<{ message: string; data: ApiPackage }>(
    '/packages/post-package',
    payload
  )
  return mapApiPackageToTripDetail(data.data)
}

export const updatePackage = async (
  id: string,
  payload: UpdatePackagePayload
): Promise<TripDetail> => {
  const { data } = await apiClient.patch<{ message: string; data: ApiPackage }>(
    `/packages/update-package/${id}`,
    payload
  )
  return mapApiPackageToTripDetail(data.data)
}

export const deletePackage = async (id: string): Promise<void> => {
  await apiClient.delete(`/packages/delete-package/${id}`)
}

export const approvePackage = async (id: string): Promise<PackageSummary> => {
  const { data } = await apiClient.patch<{ message: string; data: ApiPackage }>(
    `/packages/approve-package/${id}`,
    {}
  )
  return mapApiPackageToPackageSummary(data.data)
}

export const unapprovePackage = async (id: string): Promise<PackageSummary> => {
  const { data } = await apiClient.patch<{ message: string; data: ApiPackage }>(
    `/packages/unapprove-package/${id}`,
    {}
  )
  return mapApiPackageToPackageSummary(data.data)
}

export const revealPackage = async (id: string): Promise<void> => {
  await apiClient.patch(`/packages/reveal-package/${id}`, {})
}

export const likePackage = async (id: string): Promise<{ alreadyLiked: boolean }> => {
  const { data } = await apiClient.post<{ alreadyLiked: boolean }>(`/packages/like-package/${id}`, {})
  return { alreadyLiked: Boolean(data.alreadyLiked) }
}

export const fetchRevealedPackageIds = async (): Promise<string[]> => {
  const { data } = await apiClient.get<{ data: Array<{ _id: string }> }>('/profile/get-revealed-packages')
  return (data.data ?? []).map((pkg) => pkg._id)
}

export const fetchLikedPackagesCount = async (): Promise<number> => {
  const { data } = await apiClient.get<{ data?: Array<{ _id: string }> }>('/packages/get-liked-packages')
  return (data.data ?? []).length
}

export const fetchCreatedPackagesCount = async (): Promise<number> => {
  const { data } = await apiClient.get<{ createdPackages?: Array<{ _id: string }> }>('/profile/get-created-packages')
  return (data.createdPackages ?? []).length
}

// ─────────────────────────────────────────────
// Reviews
// ─────────────────────────────────────────────

export interface ReviewPayload {
  packageId: string
  review: string
  rating: number
}

export const createPackageReview = async (payload: ReviewPayload): Promise<void> => {
  await apiClient.post('/packages/post-package-review', payload)
} 
