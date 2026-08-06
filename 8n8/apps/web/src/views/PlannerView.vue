<template>
  <DashboardLayout>
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-white">المخطط</h1>
        <p class="text-gray-400 mt-1">جدولة ومتابعة منشوراتك</p>
      </div>

      <!-- Queue List -->
      <BaseCard>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="border-b border-gray-700">
              <tr>
                <th class="text-start px-4 py-3 text-sm font-semibold text-gray-300">العنوان</th>
                <th class="text-start px-4 py-3 text-sm font-semibold text-gray-300">المنصة</th>
                <th class="text-start px-4 py-3 text-sm font-semibold text-gray-300">موعد النشر</th>
                <th class="text-start px-4 py-3 text-sm font-semibold text-gray-300">الحالة</th>
                <th class="text-start px-4 py-3 text-sm font-semibold text-gray-300">إجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr v-for="item in contentStore.scheduled" :key="item.id" class="hover:bg-dark-700 transition-colors">
                <td class="px-4 py-4">
                  <p class="text-white font-medium">{{ item.title }}</p>
                  <p class="text-sm text-gray-400 truncate max-w-xs">{{ item.body }}</p>
                </td>
                <td class="px-4 py-4">
                  <span class="badge badge-primary">{{ getPlatformName(item.platform) }}</span>
                </td>
                <td class="px-4 py-4 text-gray-300">
                  {{ formatDate(item.scheduled_at) }}
                </td>
                <td class="px-4 py-4">
                  <span class="badge badge-warning">{{ item.status }}</span>
                </td>
                <td class="px-4 py-4">
                  <div class="flex gap-2">
                    <BaseButton variant="ghost" size="sm">تعديل</BaseButton>
                    <BaseButton variant="danger" size="sm">حذف</BaseButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="contentStore.scheduled.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="mt-4 text-gray-400">لا توجد منشورات مجدولة</p>
          </div>
        </div>
      </BaseCard>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useContentStore } from '@/stores/content'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import type { Platform } from '@/types'

const contentStore = useContentStore()

const getPlatformName = (platform: Platform) => {
  const names = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    twitter: 'Twitter',
    linkedin: 'LinkedIn',
  }
  return names[platform] || platform
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(async () => {
  if (contentStore.contents.length === 0) {
    await contentStore.fetchContents()
  }
})
</script>
