import apiClient from '../../../lib/apiClient.ts'

interface CurrentUserResponse {
  user: {
    uid: string
    email: string | null
  }
}

const fetchCurrentUser = async (): Promise<CurrentUserResponse> => {
  const response = await apiClient.get<CurrentUserResponse>('/me')
  return response.data
}

export { fetchCurrentUser }