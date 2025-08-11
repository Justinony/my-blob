<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ isLogin ? '欢迎回来' : '加入我们' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ isLogin ? '登录您的账户' : '创建新账户' }}
        </p>
      </div>

      <!-- 登录/注册表单卡片 -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <!-- 切换标签 -->
        <div class="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button 
            @click="isLogin = true"
            :class="[
              'flex-1 py-2 text-center rounded-md transition-all duration-200 text-sm font-medium',
              isLogin 
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            ]"
          >
            登录
          </button>
          <button 
            @click="isLogin = false"
            :class="[
              'flex-1 py-2 text-center rounded-md transition-all duration-200 text-sm font-medium',
              !isLogin 
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            ]"
          >
            注册
          </button>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- 注册时显示用户名 -->
          <div v-if="!isLogin" class="space-y-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              用户名
            </label>
            <input 
              v-model="form.name"
              type="text" 
              required
              :class="[
                'w-full px-4 py-3 border rounded-lg transition-colors duration-200',
                'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                'placeholder-gray-400 dark:placeholder-gray-500',
                errors.name ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              ]"
              placeholder="请输入用户名"
            >
            <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
          </div>

          <!-- 邮箱 -->
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              邮箱
            </label>
            <input 
              v-model="form.email"
              type="email" 
              required
              :class="[
                'w-full px-4 py-3 border rounded-lg transition-colors duration-200',
                'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                'placeholder-gray-400 dark:placeholder-gray-500',
                errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              ]"
              placeholder="请输入邮箱"
            >
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
          </div>

          <!-- 密码 -->
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              密码
            </label>
            <div class="relative">
              <input 
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                :class="[
                  'w-full px-4 py-3 pr-12 border rounded-lg transition-colors duration-200',
                  'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                  'placeholder-gray-400 dark:placeholder-gray-500',
                  errors.password ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                ]"
                placeholder="请输入密码"
              >
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Eye v-if="!showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
            </div>
            <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
            <div v-if="!isLogin && form.password" class="mt-2">
              <div class="flex items-center space-x-2">
                <div class="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    :class="[
                      'h-2 rounded-full transition-all duration-300',
                      passwordStrength.color
                    ]"
                    :style="{ width: passwordStrength.width }"
                  ></div>
                </div>
                <span :class="['text-xs', passwordStrength.textColor]">{{ passwordStrength.text }}</span>
              </div>
            </div>
          </div>

          <!-- 确认密码（仅注册时显示） -->
          <div v-if="!isLogin" class="space-y-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              确认密码
            </label>
            <input 
              v-model="form.confirmPassword"
              type="password" 
              required
              :class="[
                'w-full px-4 py-3 border rounded-lg transition-colors duration-200',
                'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                'placeholder-gray-400 dark:placeholder-gray-500',
                errors.confirmPassword ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              ]"
              placeholder="请再次输入密码"
            >
            <p v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1">{{ errors.confirmPassword }}</p>
          </div>

          <!-- 记住登录（仅登录时显示） -->
          <div v-if="isLogin" class="flex items-center justify-between">
            <label class="flex items-center">
              <input 
                v-model="form.rememberMe"
                type="checkbox" 
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              >
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">记住登录</span>
            </label>
            <button 
              type="button"
              class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              @click="showForgotPassword = true"
            >
              忘记密码？
            </button>
          </div>

          <!-- 提交按钮 -->
          <button 
            type="submit"
            :disabled="userStore.isLoading || !isFormValid"
            class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <div v-if="userStore.isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              处理中...
            </div>
            <span v-else>
              {{ isLogin ? '登录' : '注册' }}
            </span>
          </button>
        </form>

        <!-- 第三方登录 -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">或者</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <button 
              @click="handleGitHubLogin"
              :disabled="userStore.isLoading"
              class="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
            
            <button 
              @click="handleGoogleLogin"
              :disabled="userStore.isLoading"
              class="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
          </div>
        </div>

        <!-- 测试账户提示 -->
        <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">测试账户</h4>
          <div class="text-xs text-blue-600 dark:text-blue-400 space-y-1">
            <p><strong>管理员:</strong> admin@example.com / admin123</p>
            <p><strong>普通用户:</strong> user@example.com / user123</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 忘记密码模态框 -->
    <div v-if="showForgotPassword" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">重置密码</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">请输入您的邮箱地址，我们将发送重置密码的链接。</p>
        <input 
          v-model="resetEmail"
          type="email" 
          placeholder="请输入邮箱"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white mb-4"
        >
        <div class="flex space-x-3">
          <button 
            @click="showForgotPassword = false"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            取消
          </button>
          <button 
            @click="handleForgotPassword"
            class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Eye, EyeOff } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import type { LoginCredentials, RegisterData } from '@/types/auth'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 响应式状态
