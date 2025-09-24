import { defineStore } from 'pinia'
import axios from 'axios'

export const useBookStore = defineStore('book', {
  state: () => ({
    userLibrary: [],
    koobLibrary: [],
  }),
  actions: {
    async fetchUserLibrary() {
      try {
        const res = await axios.get('http://localhost:8080/api/v1/library/user', {
          withCredentials: true,
        })
        this.userLibrary = res.data.data
      } catch (err) {
        this.userLibrary = []
      }
    },
    async fetchKoobLibrary() {
      try {
        const res = await axios.get('http://localhost:8080/api/v1/library/koob', {
          withCredentials: true,
        })
        this.koobLibrary = res.data.data
      } catch (err) {
        this.koobLibrary = []
      }
    },
  },
})
