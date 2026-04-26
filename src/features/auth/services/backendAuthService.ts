import apiClient from '../../../lib/apiClient.ts'

interface RegisterPayload {
  name: string
  email: string
  password: string
  gender: string
}

interface LoginPayload {
  email: string
  password: string
}

interface RegisterResponse {
  message: string
  user: Record<string, unknown>
  customToken: string
}

const registerBackendUser = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const { data } = await apiClient.post<RegisterResponse>('/auth/register', payload)
  return data
}

const loginBackendUser = async (payload: LoginPayload): Promise<void> => {
  await apiClient.post('/auth/login', payload)
}

const syncBackendUser = async (): Promise<void> => {
  await apiClient.post('/auth/sync')
}

export { loginBackendUser, registerBackendUser, syncBackendUser }