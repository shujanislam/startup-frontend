import apiClient from '../../../lib/apiClient.ts'

export interface CurrentUser {
  _id?: string
  uid: string
  firebaseId?: string
  email: string | null
  isAdmin: boolean
  name?: string
  profilePicture?: string
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
  const response = await apiClient.get<CurrentUserResponse>('/me')

  if (typeof response.data?.user?.isAdmin !== 'boolean') {
    throw new Error('Backend /me response is missing isAdmin. Restart the backend server to load the latest API changes.')
  }

  return response.data
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

export { fetchCurrentUser, updateProfile }
