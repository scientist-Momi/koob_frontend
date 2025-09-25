<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useToastStore } from '@/stores/toast'
import { useBookStore } from '@/stores/book'
const bookStore = useBookStore()
const toast = useToastStore()
const messages = ref([
  {
    sender: 'agent',
    text: 'Hi! I am your AI agent. How can I help you today? I can help you with searching for books, and adding books to your library.',
  },
])
const input = ref('')
const loading = ref(false)
const error = ref('')

async function sendMessage() {
  if (!input.value.trim()) return
  messages.value.push({ sender: 'user', text: input.value })
  loading.value = true
  error.value = ''
  try {
    const res = await axios.post('http://localhost:8080/api/v1/agent/chat', input.value, {
      headers: {
        'Content-Type': 'text/plain',
      },
      withCredentials: true,
    })
    messages.value.push({ sender: 'agent', text: res.data.data })
    input.value = ''
    await bookStore.fetchUserLibrary()
  } catch (err) {
    let errorMsg = 'Error communicating with the agent.'
    if (err.response?.data?.status === 'error' && err.response?.data?.message) {
      errorMsg = err.response.data.message
    } else if (err.response?.data) {
      errorMsg = err.response.data
    } else if (err.message) {
      errorMsg = err.message
    }
    messages.value.push({ sender: 'agent', text: errorMsg })
  } finally {
    loading.value = false
  }
}
import { useModalStore } from '@/stores/modal'

const modal = useModalStore()
</script>

<template>
  <div v-if="modal.isOpen && modal.type === 'agent_modal'">
    <div class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div
        class="bg-white rounded-[10px] shadow-[0_0_0_2px_#009799] w-full max-w-[800px] min-h-[400px] overflow-scroll max-h-[700px] flex flex-col"
      >
        <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <span class="font-semibold text-[17px] text-[#009799]">Koob Agent</span>
          <button class="text-gray-400 hover:text-gray-600 text-xl" @click="modal.close">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="flex-1 px-5 py-4 overflow-y-auto bg-gray-50">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="mb-3 flex"
            :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              :class="
                msg.sender === 'user' ? 'bg-[#009799] text-white' : 'bg-gray-200 text-gray-800'
              "
              class="rounded-lg px-4 py-2 max-w-[80%] text-[14px] font-normal break-words whitespace-pre-line"
            >
              {{ msg.text }}
            </div>
          </div>
          <div v-if="loading" class="flex justify-start mb-3">
            <div
              class="bg-gray-200 text-gray-500 rounded-lg px-4 py-2 max-w-[80%] text-[14px] font-normal animate-pulse"
            >
              Agent is typing...
            </div>
          </div>
        </div>
        <form class="px-5 py-4 border-t border-gray-200 flex gap-2" @submit.prevent="sendMessage">
          <input
            v-model="input"
            type="text"
            class="flex-1 border border-[#009799] rounded-sm h-[38px] px-3 outline-0 bg-white text-sm text-gray-800"
            placeholder="Type your request..."
            :disabled="loading"
          />
          <button
            type="submit"
            class="bg-[#009799] text-white px-4 rounded font-medium text-sm h-[38px] flex items-center justify-center"
            :disabled="loading || !input.trim()"
          >
            <span class="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>
    </div>
  </div>
  <!-- <div v-if="modal.isOpen && modal.type === 'agent_modal'">
    <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center">
        <h1>Agent modal</h1>
      </div>
    </div>
  </div> -->
</template>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
