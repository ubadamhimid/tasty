<template>
  <DashboardLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white">المكتبة</h1>
          <p class="text-gray-400 mt-1">جميع محتوياتك في مكان واحد</p>
        </div>
        
        <!-- Filter -->
        <BaseSelect
          v-model="selectedStatus"
          :options="statusOptions"
          label=""
          class="w-48"
        />
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BaseCard
          v-for="content in filteredContents"
          :key="content.id"
          hoverable
        >
          <div class="space-y-3">
            <div class="flex items-start justify-between">
              <h3 class="text-lg font-semibold text-white">{{ content.title }}</h3>
              <span class="badge" :class="getStatusBadge(content.status)">
                {{ getStatusText(content.status) }}
              </span>
            </div>

            <p class="text-sm text-gray-400 truncate-3">{{ content.body }}</p>

            <div class="flex items-center gap-2 text-sm text-gray-500">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              <span>{{ formatDate(content.created_at) }}</span>
            </div>

            <div class="pt-3 border-t border-gray-700 flex gap-2">
              <BaseButton variant="ghost" size="sm" class="flex-1">تعديل</BaseButton>
              <BaseButton variant="primary" size="sm" class="flex-1">جدولة</BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useContentStore } from '@/stores/content'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import type { ContentStatus } from '@/types'

const contentStore = useContentStore()
const selectedStatus = ref<string>('all')

const statusOptions = [
  { value: 'all', label: 'الكل' },
  { value: 'draft', label: 'مسودة' },
  { value: 'ready', label: 'جاهز' },
  { value: 'scheduled', label: 'مجدول' },
  { value: 'posted', label: 'منشور' },
]

const filteredContents = computed(() => {
  if (selectedStatus.value === 'all') {
    return contentStore.contents
  }
  return contentStore.getByStatus(selectedStatus.value as ContentStatus)
})

const getStatusText = (status: ContentStatus) => {
  const texts = {
    draft: 'مسودة',
    ready: 'جاهز',
    scheduled: 'مجدول',
    posted: 'منشور',
  }
  return texts[status]
}

const getStatusBadge = (status: ContentStatus) => {
  const badges = {
    draft: 'badge-primary',
    ready: 'bg-blue-600/20 text-blue-300',
    scheduled: 'badge-warning',
    posted: 'badge-success',
  }
  return badges[status]
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(async () => {
  if (contentStore.contents.length === 0) {
    await contentStore.fetchContents()
  }
})
</script>