const isLogin = ref(true)
const showPassword = ref(false)
const showForgotPassword = ref(false)
const resetEmail = ref('')

// 表单数据
const form = reactive({
  email: '',
  password: '',
  name: '',
  confirmPassword: '',
  rememberMe: false
})

// 表单验证错误
const errors = reactive({
  email: '',
  password: '',
  name: '',
  confirmPassword: ''
})

// 密码强度计算
const passwordStrength = computed(() => {
  const password = form.password
  if (!password) return { width: '0%', color: 'bg-gray-300', text: '', textColor: 'text-gray-500' }
  
  let score = 0
  if (password.length >= 8) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  
  if (score <= 2) {
    return { width: '33%', color: 'bg-red-500', text: '弱', textColor: 'text-red-500' }
  } else if (score <= 3) {
    return { width: '66%', color: 'bg-yellow-500', text: '中', textColor: 'text-yellow-500' }
  } else {
    return { width: '100%', color: 'bg-green-500', text: '强', textColor: 'text-green-500' }
  }
})

// 表单验证
const validateForm = () => {
  // 清空之前的错误
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  let isValid = true
  
  // 邮箱验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email) {
    errors.email = '请输入邮箱'
    isValid = false
  } else if (!emailRegex.test(form.email)) {
    errors.email = '请输入有效的邮箱地址'
    isValid = false
  }
  
  // 密码验证
  if (!form.password) {
    errors.password = '请输入密码'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = '密码至少需要6个字符'
    isValid = false
  }
  
  // 注册时的额外验证
  if (!isLogin.value) {
    // 用户名验证
    if (!form.name) {
      errors.name = '请输入用户名'
      isValid = false
    } else if (form.name.length < 3) {
      errors.name = '用户名至少需要3个字符'
      isValid = false
    } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(form.name)) {
      errors.name = '用户名只能包含字母、数字、下划线和中文'
      isValid = false
    }
    
    // 确认密码验证
    if (!form.confirmPassword) {
      errors.confirmPassword = '请确认密码'
      isValid = false
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = '两次输入的密码不一致'
      isValid = false
    }
  }
  
  return isValid
}

// 表单是否有效
const isFormValid = computed(() => {
  if (isLogin.value) {
    return form.email && form.password
  } else {
    return form.email && form.password && form.name && form.confirmPassword && form.password === form.confirmPassword
  }
})

// 处理表单提交
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  try {
    if (isLogin.value) {
      const credentials: LoginCredentials = {
        email: form.email,
        password: form.password,
        rememberMe: form.rememberMe
      }
      await userStore.login(credentials)
    } else {
      const registerData: RegisterData = {
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword
      }
      await userStore.register(registerData)
    }
    
    // 登录/注册成功后跳转
    const redirect = route.query.redirect as string || '/'
    router.push(redirect)
  } catch (error) {
    // 错误已在store中处理
    console.error('Auth error:', error)
  }
}

// GitHub登录
const handleGitHubLogin = async () => {
  try {
    await userStore.loginWithGitHub()
    const redirect = route.query.redirect as string || '/'
    router.push(redirect)
  } catch (error) {
    console.error('GitHub login error:', error)
  }
}

// Google登录
const handleGoogleLogin = async () => {
  try {
    await userStore.loginWithGoogle()
    const redirect = route.query.redirect as string || '/'
    router.push(redirect)
  } catch (error) {
    console.error('Google login error:', error)
  }
}

// 忘记密码
const handleForgotPassword = () => {
  if (!resetEmail.value) {
    ElMessage.warning('请输入邮箱地址')
    return
  }
  
  // 模拟发送重置邮件
  ElMessage.success('重置密码邮件已发送，请查收')
  showForgotPassword.value = false
  resetEmail.value = ''
}

// 监听路由变化，设置初始状态
watch(() => route.path, (newPath) => {
  if (newPath === '/login') {
    isLogin.value = true
  } else if (newPath === '/register') {
    isLogin.value = false
  }
}, { immediate: true })

// 切换登录/注册时清空表单
watch(isLogin, () => {
  form.email = ''
  form.password = ''
  form.name = ''
  form.confirmPassword = ''
  
  errors.email = ''
  errors.password = ''
  errors.name = ''
  errors.confirmPassword = ''
})

// 如果已登录，重定向到首页
if (userStore.isAuthenticated) {
  const redirect = route.query.redirect as string || '/'
  router.push(redirect)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>