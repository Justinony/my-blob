<template>
  <div class="min-h-screen bg-gray-50 pt-16">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 搜索头部 -->
      <div class="mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div class="flex-1">
              <el-input
                v-model="searchQuery"
                placeholder="搜索文章标题、内容、标签..."
                size="large"
                clearable
                @keyup.enter="performSearch"
                @clear="clearSearch"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
                <template #append>
                  <el-button type="primary" @click="performSearch">
                    搜索
                  </el-button>
                </template>
              </el-input>
            </div>
            
            <el-button @click="showAdvancedSearch = !showAdvancedSearch">
              <el-icon><Setting /></el-icon>
              高级搜索
            </el-button>
          </div>
          
          <!-- 高级搜索选项 -->
          <div v-if="showAdvancedSearch" class="mt-6 pt-6 border-t border-gray-200">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <el-select
                v-model="searchFilters.category"
                placeholder="选择分类"
                clearable
                class="w-full"
              >
                <el-option label="全部分类" value="" />
                <el-option
                  v-for="category in categories"
                  :key="category"
                  :label="category"
                  :value="category"
                />
              </el-select>
              
              <el-select
                v-model="searchFilters.tags"
                multiple
                placeholder="选择标签"
                clearable
                class="w-full"
              >
                <el-option
                  v-for="tag in tags"
                  :key="tag"
                  :label="tag"
                  :value="tag"
                />
              </el-select>
              
              <el-date-picker
                v-model="searchFilters.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                class="w-full"
              />
            </div>
            
            <div class="mt-4 flex items-center gap-4">
              <el-radio-group v-model="searchFilters.sortBy">
                <el-radio label="relevance">相关度</el-radio>
                <el-radio label="date">发布时间</el-radio>
                <el-radio label="views">阅读量</el-radio>
              </el-radio-group>
              
              <el-radio-group v-model="searchFilters.order">
                <el-radio label="desc">降序</el-radio>
                <el-radio label="asc">升序</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 搜索结果统计 -->
      <div v-if="hasSearched" class="mb-6">
        <div class="flex items-center justify-between">
          <div class="text-gray-600">
            <span v-if="searchResults.length > 0">
              找到 <span class="font-semibold text-blue-600">{{ searchResults.length }}</span> 篇相关文章
              <span v-if="searchQuery">
                ，关键词：<span class="font-semibold text-gray-900">"{{ searchQuery }}"</span>
              </span>
            </span>
            <span v-else class="text-gray-500">
              未找到相关文章
              <span v-if="searchQuery">
                ，关键词：<span class="font-semibold text-gray-900">"{{ searchQuery }}"</span>
              </span>
            </span>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">排序：</span>
            <el-select v-model="sortBy" size="small" class="w-32">
              <el-option label="相关度" value="relevance" />
              <el-option label="发布时间" value="date" />
              <el-option label="阅读量" value="views" />
            </el-select>
          </div>
        </div>
      </div>
      
      <!-- 搜索结果列表 -->
      <div v-if="hasSearched" class="space-y-6">
        <div v-if="loading" class="text-center py-12">
          <el-icon class="animate-spin text-4xl text-blue-500 mb-4"><Loading /></el-icon>
          <p class="text-gray-500">正在搜索...</p>
        </div>
        
        <div v-else-if="searchResults.length === 0" class="text-center py-12">
          <el-icon class="text-6xl text-gray-300 mb-4"><DocumentRemove /></el-icon>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">未找到相关内容</h3>
          <p class="text-gray-500 mb-6">尝试使用不同的关键词或调整搜索条件</p>
          <div class="flex justify-center gap-4">
            <el-button @click="clearSearch">清空搜索</el-button>
            <el-button type="primary" @click="showAdvancedSearch = true">高级搜索</el-button>
          </div>
        </div>
        
        <div v-else class="space-y-6">
          <div
            v-for="article in paginatedResults"
            :key="article.id"
            class="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            <div class="p-6">
              <div class="flex items-start gap-4">
                <!-- 文章封面 -->
                <div v-if="article.coverImage" class="flex-shrink-0">
                  <img
                    :src="article.coverImage"
                    :alt="article.title"
                    class="w-24 h-16 object-cover rounded"
                  />
                </div>
                
                <!-- 文章信息 -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <h3 class="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer"
                          @click="goToArticle(article.id)"
                          v-html="highlightText(article.title)"
                      />
                      
                      <p class="text-gray-600 text-sm mb-3 line-clamp-2"
                         v-html="highlightText(article.excerpt)"
                      />
                      
                      <!-- 匹配的内容片段 -->
                      <div v-if="article.matchedContent" class="mb-3">
                        <div class="text-xs text-gray-500 mb-1">匹配内容：</div>
                        <div class="text-sm text-gray-700 bg-gray-50 p-2 rounded border-l-2 border-blue-500"
                             v-html="highlightText(article.matchedContent)"
                        />
                      </div>
                      
                      <!-- 标签和分类 -->
                      <div class="flex items-center gap-4 mb-3">
                        <div class="flex items-center gap-2">
                          <el-icon class="text-gray-400"><Folder /></el-icon>
                          <span class="text-sm text-gray-600">{{ article.category }}</span>
                        </div>
                        
                        <div class="flex items-center gap-2">
                          <el-icon class="text-gray-400"><PriceTag /></el-icon>
                          <div class="flex flex-wrap gap-1">
                            <el-tag
                              v-for="tag in article.tags.slice(0, 3)"
                              :key="tag"
                              size="small"
                              type="info"
                            >
                              {{ tag }}
                            </el-tag>
                            <span v-if="article.tags.length > 3" class="text-xs text-gray-500">
                              +{{ article.tags.length - 3 }}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- 文章元信息 -->
                      <div class="flex items-center gap-4 text-sm text-gray-500">
                        <div class="flex items-center gap-1">
                          <el-icon><Calendar /></el-icon>
                          <span>{{ formatDate(article.publishDate) }}</span>
                        </div>
                        
                        <div class="flex items-center gap-1">
                          <el-icon><View /></el-icon>
                          <span>{{ article.readCount }} 次阅读</span>
                        </div>
                        
                        <div class="flex items-center gap-1">
                          <el-icon><Clock /></el-icon>
                          <span>{{ getReadingTime(article.content) }} 分钟阅读</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- 相关度评分 -->
                    <div class="flex-shrink-0 text-center">
                      <div class="text-xs text-gray-500 mb-1">相关度</div>
                      <div class="text-lg font-bold text-blue-600">{{ article.relevanceScore }}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 分页 -->
          <div class="flex justify-center mt-8">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50]"
              :total="searchResults.length"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
      
      <!-- 搜索建议 -->
      <div v-else class="text-center py-12">
        <el-icon class="text-6xl text-blue-300 mb-4"><Search /></el-icon>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">开始搜索</h3>
        <p class="text-gray-500 mb-6">输入关键词搜索文章内容</p>
        
        <!-- 热门搜索 -->
        <div class="max-w-md mx-auto">
          <div class="text-sm text-gray-500 mb-3">热门搜索：</div>
          <div class="flex flex-wrap justify-center gap-2">
            <el-tag
              v-for="keyword in hotKeywords"
              :key="keyword"
              class="cursor-pointer hover:bg-blue-50"
              @click="searchQuery = keyword; performSearch()"
            >
              {{ keyword }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Search,
  Setting,
  Loading,
  DocumentRemove,
  Folder,
  PriceTag,
  Calendar,
  View,
  Clock
} from '@element-plus/icons-vue'
import { useBlogStore } from '@/stores/blog'
import type { Article } from '@/types'

