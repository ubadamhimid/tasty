import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false, layout: 'auth' }
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, layout: 'dashboard' }
  },
  {
    path: '/brands',
    name: 'brands',
    component: () => import('@/views/BrandsView.vue'),
    meta: { requiresAuth: true, layout: 'dashboard' }
  },
  {
    path: '/generator',
    name: 'generator',
    component: () => import('@/views/GeneratorView.vue'),
    meta: { requiresAuth: true, layout: 'dashboard' }
  },
  {
    path: '/planner',
    name: 'planner',
    component: () => import('@/views/PlannerView.vue'),
    meta: { requiresAuth: true, layout: 'dashboard' }
  },
  {
    path: '/library',
    name: 'library',
    component: () => import('@/views/LibraryView.vue'),
    meta: { requiresAuth: true, layout: 'dashboard' }
  },
  {
    path: '/integrations',
    name: 'integrations',
    component: () => import('@/views/IntegrationsView.vue'),
    meta: { requiresAuth: true, layout: 'dashboard' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { requiresAuth: true, layout: 'dashboard' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth !== false

  // Check authentication on first load
  if (!authStore.user) {
    authStore.checkAuth()
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if not authenticated
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    // Redirect to dashboard if already logged in
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
