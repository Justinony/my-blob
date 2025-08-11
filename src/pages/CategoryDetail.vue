<template>
  <div class="min-h-screen bg-gray-50 pt-16">
    <!-- 分类头部 -->
    <div class="bg-white border-b">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center space-x-4 mb-6">
          <div
            class="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
            :style="{ backgroundColor: category.color }"
          >
            {{ category.name.charAt(0) }}
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ category.name }}</h1>
            <p class="text-gray-600 mt-1">{{ category.description }}</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-6 text-sm text-gray-500">
          <div class="flex items-center space-x-1">
            <el-icon><Document /></el-icon>
            <span>{{ category.articleCount }} 篇文章</span>
          </div>
          <div class="flex items-center space-x-1">
            <el-icon><Calendar /></el-icon>
            <span>创建于 {{ category.createdAt }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <el-icon><View /></el-icon>
            <span>{{ category.totalViews }} 次阅读</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 主要内容 -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 筛选和排序 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div class="flex items-center space-x-4">
            <el-input
              v-model="searchQuery"
              placeholder="搜索文章..."
              class="w-64"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            
            <el-select v-model="sortBy" placeholder="排序方式" class="w-32">
              <el-option label="最新" value="date" />
              <el-option label="最热" value="views" />
              <el-option label="标题" value="title" />
            </el-select>
            
            <el-select v-model="filterStatus" placeholder="状态" class="w-24">
              <el-option label="全部" value="" />
              <el-option label="已发布" value="published" />
              <el-option label="草稿" value="draft" />
            </el-select>
          </div>
          
          <div class="flex items-center space-x-2">
            <el-tooltip content="列表视图">
              <el-button
                :type="viewMode === 'list' ? 'primary' : 'default'"
                @click="viewMode = 'list'"
              >
                <el-icon><List /></el-icon>
              </el-button>
            </el-tooltip>
            
            <el-tooltip content="网格视图">
              <el-button
                :type="viewMode === 'grid' ? 'primary' : 'default'"
                @click="viewMode = 'grid'"
              >
                <el-icon><Grid /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
      
      <!-- 文章列表 -->
      <div v-if="viewMode === 'list'" class="space-y-6">
        <div
          v-for="article in filteredArticles"
          :key="article.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          @click="goToArticle(article.id)"
        >
          <div class="p-6">
            <div class="flex items-start space-x-4">
              <img
                v-if="article.cover"
                :src="article.cover"
                :alt="article.title"
                class="w-24 h-24 rounded-lg object-cover flex-shrink-0"
              />
              
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <h3 class="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {{ article.title }}
                  </h3>
                  <el-tag
                    :type="article.status === 'published' ? 'success' : 'info'"
                    size="small"
                  >
                    {{ article.status === 'published' ? '已发布' : '草稿' }}
                  </el-tag>
                </div>
                
                <p class="text-gray-600 mt-2 line-clamp-2">{{ article.excerpt }}</p>
                
                <div class="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                  <div class="flex items-center space-x-1">
                    <el-icon><User /></el-icon>
                    <span>{{ article.author }}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <el-icon><Calendar /></el-icon>
                    <span>{{ formatDate(article.publishDate) }}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <el-icon><View /></el-icon>
                    <span>{{ article.views }} 次阅读</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <el-icon><Clock /></el-icon>
                    <span>{{ article.readTime }} 分钟阅读</span>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2 mt-3">
                  <el-tag
                    v-for="tag in article.tags"
                    :key="tag"
                    size="small"
                    type="info"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 网格视图 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="article in filteredArticles"
          :key="article.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
          @click="goToArticle(article.id)"
        >
          <div class="relative">
            <img
              :src="article.cover || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=blog_article_placeholder&image_size=landscape_16_9'"
              :alt="article.title"
              class="w-full h-48 object-cover"
            />
            <div class="absolute top-4 right-4">
              <el-tag
                :type="article.status === 'published' ? 'success' : 'info'"
                size="small"
              >
                {{ article.status === 'published' ? '已发布' : '草稿' }}
              </el-tag>
            </div>
          </div>
          
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
              {{ article.title }}
            </h3>
            
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ article.excerpt }}</p>
            
            <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
              <div class="flex items-center space-x-1">
                <el-icon><User /></el-icon>
                <span>{{ article.author }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <el-icon><View /></el-icon>
                <span>{{ article.views }}</span>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-500">
                {{ formatDate(article.publishDate) }}
              </div>
              <div class="flex items-center space-x-1 text-sm text-gray-500">
                <el-icon><Clock /></el-icon>
                <span>{{ article.readTime }}min</span>
              </div>
            </div>
            
            <div class="flex flex-wrap gap-1 mt-3">
              <el-tag
                v-for="tag in article.tags.slice(0, 3)"
                :key="tag"
                size="small"
                type="info"
              >
                {{ tag }}
              </el-tag>
              <el-tag v-if="article.tags.length > 3" size="small" type="info">
                +{{ article.tags.length - 3 }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="filteredArticles.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">
          <el-icon><DocumentRemove /></el-icon>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">暂无文章</h3>
        <p class="text-gray-500">该分类下还没有发布的文章</p>
      </div>
      
      <!-- 分页 -->
      <div v-if="filteredArticles.length > 0" class="flex justify-center mt-8">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[12, 24, 48]"
          :total="filteredArticles.length"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Document,
  Calendar,
  View,
  Search,
  List,
  Grid,
  User,
  Clock,
  DocumentRemove
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const sortBy = ref('date')
const filterStatus = ref('')
const viewMode = ref('list')
const currentPage = ref(1)
const pageSize = ref(12)

// 分类信息
const category = ref({
  id: 1,
  name: 'Vue.js',
  description: 'Vue.js相关技术文章，包括基础教程、进阶技巧、最佳实践等内容',
  color: '#4fc08d',
  articleCount: 25,
  createdAt: '2024-01-01',
  totalViews: 15420
})

// 文章列表
const articles = ref([
  {
    id: 1,
    title: 'Vue 3 Composition API 深度解析',
    excerpt: '详细介绍Vue 3 Composition API的使用方法和最佳实践，包括响应式原理、生命周期钩子、依赖注入等核心概念。',
    author: '前端工程师',
    publishDate: '2024-01-15',
    views: 1250,
    readTime: 8,
    status: 'published',
    cover: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=vue_composition_api_tutorial&image_size=landscape_16_9',
    tags: ['Vue 3', 'Composition API', '响应式']
  },
  {
    id: 2,
    title: 'Vue Router 4 新特性详解',
    excerpt: '探索Vue Router 4的新特性，包括动态路由、路由守卫、懒加载等功能的使用方法和注意事项。',
    author: '前端工程师',
    publishDate: '2024-01-12',
    views: 890,
    readTime: 6,
    status: 'published',
    cover: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=vue_router_tutorial&image_size=landscape_16_9',
    tags: ['Vue Router', '路由', 'SPA']
  },
  {
    id: 3,
    title: 'Pinia 状态管理最佳实践',
    excerpt: 'Pinia作为Vue 3推荐的状态管理库，本文介绍其核心概念、使用方法和在实际项目中的最佳实践。',
    author: '前端工程师',
    publishDate: '2024-01-10',
    views: 720,
    readTime: 7,
    status: 'published',
    cover: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=pinia_state_management&image_size=landscape_16_9',
    tags: ['Pinia', '状态管理', 'Vue 3']
  },
  {
    id: 4,
    title: 'Vue 3 性能优化技巧',
    excerpt: '分享Vue 3应用的性能优化技巧，包括组件优化、渲染优化、打包优化等方面的实用方法。',
    author: '前端工程师',
    publishDate: '2024-01-08',
    views: 1100,
    readTime: 10,
    status: 'draft',
    cover: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=vue_performance_optimization&image_size=landscape_16_9',
    tags: ['Vue 3', '性能优化', '最佳实践']
  }
])

// 计算属性
const filteredArticles = computed(() => {
  let result = articles.value
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query)
    )
  }
  
  // 状态过滤
  if (filterStatus.value) {
    result = result.filter(article => article.status === filterStatus.value)
  }
  
  // 排序
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'views':
        return b.views - a.views
      case 'title':
        return a.title.localeCompare(b.title)
      default: // date
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    }
  })
  
  return result
})

// 方法
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const goToArticle = (id: number) => {
  router.push(`/article/${id}`)
}

// 生命周期
onMounted(() => {
  const categoryId = route.params.id
  console.log('分类ID:', categoryId)
  // 这里可以根据categoryId加载对应的分类数据
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>