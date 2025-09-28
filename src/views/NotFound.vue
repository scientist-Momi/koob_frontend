<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
    <div class="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
      <span class="material-symbols-outlined" style="font-size: 60px; color: #009799">error</span>
      <h1 class="text-3xl font-bold text-[#009799] mb-2">404 - Not Found</h1>
      <p class="text-gray-600 mb-6 text-center">
        Sorry, the page you are looking for does not exist.<br />You may have followed a broken link
        or mistyped the address.
      </p>
      <router-link
        to="/"
        class="bg-[#009799] text-white px-5 py-2 rounded shadow hover:bg-[#007a7a] transition-all font-semibold"
      >
        Go back to Home
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  if (userStore.isLoggedIn) {
    router.replace({ name: 'Dashboard' })
  }
})
</script>

<style scoped>
.material-symbols-outlined {
  font-size: 60px;
  color: #009799;
}
</style>
