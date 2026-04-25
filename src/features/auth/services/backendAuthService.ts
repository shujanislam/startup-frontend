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

const registerBackendUser = async (payload: RegisterPayload): Promise<void> => {
  await apiClient.post('/auth/register', payload)
}

const loginBackendUser = async (payload: LoginPayload): Promise<void> => {
  await apiClient.post('/auth/login', payload)
}

const syncBackendUser = async (): Promise<void> => {
  await apiClient.post('/auth/sync')
}

export { loginBackendUser, registerBackendUser, syncBackendUser }