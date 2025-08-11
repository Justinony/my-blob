<template>
  <div class="min-h-screen bg-gray-50 pt-16">
    <!-- 英雄区域 -->
    <section class="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 class="text-4xl lg:text-5xl font-bold mb-6">
              你好，我是
              <span class="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                前端工程师
              </span>
            </h1>
            <p class="text-xl text-blue-100 mb-8 leading-relaxed">
              6年前端开发经验，专注于现代化Web技术栈，
              热爱创造优雅的用户界面和流畅的交互体验。
            </p>
            <div class="flex flex-wrap gap-4">
              <el-button type="primary" size="large" @click="scrollToContact">
                <el-icon><Message /></el-icon>
                联系我
              </el-button>
              <el-button size="large" @click="downloadResume">
                <el-icon><Download /></el-icon>
                下载简历
              </el-button>
            </div>
          </div>
          
          <div class="flex justify-center">
            <div class="relative">
              <div class="w-80 h-80 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <img
                  src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional_developer_avatar_modern_clean&image_size=square"
                  alt="个人头像"
                  class="w-64 h-64 rounded-full object-cover border-4 border-white/30"
                />
              </div>
              
              <!-- 浮动技能标签 -->
              <div class="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold animate-bounce">
                Vue.js
              </div>
              <div class="absolute top-1/2 -left-8 bg-blue-400 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                TypeScript
              </div>
              <div class="absolute -bottom-4 left-1/4 bg-green-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold animate-bounce delay-300">
                Node.js
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 技能展示 -->
    <section class="py-20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">技能专长</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            在6年的前端开发生涯中，我掌握了现代化的技术栈，
            并在实际项目中积累了丰富的经验。
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="skill in skills"
            :key="skill.name"
            class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold"
                :style="{ backgroundColor: skill.color }"
              >
                {{ skill.icon }}
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900">{{ skill.name }}</h3>
                <p class="text-sm text-gray-500">{{ skill.level }}</p>
              </div>
            </div>
            
            <div class="mb-4">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">熟练度</span>
                <span class="text-gray-900 font-medium">{{ skill.proficiency }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all duration-1000 ease-out"
                  :style="{ 
                    width: `${skill.proficiency}%`,
                    backgroundColor: skill.color 
                  }"
                />
              </div>
            </div>
            
            <p class="text-gray-600 text-sm">{{ skill.description }}</p>
            
            <div class="mt-4">
              <div class="flex flex-wrap gap-1">
                <el-tag
                  v-for="tech in skill.technologies"
                  :key="tech"
                  size="small"
                  type="info"
                >
                  {{ tech }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 工作经历 -->
    <section class="py-20 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">工作经历</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            6年的前端开发经验，参与过多个大型项目的开发和维护。
          </p>
        </div>
        
        <div class="relative">
          <!-- 时间线 -->
          <div class="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-300" />
          
          <div class="space-y-12">
            <div
              v-for="(experience, index) in experiences"
              :key="index"
              class="relative flex items-center"
              :class="index % 2 === 0 ? 'justify-start' : 'justify-end'"
            >
              <!-- 时间节点 -->
              <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow" />
              
              <!-- 经历卡片 -->
              <div
                class="w-5/12 bg-white rounded-lg shadow-lg p-6"
                :class="index % 2 === 0 ? 'mr-auto' : 'ml-auto'"
              >
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-lg font-semibold text-gray-900">{{ experience.position }}</h3>
                  <span class="text-sm text-blue-600 font-medium">{{ experience.period }}</span>
                </div>
                
                <h4 class="text-md font-medium text-gray-700 mb-2">{{ experience.company }}</h4>
                
                <p class="text-gray-600 text-sm mb-4">{{ experience.description }}</p>
                
                <div class="space-y-2">
                  <h5 class="text-sm font-medium text-gray-900">主要成就：</h5>
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li v-for="achievement in experience.achievements" :key="achievement" class="flex items-start">
                      <span class="text-green-500 mr-2">•</span>
                      {{ achievement }}
                    </li>
                  </ul>
                </div>
                
                <div class="mt-4">
                  <div class="flex flex-wrap gap-1">
                    <el-tag
                      v-for="tech in experience.technologies"
                      :key="tech"
                      size="small"
                      type="success"
                    >
                      {{ tech }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 项目展示 -->
    <section class="py-20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">精选项目</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            以下是我参与开发的一些代表性项目，展示了我在不同技术栈上的实践经验。
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="project in projects"
            :key="project.name"
            class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div class="relative">
              <img
                :src="project.image"
                :alt="project.name"
                class="w-full h-48 object-cover"
              />
              <div class="absolute top-4 right-4">
                <el-tag :type="project.status === 'completed' ? 'success' : 'warning'" size="small">
                  {{ project.status === 'completed' ? '已完成' : '进行中' }}
                </el-tag>
              </div>
            </div>
            
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ project.name }}</h3>
              <p class="text-gray-600 text-sm mb-4">{{ project.description }}</p>
              
              <div class="mb-4">
                <div class="flex flex-wrap gap-1">
                  <el-tag
                    v-for="tech in project.technologies"
                    :key="tech"
                    size="small"
                    type="info"
                  >
                    {{ tech }}
                  </el-tag>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-500">
                  {{ project.duration }}
                </div>
                <div class="flex gap-2">
                  <el-button size="small" @click="viewProject(project)">
                    <el-icon><View /></el-icon>
                    查看
                  </el-button>
                  <el-button size="small" type="primary" @click="openProjectLink(project.link)">
                    <el-icon><Link /></el-icon>
                    访问
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 联系方式 -->
    <section id="contact" class="py-20 bg-gray-900 text-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold mb-4">联系我</h2>
          <p class="text-gray-300 max-w-2xl mx-auto">
            如果您对我的技能和经验感兴趣，欢迎与我联系讨论合作机会。
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="contact in contacts"
            :key="contact.type"
            class="text-center group cursor-pointer"
            @click="handleContact(contact)"
          >
            <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 transition-colors">
              <el-icon class="text-2xl">
                <component :is="contact.icon" />
              </el-icon>
            </div>
            <h3 class="text-lg font-semibold mb-2">{{ contact.type }}</h3>
            <p class="text-gray-300 text-sm">{{ contact.value }}</p>
          </div>
        </div>
        
        <div class="mt-16 text-center">
          <div class="flex justify-center space-x-6">
            <a
              v-for="social in socials"
              :key="social.name"
              :href="social.url"
              target="_blank"
              class="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <el-icon class="text-xl">
                <component :is="social.icon" />
              </el-icon>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Message,
  Download,
  View,
  Link,
  Phone,
  ChatDotRound,
  Position,
  Postcard
} from '@element-plus/icons-vue'

