<template>
  <div class="min-h-screen bg-gray-50 pt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">标签管理</h1>
        <p class="mt-2 text-gray-600">管理博客标签，优化内容分类和检索</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- 标签列表 -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b border-gray-200">
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 class="text-lg font-semibold text-gray-900">标签列表</h2>
                <div class="flex items-center gap-4">
                  <el-input
                    v-model="searchKeyword"
                    placeholder="搜索标签..."
                    class="w-64"
                    clearable
                    @input="handleSearch"
                  >
                    <template #prefix>
                      <el-icon><Search /></el-icon>
                    </template>
                  </el-input>
                  <el-button type="primary" @click="showCreateDialog">
                    <el-icon><Plus /></el-icon>
                    新建标签
                  </el-button>
                </div>
              </div>
            </div>
            
            <!-- 标签云视图 -->
            <div v-if="viewMode === 'cloud'" class="p-6">
              <div class="flex flex-wrap gap-3">
                <div
                  v-for="tag in filteredTags"
                  :key="tag.id"
                  class="relative group"
                >
                  <el-tag
                    :type="getTagType(tag.articleCount)"
                    :size="getTagSize(tag.articleCount)"
                    :effect="tag.enabled ? 'dark' : 'plain'"
                    class="cursor-pointer transition-all duration-200 hover:scale-105"
                    @click="editTag(tag)"
                  >
                    {{ tag.name }}
                    <span class="ml-1 text-xs opacity-75">({{ tag.articleCount }})</span>
                  </el-tag>
                  
                  <!-- 悬浮操作按钮 -->
                  <div class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <el-button
                      size="small"
                      type="danger"
                      circle
                      @click.stop="deleteTag(tag)"
                      :disabled="tag.articleCount > 0"
                    >
                      <el-icon><Close /></el-icon>
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 表格视图 -->
            <div v-else class="p-6">
              <div class="mb-4 flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <el-select v-model="statusFilter" placeholder="状态筛选" class="w-32">
                    <el-option label="全部" value="" />
                    <el-option label="启用" value="enabled" />
                    <el-option label="禁用" value="disabled" />
                  </el-select>
                  <el-select v-model="sortBy" placeholder="排序方式" class="w-40">
                    <el-option label="按名称" value="name" />
                    <el-option label="按文章数" value="articleCount" />
                    <el-option label="按创建时间" value="createdAt" />
                  </el-select>
                </div>
                
                <div class="flex items-center gap-2">
                  <el-tooltip content="标签云视图">
                    <el-button
                      :type="viewMode === 'table' ? 'default' : 'primary'"
                      @click="viewMode = 'cloud'"
                    >
                      <el-icon><Grid /></el-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="表格视图">
                    <el-button
                      :type="viewMode === 'table' ? 'primary' : 'default'"
                      @click="viewMode = 'table'"
                    >
                      <el-icon><List /></el-icon>
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
              
              <el-table
                :data="paginatedTags"
                style="width: 100%"
                v-loading="loading"
              >
                <el-table-column prop="name" label="标签名称" min-width="150">
                  <template #default="{ row }">
                    <div class="flex items-center gap-2">
                      <div
                        class="w-3 h-3 rounded-full"
                        :style="{ backgroundColor: row.color }"
                      />
                      <span class="font-medium">{{ row.name }}</span>
                    </div>
                  </template>
                </el-table-column>
                
                <el-table-column prop="description" label="描述" min-width="200">
                  <template #default="{ row }">
                    <span class="text-gray-600">{{ row.description || '暂无描述' }}</span>
                  </template>
                </el-table-column>
                
                <el-table-column prop="articleCount" label="文章数量" width="100" align="center">
                  <template #default="{ row }">
                    <el-tag :type="getTagType(row.articleCount)" size="small">
                      {{ row.articleCount }}
                    </el-tag>
                  </template>
                </el-table-column>
                
                <el-table-column prop="createdAt" label="创建时间" width="180">
                  <template #default="{ row }">
                    {{ formatDate(row.createdAt) }}
                  </template>
                </el-table-column>
                
                <el-table-column label="状态" width="100" align="center">
                  <template #default="{ row }">
                    <el-switch
                      v-model="row.enabled"
                      @change="toggleTagStatus(row)"
                    />
                  </template>
                </el-table-column>
                
                <el-table-column label="操作" width="150" fixed="right">
                  <template #default="{ row }">
                    <div class="flex items-center gap-2">
                      <el-button size="small" @click="editTag(row)">
                        <el-icon><Edit /></el-icon>
                        编辑
                      </el-button>
                      <el-button
                        size="small"
                        type="danger"
                        @click="deleteTag(row)"
                        :disabled="row.articleCount > 0"
                      >
                        <el-icon><Delete /></el-icon>
                        删除
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              
              <!-- 分页 -->
              <div class="mt-6 flex justify-center">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[20, 50, 100]"
                  :total="filteredTags.length"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- 侧边栏统计 -->
        <div class="space-y-6">
          <!-- 统计卡片 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">标签统计</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">总标签数</span>
                <span class="text-2xl font-bold text-blue-600">{{ totalTags }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">启用标签</span>
                <span class="text-2xl font-bold text-green-600">{{ enabledTags }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">热门标签</span>
                <span class="text-2xl font-bold text-orange-600">{{ hotTags }}</span>
              </div>
            </div>
          </div>
          
          <!-- 热门标签 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">热门标签 TOP 10</h3>
            <div class="space-y-2">
              <div
                v-for="(tag, index) in popularTags"
                :key="tag.id"
                class="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
              >
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-gray-500 w-6">{{ index + 1 }}</span>
                  <div
                    class="w-2 h-2 rounded-full"
                    :style="{ backgroundColor: tag.color }"
                  />
                  <span class="text-sm font-medium">{{ tag.name }}</span>
                </div>
                <el-tag type="success" size="small">{{ tag.articleCount }}</el-tag>
              </div>
            </div>
          </div>
          
          <!-- 快速操作 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
            <div class="space-y-3">
              <el-button class="w-full" @click="showCreateDialog">
                <el-icon><Plus /></el-icon>
                新建标签
              </el-button>
              <el-button class="w-full" @click="batchManage">
                <el-icon><Setting /></el-icon>
                批量管理
              </el-button>
              <el-button class="w-full" @click="exportTags">
                <el-icon><Download /></el-icon>
                导出标签
              </el-button>
              <el-button class="w-full" @click="cleanupTags">
                <el-icon><Delete /></el-icon>
                清理无用标签
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingTag?.id ? '编辑标签' : '新建标签'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="标签名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入标签名称"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="标签颜色" prop="color">
          <div class="flex items-center gap-4">
            <el-color-picker v-model="form.color" />
            <div class="flex gap-2">
              <div
                v-for="color in presetColors"
                :key="color"
                class="w-6 h-6 rounded cursor-pointer border-2 border-gray-200 hover:border-gray-400"
                :style="{ backgroundColor: color }"
                @click="form.color = color"
              />
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="标签描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入标签描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="状态" prop="enabled">
          <el-switch
            v-model="form.enabled"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="flex justify-end gap-4">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveTag">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  Edit,
  Delete,
  Close,
  Grid,
  List,
  Setting,
  Download
} from '@element-plus/icons-vue'

interface Tag {
  id: string
  name: string
  description: string
  color: string
  enabled: boolean
  articleCount: number
  createdAt: string
}

// 响应式数据
const loading = ref(false)
const dialogVisible = ref(false)
const formRef = ref()
const editingTag = ref<Tag | null>(null)
const searchKeyword = ref('')
const statusFilter = ref('')
const sortBy = ref('articleCount')
const viewMode = ref<'cloud' | 'table'>('cloud')
const currentPage = ref(1)
const pageSize = ref(20)

const form = ref({
  id: '',
  name: '',
  description: '',
  color: '#3b82f6',
  enabled: true
})

// 预设颜色
const presetColors = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
  '#f97316', '#6366f1', '#14b8a6', '#eab308'
]

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 1, max: 30, message: '标签名称长度在 1 到 30 个字符', trigger: 'blur' }
  ]
}

