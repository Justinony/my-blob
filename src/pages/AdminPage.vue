<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-bold text-gray-900">管理后台</h1>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item>首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ currentTabLabel }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          
          <div class="flex items-center space-x-4">
            <el-button type="primary" @click="quickPublish">
              <el-icon><EditPen /></el-icon>
              快速发布
            </el-button>
            
            <el-dropdown @command="handleUserAction">
              <div class="flex items-center space-x-2 cursor-pointer">
                <el-avatar :size="32" src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=admin_avatar_professional&image_size=square" />
                <span class="text-gray-700">前端开发工程师</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon>
                    个人资料
                  </el-dropdown-item>
                  <el-dropdown-item command="settings">
                    <el-icon><Setting /></el-icon>
                    系统设置
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 数据概览卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          v-for="stat in stats"
          :key="stat.title"
          class="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ stat.title }}</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ stat.value }}</p>
              <p class="text-sm mt-1" :class="stat.trend > 0 ? 'text-green-600' : 'text-red-600'">
                <span>{{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%</span>
                <span class="text-gray-500 ml-1">vs 上月</span>
              </p>
            </div>
            <div
              class="w-12 h-12 rounded-lg flex items-center justify-center"
              :style="{ backgroundColor: stat.color + '20' }"
            >
              <el-icon :style="{ color: stat.color }" class="text-xl">
                <component :is="stat.icon" />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 管理标签页 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="admin-tabs">
          <el-tab-pane label="文章管理" name="articles">
            <div class="p-6">
              <!-- 操作栏 -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                <div class="flex items-center space-x-4">
                  <el-input
                    v-model="articleSearch"
                    placeholder="搜索文章标题或内容"
                    class="w-64"
                    clearable
                  >
                    <template #prefix>
                      <el-icon><Search /></el-icon>
                    </template>
                  </el-input>
                  
                  <el-select v-model="articleStatus" placeholder="状态筛选" class="w-32">
                    <el-option label="全部" value="" />
                    <el-option label="已发布" value="published" />
                    <el-option label="草稿" value="draft" />
                  </el-select>
                </div>
                
                <div class="flex items-center space-x-2">
                  <el-button @click="exportArticles">
                    <el-icon><Download /></el-icon>
                    导出
                  </el-button>
                  <el-button type="primary" @click="createArticle">
                    <el-icon><Plus /></el-icon>
                    新建文章
                  </el-button>
                </div>
              </div>
              
              <!-- 文章列表 -->
              <el-table :data="filteredArticles" stripe>
                <el-table-column type="selection" width="55" />
                <el-table-column prop="title" label="标题" min-width="200">
                  <template #default="{ row }">
                    <div class="flex items-center space-x-3">
                      <img
                        v-if="row.cover"
                        :src="row.cover"
                        :alt="row.title"
                        class="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <div class="font-medium text-gray-900">{{ row.title }}</div>
                        <div class="text-sm text-gray-500">{{ row.excerpt }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="category" label="分类" width="120" />
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="{ row }">
                    <el-tag :type="row.status === 'published' ? 'success' : 'info'" size="small">
                      {{ row.status === 'published' ? '已发布' : '草稿' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="views" label="阅读量" width="100" />
                <el-table-column prop="createdAt" label="创建时间" width="180" />
                <el-table-column label="操作" width="200" fixed="right">
                  <template #default="{ row }">
                    <el-button size="small" @click="editArticle(row)">
                      编辑
                    </el-button>
                    <el-button
                      size="small"
                      :type="row.status === 'published' ? 'warning' : 'success'"
                      @click="toggleArticleStatus(row)"
                    >
                      {{ row.status === 'published' ? '下线' : '发布' }}
                    </el-button>
                    <el-button size="small" type="danger" @click="deleteArticle(row)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              
              <!-- 分页 -->
              <div class="flex justify-center mt-6">
                <el-pagination
                  v-model:current-page="articleCurrentPage"
                  v-model:page-size="articlePageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="articles.length"
                  layout="total, sizes, prev, pager, next, jumper"
                />
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="分类管理" name="categories">
            <div class="p-6">
              <!-- 操作栏 -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                <div class="flex items-center space-x-4">
                  <el-input
                    v-model="categorySearch"
                    placeholder="搜索分类名称"
                    class="w-64"
                    clearable
                  >
                    <template #prefix>
                      <el-icon><Search /></el-icon>
                    </template>
                  </el-input>
                </div>
                
                <el-button type="primary" @click="createCategory">
                  <el-icon><Plus /></el-icon>
                  新建分类
                </el-button>
              </div>
              
              <!-- 分类列表 -->
              <el-table :data="filteredCategories" stripe row-key="id" default-expand-all>
                <el-table-column prop="name" label="分类名称" min-width="200">
                  <template #default="{ row }">
                    <div class="flex items-center space-x-2">
                      <div
                        class="w-4 h-4 rounded"
                        :style="{ backgroundColor: row.color }"
                      />
                      <span class="font-medium">{{ row.name }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="描述" min-width="200" />
                <el-table-column prop="articleCount" label="文章数" width="100" />
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="{ row }">
                    <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
                      {{ row.status === 'active' ? '启用' : '禁用' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="创建时间" width="180" />
                <el-table-column label="操作" width="200" fixed="right">
                  <template #default="{ row }">
                    <el-button size="small" @click="editCategory(row)">
                      编辑
                    </el-button>
                    <el-button
                      size="small"
                      :type="row.status === 'active' ? 'warning' : 'success'"
                      @click="toggleCategoryStatus(row)"
                    >
                      {{ row.status === 'active' ? '禁用' : '启用' }}
                    </el-button>
                    <el-button size="small" type="danger" @click="deleteCategory(row)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="标签管理" name="tags">
            <div class="p-6">
              <!-- 操作栏 -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                <div class="flex items-center space-x-4">
                  <el-input
                    v-model="tagSearch"
                    placeholder="搜索标签名称"
                    class="w-64"
                    clearable
                  >
                    <template #prefix>
                      <el-icon><Search /></el-icon>
                    </template>
                  </el-input>
                  
                  <el-select v-model="tagSort" placeholder="排序方式" class="w-32">
                    <el-option label="名称" value="name" />
                    <el-option label="使用次数" value="count" />
                    <el-option label="创建时间" value="time" />
                  </el-select>
                </div>
                
                <div class="flex items-center space-x-2">
                  <el-button @click="cleanupTags">
                    <el-icon><Delete /></el-icon>
                    清理未使用
                  </el-button>
                  <el-button type="primary" @click="createTag">
                    <el-icon><Plus /></el-icon>
                    新建标签
                  </el-button>
                </div>
              </div>
              
              <!-- 标签云视图 -->
              <div class="mb-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">标签云</h3>
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="flex flex-wrap gap-2">
                    <el-tag
                      v-for="tag in filteredTags"
                      :key="tag.id"
                      :size="getTagSize(tag.count)"
                      :type="getTagType(tag.count)"
                      class="cursor-pointer"
                      @click="editTag(tag)"
                    >
                      {{ tag.name }} ({{ tag.count }})
                    </el-tag>
                  </div>
                </div>
              </div>
              
              <!-- 标签列表 -->
              <el-table :data="paginatedTags" stripe>
                <el-table-column type="selection" width="55" />
                <el-table-column prop="name" label="标签名称" min-width="150">
                  <template #default="{ row }">
                    <el-tag :type="getTagType(row.count)">{{ row.name }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="描述" min-width="200" />
                <el-table-column prop="count" label="使用次数" width="100" />
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="{ row }">
                    <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
                      {{ row.status === 'active' ? '启用' : '禁用' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="创建时间" width="180" />
                <el-table-column label="操作" width="200" fixed="right">
                  <template #default="{ row }">
                    <el-button size="small" @click="editTag(row)">
                      编辑
                    </el-button>
                    <el-button
                      size="small"
                      :type="row.status === 'active' ? 'warning' : 'success'"
                      @click="toggleTagStatus(row)"
                    >
                      {{ row.status === 'active' ? '禁用' : '启用' }}
                    </el-button>
                    <el-button size="small" type="danger" @click="deleteTag(row)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              
              <!-- 分页 -->
              <div class="flex justify-center mt-6">
                <el-pagination
                  v-model:current-page="tagCurrentPage"
                  v-model:page-size="tagPageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="filteredTags.length"
                  layout="total, sizes, prev, pager, next, jumper"
                />
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="系统设置" name="settings">
            <div class="p-6">
              <div class="max-w-4xl">
                <h3 class="text-lg font-medium text-gray-900 mb-6">网站设置</h3>
                
                <el-form :model="siteSettings" label-width="120px" class="space-y-6">
                  <el-form-item label="网站标题">
                    <el-input v-model="siteSettings.title" placeholder="请输入网站标题" />
                  </el-form-item>
                  
                  <el-form-item label="网站描述">
                    <el-input
                      v-model="siteSettings.description"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入网站描述"
                    />
                  </el-form-item>
                  
                  <el-form-item label="关键词">
                    <el-input v-model="siteSettings.keywords" placeholder="请输入关键词，用逗号分隔" />
                  </el-form-item>
                  
                  <el-form-item label="网站Logo">
                    <el-upload
                      class="logo-uploader"
                      action="#"
                      :show-file-list="false"
                      :before-upload="beforeLogoUpload"
                    >
                      <img v-if="siteSettings.logo" :src="siteSettings.logo" class="logo" />
                      <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                  </el-form-item>
                  
                  <el-form-item label="备案信息">
                    <el-input v-model="siteSettings.icp" placeholder="请输入备案信息" />
                  </el-form-item>
                  
                  <el-form-item label="统计代码">
                    <el-input
                      v-model="siteSettings.analytics"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入统计代码"
                    />
                  </el-form-item>
                  
                  <el-form-item>
                    <el-button type="primary" @click="saveSiteSettings">
                      保存设置
                    </el-button>
                    <el-button @click="resetSiteSettings">
                      重置
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  EditPen,
  ArrowDown,
  User,
  Setting,
  SwitchButton,
  Document,
  Folder,
  PriceTag,
  View,
  Search,
  Download,
  Plus,
  Delete
} from '@element-plus/icons-vue'

// 当前活跃标签页
const activeTab = ref('articles')

// 统计数据
const stats = ref([
  {
    title: '总文章数',
    value: '128',
    trend: 12,
    color: '#3b82f6',
    icon: 'Document'
  },
  {
    title: '总分类数',
    value: '24',
    trend: 8,
    color: '#10b981',
    icon: 'Folder'
  },
  {
    title: '总标签数',
    value: '86',
    trend: -3,
    color: '#f59e0b',
    icon: 'PriceTag'
  },
  {
    title: '总访问量',
    value: '15.2K',
    trend: 25,
    color: '#ef4444',
    icon: 'View'
  }
])

// 文章管理
const articleSearch = ref('')
const articleStatus = ref('')
const articleCurrentPage = ref(1)
const articlePageSize = ref(10)

const articles = ref([
  {
    id: 1,
    title: 'Vue 3 Composition API 深度解析',
    excerpt: '详细介绍Vue 3 Composition API的使用方法和最佳实践',
    category: 'Vue.js',
    status: 'published',
    views: 1250,
    cover: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=vue_composition_api_tutorial&image_size=square',
    createdAt: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    title: 'TypeScript 进阶技巧',
    excerpt: '分享TypeScript的高级特性和实用技巧',
    category: 'TypeScript',
    status: 'draft',
    views: 0,
    cover: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=typescript_advanced_tips&image_size=square',
    createdAt: '2024-01-14 15:20:00'
  },
  {
    id: 3,
    title: '前端性能优化实战',
    excerpt: '从多个维度分析前端性能优化的方法和策略',
    category: '性能优化',
    status: 'published',
    views: 890,
    cover: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=frontend_performance_optimization&image_size=square',
    createdAt: '2024-01-13 09:15:00'
  }
])

const filteredArticles = computed(() => {
  let result = articles.value
  
  if (articleSearch.value) {
    result = result.filter(article => 
      article.title.toLowerCase().includes(articleSearch.value.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(articleSearch.value.toLowerCase())
    )
  }
  
  if (articleStatus.value) {
    result = result.filter(article => article.status === articleStatus.value)
  }
  
  return result
})

// 分类管理
const categorySearch = ref('')

const categories = ref([
  {
    id: 1,
    name: 'Vue.js',
    description: 'Vue.js相关技术文章',
    color: '#4fc08d',
    articleCount: 25,
    status: 'active',
    createdAt: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    name: 'TypeScript',
    description: 'TypeScript技术分享',
    color: '#3178c6',
    articleCount: 18,
    status: 'active',
    createdAt: '2024-01-02 11:00:00'
  },
  {
    id: 3,
    name: '性能优化',
    description: '前端性能优化相关',
    color: '#ff6b6b',
    articleCount: 12,
    status: 'active',
    createdAt: '2024-01-03 12:00:00'
  }
])

const filteredCategories = computed(() => {
  if (!categorySearch.value) return categories.value
  
  return categories.value.filter(category => 
    category.name.toLowerCase().includes(categorySearch.value.toLowerCase())
  )
})

// 标签管理
const tagSearch = ref('')
const tagSort = ref('name')
const tagCurrentPage = ref(1)
const tagPageSize = ref(10)

const tags = ref([
  {
    id: 1,
    name: 'Vue 3',
    description: 'Vue.js 第三版',
    count: 15,
    status: 'active',
    createdAt: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    name: 'Composition API',
    description: 'Vue 3 组合式API',
    count: 12,
    status: 'active',
    createdAt: '2024-01-02 11:00:00'
  },
  {
    id: 3,
    name: 'TypeScript',
    description: 'JavaScript的超集',
    count: 20,
    status: 'active',
    createdAt: '2024-01-03 12:00:00'
  },
  {
    id: 4,
    name: '性能优化',
    description: '提升应用性能',
    count: 8,
    status: 'active',
    createdAt: '2024-01-04 13:00:00'
  },
  {
    id: 5,
    name: 'Webpack',
    description: '模块打包工具',
    count: 5,
    status: 'active',
    createdAt: '2024-01-05 14:00:00'
  }
])

const filteredTags = computed(() => {
  let result = tags.value
  
  if (tagSearch.value) {
    result = result.filter(tag => 
      tag.name.toLowerCase().includes(tagSearch.value.toLowerCase())
    )
  }
  
  // 排序
  result.sort((a, b) => {
    switch (tagSort.value) {
      case 'count':
        return b.count - a.count
      case 'time':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return a.name.localeCompare(b.name)
    }
  })
  
  return result
})

const paginatedTags = computed(() => {
  const start = (tagCurrentPage.value - 1) * tagPageSize.value
  const end = start + tagPageSize.value
  return filteredTags.value.slice(start, end)
})

// 网站设置
const siteSettings = ref({
  title: '我的技术博客',
  description: '分享前端技术和开发经验的个人博客',
  keywords: 'Vue.js, TypeScript, 前端开发, 技术博客',
  logo: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=blog_logo_modern_clean&image_size=square',
  icp: '京ICP备12345678号',
  analytics: '<!-- 统计代码 -->'
})

// 计算属性
const currentTabLabel = computed(() => {
  const labels = {
    articles: '文章管理',
    categories: '分类管理',
    tags: '标签管理',
    settings: '系统设置'
  }
  return labels[activeTab.value as keyof typeof labels] || '管理后台'
})

// 方法
const handleTabChange = (tabName: string) => {
  console.log('切换到标签页:', tabName)
}

const quickPublish = () => {
  ElMessage.success('快速发布功能开发中')
}

const handleUserAction = (command: string) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人资料功能开发中')
      break
    case 'settings':
      ElMessage.info('系统设置功能开发中')
      break
    case 'logout':
      ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ElMessage.success('已退出登录')
      })
      break
  }
}

// 文章相关方法
const createArticle = () => {
  ElMessage.success('新建文章功能开发中')
}

const editArticle = (article: any) => {
  ElMessage.info(`编辑文章：${article.title}`)
}

const toggleArticleStatus = (article: any) => {
  article.status = article.status === 'published' ? 'draft' : 'published'
  ElMessage.success(`文章已${article.status === 'published' ? '发布' : '下线'}`)
}

const deleteArticle = (article: any) => {
  ElMessageBox.confirm(`确定要删除文章「${article.title}」吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = articles.value.findIndex(a => a.id === article.id)
    if (index > -1) {
      articles.value.splice(index, 1)
      ElMessage.success('文章已删除')
    }
  })
}

const exportArticles = () => {
  ElMessage.success('导出功能开发中')
}

// 分类相关方法
const createCategory = () => {
  ElMessage.success('新建分类功能开发中')
}

const editCategory = (category: any) => {
  ElMessage.info(`编辑分类：${category.name}`)
}

const toggleCategoryStatus = (category: any) => {
  category.status = category.status === 'active' ? 'inactive' : 'active'
  ElMessage.success(`分类已${category.status === 'active' ? '启用' : '禁用'}`)
}

const deleteCategory = (category: any) => {
  if (category.articleCount > 0) {
    ElMessage.warning('该分类下还有文章，无法删除')
    return
  }
  
  ElMessageBox.confirm(`确定要删除分类「${category.name}」吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = categories.value.findIndex(c => c.id === category.id)
    if (index > -1) {
      categories.value.splice(index, 1)
      ElMessage.success('分类已删除')
    }
  })
}

// 标签相关方法
const createTag = () => {
  ElMessage.success('新建标签功能开发中')
}

const editTag = (tag: any) => {
  ElMessage.info(`编辑标签：${tag.name}`)
}

const toggleTagStatus = (tag: any) => {
  tag.status = tag.status === 'active' ? 'inactive' : 'active'
  ElMessage.success(`标签已${tag.status === 'active' ? '启用' : '禁用'}`)
}

const deleteTag = (tag: any) => {
  if (tag.count > 0) {
    ElMessage.warning('该标签还在使用中，无法删除')
    return
  }
  
  ElMessageBox.confirm(`确定要删除标签「${tag.name}」吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = tags.value.findIndex(t => t.id === tag.id)
    if (index > -1) {
      tags.value.splice(index, 1)
      ElMessage.success('标签已删除')
    }
  })
}

const cleanupTags = () => {
  ElMessageBox.confirm('确定要清理所有未使用的标签吗？', '清理确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const unusedTags = tags.value.filter(tag => tag.count === 0)
    tags.value = tags.value.filter(tag => tag.count > 0)
    ElMessage.success(`已清理 ${unusedTags.length} 个未使用的标签`)
  })
}

const getTagSize = (count: number) => {
  if (count >= 15) return 'large'
  if (count >= 8) return 'default'
  return 'small'
}

const getTagType = (count: number) => {
  if (count >= 15) return 'danger'
  if (count >= 10) return 'warning'
  if (count >= 5) return 'success'
  return 'info'
}

// 设置相关方法
const beforeLogoUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
    return false
  }
  return true
}

const saveSiteSettings = () => {
  ElMessage.success('设置已保存')
}

const resetSiteSettings = () => {
  ElMessageBox.confirm('确定要重置所有设置吗？', '重置确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 重置设置
    ElMessage.success('设置已重置')
  })
}
</script>

<style scoped>
.admin-tabs :deep(.el-tabs__header) {
  margin: 0;
  border-bottom: 1px solid #e5e7eb;
}

.admin-tabs :deep(.el-tabs__nav-wrap) {
  padding: 0 24px;
}

.admin-tabs :deep(.el-tabs__content) {
  padding: 0;
}

.logo-uploader :deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s;
}

.logo-uploader :deep(.el-upload:hover) {
  border-color: #409eff;
}

.logo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.logo {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}
</style>