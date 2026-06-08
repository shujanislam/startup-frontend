import apiClient from '../../../lib/apiClient.ts'

export interface CurrentUser {
  _id?: string
  uid: string
  firebaseId?: string
  email: string | null
  isAdmin: boolean
  name?: string
  profilePicture?: string
  profileImagePath?: string
  bio?: string
  gender?: string
  phone?: string
  location?: string
  dateOfBirth?: string
  occupation?: string
  languages?: string[]
  travelStyle?: string
  tags?: string[]
  onboardingComplete?: boolean
  createdAt?: string
  updatedAt?: string
}

interface CurrentUserResponse {
  user: CurrentUser
}

interface RawCurrentUser extends Partial<Omit<CurrentUser, 'isAdmin'>> {
  isAdmin?: unknown
}

type RawCurrentUserResponse =
  | {
      user?: RawCurrentUser
      data?: RawCurrentUser | { user?: RawCurrentUser }
    }
  | RawCurrentUser

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const hasCurrentUserFields = (value: unknown): value is RawCurrentUser => {
  if (!isRecord(value)) return false

  return (
    typeof value.uid === 'string' ||
    typeof value.firebaseId === 'string' ||
    typeof value.email === 'string' ||
    typeof value._id === 'string'
  )
}

const getRawCurrentUser = (data: RawCurrentUserResponse): RawCurrentUser | null => {
  if (!isRecord(data)) return null

  if (hasCurrentUserFields(data.user)) return data.user

  if (hasCurrentUserFields(data.data)) return data.data

  if (isRecord(data.data) && hasCurrentUserFields(data.data.user)) {
    return data.data.user
  }

  if (hasCurrentUserFields(data)) return data

  return null
}

export interface ShowProfileResponse {
  profile: CurrentUser
  ownProfile: boolean
}

export interface UpdateProfilePayload {
  name?: string
  gender?: string
  profilePicture?: string
  bio?: string
  email?: string
  password?: string
  phone?: string
  location?: string
  dateOfBirth?: string
  occupation?: string
  languages?: string[]
  travelStyle?: string
  tags?: string[]
  onboardingComplete?: boolean
}

const fetchCurrentUser = async (): Promise<CurrentUserResponse> => {
  const response = await apiClient.get<RawCurrentUserResponse>('/me')
  const user = getRawCurrentUser(response.data)

  if (!user) {
    throw new Error('Unable to load your account details from the backend.')
  }

  return {
    user: {
      ...user,
      uid: user.uid ?? user.firebaseId ?? user._id ?? '',
      email: user.email ?? null,
      isAdmin: user.isAdmin === true,
    },
  }
}

const updateProfile = async (
  profileId: string,
  payload: UpdateProfilePayload
): Promise<CurrentUser> => {
  const response = await apiClient.patch<{ message: string; data: CurrentUser }>(
    `/profile/update-profile/${profileId}`,
    payload
  )

  return response.data.data
}

const fetchProfile = async (profileId: string): Promise<ShowProfileResponse> => {
  const response = await apiClient.get<ShowProfileResponse>(`/profile/show-profile/${profileId}`)
  return response.data
}

export { fetchCurrentUser, fetchProfile, updateProfile }
