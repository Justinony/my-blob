<script setup lang="ts">
import { computed } from 'vue'
import { ElTag, ElButton } from 'element-plus'
import { Calendar, Eye, Heart, Clock, User } from 'lucide-vue-next'
import type { Article } from '@/types'

interface Props {
  article: Article
  showExcerpt?: boolean
  showAuthor?: boolean
  showStats?: boolean
  variant?: 'default' | 'compact' | 'featured'
}

const props = withDefaults(defineProps<Props>(), {
  showExcerpt: true,
  showAuthor: true,
  showStats: true,
  variant: 'default'
})

const emit = defineEmits(['click', 'like'])

const formattedDate = computed(() => {
  return new Date(props.article.publishDate).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const readingTime = computed(() => {
  const wordsPerMinute = 200
  const wordCount = props.article.content.length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} 分钟阅读`
})

const handleClick = () => {
  emit('click', props.article)
}

const handleLike = (e: Event) => {
  e.stopPropagation()
  emit('like', props.article.id)
}

const getTagColor = (index: number) => {
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
  ]
  return colors[index % colors.length]
}
</script>

<template>
  <article 
    :class="[
      'group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl',
      {
        'bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700': variant === 'default',
        'bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700': variant === 'compact',
        'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-blue-900 rounded-2xl shadow-2xl border-2 border-blue-200 dark:border-blue-700': variant === 'featured'
      }
    ]"
    @click="handleClick"
  >
    <!-- 封面图片 -->
    <div 
      v-if="article.coverImage && variant !== 'compact'"
      class="relative overflow-hidden rounded-t-xl group-hover:scale-105 transition-transform duration-300"
    >
      <img 
        :src="article.coverImage" 
        :alt="article.title"
        class="w-full h-48 object-cover"
        loading="lazy"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      
      <!-- 特色标签 -->
      <div v-if="variant === 'featured'" class="absolute top-4 left-4">
        <ElTag 
          type="warning" 
          effect="dark"
          class="px-3 py-1 text-sm font-medium"
        >
          精选文章
        </ElTag>
      </div>
    </div>

    <!-- 内容区域 -->
    <div :class="[
      'p-6',
      { 'p-4': variant === 'compact' }
    ]">
      <!-- 文章标题 -->
      <h3 :class="[
        'font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2',
        {
          'text-xl mb-3': variant === 'default',
          'text-lg mb-2': variant === 'compact',
          'text-2xl mb-4': variant === 'featured'
        }
      ]">
        {{ article.title }}
      </h3>

      <!-- 文章摘要 -->
      <p 
        v-if="showExcerpt && variant !== 'compact'"
        :class="[
          'text-gray-600 dark:text-gray-300 line-clamp-3 mb-4',
          {
            'text-base': variant === 'default',
            'text-lg': variant === 'featured'
          }
        ]"
      >
        {{ article.excerpt }}
      </p>

      <!-- 标签 -->
      <div class="flex flex-wrap gap-2 mb-4">
        <ElTag
            v-for="(tag, index) in article.tags.slice(0, 3)"
            :key="typeof tag === 'string' ? tag : tag.id"
            :style="{ 
              backgroundColor: getTagColor(index) + '20', 
              borderColor: getTagColor(index),
              color: getTagColor(index)
            }"
            class="px-2 py-1 text-xs font-medium rounded-full border hover:scale-105 transition-transform duration-200"
          >
            {{ typeof tag === 'string' ? tag : tag.name }}
          </ElTag>
        <ElTag
          v-if="article.tags.length > 3"
          class="px-2 py-1 text-xs font-medium rounded-full border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
        >
          +{{ article.tags.length - 3 }}
        </ElTag>
      </div>

      <!-- 元信息 -->
      <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div class="flex items-center space-x-4">
          <!-- 作者 -->
          <div v-if="showAuthor" class="flex items-center space-x-1">
            <User class="w-4 h-4" />
            <span>{{ article.author }}</span>
          </div>
          
          <!-- 发布日期 -->
          <div class="flex items-center space-x-1">
            <Calendar class="w-4 h-4" />
            <span>{{ formattedDate }}</span>
          </div>
          
          <!-- 阅读时间 -->
          <div v-if="variant !== 'compact'" class="flex items-center space-x-1">
            <Clock class="w-4 h-4" />
            <span>{{ readingTime }}</span>
          </div>
        </div>

        <!-- 统计信息 -->
        <div v-if="showStats" class="flex items-center space-x-4">
          <div class="flex items-center space-x-1">
            <Eye class="w-4 h-4" />
            <span>{{ article.readCount }}</span>
          </div>
          
          <button 
            @click="handleLike"
            class="flex items-center space-x-1 hover:text-red-500 transition-colors duration-200 group/like"
          >
            <Heart class="w-4 h-4 group-hover/like:scale-110 transition-transform duration-200" />
            <span>{{ article.likeCount }}</span>
          </button>
        </div>
      </div>

      <!-- 阅读更多按钮 (仅在 featured 变体中显示) -->
      <div v-if="variant === 'featured'" class="mt-6">
        <ElButton 
          type="primary"
          class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 rounded-lg font-medium"
        >
          阅读全文
        </ElButton>
      </div>
    </div>
  </article>
</template>

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

@media (max-width: 640px) {
  .line-clamp-2 {
    -webkit-line-clamp: 1;
  }
  
  .line-clamp-3 {
    -webkit-line-clamp: 2;
  }
}
</style>