<script setup>
import { ref, onBeforeUnmount, onMounted } from 'vue'
import PersonalLibraryView from '@/views/library/components/PersonalLibraryView.vue'

const open = ref(false)
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    open.value = false
  }
}

const dropdownRef = ref(null)
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <div class="flex flex-col">
    <div
      class="px-5 py-2.5 min-h-[63px] flex justify-center border-b-[0.25px] border-gray-300 bg-gray-100"
    >
      <div class="max-w-[1200px] flex items-center justify-between flex-wrap font-light w-full">
        <div class="flex text-[15px] items-center text-[#009799] gap-2">
          <span class="material-symbols-outlined"> home_storage </span>
          <span>Personal Library</span>
        </div>
        <div class="relative" ref="dropdownRef">
          <button
            @click="open = !open"
            class="bg-white text-[14px] font-normal border rounded-sm p-1 pl-3.5 text-[#009799] flex items-center justify-center gap-1 cursor-pointer hover:bg-gray-200"
          >
            <span>New</span>
            <span class="material-symbols-outlined a1 mr-1"> expand_all </span>
          </button>

          <div
            v-if="open"
            class="absolute right-0 mt-0.5 min-w-[180px] bg-white rounded custom-shadow z-10 overflow-hidden"
          >
            <ul class="text-[13px] font-light text-gray-500">
              <li class="border-b border-gray-200">
                <RouterLink
                  :to="{ name: 'Dashboard' }"
                  class="cursor-pointer px-4 py-2 hover:bg-gray-50 flex items-center gap-2.5 rounded m-0.5"
                  @click="open = false"
                >
                  <span class="material-symbols-outlined a2"> view_apps </span>
                  <span>Create New Box</span>
                </RouterLink>
              </li>
              <li class="border-b border-gray-200">
                <RouterLink
                  :to="{ name: 'new-library' }"
                  class="cursor-pointer px-4 py-2 hover:bg-gray-50 flex items-center gap-2.5 rounded m-0.5"
                  @click="open = false"
                >
                  <span class="material-symbols-outlined a2"> view_apps </span>
                  <span>Create New Library</span>
                </RouterLink>
              </li>
              <li class="border-b border-gray-100">
                <RouterLink
                  :to="{ name: 'Settings' }"
                  class="cursor-pointer px-4 py-2 hover:bg-gray-50 flex items-center gap-2.5"
                  @click="open = false"
                >
                  <span class="material-symbols-outlined a2"> pageview </span>
                  <span>Get New Book</span>
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- Main content -->
    <PersonalLibraryView />
  </div>
</template>

<style scoped>
.a1 {
  font-size: 15px;
}
.a2 {
  font-size: 18px;
}
.custom-shadow {
  box-shadow:
    0 3px 20px rgba(0, 151, 153, 0.3),
    0 1px 2px rgba(0, 151, 153, 0.15),
    0 0 0 1px rgba(0, 151, 153, 0.1);
}
</style>

<!-- <template>
  <div>
    <h2>Dashboard</h2>
    <button @click="logout">Logout</button>
    <button @click="book">Book</button>
    <div v-if="user">
      <p>Welcome, {{ user.name }} ({{ user.email }})</p>
      <pre>{{ user }}</pre>
    </div>
    <div v-else>
      <p>Loading user info...</p>
      <div v-if="error" style="color: red">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const user = ref(null);
const error = ref(null);
const router = useRouter();

const fetchUser = async () => {
  try {
    axios.defaults.withCredentials = true;
    const res = await axios.get('http://localhost:8080/api/v1/auth/me', {
      withCredentials: true,
    });
    user.value = res.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      router.push({ path: '/' });
    } else {
      error.value = err.response ? err.response.data : err.message;
    }
  }
};

const book = () => {
    router.push({ path: '/book' });
}

const logout = async () => {
  try {
    axios.defaults.withCredentials = true;
    await axios.post(
      'http://localhost:8080/api/v1/auth/logout',
      {},
      { withCredentials: true }
    );
    user.value = null;
    error.value = 'Logged out';
    router.push({ path: '/login' });
  } catch (err) {
    error.value = err.response ? err.response.data : err.message;
  }
};

onMounted(fetchUser);
</script>
<style scoped>
h2 {
  margin-bottom: 1rem;
}
</style> -->
