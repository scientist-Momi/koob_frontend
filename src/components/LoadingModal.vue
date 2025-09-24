<script setup>
import { useModalStore } from '@/stores/modal'

const modal = useModalStore()
</script>

<template>
  <div v-if="modal.isOpen && modal.type === 'loading'">
    <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center">
        <span class="material-symbols-outlined text-[#009799] a1 animate-spin"
          >clock_loader_10</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.a1{
font-size: 3rem;
}
</style>