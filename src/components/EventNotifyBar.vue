<script setup>
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const barClass = (type) => {
  if (type === 'success') return 'bg-green-200 text-green-800'
  if (type === 'error') return 'bg-red-200 text-red-800'
  return 'bg-blue-200 text-blue-800'
}
</script>

<template>
  <div class="z-49">
    <transition-group name="slide-down" tag="div">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :class="`${barClass(toast.type)} flex justify-center`"
      >
        <div class="max-w-[1200px] flex items-center justify-between flex-wrap font-light w-full">
          <div class="w-full py-2.5 flex">
            <span class="material-symbols-outlined mr-2">
              {{
                toast.type === 'success' ? 'task_alt' : toast.type === 'error' ? 'error' : 'info'
              }}
            </span>
            <span class="text-[15px]">
              {{ toast.message }}
            </span>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition:
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.4s;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
