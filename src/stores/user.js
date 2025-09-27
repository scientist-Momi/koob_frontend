import { defineStore } from 'pinia'
import axios from 'axios'
import { API_BASE_URL, API_BASE_URL_LOCAL } from '@/config';

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
        const res = await axios.get(`${API_BASE_URL}/auth/me`, {
          withCredentials: true,
        })
        this.user = res.data.data
      } catch (err) {
        this.user = null
      } finally {
        this.loading = false
      }
    },
    async logout() {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true })
      this.user = null
    },
  },
})
