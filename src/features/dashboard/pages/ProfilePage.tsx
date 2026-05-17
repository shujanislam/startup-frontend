import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { useEffect, useState } from 'react'
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
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/v1/api'
    const baseUrl = apiBaseUrl.replace('/v1/api', '')
    return `${baseUrl}/uploads/profiles/${filename}`
  }

  const displayProfileImage = editState.profileImagePath
    ? getImageUrl(editState.profileImagePath)
    : (currentUser?.profileImagePath 
        ? getImageUrl(currentUser.profileImagePath)
        : fallbackProfileImage)

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
                {displayProfileImage ? (
                  <img
                    src={displayProfileImage}
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

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-slate-600">
                  Profile Picture
                </label>
                <div className="flex gap-2">
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
                    className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-slate-400"
                  />
                  {displayProfileImage && (
                    <img
                      src={displayProfileImage}
                      alt="Profile preview"
                      className="h-12 w-12 rounded-full border border-slate-200 object-cover shadow-sm"
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
