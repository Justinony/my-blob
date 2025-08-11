<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElButton, ElTag, ElDivider, ElBacktop, ElMessage } from 'element-plus'
import { Calendar, Eye, Heart, Clock, User, Share2, ArrowLeft, List } from 'lucide-vue-next'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import NavBar from '@/components/NavBar.vue'
import ArticleCard from '@/components/ArticleCard.vue'
import { useBlogStore } from '@/stores/blog'
import type { Article } from '@/types'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

const article = ref<Article | null>(null)
const isLiked = ref(false)
const showToc = ref(false)
const tocItems = ref<Array<{ id: string; text: string; level: number }>>([])
const activeHeading = ref('')
const readingProgress = ref(0)

// Markdown 渲染器配置
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

// 渲染后的 Markdown 内容
const renderedContent = computed(() => {
  if (!article.value) return ''
  return md.render(article.value.content)
})

// 相关文章推荐
const relatedArticles = computed(() => {
  if (!article.value) return []
  
  return blogStore.publishedArticles
    .filter(a => 
      a.id !== article.value!.id && 
      (a.category === article.value!.category || 
       a.tags.some(tag => article.value!.tags.includes(tag)))
    )
    .slice(0, 3)
})

// 格式化日期
const formattedDate = computed(() => {
  if (!article.value) return ''
  return new Date(article.value.publishDate).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// 阅读时间估算
const readingTime = computed(() => {
  if (!article.value) return ''
  const wordsPerMinute = 200
  const wordCount = article.value.content.length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} 分钟阅读`
})

// 生成目录
const generateToc = () => {
  const content = document.querySelector('.article-content')
  if (!content) return
  
  const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6')
  tocItems.value = Array.from(headings).map((heading, index) => {
    const id = `heading-${index}`
    heading.id = id
    return {
      id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.charAt(1))
    }
  })
}

// 滚动监听，更新阅读进度和当前标题
const handleScroll = () => {
  const scrollTop = window.pageYOffset
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  readingProgress.value = Math.min((scrollTop / docHeight) * 100, 100)
  
  // 更新当前活跃的标题
  const headings = document.querySelectorAll('.article-content h1, .article-content h2, .article-content h3, .article-content h4, .article-content h5, .article-content h6')
  let current = ''
  
  headings.forEach(heading => {
    const rect = heading.getBoundingClientRect()
    if (rect.top <= 100) {
      current = heading.id
    }
  })
  
  activeHeading.value = current
}

// 跳转到指定标题
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 点赞文章
const toggleLike = () => {
  if (!article.value) return
  
  blogStore.toggleLike(article.value.id)
  isLiked.value = !isLiked.value
  
  ElMessage.success(isLiked.value ? '已点赞' : '已取消点赞')
}

// 分享文章
const shareArticle = async () => {
  if (!article.value) return
  
  const shareData = {
    title: article.value.title,
    text: article.value.excerpt,
    url: window.location.href
  }
  
  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      // 复制链接到剪贴板
      await navigator.clipboard.writeText(window.location.href)
      ElMessage.success('链接已复制到剪贴板')
    }
  } catch (error) {
    console.error('分享失败:', error)
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 跳转到相关文章
const handleRelatedArticleClick = (relatedArticle: Article) => {
  router.push(`/articles/${relatedArticle.id}`)
}

onMounted(async () => {
  const articleId = route.params.id as string
  article.value = blogStore.getArticleById(articleId) || null
  
  if (!article.value) {
    router.push('/404')
    return
  }
  
  // 增加阅读量
  await blogStore.incrementReadCount(articleId)
  
  // 生成目录
  await nextTick()
  generateToc()
  
  // 添加滚动监听
  window.addEventListener('scroll', handleScroll)
})

// 清理事件监听
const cleanup = () => {
  window.removeEventListener('scroll', handleScroll)
}

// 组件卸载时清理
import { onUnmounted } from 'vue'
onUnmounted(cleanup)
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 阅读进度条 -->
    <div class="fixed top-16 left-0 right-0 z-40">
      <div 
        class="h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
        :style="{ width: `${readingProgress}%` }"
      ></div>
    </div>
    
    <div v-if="article" class="pt-16">
      <!-- 文章头部 -->
      <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- 返回按钮 -->
          <div class="mb-6">
            <ElButton 
              @click="goBack"
              class="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              text
            >
              <ArrowLeft class="w-4 h-4" />
              <span>返回</span>
            </ElButton>
          </div>
          
          <!-- 文章标题 -->
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {{ article.title }}
          </h1>
          
          <!-- 文章元信息 -->
          <div class="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <div class="flex items-center space-x-1">
              <User class="w-4 h-4" />
              <span>{{ article.author }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <Calendar class="w-4 h-4" />
              <span>{{ formattedDate }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <Clock class="w-4 h-4" />
              <span>{{ readingTime }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <Eye class="w-4 h-4" />
              <span>{{ article.readCount }} 次阅读</span>
            </div>
          </div>
          
          <!-- 标签 -->
          <div class="flex flex-wrap gap-2 mb-6">
            <ElTag
              v-for="tag in article.tags"
              :key="tag.id"
              type="primary"
              effect="light"
              class="px-3 py-1"
              :color="tag.color"
            >
              {{ tag.name }}
            </ElTag>
          </div>
          
          <!-- 操作按钮 -->
          <div class="flex items-center space-x-4">
            <ElButton 
              :type="isLiked ? 'danger' : 'default'"
              @click="toggleLike"
              class="flex items-center space-x-2"
            >
              <Heart :class="{ 'fill-current': isLiked }" class="w-4 h-4" />
              <span>{{ article.likeCount }} 点赞</span>
            </ElButton>
            
            <ElButton 
              @click="shareArticle"
              class="flex items-center space-x-2"
            >
              <Share2 class="w-4 h-4" />
              <span>分享</span>
            </ElButton>
            
            <ElButton 
              @click="showToc = !showToc"
              class="flex items-center space-x-2 md:hidden"
            >
              <List class="w-4 h-4" />
              <span>目录</span>
            </ElButton>
          </div>
        </div>
      </header>
      
      <!-- 主要内容区域 -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- 文章内容 -->
          <article class="lg:col-span-3">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <!-- 封面图片 -->
              <div v-if="article.coverImage" class="relative">
                <img 
                  :src="article.coverImage" 
                  :alt="article.title"
                  class="w-full h-64 md:h-80 object-cover"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              <!-- 文章正文 -->
              <div class="p-6 md:p-8">
                <div 
                  class="article-content prose prose-lg dark:prose-invert max-w-none"
                  v-html="renderedContent"
                ></div>
              </div>
            </div>
          </article>
          
          <!-- 侧边栏 -->
          <aside class="lg:col-span-1">
            <div class="sticky top-24 space-y-6">
              <!-- 目录 -->
              <div 
                v-if="tocItems.length > 0"
                :class="[
                  'bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300',
                  { 'block': showToc, 'hidden md:block': !showToc }
                ]"
              >
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <List class="w-5 h-5" />
                  <span>目录</span>
                </h3>
                <nav class="space-y-2">
                  <button
                    v-for="item in tocItems"
                    :key="item.id"
                    @click="scrollToHeading(item.id)"
                    :class="[
                      'block w-full text-left text-sm transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400',
                      {
                        'text-blue-600 dark:text-blue-400 font-medium': activeHeading === item.id,
                        'text-gray-600 dark:text-gray-400': activeHeading !== item.id,
                        'pl-0': item.level === 1,
                        'pl-4': item.level === 2,
                        'pl-8': item.level === 3,
                        'pl-12': item.level >= 4
                      }
                    ]"
                  >
                    {{ item.text }}
                  </button>
                </nav>
              </div>
              
              <!-- 文章统计 -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">文章统计</h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-400">阅读量</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ article.readCount }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-400">点赞数</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ article.likeCount }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-400">字数</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ article.content.length }}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
        
        <!-- 相关文章推荐 -->
        <section v-if="relatedArticles.length > 0" class="mt-16">
          <ElDivider>
            <span class="text-xl font-bold text-gray-900 dark:text-white">相关文章推荐</span>
          </ElDivider>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <ArticleCard
              v-for="relatedArticle in relatedArticles"
              :key="relatedArticle.id"
              :article="relatedArticle"
              variant="compact"
              @click="handleRelatedArticleClick"
            />
          </div>
        </section>
      </main>
    </div>
    
    <!-- 回到顶部 -->
    <ElBacktop :right="40" :bottom="40" />
  </div>
</template>

<style scoped>
/* 文章内容样式 */
.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3),
.article-content :deep(h4),
.article-content :deep(h5),
.article-content :deep(h6) {
  @apply font-bold text-gray-900 dark:text-white mt-8 mb-4 scroll-mt-24;
}

.article-content :deep(h1) { @apply text-3xl; }
.article-content :deep(h2) { @apply text-2xl; }
.article-content :deep(h3) { @apply text-xl; }
.article-content :deep(h4) { @apply text-lg; }

.article-content :deep(p) {
  @apply text-gray-700 dark:text-gray-300 leading-relaxed mb-4;
}

.article-content :deep(a) {
  @apply text-blue-600 dark:text-blue-400 hover:underline;
}

.article-content :deep(blockquote) {
  @apply border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic;
}

.article-content :deep(code) {
  @apply bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-red-600 dark:text-red-400;
}

.article-content :deep(pre) {
  @apply bg-gray-900 rounded-lg p-4 overflow-x-auto my-6;
}

.article-content :deep(pre code) {
  @apply bg-transparent p-0 text-gray-100;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  @apply ml-6 mb-4 space-y-2;
}

.article-content :deep(li) {
  @apply text-gray-700 dark:text-gray-300;
}

.article-content :deep(table) {
  @apply w-full border-collapse border border-gray-300 dark:border-gray-600 my-6;
}

.article-content :deep(th),
.article-content :deep(td) {
  @apply border border-gray-300 dark:border-gray-600 px-4 py-2 text-left;
}

.article-content :deep(th) {
  @apply bg-gray-100 dark:bg-gray-800 font-semibold;
}

.article-content :deep(img) {
  @apply rounded-lg shadow-lg my-6 max-w-full h-auto;
}

/* 代码高亮样式 */
.hljs {
  @apply bg-gray-900 text-gray-100 rounded-lg;
}
</style>