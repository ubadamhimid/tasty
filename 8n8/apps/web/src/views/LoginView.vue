<template>
  <AuthLayout>
    <div class="w-full max-w-md">
      <BaseCard card-class="p-8">
        <!-- Logo and title -->
        <div class="text-center mb-8">
          <div class="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 items-center justify-center mb-4">
            <span class="text-white font-bold text-3xl">ن</span>
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">مرحباً بك في نُوَى</h1>
          <p class="text-gray-400">سجّل دخولك للمتابعة</p>
        </div>

        <!-- Login form -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <BaseInput
            v-model="email"
            type="email"
            label="البريد الإلكتروني"
            placeholder="example@domain.com"
            :error="errors.email"
            required
          />

          <BaseInput
            v-model="password"
            type="password"
            label="كلمة المرور"
            placeholder="••••••••"
            :error="errors.password"
            required
          />

          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2">
              <input
                v-model="remember"
                type="checkbox"
                class="rounded border-gray-600 bg-dark-700 text-primary-600 focus:ring-primary-500 focus:ring-offset-dark-900"
              />
              <span class="text-sm text-gray-300">تذكرني</span>
            </label>

            <a href="#" class="text-sm text-primary-400 hover:text-primary-300">
              نسيت كلمة المرور؟
            </a>
          </div>

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="loading"
            full-width
          >
            تسجيل الدخول
          </BaseButton>
        </form>

        <!-- Demo hint -->
        <div class="mt-6 p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
          <p class="text-sm text-blue-300 text-center">
            💡 يمكنك استخدام أي بريد إلكتروني وكلمة مرور للتجربة
          </p>
        </div>
      </BaseCard>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import AuthLayout from '@/layouts/AuthLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const email = ref('')
const password = ref('')
const remember = ref(false)
const loading = ref(false)
const errors = ref<{ email?: string; password?: string }>({})

const handleLogin = async () => {
  errors.value = {}

  // Simple validation
  if (!email.value) {
    errors.value.email = 'البريد الإلكتروني مطلوب'
    return
  }
  if (!password.value) {
    errors.value.password = 'كلمة المرور مطلوبة'
    return
  }

  loading.value = true

  try {
    const success = await authStore.login(email.value, password.value)
    
    if (success) {
      toast.success('تم تسجيل الدخول بنجاح')
      router.push('/')
    } else {
      toast.error('فشل تسجيل الدخول')
    }
  } catch (error) {
    toast.error('حدث خطأ أثناء تسجيل الدخول')
  } finally {
    loading.value = false
  }
}
</script>
