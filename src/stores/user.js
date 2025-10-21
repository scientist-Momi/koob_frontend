import { defineStore } from 'pinia'
import api from '@/lib/api'
import { API_BASE_URL, API_BASE_URL_LOCAL } from '@/config'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: false,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
    async fetchUser() {
      if (this.user || this.loading) return
      this.loading = true
      try {
        const res = await api.get('/auth/me')
        this.user = res.data.data
      } catch (err) {
        this.user = null
      } finally {
        this.loading = false
      }
    },
    async logout() {
      await api.post('/auth/logout')
      this.user = null
    },
  },
})
