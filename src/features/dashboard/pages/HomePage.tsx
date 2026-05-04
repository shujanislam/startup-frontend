import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { HomeHeader } from '../components/HomeHeader'
import { TripCard } from '../components/TripCard'
import { FeaturedTripCard } from '../components/FeaturedTripCard'
import { CreateTripModal } from '../components/CreateTripModal'
import { PendingApprovalCard } from '../components/PendingApprovalCard'
import type { PackageSummary, SortType, SeasonType, Trip } from '../types/trip'
import {
  approvePackage,
  createPackage,
  discoverPackages,
  fetchPendingPackages,
  unapprovePackage,
  type CreatePackagePayload,
  type DiscoverMeta,
} from '../services/packageApi'
import { fetchCurrentUser, type CurrentUser } from '../services/dashboardApi.ts'
import { useAuth } from '../../auth/hooks/useAuth'
import { logoutUser } from '../../auth/services/authService'

type BannerState =
  | {
      tone: 'success' | 'error'
      message: string
    }
  | null

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback

const HomePage = () => {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [trips, setTrips] = useState<Trip[]>([])
  const [pendingTrips, setPendingTrips] = useState<PackageSummary[]>([])
  const [meta, setMeta] = useState<DiscoverMeta | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPendingLoading, setIsPendingLoading] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isSubmittingTrip, setIsSubmittingTrip] = useState(false)
  const [approvingTripId, setApprovingTripId] = useState<string | null>(null)
  const [unapprovingTripId, setUnapprovingTripId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pendingError, setPendingError] = useState<string | null>(null)
  const [createTripError, setCreateTripError] = useState<string | null>(null)
  const [banner, setBanner] = useState<BannerState>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const [sortBy, setSortBy] = useState<SortType>('all')
  const [season, setSeason] = useState<SeasonType>('all')
  const [maxBudget, setMaxBudget] = useState(10000)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  const isAdmin = currentUser?.isAdmin === true

  const fetchTrips = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
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
        setError(getErrorMessage(err, 'Failed to load trips'))
      } finally {
        setIsLoading(false)
      }
    },
    [searchQuery, season, maxBudget, sortBy],
  )

  const fetchPendingTrips = useCallback(async () => {
    if (!isAdmin) {
      setPendingTrips([])
      setPendingError(null)
      return
    }

    setIsPendingLoading(true)
    setPendingError(null)

    try {
      const data = await fetchPendingPackages()
      setPendingTrips(data)
    } catch (err: unknown) {
      setPendingError(getErrorMessage(err, 'Failed to load pending trips'))
    } finally {
      setIsPendingLoading(false)
    }
  }, [isAdmin])

  const loadCurrentUser = useCallback(async () => {
    try {
      const response = await fetchCurrentUser()
      setCurrentUser(response.user)
    } catch (err: unknown) {
      setCurrentUser(null)
      setBanner({
        tone: 'error',
        message: getErrorMessage(err, 'Failed to load your account permissions.'),
      })
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!authLoading) {
        void fetchTrips(1, false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, season, maxBudget, sortBy, fetchTrips, authLoading])

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (!authLoading && user) {
      void loadCurrentUser()
    }

    if (!user) {
      setCurrentUser(null)
      setPendingTrips([])
    }
  }, [authLoading, user, loadCurrentUser])

  useEffect(() => {
    if (currentUser && !currentUser.onboardingComplete) {
      navigate('/onboarding', { replace: true })
    }
  }, [currentUser, navigate])

  useEffect(() => {
    void fetchPendingTrips()
  }, [fetchPendingTrips])

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
    setBanner(null)
    setCreateTripError(null)
    setIsCreateModalOpen(true)
  }

  const handleCreateTrip = async (payload: CreatePackagePayload) => {
    setCreateTripError(null)
    setIsSubmittingTrip(true)

    try {
      await createPackage(payload)
      setIsCreateModalOpen(false)
      setBanner({
        tone: 'success',
        message: 'Trip submitted successfully. It is now waiting for admin approval.',
      })

      if (isAdmin) {
        await fetchPendingTrips()
      }
    } catch (err: unknown) {
      setCreateTripError(getErrorMessage(err, 'Failed to submit your trip'))
    } finally {
      setIsSubmittingTrip(false)
    }
  }

  const handleApproveTrip = async (tripId: string) => {
    setApprovingTripId(tripId)
    setPendingError(null)
    setBanner(null)

    try {
      await approvePackage(tripId)
      setBanner({
        tone: 'success',
        message: 'Trip approved successfully and moved into the main catalog.',
      })

      await Promise.all([fetchPendingTrips(), fetchTrips(1, false)])
    } catch (err: unknown) {
      setPendingError(getErrorMessage(err, 'Failed to approve this trip'))
    } finally {
      setApprovingTripId(null)
    }
  }

  const handleUnapproveTrip = async (tripId: string) => {
    setUnapprovingTripId(tripId)
    setBanner(null)

    try {
      await unapprovePackage(tripId)
      setBanner({
        tone: 'success',
        message: 'Trip moved back to pending approval and removed from the public catalog.',
      })

      await Promise.all([fetchPendingTrips(), fetchTrips(1, false)])
    } catch (err: unknown) {
      setBanner({
        tone: 'error',
        message: getErrorMessage(err, 'Failed to move this trip back to pending approval'),
      })
    } finally {
      setUnapprovingTripId(null)
    }
  }

  const handleLoadMore = () => {
    if (meta && page < meta.totalPages) {
      void fetchTrips(page + 1, true)
    }
  }

  const hasActiveFilters =
    searchQuery.trim().length > 0 || season !== 'all' || sortBy !== 'all' || maxBudget < 10000

  const featured =
    !isAdmin && !hasActiveFilters && trips.length > 0
      ? { ...trips[0], badge: 'Featured', isFeatured: true }
      : null

  const remainingTrips = isAdmin || hasActiveFilters ? trips : featured ? trips.slice(1) : trips

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-sm text-gray-500">Checking session...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex w-full overflow-hidden">
          <Sidebar
            onSortChange={handleSortChange}
            onSeasonChange={handleSeasonChange}
            onBudgetChange={handleBudgetChange}
          />

          <main className="flex-1 overflow-y-auto bg-gray-50 pb-24">
            <HomeHeader
              userName={currentUser?.email?.split('@')[0] || 'User'}
              userEmail={user?.email}
              userPhotoURL={currentUser?.profilePicture || user?.photoURL}
              searchQuery={searchQuery}
              onSearch={handleSearch}
              onSubmitTrip={handleSubmitTrip}
              onLogout={handleLogout}
              onProfileClick={() => navigate('/profile')}
              isLoggingOut={isLoggingOut}
              isAdmin={isAdmin}
              profilePhotoURL={currentUser?.profilePicture}
            />

            {(isAdmin || banner) && (
              <div className="mx-auto w-full max-w-5xl px-4 pt-6 md:px-6 lg:px-8">
                {isAdmin && (
                <div className="mb-6 rounded-[24px] border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-orange-50 px-5 py-4 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                    Admin User Active
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    You are signed in with admin access. Pending package reviews will appear below when unapproved trips exist.
                  </p>
                </div>
                )}

                {banner && (
                <div
                  className={`mb-6 rounded-[24px] border px-5 py-4 shadow-sm ${
                    banner.tone === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border-red-200 bg-red-50 text-red-700'
                  }`}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em]">
                    {banner.tone === 'success' ? 'Update' : 'Attention'}
                  </p>
                  <p className="mt-2 text-sm leading-6">{banner.message}</p>
                </div>
                )}
              </div>
            )}

            {isAdmin && (
              <section className="mx-auto w-full max-w-5xl px-4 pb-2 md:px-6 lg:px-8">
                <div className="overflow-hidden rounded-[28px] border border-amber-200 bg-white shadow-sm">
                  <div className="border-b border-amber-200 bg-gradient-to-r from-amber-50 via-white to-orange-50 px-6 py-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
                          Admin Review
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-slate-900">Pending approval</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                          These packages are hidden from the main trip catalog until an admin approves them.
                        </p>
                      </div>
                      <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                        {pendingTrips.length} waiting
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-6">
                    {pendingError && (
                      <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {pendingError}
                      </div>
                    )}

                    {isPendingLoading && pendingTrips.length === 0 && (
                      <div className="flex min-h-40 flex-col items-center justify-center text-center">
                        <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                        <p className="text-sm text-slate-500">Loading pending trips...</p>
                      </div>
                    )}

                    {!isPendingLoading && pendingTrips.length === 0 && !pendingError && (
                      <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                        <h3 className="text-lg font-semibold text-slate-800">No pending trips right now</h3>
                        <p className="mt-2 text-sm text-slate-500">
                          New submissions will appear here for review before they go public.
                        </p>
                      </div>
                    )}

                    {pendingTrips.length > 0 && (
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {pendingTrips.map((trip) => (
                          <PendingApprovalCard
                            key={trip.id}
                            trip={trip}
                            isApproving={approvingTripId === trip.id}
                            onView={() => navigate(`/trip/${trip.id}`)}
                            onApprove={() => void handleApproveTrip(trip.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {featured && (
              <section className="mx-auto w-full max-w-5xl px-4 pb-0 pt-6 md:px-6 lg:px-8">
                <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
                  Featured This Season
                </p>
                <FeaturedTripCard trip={featured} onClick={() => navigate(`/trip/${featured.id}`)} />
              </section>
            )}

            <section className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6 lg:px-8 md:py-8">
              <div className="mb-6 flex items-baseline gap-3">
                <h2 className="text-sm uppercase font-bold text-gray-900 md:text-xl">Explore Trips</h2>
                {/* {meta && ( */}
                {/*   <span className="text-sm font-medium text-gray-500">({meta.total} found)</span> */}
                {/* )} */}
              </div>

              {isAdmin && (
                <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                  Approved trips are public. Use the unapprove action to move any package back into the pending review queue.
                </div>
              )}

              {isLoading && trips.length === 0 && (
                <div className="flex min-h-64 flex-col items-center justify-center text-center">
                  <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                  <p className="text-sm text-gray-500">Loading trips...</p>
                </div>
              )}

              {error && trips.length === 0 && (
                <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
                  <div className="mb-4 text-5xl">!</div>
                  <p className="mb-2 text-lg font-semibold text-gray-700">Something went wrong</p>
                  <p className="mb-4 text-sm text-gray-500">{error}</p>
                  <button
                    type="button"
                    onClick={() => void fetchTrips(1, false)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!isLoading && !error && remainingTrips.length === 0 && (
                <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
                  <div className="mb-4 text-5xl">O</div>
                  <p className="mb-2 text-lg font-semibold text-gray-700">No trips found</p>
                  <p className="text-sm text-gray-500">Try changing your filters or submit a new trip.</p>
                </div>
              )}

              {remainingTrips.length > 0 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {remainingTrips.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onClick={() => navigate(`/trip/${trip.id}`)}
                      secondaryActionLabel={isAdmin ? 'Unapprove' : undefined}
                      onSecondaryAction={
                        isAdmin ? () => void handleUnapproveTrip(trip.id) : undefined
                      }
                      isSecondaryActionLoading={unapprovingTripId === trip.id}
                    />
                  ))}
                </div>
              )}

              {meta && page < meta.totalPages && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {isLoading ? 'Loading...' : 'Load More Trips'}
                  </button>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      <CreateTripModal
        open={isCreateModalOpen}
        isSubmitting={isSubmittingTrip}
        errorMessage={createTripError}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTrip}
      />
    </>
  )
}

export { HomePage }
