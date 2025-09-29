<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

onMounted(async () => {
  try {
    // fetch user using the cookie just set by backend
    await userStore.fetchUser()
    if (userStore.isLoggedIn) {
      router.replace('/app/dashboard')
      return
    }
  } catch (e) {
    // ignore, fallback below
  }
  router.replace('/')
})
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <p class="text-lg">Finishing login…</p>
  </div>
</template>