// 模拟标签数据
const tags = ref<Tag[]>([
  { id: '1', name: 'Vue3', description: 'Vue.js 3.x 版本相关', color: '#4fc08d', enabled: true, articleCount: 15, createdAt: '2024-01-01' },
  { id: '2', name: 'TypeScript', description: 'TypeScript 类型系统', color: '#3178c6', enabled: true, articleCount: 12, createdAt: '2024-01-02' },
  { id: '3', name: 'Vite', description: 'Vite 构建工具', color: '#646cff', enabled: true, articleCount: 8, createdAt: '2024-01-03' },
  { id: '4', name: 'Pinia', description: 'Vue 状态管理', color: '#ffd859', enabled: true, articleCount: 6, createdAt: '2024-01-04' },
  { id: '5', name: 'Element Plus', description: 'Vue 3 UI 组件库', color: '#409eff', enabled: true, articleCount: 10, createdAt: '2024-01-05' },
  { id: '6', name: 'JavaScript', description: 'JavaScript 编程语言', color: '#f7df1e', enabled: true, articleCount: 20, createdAt: '2024-01-06' },
  { id: '7', name: 'CSS3', description: 'CSS3 样式技术', color: '#1572b6', enabled: true, articleCount: 14, createdAt: '2024-01-07' },
  { id: '8', name: 'HTML5', description: 'HTML5 标记语言', color: '#e34f26', enabled: true, articleCount: 9, createdAt: '2024-01-08' },
  { id: '9', name: 'Webpack', description: 'Webpack 打包工具', color: '#8dd6f9', enabled: true, articleCount: 7, createdAt: '2024-01-09' },
  { id: '10', name: 'Node.js', description: 'Node.js 服务端', color: '#339933', enabled: true, articleCount: 11, createdAt: '2024-01-10' },
  { id: '11', name: 'React', description: 'React 框架', color: '#61dafb', enabled: true, articleCount: 13, createdAt: '2024-01-11' },
  { id: '12', name: 'Tailwind CSS', description: 'Tailwind CSS 框架', color: '#06b6d4', enabled: true, articleCount: 5, createdAt: '2024-01-12' }
])

