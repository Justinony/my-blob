<template>
  <div class="min-h-screen bg-gray-50 pt-16">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">分类管理</h1>
        <p class="mt-2 text-gray-600">管理博客文章分类，组织内容结构</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 分类列表 -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">分类列表</h2>
                <el-button type="primary" @click="showCreateDialog">
                  <el-icon><Plus /></el-icon>
                  新建分类
                </el-button>
              </div>
            </div>
            
            <div class="p-6">
              <el-table
                :data="categories"
                style="width: 100%"
                v-loading="loading"
                row-key="id"
                default-expand-all
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              >
                <el-table-column prop="name" label="分类名称" min-width="200">
                  <template #default="{ row }">
                    <div class="flex items-center gap-2">
                      <el-icon v-if="row.children?.length" class="text-blue-500">
                        <Folder />
                      </el-icon>
                      <el-icon v-else class="text-gray-400">
                        <Document />
                      </el-icon>
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
                    <el-tag type="info" size="small">{{ row.articleCount }}</el-tag>
                  </template>
                </el-table-column>
                
                <el-table-column prop="sort" label="排序" width="80" align="center" />
                
                <el-table-column label="状态" width="100" align="center">
                  <template #default="{ row }">
                    <el-switch
                      v-model="row.enabled"
                      @change="toggleCategoryStatus(row)"
                    />
                  </template>
                </el-table-column>
                
                <el-table-column label="操作" width="200" fixed="right">
                  <template #default="{ row }">
                    <div class="flex items-center gap-2">
                      <el-button size="small" @click="editCategory(row)">
                        <el-icon><Edit /></el-icon>
                        编辑
                      </el-button>
                      <el-button
                        size="small"
                        type="success"
                        @click="addSubCategory(row)"
                      >
                        <el-icon><Plus /></el-icon>
                        子分类
                      </el-button>
                      <el-button
                        size="small"
                        type="danger"
                        @click="deleteCategory(row)"
                        :disabled="row.articleCount > 0"
                      >
                        <el-icon><Delete /></el-icon>
                        删除
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        
        <!-- 分类统计 -->
        <div class="space-y-6">
          <!-- 统计卡片 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">分类统计</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">总分类数</span>
                <span class="text-2xl font-bold text-blue-600">{{ totalCategories }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">启用分类</span>
                <span class="text-2xl font-bold text-green-600">{{ enabledCategories }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">文章总数</span>
                <span class="text-2xl font-bold text-purple-600">{{ totalArticles }}</span>
              </div>
            </div>
          </div>
          
          <!-- 热门分类 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">热门分类</h3>
            <div class="space-y-3">
              <div
                v-for="category in popularCategories"
                :key="category.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center gap-2">
                  <el-icon class="text-blue-500"><Folder /></el-icon>
                  <span class="font-medium">{{ category.name }}</span>
                </div>
                <el-tag type="success" size="small">{{ category.articleCount }}</el-tag>
              </div>
            </div>
          </div>
          
          <!-- 快速操作 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
            <div class="space-y-3">
              <el-button class="w-full" @click="showCreateDialog">
                <el-icon><Plus /></el-icon>
                新建分类
              </el-button>
              <el-button class="w-full" @click="batchSort">
                <el-icon><Sort /></el-icon>
                批量排序
              </el-button>
              <el-button class="w-full" @click="exportCategories">
                <el-icon><Download /></el-icon>
                导出分类
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingCategory?.id ? '编辑分类' : '新建分类'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入分类名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="父分类" prop="parentId">
          <el-tree-select
            v-model="form.parentId"
            :data="categoryTreeData"
            placeholder="选择父分类（可选）"
            clearable
            check-strictly
            :render-after-expand="false"
            class="w-full"
          />
        </el-form-item>
        
        <el-form-item label="分类描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="form.sort"
            :min="0"
            :max="999"
            placeholder="排序值"
            class="w-full"
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
          <el-button type="primary" @click="saveCategory">保存</el-button>
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
  Edit,
  Delete,
  Folder,
  Document,
  Sort,
  Download
} from '@element-plus/icons-vue'

interface Category {
  id: string
  name: string
  description: string
  parentId: string | null
  sort: number
  enabled: boolean
  articleCount: number
  children?: Category[]
  hasChildren?: boolean
}

// 响应式数据
const loading = ref(false)
const dialogVisible = ref(false)
const formRef = ref()
const editingCategory = ref<Category | null>(null)

const form = ref({
  id: '',
  name: '',
  description: '',
  parentId: null as string | null,
  sort: 0,
  enabled: true
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 50, message: '分类名称长度在 1 到 50 个字符', trigger: 'blur' }
  ]
}

