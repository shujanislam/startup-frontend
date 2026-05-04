import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { useEffect, useState } from 'react'
import { fetchCurrentUser, updateProfile, type CurrentUser } from '../services/dashboardApi'
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
  const [isEditing, setIsEditing] = useState(false)
  const [editState, setEditState] = useState({
    name: '',
    gender: 'prefer_not_to_say',
    profilePicture: '',
    bio: '',
    phone: '',
    location: '',
    dateOfBirth: '',
    occupation: '',
    languages: [] as string[],
    travelStyle: '',
    tags: [] as string[],
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

  const buildEditState = (profile: CurrentUser) => ({
    name: profile.name ?? '',
    gender: profile.gender ?? 'prefer_not_to_say',
    profilePicture: profile.profilePicture ?? '',
    bio: profile.bio ?? '',
    phone: profile.phone ?? '',
    location: profile.location ?? '',
    dateOfBirth: profile.dateOfBirth ?? '',
    occupation: profile.occupation ?? '',
    languages: profile.languages ?? [],
    travelStyle: profile.travelStyle ?? '',
    tags: profile.tags ?? [],
  })

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

  useEffect(() => {
    if (!currentUser) {
      return
    }

    setEditState(buildEditState(currentUser))
    setIsEditing(false)
  }, [currentUser])

  const profileImage = currentUser?.profilePicture || user?.photoURL
  const displayName = getDisplayName(currentUser?.name || user?.displayName, user?.email)
  const initials = getInitials(displayName)
  const tagList = (currentUser?.tags ?? []).filter(Boolean)
  const mongoCreatedAt = currentUser?.createdAt || user?.metadata.creationTime || undefined
  const mongoUpdatedAt = currentUser?.updatedAt || undefined

  const stats = [
    { label: 'Trips', value: String(createdCount) },
    { label: 'Liked', value: String(likedCount) },
    { label: 'Reviews', value: '0' },
  ]

  const profileInfo = [
    { label: 'Gender', value: currentUser?.gender ? currentUser.gender.replace(/_/g, ' ') : 'Not set' },
    { label: 'Date of Birth', value: currentUser?.dateOfBirth ? formatDate(currentUser.dateOfBirth) : 'Not set' },
    { label: 'Location', value: currentUser?.location || 'Not set' },
    { label: 'Occupation', value: currentUser?.occupation || 'Not set' },
    { label: 'Travel Style', value: currentUser?.travelStyle || 'Not set' },
  ]

  const details = [
    { label: 'Email', value: user?.email || currentUser?.email || 'Not available' },
    { label: 'Phone', value: currentUser?.phone || user?.phoneNumber || 'Not added' },
    { label: 'Verified', value: user?.emailVerified ? 'Verified' : 'Not verified' },
    { label: 'Joined', value: formatDate(mongoCreatedAt) },
    { label: 'Profile updated', value: formatDate(mongoUpdatedAt) },
    { label: 'Last login', value: formatDate(user?.metadata.lastSignInTime) },
  ]

  const handleEditChange = (key: keyof typeof editState, value: string | string[]) => {
    setEditState((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const toggleEditItem = (key: 'languages' | 'tags', value: string) => {
    setEditState((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }))
  }

  const languageOptions = [
    'English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi',
    'Gujarati', 'Kannada', 'Urdu', 'Punjabi', 'Spanish', 'French',
    'German', 'Japanese', 'Mandarin',
  ]

  const tagOptions = [
    'Mountains', 'Beaches', 'Solo Travel', 'Luxury', 'Backpacking',
    'Trekking', 'Road Trips', 'Culture', 'Food Trails', 'Wildlife',
    'Photography', 'Spiritual',
  ]

  const handleProfileSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaveError(null)
    setSaveSuccess(null)

    if (!currentUser?._id) {
      setSaveError('Profile data is unavailable right now.')
      return
    }

    if (!editState.name.trim()) {
      setSaveError('Name is required.')
      return
    }

    setIsSaving(true)

    try {
      const updated = await updateProfile(currentUser._id, {
        name: editState.name.trim(),
        gender: editState.gender,
        profilePicture: editState.profilePicture.trim(),
        bio: editState.bio.trim(),
        phone: editState.phone.trim() || undefined,
        location: editState.location.trim() || undefined,
        dateOfBirth: editState.dateOfBirth || undefined,
        occupation: editState.occupation.trim() || undefined,
        languages: editState.languages.length > 0 ? editState.languages : undefined,
        travelStyle: editState.travelStyle || undefined,
        tags: editState.tags.length > 0 ? editState.tags : undefined,
      })
      setCurrentUser((previous) => (previous ? { ...previous, ...updated } : updated))
      setSaveSuccess('Profile updated successfully.')
      setIsEditing(false)
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update profile.')
    } finally {
      setIsSaving(false)
    }
  }

  const startEditing = () => {
    setSaveError(null)
    setSaveSuccess(null)
    setIsEditing(true)
  }

  const cancelEditing = () => {
    if (currentUser) {
      setEditState(buildEditState(currentUser))
    }
    setSaveError(null)
    setSaveSuccess(null)
    setIsEditing(false)
  }

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
                  onClick={() => {
                    setActiveTab('liked')
                    setIsEditing(false)
                  }}
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

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">Profile Details</h2>
              </div>
              {activeTab === 'general' && !isEditing && (
                <button
                  type="button"
                  onClick={startEditing}
                  className="rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                >
                  Edit profile
                </button>
              )}
            </div>

            {activeTab === 'general' ? (
              <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">About you</p>
                    <h3 className="mt-3 text-lg font-semibold text-slate-900">Travel profile</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {currentUser?.bio?.trim()
                        ? currentUser.bio
                        : 'Share your travel style, favorite experiences, or what makes a trip memorable.'}
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {profileInfo.map((info) => (
                        <div key={info.label} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{info.label}</p>
                          <p className="mt-2 text-sm font-semibold text-slate-900">{info.value}</p>
                        </div>
                      ))}
                    </div>
                    {(currentUser?.languages ?? []).length > 0 && (
                      <div className="mt-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Languages</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(currentUser?.languages ?? []).map((lang) => (
                            <span
                              key={lang}
                              className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Tags</p>
                      {tagList.length === 0 ? (
                        <p className="mt-2 text-sm text-slate-500">No tags added yet.</p>
                      ) : (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {tagList.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <form
                      onSubmit={handleProfileSave}
                      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Edit profile</p>
                          <h3 className="mt-2 text-lg font-semibold text-slate-900">Keep your details fresh</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={cancelEditing}
                            disabled={isSaving}
                            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isSaving ? 'Saving...' : 'Save changes'}
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Name</label>
                          <input
                            value={editState.name}
                            onChange={(event) => handleEditChange('name', event.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
                            placeholder="Your name"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Gender</label>
                          <select
                            value={editState.gender}
                            onChange={(event) => handleEditChange('gender', event.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
                          >
                            <option value="prefer_not_to_say">Prefer not to say</option>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                            <option value="non_binary">Non-binary</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Phone</label>
                          <input
                            value={editState.phone}
                            onChange={(event) => handleEditChange('phone', event.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Date of Birth</label>
                          <input
                            type="date"
                            value={editState.dateOfBirth}
                            onChange={(event) => handleEditChange('dateOfBirth', event.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Location</label>
                          <input
                            value={editState.location}
                            onChange={(event) => handleEditChange('location', event.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
                            placeholder="City, Country"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Occupation</label>
                          <input
                            value={editState.occupation}
                            onChange={(event) => handleEditChange('occupation', event.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
                            placeholder="Software Engineer, Student, etc."
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Travel Style</label>
                          <select
                            value={editState.travelStyle}
                            onChange={(event) => handleEditChange('travelStyle', event.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
                          >
                            <option value="">Select style</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Relaxation">Relaxation</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Backpacking">Backpacking</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Solo">Solo</option>
                            <option value="Family">Family</option>
                            <option value="Eco-friendly">Eco-friendly</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Profile photo URL</label>
                          <input
                            value={editState.profilePicture}
                            onChange={(event) => handleEditChange('profilePicture', event.target.value)}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
                            placeholder="https://example.com/avatar.jpg"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Bio</label>
                          <textarea
                            value={editState.bio}
                            onChange={(event) => handleEditChange('bio', event.target.value)}
                            className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
                            placeholder="Tell travelers what makes your trips unforgettable..."
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Languages</label>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {languageOptions.map((lang) => {
                              const selected = editState.languages.includes(lang)
                              return (
                                <button
                                  key={lang}
                                  type="button"
                                  onClick={() => toggleEditItem('languages', lang)}
                                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                                    selected
                                      ? 'border-blue-400 bg-blue-600 text-white'
                                      : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                                  }`}
                                >
                                  {lang}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tags / Interests</label>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {tagOptions.map((tag) => {
                              const selected = editState.tags.includes(tag)
                              return (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => toggleEditItem('tags', tag)}
                                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                                    selected
                                      ? 'border-blue-400 bg-blue-600 text-white'
                                      : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                                  }`}
                                >
                                  {tag}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                      {(saveError || saveSuccess) && (
                        <div
                          className={`mt-4 rounded-xl border px-4 py-3 text-sm font-medium ${
                            saveError
                              ? 'border-red-200 bg-red-50 text-red-700'
                              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {saveError || saveSuccess}
                        </div>
                      )}
                    </form>
                  ) : (
                    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Edit profile</p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900">Make changes when you need to</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Keep your personal information up to date. Click edit to update contact details, travel style, and preferences.
                      </p>
                      <button
                        type="button"
                        onClick={startEditing}
                        className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        Edit profile
                      </button>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Account</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">Identity & access</h3>
                  <div className="mt-5 grid gap-3">
                    {details.map((detail) => (
                      <div
                        key={detail.label}
                        className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {detail.label}
                        </p>
                        <p className="mt-2 break-words text-sm font-semibold text-slate-950">
                          {detail.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
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
