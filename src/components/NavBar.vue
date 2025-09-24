<script setup>
import { ref, onBeforeUnmount, onMounted } from 'vue'
import KoobLogo from '@/assets/icons/koob_light.svg'
import AiIcon from '@/assets/icons/ai-chat.svg'
import BookSearchComponent from './BookSearchComponent.vue'
import { useUserStore } from '@/stores/user'
import { useModalStore } from '@/stores/modal'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const modal = useModalStore()
const router = useRouter()

const open = ref(false)
const open2 = ref(false)

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    open.value = false
  }
  if (dropdownRef2.value && !dropdownRef2.value.contains(event.target)) {
    open2.value = false
  }
}

const dropdownRef = ref(null)
const dropdownRef2 = ref(null)

onMounted(() => {
  //   userStore.fetchUser()
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

const handleLogout = async () => {
  open.value = false
  modal.open('loading')
  await new Promise((resolve) => setTimeout(resolve, 2500))
  await userStore.logout()
  modal.close()
  router.push('/')
}

const handleAgent = () => {
  modal.open('agent_modal')
}
</script>

<template>
  <div class="sticky top-0 z-500">
    <div class="bg-white px-[15px] flex items-center justify-between">
      <RouterLink :to="{ name: 'Dashboard' }">
        <div class="flex text-[#009799] gap-1 items-center my-[10px] pl-0 ml-0">
          <KoobLogo class="w-8 h-8" />
          <h1 class="font-bold text-base">KOOB</h1>
        </div>
      </RouterLink>
      <BookSearchComponent />
      <div class="flex gap-3 items-center">
        <div @click="handleAgent" class="cursor-pointer my-[10px]">
          <AiIcon class="w-[30px] h-[30px]" />
        </div>

        <div class="relative" ref="dropdownRef2">
          <div @click="open2 = !open2" class="cursor-pointer my-[10px]">
            <div
              class="rounded-full overflow-hidden w-[30px] h-[30px] flex items-center justify-center"
            >
              <span class="material-symbols-outlined text-[#009799]"> dashboard </span>
            </div>
          </div>
          <div
            v-if="open2"
            class="absolute right-0 mt-2 w-[240px] bg-white rounded custom-shadow z-10 overflow-hidden"
          >
            <ul class="text-[14px] font-light">
              <li class="border-b border-gray-100 text-[#009799]">
                <RouterLink
                  :to="{ name: 'Dashboard' }"
                  class="cursor-pointer px-4 py-2 hover:bg-gray-50 flex items-center gap-2.5 active:border-[1.5px] rounded m-0.5 active:border-[#009799]"
                  @click="open2 = false"
                >
                  <span class="material-symbols-outlined"> view_apps </span>
                  <span>Dashboard</span>
                </RouterLink>
              </li>
              <li class="border-b border-gray-100 text-[#009799]">
                <RouterLink
                  :to="{ name: 'Settings' }"
                  class="cursor-pointer px-4 py-2 hover:bg-gray-50 flex items-center gap-2.5"
                  @click="open2 = false"
                >
                  <span class="material-symbols-outlined"> view_in_ar </span>
                  <span>Browse Boxes</span>
                </RouterLink>
              </li>
              <li class="border-b border-gray-100 text-[#009799]">
                <RouterLink
                  :to="{ name: 'Settings' }"
                  class="cursor-pointer px-4 py-2 hover:bg-gray-50 flex items-center gap-2.5"
                  @click="open2 = false"
                >
                  <span class="material-symbols-outlined"> note_stack </span>
                  <span>Browse Libraries</span>
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>

        <div class="relative" ref="dropdownRef">
          <div @click="open = !open" class="cursor-pointer my-[10px]">
            <div
              class="rounded-full overflow-hidden w-[30px] h-[30px] bg-gray-300 flex items-center justify-center"
            >
              <template v-if="userStore.user?.pictureUrl">
                <img
                  :src="userStore.user.pictureUrl"
                  :alt="userStore.user?.name"
                  class="w-full h-full object-cover"
                />
              </template>
              <template v-else
                ><span class="material-symbols-outlined text-white">
                  contacts_product
                </span></template
              >
            </div>
          </div>
          <div
            v-if="open"
            class="absolute right-0 mt-2 w-[240px] bg-white rounded custom-shadow z-10 overflow-hidden"
          >
            <ul class="text-[14px] font-light">
              <li class="border-b border-gray-100">
                <RouterLink
                  :to="{ name: 'Settings' }"
                  class="cursor-pointer flex flex-col items-center justify-center px-2.5 py-5 border-[1.5px] border-[#009799] rounded m-0.5"
                  @click="open = false"
                >
                  <div
                    class="rounded-full overflow-hidden w-[45px] h-[45px] bg-gray-300 flex items-center justify-center mb-2.5"
                  >
                    <template v-if="userStore.user?.pictureUrl">
                      <img
                        :src="userStore.user.pictureUrl"
                        :alt="userStore.user?.name"
                        class="w-full h-full object-cover"
                      />
                    </template>
                    <template v-else>
                      <span class="material-symbols-outlined text-white"> contacts_product </span>
                    </template>
                  </div>
                  <p class="mb-1">{{ userStore.user?.name }}</p>
                  <p
                    class="text-[13px] block text-center w-full overflow-ellipsis truncate text-gray-500"
                  >
                    {{ userStore.user?.email }}
                  </p>
                </RouterLink>
              </li>
              <li class="border-b border-gray-100 text-[#009799]">
                <RouterLink
                  :to="{ name: 'Settings' }"
                  class="cursor-pointer px-4 py-2 hover:bg-gray-50 flex items-center gap-2.5"
                  @click="open = false"
                >
                  <span class="material-symbols-outlined"> settings </span>
                  <span>Account Settings</span>
                </RouterLink>
              </li>
              <li class="border-b border-gray-100 text-[#009799]">
                <a
                  class="cursor-pointer px-4 py-2 hover:bg-gray-50 flex items-center gap-2.5"
                  @click.prevent="handleLogout"
                >
                  <span class="material-symbols-outlined"> trending_flat </span>
                  <span>Sign Out</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full h-0.5 bg-gradient-to-r from-[#009799] to-yellow-900"></div>
  </div>
</template>

<style scoped>
.custom-shadow {
  box-shadow:
    0 3px 20px rgba(0, 151, 153, 0.3),
    0 1px 2px rgba(0, 151, 153, 0.15),
    0 0 0 1px rgba(0, 151, 153, 0.1);
}
</style>
