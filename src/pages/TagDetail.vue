<template>
  <div class="min-h-screen bg-gray-50 pt-16">
    <!-- 标签头部 -->
    <div class="bg-white border-b">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center space-x-4 mb-6">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <el-icon class="text-2xl text-white">
              <PriceTag />
            </el-icon>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ tag.name }}</h1>
            <p class="text-gray-600 mt-1">{{ tag.description }}</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-6 text-sm text-gray-500">
          <div class="flex items-center space-x-1">
            <el-icon><Document /></el-icon>
            <span>{{ tag.articleCount }} 篇文章</span>
          </div>
          <div class="flex items-center space-x-1">
            <el-icon><Calendar /></el-icon>
            <span>创建于 {{ tag.createdAt }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <el-icon><View /></el-icon>
            <span>{{ tag.totalViews }} 次阅读</span>
          </div>
          <div class="flex items-center space-x-1">
            <el-icon><TrendCharts /></el-icon>
            <span>热度指数 {{ tag.popularity }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 相关标签 -->
    <div class="bg-blue-50 border-b">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center space-x-4">
          <span class="text-sm font-medium text-gray-700">相关标签：</span>
          <div class="flex flex-wrap gap-2">
            <el-tag
              v-for="relatedTag in relatedTags"
              :key="relatedTag.id"
              :type="getTagType(relatedTag.count)"
              class="cursor-pointer"
              @click="goToTag(relatedTag.id)"
            >
              {{ relatedTag.name }} ({{ relatedTag.count }})
            </el-tag>
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
              <el-option label="相关性" value="relevance" />
            </el-select>
            
            <el-select v-model="filterStatus" placeholder="状态" class="w-24">
              <el-option label="全部" value="" />
              <el-option label="已发布" value="published" />
              <el-option label="草稿" value="draft" />
            </el-select>
            
            <el-select v-model="filterCategory" placeholder="分类" class="w-32">
              <el-option label="全部分类" value="" />
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.name"
              />
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
            
            <el-tooltip content="时间线视图">
              <el-button
                :type="viewMode === 'timeline' ? 'primary' : 'default'"
                @click="viewMode = 'timeline'"
              >
                <el-icon><Clock /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
      
      <!-- 文章列表视图 -->
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
                  <div class="flex items-center space-x-2">
                    <el-tag
                      :type="article.status === 'published' ? 'success' : 'info'"
                      size="small"
                    >
                      {{ article.status === 'published' ? '已发布' : '草稿' }}
                    </el-tag>
                    <el-tag size="small" type="warning">
                      {{ article.category }}
                    </el-tag>
                  </div>
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
                    v-for="articleTag in article.tags"
                    :key="articleTag"
                    size="small"
                    :type="articleTag === tag.name ? 'primary' : 'info'"
                  >
                    {{ articleTag }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 网格视图 -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div class="absolute top-4 left-4">
              <el-tag size="small" type="warning">
                {{ article.category }}
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
                v-for="articleTag in article.tags.slice(0, 3)"
                :key="articleTag"
                size="small"
                :type="articleTag === tag.name ? 'primary' : 'info'"
              >
                {{ articleTag }}
              </el-tag>
              <el-tag v-if="article.tags.length > 3" size="small" type="info">
                +{{ article.tags.length - 3 }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 时间线视图 -->
      <div v-else-if="viewMode === 'timeline'" class="relative">
        <!-- 时间线 -->
        <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300" />
        
        <div class="space-y-8">
          <div
            v-for="(article, index) in filteredArticles"
            :key="article.id"
            class="relative flex items-start space-x-6"
          >
            <!-- 时间节点 -->
            <div class="relative z-10 w-16 flex-shrink-0">
              <div class="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow" />
              <div class="text-sm text-gray-500 mt-2 text-center">
                {{ formatShortDate(article.publishDate) }}
              </div>
            </div>
            
            <!-- 文章卡片 -->
            <div
              class="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              @click="goToArticle(article.id)"
            >
              <div class="p-6">
                <div class="flex items-start justify-between mb-3">
                  <h3 class="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {{ article.title }}
                  </h3>
                  <div class="flex items-center space-x-2">
                    <el-tag size="small" type="warning">
                      {{ article.category }}
                    </el-tag>
                    <el-tag
                      :type="article.status === 'published' ? 'success' : 'info'"
                      size="small"
                    >
                      {{ article.status === 'published' ? '已发布' : '草稿' }}
                    </el-tag>
                  </div>
                </div>
                
                <p class="text-gray-600 mb-4 line-clamp-2">{{ article.excerpt }}</p>
                
                <div class="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div class="flex items-center space-x-1">
                    <el-icon><User /></el-icon>
                    <span>{{ article.author }}</span>
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
                
                <div class="flex items-center space-x-2">
                  <el-tag
                    v-for="articleTag in article.tags"
                    :key="articleTag"
                    size="small"
                    :type="articleTag === tag.name ? 'primary' : 'info'"
                  >
                    {{ articleTag }}
                  </el-tag>
                </div>
              </div>
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
        <p class="text-gray-500">该标签下还没有相关的文章</p>
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
  PriceTag,
  Document,
  Calendar,
  View,
  TrendCharts,
  Search,
  List,
  Grid,
  Clock,
  User,
  DocumentRemove
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const sortBy = ref('date')
const filterStatus = ref('')
const filterCategory = ref('')
const viewMode = ref('list')
const currentPage = ref(1)
const pageSize = ref(12)

// 标签信息
const tag = ref({
  id: 1,
  name: 'Vue 3',
  description: 'Vue.js 第三版相关技术内容，包括新特性、API使用、最佳实践等',
  articleCount: 15,
  createdAt: '2024-01-01',
  totalViews: 8750,
  popularity: 92
})

// 相关标签
const relatedTags = ref([
  { id: 2, name: 'Composition API', count: 12 },
  { id: 3, name: 'TypeScript', count: 20 },
  { id: 4, name: 'Vite', count: 10 },
  { id: 5, name: 'Pinia', count: 8 },
  { id: 6, name: '响应式', count: 6 }
])

// 分类列表
const categories = ref([
  { id: 1, name: 'Vue.js' },
  { id: 2, name: 'TypeScript' },
  { id: 3, name: '性能优化' },
  { id: 4, name: '工程化' }
])

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
    category: 'Vue.js',
    cover: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=vue_composition_api_tutorial&image_size=landscape_16_9',
    tags: ['Vue 3', 'Composition API', '响应式']
  },
  {
    id: 2,
    title: 'Vue 3 + TypeScript 项目搭建',
    excerpt: '从零开始搭建Vue 3 + TypeScript项目，包括环境配置、工具链选择、代码规范等方面的详细指南。',
    author: '前端工程师',
    publishDate: '2024-01-12',
    views: 890,
    readTime: 6,
    status: 'published',
    category: 'TypeScript',
    cover: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=vue_typescript_setup&image_size=landscape_16_9',
    tags: ['Vue 3', 'TypeScript', '项目搭建']
  },
  {
    id: 3,
    title: 'Vue 3 性能优化实战',
    excerpt: '分享Vue 3应用的性能优化技巧，包括组件优化、渲染优化、打包优化等方面的实用方法。',
    author: '前端工程师',
    publishDate: '2024-01-10',
    views: 1100,
    readTime: 10,
    status: 'published',
    category: '性能优化',
    cover: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=vue_performance_optimization&image_size=landscape_16_9',
    tags: ['Vue 3', '性能优化', '最佳实践']
  },
  {
    id: 4,
    title: 'Vue 3 + Vite 开发环境配置',
    excerpt: '详细介绍如何使用Vite构建Vue 3项目，包括开发服务器配置、插件使用、构建优化等内容。',
    author: '前端工程师',
    publishDate: '2024-01-08',
    views: 720,
    readTime: 7,
    status: 'draft',
    category: '工程化',
    cover: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=vue_vite_development&image_size=landscape_16_9',
    tags: ['Vue 3', 'Vite', '开发环境']
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
  
  // 分类过滤
  if (filterCategory.value) {
    result = result.filter(article => article.category === filterCategory.value)
  }
  
  // 排序
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'views':
        return b.views - a.views
      case 'title':
        return a.title.localeCompare(b.title)
      case 'relevance':
        // 简单的相关性计算：标签匹配度
        const aRelevance = a.tags.includes(tag.value.name) ? 1 : 0
        const bRelevance = b.tags.includes(tag.value.name) ? 1 : 0
        return bRelevance - aRelevance
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

const formatShortDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}

const getTagType = (count: number) => {
  if (count >= 15) return 'danger'
  if (count >= 10) return 'warning'
  if (count >= 5) return 'success'
  return 'info'
}

const goToArticle = (id: number) => {
  router.push(`/article/${id}`)
}

const goToTag = (id: number) => {
  router.push(`/tag/${id}`)
}

// 生命周期
onMounted(() => {
  const tagId = route.params.id
  console.log('标签ID:', tagId)
  // 这里可以根据tagId加载对应的标签数据
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