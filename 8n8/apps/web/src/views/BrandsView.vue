<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white">العلامات التجارية</h1>
          <p class="text-gray-400 mt-1">إدارة علاماتك التجارية</p>
        </div>
        <BaseButton variant="primary" @click="showAddModal = true">
          <svg class="w-5 h-5 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          إضافة علامة تجارية
        </BaseButton>
      </div>

      <!-- Brands Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BaseCard
          v-for="brand in brandStore.brands"
          :key="brand.id"
          hoverable
          class="group"
        >
          <div class="flex items-start gap-4">
            <img
              v-if="brand.logo"
              :src="brand.logo"
              :alt="brand.name"
              class="h-16 w-16 rounded-lg"
            />
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-white">{{ brand.name }}</h3>
              <p class="text-sm text-gray-400 mt-1">{{ brand.industry }}</p>
            </div>
          </div>

          <div class="mt-4 space-y-2">
            <div>
              <p class="text-xs text-gray-500">النبرة</p>
              <p class="text-sm text-gray-300">{{ brand.tone }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">الجمهور</p>
              <p class="text-sm text-gray-300">{{ brand.audience }}</p>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-700 flex gap-2">
            <BaseButton variant="ghost" size="sm" class="flex-1">
              تعديل
            </BaseButton>
            <BaseButton variant="danger" size="sm" class="flex-1">
              حذف
            </BaseButton>
          </div>
        </BaseCard>
      </div>

      <!-- Add Brand Modal -->
      <BaseModal v-model="showAddModal" title="إضافة علامة تجارية جديدة" size="lg">
        <form @submit.prevent="handleAddBrand" class="space-y-4">
          <BaseInput v-model="newBrand.name" label="اسم العلامة التجارية" required />
          <BaseInput v-model="newBrand.industry" label="المجال/الصناعة" required />
          <BaseInput v-model="newBrand.tone" label="النبرة" placeholder="مثال: احترافي وودود" required />
          <BaseInput v-model="newBrand.audience" label="الجمهور المستهدف" required />
          <BaseInput v-model="forbiddenWordsInput" label="كلمات محظورة (مفصولة بفاصلة)" />
          <BaseInput v-model="allowedWordsInput" label="كلمات مسموحة (مفصولة بفاصلة)" />
        </form>

        <template #footer>
          <div class="flex gap-3 justify-end">
            <BaseButton variant="ghost" @click="showAddModal = false">إلغاء</BaseButton>
            <BaseButton variant="primary" :loading="loading" @click="handleAddBrand">حفظ</BaseButton>
          </div>
        </template>
      </BaseModal>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBrandStore } from '@/stores/brand'
import { useToast } from '@/composables/useToast'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseInput from '@/components/base/BaseInput.vue'

const brandStore = useBrandStore()
const toast = useToast()

const showAddModal = ref(false)
const loading = ref(false)
const newBrand = ref({
  name: '',
  industry: '',
  tone: '',
  audience: '',
})
const forbiddenWordsInput = ref('')
const allowedWordsInput = ref('')

const handleAddBrand = async () => {
  loading.value = true
  try {
    await brandStore.addBrand({
      ...newBrand.value,
      forbidden_words: forbiddenWordsInput.value.split(',').map(w => w.trim()).filter(Boolean),
      allowed_words: allowedWordsInput.value.split(',').map(w => w.trim()).filter(Boolean),
    })
    toast.success('تم إضافة العلامة التجارية بنجاح')
    showAddModal.value = false
    // Reset form
    newBrand.value = { name: '', industry: '', tone: '', audience: '' }
    forbiddenWordsInput.value = ''
    allowedWordsInput.value = ''
  } catch (error) {
    toast.error('فشل إضافة العلامة التجارية')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (brandStore.brands.length === 0) {
    await brandStore.fetchBrands()
  }
})
</script>
