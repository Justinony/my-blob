import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  AuthUser, 
  AuthState, 
  LoginCredentials, 
  RegisterData,
  UpdateProfileData,
  ChangePasswordData
} from '@/types/auth'
import { ElMessage } from 'element-plus'

// 模拟API服务
const mockAuthService = {
  async login(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟登录验证
    if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
      const user: AuthUser = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20avatar%20portrait%20modern%20style&image_size=square',
        role: 'admin',
        bio: '资深前端开发工程师，专注于Vue.js和现代前端技术',
        socialLinks: {
          github: 'https://github.com/example',
          twitter: 'https://twitter.com/example'
        },
        createdAt: new Date('2023-01-01').toISOString(),
        updatedAt: new Date().toISOString()
      }
      return { user, token: 'mock-jwt-token-admin' }
    } else if (credentials.email === 'user@example.com' && credentials.password === 'user123') {
      const user: AuthUser = {
        id: '2',
        email: 'user@example.com',
        name: 'User',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20user%20avatar%20casual%20style&image_size=square',
        role: 'user',
        bio: '热爱技术，喜欢分享和学习',
        socialLinks: {},
        createdAt: new Date('2023-06-01').toISOString(),
        updatedAt: new Date().toISOString()
      }
      return { user, token: 'mock-jwt-token-user' }
    } else {
      throw new Error('邮箱或密码错误')
    }
  },

  async register(data: RegisterData): Promise<{ user: AuthUser; token: string }> {
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    // 模拟邮箱已存在检查
    if (data.email === 'admin@example.com' || data.email === 'user@example.com') {
      throw new Error('该邮箱已被注册')
    }
    
    const user: AuthUser = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=new%20user%20avatar%20default%20style&image_size=square',
      role: 'user',
      bio: '',
      socialLinks: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return { user, token: 'mock-jwt-token-new-user' }
  },

  async updateProfile(data: UpdateProfileData): Promise<AuthUser> {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟更新用户资料
    const currentUser = JSON.parse(localStorage.getItem('auth_user') || '{}')
    const updatedUser = {
      ...currentUser,
      ...data,
      updatedAt: new Date()
    }
    
    return updatedUser
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟密码验证
    if (data.currentPassword !== 'admin123' && data.currentPassword !== 'user123') {
      throw new Error('当前密码错误')
    }
  },

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))
    // 模拟登出操作
  },

  async refreshToken(): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return 'mock-refreshed-token'
  }
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userInitials = computed(() => {
    if (!user.value) return ''
    const name = user.value.name
    return name.charAt(0).toUpperCase()
  })

  // 初始化状态（从localStorage恢复）
  const initializeAuth = () => {
    try {
      const savedUser = localStorage.getItem('auth_user')
      const savedToken = localStorage.getItem('auth_token')
      
      if (savedUser && savedToken) {
        user.value = JSON.parse(savedUser)
        token.value = savedToken
      }
    } catch (error) {
      console.error('Failed to initialize auth state:', error)
      clearAuth()
    }
  }

  // 清除认证状态
  const clearAuth = () => {
    user.value = null
    token.value = null
    error.value = null
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }

  // 保存认证状态
  const saveAuth = (userData: AuthUser, authToken: string) => {
    user.value = userData
    token.value = authToken
    localStorage.setItem('auth_user', JSON.stringify(userData))
    localStorage.setItem('auth_token', authToken)
  }

  // 登录
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await mockAuthService.login(credentials)
      saveAuth(response.user, response.token)
      
      ElMessage.success('登录成功！')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登录失败'
      error.value = errorMessage
      ElMessage.error(errorMessage)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 注册
  const register = async (data: RegisterData): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await mockAuthService.register(data)
      saveAuth(response.user, response.token)
      
      ElMessage.success('注册成功！')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '注册失败'
      error.value = errorMessage
      ElMessage.error(errorMessage)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 登出
  const logout = async (): Promise<void> => {
    try {
      isLoading.value = true
      
      await mockAuthService.logout()
      clearAuth()
      
      ElMessage.success('已退出登录')
    } catch (err) {
      console.error('Logout error:', err)
      // 即使API失败也要清除本地状态
      clearAuth()
    } finally {
      isLoading.value = false
    }
  }

  // 更新用户资料
  const updateProfile = async (data: UpdateProfileData): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null
      
      const updatedUser = await mockAuthService.updateProfile(data)
      user.value = updatedUser
      localStorage.setItem('auth_user', JSON.stringify(updatedUser))
      
      ElMessage.success('资料更新成功！')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新失败'
      error.value = errorMessage
      ElMessage.error(errorMessage)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 修改密码
  const changePassword = async (data: ChangePasswordData): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null
      
      await mockAuthService.changePassword(data)
      
      ElMessage.success('密码修改成功！')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '密码修改失败'
      error.value = errorMessage
      ElMessage.error(errorMessage)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 刷新token
  const refreshToken = async (): Promise<void> => {
    try {
      const newToken = await mockAuthService.refreshToken()
      token.value = newToken
      localStorage.setItem('auth_token', newToken)
    } catch (err) {
      console.error('Token refresh failed:', err)
      clearAuth()
    }
  }

  // 第三方登录（GitHub）
  const loginWithGitHub = async (): Promise<void> => {
    try {
      isLoading.value = true
      
      // 模拟GitHub OAuth流程
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const user: AuthUser = {
        id: 'github-user-1',
        email: 'github@example.com',
        name: 'GitHub User',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=github%20developer%20avatar%20professional&image_size=square',
        role: 'user',
        bio: '通过GitHub登录的用户',
        socialLinks: {
          github: 'https://github.com/example'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      saveAuth(user, 'mock-github-token')
      ElMessage.success('GitHub登录成功！')
    } catch (err) {
      const errorMessage = 'GitHub登录失败'
      error.value = errorMessage
      ElMessage.error(errorMessage)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 第三方登录（Google）
  const loginWithGoogle = async (): Promise<void> => {
    try {
      isLoading.value = true
      
      // 模拟Google OAuth流程
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const user: AuthUser = {
        id: 'google-user-1',
        email: 'google@example.com',
        name: 'Google User',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=google%20user%20avatar%20friendly&image_size=square',
        role: 'user',
        bio: '通过Google登录的用户',
        socialLinks: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      saveAuth(user, 'mock-google-token')
      ElMessage.success('Google登录成功！')
    } catch (err) {
      const errorMessage = 'Google登录失败'
      error.value = errorMessage
      ElMessage.error(errorMessage)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 初始化
  initializeAuth()

  return {
    // 状态
    user,
    token,
    isLoading,
    error,
    
    // 计算属性
    isAuthenticated,
    isAdmin,
    userInitials,
    
    // 方法
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshToken,
    loginWithGitHub,
    loginWithGoogle,
    clearAuth,
    initializeAuth
  }
})