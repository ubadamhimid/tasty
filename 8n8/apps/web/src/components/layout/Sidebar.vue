<template>
  <aside
    class="fixed top-0 end-0 h-screen w-64 bg-dark-800 border-s border-gray-700 flex flex-col z-40 transition-transform duration-300"
    :class="{ '-translate-x-full': !isOpen }"
  >
    <!-- Logo -->
    <div class="flex items-center justify-between p-6 border-b border-gray-700">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
          <span class="text-white font-bold text-xl">ن</span>
        </div>
        <div>
          <h1 class="text-white font-bold text-lg">نُوَى</h1>
          <p class="text-xs text-gray-400">مصنع المحتوى</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto p-4">
      <ul class="space-y-1">
        <li v-for="item in menuItems" :key="item.name">
          <RouterLink
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all group"
            :class="[
              isActive(item.path)
                ? 'bg-primary-600 text-white'
                : 'text-gray-300 hover:bg-dark-700 hover:text-white'
            ]"
          >
            <component
              :is="item.icon"
              class="h-5 w-5 flex-shrink-0"
              :class="[
                isActive(item.path)
                  ? 'text-white'
                  : 'text-gray-400 group-hover:text-white'
              ]"
            />
            <span class="font-medium">{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-700">
      <div class="text-xs text-gray-500 text-center">
        <p>النسخة 1.0.0</p>
        <p class="mt-1">© 2026 نُوَى</p>
      </div>
    </div>
  </aside>

  <!-- Mobile overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 z-30 lg:hidden"
    @click="closeSidebar"
  ></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  HomeIcon,
  CalendarIcon,
  SparklesIcon,
  FolderIcon,
  BuildingStorefrontIcon,
  LinkIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/24/outline'

interface MenuItem {
  name: string
  label: string
  path: string
  icon: any
}

interface Props {
  isOpen?: boolean
}

withDefaults(defineProps<Props>(), {
  isOpen: true,
})

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()

const menuItems: MenuItem[] = [
  { name: 'dashboard', label: 'لوحة التحكم', path: '/', icon: HomeIcon },
  { name: 'planner', label: 'المخطط', path: '/planner', icon: CalendarIcon },
  { name: 'generator', label: 'المولّد', path: '/generator', icon: SparklesIcon},
  { name: 'library', label: 'المكتبة', path: '/library', icon: FolderIcon },
  { name: 'brands', label: 'العلامات التجارية', path: '/brands', icon: BuildingStorefrontIcon },
  { name: 'integrations', label: 'التكاملات', path: '/integrations', icon: LinkIcon },
  { name: 'settings', label: 'الإعدادات', path: '/settings', icon: Cog6ToothIcon },
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const closeSidebar = () => {
  emit('close')
}
</script>
