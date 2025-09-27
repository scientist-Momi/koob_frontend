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
import axios from 'axios';
import { API_BASE_URL, API_BASE_URL_LOCAL, API_BASE } from '@/config';

export default {
  data() {
    return {
      user: null,
      error: null,
    };
  },
  methods: {
    loginWithGoogle() {
      // Redirect to backend OAuth2 login
      window.location.href = `${API_BASE}/oauth2/authorization/google`;
    },
    async getCurrentUser() {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(`${API_BASE_URL}/auth/me`, {
          withCredentials: true,
        });
        this.user = res.data;
        this.error = null;
      } catch (err) {
        this.user = null;
        this.error = err.response ? err.response.data : err.message;
      }
    },
    async logout() {
      try {
        axios.defaults.withCredentials = true;
        await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
          withCredentials: true,
        });
        this.user = null;
        this.error = 'Logged out';
      } catch (err) {
        this.error = err.response ? err.response.data : err.message;
      }
    },
  },
};
</script>