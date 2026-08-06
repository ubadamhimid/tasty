import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Content, ContentStatus, Platform } from '@/types'

export const useContentStore = defineStore('content', () => {
  // State
  const contents = ref<Content[]>([])
  const loading = ref(false)

  // Generator Flow State
  const selectedIdea = ref<string | null>(null)
  const generatedCaption = ref<string | null>(null)
  const generatedHashtags = ref<string[]>([])
  const generatedPrompt = ref<string | null>(null)

  // Mock data
  const mockContents: Content[] = [
    {
      id: '1',
      title: 'إطلاق منتج جديد',
      body: 'نحن سعداء بالإعلان عن إطلاق منتجنا الجديد! 🚀\n\nاكتشف مميزات رائعة ستغير طريقة عملك.\n\n#ابتكار #تكنولوجيا',
      platform: 'instagram',
      status: 'scheduled',
      scheduled_at: new Date(Date.now() + 86400000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      brand_id: '1',
    },
    {
      id: '2',
      title: 'نصائح يومية',
      body: '5 نصائح لزيادة الإنتاجية:\n1. ابدأ يومك بالتخطيط\n2. خذ استراحات منتظمة\n3. ركز على مهمة واحدة\n4. تجنب المشتتات\n5. احتفل بالإنجازات الصغيرة',
      platform: 'facebook',
      status: 'draft',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      brand_id: '1',
    },
    {
      id: '3',
      title: 'عرض خاص',
      body: '🎉 عرض لفترة محدودة!\n\nخصم 30% على جميع الخدمات\nسارع بالحجز الآن\n\n#عروض #خصومات',
      platform: 'instagram',
      status: 'ready',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date(Date.now() - 172800000).toISOString(),
      brand_id: '2',
    },
    {
      id: '4',
      title: 'تحديث المنتج',
      body: 'تحديث جديد متوفر الآن! ✨\n\nمميزات محسنة وأداء أفضل\nحمّل التحديث من متجر التطبيقات',
      platform: 'twitter',
      status: 'posted',
      scheduled_at: new Date(Date.now() - 604800000).toISOString(),
      posted_at: new Date(Date.now() - 604800000).toISOString(),
      created_at: new Date(Date.now() - 691200000).toISOString(),
      updated_at: new Date(Date.now() - 604800000).toISOString(),
      brand_id: '1',
    },
  ]

  // Getters
  const drafts = computed(() => 
    contents.value.filter(c => c.status === 'draft')
  )

  const scheduled = computed(() => 
    contents.value.filter(c => c.status === 'scheduled')
      .sort((a, b) => {
        if (!a.scheduled_at || !b.scheduled_at) return 0
        return new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
      })
  )

  const ready = computed(() => 
    contents.value.filter(c => c.status === 'ready')
  )

  const posted = computed(() => 
    contents.value.filter(c => c.status === 'posted')
      .sort((a, b) => {
        if (!a.posted_at || !b.posted_at) return 0
        return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
      })
  )

  const getByStatus = (status: ContentStatus) => {
    return contents.value.filter(c => c.status === status)
  }

  const getByPlatform = (platform: Platform) => {
    return contents.value.filter(c => c.platform === platform)
  }

  // Actions
  const fetchContents = async () => {
    loading.value = true
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      contents.value = mockContents
    } catch (error) {
      console.error('Error fetching contents:', error)
    } finally {
      loading.value = false
    }
  }

  const addContent = async (contentData: Omit<Content, 'id' | 'created_at' | 'updated_at'>) => {
    loading.value = true
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newContent: Content = {
        ...contentData,
        id: String(Date.now()),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      contents.value.push(newContent)
      return newContent
    } catch (error) {
      console.error('Error adding content:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateContent = async (contentId: string, contentData: Partial<Content>) => {
    loading.value = true
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = contents.value.findIndex(c => c.id === contentId)
      if (index !== -1) {
        contents.value[index] = {
          ...contents.value[index],
          ...contentData,
          updated_at: new Date().toISOString(),
        }
      }
    } catch (error) {
      console.error('Error updating content:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteContent = async (contentId: string) => {
    loading.value = true
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      contents.value = contents.value.filter(c => c.id !== contentId)
    } catch (error) {
      console.error('Error deleting content:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const scheduleContent = async (contentId: string, scheduledAt: string) => {
    return updateContent(contentId, {
      status: 'scheduled',
      scheduled_at: scheduledAt,
    })
  }

  // Generator Flow Actions
  const setSelectedIdea = (idea: string) => {
    selectedIdea.value = idea
  }

  const setGeneratedCaption = (caption: string, hashtags: string[]) => {
    generatedCaption.value = caption
    generatedHashtags.value = hashtags
  }

  const setGeneratedPrompt = (prompt: string) => {
    generatedPrompt.value = prompt
  }

  const resetGeneratorFlow = () => {
    selectedIdea.value = null
    generatedCaption.value = null
    generatedHashtags.value = []
    generatedPrompt.value = null
  }

  const saveDraftFromGenerator = async () => {
    if (!selectedIdea.value || !generatedCaption.value) {
      throw new Error('Missing required data')
    }

    const draftData = {
      title: selectedIdea.value,
      body: generatedCaption.value + '\n\n' + generatedHashtags.value.map(t => '#' + t).join(' '),
      platform: 'instagram' as Platform,
      status: 'draft' as ContentStatus,
      brand_id: '1', // Will be set from active brand
    }

    const draft = await addContent(draftData)
    resetGeneratorFlow()
    return draft
  }

  return {
    contents,
    loading,
    drafts,
    scheduled,
    ready,
    posted,
    getByStatus,
    getByPlatform,
    fetchContents,
    addContent,
    updateContent,
    deleteContent,
    scheduleContent,
    // Generator Flow
    selectedIdea,
    generatedCaption,
    generatedHashtags,
    generatedPrompt,
    setSelectedIdea,
    setGeneratedCaption,
    setGeneratedPrompt,
    resetGeneratorFlow,
    saveDraftFromGenerator,
  }
})