// 模拟分类数据
const categories = ref<Category[]>([
  {
    id: '1',
    name: '前端技术',
    description: '前端开发相关技术文章',
    parentId: null,
    sort: 1,
    enabled: true,
    articleCount: 15,
    children: [
      {
        id: '11',
        name: 'Vue.js',
        description: 'Vue.js框架相关',
        parentId: '1',
        sort: 1,
        enabled: true,
        articleCount: 8
      },
      {
        id: '12',
        name: 'React',
        description: 'React框架相关',
        parentId: '1',
        sort: 2,
        enabled: true,
        articleCount: 5
      },
      {
        id: '13',
        name: 'JavaScript',
        description: 'JavaScript语言基础',
        parentId: '1',
        sort: 3,
        enabled: true,
        articleCount: 12
      }
    ]
  },
  {
    id: '2',
    name: '后端技术',
    description: '后端开发相关技术文章',
    parentId: null,
    sort: 2,
    enabled: true,
    articleCount: 8,
    children: [
      {
        id: '21',
        name: 'Node.js',
        description: 'Node.js服务端开发',
        parentId: '2',
        sort: 1,
        enabled: true,
        articleCount: 6
      },
      {
        id: '22',
        name: 'Python',
        description: 'Python编程语言',
        parentId: '2',
        sort: 2,
        enabled: true,
        articleCount: 4
      }
    ]
  },
  {
    id: '3',
    name: '工具与效率',
    description: '开发工具和效率提升',
    parentId: null,
    sort: 3,
    enabled: true,
    articleCount: 6
  }
])

// 计算属性
const totalCategories = computed(() => {
  const countCategories = (cats: Category[]): number => {
    return cats.reduce((count, cat) => {
      return count + 1 + (cat.children ? countCategories(cat.children) : 0)
    }, 0)
  }
  return countCategories(categories.value)
})

const enabledCategories = computed(() => {
  const countEnabled = (cats: Category[]): number => {
    return cats.reduce((count, cat) => {
      const current = cat.enabled ? 1 : 0
      const children = cat.children ? countEnabled(cat.children) : 0
      return count + current + children
    }, 0)
  }
  return countEnabled(categories.value)
})

const totalArticles = computed(() => {
  const countArticles = (cats: Category[]): number => {
    return cats.reduce((count, cat) => {
      const children = cat.children ? countArticles(cat.children) : 0
      return count + cat.articleCount + children
    }, 0)
  }
  return countArticles(categories.value)
})

const popularCategories = computed(() => {
  const flatCategories: Category[] = []
  const flatten = (cats: Category[]) => {
    cats.forEach(cat => {
      flatCategories.push(cat)
      if (cat.children) {
        flatten(cat.children)
      }
    })
  }
  flatten(categories.value)
  
  return flatCategories
    .filter(cat => cat.enabled)
    .sort((a, b) => b.articleCount - a.articleCount)
    .slice(0, 5)
})

const categoryTreeData = computed(() => {
  const buildTree = (cats: Category[]): any[] => {
    return cats.map(cat => ({
      value: cat.id,
      label: cat.name,
      children: cat.children ? buildTree(cat.children) : undefined
    }))
  }
  return buildTree(categories.value)
})

// 方法
const showCreateDialog = () => {
  editingCategory.value = null
  form.value = {
    id: '',
    name: '',
    description: '',
    parentId: null,
    sort: 0,
    enabled: true
  }
  dialogVisible.value = true
}

const editCategory = (category: Category) => {
  editingCategory.value = category
  form.value = {
    id: category.id,
    name: category.name,
    description: category.description,
    parentId: category.parentId,
    sort: category.sort,
    enabled: category.enabled
  }
  dialogVisible.value = true
}

const addSubCategory = (parentCategory: Category) => {
  editingCategory.value = null
  form.value = {
    id: '',
    name: '',
    description: '',
    parentId: parentCategory.id,
    sort: 0,
    enabled: true
  }
  dialogVisible.value = true
}

const saveCategory = async () => {
  try {
    await formRef.value.validate()
    
    if (editingCategory.value) {
      // 更新分类
      Object.assign(editingCategory.value, form.value)
      ElMessage.success('分类更新成功')
    } else {
      // 创建新分类
      const newCategory: Category = {
        ...form.value,
        id: Date.now().toString(),
        articleCount: 0
      }
      
      if (form.value.parentId) {
        // 添加到父分类的children中
        const findAndAddToParent = (cats: Category[]): boolean => {
          for (const cat of cats) {
            if (cat.id === form.value.parentId) {
              if (!cat.children) cat.children = []
              cat.children.push(newCategory)
              return true
            }
            if (cat.children && findAndAddToParent(cat.children)) {
              return true
            }
          }
          return false
        }
        findAndAddToParent(categories.value)
      } else {
        // 添加为顶级分类
        categories.value.push(newCategory)
      }
      
      ElMessage.success('分类创建成功')
    }
    
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('请检查表单内容')
  }
}

const toggleCategoryStatus = (category: Category) => {
  ElMessage.success(`分类「${category.name}」已${category.enabled ? '启用' : '禁用'}`)
}

const deleteCategory = async (category: Category) => {
  if (category.articleCount > 0) {
    ElMessage.warning('该分类下还有文章，无法删除')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要删除分类「${category.name}」吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      }
    )
    
    // 从分类列表中删除
    const removeFromCategories = (cats: Category[]): boolean => {
      const index = cats.findIndex(cat => cat.id === category.id)
      if (index > -1) {
        cats.splice(index, 1)
        return true
      }
      
      for (const cat of cats) {
        if (cat.children && removeFromCategories(cat.children)) {
          return true
        }
      }
      return false
    }
    
    removeFromCategories(categories.value)
    ElMessage.success('分类删除成功')
  } catch {
    // 用户取消操作
  }
}

const batchSort = () => {
  ElMessage.info('批量排序功能开发中')
}

const exportCategories = () => {
  const data = JSON.stringify(categories.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'categories.json'
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('分类数据导出成功')
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