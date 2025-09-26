<script setup>
import { onMounted, ref, computed, onBeforeUnmount } from 'vue'
import { useToastStore } from '@/stores/toast'
import { useBookStore } from '@/stores/book'
import { useModalStore } from '@/stores/modal'

const modal = useModalStore()
const bookStore = useBookStore()
const toast = useToastStore()

const search = ref('')
const openDropdownId = ref(null)

// const handleClickOutside = (event) => {
//   if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
//     openDropdownId.value = null
//   }
// }

function handleClickOutside(event) {
  // Check if the click is inside any dropdown
  const dropdowns = document.querySelectorAll('.dropdown-menu')
  let clickedInside = false
  dropdowns.forEach((dropdown) => {
    if (dropdown.contains(event.target)) {
      clickedInside = true
    }
  })
  if (!clickedInside) {
    openDropdownId.value = null
  }
}
const dropdownRef = ref(null)

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

function show() {
  toast.showToast({
    message: 'User created successfully!',
    type: 'error',
    duration: 10000,
  })
}

onMounted(() => {
  bookStore.fetchUserLibrary()
})

const filteredBooks = computed(() =>
  bookStore.userLibrary.filter((item) => {
    const title = item.book.title?.toLowerCase() || ''
    const authors = (item.book.authors || []).join(' ').toLowerCase()
    const query = search.value.toLowerCase()
    return title.includes(query) || authors.includes(query)
  }),
)
</script>

<template>
  <div class="bg-white px-5 flex flex-col">
    <!-- <small>{{ bookStore.userLibrary[0].book }}</small> -->

    <div class="flex justify-center m-3.5">
      <div class="max-w-[1200px] flex items-center justify-between flex-wrap font-light w-full">
        <div class="border border-[#cfd7e6] rounded-sm flex items-center p-0.5">
          <span class="material-symbols-outlined a2 ml-1.5 text-gray-500"> search </span>
          <input
            v-model="search"
            type="text"
            class="w-full text-[13px] py-1 pr-2.5 pl-2 outline-0 bg-white text-sm text-gray-800"
            placeholder="Filter books in personal library"
            size="32"
          />
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <div class="max-w-[1200px] flex items-center justify-between flex-wrap font-light w-full">
        <div
          v-for="book in filteredBooks"
          :key="book.id"
          class="w-full py-2.5 flex flex-col border-b-[0.5px] border-gray-300 mb-3.5"
        >
          <div class="flex items-center cursor-pointer text-gray-800">
            <router-link
              :to="{ name: 'BookView', params: { id: book.book.id } }"
              class="max-w-[1200px] w-full items-center p-0 hover:bg-gray-50"
            >
              <div class="flex max-w-[1200px] items-center w-full justify-between">
                <div class="flex items-center">
                  <div class="w-8 mr-2 flex justify-center items-center">
                    <!-- <span class="material-symbols-outlined text-[#009799]"> book_2 </span> -->
                    <span class="material-symbols-outlined text-[#009799]"> split_scene_up </span>
                    <!-- <span class="material-symbols-outlined text-[#009799]"> bookmark </span> -->
                  </div>
                  <span class="text-[15px] text-gray-800">{{ book.book.title }}</span>
                </div>

                <ol class="text-[13px] p-0 m-0 list-none items-center flex">
                  <li class="mr-1.5 flex items-center text-gray-500">
                    <!-- <span>by-{{ book.book.authors }}</span> -->
                    <span>
                      by-
                      {{
                        book.book.authors && book.book.authors.length
                          ? book.book.authors.join(', ')
                          : 'Unknown'
                      }}
                    </span>
                  </li>
                  <li><span class="text-gray-500">•</span></li>
                  <li class="mx-1.5 flex items-center text-gray-500">
                    <span>pages-{{ book.book.pageCount }}</span>
                  </li>
                  <li><span class="text-gray-500">•</span></li>
                  <li class="mx-1.5 flex items-center text-gray-500">
                    <span>lang-{{ book.book.language }}</span>
                  </li>
                </ol>
              </div>
            </router-link>
              <div
                @click="modal.open('confirm_delete', book)"
                class="flex items-center justify-end ml-3 cursor-pointer"
              >
                <span class="material-symbols-outlined a1 text-red-600 hover:text-red-400"> delete </span>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.a1 {
  font-size: 17px;
}

.custom-shadow {
  box-shadow:
    0 1px 10px rgba(0, 151, 153, 0.3),
    0 0.5px 1px rgba(0, 151, 153, 0.15),
    0 0 0 0.5px rgba(0, 151, 153, 0.1);
}
</style>
