import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { auth } from './firebase'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/v1/api',
})

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const currentUser = auth.currentUser

    if (!currentUser) {
      return config
    }

    const idToken = await currentUser.getIdToken()
    const headers = AxiosHeaders.from(config.headers)

    headers.set('Authorization', `Bearer ${idToken}`)
    config.headers = headers

    return config
  },
)

export default apiClient
