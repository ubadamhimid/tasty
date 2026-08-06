<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-white">مولّد المحتوى</h1>
        <p class="text-gray-400 mt-1">استخدم الذكاء الاصطناعي لإنشاء محتوى إبداعي</p>
      </div>

      <!-- Brand Warning -->
      <div v-if="!brandStore.activeBrand" class="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-4">
        <p class="text-yellow-300 text-sm">⚠️ الرجاء اختيار علامة تجارية من الأعلى للبدء بالتوليد</p>
      </div>

      <!-- Flow Progress -->
      <div v-if="contentStore.selectedIdea" class="bg-primary-600/10 border border-primary-500/20 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <div class="flex-1">
            <p class="text-white font-medium">جاري العمل على: {{ contentStore.selectedIdea }}</p>
            <p class="text-sm text-primary-300">تابع الخطوات لإكمال المحتوى</p>
          </div>
          <BaseButton variant="ghost" size="sm" @click="resetFlow">
            إعادة تعيين
          </BaseButton>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-700">
        <nav class="-mb-px flex space-s-8">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.value
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <BaseCard>
        <!-- ============================================ -->
        <!-- Ideas Tab -->
        <!-- ============================================ -->
        <div v-if="activeTab === 'ideas'" class="space-y-6">
          <div class="space-y-4">
            <BaseInput
              v-model="ideasInput"
              label="أخبرنا عن ماذا تريد أفكار"
              placeholder="مثال: أفكار منشورات عن إطلاق منتج جديد"
              hint="اكتب موضوع عام أو اتركه فارغاً للحصول على أفكار عامة"
            />

            <BaseSelect
              v-model="ideasPlatform"
              :options="platformOptions"
              label="المنصة (اختياري)"
            />

            <BaseButton
              variant="primary"
              :loading="loadingIdeas"
              :disabled="!brandStore.activeBrand"
              @click="handleGenerateIdeas"
            >
              <svg class="w-5 h-5 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              توليد أفكار
            </BaseButton>
          </div>

          <!-- Generated Ideas -->
          <div v-if="generatedIdeas.length > 0" class="space-y-3 fade-in">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-white">الأفكار المولّدة ({{ generatedIdeas.length }}):</h3>
              <BaseButton variant="ghost" size="sm" @click="copyAllIdeas">
                <svg class="w-4 h-4 me-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                نسخ الكل
              </BaseButton>
            </div>

            <div v-for="(idea, idx) in generatedIdeas" :key="idea.id" class="group relative">
              <div 
                class="p-5 bg-dark-700 hover:bg-dark-600 rounded-lg transition-all cursor-pointer border-2"
                :class="contentStore.selectedIdea === idea.title ? 'border-primary-500' : 'border-transparent'"
                @click="handleSelectIdea(idea.title)"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1">
                    <div class="flex items-start gap-3">
                      <span class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-600/20 text-primary-400 text-sm font-bold">
                        {{ idx + 1 }}
                      </span>
                      <div class="flex-1">
                        <p class="text-white font-medium leading-relaxed">{{ idea.title }}</p>
                        <p v-if="idea.hook" class="text-sm text-gray-400 mt-2">
                          <span class="text-accent-400 font-medium">Hook:</span> {{ idea.hook }}
                        </p>
                        <p v-if="contentStore.selectedIdea === idea.title" class="text-xs text-primary-400 mt-3 flex items-center gap-2">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                          </svg>
                          محدد - انتقل لتاب "كابتشن" لتوليد النص
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    class="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-dark-800 rounded"
                    @click.stop="copyText(idea.title)"
                  >
                    <svg class="w-4 h-4 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ============================================ -->
        <!-- Caption Tab -->
        <!-- ============================================ -->
        <div v-if="activeTab === 'caption'" class="space-y-6">
          <!-- Show selected idea -->
          <div v-if="contentStore.selectedIdea" class="p-4 bg-primary-600/10 border border-primary-500/20 rounded-lg">
            <p class="text-xs text-primary-300 mb-1">الفكرة المحددة</p>
            <p class="text-white font-medium">{{ contentStore.selectedIdea }}</p>
          </div>

          <!-- Manual input if no idea selected -->
          <div v-if="!contentStore.selectedIdea" class="space-y-4">
            <BaseInput
              v-model="captionInput"
              label="موضوع المنشور"
              placeholder="مثال: منشور عن مميزات التطبيق الجديد"
              required
            />

            <BaseSelect
              v-model="captionPlatform"
              :options="platformOptions"
              label="المنصة (اختياري)"
            />

            <BaseButton
              variant="primary"
              :loading="loadingCaption"
              :disabled="!brandStore.activeBrand || !captionInput.trim()"
              @click="handleGenerateCaption"
            >
              <svg class="w-5 h-5 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              توليد نص
            </BaseButton>
          </div>

          <!-- Generated Caption -->
          <div v-if="contentStore.generatedCaption" class="space-y-4 fade-in">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-white">النص المولّد:</h3>
              <div class="flex gap-2">
                <BaseButton variant="ghost" size="sm" @click="copyCaption">
                  <svg class="w-4 h-4 me-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    نسخ
                </BaseButton>
                <BaseButton variant="primary" size="sm" @click="handleGeneratePromptFromCaption" :loading="loadingPrompt">
                  <svg class="w-4 h-4 me-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  توليد برومبت فيديو
                </BaseButton>
              </div>
            </div>

            <div class="p-6 bg-dark-700 rounded-lg space-y-4">
              <div class="pb-4 border-b border-gray-600">
                <p class="text-xs text-gray-500 mb-2">المحتوى</p>
                <p class="text-white whitespace-pre-line leading-relaxed">{{ contentStore.generatedCaption }}</p>
              </div>

              <div>
                <p class="text-xs text-gray-500 mb-3">HASHTAGS</p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in contentStore.generatedHashtags"
                    :key="tag"
                    class="px-3 py-1 bg-primary-600/20 text-primary-300 rounded-full text-sm"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading state when generating from idea -->
          <div v-if="loadingCaption && contentStore.selectedIdea" class="flex items-center justify-center py-12">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              <p class="text-gray-400 mt-4">جاري توليد النص...</p>
            </div>
          </div>
        </div>

        <!-- ============================================ -->
        <!-- Prompt Tab -->
        <!-- ============================================ -->
        <div v-if="activeTab === 'prompt'" class="space-y-6">
          <!-- Show flow state -->
          <div v-if="contentStore.selectedIdea" class="space-y-3">
            <div class="p-4 bg-primary-600/10 border border-primary-500/20 rounded-lg">
              <p class="text-xs text-primary-300 mb-1">الفكرة</p>
              <p class="text-white font-medium">{{ contentStore.selectedIdea }}</p>
            </div>
            <div v-if="contentStore.generatedCaption" class="p-4 bg-green-600/10 border border-green-500/20 rounded-lg">
              <p class="text-xs text-green-300 mb-1">النص</p>
              <p class="text-white text-sm line-clamp-2">{{ contentStore.generatedCaption }}</p>
            </div>
          </div>

          <!-- Manual input if no flow -->
          <div v-if="!contentStore.selectedIdea" class="space-y-4">
            <BaseInput
              v-model="promptInput"
              label="وصف الفيديو المطلوب"
              placeholder="مثال: فريق عمل محترف في مكتب حديث"
              required
            />

            <BaseSelect
              v-model="promptStyle"
              :options="styleOptions"
              label="نمط الفيديو"
            />

            <BaseButton
              variant="primary"
              :loading="loadingPrompt"
              :disabled="!brandStore.activeBrand || !promptInput.trim()"
              @click="handleGeneratePrompt"
            >
              <svg class="w-5 h-5 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              توليد Prompt
            </BaseButton>
          </div>

          <!-- Generated Prompt -->
          <div v-if="contentStore.generatedPrompt" class="space-y-4 fade-in">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-white">الـ Prompt المولّد:</h3>
              <div class="flex gap-2">
                <BaseButton variant="ghost" size="sm" @click="copyText(contentStore.generatedPrompt)">
                  <svg class="w-4 h-4 me-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  نسخ
                </BaseButton>
                <BaseButton 
                  v-if="contentStore.selectedIdea && contentStore.generatedCaption"
                  variant="success" 
                  size="sm" 
                  @click="handleSaveToLibrary"
                  :loading="savingDraft"
                >
                  <svg class="w-4 h-4 me-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  حفظ في المكتبة
                </BaseButton>
              </div>
            </div>

            <div class="p-6 bg-dark-700 rounded-lg space-y-4">
              <div>
                <p class="text-xs text-gray-500 mb-2">PROMPT (English)</p>
                <p class="text-white leading-relaxed font-mono text-sm ltr">{{ contentStore.generatedPrompt }}</p>
              </div>

              <div class="pt-4 border-t border-gray-600">
                <p class="text-xs text-gray-400">
                  💡 استخدم هذا الـ Prompt مع أدوات توليد الفيديو مثل: Runway, Pika, Synthesia
                </p>
              </div>
            </div>
          </div>

          <!-- Loading state -->
          <div v-if="loadingPrompt && !contentStore.generatedPrompt" class="flex items-center justify-center py-12">
            <div class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              <p class="text-gray-400 mt-4">جاري توليد الـ Prompt...</p>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Error Display -->
      <div v-if="error" class="bg-red-600/10 border border-red-500/20 rounded-lg p-4">
        <p class="text-red-300">❌ {{ error }}</p>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBrandStore } from '@/stores/brand'
