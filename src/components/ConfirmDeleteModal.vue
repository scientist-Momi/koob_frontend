<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useModalStore } from '@/stores/modal'
import { useUserStore } from '@/stores/user'
import { useBookStore } from '@/stores/book'
const bookStore = useBookStore()
const userStore = useUserStore()
import { useToastStore } from '@/stores/toast'
const toast = useToastStore()

const modal = useModalStore()
const book = computed(() => modal.data)

async function deleteBookFromLibrary(bookId) {
  const userId = userStore.user?.id
  if (!userId || !bookId) return

  try {
    await axios.delete(
      `http://localhost:8080/api/v1/library/user/${userId}/book/${bookId}`,
      { withCredentials: true },
    )
    await bookStore.fetchUserLibrary()
    modal.close()
    toast.showToast({
      message: 'Book has been removed',
      type: 'success',
      duration: 5000,
    })
  } catch (err) {
    toast.showToast({
      message: 'Error deleting book',
      type: 'error',
      duration: 5000,
    })
  }
}
</script>

<template>
  <div v-if="modal.isOpen && modal.type === 'confirm_delete'">
    <div v-if="book">
      <div class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
        <div
          class="bg-white rounded-[10px] shadow-[0_0_0_2px_#009799] w-full max-w-[420px] flex flex-col"
        >
          <div class="flex p-2 px-3 bg-gray-100 text-[15px] items-center mb-2">
            <span class="material-symbols-outlined text-[#009799] text-4xl mr-2"
              >delete_forever</span
            >
            <h2 class="font-semibold text-gray-900 text-center">Remove Book?</h2>
          </div>

          <div class="px-4 pb-4">
            <p class="text-[13px] text-gray-700 mb-6">
              You are about to remove
              <span class="font-medium text-[#009799]">{{ book.book.title }}</span> from your
              library. This action cannot be undone. 
            </p>
            <div class="flex justify-between text-[13px]">
              <button
                @click="modal.close"
                class="mr-4 h-[32px] flex items-center justify-center text-center py-1 px-4 bg-white text-[#009799] rounded-[4px] border border-[#009799] hover:bg-[#efffff] cursor-pointer"
              >
                Cancel
              </button>
              <button
                @click="deleteBookFromLibrary(book.book.id)"
                class="shadow-[0_0_0_1px_#E3E7EF] bg-[#009799] text-white h-[32px] flex items-center justify-center text-center py-1 px-4 rounded-[4px] cursor-pointer border border-[#009799] hover:bg-[#006b6c] cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else><p>Book not defined</p></div>
  </div>
</template>

<style scoped></style>
