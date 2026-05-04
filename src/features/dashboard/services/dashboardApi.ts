import apiClient from '../../../lib/apiClient.ts'

export interface CurrentUser {
  uid: string
  email: string | null
  isAdmin: boolean
  name?: string
  profilePicture?: string
}

interface CurrentUserResponse {
  user: CurrentUser
}

const fetchCurrentUser = async (): Promise<CurrentUserResponse> => {
  const response = await apiClient.get<CurrentUserResponse>('/me')

  if (typeof response.data?.user?.isAdmin !== 'boolean') {
    throw new Error('Backend /me response is missing isAdmin. Restart the backend server to load the latest API changes.')
  }

  return response.data
}

export { fetchCurrentUser }
