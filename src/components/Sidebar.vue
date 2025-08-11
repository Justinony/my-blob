<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { TrendingUp, Folder, Tag, Clock, Eye, Code, Server, Cpu, Brain, Settings } from 'lucide-vue-next'
import { useBlogStore } from '@/stores/blog'
import type { Article, Category, Tag as TagType } from '@/types'

const router = useRouter()
const blogStore = useBlogStore()

// 热门文章（按阅读量排序）
const popularArticles = computed(() => 
  blogStore.popularArticles.slice(0, 5)
)

// 最新文章
const recentArticles = computed(() => 
  blogStore.recentArticles.slice(0, 5)
)

// 分类统计
const categoriesWithCount = computed(() => 
  blogStore.categories.filter(category => category.articleCount > 0)
)

// 热门标签（按文章数量排序）
const popularTags = computed(() => 
  [...blogStore.tags]
    .filter(tag => tag.articleCount > 0)
    .sort((a, b) => b.articleCount - a.articleCount)
    .slice(0, 20)
)

const navigateToArticle = (article: Article) => {
  router.push(`/article/${article.id}`)
}

const navigateToCategory = (category: Category) => {
  router.push(`/category/${category.id}`)
}

const navigateToTag = (tag: TagType) => {
  router.push(`/tag/${tag.id}`)
}

const getTagSize = (articleCount: number) => {
  if (articleCount >= 5) return 'large'
  if (articleCount >= 3) return 'default'
  return 'small'
}

// 获取分类图标
const getCategoryIcon = (iconName: string) => {
  const iconMap: Record<string, any> = {
    code: Code,
    server: Server,
    cpu: Cpu,
    brain: Brain,
    settings: Settings
  }
  return iconMap[iconName] || Code
}

// 获取技术分类样式类
const getCategoryClass = (categoryName: string) => {
  const classMap: Record<string, string> = {
    '前端开发': 'frontend',
    '后端开发': 'backend', 
    '算法与数据结构': 'algorithm',
    '人工智能': 'ai',
    'DevOps': 'devops'
  }
  return classMap[categoryName] || 'frontend'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '昨天'
  if (diffDays <= 7) return `${diffDays} 天前`
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} 周前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

// 组件挂载时加载数据
onMounted(async () => {
  // 确保分类和标签数据被加载
  await Promise.all([
    blogStore.fetchCategories(),
    blogStore.fetchTags()
  ])
})
</script>

