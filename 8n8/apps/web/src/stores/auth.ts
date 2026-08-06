import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Actions
  const login = async (email: string, password: string): Promise<boolean> => {
    loading.value = true
    try {
      // Mock authentication - Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        name: 'أحمد محمد',
        email: email,
        avatar: 'https://ui-avatars.com/api/?name=أحمد+محمد&background=6366f1&color=fff',
        role: 'admin'
      }
      
      const mockToken = 'mock_token_' + Date.now()
      
      // Set user and token
      user.value = mockUser
      token.value = mockToken
      
      // Save to localStorage
      localStorage.setItem('auth_token', mockToken)
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  const checkAuth = (): boolean => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
        return true
      } catch (error) {
        console.error('Error parsing saved user:', error)
        logout()
        return false
      }
    }
    
    return false
  }

  const updateUser = (userData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    updateUser,
  }
})
