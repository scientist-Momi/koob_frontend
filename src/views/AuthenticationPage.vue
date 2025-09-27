<script setup>
import { ref } from 'vue'
import KoobLogo from '@/assets/icons/koob_white.svg'
import GoogleIcon from '@/assets/icons/google.svg'
import { API_BASE_URL, API_BASE_URL_LOCAL, API_BASE } from '@/config';

const loading = ref(false)
const error = ref('')

const loginWithGoogle = () => {
  loading.value = true
  error.value = ''
  try {
    window.location.href = `${API_BASE}/oauth2/authorization/google`
  } catch (e) {
    error.value = 'Failed to redirect. Please try again.'
    loading.value = false
  }
}
</script>

<template>
  <div
    class="h-screen bg-gradient-to-b from-[#009799] to-gray-900 text-white flex flex-col justify-center"
  >
    <div class="flex flex-col flex-1 items-center justify-center w-full">
      <KoobLogo class="w-22 h-25 mb-18" />
      <div class="bg-white rounded-lg max-w-[500px] w-full mx-auto p-8 flex flex-col items-center">
        <h1 class="text-[#009799] text-[24px] font-extralight mb-4 text-center">
          Log in to your account
        </h1>
        <div class="p-3 border border-gray-200 mb-6 text-gray-600 flex gap-2 rounded">
          <span class="material-symbols-outlined"> rocket_launch </span>
          <div class="text-sm">
            <p class="font-medium">Heads up!</p>
            <p class="font-light">
              By clicking the button below, you will be redirected to Google to securely sign in.
              After authentication, you'll be brought back here and logged in automatically.
            </p>
          </div>
        </div>

        <button
          @click="loginWithGoogle"
          :disabled="loading"
          class="cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-[#006a6c] to-[#009799] hover:from-[#00787a] hover:to-[#009799] px-6 py-3 rounded-sm shadow transition w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <GoogleIcon class="w-6 h-6 bg-white rounded-full p-1" />
          <span class="text-[18px] text-white font-light">Sign in with Google</span>
          <span
            v-if="loading"
            class="ml-2 animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full"
          ></span>
        </button>
        <div v-if="error" class="text-red-500 text-sm mt-3 text-center">{{ error }}</div>
        <!-- <p class="text-xs text-gray-400 mt-6 text-center">
          By signing in, you agree to our <a href="/privacy" class="underline">Privacy Policy</a>.
        </p>
        <p class="text-xs text-gray-400 mt-2 text-center">
          Need help? <a href="mailto:support@koob.com" class="underline">Contact support</a>.
        </p> -->
      </div>
    </div>
    <footer class="w-full text-center text-xs text-gray-300 py-6">
      &copy; {{ new Date().getFullYear() }} Koob. Crafted by
      <a
        href="https://oolumomi.dev"
        target="_blank"
        rel="noopener"
        class="text-[#009799] hover:underline"
      >
        OOlumomi </a
      >.
    </footer>
  </div>
</template>
