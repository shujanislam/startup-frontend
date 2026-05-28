import apiClient from '../../../lib/apiClient.ts'
import type {
  Hotel,
  Vehicle,
  Link,
  DraftPackageSummary,
  PackageSummary,
  PackageStatus,
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

const userNameCache = new Map<string, string>()

const isObjectId = (value: string): boolean => /^[a-f\d]{24}$/i.test(value)

export const resolvePackageCoverImage = (coverImage?: string): string => {
  const value = coverImage?.trim() || ''

  if (!value) {
    return ''
  }

  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:') ||
    value.startsWith('blob:')
  ) {
    return value
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const baseUrl = apiBaseUrl.replace('/v1/api', '')
  return `${baseUrl}/uploads/packages/${value}`
}

export const resolveHotelPhoto = (photo?: string): string => {
  const value = photo?.trim() || ''

  if (!value) {
    return ''
  }

  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:') ||
    value.startsWith('blob:')
  ) {
    return value
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL 
  const baseUrl = apiBaseUrl.replace('/v1/api', '')
  return `${baseUrl}/uploads/hotels/${value}`
}

const resolveUserNameByProfileId = async (userId: string): Promise<string | null> => {
  if (!isObjectId(userId)) {
    return null
  }

  if (userNameCache.has(userId)) {
    return userNameCache.get(userId) || null
  }

  try {
    const { data } = await apiClient.get<{ profile?: { name?: string } }>(`/profile/show-profile/${userId}`)
    const name = data?.profile?.name?.trim()

    if (name) {
      userNameCache.set(userId, name)
      return name
    }

    return null
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────
// Raw API Shapes (what the backend actually returns)
// ─────────────────────────────────────────────

export interface ApiHotel {
  _id: string
  name: string
  address: string
  phoneNumber?: string
  photos?: string[]
  budget: number
}

export interface ApiVehicle {
  _id: string
  car: string
  carNumber: string
  driverName?: string
  driverPhoneNumber: string
  vehicleType?: string
  budget: number
}

export interface DraftHotelPayload {
  name?: string
  phoneNumber?: string
  address?: string
  photos?: string[]
  budget?: number
}

export interface DraftVehiclePayload {
  car?: string
  carNumber?: string
  driverName?: string
  driverPhoneNumber?: string
  vehicleType?: string
  budget?: number
}

export interface CreateHotelPayload {
  name: string
  phoneNumber: string
  address: string
  photos: string[]
  budget: number
}

export interface CreateVehiclePayload {
  car: string
  carNumber: string
  driverName?: string
  driverPhoneNumber: string
  vehicleType?: string
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
  createdByName?: string
  approved: boolean
  status?: PackageStatus
  submittedAt?: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
  hotels?: ApiHotel[] | string[]
  vehicles?: ApiVehicle[] | string[]
  draftHotels?: DraftHotelPayload[]
  draftVehicles?: DraftVehiclePayload[]
  meta?: {
    isRevealed?: boolean
  }
  // NOTE: Backend does not yet expose a real rating or popularity metric.
  // rating and popularity-based sorting are approximated until the API supports them.
}

export interface TripDetailResponse {
  data: TripDetail
  isRevealed: boolean
}

// Derived from ApiPackage — avoids duplicating fields manually.
// Omit server-generated fields the client should never send.
export type CreatePackagePayload = Omit<
  ApiPackage,
  | '_id'
  | 'createdBy'
  | 'approved'
  | 'status'
  | 'submittedAt'
  | 'reviewedAt'
  | 'reviewedBy'
  | 'rejectionReason'
  | 'createdAt'
  | 'updatedAt'
>

export type UpdatePackagePayload = Partial<CreatePackagePayload>
export type DraftPackagePayload = Partial<CreatePackagePayload>

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
    name:        pkg.name || 'Untitled trip',
    description: pkg.description || '',
    destination: pkg.destination || 'Destination pending',
    duration:    pkg.duration || 0,
    startDate:   pkg.startDate || '',
    price:       pkg.budget || 0,
    season:      (pkg.season || 'all') as SeasonType,
    tags:        pkg.tags ?? [],
    imageUrl:    resolvePackageCoverImage(pkg.coverImage),
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
    status: pkg.status ?? (pkg.approved ? 'approved' : 'pending_approval'),
    createdBy: pkg.createdBy,
    createdAt: pkg.createdAt,
    updatedAt: pkg.updatedAt,
    submittedAt: pkg.submittedAt,
    reviewedAt: pkg.reviewedAt,
    rejectionReason: pkg.rejectionReason,
  }
}

export function mapApiPackageToDraftSummary(pkg: ApiPackage): DraftPackageSummary {
  return {
    id: pkg._id,
    name: pkg.name?.trim() || 'Untitled draft',
    destination: pkg.destination?.trim() || 'Destination not set',
    imageUrl: resolvePackageCoverImage(pkg.coverImage),
    updatedAt: pkg.updatedAt,
    status: pkg.status ?? 'draft',
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
    createdBy:      pkg.createdByName ?? pkg.createdBy,
    createdById:    pkg.createdBy,
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
    meta?: DiscoverMeta
    pagination?: DiscoverMeta
  }>('/packages/discover-package', { params })

  const meta = data.meta ?? data.pagination

  if (!meta) {
    throw new Error('Backend discover-package response is missing pagination metadata.')
  }

  return {
    message: data.message ?? 'Packages fetched successfully',
    data:    data.data.map(mapApiPackageToTrip),
    meta,
  }
}

export const fetchPackageById = async (id: string): Promise<TripDetailResponse> => {
  // Throws on non-2xx; let the caller decide how to handle errors.
  const { data } = await apiClient.get<ApiPackage>(`/packages/view-package/${id}`)
  const isRevealed = Boolean(data.meta?.isRevealed)

  if (!data.createdByName) {
    const creatorName = await resolveUserNameByProfileId(data.createdBy)
    if (creatorName) {
      data.createdByName = creatorName
    }
  }

  return {
    data: mapApiPackageToTripDetail(data),
    isRevealed,
  }
}

export const fetchAllPackages = async (): Promise<Trip[]> => {
  const { data } = await apiClient.get<ApiPackage[]>('/packages/get-packages')
  return data.map(mapApiPackageToTrip)
}

export const fetchFeaturedPackage = async (): Promise<Trip | null> => {
  const { data } = await apiClient.get<{ message: string; data: ApiPackage }>('/packages/get-featured-package')

  if (!data?.data) {
    return null
  }

  return mapApiPackageToTrip(data.data)
}

export const fetchPendingPackages = async (): Promise<PackageSummary[]> => {
  const { data } = await apiClient.get<ApiPackage[]>('/packages/pending-packages')
  return data.map(mapApiPackageToPackageSummary)
}

export const fetchDraftPackages = async (): Promise<DraftPackageSummary[]> => {
  const { data } = await apiClient.get<{ message: string; data: ApiPackage[] }>(
    '/packages/my-draft-packages'
  )
  return (data.data ?? []).map(mapApiPackageToDraftSummary)
}

export const fetchEditablePackage = async (id: string): Promise<ApiPackage> => {
  const { data } = await apiClient.get<{ message: string; data: ApiPackage }>(
    `/packages/edit-package/${id}`
  )
  return data.data
}

export const createPackage = async (payload: CreatePackagePayload): Promise<TripDetail> => {
  const { data } = await apiClient.post<{ message: string; data: ApiPackage }>(
    '/packages/post-package',
    payload
  )
  return mapApiPackageToTripDetail(data.data)
}

export const createPackageDraft = async (payload: DraftPackagePayload): Promise<ApiPackage> => {
  const { data } = await apiClient.post<{ message: string; data: ApiPackage }>(
    '/packages/draft-package',
    payload
  )
  return data.data
}

export const updatePackageDraft = async (
  id: string,
  payload: DraftPackagePayload
): Promise<ApiPackage> => {
  const { data } = await apiClient.patch<{ message: string; data: ApiPackage }>(
    `/packages/draft-package/${id}`,
    payload
  )
  return data.data
}

export const submitPackageForApproval = async (
  id: string,
  payload: CreatePackagePayload
): Promise<TripDetail> => {
  const { data } = await apiClient.patch<{ message: string; data: ApiPackage }>(
    `/packages/submit-package/${id}`,
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

export const rejectPackage = async (id: string): Promise<PackageSummary> => {
  const { data } = await apiClient.patch<{ message: string; data: ApiPackage }>(
    `/packages/reject-package/${id}`,
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

export const fetchLikedTrips = async (): Promise<Trip[]> => {
  const { data } = await apiClient.get<{ data?: Array<{ _id: string; name?: string }> }>('/packages/get-liked-packages')

  return (data.data ?? []).map((pkg) => mapApiPackageToTrip(pkg as ApiPackage))
}

export const fetchCreatedTrips = async (): Promise<Trip[]> => {
  const { data } = await apiClient.get<{ createdPackages?: ApiPackage[] }>(
    '/profile/get-created-packages'
  )

  return (data.createdPackages ?? []).map((pkg) => mapApiPackageToTrip(pkg))
}

export const fetchCreatedTripsByOwner = async (ownerId: string): Promise<Trip[]> => {
  const limit = 100
  let page = 1
  let totalPages = 1
  const createdTrips: Trip[] = []

  do {
    const { data } = await apiClient.get<{
      message: string
      data: ApiPackage[]
      meta: DiscoverMeta
    }>('/packages/discover-package', {
      params: {
        page,
        limit,
        sortBy: 'createdAt',
        order: 'desc',
      },
    })

    for (const pkg of data.data ?? []) {
      if (pkg.createdBy === ownerId) {
        createdTrips.push(mapApiPackageToTrip(pkg))
      }
    }

    totalPages = data.meta?.totalPages ?? 1
    page += 1
  } while (page <= totalPages)

  return createdTrips
}

export const fetchCreatedPackagesCount = async (): Promise<number> => {
  const { data } = await apiClient.get<{ createdPackages?: Array<{ _id: string }> }>('/profile/get-created-packages')
  return (data.createdPackages ?? []).length
}

// ─────────────────────────────────────────────
// Hotels & Vehicles
// ─────────────────────────────────────────────

export const createHotel = async (payload: CreateHotelPayload): Promise<ApiHotel> => {
  const { data } = await apiClient.post<{ message: string; data: ApiHotel }>('/hotels/post-hotel', payload)
  return data.data
}

export const createVehicle = async (payload: CreateVehiclePayload): Promise<ApiVehicle> => {
  const { data } = await apiClient.post<{ message: string; data: ApiVehicle }>('/vehicles/post-vehicle', payload)
  return data.data
}

// ─────────────────────────────────────────────
// Reviews
// ─────────────────────────────────────────────

export interface ReviewPayload {
  packageId: string
  review: string
  rating: number
}

export interface Review {
  _id: string
  packageId: string
  userId: string
  review: string
  rating: number
  createdAt: string
  updatedAt: string
  userName: string
  userPicture: string
}

export interface ReviewEligibility {
  revealed: boolean
  revealedAt: string | null
  canReview: boolean
  reviewAvailableAt: string | null
  daysRemaining: number | null
  status: 'locked' | 'cooldown' | 'eligible'
}

export const createPackageReview = async (payload: ReviewPayload): Promise<void> => {
  await apiClient.post('/packages/post-package-review', payload)
}

export const fetchPackageReviews = async (packageId: string): Promise<Review[]> => {
  const { data } = await apiClient.get<{ message: string; data: Review[] }>(
    `/packages/get-package-reviews/${packageId}`
  )

  const reviews = data.data ?? []

  const reviewUserIdsToResolve = [
    ...new Set(
      reviews
        .filter((review) => (review.userName || '').trim().toLowerCase() === 'anonymous')
        .map((review) => review.userId)
        .filter((userId) => isObjectId(userId))
    ),
  ]

  if (reviewUserIdsToResolve.length === 0) {
    return reviews
  }

  const resolvedEntries = await Promise.all(
    reviewUserIdsToResolve.map(async (userId) => {
      const userName = await resolveUserNameByProfileId(userId)
      return [userId, userName] as const
    })
  )

  const resolvedNameMap = new Map<string, string>()
  for (const [userId, userName] of resolvedEntries) {
    if (userName) {
      resolvedNameMap.set(userId, userName)
    }
  }

  return reviews.map((review) => {
    if ((review.userName || '').trim().toLowerCase() !== 'anonymous') {
      return review
    }

    const resolvedName = resolvedNameMap.get(review.userId)
    if (!resolvedName) {
      return review
    }

    return {
      ...review,
      userName: resolvedName,
    }
  })
}

export const fetchReviewEligibility = async (packageId: string): Promise<ReviewEligibility> => {
  const { data } = await apiClient.get<{ message: string; data: ReviewEligibility }>(
    `/packages/review-eligibility/${packageId}`
  )
  return data.data
}
