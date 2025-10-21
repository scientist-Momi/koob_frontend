<script setup>
import { ref, onBeforeUnmount, onMounted, computed, watch } from 'vue'
import PersonalLibraryView from '@/views/library/components/PersonalLibraryView.vue'
import { useBookStore } from '@/stores/book'
import SwitchBox from '@/components/SwitchBox.vue'
import { useRoute } from 'vue-router'

const bookStore = useBookStore()
const open = ref(false)
const open2 = ref(false)
const route = useRoute()
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    open.value = false
  }
  if (dropdownRef2.value && !dropdownRef2.value.contains(event.target)) {
    open2.value = false
  }
}

onMounted(async () => {
  await bookStore.fetchBoxes()

  const paramBoxId = route.params.boxId || route.query.box
  if (paramBoxId) {
    bookStore.selectBox(Number(paramBoxId))
  } else if (!bookStore.selectedBoxId && bookStore.userBoxes.length) {
    bookStore.selectBox(bookStore.userBoxes[0].id) // default
    // Optionally update the route to reflect the default:
    router.replace({ name: 'DashboardBox', params: { boxId: bookStore.selectedBoxId } })
  }
})

watch(
  () => route.params.boxId,
  (newId) => {
    if (newId) bookStore.selectBox(Number(newId))
  },
)

const currentBoxName = computed(() =>
  bookStore.selectedBox ? bookStore.selectedBox.name : 'Personal Box',
)

const dropdownRef = ref(null)
const dropdownRef2 = ref(null)
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <div class="flex flex-col">
    <div
      class="px-5 py-2.5 min-h-[63px] flex justify-center border-b-[0.25px] border-gray-300 bg-gray-100"
    >
      <div class="max-w-[1200px] flex items-center justify-between flex-wrap font-light w-full">
        <div class="relative" ref="dropdownRef2">
          <div
            @click="open2 = !open2"
            class="flex text-[15px] items-center text-[#009799] gap-2 cursor-pointer hover:bg-gray-200 p-1.5 rounded-sm"
          >
            <span class="material-symbols-outlined"> home_storage </span>
            <span>{{ currentBoxName }}</span>
            <span class="material-symbols-outlined a1 mr-1"> expand_all </span>
          </div>

          <div
            v-if="open2"
            class="absolute left-0 mt-0.5 min-w-[300px] min-h-[300px] bg-white rounded shadow-lg z-10 overflow-hidden outline outline-gray-300"
          >
            <SwitchBox @select="open2 = false" />
          </div>
        </div>

        <div class="relative" ref="dropdownRef">
          <button
            @click="open = !open"
            class="bg-white text-[14px] font-normal border rounded-sm p-1 pl-3.5 text-[#009799] flex items-center justify-center gap-1 cursor-pointer hover:bg-gray-200"
          >
            <span>New</span>
            <span class="material-symbols-outlined a1 mr-1"> expand_all </span>
          </button>

          <div
            v-if="open"
            class="absolute right-0 mt-0.5 min-w-[270px] bg-white rounded custom-shadow z-10 overflow-hidden"
          >
            <ul class="text-[13px] font-light text-gray-500">
              <li class="border-b border-gray-200">
                <RouterLink
                  :to="{ name: 'Dashboard' }"
                  aria-disabled="true"
                  tabindex="-1"
                  class="px-4 py-2 flex items-center gap-2.5 rounded m-0.5 pointer-events-none opacity-60 bg-gray-50"
                >
                  <span class="material-symbols-outlined a2"> view_apps </span>
                  <span>Create New Box</span>
                  <small
                    class="ml-2 px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 text-[9px] font-semibold"
                    >Unavailable</small
                  >
                </RouterLink>
              </li>
              <li class="border-b border-gray-200">
                <RouterLink
                  :to="{ name: 'new-library' }"
                  class="px-4 py-2 flex items-center gap-2.5 rounded m-0.5 bg-gray-50"
                >
                  <span class="material-symbols-outlined a2"> view_apps </span>
                  <span>Create New Box</span>
                  <!-- <small
                    class="ml-2 px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 text-[9px] font-semibold"
                    >Unavailable</small
                  > -->
                </RouterLink>
              </li>
              <li class="border-b border-gray-100">
                <RouterLink
                  :to="{ name: 'Settings' }"
                  aria-disabled="true"
                  tabindex="-1"
                  class="px-4 py-2 flex items-center gap-2.5 pointer-events-none opacity-60 bg-gray-50"
                >
                  <span class="material-symbols-outlined a2"> pageview </span>
                  <span>Get New Book</span>
                  <small
                    class="ml-2 px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 text-[9px] font-semibold"
                    >Unavailable</small
                  >
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- Main content -->
    <!-- <PersonalLibraryView /> -->
    <router-view />
  </div>
</template>

<style scoped>
.a1 {
  font-size: 15px;
}
.a2 {
  font-size: 18px;
}
.custom-shadow {
  box-shadow:
    0 3px 20px rgba(0, 151, 153, 0.3),
    0 1px 2px rgba(0, 151, 153, 0.15),
    0 0 0 1px rgba(0, 151, 153, 0.1);
}
</style>
