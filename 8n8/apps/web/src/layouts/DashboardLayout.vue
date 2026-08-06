<template>
  <div class="min-h-screen bg-dark-900 flex">
    <!-- Sidebar -->
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Main content -->
    <div class="flex-1 flex flex-col me-0 lg:me-64">
      <!-- Topbar -->
      <Topbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <!-- Page content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Topbar from '@/components/layout/Topbar.vue'
import { useBrandStore } from '@/stores/brand'

const sidebarOpen = ref(true)
const brandStore = useBrandStore()

onMounted(async () => {
  // Load brands when layout mounts
  if (brandStore.brands.length === 0) {
    await brandStore.fetchBrands()
  }
})
</script>
