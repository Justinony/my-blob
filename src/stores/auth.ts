import { defineStore } from 'pinia'
import type { 
  AuthState, 
  AuthUser, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  UpdateProfileData,
  ChangePasswordData,
  PasswordResetRequest,
  PasswordReset
} from '../types/auth'

// Mock 认证服务
const mockAuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 简单的mock验证
    if (credentials.email === 'admin@blog.com' && credentials.password === 'admin123') {
      const user: AuthUser = {
        id: '1',
        name: '博客管理员',
        email: 'admin@blog.com',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20avatar%20portrait&image_size=square',
        bio: '全栈开发工程师，专注于现代Web技术栈',
        role: 'admin',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        socialLinks: {
          github: 'https://github.com/admin',
          twitter: 'https://twitter.com/admin',
          linkedin: 'https://linkedin.com/in/admin'
        }
      }
      
      return {
        user,
        token: 'mock-jwt-token-' + Date.now(),
        expiresIn: 3600 * 24 * 7 // 7天
      }
    } else if (credentials.email === 'user@blog.com' && credentials.password === 'user123') {
      const user: AuthUser = {
        id: '2',
        name: '普通用户',
        email: 'user@blog.com',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20user%20avatar&image_size=square',
        bio: '技术爱好者，喜欢学习新技术',
        role: 'user',
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      }
      
      return {
        user,
        token: 'mock-jwt-token-user-' + Date.now(),
        expiresIn: 3600 * 24 * 7
      }
    } else {
      throw new Error('邮箱或密码错误')
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    // 检查邮箱是否已存在
    if (data.email === 'admin@blog.com' || data.email === 'user@blog.com') {
      throw new Error('该邮箱已被注册')
    }
    
    const user: AuthUser = {
      id: 'new-user-' + Date.now(),
      name: data.name,
      email: data.email,
      avatar: data.avatar || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar&image_size=square',
      bio: data.bio || '这个人很懒，什么都没有留下',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return {
      user,
      token: 'mock-jwt-token-new-' + Date.now(),
      expiresIn: 3600 * 24 * 7
    }
  },

  async updateProfile(data: UpdateProfileData): Promise<AuthUser> {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟更新用户信息
    const currentUser = JSON.parse(localStorage.getItem('auth_user') || '{}')
    const updatedUser = {
      ...currentUser,
      ...data,
      updatedAt: new Date().toISOString()
    }
    
    localStorage.setItem('auth_user', JSON.stringify(updatedUser))
    return updatedUser
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 简单验证当前密码
    if (data.currentPassword !== 'admin123' && data.currentPassword !== 'user123') {
      throw new Error('当前密码错误')
    }
    
    // 模拟密码更改成功
    console.log('密码已更改')
  },

  async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟发送重置邮件
    console.log(`密码重置邮件已发送到 ${data.email}`)
  },

  async resetPassword(data: PasswordReset): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟密码重置成功
    console.log('密码重置成功')
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    userName: (state) => state.user?.name || '',
    userAvatar: (state) => state.user?.avatar || ''
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await mockAuthService.login(credentials)
        
        this.user = response.user
        this.token = response.token
        this.isAuthenticated = true
        
        // 保存到本地存储
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('auth_user', JSON.stringify(response.user))
        
        return response
      } catch (error) {
        this.error = error instanceof Error ? error.message : '登录失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async register(data: RegisterData) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await mockAuthService.register(data)
        
        this.user = response.user
        this.token = response.token
        this.isAuthenticated = true
        
        // 保存到本地存储
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('auth_user', JSON.stringify(response.user))
        
        return response
      } catch (error) {
        this.error = error instanceof Error ? error.message : '注册失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateProfile(data: UpdateProfileData) {
      this.isLoading = true
      this.error = null
      
      try {
        const updatedUser = await mockAuthService.updateProfile(data)
        this.user = updatedUser
        return updatedUser
      } catch (error) {
        this.error = error instanceof Error ? error.message : '更新失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async changePassword(data: ChangePasswordData) {
      this.isLoading = true
      this.error = null
      
      try {
        await mockAuthService.changePassword(data)
      } catch (error) {
        this.error = error instanceof Error ? error.message : '密码更改失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async requestPasswordReset(data: PasswordResetRequest) {
      this.isLoading = true
      this.error = null
      
      try {
        await mockAuthService.requestPasswordReset(data)
      } catch (error) {
        this.error = error instanceof Error ? error.message : '请求失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async resetPassword(data: PasswordReset) {
      this.isLoading = true
      this.error = null
      
      try {
        await mockAuthService.resetPassword(data)
      } catch (error) {
        this.error = error instanceof Error ? error.message : '重置失败'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.error = null
      
      // 清除本地存储
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    },

    // 从本地存储恢复认证状态
    restoreAuth() {
      const token = localStorage.getItem('auth_token')
      const userStr = localStorage.getItem('auth_user')
      
      if (token && userStr) {
        try {
          this.token = token
          this.user = JSON.parse(userStr)
          this.isAuthenticated = true
        } catch (error) {
          // 如果解析失败，清除无效数据
          this.logout()
        }
      }
    },

    clearError() {
      this.error = null
    }
  }
})