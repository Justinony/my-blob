<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElPagination, ElEmpty, ElSkeleton } from 'element-plus'
import NavBar from '@/components/NavBar.vue'
import HeroSection from '@/components/HeroSection.vue'
import ArticleCard from '@/components/ArticleCard.vue'
import Sidebar from '@/components/Sidebar.vue'
import { useBlogStore } from '@/stores/blog'
import type { Article } from '@/types'

const router = useRouter()
const blogStore = useBlogStore()

const currentPage = ref(1)
const pageSize = ref(6)
const loading = ref(false)

// 分页后的文章列表
const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return blogStore.publishedArticles.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(blogStore.publishedArticles.length / pageSize.value)
})

// 精选文章（阅读量最高的文章）
const featuredArticle = computed(() => {
  if (blogStore.publishedArticles.length === 0) return null
  return blogStore.publishedArticles.reduce((prev, current) => 
    (prev.readCount > current.readCount) ? prev : current
  )
})

const handleArticleClick = (article: Article) => {
  // 增加阅读量
  blogStore.incrementReadCount(article.id)
  // 跳转到文章详情页
  router.push(`/article/${article.id}`)
}

const handleArticleLike = (articleId: string) => {
  blogStore.toggleLike(articleId)
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  // 滚动到文章列表顶部
  const element = document.getElementById('articles-section')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(async () => {
  loading.value = true
  // 并行加载所有数据
  await Promise.all([
    blogStore.fetchArticles(),
    blogStore.fetchCategories(),
    blogStore.fetchTags()
  ])
  loading.value = false
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 英雄区块 -->
    <HeroSection />
    
    <!-- 主要内容区域 -->
    <main id="main-content" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- 文章内容区域 -->
        <div class="lg:col-span-3 space-y-8">
          <!-- 精选文章 -->
          <section v-if="featuredArticle" class="mb-12">
            <div class="flex items-center space-x-2 mb-6">
              <div class="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                精选文章
              </h2>
            </div>
            <ArticleCard 
              :article="featuredArticle"
              variant="featured"
              @click="handleArticleClick"
              @like="handleArticleLike"
            />
          </section>

          <!-- 最新文章 -->
          <section id="articles-section">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-2">
                <div class="w-1 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                  最新文章
                </h2>
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                共 {{ blogStore.publishedArticles.length }} 篇文章
              </div>
            </div>

            <!-- 加载状态 -->
            <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="i in 6" :key="i" class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <ElSkeleton animated>
                  <template #template>
                    <div class="space-y-4">
                      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div class="space-y-2">
                        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                      </div>
                      <div class="flex space-x-2">
                        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      </div>
                    </div>
                  </template>
                </ElSkeleton>
              </div>
            </div>

            <!-- 文章列表 -->
            <div v-else-if="paginatedArticles.length > 0" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ArticleCard 
                  v-for="article in paginatedArticles"
                  :key="article.id"
                  :article="article"
                  @click="handleArticleClick"
                  @like="handleArticleLike"
                />
              </div>

              <!-- 分页 -->
              <div v-if="totalPages > 1" class="flex justify-center mt-12">
                <ElPagination
                  v-model:current-page="currentPage"
                  :page-size="pageSize"
                  :total="blogStore.publishedArticles.length"
                  :page-count="totalPages"
                  layout="prev, pager, next, jumper"
                  class="pagination"
                  @current-change="handlePageChange"
                />
              </div>
            </div>

            <!-- 空状态 -->
            <div v-else class="text-center py-12">
              <ElEmpty 
                description="暂无文章"
                class="empty-state"
              >
                <template #image>
                  <div class="w-32 h-32 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                </template>
              </ElEmpty>
            </div>
          </section>
        </div>

        <!-- 侧边栏 -->
        <div class="lg:col-span-1">
          <div class="sticky top-24">
            <Sidebar />
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center space-y-4">
          <div class="flex justify-center space-x-6">
            <a 
              v-for="social in [
                { name: 'GitHub', url: blogStore.user.socialLinks.github },
                { name: 'Twitter', url: blogStore.user.socialLinks.twitter },
                { name: 'LinkedIn', url: blogStore.user.socialLinks.linkedin }
              ]"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {{ social.name }}
            </a>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            © 2024 {{ blogStore.config.siteName }}. 保留所有权利。
          </div>
          <div class="text-xs text-gray-400 dark:text-gray-500">
            基于 Vue 3 + TypeScript + Vite 构建
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.pagination :deep(.el-pagination) {
  @apply justify-center;
}

.pagination :deep(.el-pager li) {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300;
}

.pagination :deep(.el-pager li.is-active) {
  @apply bg-blue-600 border-blue-600 text-white;
}

.pagination :deep(.btn-prev),
.pagination :deep(.btn-next) {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300;
}

.pagination :deep(.btn-prev:hover),
.pagination :deep(.btn-next:hover) {
  @apply text-blue-600 dark:text-blue-400;
}

.empty-state :deep(.el-empty__description) {
  @apply text-gray-500 dark:text-gray-400;
}
</style>
