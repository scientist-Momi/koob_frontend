<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import api from '@/lib/api'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useBookStore } from '@/stores/book'
import { useModalStore } from '@/stores/modal'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import Dashboard from '../Dashboard.vue'
import { API_BASE_URL, API_BASE_URL_LOCAL } from '@/config'

const route = useRoute()
const router = useRouter()
const bookStore = useBookStore()
const loading = ref(false)
const modal = useModalStore()
const userStore = useUserStore()
const similarBooks = ref([])
const toast = useToastStore()
const showFullDescription = ref(false)
const activeTab = ref('overview')

const bookId = Number(route.params.id)
// derive current box contents for the selected box and find the matching book item
const currentBoxItems = computed(() => {
  const id = bookStore.selectedBoxId
  return id ? bookStore.boxContents?.[id] || [] : []
})

const bookItem = computed(() => currentBoxItems.value.find((item) => item.book.id === bookId))

const selectedBoxName = computed(() =>
  bookStore.selectedBox ? bookStore.selectedBox.name : 'Personal Library',
)

onMounted(async () => {
  loading.value = true
  try {
    const userId = userStore.user?.id
    // only call box-scoped recommendations when we have a valid selectedBoxId
    if (bookStore.selectedBoxId) {
      const res = await api.get(
        `/books/box/${bookStore.selectedBoxId}/book/${bookId}/recommendations`,
      )
      similarBooks.value = res.data.data
    } else {
      // no box selected (e.g. direct page load) — don't call the box-scoped endpoint
      // you can optionally call a global recommendations endpoint here instead
      similarBooks.value = []
      console.warn('BookView: selectedBoxId is null; skipping box-scoped recommendations')
    }
  } catch (err) {
    similarBooks.value = []
  }

  // Ensure we have boxes and attempt to locate this book in the user's boxes when
  // selectedBoxId is not set or the book isn't found in the currently selected box.
  try {
    const userId = userStore.user?.id

    // load boxes (this may set a default selectedBoxId)
    await bookStore.fetchBoxes()

    // if we have a selected box, try loading its contents first
    if (bookStore.selectedBoxId && userId) {
      await bookStore.fetchBoxContents(bookStore.selectedBoxId, userId)
    }

    // compute whether the book is available in the currently loaded box contents
    const foundInSelected = currentBoxItems.value.find((item) => item.book.id === bookId)

    if (!foundInSelected && userId) {
      // search other boxes for the book (stop when found)
      for (const box of bookStore.userBoxes || []) {
        // skip the already checked selected box
        if (box.id === bookStore.selectedBoxId) continue
        // fetch contents if not already present
        if (!bookStore.boxContents?.[box.id]) {
          await bookStore.fetchBoxContents(box.id, userId)
        }
        const items = bookStore.boxContents?.[box.id] || []
        const found = items.find((item) => item.book.id === bookId)
        if (found) {
          // set the selected box so the page has the proper context
          await bookStore.selectBox(box.id)
          break
        }
      }
    }
  } catch (err) {
    // ignore — the page will show 'Book not found' if the book truly isn't available
  }
  // small delay to avoid jank when opening the page
  await new Promise((resolve) => setTimeout(resolve, 300))
  loading.value = false
})

