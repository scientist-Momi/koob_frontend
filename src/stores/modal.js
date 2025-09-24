import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    isOpen: false,
    data: null,
    type: null,
  }),
  actions: {
    open(type, data) {
      this.data = data
      this.type = type
      this.isOpen = true
    },
    close() {
      this.data = null
      this.type = null
      this.isOpen = false
    },
  },
})
