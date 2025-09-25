<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import LoadingModal from '@/components/LoadingModal.vue'
import EventNotifyBar from '@/components/EventNotifyBar.vue'
import AgentModal from '@/components/AgentModal.vue'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
import { onMounted, watch } from 'vue'
</script>

<template>
  <div>
    <div>
      <NavBar />
      <EventNotifyBar />
      <main>
        <router-view />
      </main>
    </div>
    <LoadingModal />
    <AgentModal />
    <ConfirmDeleteModal />
  </div>
</template>
