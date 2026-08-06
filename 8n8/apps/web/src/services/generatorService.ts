import type { Platform } from '@/types'

// =====================================================
// Types
// =====================================================

export interface GenerateIdeasPayload {
  brandId: string
  topic?: string
  platform?: Platform
  count?: number
}

export interface GenerateCaptionPayload {
  brandId: string
  topic: string
  platform?: Platform
  tone?: string
}

export interface GeneratePromptPayload {
  brandId: string
  description: string
  style?: string
}

export interface IdeaResult {
  id: string
  title: string
  description: string
  hook?: string
}

export interface CaptionResult {
  hook: string
  body: string
  cta: string
  hashtags: string[]
}

export interface PromptResult {
  prompt: string
  aspectRatio: string
  style: string
}

// =====================================================
// Mock Data
// =====================================================

const mockIdeas: string[] = [
  '5 أخطاء شائعة تمنع محتواك من الانتشار',
  'ليش 90% من الحسابات ما عم تكبر؟ السبب الحقيقي',
  'كيف تبني Reel يضرب الخوارزمية في 2024',
  'السر وراء حسابات مليون متابع: خطوات عملية',
  'محتوى viral بدون تصوير وجهك',
  'الخطة الكاملة لبناء Personal Brand قوية',
  '7 استراتيجيات لزيادة Engagement بنسبة 300%',
  'كيف تكتب Hook يوقف المستخدم عن السكرول',
  'خطة محتوى 30 يوم جاهزة للتطبيق',
  'أدوات AI مجانية تختصر عليك 10 ساعات أسبوعياً'
]

const mockHooks: string[] = [
  'توقف عن السكرول - هذا المحتوى راح يغير طريقة تفكيرك',
  'ليش ما حدا عم يحكيلك عن هالشي؟',
  'الحقيقة اللي الكل بيخبيها عنك',
  'آخر مرة سمعت هيك نصيحة كانت من سنتين',
  'اذا كنت عم تعمل هيك، وقف فوراً'
]

const mockCTAs: string[] = [
  'احفظ هذا المنشور ورجعلو كل أسبوع',
  'شاركه مع شخص بحاجة لهالنصائح',
  'تابعنا لمزيد من المحتوى القيّم',
  'اكتبلنا رأيك بالتعليقات',
  'جرب هالخطوات وشاركنا النتائج'
]

const mockHashtags: string[][] = [
  ['محتوى_عربي', 'تسويق_رقمي', 'ريادة_أعمال', 'نجاح'],
  ['انستغرام', 'محتوى_ابداعي', 'تطوير_ذاتي', 'فريلانسر'],
  ['سوشيال_ميديا', 'نمو', 'استراتيجية', 'عمل_حر'],
  ['مشروع_ناجح', 'طموح', 'تحفيز', 'ابداع']
]

// =====================================================
// Service Functions
// =====================================================

/**
 * Generate content ideas - Mock implementation
 * TODO: Replace with n8n webhook call
 * Endpoint: POST ${API_BASE_URL}/generate/ideas
 */
export async function generateIdeas(
  payload: GenerateIdeasPayload
): Promise<IdeaResult[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400))

  // Mock: randomly select ideas
  const count = payload.count || 5
  const shuffled = [...mockIdeas].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, count)

  return selected.map((title, index) => ({
    id: `idea-${Date.now()}-${index}`,
    title,
    description: `فكرة محتوى قوية تستهدف ${payload.platform || 'جميع المنصات'}`,
    hook: mockHooks[Math.floor(Math.random() * mockHooks.length)]
  }))

  /* 
  // Real implementation (n8n):
  const response = await axios.post(`${API_BASE_URL}/generate/ideas`, payload)
  return response.data
  */
}

/**
 * Generate caption - Mock implementation
 * TODO: Replace with n8n webhook call
 * Endpoint: POST ${API_BASE_URL}/generate/caption
 */
export async function generateCaption(
  payload: GenerateCaptionPayload
): Promise<CaptionResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500))

  const hook = mockHooks[Math.floor(Math.random() * mockHooks.length)]
  const cta = mockCTAs[Math.floor(Math.random() * mockCTAs.length)]
  const hashtags = mockHashtags[Math.floor(Math.random() * mockHashtags.length)]

  const body = `هل تعلم أن ${payload.topic} يمكن أن يحدث فرقاً كبيراً في نتائجك؟

✨ ثلاث نقاط أساسية:
• النقطة الأولى: التركيز على الجودة قبل الكمية
• النقطة الثانية: الاستمرارية هي المفتاح الحقيقي
• النقطة الثالثة: التفاعل مع جمهورك يبني الثقة

النتيجة؟ نمو حقيقي ومستدام 📈`

  return {
    hook,
    body,
    cta,
    hashtags
  }

  /* 
  // Real implementation (n8n):
  const response = await axios.post(`${API_BASE_URL}/generate/caption`, payload)
  return response.data
  */
}

/**
 * Generate video prompt - Mock implementation
 * TODO: Replace with n8n webhook call
 * Endpoint: POST ${API_BASE_URL}/generate/prompt
 */
export async function generatePrompt(
  payload: GeneratePromptPayload
): Promise<PromptResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 900 + Math.random() * 400))

  const styles = ['cinematic', 'minimal', 'modern', 'professional', 'dynamic']
  const style = payload.style || styles[Math.floor(Math.random() * styles.length)]

  const prompt = `${payload.description}, ${style} style, vertical format 9:16, 
high quality video production, smooth camera movements, 
professional color grading, no text overlays, 
clean and modern aesthetic, business-focused content, 
4k resolution, perfect for Instagram Reels and TikTok, 
engaging visual storytelling, trending content style 2024`.trim().replace(/\s+/g, ' ')

  return {
    prompt,
    aspectRatio: '9:16',
    style
  }

  /* 
  // Real implementation (n8n):
  const response = await axios.post(`${API_BASE_URL}/generate/prompt`, payload)
  return response.data
  */
}

// =====================================================
// Helper: Simulate random errors (for testing)
// =====================================================
export function shouldSimulateError(): boolean {
  // 10% chance of error in development
  return import.meta.env.DEV && Math.random() < 0.1
}
