<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-3xl font-bold text-white">لوحة التحكم</h1>
        <p class="text-gray-400 mt-1">مرحباً {{ authStore.user?.name }}، إليك ملخص نشاطك اليوم</p>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BaseCard hoverable>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">منشورات مخططة</p>
              <p class="text-3xl font-bold text-white mt-2">{{ contentStore.scheduled.length }}</p>
              <p class="text-sm text-green-400 mt-2">+12% من الأسبوع الماضي</p>
            </div>
            <div class="h-12 w-12 rounded-lg bg-primary-600/20 flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </BaseCard>

        <BaseCard hoverable>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">منشورات منشورة</p>
              <p class="text-3xl font-bold text-white mt-2">{{ contentStore.posted.length }}</p>
              <p class="text-sm text-green-400 mt-2">+8% من الأسبوع الماضي</p>
            </div>
            <div class="h-12 w-12 rounded-lg bg-green-600/20 flex items-center justify-center">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </BaseCard>

        <BaseCard hoverable>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">أفضل منشور</p>
              <p class="text-3xl font-bold text-white mt-2">2.4K</p>
              <p class="text-sm text-gray-400 mt-2">تفاعل</p>
            </div>
            <div class="h-12 w-12 rounded-lg bg-secondary-600/20 flex items-center justify-center">
              <svg class="w-6 h-6 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Recent Activity -->
      <BaseCard title="النشاط الأخير">
        <div class="space-y-4">
          <div
            v-for="item in recentActivity"
            :key="item.id"
            class="flex items-start gap-4 p-4 rounded-lg hover:bg-dark-700 transition-colors"
          >
            <div
              class="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center"
              :class="getActivityIconBg(item.type)"
            >
              <component :is="getActivityIcon(item.type)" class="h-5 w-5" :class="getActivityIconColor(item.type)" />
            </div>
            <div class="flex-1">
              <p class="text-white font-medium">{{ item.title }}</p>
              <p class="text-sm text-gray-400 mt-1">{{ item.description }}</p>
              <p class="text-xs text-gray-500 mt-2">{{ item.time }}</p>
            </div>
            <span
              class="badge"
              :class="getStatusBadge(item.status)"
            >
              {{ item.status }}
            </span>
          </div>

          <div v-if="recentActivity.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p class="mt-4 text-gray-400">لا يوجد نشاط حديث</p>
          </div>
        </div>
      </BaseCard>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useContentStore } from '@/stores/content'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import {
  SparklesIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const contentStore = useContentStore()

const recentActivity = [
  {
    id: '1',
    type: 'generate',
    title: 'تم إنشاء محتوى جديد',
    description: 'تم إنشاء 3 أفكار لمنشور عن المنتج الجديد',
    time: 'منذ ساعتين',
    status: 'مسودة'
  },
  {
    id: '2',
    type: 'schedule',
    title: 'تم جدولة منشور',
    description: 'منشور "إطلاق منتج جديد" سيُنشر غداً الساعة 10 صباحاً',
    time: 'منذ 4 ساعات',
    status: 'مجدول'
  },
  {
    id: '3',
    type: 'post',
    title: 'تم نشر منشور',
    description: 'منشور "نصائح يومية" تم نشره بنجاح على Instagram',
    time: 'منذ يوم',
    status: 'منشور'
  },
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'generate':
      return SparklesIcon
    case 'schedule':
      return CalendarIcon
    case 'post':
      return CheckCircleIcon
    default:
      return ClockIcon
  }
}

const getActivityIconBg = (type: string) => {
  switch (type) {
    case 'generate':
      return 'bg-primary-600/20'
    case 'schedule':
      return 'bg-yellow-600/20'
    case 'post':
      return 'bg-green-600/20'
    default:
      return 'bg-gray-600/20'
  }
}

const getActivityIconColor = (type: string) => {
  switch (type) {
    case ') generate':
      return 'text-primary-400'
    case 'schedule':
      return 'text-yellow-400'
    case 'post':
      return 'text-green-400'
    default:
      return 'text-gray-400'
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'مسودة':
      return 'badge-primary'
    case 'مجدول':
      return 'badge-warning'
    case 'منشور':
      return 'badge-success'
    default:
      return 'bg-gray-600/20 text-gray-300'
  }
}

onMounted(async () => {
  await contentStore.fetchContents()
})
</script>
