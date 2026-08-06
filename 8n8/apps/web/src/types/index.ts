// User Types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role?: 'admin' | 'user'
}

// Brand Types
export interface Brand {
  id: string
  name: string
  industry: string
  tone: string
  audience: string
  forbidden_words: string[]
  allowed_words: string[]
  logo?: string
  created_at: string
}

// Content Types
export type ContentStatus = 'draft' | 'ready' | 'scheduled' | 'posted'
export type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin'

export interface Content {
  id: string
  title: string
  body: string
  platform: Platform
  status: ContentStatus
  scheduled_at?: string
  posted_at?: string
  created_at: string
  updated_at: string
  brand_id: string
}

// Generation Types
export interface GenerationRequest {
  brand_id: string
  type: 'ideas' | 'caption' | 'prompt'
  context?: string
  platform?: Platform
}

export interface Idea {
  id: string
  title: string
  description: string
  platform?: Platform
  created_at: string
}

// Integration Types
export interface Integration {
  platform: Platform
  connected: boolean
  account_name?: string
  account_id?: string
  expires_at?: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

// Toast/Notification Types
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}
