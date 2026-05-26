import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { useEffect, useMemo, useState } from 'react'
import apiClient from '../../../lib/apiClient'
import { fetchCurrentUser, fetchProfile, type CurrentUser } from '../services/dashboardApi'
import {
  fetchCreatedPackagesCount,
  fetchCreatedTripsByOwner,
  fetchCreatedTrips,
  fetchLikedTrips,
} from '../services/packageApi'
import { TripCard } from '../components/TripCard'
import type { Trip } from '../types/trip'

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
  const [createdTrips, setCreatedTrips] = useState<Trip[]>([])
  const [likedTrips, setLikedTrips] = useState<Trip[]>([])
  const [ownProfile, setOwnProfile] = useState(true)

  const [activeTab, setActiveTab] = useState<ProfileTab>('myTrips')
  const [isEditing, setIsEditing] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [heroImageIndex, setHeroImageIndex] = useState(0)
  const [uploadImageError, setUploadImageError] = useState<string | null>(null)

  const [editState, setEditState] = useState({
    name: '',
    bio: '',
    occupation: '',
    location: '',
    travelStyle: '',
    profileImagePath: '',
    profileImageFile: null as File | null,
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
          profileImagePath: profileResponse.profile.profileImagePath ?? '',
          profileImageFile: null,
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

  const fallbackProfileImage = ownProfile
    ? (currentUser?.profilePicture || user?.photoURL)
    : currentUser?.profilePicture

  // Get the base URL dynamically (remove /v1/api from the end)
  const getImageUrl = (filename: string): string => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
    const baseUrl = apiBaseUrl.replace('/v1/api', '')
    return `${baseUrl}/uploads/profiles/${filename}`
  }

  const displayProfileImage = editState.profileImagePath
    ? getImageUrl(editState.profileImagePath)
    : (currentUser?.profileImagePath 
        ? getImageUrl(currentUser.profileImagePath)
        : fallbackProfileImage)

  const profileHeroImages = useMemo(() => {
    const imageUrls = likedTrips
      .map((trip) => trip.imageUrl.trim())
      .filter(Boolean)

    return Array.from(new Set(imageUrls))
  }, [likedTrips])

  const profileHeroImage = profileHeroImages[heroImageIndex] || ''
  const profileLocation = currentUser?.location || 'India'
  const profileOccupation = currentUser?.occupation || 'Traveler'
  const profileTravelStyle = currentUser?.travelStyle?.trim()
  const showHeroImage = Boolean(profileHeroImage)

  useEffect(() => {
    setHeroImageIndex(0)
  }, [profileHeroImages])

  const handleHeroImageError = () => {
    setHeroImageIndex((current) => current + 1)
  }

  const handleEditChange = (
    key: keyof typeof editState,
    value: string
  ) => {
    setEditState((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleProfilePictureSelect = (file: File) => {
    setIsUploadingImage(true)
    setUploadImageError(null)

    try {
      // Validate file type by extension and size
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      
      if (!validExtensions.includes(fileExtension)) {
        throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.')
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File is too large. Maximum size is 5MB.')
      }

      // Store the file for later submission
      setEditState((current) => ({
        ...current,
        profileImageFile: file,
      }))

      setUploadImageError(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to select image'
      setUploadImageError(errorMessage)
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleSave = async () => {
    if (!currentUser?._id) return

    try {
      setIsUploadingImage(true)

      // Create FormData to send image + profile data
      const formData = new FormData()

      // Add profile fields
      if (editState.name) formData.append('name', editState.name)
      if (editState.bio) formData.append('bio', editState.bio)
      if (editState.occupation) formData.append('occupation', editState.occupation)
      if (editState.location) formData.append('location', editState.location)
      if (editState.travelStyle) formData.append('travelStyle', editState.travelStyle)

      // Add image file if selected
      if (editState.profileImageFile) {
        formData.append('profilePicture', editState.profileImageFile)
      }

      // Send FormData instead of JSON
      const response = await apiClient.patch<{ message: string; data: CurrentUser }>(
        `/profile/update-profile/${currentUser._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      const updated = response.data.data
      
      // Update both currentUser and editState with the returned data
      setCurrentUser((prev) => (prev ? { ...prev, ...updated } : updated))
      
      // Update editState with the returned profileImagePath so it displays
      setEditState((prev) => ({
        ...prev,
        profileImagePath: updated.profileImagePath ?? '',
        profileImageFile: null, // Clear the file after successful upload
      }))

      setIsEditing(false)
      setUploadImageError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save profile'
      setUploadImageError(errorMessage)
      console.error(err)
    } finally {
      setIsUploadingImage(false)
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="mx-auto max-w-7xl px-4 pt-8 pb-10 md:px-8">
        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
        >
          ← Back
        </button>

        <header className="relative mx-[calc(50%-50vw)] mt-2 overflow-hidden border-y border-slate-200 bg-linear-to-br from-sky-50 via-white to-amber-50 text-slate-950">
          <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(120deg,rgba(14,165,233,0.25)_1px,transparent_1px),linear-gradient(60deg,rgba(245,158,11,0.18)_1px,transparent_1px)] [background-size:44px_44px]" />

          <div className="relative mx-auto max-w-7xl px-4 py-7 md:px-8 md:py-9">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                Traveler profile
              </p>

              {ownProfile && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-center">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
                <div className="relative h-32 w-32 shrink-0 rounded-full bg-white p-1.5 shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
                  <div className="h-full w-full overflow-hidden rounded-full bg-slate-200">
                    {displayProfileImage ? (
                      <img
                        src={displayProfileImage}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-linear-to-br from-blue-500 via-cyan-500 to-emerald-500">
                        <span className="text-3xl font-bold text-white">
                          {initials}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-3 border-white bg-emerald-400" />
                </div>

                <div className="max-w-3xl pb-1">
                  <h1 className="text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
                    {displayName}
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600">
                    <span>{profileOccupation}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>{profileLocation}</span>
                    {profileTravelStyle && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span>{profileTravelStyle}</span>
                      </>
                    )}
                  </div>

                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
                    {currentUser?.bio ||
                      'Add a short bio to help other travelers get to know you.'}
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="relative h-36 overflow-hidden rounded-3xl border border-white bg-white shadow-[0_18px_45px_rgba(15,23,42,0.11)]">
                  {showHeroImage ? (
                    <img
                      src={profileHeroImage}
                      alt=""
                      onError={handleHeroImageError}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col justify-end bg-white px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                        No package image yet
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-950">
                        Add a cover image to one of your trips.
                      </p>
                    </div>
                  )}
                  {showHeroImage && (
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-white/95 via-white/70 to-transparent p-4">
                      <p className="text-sm font-semibold text-slate-950">
                        {profileTravelStyle || 'Weekend explorer'}
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {createdCount > 0 ? `${createdCount} shared trip${createdCount === 1 ? '' : 's'}` : 'Ready to share the first route'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
                    <p className="text-2xl font-semibold leading-none text-slate-950">
                      {createdCount}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                      Trips
                    </p>
                  </div>

                  {ownProfile && (
                  <div className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
                    <p className="text-2xl font-semibold leading-none text-slate-950">
                      {likedTrips.length}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                      Liked
                    </p>
                  </div>
                  )}
                </div>
              </div>
            </div>
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
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {createdTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onClick={() => navigate(`/trip/${trip.id}`)}
                  />
                ))}
              </div>
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
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {likedTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onClick={() => navigate(`/trip/${trip.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md sm:p-5">
          <div className="max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 shadow-[0_28px_80px_rgba(15,23,42,0.32)] sm:max-h-[90vh] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                  Edit
                </p>

                <h2 className="mt-2 text-2xl font-bold leading-tight sm:text-4xl">
                  Update Profile
                </h2>
              </div>

              <button
                onClick={() => setIsEditing(false)}
                className="shrink-0 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:mt-10 sm:gap-5">
              <input
                value={editState.name}
                onChange={(e) =>
                  handleEditChange('name', e.target.value)
                }
                placeholder="Name"
                className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 sm:px-5 sm:py-4 sm:text-base"
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
                className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 sm:px-5 sm:py-4 sm:text-base"
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
                className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 sm:px-5 sm:py-4 sm:text-base"
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
                className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 sm:px-5 sm:py-4 sm:text-base"
              />

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-600">
                  Profile Picture
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleProfilePictureSelect(file)
                      }
                    }}
                    disabled={isUploadingImage}
                    className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white focus:border-slate-400 sm:px-5 sm:py-4"
                  />
                  {displayProfileImage && (
                    <img
                      src={displayProfileImage}
                      alt="Profile preview"
                      className="h-14 w-14 rounded-full border border-slate-200 object-cover shadow-sm sm:h-12 sm:w-12"
                    />
                  )}
                </div>
                {uploadImageError && (
                  <p className="mt-2 text-xs font-medium text-red-600">{uploadImageError}</p>
                )}
                {isUploadingImage && (
                  <p className="mt-2 text-xs font-medium text-blue-600">Processing image...</p>
                )}
              </div>

              <textarea
                value={editState.bio}
                onChange={(e) =>
                  handleEditChange('bio', e.target.value)
                }
                placeholder="Tell travelers about yourself..."
                className="min-h-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 sm:min-h-37.5 sm:px-5 sm:py-4 sm:text-base"
              />

              <button
                onClick={handleSave}
                className="sticky bottom-0 mt-2 rounded-2xl bg-slate-950 py-3.5 font-semibold text-white shadow-lg shadow-white transition hover:bg-slate-800 sm:static sm:mt-3 sm:py-4 sm:shadow-none"
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