<template>
  <aside class="space-y-6">
    <!-- 技术分类 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
        <div class="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
          <Folder class="w-5 h-5 text-blue-500" />
          <span>技术分类</span>
        </div>
      </div>
      
      <div class="p-6 space-y-3">
        <div
          v-for="category in categoriesWithCount"
          :key="category.id"
          @click="navigateToCategory(category)"
          class="group cursor-pointer flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-[1.02]"
        >
          <div class="flex items-center space-x-3">
            <div 
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: category.color }"
            ></div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {{ category.name }}
            </span>
          </div>
          <span 
            class="text-xs font-medium px-2 py-1 rounded-full text-white"
            :style="{ backgroundColor: category.color }"
          >
            {{ category.articleCount }}
          </span>
        </div>
      </div>
    </div>

    <!-- 热门标签 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
        <div class="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
          <Tag class="w-5 h-5 text-green-500" />
          <span>热门标签</span>
        </div>
      </div>
      
      <div class="p-6">
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="tag in popularTags"
            :key="tag.id"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:scale-105 transition-all duration-200 border"
            :style="{ 
              backgroundColor: tag.color + '20', 
              borderColor: tag.color + '40',
              color: tag.color 
            }"
            @click="navigateToTag(tag)"
          >
            {{ tag.name }}
            <span class="ml-1 text-xs opacity-70">({{ tag.articleCount }})</span>
          </span>
        </div>
      </div>
    </div>

    <!-- 热门文章 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
        <div class="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
          <TrendingUp class="w-5 h-5 text-orange-500" />
          <span>热门文章</span>
        </div>
      </div>
      
      <div class="p-6 space-y-4">
        <article
          v-for="(article, index) in popularArticles"
          :key="article.id"
          @click="navigateToArticle(article)"
          class="group cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-[1.02]"
        >
          <div class="flex items-start space-x-3">
            <!-- 排名 -->
            <div :class="[
              'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm',
              {
                'bg-gradient-to-r from-yellow-400 to-orange-500': index === 0,
                'bg-gradient-to-r from-gray-400 to-gray-500': index === 1,
                'bg-gradient-to-r from-orange-400 to-red-500': index === 2,
                'bg-gray-400': index > 2
              }
            ]">
              {{ index + 1 }}
            </div>
            
            <!-- 文章信息 -->
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                {{ article.title }}
              </h4>
              <div class="flex items-center space-x-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <div class="flex items-center space-x-1">
                  <Eye class="w-3 h-3" />
                  <span>{{ article.readCount }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <Clock class="w-3 h-3" />
                  <span>{{ formatDate(article.publishDate) }}</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- 分类导航 -->
    <ElCard class="sidebar-card">
      <template #header>
        <div class="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
          <Folder class="w-5 h-5 text-blue-500" />
          <span>文章分类</span>
        </div>
      </template>
      
      <div class="space-y-2">
        <div
          v-for="category in categoriesWithCount"
          :key="category.id"
          @click="navigateToCategory(category)"
          class="group cursor-pointer flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <div class="flex items-center space-x-3">
            <div 
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: category.color }"
            ></div>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {{ category.name }}
            </span>
          </div>
          <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full">
            {{ category.articleCount }}
          </span>
        </div>
      </div>
    </ElCard>

    <!-- 标签云 -->
    <ElCard class="sidebar-card">
      <template #header>
        <div class="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
          <Tag class="w-5 h-5 text-green-500" />
          <span>热门标签</span>
        </div>
      </template>
      
      <div class="flex flex-wrap gap-2">
        <ElTag
          v-for="tag in popularTags"
          :key="tag.id"
          :size="getTagSize(tag.articleCount)"
          :style="{ 
            backgroundColor: tag.color + '20', 
            borderColor: tag.color, 
            color: tag.color 
          }"
          class="cursor-pointer border hover:scale-105 transition-transform duration-200"
          @click="navigateToTag(tag)"
        >
          {{ tag.name }}
          <span class="ml-1 text-xs opacity-75">({{ tag.articleCount }})</span>
        </ElTag>
      </div>
    </ElCard>

    <!-- 最新文章 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-2">
          <Clock class="w-5 h-5 text-blue-600" />
          <span class="font-semibold text-gray-800 dark:text-gray-200">最新文章</span>
        </div>
      </div>
      
      <div class="p-6 space-y-4">
        <article
          v-for="article in blogStore.recentArticles"
          :key="article.id"
          @click="navigateToArticle(article)"
          class="group cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-[1.02]"
        >
          <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 mb-2">
            {{ article.title }}
          </h4>
          <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{{ formatDate(article.publishDate) }}</span>
            <div class="flex items-center space-x-1">
              <Eye class="w-3 h-3" />
              <span>{{ article.readCount }}</span>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- 博主信息卡片 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 text-center">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {{ blogStore.user.name.charAt(0) }}
        </div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          {{ blogStore.user.name }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {{ blogStore.user.bio }}
        </p>
        <div class="flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
          <div class="text-center">
            <div class="font-semibold text-gray-800 dark:text-gray-200 text-lg">{{ blogStore.stats.totalArticles }}</div>
            <div>文章</div>
          </div>
          <div class="text-center">
            <div class="font-semibold text-gray-800 dark:text-gray-200 text-lg">{{ blogStore.stats.totalViews }}</div>
            <div>阅读</div>
          </div>
          <div class="text-center">
            <div class="font-semibold text-gray-800 dark:text-gray-200 text-lg">{{ blogStore.stats.totalLikes }}</div>
            <div>点赞</div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 技术分类颜色 */
.tech-frontend {
  @apply bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200;
}

.tech-backend {
  @apply bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200;
}

.tech-devops {
  @apply bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200;
}

.tech-ai {
  @apply bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200;
}

.tech-mobile {
  @apply bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200;
}

.tech-database {
  @apply bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200;
}

.tech-tools {
  @apply bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200;
}

.tech-other {
  @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200;
}
</style>