async function addToLibrary(book) {
  try {
    const libraryId = bookStore.selectedBoxId
    await api.post('/books/saveToBox', {
      libraryId,
      items: [book],
    })
    similarBooks.value = similarBooks.value.filter((b) => b.id !== book.id)
    const userId = userStore.user?.id
    if (libraryId && userId) {
      await bookStore.fetchBoxContents(libraryId, userId)
    } else {
      await bookStore.fetchUserLibrary()
    }
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
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const month = months[date.getMonth()]
  const day = date.getDate()
  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${month} ${day} at ${hours}:${minutes} ${ampm}`
}

const confirmDelete = () => {
  modal.open('confirm_delete', bookItem)

  router.push({ name: 'DashboardBox', params: { boxId: bookStore.selectedBoxId } })
}
</script>

<template>
  <div v-if="loading">
    <span>Loading...</span>
  </div>
  <div v-else>
    <div v-if="bookItem">
      <div class="flex flex-col">
        <div
          class="px-5 py-2.5 min-h-[63px] flex justify-center border-b-[0.25px] border-gray-300 bg-gray-100"
        >
          <div class="max-w-[1200px] flex items-center justify-between flex-wrap font-light w-full">
            <div class="flex items-center gap-2.5 text-[15px]">
              <router-link
                :to="{ name: 'DashboardBox', params: { boxId: bookStore.selectedBoxId } }"
                class="flex items-center text-[#009799] gap-2 py-1.5 px-1 hover:bg-gray-200 rounded cursor-pointer"
              >
                <span class="material-symbols-outlined"> home_storage </span>
                <span>{{ selectedBoxName }}</span>
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
              <a
                :href="bookItem.book.infoLink"
                target="_blank"
                class="bg-white text-[13px] font-normal border rounded-sm py-1 px-3.5 text-[#009799] flex items-center justify-center gap-1 cursor-pointer hover:bg-gray-200"
              >
                Open book
              </a>
              <button
                @click="confirmDelete"
                class="bg-white text-[13px] font-normal border rounded-sm py-1 px-3.5 text-red-700 flex items-center justify-center gap-1 cursor-pointer hover:bg-gray-200"
              >
                Remove book
              </button>

              <!-- <button
                @click="open = !open"
                class="bg-white text-[13px] font-normal border rounded-sm p-1 pl-3.5 text-[#009799] flex items-center justify-center gap-1 cursor-pointer hover:bg-gray-200"
              >
                <span>More</span>
                <span class="material-symbols-outlined a1 mr-1"> expand_all </span>
              </button> -->
            </div>
          </div>
        </div>
        <!--  -->

        <div
          class="px-5 flex justify-center border-b-[0.25px] border-gray-300 bg-white mb-2.5 mt-1"
        >
          <div class="max-w-[1200px] flex items-center justify-between flex-wrap font-light w-full">
            <!-- Tab buttons -->
            <div class="flex gap-2">
              <button
                :class="[
                  'pb-[15px] px-[10px] pt-[11px] h-[47px] cursor-pointer text-sm',
                  activeTab === 'overview'
                    ? 'border-b border-[#009799] text-[#009799]'
                    : 'text-gray-600 bg-white border-b border-transparent hover:border-gray-500',
                ]"
                @click="activeTab = 'overview'"
              >
                Overview
              </button>

              <button
                :class="[
                  'pb-[15px] px-[10px] pt-[11px] h-[47px] cursor-pointer text-sm',
                  activeTab === 'notes'
                    ? 'border-b border-[#009799] text-[#009799]'
                    : 'text-gray-600 bg-white border-b border-transparent hover:border-gray-500',
                ]"
                @click="activeTab = 'notes'"
              >
                Notes
              </button>
            </div>
          </div>
        </div>

        <!-- Tab content -->
        <div>
          <div
            v-if="activeTab === 'notes'"
            class="flex relative mx-[-20px] bg-white grow items-stretch"
          >
            <!-- private -->
            <div class="w-2/4 pt-2.5 pr-[22px] pl-5">
              <div class="max-w-[578px] mr-0 w-full relative ml-auto">
                <div class="min-h-[230px]">
                  <div class="flex items-center py-2.5 justify-between">
                    <span class="text-[14px] text-gray-800 font-medium">Personal Note</span>
                    <button
                      @click="modal.open('edit_note', bookItem)"
                      class="text-[13px] font-normal border rounded-sm py-1 px-4 bg-[#009799] text-white flex items-center justify-center gap-1 cursor-pointer hover:bg-[#007a7a] transition-all"
                    >
                      Edit Note
                    </button>
                  </div>
                  <div
                    class="w-full rounded-[6px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05),inset_0_1px_2px_0_rgba(78,83,90,0.1)] flex items-center justify-center mb-5 px-[15px] py-[20px]"
                  >
                    <template v-if="bookItem.notes && bookItem.notes.trim().length">
                      <p class="text-[13px] text-gray-700 font-light whitespace-pre-line w-full">
                        {{ bookItem.notes }}
                      </p>
                    </template>
                    <template v-else>
                      <p class="text-[13px] text-gray-400 text-center w-full">No note added yet.</p>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- public -->
            <div class="w-2/4 pt-2.5 pl-[23px] pr-5 pb-5">
              <div class="max-w-[578px] mr-0 w-full relative">
                <div class="min-h-[230px]">
                  <div class="flex items-center py-2.5">
                    <span class="text-[14px] text-gray-800 font-medium">Public Notes</span>
                  </div>
                  <div
                    class="w-full rounded-[6px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05),inset_0_1px_2px_0_rgba(78,83,90,0.1)] flex flex-col gap-1 justify-center mb-5 px-[15px] pb-[15px] pt-[20px]"
                  >
                    <p class="text-[13px] text-gray-400 text-center w-full">Not available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="activeTab === 'overview'"
            class="flex relative mx-[-20px] bg-white grow items-stretch"
          >
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
                  <div class="flex items-center justify-between py-2.5">
                    <span class="text-[14px] text-gray-800 font-medium">Book summary</span>
                    <div
                      class="cursor-pointer hover:bg-gray-100 p-0.5"
                      @click="showFullDescription = true"
                    >
                      <span class="material-symbols-outlined a2"> expand_content </span>
                    </div>
                  </div>
                  <div
                    class="w-full rounded-[6px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05),inset_0_1px_2px_0_rgba(78,83,90,0.1)] bg-white flex items-center justify-center mb-5 px-[15px] py-[20px] relative"
                  >
                    <span class="text-[13px] text-gray-700 font-light">
                      {{ truncate(bookItem.book.description, 460) }}
                    </span>
                    <transition name="fade">
                      <div
                        v-if="showFullDescription"
                        class="absolute left-1/2 z-40 w-full -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-4"
                      >
                        <div class="flex justify-between items-center mb-2">
                          <h2 class="text-[14px] font-medium text-gray-800">Full Summary</h2>
                          <button
                            @click="showFullDescription = false"
                            class="text-gray-500 hover:text-gray-700 cursor-pointer"
                          >
                            <span class="material-symbols-outlined a1"> close </span>
                          </button>
                        </div>
                        <div
                          class="text-[13px] text-gray-700 whitespace-pre-line max-h-[300px] overflow-y-auto"
                        >
                          {{ bookItem.book.description || 'No description available.' }}
                        </div>
                      </div>
                    </transition>
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
                <!-- <div class="min-h-[30px]">
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
              </div> -->
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
                        <time :datetime="bookItem.createdAt">{{
                          formatDateTime(bookItem.createdAt)
                        }}</time>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- similar books -->
                <div class="">
                  <div class="flex items-center py-2.5">
                    <span class="text-[14px] text-gray-800 font-medium">Similar books</span>
                  </div>
                  <div class="flex-col">
                    <template v-if="similarBooks.length">
                      <div
                        v-for="recBook in similarBooks"
                        :key="recBook.id"
                        class="flex items-start justify-between mb-12"
                      >
                        <div class="flex items-start">
                          <div
                            class="w-15 h-15 mr-3 flex items-center justify-center bg-gray-100 rounded"
                          >
                            <template
                              v-if="
                                recBook.volumeInfo.imageLinks &&
                                recBook.volumeInfo.imageLinks.thumbnail
                              "
                            >
                              <img
                                :src="recBook.volumeInfo.imageLinks.thumbnail"
                                alt="Similar book cover"
                                class="h-16 w-12 object-contain rounded"
                              />
                            </template>
                            <template v-else>
                              <span class="text-gray-400 text-xs">No image</span>
                            </template>
                          </div>
                          <div class="flex flex-col">
                            <div class="text-[15px] text-gray-800">
                              {{ recBook.volumeInfo.title }}
                            </div>
                            <div class="text-[13px] text-gray-600 font-light">
                              by-
                              {{
                                recBook.volumeInfo.authors && recBook.volumeInfo.authors.length
                                  ? recBook.volumeInfo.authors.join(', ')
                                  : 'Unknown'
                              }}
                            </div>
                          </div>
                        </div>

                        <button
                          @click="addToLibrary(recBook)"
                          class="text-white px-3 py-1 text-xs cursor-pointer hover:bg-gray-100 flex items-center"
                          title="Add this book to your library"
                        >
                          <span class="material-symbols-outlined text-[#009799]"> add_circle </span>
                        </button>
                      </div>
                    </template>
                    <template v-else>
                      <div class="text-center text-gray-400 py-8 text-[15px]">
                        No recommendations found.
                      </div>
                    </template>
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
