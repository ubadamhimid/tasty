import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Brand } from '@/types'

export const useBrandStore = defineStore('brand', () => {
  // State
  const brands = ref<Brand[]>([])
  const activeBrand = ref<Brand | null>(null)
  const loading = ref(false)

  // Mock data
  const mockBrands: Brand[] = [
    {
      id: '1',
      name: 'شركة النجاح للتكنولوجيا',
      industry: 'تكنولوجيا',
      tone: 'احترافي وودود',
      audience: 'الشركات الصغيرة والمتوسطة',
      forbidden_words: ['رخيص', 'مجاني'],
      allowed_words: ['ابتكار', 'تطوير', 'جودة'],
      logo: 'https://ui-avatars.com/api/?name=النجاح&background=6366f1&color=fff',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'مطعم الذوق الرفيع',
      industry: 'مطاعم',
      tone: 'دافئ ومرحب',
      audience: 'العائلات والشباب',
      forbidden_words: ['سريع', 'وجبات جاهزة'],
      allowed_words: ['طازج', 'لذيذ', 'تقليدي'],
      logo: 'https://ui-avatars.com/api/?name=الذوق&background=ec4899&color=fff',
      created_at: new Date().toISOString(),
    }
  ]

  // Getters
  const activeBrandId = computed(() => activeBrand.value?.id || null)
  const brandCount = computed(() => brands.value.length)

  // Actions
  const fetchBrands = async () => {
    loading.value = true
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      brands.value = mockBrands
      
      // Set first brand as active if none selected
      if (!activeBrand.value && brands.value.length > 0) {
        const savedBrandId = localStorage.getItem('active_brand_id')
        const brand = savedBrandId 
          ? brands.value.find(b => b.id === savedBrandId)
          : brands.value[0]
        
        activeBrand.value = brand || brands.value[0]
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
    } finally {
      loading.value = false
    }
  }

  const setActiveBrand = (brandId: string) => {
    const brand = brands.value.find(b => b.id === brandId)
    if (brand) {
      activeBrand.value = brand
      localStorage.setItem('active_brand_id', brandId)
    }
  }

  const addBrand = async (brandData: Omit<Brand, 'id' | 'created_at'>) => {
    loading.value = true
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newBrand: Brand = {
        ...brandData,
        id: String(Date.now()),
        created_at: new Date().toISOString(),
      }
      
      brands.value.push(newBrand)
      return newBrand
    } catch (error) {
      console.error('Error adding brand:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateBrand = async (brandId: string, brandData: Partial<Brand>) => {
    loading.value = true
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = brands.value.findIndex(b => b.id === brandId)
      if (index !== -1) {
        brands.value[index] = { ...brands.value[index], ...brandData }
        
        // Update active brand if it's the one being edited
        if (activeBrand.value?.id === brandId) {
          activeBrand.value = brands.value[index]
        }
      }
    } catch (error) {
      console.error('Error updating brand:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteBrand = async (brandId: string) => {
    loading.value = true
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      brands.value = brands.value.filter(b => b.id !== brandId)
      
      // If deleted brand was active, select first available brand
      if (activeBrand.value?.id === brandId) {
        activeBrand.value = brands.value[0] || null
        if (activeBrand.value) {
          localStorage.setItem('active_brand_id', activeBrand.value.id)
        } else {
          localStorage.removeItem('active_brand_id')
        }
      }
    } catch (error) {
      console.error('Error deleting brand:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    brands,
    activeBrand,
    loading,
    activeBrandId,
    brandCount,
    fetchBrands,
    setActiveBrand,
    addBrand,
    updateBrand,
    deleteBrand,
  }
})
