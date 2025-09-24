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
      window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    },
    async getCurrentUser() {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get('http://localhost:8080/api/v1/auth/me', {
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
        await axios.post('http://localhost:8080/api/v1/auth/logout', {}, {
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