// 技能数据
const skills = ref([
  {
    name: 'Vue.js',
    level: '专家级',
    proficiency: 95,
    color: '#4fc08d',
    icon: 'V',
    description: '深度掌握Vue 2/3，熟练使用Composition API，有丰富的大型项目开发经验。',
    technologies: ['Vue 3', 'Composition API', 'Vue Router', 'Vuex/Pinia']
  },
  {
    name: 'TypeScript',
    level: '高级',
    proficiency: 90,
    color: '#3178c6',
    icon: 'T',
    description: '熟练使用TypeScript进行类型安全的开发，提升代码质量和开发效率。',
    technologies: ['TypeScript', '类型系统', '泛型', '装饰器']
  },
  {
    name: 'React',
    level: '高级',
    proficiency: 85,
    color: '#61dafb',
    icon: 'R',
    description: '熟练掌握React生态系统，包括Hooks、Context API等现代特性。',
    technologies: ['React 18', 'Hooks', 'Redux', 'Next.js']
  },
  {
    name: '工程化',
    level: '高级',
    proficiency: 88,
    color: '#ff6b6b',
    icon: 'E',
    description: '精通前端工程化工具链，包括构建、测试、部署等全流程。',
    technologies: ['Vite', 'Webpack', 'ESLint', 'Jest']
  },
  {
    name: 'Node.js',
    level: '中高级',
    proficiency: 80,
    color: '#339933',
    icon: 'N',
    description: '具备Node.js后端开发能力，能够进行全栈开发。',
    technologies: ['Express', 'Koa', 'MongoDB', 'MySQL']
  },
  {
    name: 'UI/UX',
    level: '中级',
    proficiency: 75,
    color: '#9c88ff',
    icon: 'U',
    description: '具备良好的设计感，能够创造优秀的用户体验。',
    technologies: ['Figma', 'Sketch', '交互设计', '用户体验']
  }
])

