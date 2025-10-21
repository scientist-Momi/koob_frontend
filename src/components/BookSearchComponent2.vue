<script setup>
import { ref, onBeforeUnmount, onMounted, watch, computed } from 'vue'
import { useToastStore } from '@/stores/toast'
import api from '@/lib/api'
import { useBookStore } from '@/stores/book'
import { API_BASE_URL, API_BASE_URL_LOCAL } from '@/config'
const bookStore = useBookStore()

const dropdownRef = ref(null)
const open = ref(false)
const search = ref('')
const results = ref([])
const loading = ref(false)
const toast = useToastStore()
let debounceTimeout
const selectedBooks = ref([]) // array of selected book ids
const targetBoxId = ref(null)
const saving = ref(false)

const selectedCount = computed(() => selectedBooks.value.length)

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
      const res = await api.get('/books/search', {
        params: { q: val },
      })
      results.value = res.data.data
    } catch (err) {
      results.value = []
    }
    loading.value = false
  }, 400)
})

async function addToLibrary(book) {
  try {
    await api.post('/books/save', book)
    results.value = results.value.filter((b) => b.id !== book.id)
    // Refresh the store
    await bookStore.fetchUserLibrary()
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

function toggleSelect(book) {
  const i = selectedBooks.value.indexOf(book.id)
  if (i === -1) {
    // add
    selectedBooks.value.push(book.id)
    // set default target box immediately when the first book is picked
    if (!targetBoxId.value && bookStore.userBoxes && bookStore.userBoxes.length) {
      targetBoxId.value = bookStore.selectedBoxId || bookStore.userBoxes[0].id
    }
  } else {
    // remove
    selectedBooks.value.splice(i, 1)
  }
}

// keep a sensible default target box if the user's boxes load later
watch(
  () => bookStore.userBoxes,
  (boxes) => {
    if (boxes && boxes.length && !targetBoxId.value) {
      targetBoxId.value = bookStore.selectedBoxId || boxes[0].id
    }
  },
  { immediate: true },
)

async function fillBox() {
  if (!targetBoxId.value || selectedBooks.value.length === 0) return
  saving.value = true
  try {
    // gather the full book objects for the selected ids
    const booksToSend = results.value.filter((b) => selectedBooks.value.includes(b.id))

    // Assumption: backend accepts { libraryId, books: [...] } to save multiple books.
    // If your API expects a different shape, adapt this payload accordingly.
    await api.post('/books/save', {
      libraryId: targetBoxId.value,
      books: booksToSend,
    })

    // remove saved books from the results list
    results.value = results.value.filter((b) => !selectedBooks.value.includes(b.id))
    selectedBooks.value = []

    // refresh local library state
    await bookStore.fetchUserLibrary()

    toast.showToast({
      message: 'Books added to box',
      type: 'success',
      duration: 5000,
    })
  } catch (err) {
    toast.showToast({
      message: 'Could not add books. Please try again.',
      type: 'error',
      duration: 5000,
    })
  } finally {
    saving.value = false
  }
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    open.value = false
    search.value = ''
    selectedBooks.value = []
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
      class="absolute left-1/2 -translate-x-1/2 mt[-1px] w-[750px] max-h-[600px] overflow-scroll bg-white rounded custom-shadow z-10"
    >
      <div class="py-[10px] text-[12px] text-center " v-if="loading">
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
            class="flex items-center justify-between  px-4 py-2 border-b border-gray-200"
          >
         
            <div class="flex gap-3 items-center">
              <input
                type="checkbox"
                :id="`chk-${book.id}`"
                class="mr-2 cursor-pointer"
                :checked="selectedBooks.includes(book.id)"
                @change.prevent="toggleSelect(book)"
              />
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
                <!-- <span class="border border-[#009799] p-1.5">{{ book.volumeInfo.description }}</span> -->
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="addToLibrary(book)"
                class="text-white px-3 py-1 text-xs cursor-pointer hover:bg-gray-100 flex items-center"
                title="Add this book to your library"
              >
                <!-- <span class="material-symbols-outlined text-[#009799]"> add_circle </span> -->
                <!-- <span class="material-symbols-outlined text-[#009799]"> summarize </span> -->
                <span class="material-symbols-outlined text-[#009799]"> chat_info </span>
              </button>
            </div>
          
          </li>
        </ul>
      </div>

      <!-- Batch action bar placed inside dropdown, sticky to bottom of the scrollable container -->
      <div
        v-if="selectedCount > 0"
        class="sticky bottom-0 w-full bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between z-20"
      >
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-700">{{ selectedCount }} selected</span>
          <select v-model="targetBoxId" class="border rounded p-1 text-sm">
            <option v-for="box in bookStore.userBoxes" :key="box.id" :value="box.id">
              {{ box.name }}
            </option>
          </select>
        </div>
        <div>
          <button
            :disabled="!targetBoxId || saving"
            @click="fillBox"
            class="bg-[#009799] text-white px-3 py-1 rounded text-sm disabled:opacity-50"
          >
            <span v-if="!saving">Add Book(s)</span>
            <span v-else>Saving...</span>
          </button>
        </div>
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
