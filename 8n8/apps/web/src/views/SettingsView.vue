<template>
  <DashboardLayout>
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-white">الإعدادات</h1>
        <p class="text-gray-400 mt-1">إدارة إعدادات حسابك</p>
      </div>

      <BaseCard title="معلومات الحساب">
        <div class="space-y-4">
          <BaseInput
            :model-value="authStore.user?.name || ''"
            label="الاسم"
            disabled
          />
          <BaseInput
            :model-value="authStore.user?.email || ''"
            label="البريد الإلكتروني"
            type="email"
            disabled
          />
        </div>
      </BaseCard>

      <BaseCard title="التفضيلات">
        <div class="space-y-4">
          <p class="text-gray-400">سيتم إضافة إعدادات إضافية قريباً...</p>
        </div>
      </BaseCard>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'

const authStore = useAuthStore()
</script>
