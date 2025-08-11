<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElButton, ElTag } from 'element-plus'
import { Github, Twitter, Linkedin, Mail, ArrowDown } from 'lucide-vue-next'
import { useBlogStore } from '@/stores/blog'

const blogStore = useBlogStore()

const typewriterText = ref('')
const currentTextIndex = ref(0)
const currentCharIndex = ref(0)
const isDeleting = ref(false)
const typewriterSpeed = ref(100)

const texts = [
  '前端架构师',
  'Vue.js 专家',
  'TypeScript 爱好者',
  '工程化实践者'
]

const skills = [
  { name: 'Vue.js', level: 95, color: '#4FC08D' },
  { name: 'TypeScript', level: 90, color: '#3178C6' },
  { name: 'React', level: 85, color: '#61DAFB' },
  { name: 'Node.js', level: 80, color: '#339933' },
  { name: 'Webpack', level: 85, color: '#8DD6F9' },
  { name: 'Vite', level: 90, color: '#646CFF' }
]

const socialLinks = [
  { icon: Github, url: blogStore.user.socialLinks.github, label: 'GitHub' },
  { icon: Twitter, url: blogStore.user.socialLinks.twitter, label: 'Twitter' },
  { icon: Linkedin, url: blogStore.user.socialLinks.linkedin, label: 'LinkedIn' },
  { icon: Mail, url: `mailto:${blogStore.user.email}`, label: 'Email' }
]

let typewriterInterval: ReturnType<typeof setInterval> | null = null

const startTypewriter = () => {
  typewriterInterval = setInterval(() => {
    const currentText = texts[currentTextIndex.value]
    
    if (!isDeleting.value) {
      // 打字效果
      if (currentCharIndex.value < currentText.length) {
        typewriterText.value = currentText.slice(0, currentCharIndex.value + 1)
        currentCharIndex.value++
        typewriterSpeed.value = 100
      } else {
        // 完成打字，等待一段时间后开始删除
        typewriterSpeed.value = 2000
        isDeleting.value = true
      }
    } else {
      // 删除效果
      if (currentCharIndex.value > 0) {
        typewriterText.value = currentText.slice(0, currentCharIndex.value - 1)
        currentCharIndex.value--
        typewriterSpeed.value = 50
      } else {
        // 完成删除，切换到下一个文本
        isDeleting.value = false
        currentTextIndex.value = (currentTextIndex.value + 1) % texts.length
        typewriterSpeed.value = 500
      }
    }
    
    // 重新设置定时器
    if (typewriterInterval) {
      clearInterval(typewriterInterval)
      startTypewriter()
    }
  }, typewriterSpeed.value)
}

const scrollToContent = () => {
  const element = document.getElementById('main-content')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  startTypewriter()
})

onUnmounted(() => {
  if (typewriterInterval) {
    clearInterval(typewriterInterval)
  }
})
</script>

<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
    <!-- 背景动画元素 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <!-- 粒子效果背景 -->
    <div class="absolute inset-0">
      <div class="particles">
        <div v-for="i in 50" :key="i" class="particle"></div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="space-y-8">
        <!-- 头像 -->
        <div class="flex justify-center">
          <div class="relative">
            <img 
              :src="blogStore.user.avatar" 
              :alt="blogStore.user.name"
              class="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-2xl"
            >
            <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 opacity-20 animate-pulse"></div>
          </div>
        </div>

        <!-- 标题和打字机效果 -->
        <div class="space-y-4">
          <h1 class="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white">
            你好，我是
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {{ blogStore.user.name }}
            </span>
          </h1>
          <div class="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 h-12 flex items-center justify-center">
            <span class="typewriter">
              {{ typewriterText }}
              <span class="cursor animate-pulse">|</span>
            </span>
          </div>
        </div>

        <!-- 个人简介 -->
        <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          {{ blogStore.user.bio }}
        </p>

        <!-- 技能标签 -->
        <div class="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          <ElTag
            v-for="skill in skills"
            :key="skill.name"
            :style="{ backgroundColor: skill.color + '20', borderColor: skill.color, color: skill.color }"
            class="skill-tag px-4 py-2 text-sm font-medium rounded-full border-2 hover:scale-105 transition-transform duration-200 cursor-default"
          >
            {{ skill.name }}
          </ElTag>
        </div>

        <!-- 社交链接 -->
        <div class="flex justify-center space-x-6">
          <a
            v-for="social in socialLinks"
            :key="social.label"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            :title="social.label"
          >
            <component :is="social.icon" class="w-6 h-6" />
          </a>
        </div>

        <!-- CTA 按钮 -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <ElButton
            type="primary"
            size="large"
            class="px-8 py-3 text-lg font-medium rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            @click="$router.push('/articles')"
          >
            查看我的文章
          </ElButton>
          <ElButton
            size="large"
            class="px-8 py-3 text-lg font-medium rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 transform hover:scale-105 transition-all duration-200"
            @click="$router.push('/about')"
          >
            了解更多
          </ElButton>
        </div>
      </div>

      <!-- 滚动指示器 -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          @click="scrollToContent"
          class="p-2 rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-200 animate-bounce"
        >
          <ArrowDown class="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  display: block;
  pointer-events: none;
  width: 2px;
  height: 2px;
  background: rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  animation: float 6s infinite linear;
}

.particle:nth-child(odd) {
  background: rgba(147, 51, 234, 0.3);
  animation-duration: 8s;
}

.particle:nth-child(1) { left: 10%; animation-delay: 0s; }
.particle:nth-child(2) { left: 20%; animation-delay: 1s; }
.particle:nth-child(3) { left: 30%; animation-delay: 2s; }
.particle:nth-child(4) { left: 40%; animation-delay: 3s; }
.particle:nth-child(5) { left: 50%; animation-delay: 4s; }
.particle:nth-child(6) { left: 60%; animation-delay: 5s; }
.particle:nth-child(7) { left: 70%; animation-delay: 6s; }
.particle:nth-child(8) { left: 80%; animation-delay: 7s; }
.particle:nth-child(9) { left: 90%; animation-delay: 8s; }
.particle:nth-child(10) { left: 15%; animation-delay: 9s; }

@keyframes float {
  0% {
    opacity: 0;
    transform: translateY(100vh) scale(0);
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-100vh) scale(1);
  }
}

.typewriter {
  font-family: 'JetBrains Mono', monospace;
}

.cursor {
  color: #3b82f6;
}

.skill-tag {
  backdrop-filter: blur(10px);
}
</style>