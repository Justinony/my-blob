<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElInput, ElButton, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { Search, Menu, X, Sun, Moon, User, Settings, LogOut, LogIn } from 'lucide-vue-next'
import { useBlogStore } from '@/stores/blog'
import { useUserStore } from '@/stores/user'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
const route = useRoute()
const blogStore = useBlogStore()
const userStore = useUserStore()
const { isDark, toggleTheme } = useTheme()

const searchQuery = ref('')
const isMobileMenuOpen = ref(false)
const isSearchFocused = ref(false)

const navItems = [
  { name: '首页', path: '/', icon: 'home' },
  { name: '文章', path: '/articles', icon: 'file-text' },
  { name: '分类', path: '/categories', icon: 'folder' },
  { name: '标签', path: '/tags', icon: 'tag' },
  { name: '关于', path: '/about', icon: 'user' }
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchQuery.value.trim() }
    })
    searchQuery.value = ''
    isSearchFocused.value = false
  }
}

const handleSearchFocus = () => {
  isSearchFocused.value = true
}

const handleSearchBlur = () => {
  setTimeout(() => {
    isSearchFocused.value = false
  }, 200)
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const navigateTo = (path: string) => {
  router.push(path)
  isMobileMenuOpen.value = false
}

const handleUserAction = async (action: string) => {
  switch (action) {
    case 'profile':
      router.push('/profile')
      break
    case 'admin':
      router.push('/admin')
      break
    case 'logout':
      await userStore.logout()
      router.push('/')
      break
  }
}

const handleLogin = () => {
  router.push('/login')
}
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center space-x-4">
          <router-link 
            to="/" 
            class="flex items-center space-x-2 text-xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              B
            </div>
            <span class="hidden sm:block">{{ blogStore.config.siteName }}</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
              isActive(item.path)
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            ]"
          >
            {{ item.name }}
          </router-link>
        </div>

        <!-- Search & Actions -->
        <div class="flex items-center space-x-4">
          <!-- Search Bar -->
          <div class="relative hidden sm:block">
            <div 
              :class="[
                'flex items-center transition-all duration-300',
                isSearchFocused ? 'w-80' : 'w-64'
              ]"
            >
              <ElInput
                v-model="searchQuery"
                placeholder="搜索文章..."
                class="search-input"
                @keyup.enter="handleSearch"
                @focus="handleSearchFocus"
                @blur="handleSearchBlur"
              >
                <template #prefix>
                  <Search class="w-4 h-4 text-gray-400" />
                </template>
              </ElInput>
            </div>
          </div>

          <!-- Theme Toggle -->
          <ElButton
            circle
            size="small"
            @click="toggleTheme"
            class="theme-toggle"
          >
            <Sun v-if="isDark" class="w-4 h-4" />
            <Moon v-else class="w-4 h-4" />
          </ElButton>

          <!-- User Menu / Login Button -->
          <div v-if="userStore.isAuthenticated">
            <ElDropdown trigger="click" @command="handleUserAction">
              <div class="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                  {{ userStore.userInitials }}
                </div>
                <span class="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ userStore.user?.name }}
                </span>
              </div>
              <template #dropdown>
                <ElDropdownMenu>
                  <ElDropdownItem command="profile">
                    <User class="w-4 h-4 mr-2" />
                    个人资料
                  </ElDropdownItem>
                  <ElDropdownItem v-if="userStore.isAdmin" command="admin">
                    <Settings class="w-4 h-4 mr-2" />
                    管理后台
                  </ElDropdownItem>
                  <ElDropdownItem divided command="logout">
                    <LogOut class="w-4 h-4 mr-2" />
                    退出登录
                  </ElDropdownItem>
                </ElDropdownMenu>
              </template>
            </ElDropdown>
          </div>
          <div v-else>
            <ElButton
              type="primary"
              size="small"
              @click="handleLogin"
              class="login-button"
            >
              <LogIn class="w-4 h-4 mr-1" />
              登录
            </ElButton>
          </div>

          <!-- Mobile Menu Button -->
          <ElButton
            circle
            size="small"
            class="md:hidden"
            @click="toggleMobileMenu"
          >
            <Menu v-if="!isMobileMenuOpen" class="w-4 h-4" />
            <X v-else class="w-4 h-4" />
          </ElButton>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div 
        :class="[
          'md:hidden transition-all duration-300 ease-in-out overflow-hidden',
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        ]"
      >
        <div class="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <!-- Mobile Search -->
          <div class="px-3 py-2">
            <ElInput
              v-model="searchQuery"
              placeholder="搜索文章..."
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <Search class="w-4 h-4 text-gray-400" />
              </template>
            </ElInput>
          </div>
          
          <!-- Mobile Navigation Items -->
          <button
            v-for="item in navItems"
            :key="item.path"
            @click="navigateTo(item.path)"
            :class="[
              'w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors',
              isActive(item.path)
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            ]"
          >
            {{ item.name }}
          </button>
          
          <!-- Mobile User Section -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
            <div v-if="userStore.isAuthenticated" class="space-y-1">
              <!-- User Info -->
              <div class="flex items-center px-3 py-2">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm mr-3">
                  {{ userStore.userInitials }}
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ userStore.user?.name }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ userStore.user?.email }}
                  </div>
                </div>
              </div>
              
              <!-- User Actions -->
              <button
                @click="navigateTo('/profile')"
                class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center"
              >
                <User class="w-4 h-4 mr-2" />
                个人资料
              </button>
              
              <button
                v-if="userStore.isAdmin"
                @click="navigateTo('/admin')"
                class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center"
              >
                <Settings class="w-4 h-4 mr-2" />
                管理后台
              </button>
              
              <button
                @click="handleUserAction('logout')"
                class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center"
              >
                <LogOut class="w-4 h-4 mr-2" />
                退出登录
              </button>
            </div>
            
            <div v-else>
              <button
                @click="handleLogin"
                class="w-full px-3 py-2 bg-blue-500 text-white rounded-md text-base font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <LogIn class="w-4 h-4 mr-2" />
                登录
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.search-input :deep(.el-input__wrapper) {
  @apply bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700;
}

.search-input :deep(.el-input__wrapper:hover) {
  @apply border-blue-300 dark:border-blue-600;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  @apply border-blue-500 dark:border-blue-400 shadow-lg;
}

.theme-toggle {
  @apply bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400;
}

.theme-toggle:hover {
  @apply bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200;
}
</style>