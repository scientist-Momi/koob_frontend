<script setup>
import { ref } from 'vue'
import api from '@/lib/api'
import { API_BASE_URL, API_BASE_URL_LOCAL } from '@/config'

// state
const query = ref('')
const results = ref([])
const loading = ref(false)
const message = ref('')

// search books from backend (which calls Google Books API)
const searchBooks = async () => {
  if (!query.value) return
  loading.value = true
  message.value = ''

  try {
    const res = await api.get('/books/search', {
      params: { q: query.value },
    })
    results.value = res.data.data // ApiResponse.data
    console.log('results ', results.value)
  } catch (err) {
    message.value = 'Error fetching books.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// save book to backend
const saveBook = async (book) => {
  // console.log(book)
  try {
    const res = await api.post('/books/save', book)
    message.value = res.data.message // ApiResponse.message
  } catch (err) {
    message.value = 'Error saving book.'
    console.error(err)
  }
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">📚 Book Search</h1>

    <!-- Search input -->
    <div class="flex gap-2 mb-4">
      <input
        v-model="query"
        type="text"
        placeholder="Search for books..."
        class="border p-2 flex-1 rounded"
        @keyup.enter="searchBooks"
      />
      <button
        @click="searchBooks"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Search
      </button>
    </div>

    <!-- Loading spinner -->
    <div v-if="loading" class="text-gray-500">Searching...</div>

    <!-- Message -->
    <div v-if="message" class="mt-2 text-green-600">{{ message }}</div>

    <!-- Search results -->
    <div v-if="results.length" class="mt-6 space-y-4">
      <div
        v-for="book in results"
        :key="book.googleBookId"
        class="border p-4 rounded shadow-sm flex gap-4"
      >
        <img
          v-if="book.thumbnail"
          :src="book.thumbnail"
          alt="Book cover"
          class="w-24 h-32 object-cover"
        />
        <div class="flex-1">
          <h2 class="font-semibold text-lg">{{ book.title }}</h2>
          <p class="text-sm text-gray-600">By: {{ book.authors?.join(', ') }}</p>
          <p class="text-sm text-gray-500">{{ book.publisher }} • {{ book.publishedDate }}</p>
          <p class="text-sm mt-2 line-clamp-3">{{ book.description }}</p>
          <button
            @click="saveBook(book)"
            class="mt-3 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Save to Library
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* for truncating description */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
