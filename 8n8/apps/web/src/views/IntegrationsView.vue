<template>
  <DashboardLayout>
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-white">التكاملات</h1>
        <p class="text-gray-400 mt-1">ربط حساباتك على وسائل التواصل الاجتماعي</p>
      </div>

      <!-- Integrations Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BaseCard
          v-for="integration in integrations"
          :key="integration.platform"
          hoverable
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
              <div
                class="h-12 w-12 rounded-lg flex items-center justify-center"
                :class="integration.iconBg"
              >
                <component :is="integration.icon" class="h-6 w-6" :class="integration.iconColor" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white">{{ integration.name }}</h3>
                <p class="text-sm text-gray-400">{{ integration.description }}</p>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-700">
            <div v-if="integration.connected" class="space-y-3">
              <div class="flex items-center gap-2 text-green-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm font-medium">متصل</span>
              </div>
              <BaseButton variant="danger" size="sm" full-width>
                قطع الاتصال
              </BaseButton>
            </div>

            <div v-else>
              <BaseButton variant="primary" size="sm" full-width>
                <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                ربط الحساب
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const integrations = ref([
  {
    platform: 'instagram',
    name: 'Instagram',
    description: 'شارك المنشورات والقصص',
    connected: false,
    icon: 'svg',
    iconBg: 'bg-gradient-to-br from-purple-600 to-pink-600',
    iconColor: 'text-white',
  },
  {
    platform: 'facebook',
    name: 'Facebook',
    description: 'انشر على الصفحات والمجموعات',
    connected: true,
    icon: 'svg',
    iconBg: 'bg-blue-600',
    iconColor: 'text-white',
  },
  {
    platform: 'twitter',
    name: 'Twitter / X',
    description: 'انشر التغريدات',
    connected: false,
    icon: 'svg',
    iconBg: 'bg-gray-800',
    iconColor: 'text-white',
  },
])
</script>
