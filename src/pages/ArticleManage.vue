<template>
  <div class="min-h-screen bg-gray-50 pt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">文章管理</h1>
        <p class="mt-2 text-gray-600">管理您的博客文章，创建、编辑和发布内容</p>
      </div>

      <!-- 操作栏 -->
      <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center gap-4">
          <el-button type="primary" @click="createArticle">
            <el-icon><Plus /></el-icon>
            新建文章
          </el-button>
          <el-button @click="refreshList">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        
        <div class="flex items-center gap-4">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文章标题..."
            class="w-64"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-select v-model="statusFilter" placeholder="状态筛选" class="w-32">
            <el-option label="全部" value="" />
            <el-option label="已发布" value="published" />
            <el-option label="草稿" value="draft" />
          </el-select>
        </div>
      </div>

      <!-- 文章列表 -->
      <div class="bg-white rounded-lg shadow">
        <el-table
          :data="filteredArticles"
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column prop="title" label="标题" min-width="200">
            <template #default="{ row }">
              <div class="flex items-center gap-2">
                <span class="font-medium text-gray-900">{{ row.title }}</span>
                <el-tag v-if="row.status === 'draft'" type="warning" size="small">草稿</el-tag>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="category" label="分类" width="120">
            <template #default="{ row }">
              <el-tag type="info" size="small">{{ row.category?.name || '未分类' }}</el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="tags" label="标签" width="200">
            <template #default="{ row }">
              <div class="flex flex-wrap gap-1">
                <el-tag
                  v-for="tag in row.tags || []"
                  :key="tag.id"
                  size="small"
                  type="success"
                >
                  {{ tag.name }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="readCount" label="阅读量" width="100" align="center" />
          
          <el-table-column prop="publishDate" label="发布时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.publishDate) }}
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="280" fixed="right">
            <template #default="{ row }">
              <div class="flex items-center gap-2 justify-end">
                <el-button size="small" @click="editArticle(row)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button
                  size="small"
                  :type="row.status === 'published' ? 'warning' : 'success'"
                  @click="toggleStatus(row)"
                >
                  {{ row.status === 'published' ? '下线' : '发布' }}
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteArticle(row)"
                  class="delete-btn"
                >
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="mt-6 flex justify-center">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalArticles"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 文章编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="editingArticle?.id ? '编辑文章' : '新建文章'"
      width="80%"
      top="5vh"
    >
      <ArticleEditor
        v-if="editDialogVisible"
        :article="editingArticle"
        @save="handleSave"
        @cancel="editDialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, Search, Edit, Delete } from '@element-plus/icons-vue'
import { useBlogStore } from '@/stores/blog'
import ArticleEditor from '@/components/ArticleEditor.vue'
import type { Article } from '@/types'

const blogStore = useBlogStore()

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const editDialogVisible = ref(false)
const editingArticle = ref<Article | null>(null)

// 计算属性
const filteredArticles = computed(() => {
  let articles = blogStore.articles
  
  // 搜索过滤
  if (searchKeyword.value) {
    articles = articles.filter(article => 
      article.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  
  // 状态过滤
  if (statusFilter.value) {
    articles = articles.filter(article => article.status === statusFilter.value)
  }
  
  return articles
})

const totalArticles = computed(() => filteredArticles.value.length)

// 方法
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const createArticle = () => {
  editingArticle.value = null
  editDialogVisible.value = true
}

const editArticle = (article: Article) => {
  editingArticle.value = { ...article }
  editDialogVisible.value = true
}

const handleSave = async (article: Article) => {
  try {
    if (article.id) {
      // 更新文章
      await blogStore.updateArticle(article.id, article)
      ElMessage.success('文章更新成功')
    } else {
      // 创建新文章
      await blogStore.createArticle(article)
      ElMessage.success('文章创建成功')
    }
    editDialogVisible.value = false
  } catch (error) {
    console.error('保存文章失败:', error)
    ElMessage.error('保存文章失败，请重试')
  }
}

const toggleStatus = async (article: Article) => {
  const newStatus = article.status === 'published' ? 'draft' : 'published'
  const action = newStatus === 'published' ? '发布' : '下线'
  
  try {
    await ElMessageBox.confirm(
      `确定要${action}文章「${article.title}」吗？`,
      '确认操作',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    blogStore.updateArticle(article.id, { status: newStatus as 'draft' | 'published' })
    ElMessage.success(`文章${action}成功`)
  } catch {
    // 用户取消操作
  }
}

const deleteArticle = async (article: Article) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除文章「${article.title}」吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      }
    )
    
    blogStore.deleteArticle(article.id)
    ElMessage.success('文章删除成功')
  } catch {
    // 用户取消操作
  }
}

const refreshList = async () => {
  try {
    loading.value = true
    await blogStore.fetchArticles()
    ElMessage.success('列表刷新成功')
  } catch (error) {
    console.error('刷新列表失败:', error)
    ElMessage.error('刷新列表失败，请重试')
  } finally {
    loading.value = false
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

// 生命周期
onMounted(async () => {
  try {
    loading.value = true
    await blogStore.fetchArticles()
    await blogStore.fetchCategories()
    await blogStore.fetchTags()
  } catch (error) {
    console.error('初始化数据失败:', error)
    ElMessage.error('加载数据失败，请刷新页面重试')
  } finally {
    loading.value = false
  }
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

.el-pagination {
  --el-pagination-button-color: #6b7280;
  --el-pagination-hover-color: #3b82f6;
}

.delete-btn {
  z-index: 10;
  position: relative;
}

:deep(.el-table .el-table__fixed-right) {
  z-index: 3;
}

:deep(.el-table__body-wrapper) {
  overflow-x: auto;
}
</style>