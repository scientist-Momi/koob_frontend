import axios from 'axios'
import { API_BASE_URL } from '@/config'

// Central axios instance — use this everywhere instead of importing axios directly.
// Benefits:
// - Single place to change baseURL, timeout, interceptors
// - Easier to switch between environments via VITE_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true, // include cookies by default (useful for cookie-based auth)
})

// Optional: request/response interceptors for auth/error handling
api.interceptors.request.use(
  (config) => {
    // Add any common headers here if needed
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // You can add global error handling here (e.g., refresh token, redirect on 401)
    return Promise.reject(err)
  },
)

export default api

export function buildUrl(path) {
  // Ensure path does not have a leading / when combining with baseURL handled by axios
  if (!path) return API_BASE_URL
  return `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}
