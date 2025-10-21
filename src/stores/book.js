import { defineStore } from 'pinia'
import api from '@/lib/api'
import { API_BASE_URL, API_BASE_URL_LOCAL } from '@/config'
import { useUserStore } from '@/stores/user'

export const useBookStore = defineStore('book', {
  state: () => ({
    userLibrary: [],
    koobLibrary: [],
    userBoxes: [],
    selectedBoxId: null,
    // cache box contents by libraryId
    boxContents: {},
    boxLoading: {},
    boxErrors: {},
  }),
  actions: {
    async fetchUserLibrary() {
      try {
        const res = await api.get('/library/user')
        this.userLibrary = res.data.data
      } catch (err) {
        this.userLibrary = []
      }
    },
    async fetchKoobLibrary() {
      try {
        const res = await api.get('/library/koob')
        this.koobLibrary = res.data.data
      } catch (err) {
        this.koobLibrary = []
      }
    },
    async fetchBoxes() {
      try {
        const res = await api.get('/boxes')
        this.userBoxes = res.data.data
        // If no box is selected yet, pick the first one by default
        if (!this.selectedBoxId && this.userBoxes && this.userBoxes.length) {
          this.selectedBoxId = this.userBoxes[0].id
        }
      } catch (err) {
        this.userBoxes = []
      }
    },
    async fetchBoxContents(libraryId, userId) {
      console.log('entered', libraryId, userId)
      if (!libraryId || !userId) return null
      try {
        const res = await api.post('/boxes/items', { libraryId, userId })
        this.boxContents = this.boxContents || {}
        this.boxContents[libraryId] = res.data?.data || []
      } catch (err) {
        this.boxContents = this.boxContents || {}
        this.boxContents[libraryId] = []
      }
    },
    async selectBox(boxId) {
      this.selectedBoxId = boxId
      const user = useUserStore()
      // Attempt to fetch contents for the newly selected box if we have a userId available
      const userId = user.user.id
      if (userId) {
        try {
          await this.fetchBoxContents(boxId, userId)
        } catch (err) {
          // swallow errors here; components can react to empty results if needed
        }
      }
    },
  },
  getters: {
    selectedBox: (state) => state.userBoxes.find((b) => b.id === state.selectedBoxId) || null,
  },
})
