import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { useEffect, useState } from 'react'
import { fetchCurrentUser, fetchProfile, updateProfile, type CurrentUser } from '../services/dashboardApi'
import {
  fetchCreatedPackagesCount,
  fetchCreatedTripsByOwner,
  fetchCreatedTrips,
  fetchLikedTrips,
  type CreatedTripSummary,
  type LikedTripSummary,
} from '../services/packageApi'

type ProfileTab = 'myTrips' | 'liked'

const getDisplayName = (name?: string | null, email?: string | null) => {
  if (name?.trim()) return name

  const fallback = email?.split('@')[0]?.replace(/[._-]+/g, ' ')

  if (!fallback) return 'Alpine User'

  return fallback.replace(/\b\w/g, (l) => l.toUpperCase())
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const ProfilePage = () => {
  const navigate = useNavigate()
  const { id: profileId } = useParams<{ id?: string }>()
  const { user } = useAuth()

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [createdCount, setCreatedCount] = useState(0)
  const [createdTrips, setCreatedTrips] = useState<CreatedTripSummary[]>([])
  const [likedTrips, setLikedTrips] = useState<LikedTripSummary[]>([])
  const [ownProfile, setOwnProfile] = useState(true)

  const [activeTab, setActiveTab] = useState<ProfileTab>('myTrips')
  const [isEditing, setIsEditing] = useState(false)

  const [editState, setEditState] = useState({
    name: '',
    bio: '',
    occupation: '',
    location: '',
    travelStyle: '',
    profilePicture: '',
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileResponse = profileId
          ? await fetchProfile(profileId)
          : await fetchCurrentUser().then((userData) => ({
              profile: userData.user,
              ownProfile: true,
            }))

        setCurrentUser(profileResponse.profile)
        setOwnProfile(profileResponse.ownProfile)

        const ownerId = profileResponse.profile._id

        const [created, liked, tripsCount] = await Promise.all([
          profileResponse.ownProfile
            ? fetchCreatedTrips()
            : (ownerId ? fetchCreatedTripsByOwner(ownerId) : Promise.resolve([])),
          profileResponse.ownProfile ? fetchLikedTrips() : Promise.resolve([]),
          profileResponse.ownProfile ? fetchCreatedPackagesCount() : Promise.resolve(0),
        ])

        setCreatedTrips(created)
        setLikedTrips(liked)
        setCreatedCount(profileResponse.ownProfile ? tripsCount : created.length)

        if (!profileResponse.ownProfile) {
          setActiveTab('myTrips')
        }

        setEditState({
          name: profileResponse.profile.name ?? '',
          bio: profileResponse.profile.bio ?? '',
          occupation: profileResponse.profile.occupation ?? '',
          location: profileResponse.profile.location ?? '',
          travelStyle: profileResponse.profile.travelStyle ?? '',
          profilePicture: profileResponse.profile.profilePicture ?? '',
        })
      } catch (err) {
        console.error(err)
      }
    }

    void loadData()
  }, [profileId])

  const displayName = getDisplayName(
    currentUser?.name || user?.displayName,
    user?.email
  )

  const initials = getInitials(displayName)

  const profileImage = ownProfile
    ? (currentUser?.profilePicture || user?.photoURL)
    : currentUser?.profilePicture

  const handleEditChange = (
    key: keyof typeof editState,
    value: string
  ) => {
    setEditState((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = async () => {
    if (!currentUser?._id) return

    try {
      const updated = await updateProfile(
        currentUser._id,
        editState
      )

      setCurrentUser((prev) =>
        prev ? { ...prev, ...updated } : updated
      )

      setIsEditing(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
        >
          ← Back
        </button>

        <header className="mt-4 border-b border-slate-100 pb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 overflow-hidden rounded-full bg-slate-200">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-linear-to-br from-blue-500 to-indigo-700">
                    <span className="text-2xl font-bold text-white">
                      {initials}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Traveler profile
                </p>

                <h1 className="mt-1 text-3xl font-semibold text-slate-950">
                  {displayName}
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                  {currentUser?.occupation || 'Traveler'} •{' '}
                  {currentUser?.location || 'India'}
                </p>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                  {currentUser?.bio ||
                    'Add a short bio to help other travelers get to know you.'}
                </p>
              </div>
            </div>

            {ownProfile && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm font-semibold text-slate-900 transition hover:text-slate-600"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-500">
            <div>
              <span className="font-semibold text-slate-900">
                {createdCount}
              </span>{' '}
              Trips
            </div>

            {ownProfile && (
              <div>
                <span className="font-semibold text-slate-900">
                  {likedTrips.length}
                </span>{' '}
                Liked
              </div>
            )}
          </div>
        </header>

        {/* TABS */}
        <div className="mt-8 flex gap-6 border-b border-slate-100 text-sm">
          <button
            onClick={() => setActiveTab('myTrips')}
            className={`pb-3 font-semibold transition ${
              activeTab === 'myTrips'
                ? 'border-b-2 border-slate-950 text-slate-950'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            My Trips
          </button>

          {ownProfile && (
            <button
              onClick={() => setActiveTab('liked')}
              className={`pb-3 font-semibold transition ${
                activeTab === 'liked'
                  ? 'border-b-2 border-slate-950 text-slate-950'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Liked Trips
            </button>
          )}
        </div>

        {/* MY TRIPS */}
        {activeTab === 'myTrips' && (
          <div className="mt-8">
            {createdTrips.length === 0 ? (
              <p className="text-sm text-slate-600">No trips created yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {createdTrips.map((trip) => (
                  <li key={trip.id}>
                    <button
                      onClick={() => navigate(`/trip/${trip.id}`)}
                      className="flex w-full items-center justify-between py-4 text-left text-slate-900 transition hover:text-slate-600"
                    >
                      <span className="font-medium">{trip.name}</span>
                      <span className="text-sm text-slate-400">View →</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* LIKED TRIPS */}
        {ownProfile && activeTab === 'liked' && (
          <div className="mt-8">
            {likedTrips.length === 0 ? (
              <p className="text-sm text-slate-600">
                No saved trips yet.{' '}
                <button
                  onClick={() => navigate('/home')}
                  className="font-semibold text-slate-900 underline underline-offset-4"
                >
                  Explore trips
                </button>
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {likedTrips.map((trip) => (
                  <li key={trip.id}>
                    <button
                      onClick={() =>
                        navigate(`/trip/${trip.id}`)
                      }
                      className="flex w-full items-center justify-between py-4 text-left text-slate-900 transition hover:text-slate-600"
                    >
                      <span className="font-medium">
                        {trip.name}
                      </span>
                      <span className="text-sm text-slate-400">
                        View →
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                  Edit
                </p>

                <h2 className="mt-2 text-4xl font-bold">
                  Update Profile
                </h2>
              </div>

              <button
                onClick={() => setIsEditing(false)}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="mt-10 grid gap-5">
              <input
                value={editState.name}
                onChange={(e) =>
                  handleEditChange('name', e.target.value)
                }
                placeholder="Name"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-slate-400"
              />

              <input
                value={editState.location}
                onChange={(e) =>
                  handleEditChange(
                    'location',
                    e.target.value
                  )
                }
                placeholder="Location"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-slate-400"
              />

              <input
                value={editState.occupation}
                onChange={(e) =>
                  handleEditChange(
                    'occupation',
                    e.target.value
                  )
                }
                placeholder="Occupation"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-slate-400"
              />

              <input
                value={editState.travelStyle}
                onChange={(e) =>
                  handleEditChange(
                    'travelStyle',
                    e.target.value
                  )
                }
                placeholder="Travel Style"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-slate-400"
              />

              <input
                value={editState.profilePicture}
                onChange={(e) =>
                  handleEditChange(
                    'profilePicture',
                    e.target.value
                  )
                }
                placeholder="Profile Image URL"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-slate-400"
              />

              <textarea
                value={editState.bio}
                onChange={(e) =>
                  handleEditChange('bio', e.target.value)
                }
                placeholder="Tell travelers about yourself..."
                className="min-h-37.5 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-slate-400"
              />

              <button
                onClick={handleSave}
                className="mt-3 rounded-2xl bg-slate-950 py-4 font-semibold text-white transition hover:bg-slate-800"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export { ProfilePage }
