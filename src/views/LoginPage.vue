<template>
  <div>
    <button @click="loginWithGoogle" class="border bg-red-500 p-2">Login with Google</button>
    <button @click="logout" class="border bg-red-500 p-2">Logout</button>
    <div v-if="user">
      <h3>User Info</h3>
      <pre>{{ user }}</pre>
    </div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script>
import api from '@/lib/api'
import { API_BASE_URL, API_BASE_URL_LOCAL, API_BASE } from '@/config'

export default {
  data() {
    return {
      user: null,
      error: null,
    }
  },
  methods: {
    loginWithGoogle() {
      // Redirect to backend OAuth2 login
      window.location.href = `${API_BASE}/oauth2/authorization/google`
    },
    async getCurrentUser() {
      try {
        const res = await api.get('/auth/me')
        this.user = res.data
        this.error = null
      } catch (err) {
        this.user = null
        this.error = err.response ? err.response.data : err.message
      }
    },
    async logout() {
      try {
        await api.post('/auth/logout')
        this.user = null
        this.error = 'Logged out'
      } catch (err) {
        this.error = err.response ? err.response.data : err.message
      }
    },
  },
}
</script>
