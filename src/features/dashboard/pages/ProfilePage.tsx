import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { useEffect, useState } from 'react'
import { fetchCurrentUser, type CurrentUser } from '../services/dashboardApi'

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

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await fetchCurrentUser()
        setCurrentUser(response.user)
      } catch {
        setCurrentUser(null)
      }
    }

    void loadCurrentUser()
  }, [])

  const profileImage = currentUser?.profilePicture || user?.photoURL
  const displayName = getDisplayName(currentUser?.name || user?.displayName, user?.email)
  const initials = getInitials(displayName)
  const provider = user?.providerData[0]?.providerId?.replace('.com', '') || 'Email'

  const stats = [
    { label: 'Trips', value: '0' },
    { label: 'Saved', value: '0' },
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
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-100"
          >
            <span className="text-lg">←</span>
            Back
          </button>

          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-100"
          >
            Manage
          </button>
        </header>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-linear-to-r from-slate-950 via-slate-800 to-blue-900 px-5 py-8 text-white sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-white/20 bg-white/10">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">{initials}</span>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
                    Traveler Profile
                  </p>
                  <h1 className="mt-3 text-4xl font-bold tracking-normal text-white md:text-5xl">
                    {displayName}
                  </h1>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
                    Budget traveler & package explorer
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur md:min-w-80">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white/10 px-3 py-4 text-center">
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="mt-1 text-xs font-medium text-slate-200">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_360px] lg:p-10">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                    Account
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">Profile Details</h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {user?.emailVerified ? 'Verified' : 'Verification pending'}
                </span>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {details.map((detail) => (
                  <div
                    key={detail.label}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {detail.label}
                    </p>
                    <p className="mt-2 truncate text-sm font-semibold text-slate-950">
                      {detail.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Snapshot
                </p>
                <div className="mt-5 flex items-center gap-4">
                  <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-slate-100">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-slate-800">{initials}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-950">{displayName}</p>
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {user?.email || 'No email added'}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Update Profile
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <article className="rounded-2xl bg-yellow-100 p-4">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-lg">☻</div>
                    <p className="mt-6 text-sm font-medium text-slate-700">Work</p>
                    <h3 className="mt-2 text-xl font-bold leading-tight text-slate-950">
                      Build Your Portfolio
                    </h3>
                    <div className="mt-5 h-1 w-16 rounded-full bg-white/70">
                      <div className="h-full w-8 rounded-full bg-white" />
                    </div>
                  </article>

                  <article className="rounded-2xl bg-cyan-200 p-4">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-lg">ϟ</div>
                    <p className="mt-6 text-sm font-medium text-slate-700">Personal</p>
                    <h3 className="mt-2 text-xl font-bold leading-tight text-slate-950">
                      Add Your Details
                    </h3>
                    <div className="mt-5 h-1 w-16 rounded-full bg-white/50">
                      <div className="h-full w-10 rounded-full bg-white" />
                    </div>
                  </article>
                </div>
              </section>
            </aside>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">{stat.value}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}

export { ProfilePage }
