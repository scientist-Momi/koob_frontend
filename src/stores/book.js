import { defineStore } from 'pinia'
import axios from 'axios'
import { API_BASE_URL, API_BASE_URL_LOCAL } from '@/config';

export const useBookStore = defineStore('book', {
  state: () => ({
    userLibrary: [],
    koobLibrary: [],
  }),
  actions: {
    async fetchUserLibrary() {
      try {
        const res = await axios.get(`${API_BASE_URL}/library/user`, {
          withCredentials: true,
        })
        this.userLibrary = res.data.data
      } catch (err) {
        this.userLibrary = []
      }
    },
    async fetchKoobLibrary() {
      try {
        const res = await axios.get(`${API_BASE_URL}/library/koob`, {
          withCredentials: true,
        })
        this.koobLibrary = res.data.data
      } catch (err) {
        this.koobLibrary = []
      }
    },
  },
})