interface SearchResult extends Article {
  relevanceScore: number
  matchedContent?: string
}

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

// 响应式数据
const loading = ref(false)
const hasSearched = ref(false)
const showAdvancedSearch = ref(false)
const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const sortBy = ref('relevance')

const searchFilters = ref({
  category: '',
  tags: [] as string[],
  dateRange: null as [string, string] | null,
  sortBy: 'relevance',
  order: 'desc'
})

// 可选项数据
const categories = ref([
  'Vue.js', 'React', 'JavaScript', 'TypeScript', 'Node.js',
  '前端工程化', '性能优化', '设计模式', '算法与数据结构'
])

const tags = ref([
  'Vue3', 'Composition API', 'Pinia', 'Vite', 'Element Plus',
  'TypeScript', 'ES6+', 'Webpack', 'CSS3', 'HTML5'
])

const hotKeywords = ref([
  'Vue3', 'TypeScript', 'Vite', 'Pinia', '性能优化',
  '组件设计', '状态管理', '构建工具', '最佳实践'
])

// 计算属性
const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return searchResults.value.slice(start, end)
})

// 方法
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  
  loading.value = true
  hasSearched.value = true
  
  try {
    // 模拟搜索延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 执行搜索逻辑
    const results = performSearchLogic(searchQuery.value, searchFilters.value)
    searchResults.value = results
    currentPage.value = 1
    
    // 更新URL
    router.push({
      name: 'search',
      query: {
        q: searchQuery.value,
        ...searchFilters.value
      }
    })
  } catch (error) {
    ElMessage.error('搜索失败，请重试')
  } finally {
    loading.value = false
  }
}

