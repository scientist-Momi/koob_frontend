<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { useBookStore } from '@/stores/book'
import { useUserStore } from '@/stores/user'
import api from '@/lib/api'

const bookStore = useBookStore()
const userStore = useUserStore()
const router = useRouter()
const name = ref('')
const isPrivate = ref(true) // default to Private Box
const error = ref('')
const loading = ref(false)
const toast = useToastStore()

function selectPrivate(val) {
  isPrivate.value = val
}

async function createBox() {
  error.value = ''
  if (!name.value.trim()) {
    error.value = 'Please enter a box name.'
    return
  }

  // ensure user is present
  const userId = userStore.user?.id
  if (!userId) {
    toast.showToast({
      message: 'You must be logged in to create a box.',
      type: 'error',
      duration: 5000,
    })
    loading.value = false
    return
  }

  // Ensure name is formatted (spaces -> dashes) before creating
  formatName()

  const payload = {
    userId,
    name: name.value,
    isPrivate: Boolean(isPrivate.value),
  }

  // Debug: log exact payload that will be sent to the backend
  // Inspect this in DevTools console to confirm isPrivate is correct
  console.log('Create box payload ->', payload)

  loading.value = true
  try {
    const res = await api.post('/boxes', payload)
    const ok = res?.status >= 200 && res.status < 300
    if (!ok) {
      const msg = res.data?.message || `Unexpected response (${res.status})`
      toast.showToast({ message: msg, type: 'error', duration: 7000 })
      return
    }
    await bookStore.fetchBoxes()
    toast.showToast({
      message: 'Box has been created',
      type: 'success',
      duration: 5000,
    })
    router.push({ name: 'DashboardDefault' })
  } catch (err) {
    const errorMsg = extractApiErrorMessage(err) // or inline parsing
    toast.showToast({ message: errorMsg, type: 'error', duration: 7000 })
  } finally {
    loading.value = false
  }
}

function formatName() {
  // Replace any sequence of whitespace with a single dash and trim dashes
  let s = name.value.trim()
  if (!s) return
  s = s.replace(/\s+/g, '-') // collapse spaces to single dashes
  // remove leading/trailing dashes if any
  s = s.replace(/^[-]+|[-]+$/g, '')
  name.value = s
}
</script>

<template>
  <div class="flex flex-col">
    <div
      class="px-5 py-2.5 min-h-[63px] flex justify-center border-b-[0.25px] border-gray-300 bg-gray-100"
    >
      <div class="max-w-[1200px] flex items-center justify-center flex-wrap font-light w-full">
        <div class="flex text-[15px] items-center gap-2">
          <span>Create New Box</span>
        </div>
      </div>
    </div>
    <div class="flex bg-white flex-col grow shrink-0 px-5 relative">
      <form class="py-10 relative flex justify-center mt-0">
        <div class="w-full max-w-[40rem]">
          <div class="">
            <div class="text-[15px] text-gray-700 font-semibold">Box Name</div>
            <label for="" class="text-[13px] text-gray-500 font-light max-w-full"
              >Give this box a unique name. For example, ai-research-papers-for-exam.</label
            >
            <div class="mb-8 a1">
              <div class="w-full flex">
                <input
                  v-model="name"
                  @blur="formatName"
                  class="w-full text-[13px] py-[5px] px-2.5 outline-0 bg-white text-sm text-gray-800 border border-[#cfd7e6] rounded-sm"
                  maxlength="30"
                  autocomplete="off"
                  placeholder="Box-name"
                  aria-describedby="nameError"
                  aria-invalid=""
                  type="text"
                />
              </div>
              <div v-if="error" id="nameError" class="text-red-600 text-sm mt-2">{{ error }}</div>
            </div>
            <div class="text-[15px] text-gray-700 font-semibold">Visibility</div>
            <label for="" class="text-[13px] text-gray-500 font-light max-w-full"
              >Choose who can see and add to this box.</label
            >
            <ul class="a1 mb-2.5 pb-2.5 border-b border-gray-200">
              <li
                :class="[
                  'px-[15px] py-2.5 items-center flex cursor-pointer rounded-[6px] mb-2.5',
                  isPrivate
                    ? 'bg-white shadow-[0_0_0_2px_#009799]'
                    : 'bg-white shadow-[0_0_0_1px_#E3E7EF]',
                ]"
                @click="selectPrivate(true)"
                role="radio"
                :aria-checked="String(!!isPrivate)"
              >
                <div class="ml-2.5 grow shrink basis-auto">
                  <div class="text-[14px]">Private Box</div>
                  <div class="text-[12px] text-gray-500">
                    Only you the creator can view and add to the box.
                  </div>
                </div>
                <div class="flex items-center">
                  <span class="material-symbols-outlined"> lock </span>
                </div>
              </li>
              <li
                :class="[
                  'px-[15px] py-2.5 items-center flex cursor-pointer rounded-[6px] mb-2.5',
                  !isPrivate
                    ? 'bg-white shadow-[0_0_0_2px_#009799]'
                    : 'bg-white shadow-[0_0_0_1px_#E3E7EF]',
                ]"
                @click="selectPrivate(false)"
                role="radio"
                :aria-checked="String(!isPrivate)"
              >
                <div class="ml-2.5 grow shrink basis-auto">
                  <div class="text-[14px]">Public Box</div>
                  <div class="text-[12px] text-gray-500">
                    Only you the creator can view and add to the box.
                  </div>
                </div>
                <div class="flex items-center">
                  <span class="material-symbols-outlined"> lock_open_right </span>
                </div>
              </li>
            </ul>

            <div class="flex mt-5 justify-between text-[13px]">
              <RouterLink
               
                :to="{ name: 'DashboardBox', params: { boxId: bookStore.selectedBoxId } }"
                class="mr-4 h-[32px] flex items-center justify-center text-center py-1 px-4 bg-white text-[#009799] rounded-[4px] border border-[#009799] hover:bg-[#efffff]"
                >Cancel</RouterLink
              >
              <button
                @click.prevent="createBox"
                :disabled="loading"
                class="shadow-[0_0_0_1px_#E3E7EF] bg-[#009799] text-white h-[32px] flex items-center justify-center text-center py-1 px-4 rounded-[4px] cursor-pointer border border-[#009799] hover:bg-[#006b6c] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="loading">Creating...</span>
                <span v-else>Create box</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.a1 {
  margin-top: 15px;
}
</style>