import { useContentStore } from '@/stores/content'
import { useToast } from '@/composables/useToast'
import {
  generateIdeas,
  generateCaption,
  generatePrompt,
  type IdeaResult,
} from '@/services/generatorService'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import type { Platform } from '@/types'

const brandStore = useBrandStore()
const contentStore = useContentStore()
const toast = useToast()

// ============================================
// Tabs
// ============================================
const tabs = [
  { label: 'أفكار', value: 'ideas' },
  { label: 'كابتشن', value: 'caption' },
  { label: 'برومبت فيديو', value: 'prompt' },
]

const activeTab = ref<'ideas' | 'caption' | 'prompt'>('ideas')

// ============================================
// Platform & Style Options
// ============================================
const platformOptions = [
  { value: '', label: 'جميع المنصات' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'linkedin', label: 'LinkedIn' },
]

const styleOptions = [
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'modern', label: 'Modern' },
  { value: 'professional', label: 'Professional' },
  { value: 'dynamic', label: 'Dynamic' },
]

// ============================================
// Ideas State
// ============================================
const ideasInput = ref('')
const ideasPlatform = ref<string>('')
const loadingIdeas = ref(false)
const generatedIdeas = ref<IdeaResult[]>([])

// ============================================
// Caption State
// ============================================
const captionInput = ref('')
const captionPlatform = ref<string>('')
const loadingCaption = ref(false)