const performSearchLogic = (query: string, filters: any): SearchResult[] => {
  const articles = blogStore.articles
  const results: SearchResult[] = []
  
  articles.forEach(article => {
    let relevanceScore = 0
    let matchedContent = ''
    
    // 标题匹配（权重最高）
    if (article.title.toLowerCase().includes(query.toLowerCase())) {
      relevanceScore += 40
    }
    
    // 摘要匹配
    if (article.excerpt.toLowerCase().includes(query.toLowerCase())) {
      relevanceScore += 30
    }
    
    // 内容匹配
    const contentMatch = article.content.toLowerCase().includes(query.toLowerCase())
    if (contentMatch) {
      relevanceScore += 20
      // 提取匹配的内容片段
      const index = article.content.toLowerCase().indexOf(query.toLowerCase())
      const start = Math.max(0, index - 50)
      const end = Math.min(article.content.length, index + query.length + 50)
      matchedContent = '...' + article.content.substring(start, end) + '...'
    }
    
    // 标签匹配
    const tagMatch = article.tags.some(tag => 
      (typeof tag === 'string' ? tag : tag.name).toLowerCase().includes(query.toLowerCase())
    )
    if (tagMatch) {
      relevanceScore += 15
    }
    
    // 分类匹配
    const categoryName = typeof article.category === 'string' ? article.category : article.category.name
    if (categoryName.toLowerCase().includes(query.toLowerCase())) {
      relevanceScore += 10
    }
    
    // 应用过滤器
    if (filters.category && categoryName !== filters.category) {
      return
    }
    
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(filterTag => 
        article.tags.some(articleTag => 
          (typeof articleTag === 'string' ? articleTag : articleTag.name) === filterTag
        )
      )
      if (!hasMatchingTag) return
    }
    
    if (filters.dateRange) {
      const articleDate = new Date(article.publishDate)
      const startDate = new Date(filters.dateRange[0])
      const endDate = new Date(filters.dateRange[1])
      if (articleDate < startDate || articleDate > endDate) {
        return
      }
    }
    
    // 只有相关度大于0的才加入结果
    if (relevanceScore > 0) {
      results.push({
        ...article,
        relevanceScore: Math.min(100, relevanceScore),
        matchedContent
      })
    }
  })
  
  // 排序
  results.sort((a, b) => {
    switch (filters.sortBy) {
      case 'date':
        const dateA = new Date(a.publishDate).getTime()
        const dateB = new Date(b.publishDate).getTime()
        return filters.order === 'desc' ? dateB - dateA : dateA - dateB
      case 'views':
        return filters.order === 'desc' ? b.readCount - a.readCount : a.readCount - b.readCount
      default: // relevance
        return b.relevanceScore - a.relevanceScore
    }
  })
  
  return results
}

const highlightText = (text: string): string => {
  if (!searchQuery.value || !text) return text
  
  const regex = new RegExp(`(${searchQuery.value})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  hasSearched.value = false
  showAdvancedSearch.value = false
  searchFilters.value = {
    category: '',
    tags: [],
    dateRange: null,
    sortBy: 'relevance',
    order: 'desc'
  }
  router.push({ name: 'search' })
}

const goToArticle = (id: string) => {
  router.push({ name: 'article-detail', params: { id } })
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const getReadingTime = (content: string) => {
  const wordsPerMinute = 200
  const words = content.replace(/\s/g, '').length
  return Math.ceil(words / wordsPerMinute) || 1
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

// 监听排序变化
watch(sortBy, () => {
  searchFilters.value.sortBy = sortBy.value
  if (hasSearched.value) {
    performSearch()
  }
})

// 生命周期
onMounted(() => {
  // 从URL参数中获取搜索条件
  const query = route.query.q as string
  if (query) {
    searchQuery.value = query
    
    // 恢复其他搜索条件
    if (route.query.category) {
      searchFilters.value.category = route.query.category as string
    }
    if (route.query.tags) {
      searchFilters.value.tags = Array.isArray(route.query.tags) 
        ? route.query.tags as string[]
        : [route.query.tags as string]
    }
    
    performSearch()
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:deep(mark) {
  background-color: #fef3c7;
  padding: 0 2px;
  border-radius: 2px;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>