import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { useEffect, useState } from 'react'
import { fetchCurrentUser, type CurrentUser } from '../services/dashboardApi'
import {
  fetchCreatedPackagesCount,
  fetchLikedTrips,
  fetchLikedPackagesCount,
  type LikedTripSummary,
} from '../services/packageApi'

type ProfileTab = 'general' | 'liked'

const getDisplayName = (name?: string | null, email?: string | null) => {
  if (name?.trim()) {
    return name
  }

  const fallback = email?.split('@')[0]?.replace(/[._-]+/g, ' ')

  if (!fallback) {
    return 'BudgetYatra User'
  }

  return fallback.replace(/\b\w/g, (letter) => letter.toUpperCase())
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const formatDate = (value?: string) => {
  if (!value) {
    return 'Not available'
  }

  return new Date(value).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const ProfilePage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [likedCount, setLikedCount] = useState(0)
  const [createdCount, setCreatedCount] = useState(0)
  const [likedTrips, setLikedTrips] = useState<LikedTripSummary[]>([])
  const [activeTab, setActiveTab] = useState<ProfileTab>('general')

  useEffect(() => {
    const loadCurrentUser = async () => {
      const [userResult, likedResult, createdResult] = await Promise.allSettled([
        fetchCurrentUser(),
        fetchLikedPackagesCount(),
        fetchCreatedPackagesCount(),
      ])

      const likedTripsResult = await Promise.allSettled([fetchLikedTrips()])

      if (userResult.status === 'fulfilled') {
        setCurrentUser(userResult.value.user)
      } else {
        setCurrentUser(null)
      }

      if (likedResult.status === 'fulfilled') {
        setLikedCount(likedResult.value)
      } else {
        setLikedCount(0)
      }

      if (likedTripsResult[0].status === 'fulfilled') {
        setLikedTrips(likedTripsResult[0].value)
      } else {
        setLikedTrips([])
      }

      if (createdResult.status === 'fulfilled') {
        setCreatedCount(createdResult.value)
      } else {
        setCreatedCount(0)
      }
    }

    void loadCurrentUser()
  }, [])

  const profileImage = currentUser?.profilePicture || user?.photoURL
  const displayName = getDisplayName(currentUser?.name || user?.displayName, user?.email)
  const initials = getInitials(displayName)
  const provider = user?.providerData[0]?.providerId?.replace('.com', '') || 'Email'

  const stats = [
    { label: 'Trips', value: String(createdCount) },
    { label: 'Liked', value: String(likedCount) },
    { label: 'Reviews', value: '0' },
  ]

  const details = [
    { label: 'Email', value: user?.email || 'Not available' },
    { label: 'Phone', value: user?.phoneNumber || 'Not added' },
    { label: 'Provider', value: provider },
    { label: 'Account ID', value: user?.uid || 'Not available' },
    { label: 'Verified', value: user?.emailVerified ? 'Verified' : 'Not verified' },
    { label: 'Joined', value: formatDate(user?.metadata.creationTime) },
    { label: 'Last login', value: formatDate(user?.metadata.lastSignInTime) },
  ]

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="relative h-[40vh] min-h-[280px] w-full overflow-hidden md:h-[36vh] md:min-h-[320px]">
        {profileImage ? (
          <img src={profileImage} alt={displayName} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center bg-linear-to-br from-slate-900 via-slate-800 to-blue-900">
            <span className="text-6xl font-bold text-white md:text-7xl">{initials}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/35 to-black/65" />

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 z-20 rounded-full bg-black/40 px-4 py-2 text-sm font-medium text-white transition hover:bg-black/60"
        >
          ← Back
        </button>

        <button
          type="button"
          className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/90 bg-transparent text-white transition hover:bg-white/10"
          aria-label="Notifications"
          title="Notifications"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14.857 17.082A23.848 23.848 0 0 0 18 16.5a8.25 8.25 0 1 0-12 0 23.847 23.847 0 0 0 3.143.582m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
        </button>

        <div className="absolute bottom-8 left-4 right-4 z-20 md:left-6 md:right-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">Traveler Profile</p>
          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">{displayName}</h1>
        </div>
      </section>

      <div className="relative z-10 -mt-6 rounded-t-3xl bg-slate-50 pt-4 md:mx-auto md:mt-0 md:max-w-6xl md:rounded-none md:bg-transparent md:px-6 md:pt-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl px-4 pb-8 md:px-0">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-200">
              <div className="grid grid-cols-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('general')}
                  className={`w-full border-b-2 px-4 py-3 text-sm font-semibold transition ${
                    activeTab === 'general'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  General
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('liked')}
                  className={`w-full border-b-2 px-4 py-3 text-sm font-semibold transition ${
                    activeTab === 'liked'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Liked Trips
                </button>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-center">
                  <p className="text-2xl font-bold text-slate-900 md:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 md:text-xs">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">Profile Details</h2>
              </div>
            </div>

            {activeTab === 'general' ? (
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {details.map((detail) => (
                  <div
                    key={detail.label}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{detail.label}</p>
                    <p className="mt-2 truncate text-sm font-semibold text-slate-950">{detail.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Liked Trips</p>

                {likedTrips.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-600">No liked trips yet.</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {likedTrips.map((trip) => (
                      <li
                        key={trip.id}
                      >
                        <button
                          type="button"
                          onClick={() => navigate(`/trip/${trip.id}`)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-900 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          {trip.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export { ProfilePage }