// 计算属性
const filteredTags = computed(() => {
  let result = tags.value
  
  // 搜索过滤
  if (searchKeyword.value) {
    result = result.filter(tag => 
      tag.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  
  // 状态过滤
  if (statusFilter.value) {
    result = result.filter(tag => {
      if (statusFilter.value === 'enabled') return tag.enabled
      if (statusFilter.value === 'disabled') return !tag.enabled
      return true
    })
  }
  
  // 排序
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'articleCount':
        return b.articleCount - a.articleCount
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return 0
    }
  })
  
  return result
})

const paginatedTags = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredTags.value.slice(start, end)
})

const totalTags = computed(() => tags.value.length)
const enabledTags = computed(() => tags.value.filter(tag => tag.enabled).length)
const hotTags = computed(() => tags.value.filter(tag => tag.articleCount >= 10).length)

const popularTags = computed(() => {
  return tags.value
    .filter(tag => tag.enabled)
    .sort((a, b) => b.articleCount - a.articleCount)
    .slice(0, 10)
})

// 方法
const getTagType = (count: number) => {
  if (count >= 15) return 'danger'
  if (count >= 10) return 'warning'
  if (count >= 5) return 'success'
  return 'info'
}

const getTagSize = (count: number) => {
  if (count >= 15) return 'large'
  if (count >= 10) return 'default'
  return 'small'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const showCreateDialog = () => {
  editingTag.value = null
  form.value = {
    id: '',
    name: '',
    description: '',
    color: '#3b82f6',
    enabled: true
  }
  dialogVisible.value = true
}

const editTag = (tag: Tag) => {
  editingTag.value = tag
  form.value = {
    id: tag.id,
    name: tag.name,
    description: tag.description,
    color: tag.color,
    enabled: tag.enabled
  }
  dialogVisible.value = true
}

const saveTag = async () => {
  try {
    await formRef.value.validate()
    
    if (editingTag.value) {
      // 更新标签
      Object.assign(editingTag.value, form.value)
      ElMessage.success('标签更新成功')
    } else {
      // 创建新标签
      const newTag: Tag = {
        ...form.value,
        id: Date.now().toString(),
        articleCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      tags.value.push(newTag)
      ElMessage.success('标签创建成功')
    }
    
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('请检查表单内容')
  }
}

const toggleTagStatus = (tag: Tag) => {
  ElMessage.success(`标签「${tag.name}」已${tag.enabled ? '启用' : '禁用'}`)
}

const deleteTag = async (tag: Tag) => {
  if (tag.articleCount > 0) {
    ElMessage.warning('该标签下还有文章，无法删除')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要删除标签「${tag.name}」吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      }
    )
    
    const index = tags.value.findIndex(t => t.id === tag.id)
    if (index > -1) {
      tags.value.splice(index, 1)
      ElMessage.success('标签删除成功')
    }
  } catch {
    // 用户取消操作
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

const batchManage = () => {
  ElMessage.info('批量管理功能开发中')
}

const exportTags = () => {
  const data = JSON.stringify(tags.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'tags.json'
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('标签数据导出成功')
}

const cleanupTags = async () => {
  const unusedTags = tags.value.filter(tag => tag.articleCount === 0)
  
  if (unusedTags.length === 0) {
    ElMessage.info('没有发现无用标签')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `发现 ${unusedTags.length} 个无用标签，确定要清理吗？`,
      '清理无用标签',
      {
        confirmButtonText: '清理',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    tags.value = tags.value.filter(tag => tag.articleCount > 0)
    ElMessage.success(`已清理 ${unusedTags.length} 个无用标签`)
  } catch {
    // 用户取消操作
  }
}

// 生命周期
onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.el-table {
  --el-table-border-color: #e5e7eb;
}

.el-table th {
  background-color: #f9fafb;
  color: #374151;
  font-weight: 600;
}
</style>