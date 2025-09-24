<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBookStore } from '@/stores/book'
import { useModalStore } from '@/stores/modal'

const route = useRoute()
const bookStore = useBookStore()
const loading = ref(false)
const modal = useModalStore()

onMounted(async () => {
  loading.value = true
  if (!bookStore.userLibrary.length) {
    await bookStore.fetchUserLibrary()
  }
  await new Promise((resolve) => setTimeout(resolve, 1000))
  loading.value = false
})

watch(
  () => loading.value,
  (isLoading) => {
    if (isLoading) {
      modal.open('loading')
    } else {
      modal.close()
    }
  },
  { immediate: true },
)

function truncate(text, maxLength) {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

function formatDateTime(dateString) {
  const date = new Date(dateString)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const month = months[date.getMonth()]
  const day = date.getDate()
  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${month} ${day} at ${hours}:${minutes} ${ampm}`
}

// Assume route param is :id and matches book.book.id
const bookId = Number(route.params.id)
const bookItem = computed(() => bookStore.userLibrary.find((item) => item.book.id === bookId))
</script>

<template>
  <div v-if="loading">
    <span>Loading...</span>
  </div>
  <div v-else>
    <div v-if="bookItem">
      <div class="flex flex-col">
        <div
          class="px-5 py-2.5 min-h-[63px] flex justify-center border-b-[0.25px] border-gray-300 bg-gray-100 mb-5"
        >
          <div class="max-w-[1200px] flex items-center justify-between flex-wrap font-light w-full">
            <div class="flex items-center gap-2.5 text-[15px]">
              <router-link
                :to="{ name: 'Dashboard' }"
                class="flex items-center text-[#009799] gap-2 py-1.5 px-1 hover:bg-gray-200 rounded cursor-pointer"
              >
                <span class="material-symbols-outlined"> home_storage </span>
                <span>Personal Library</span>
              </router-link>
              <span class="material-symbols-outlined"> chevron_right </span>
              <div class="flex items-center">
                <div class="w-8 mr-1 flex justify-center items-center">
                  <span class="material-symbols-outlined text-[#009799]"> split_scene_up </span>
                </div>
                <span class="text-[15px] text-gray-800">{{ bookItem.book.title }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2.5">
              <button
                class="bg-white text-[13px] font-normal border rounded-sm py-1 px-3.5 text-[#009799] flex items-center justify-center gap-1 cursor-pointer hover:bg-gray-200"
              >
                Open book
              </button>
              <button
                @click="open = !open"
                class="bg-white text-[13px] font-normal border rounded-sm p-1 pl-3.5 text-[#009799] flex items-center justify-center gap-1 cursor-pointer hover:bg-gray-200"
              >
                <span>More</span>
                <span class="material-symbols-outlined a1 mr-1"> expand_all </span>
              </button>
            </div>
          </div>
        </div>
        <!--  -->
        <div class="flex relative mx-[-20px] bg-white grow items-stretch">
          <!-- side1 -->
          <div class="w-2/4 pt-2.5 pr-[22px] pl-5">
            <div class="max-w-[578px] mr-0 w-full relative ml-auto">
              <!-- individual -->
              <div class="min-h-[230px]">
                <div class="flex items-center py-2.5">
                  <span class="text-[14px] text-gray-800 font-medium">Thumbnail</span>
                </div>
                <div
                  class="w-full rounded-[6px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05),inset_0_1px_2px_0_rgba(78,83,90,0.1)] bg-gray-100 flex items-center justify-center mb-5"
                >
                  <template v-if="bookItem.book.thumbnailUrl">
                    <img
                      :src="bookItem.book.thumbnailUrl"
                      alt="Book cover"
                      class="h-[300px] w-auto object-contain"
                    />
                  </template>
                  <template v-else>
                    <span class="text-gray-500 text-sm">No image available</span>
                  </template>
                </div>
              </div>
              <div class="min-h-[30px]">
                <div class="flex items-center py-2.5">
                  <span class="text-[14px] text-gray-800 font-medium">Book summary</span>
                </div>
                <div
                  class="w-full rounded-[6px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05),inset_0_1px_2px_0_rgba(78,83,90,0.1)] bg-white flex items-center justify-center mb-5 px-[15px] py-[20px]"
                >
                  <span class="text-[13px] text-gray-700 font-light">
                    {{ truncate(bookItem.book.description, 460) }}
                  </span>
                </div>
              </div>
              <div class="min-h-[30px]">
                <div class="flex items-center py-2.5">
                  <span class="text-[14px] text-gray-800 font-medium">Authors</span>
                </div>
                <div
                  class="w-full rounded-[6px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05),inset_0_1px_2px_0_rgba(78,83,90,0.1)] bg-white flex items-center justify-center mb-5 px-[15px] py-[20px]"
                >
                  <span class="text-[13px] text-gray-900 font-normal">
                    {{
                      bookItem.book.authors && bookItem.book.authors.length
                        ? bookItem.book.authors.join(', ')
                        : 'Unknown'
                    }}
                  </span>
                </div>
              </div>
              <div class="min-h-[30px]">
                <div class="flex items-center py-2.5">
                  <span class="text-[14px] text-gray-800 font-medium"
                    >Publisher and published date</span
                  >
                </div>
                <div
                  class="w-full rounded-[6px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05),inset_0_1px_2px_0_rgba(78,83,90,0.1)] bg-white flex items-center justify-between mb-5 px-[15px] py-[20px]"
                >
                  <div class="flex items-center justify-center gap-1">
                    <span class="material-symbols-outlined a3 text-gray-400">
                      business_center
                    </span>
                    <span class="text-[13px] text-gray-900 font-normal">
                      {{ bookItem.book.publisher }}
                    </span>
                  </div>

                  <div class="flex text-[13px] items-center gap-1.5 justify-center">
                    <span class="material-symbols-outlined a2 text-gray-500"> date_range </span>
                    <span>{{ bookItem.book.publishedDate }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- side2 -->
          <div class="w-2/4 pt-2.5 pl-[23px] pr-5 pb-5">
            <div class="max-w-[578px] mr-0 w-full relative">
              <div class="min-h-[30px]">
                <div class="flex items-center py-2.5">
                  <span class="text-[14px] text-gray-800 font-medium">Book subtitle</span>
                </div>
                <div
                  class="w-full rounded-[6px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05),inset_0_1px_2px_0_rgba(78,83,90,0.1)] bg-white flex items-center justify-center mb-5 px-[15px] py-[20px]"
                >
                  <span class="text-[13px] text-gray-900 font-normal">
                    {{
                      bookItem.book.subtitle
                        ? truncate(bookItem.book.subtitle, 60)
                        : 'No subtitle available'
                    }}
                  </span>
                </div>
              </div>
              <div class="min-h-[30px]">
                <div class="flex items-center py-2.5">
                  <span class="text-[14px] text-gray-800 font-medium">Page count</span>
                </div>
                <div
                  class="w-full rounded-[6px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05),inset_0_1px_2px_0_rgba(78,83,90,0.1)] bg-white flex items-center justify-center mb-5 px-[15px] py-[20px]"
                >
                  <span class="text-[13px] text-gray-900 font-normal">
                    {{
                      bookItem.book.pageCount ? bookItem.book.pageCount : 'Page count unavailable'
                    }}
                    pages
                  </span>
                </div>
              </div>
              <div class="min-h-[30px]">
                <div class="flex items-center py-2.5">
                  <span class="text-[14px] text-gray-800 font-medium">Language</span>
                </div>
                <div
                  class="w-full rounded-[6px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05),inset_0_1px_2px_0_rgba(78,83,90,0.1)] bg-white flex items-center justify-center mb-5 px-[15px] py-[20px]"
                >
                  <span class="text-[13px] text-gray-900 font-normal">
                    {{
                      bookItem.book.language ? bookItem.book.language : 'Language is unavailable'
                    }}
                  </span>
                </div>
              </div>
              <div class="">
                <div class="flex items-center py-2.5">
                  <span class="text-[14px] text-gray-800 font-medium">Activities</span>
                </div>
                <div class="w-full flex items-center mb-5 py-[20px]">
                  <div class="mr-[15px]">
                    <span class="material-symbols-outlined a4"> bookmark_added </span>
                  </div>
                  <div class="flex flex-col">
                    <div class="text-[13px]">
                        <span class="font-semibold">you: </span>
                        <span class="font-light text-green-600">New Book added to library.</span>
                    </div>
                    <div class="text-[13px] text-gray-400">
                        <time :datetime="bookItem.addedAt">{{ formatDateTime(bookItem.addedAt) }}</time>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Book not found.</p>
    </div>
  </div>
</template>

<style scoped>
.a1 {
  font-size: 15px;
}
.a2 {
  font-size: 18px;
}
.a3 {
  font-size: 24px;
}
.a4 {
  font-size: 30px;
}
</style>
