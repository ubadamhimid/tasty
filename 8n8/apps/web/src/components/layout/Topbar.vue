<template>
  <header class="sticky top-0 z-30 bg-dark-800 border-b border-gray-700">
    <div class="flex items-center justify-between px-6 py-4">
      <!-- Left side: Mobile menu + Brand switcher -->
      <div class="flex items-center gap-4">
        <!-- Mobile menu toggle -->
        <button
          class="lg:hidden text-gray-400 hover:text-white p-2"
          @click="emit('toggle-sidebar')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <!-- Brand Switcher -->
        <div class="relative" ref="brandDropdownRef">
          <button
            class="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
            @click="brandDropdownOpen = !brandDropdownOpen"
          >
            <img
              v-if="brandStore.activeBrand?.logo"
              :src="brandStore.activeBrand.logo"
              :alt="brandStore.activeBrand.name"
              class="h-6 w-6 rounded"
            />
            <span class="font-medium text-white">
              {{ brandStore.activeBrand?.name || 'اختر علامة تجارية' }}
            </span>
            <svg
              class="w-4 h-4 text-gray-400 transition-transform"
              :class="{ 'rotate-180': brandDropdownOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <!-- Dropdown -->
          <Transition name="dropdown">
            <div
              v-if="brandDropdownOpen"
              class="absolute top-full mt-2 end-0 w-64 bg-dark-700 rounded-lg shadow-xl border border-gray-600 py-2"
            >
              <button
                v-for="brand in brandStore.brands"
                :key="brand.id"
                class="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-600 transition-colors"
                :class="{ 'bg-primary-600/20': brand.id === brandStore.activeBrandId }"
                @click="selectBrand(brand.id)"
              >
                <img
                  v-if="brand.logo"
                  :src="brand.logo"
                  :alt="brand.name"
                  class="h-8 w-8 rounded"
                />
                <div class="flex-1 text-start">
                  <p class="font-medium text-white">{{ brand.name }}</p>
                  <p class="text-xs text-gray-400">{{ brand.industry }}</p>
                </div>
                <svg
                  v-if="brand.id === brandStore.activeBrandId"
                  class="w-5 h-5 text-primary-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Right side: Generate button + User menu -->
      <div class="flex items-center gap-3">
        <!-- Generate Button -->
        <BaseButton
          variant="primary"
          @click="$router.push('/generator')"
        >
          <svg class="w-5 h-5 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          توليد محتوى
        </BaseButton>

        <!-- User Menu -->
        <div class="relative" ref="userDropdownRef">
          <button
            class="flex items-center gap-2 p-2 hover:bg-dark-700 rounded-lg transition-colors"
            @click="userDropdownOpen = !userDropdownOpen"
          >
            <img
              v-if="authStore.user?.avatar"
              :src="authStore.user.avatar"
              :alt="authStore.user.name"
              class="h-8 w-8 rounded-full"
            />
            <div v-else class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
              <span class="text-white text-sm font-medium">
                {{ authStore.user?.name?.charAt(0) || 'U' }}
              </span>
            </div>
          </button>

          <!-- Dropdown -->
          <Transition name="dropdown">
            <div
              v-if="userDropdownOpen"
              class="absolute top-full mt-2 start-0 w-56 bg-dark-700 rounded-lg shadow-xl border border-gray-600 py-2"
            >
              <div class="px-4 py-3 border-b border-gray-600">
                <p class="font-medium text-white">{{ authStore.user?.name }}</p>
                <p class="text-sm text-gray-400">{{ authStore.user?.email }}</p>
              </div>
              
              <button
                class="w-full text-start px-4 py-2 hover:bg-dark-600 transition-colors text-gray-300 flex items-center gap-2"
                @click="$router.push('/settings')"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                الإعدادات
              </button>
              
              <button
                class="w-full text-start px-4 py-2 hover:bg-dark-600 transition-colors text-red-400 flex items-center gap-2"
                @click="handleLogout"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                تسجيل الخروج
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBrandStore } from '@/stores/brand'
import BaseButton from '@/components/base/BaseButton.vue'

const emit = defineEmits<{
  'toggle-sidebar': []
}>()

const router = useRouter()
const authStore = useAuthStore()
const brandStore = useBrandStore()

const brandDropdownOpen = ref(false)
const userDropdownOpen = ref(false)
const brandDropdownRef = ref<HTMLElement>()
const userDropdownRef = ref<HTMLElement>()

const selectBrand = (brandId: string) => {
  brandStore.setActiveBrand(brandId)
  brandDropdownOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// Close dropdowns when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (brandDropdownRef.value && !brandDropdownRef.value.contains(event.target as Node)) {
    brandDropdownOpen.value = false
  }
  if (userDropdownRef.value && !userDropdownRef.value.contains(event.target as Node)) {
    userDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