// ============================================
// Prompt State
// ============================================
const promptInput = ref('')
const promptStyle = ref('cinematic')
const loadingPrompt = ref(false)

// ============================================
// Draft State
// ============================================
const savingDraft = ref(false)

// ============================================
// Error State
// ============================================
const error = ref<string>('')

// ============================================
// Generate Ideas
// ============================================
const handleGenerateIdeas = async () => {
  if (!brandStore.activeBrand) return

  error.value = ''
  loadingIdeas.value = true

  try {
    const result = await generateIdeas({
      brandId: brandStore.activeBrand.id,
      topic: ideasInput.value || undefined,
      platform: (ideasPlatform.value as Platform) || undefined,
      count: 5
    })

    generatedIdeas.value = result
    toast.success(`تم توليد ${result.length} أفكار بنجاح`)
  } catch (err) {
    error.value = 'فشل توليد الأفكار. حاول مرة أخرى.'
    toast.error('فشل توليد الأفكار')
    console.error(err)
  } finally {
    loadingIdeas.value = false
  }
}

// ============================================
// Smart Flow: Select Idea
// ============================================
const handleSelectIdea = async (idea: string) => {
  if (!brandStore.activeBrand) return

  // Set selected idea
  contentStore.setSelectedIdea(idea)
  
  // Switch to caption tab
  activeTab.value = 'caption'
  
  // Auto-generate caption
  loadingCaption.value = true
  error.value = ''

  try {
    const result = await generateCaption({
      brandId: brandStore.activeBrand.id,
      topic: idea,
      platform: (ideasPlatform.value as Platform) || undefined,
      tone: brandStore.activeBrand.tone
    })

    contentStore.setGeneratedCaption(result.body, result.hashtags)
    toast.success('تم توليد النص بنجاح')
  } catch (err) {
    error.value = 'فشل توليد النص. حاول مرة أخرى.'
    toast.error('فشل توليد النص')
    console.error(err)
  } finally {
    loadingCaption.value = false
  }
}

