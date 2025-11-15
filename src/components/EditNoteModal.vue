<script setup>
import { ref, computed, watch } from 'vue'
import api from '@/lib/api'
import { useModalStore } from '@/stores/modal'
import { useUserStore } from '@/stores/user'
import { useBookStore } from '@/stores/book'
import { useToastStore } from '@/stores/toast'

const modal = useModalStore()
const userStore = useUserStore()
const bookStore = useBookStore()
const toast = useToastStore()

const book = computed(() => modal.data)
const noteText = ref('')
const saving = ref(false)

watch(
  () => modal.isOpen,
  (isOpen) => {
    if (isOpen && modal.type === 'edit_note' && book.value) {
      noteText.value = book.value.notes || ''
    }
  },
)


watch(
  () => book.value,
  (b) => {
    if (modal.isOpen && modal.type === 'edit_note' && b) {
      noteText.value = b.notes || ''
    }
  },
)


async function saveNote() {
  if (!book.value || !book.value.book?.id) return
  const bookId = book.value.book.id
  const userId = userStore.user?.id
  saving.value = true
  try {
    await api.put(`/boxes/items/${bookId}/notes`, { notes: noteText.value })
    if (bookStore.selectedBoxId && userId) {
      await bookStore.fetchBoxContents(bookStore.selectedBoxId, userId)
    } else {
      toast.showToast({ message: 'Failed to reload item', type: 'error', duration: 5000 })
    }

    toast.showToast({ message: 'Note updated', type: 'success', duration: 4000 })
    modal.close()
  } catch (err) {
    toast.showToast({ message: 'Failed to update note', type: 'error', duration: 5000 })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div v-if="modal.isOpen && modal.type === 'edit_note'">
    <div class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div
        class="bg-white rounded-[10px] shadow-[0_0_0_2px_#009799] w-full max-w-[640px] flex flex-col"
      >
        <div class="flex p-2 px-3 bg-gray-100 text-[15px] items-center mb-2">
          <span class="material-symbols-outlined text-[#009799] text-3xl mr-2">note_add</span>
          <h2 class="font-semibold text-gray-900 text-center">Edit Note</h2>
        </div>

        <div class="px-4 pb-4">
          <p class="text-[13px] text-gray-700 mb-3">
            Edit your personal note for
            <span class="font-medium text-[#009799]">{{ book?.book?.title }}</span>
          </p>

          <textarea
            v-model="noteText"
            rows="6"
            class="w-full resize-y border rounded p-3 text-sm text-gray-800 mb-4"
          ></textarea>

          <div class="flex justify-between text-[13px]">
            <button
              @click="modal.close"
              class="mr-4 h-[36px] flex items-center justify-center text-center py-1 px-4 bg-white text-[#009799] rounded-[4px] border border-[#009799] hover:bg-[#efffff] cursor-pointer"
            >
              Cancel
            </button>
            <button
              :disabled="saving"
              @click="saveNote"
              class="shadow bg-[#009799] text-white h-[36px] flex items-center justify-center text-center py-1 px-4 rounded-[4px] border border-[#009799] hover:bg-[#007a7a] cursor-pointer disabled:opacity-60"
            >
              <span v-if="!saving">Save</span>
              <span
                v-else
                class="animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full"
              ></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note-label {
  font-size: 13px;
}
</style>
