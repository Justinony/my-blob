<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElCard, ElTag, ElDivider } from 'element-plus'
import { TrendingUp, Folder, Tag, Clock, Eye } from 'lucide-vue-next'
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
  router.push(`/articles/${article.id}`)
}

const navigateToCategory = (category: Category) => {
  router.push(`/categories/${category.id}`)
}

const navigateToTag = (tag: TagType) => {
  router.push(`/tags/${tag.id}`)
}

const getTagSize = (articleCount: number) => {
  if (articleCount >= 5) return 'large'
  if (articleCount >= 3) return 'default'
  return 'small'
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
</script>

<template>
  <aside class="space-y-6">
    <!-- 热门文章 -->
    <ElCard class="sidebar-card">
      <template #header>
        <div class="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
          <TrendingUp class="w-5 h-5 text-orange-500" />
          <span>热门文章</span>
        </div>
      </template>
      
      <div class="space-y-4">
        <article
          v-for="(article, index) in popularArticles"
          :key="article.id"
          @click="navigateToArticle(article)"
          class="group cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <div class="flex items-start space-x-3">
            <!-- 排名 -->
            <div :class="[
              'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white',
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
    </ElCard>

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
    <ElCard class="sidebar-card">
      <template #header>
        <div class="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
          <Clock class="w-5 h-5 text-purple-500" />
          <span>最新文章</span>
        </div>
      </template>
      
      <div class="space-y-3">
        <article
          v-for="article in recentArticles"
          :key="article.id"
          @click="navigateToArticle(article)"
          class="group cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
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
    </ElCard>

    <!-- 博主信息卡片 -->
    <ElCard class="sidebar-card">
      <div class="text-center space-y-4">
        <img 
          :src="blogStore.user.avatar" 
          :alt="blogStore.user.name"
          class="w-16 h-16 rounded-full mx-auto object-cover border-2 border-gray-200 dark:border-gray-600"
        >
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ blogStore.user.name }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ blogStore.user.bio.slice(0, 50) }}...
          </p>
        </div>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-lg font-bold text-blue-600 dark:text-blue-400">
              {{ blogStore.publishedArticles.length }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">文章</div>
          </div>
          <div>
            <div class="text-lg font-bold text-green-600 dark:text-green-400">
              {{ blogStore.categories.length }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">分类</div>
          </div>
          <div>
            <div class="text-lg font-bold text-purple-600 dark:text-purple-400">
              {{ blogStore.tags.length }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">标签</div>
          </div>
        </div>
      </div>
    </ElCard>
  </aside>
</template>

<style scoped>
.sidebar-card {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm;
}

.sidebar-card :deep(.el-card__header) {
  @apply bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>