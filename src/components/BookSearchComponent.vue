<script setup>
import { ref, onBeforeUnmount, onMounted, watch } from 'vue'
import { useToastStore } from '@/stores/toast'
import axios from 'axios'
import { useBookStore } from '@/stores/book'
const bookStore = useBookStore()

const dropdownRef = ref(null)
const open = ref(false)
const search = ref('')
const results = ref([])
const loading = ref(false)
const toast = useToastStore()
let debounceTimeout

// async function searchBooks() {
//   loading.value = true
//   try {
//     const res = await axios.get('http://localhost:8080/api/v1/books/searchBooks', {
//       params: { q: search.value },
//     })
//     results.value = res.data.data // adjust to your API response
//   } catch (err) {
//     results.value = []
//   }
//   loading.value = false
// }

watch(search, (val) => {
  if (!val) {
    results.value = []
    return
  }
  loading.value = true
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/books/search', {
        params: { q: val },
        withCredentials: true,
      })
      results.value = res.data.data // adjust to your API response
    } catch (err) {
      results.value = []
    }
    loading.value = false
  }, 400)
})


async function addToLibrary(book) {
  try {
    await axios.post('http://localhost:8080/api/v1/books/save', book, {
      withCredentials: true
    })
    results.value = results.value.filter((b) => b.id !== book.id)
    await bookStore.fetchUserLibrary() // Refresh the store
    toast.showToast({
      message: 'Book has been added',
      type: 'success',
      duration: 5000,
    })
  } catch (err) {
    toast.showToast({
      message: 'Book could not be added, please try again',
      type: 'error',
      duration: 5000,
    })
  }
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    open.value = false
    search.value = ''
  }
}

onMounted(() => {
  //   userStore.fetchUser()
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <div class="w-[390px] my-[10px]">
      <input
        @focus="open = true"
        v-model="search"
        type="text"
        class="w-full border border-[#cfd7e6] rounded-sm h-[34px] py-3 px-6 outline-0 bg-white text-sm text-gray-800"
        placeholder="Search for your favourite book, research paper..."
      />
    </div>
    <div
    v-if="open"
      class="absolute left-1/2 -translate-x-1/2 mt[-1px] max-h-[600px] overflow-scroll w-[750px] bg-white rounded custom-shadow z-10"
    >
      <div class="py-[10px] text-[12px] text-center" v-if="loading">
        <p>Loading...</p>
      </div>
      <div v-else class="py-2.5 px-2.5 text-[12px]">
        <div v-if="results.length === 0" class="text-center">
          <p>Nothing to show</p>
        </div>
        <ul v-else>
          <li
            v-for="book in results"
            :key="book.id"
            class="flex items-center justify-between px-4 py-2 border-b border-gray-200"
          >
            <div class="flex gap-3">
              <img
                :src="book.volumeInfo.imageLinks.smallThumbnail"
                alt=""
                class="h-[90px] w-auto object-contain"
              />
              <div class="flex flex-col">
                <span class="text-[13.5px] font-normal">{{ book.volumeInfo.title }}</span>
                <span class="text-gray-500"
                  >by-
                  {{
                    book.volumeInfo.authors && book.volumeInfo.authors.length
                      ? book.volumeInfo.authors.join(', ')
                      : 'Unknown'
                  }}</span
                >
              </div>
            </div>
            <button
              @click="addToLibrary(book)"
              class="text-white px-3 py-1 text-xs cursor-pointer hover:bg-gray-100 flex items-center"
              title="Add this book to your library"
            >
              <span class="material-symbols-outlined text-[#009799]"> add_circle </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-shadow {
  box-shadow:
    0 3px 20px rgba(0, 151, 153, 0.3),
    0 1px 2px rgba(0, 151, 153, 0.15),
    0 0 0 1px rgba(0, 151, 153, 0.1);
}
</style>
