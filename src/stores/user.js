import { defineStore } from 'pinia'
import axios from 'axios'

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
        const res = await axios.get('http://localhost:8080/api/v1/auth/me', {
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
      await axios.post('http://localhost:8080/api/v1/auth/logout', {}, { withCredentials: true })
      this.user = null
    },
  },
})