// ============================================
// Generate Caption (Manual)
// ============================================
const handleGenerateCaption = async () => {
  if (!brandStore.activeBrand || !captionInput.value.trim()) return

  error.value = ''
  loadingCaption.value = true

  try {
    const result = await generateCaption({
      brandId: brandStore.activeBrand.id,
      topic: captionInput.value,
      platform: (captionPlatform.value as Platform) || undefined,
      tone: brandStore.activeBrand.tone
    })

    contentStore.setGeneratedCaption(result.body, result.hashtags)
    toast.success('تم توليد النص بنجاح')
  } catch (err) {
    error.value = 'فشل توليد النص. حاول مرة أخرى.'
    toast.error('فشل توليد النص')
    console.error(err)
  } finally {
    loadingCaption.value = false
  }
}

// ============================================
// Smart Flow: Generate Prompt from Caption
// ============================================
const handleGeneratePromptFromCaption = async () => {
  if (!brandStore.activeBrand || !contentStore.selectedIdea) return

  // Switch to prompt tab
  activeTab.value = 'prompt'
  
  // Generate prompt
  loadingPrompt.value = true
  error.value = ''

  try {
    const result = await generatePrompt({
      brandId: brandStore.activeBrand.id,
      description: contentStore.selectedIdea + ' - ' + (contentStore.generatedCaption || ''),
      style: 'cinematic'
    })

    contentStore.setGeneratedPrompt(result.prompt)
    toast.success('تم توليد الـ Prompt بنجاح')
  } catch (err) {
    error.value = 'فشل توليد الـ Prompt. حاول مرة أخرى.'
    toast.error('فشل توليد الـ Prompt')
    console.error(err)
  } finally {
    loadingPrompt.value = false
  }
}

// ============================================
// Generate Prompt (Manual)
// ============================================
const handleGeneratePrompt = async () => {
  if (!brandStore.activeBrand || !promptInput.value.trim()) return

  error.value = ''
  loadingPrompt.value = true

  try {
    const result = await generatePrompt({
      brandId: brandStore.activeBrand.id,
      description: promptInput.value,
      style: promptStyle.value
    })

    contentStore.setGeneratedPrompt(result.prompt)
    toast.success('تم توليد الـ Prompt بنجاح')
  } catch (err) {
    error.value = 'فشل توليد الـ Prompt. حاول مرة أخرى.'
    toast.error('فشل توليد الـ Prompt')
    console.error(err)
  } finally {
    loadingPrompt.value = false
  }
}

// ============================================
// Save to Library
// ============================================
const handleSaveToLibrary = async () => {
  savingDraft.value = true
  error.value = ''

  try {
    await contentStore.saveDraftFromGenerator()
    toast.success('تم حفظ المحتوى في المكتبة بنجاح!')
    
    // Reset and go back to ideas
    setTimeout(() => {
      activeTab.value = 'ideas'
    }, 1000)
  } catch (err) {
    error.value = 'فشل حفظ المحتوى. حاول مرة أخرى.'
    toast.error('فشل حفظ المحتوى')
    console.error(err)
  } finally {
    savingDraft.value = false
  }
}

// ============================================
// Reset Flow
// ============================================
const resetFlow = () => {
  contentStore.resetGeneratorFlow()
  activeTab.value = 'ideas'
  toast.info('تم إعادة تعيين العملية')
}

// ============================================
// Copy Utilities
// ============================================
const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('تم النسخ إلى الحافظة')
  } catch (err) {
    toast.error('فشل النسخ')
    console.error(err)
  }
}

const copyAllIdeas = async () => {
  const text = generatedIdeas.value
    .map((idea, idx) => `${idx + 1}. ${idea.title}`)
    .join('\n\n')
  await copyText(text)
}

const copyCaption = async () => {
  if (!contentStore.generatedCaption) return

  const text = `${contentStore.generatedCaption}\n\n${contentStore.generatedHashtags.map(t => '#' + t).join(' ')}`
  await copyText(text)
}

// ============================================
// Auto-load caption/prompt when navigating
// ============================================
watch(activeTab, (newTab) => {
  // Auto-generate caption if selected idea exists but no caption
  if (newTab === 'caption' && contentStore.selectedIdea && !contentStore.generatedCaption && !loadingCaption.value) {
    handleSelectIdea(contentStore.selectedIdea)
  }
})
</script>
