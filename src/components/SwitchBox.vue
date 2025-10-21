<script setup>
import { onMounted, ref, computed, onBeforeUnmount } from 'vue'
import { useBookStore } from '@/stores/book'
import { useRouter } from 'vue-router'

const emit = defineEmits(['select'])
const bookStore = useBookStore()
const search = ref('')
const router = useRouter()

onMounted(() => {
  bookStore.fetchBoxes()
})

const filteredBoxes = computed(() =>
  bookStore.userBoxes.filter((item) => {
    const name = item.name?.toLowerCase() || ''
    const query = search.value.toLowerCase()
    return name.includes(query)
  }),
)

function pickBox(box) {
  // update store (keeps store in sync if other components read it)
  bookStore.selectBox(box.id)
  // update route (push to create history entry)
  router.push({ name: 'DashboardBox', params: { boxId: box.id } })
  // tell parent to close dropdown
  emit('select', box)
}
</script>

<template>
  <div class="text-[14px] text-gray-500">
    <div class="p-3">
      <div class="flex items-center gap-2 mb-2">
        <span class="material-symbols-outlined text-[#009799]"> home_storage </span>
        <span>Switch Box</span>
      </div>
      <div class="border border-[#cfd7e6] rounded-sm flex items-center p-0.5">
        <span class="material-symbols-outlined a2 ml-1.5 text-gray-500"> search </span>
        <input
          v-model="search"
          type="text"
          class="w-full text-[12px] py-1 pr-2.5 pl-2 outline-0 bg-white text-sm text-gray-800"
          placeholder="Find or create a box..."
          size="32"
        />
      </div>
    </div>
    <div class="border-y border-y-gray-200 px-3 py-2 flex items-center justify-between">
      <span>Your Boxes</span>
      <RouterLink :to="{ name: 'new-library' }">
        <div class="flex items-center text-[13px] gap-1 text-[#009799] cursor-pointer">
          <span class="material-symbols-outlined a2"> add </span>
          <span>New Box</span>
        </div>
      </RouterLink>
    </div>
    <div class="p-3 px-2 text-[13px]">
      <template v-if="filteredBoxes.length">
        <div
          v-for="box in filteredBoxes"
          :key="box.id"
          @click="pickBox(box)"
          :class="[
            'bg-white flex items-center justify-between hover:bg-gray-100 cursor-pointer mb-1 p-1.5',
            bookStore.selectedBoxId === box.id ? 'ring-2 ring-[#009799]' : '',
          ]"
        >
          <div class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[#009799] a1"> inventory_2 </span>
            <span>{{ box.name }}</span>
          </div>
          <span v-if="box.isPrivate" class="border rounded-xl px-0.5 text-[11px] text-orange-600"
            >private</span
          >
          <span v-else class="border rounded-xl px-0.5 text-[11px] text-blue-600">public</span>
        </div>
      </template>
      <template v-else>
        <div class="w-full flex flex-col items-center justify-center">
          <span class="text-[13px] text-gray-400 mb-4"
            >No box named <span>{{ search }}</span> yet. Create it!</span
          >
          <RouterLink :to="{ name: 'new-library' }">
            <div
              class="bg-[#009799] text-white px-4 text-[12px] py-2 rounded shadow hover:bg-[#007a7a] transition-all cursor-pointer"
            >
              Add New Box
            </div>
          </RouterLink>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.a2 {
  font-size: 17px;
}
.a1 {
  font-size: 20px;
}
</style>
