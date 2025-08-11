<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElInput, ElButton, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { Search, Menu, X, Sun, Moon, User, Settings, LogOut } from 'lucide-vue-next'
import { useBlogStore } from '@/stores/blog'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
const route = useRoute()
const blogStore = useBlogStore()
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

const handleUserAction = (action: string) => {
  switch (action) {
    case 'profile':
      router.push('/profile')
      break
    case 'admin':
      router.push('/admin')
      break
    case 'logout':
      // 处理登出逻辑
      console.log('Logout')
      break
  }
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

          <!-- User Menu -->
          <ElDropdown trigger="click" @command="handleUserAction">
            <div class="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <img 
                :src="blogStore.user.avatar" 
                :alt="blogStore.user.name"
                class="w-8 h-8 rounded-full object-cover"
              >
              <span class="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ blogStore.user.name }}
              </span>
            </div>
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem command="profile">
                  <User class="w-4 h-4 mr-2" />
                  个人资料
                </ElDropdownItem>
                <ElDropdownItem command="admin">
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