// 工作经历
const experiences = ref([
  {
    position: '高级前端工程师',
    company: '某知名互联网公司',
    period: '2022.03 - 至今',
    description: '负责公司核心产品的前端架构设计和开发，带领团队完成多个重要项目。',
    achievements: [
      '主导重构公司主要产品，性能提升40%',
      '建立前端开发规范和最佳实践',
      '指导初级开发者，提升团队整体技术水平'
    ],
    technologies: ['Vue 3', 'TypeScript', 'Vite', 'Element Plus']
  },
  {
    position: '前端工程师',
    company: '某创业公司',
    period: '2020.06 - 2022.02',
    description: '参与公司多个产品线的前端开发，从0到1搭建前端技术栈。',
    achievements: [
      '独立完成管理后台系统开发',
      '优化首屏加载时间，提升50%',
      '建立组件库，提升开发效率'
    ],
    technologies: ['Vue 2', 'React', 'Webpack', 'Ant Design']
  },
  {
    position: '初级前端工程师',
    company: '某软件公司',
    period: '2018.07 - 2020.05',
    description: '负责公司官网和产品页面的开发维护，学习现代前端技术栈。',
    achievements: [
      '完成公司官网重构',
      '学习掌握Vue.js框架',
      '参与移动端H5页面开发'
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'jQuery']
  }
])

// 项目展示
const projects = ref([
  {
    name: '企业管理系统',
    description: '基于Vue 3的现代化企业管理平台，包含用户管理、权限控制、数据分析等功能。',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern_enterprise_management_dashboard&image_size=landscape_16_9',
    technologies: ['Vue 3', 'TypeScript', 'Element Plus', 'Echarts'],
    duration: '6个月',
    status: 'completed',
    link: '#'
  },
  {
    name: '电商小程序',
    description: '微信小程序电商平台，支持商品展示、购物车、订单管理等完整电商流程。',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=ecommerce_mobile_app_interface&image_size=landscape_16_9',
    technologies: ['小程序', 'Taro', 'React', 'Mobx'],
    duration: '4个月',
    status: 'completed',
    link: '#'
  },
  {
    name: '数据可视化平台',
    description: '大数据可视化分析平台，提供丰富的图表组件和实时数据展示功能。',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=data_visualization_dashboard_charts&image_size=landscape_16_9',
    technologies: ['React', 'D3.js', 'WebGL', 'Node.js'],
    duration: '8个月',
    status: 'ongoing',
    link: '#'
  }
])

// 联系方式
const contacts = ref([
  {
    type: '邮箱',
    value: 'developer@example.com',
    icon: 'Postcard'
  },
  {
    type: '电话',
    value: '+86 138 0000 0000',
    icon: 'Phone'
  },
  {
    type: '微信',
    value: 'frontend_dev',
    icon: 'ChatDotRound'
  },
  {
    type: '地址',
    value: '北京市朝阳区',
    icon: 'Position'
  }
])

// 社交媒体
const socials = ref([
  {
    name: 'GitHub',
    url: 'https://github.com',
    icon: 'Link'
  },
  {
    name: '掘金',
    url: 'https://juejin.cn',
    icon: 'Link'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: 'Link'
  },
  {
    name: '知乎',
    url: 'https://zhihu.com',
    icon: 'Link'
  }
])

// 方法
const scrollToContact = () => {
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
}

const downloadResume = () => {
  ElMessage.success('简历下载功能开发中')
}

const viewProject = (project: any) => {
  ElMessage.info(`查看项目：${project.name}`)
}

const openProjectLink = (link: string) => {
  if (link === '#') {
    ElMessage.info('项目链接开发中')
  } else {
    window.open(link, '_blank')
  }
}

const handleContact = (contact: any) => {
  switch (contact.type) {
    case '邮箱':
      window.location.href = `mailto:${contact.value}`
      break
    case '电话':
      window.location.href = `tel:${contact.value}`
      break
    default:
      ElMessage.info(`${contact.type}: ${contact.value}`)
  }
}
</script>

<style scoped>
.animate-bounce {
  animation: bounce 1s infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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

.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}
</style>