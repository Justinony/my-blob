// 用户认证相关类型定义

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
  avatar?: string
  bio?: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  avatar: string
  bio: string
  role: 'admin' | 'user'
  createdAt: string
  updatedAt: string
  socialLinks?: {
    github?: string
    twitter?: string
    linkedin?: string
  }
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  token: string | null
}

export interface AuthResponse {
  user: AuthUser
  token: string
  refreshToken?: string
  expiresIn: number
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordReset {
  token: string
  password: string
  confirmPassword: string
}

export interface UpdateProfileData {
  name?: string
  bio?: string
  avatar?: string
  socialLinks?: {
    github?: string
    twitter?: string
    linkedin?: string
  }
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// 表单验证规则类型
export interface ValidationRule {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  message: string
  validator?: (value: any) => boolean | string
}

export interface FormValidation {
  [key: string]: ValidationRule[]
}

// API 错误类型
export interface ApiError {
  code: string
  message: string
  details?: any
}

// 认证事件类型
export type AuthEvent = 
  | 'login'
  | 'logout'
  | 'register'
  | 'profile_update'
  | 'password_change'
  | 'token_refresh'
  | 'session_expired'

export interface AuthEventPayload {
  event: AuthEvent
  user?: AuthUser
  timestamp: string
  metadata?: any
}