<template>
  <div :class="['min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4', pageTopPadding]">
    <div class="max-w-2xl mx-auto text-center">
      <!-- 404 动画图标 -->
      <div class="relative mb-8">
        <div class="text-8xl md:text-9xl font-bold text-gray-200 dark:text-gray-700 select-none">
          4<span class="inline-block animate-bounce">0</span>4
        </div>
        
        <!-- 浮动元素 -->
        <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div class="relative">
            <!-- 搜索图标 -->
            <div class="absolute -top-8 -left-8 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
              <el-icon class="text-2xl text-blue-600">
                <Search />
              </el-icon>
            </div>
            
            <!-- 问号图标 -->
            <div class="absolute -top-4 -right-12 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center animate-bounce delay-300">
              <el-icon class="text-xl text-purple-600">
                <QuestionFilled />
              </el-icon>
            </div>
            
            <!-- 星星装饰 -->
            <div class="absolute -bottom-6 left-4 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center animate-ping">
              <el-icon class="text-sm text-yellow-600">
                <Star />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 错误信息 -->
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          页面走丢了
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-2">
          抱歉，您访问的页面不存在或已被移动
        </p>
        <p class="text-gray-500 dark:text-gray-400">
          请检查URL是否正确，或者返回首页继续浏览
        </p>
      </div>
      
      <!-- 搜索框 -->
      <div class="mb-8">
        <div class="max-w-md mx-auto">
          <el-input
            v-model="searchQuery"
            size="large"
            placeholder="搜索文章、分类或标签..."
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #suffix>
              <el-button
                type="primary"
                @click="handleSearch"
                :disabled="!searchQuery.trim()"
              >
                搜索
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        <el-button type="primary" size="large" @click="goHome">
          <el-icon><House /></el-icon>
          返回首页
        </el-button>
        
        <el-button size="large" @click="goBack">
          <el-icon><Back /></el-icon>
          返回上页
        </el-button>
        
        <el-button size="large" @click="reportProblem">
          <el-icon><Warning /></el-icon>
          报告问题
        </el-button>
      </div>
      
      <!-- 推荐内容 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">推荐内容</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 热门文章 -->
          <div>
            <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              <el-icon class="mr-2 text-red-500"><TrendCharts /></el-icon>
              热门文章
            </h3>
            <div class="space-y-3">
              <div
                v-for="article in popularArticles"
                :key="article.id"
                class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                @click="goToArticle(article.id)"
              >
                <img
                  :src="article.cover"
                  :alt="article.title"
                  class="w-12 h-12 rounded object-cover"
                />
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900 dark:text-white truncate">{{ article.title }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ article.views }} 次阅读</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 热门分类 -->
          <div>
            <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              <el-icon class="mr-2 text-blue-500"><Folder /></el-icon>
              热门分类
            </h3>
            <div class="space-y-3">
              <div
                v-for="category in popularCategories"
                :key="category.id"
                class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                @click="goToCategory(category.id)"
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="w-4 h-4 rounded"
                    :style="{ backgroundColor: category.color }"
                  />
                  <span class="font-medium text-gray-900 dark:text-white">{{ category.name }}</span>
                </div>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ category.count }} 篇</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 标签云 -->
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <el-icon class="mr-2 text-green-500"><PriceTag /></el-icon>
            热门标签
          </h3>
          <div class="flex flex-wrap gap-2">
            <el-tag
              v-for="tag in popularTags"
              :key="tag.id"
              :type="getTagType(tag.count)"
              class="cursor-pointer"
              @click="goToTag(tag.id)"
            >
              {{ tag.name }} ({{ tag.count }})
            </el-tag>
          </div>
        </div>
      </div>
      
      <!-- 联系信息 -->
      <div class="mt-8 text-center text-gray-500 dark:text-gray-400">
        <p class="mb-2">如果问题持续存在，请联系我们</p>
        <div class="flex items-center justify-center space-x-4 text-sm">
          <a href="mailto:support@example.com" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <el-icon class="mr-1"><Message /></el-icon>
            support@example.com
          </a>
          <span>|</span>
          <a href="tel:400-123-4567" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <el-icon class="mr-1"><Phone /></el-icon>
            400-123-4567
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElInput, ElMessage } from 'element-plus'
import { Home, Search, Mail, Phone, MapPin } from 'lucide-vue-next'
import { useBlogStore } from '@/stores/blog'
import { useNavbar } from '@/composables/useNavbar'

const router = useRouter()
const blogStore = useBlogStore()
const { pageTopPadding } = useNavbar()
const searchQuery = ref('')

// 热门文章
const popularArticles = ref([
  {
    id: 1,
    title: 'Vue 3 Composition API 深度解析',
    views: 1250,
    cover: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=vue_composition_api_tutorial&image_size=square'
  },
  {
    id: 2,
    title: 'TypeScript 进阶技巧',
    views: 980,
    cover: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=typescript_advanced_tips&image_size=square'
  },
  {
    id: 3,
    title: '前端性能优化实战',
    views: 890,
    cover: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=frontend_performance_optimization&image_size=square'
  }
])

// 热门分类
const popularCategories = ref([
  {
    id: 1,
    name: 'Vue.js',
    count: 25,
    color: '#4fc08d'
  },
  {
    id: 2,
    name: 'TypeScript',
    count: 18,
    color: '#3178c6'
  },
  {
    id: 3,
    name: '性能优化',
    count: 12,
    color: '#ff6b6b'
  },
  {
    id: 4,
    name: 'React',
    count: 15,
    color: '#61dafb'
  }
])

// 热门标签
const popularTags = ref([
  { id: 1, name: 'Vue 3', count: 15 },
  { id: 2, name: 'TypeScript', count: 20 },
  { id: 3, name: 'Composition API', count: 12 },
  { id: 4, name: '性能优化', count: 8 },
  { id: 5, name: 'Webpack', count: 5 },
  { id: 6, name: 'Vite', count: 10 },
  { id: 7, name: 'React Hooks', count: 7 },
  { id: 8, name: 'Node.js', count: 6 }
])

// 方法
const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  
  router.push({
    name: 'search',
    query: { q: searchQuery.value.trim() }
  })
}

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const reportProblem = () => {
  ElMessage.info('问题反馈功能开发中')
}

const goToArticle = (id: number) => {
  router.push(`/article/${id}`)
}

const goToCategory = (id: number) => {
  router.push(`/category/${id}`)
}

const goToTag = (id: number) => {
  router.push(`/tag/${id}`)
}

const getTagType = (count: number) => {
  if (count >= 15) return 'danger'
  if (count >= 10) return 'warning'
  if (count >= 5) return 'success'
  return 'info'
}
</script>

<style scoped>
.search-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.animate-bounce {
  animation: bounce 1s infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.delay-300 {
  animation-delay: 300ms;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

@keyframes pulse {
  50% {
    opacity: .5;
  }
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>