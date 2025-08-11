<template>
  <div class="article-editor">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="space-y-6"
    >
      <!-- 基本信息 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <el-form-item label="文章标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入文章标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="文章摘要" prop="excerpt">
          <el-input
            v-model="form.excerpt"
            placeholder="请输入文章摘要"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <el-form-item label="分类" prop="category">
          <el-select
            v-model="form.category"
            placeholder="选择分类"
            filterable
            allow-create
            class="w-full"
          >
            <el-option
              v-for="category in categories"
              :key="category"
              :label="category"
              :value="category"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="标签" prop="tags">
          <el-select
            v-model="form.tags"
            multiple
            filterable
            allow-create
            placeholder="选择或创建标签"
            class="w-full"
          >
            <el-option
              v-for="tag in availableTags"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" class="w-full">
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
          </el-select>
        </el-form-item>
      </div>
      
      <!-- 封面图片 -->
      <el-form-item label="封面图片">
        <div class="flex items-center gap-4">
          <el-input
            v-model="form.coverImage"
            placeholder="请输入图片URL或上传图片"
            class="flex-1"
          />
          <el-upload
            :show-file-list="false"
            :before-upload="handleImageUpload"
            accept="image/*"
          >
            <el-button type="primary">
              <el-icon><Upload /></el-icon>
              上传图片
            </el-button>
          </el-upload>
        </div>
        <div v-if="form.coverImage" class="mt-2">
          <img
            :src="form.coverImage"
            alt="封面预览"
            class="w-32 h-20 object-cover rounded border"
          />
        </div>
      </el-form-item>
      
      <!-- Markdown编辑器 -->
      <el-form-item label="文章内容" prop="content">
        <div class="w-full border rounded-lg overflow-hidden">
          <div class="flex items-center justify-between bg-gray-50 px-4 py-2 border-b">
            <div class="flex items-center gap-2">
              <el-button
                size="small"
                :type="editorMode === 'edit' ? 'primary' : 'default'"
                @click="editorMode = 'edit'"
              >
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button
                size="small"
                :type="editorMode === 'preview' ? 'primary' : 'default'"
                @click="editorMode = 'preview'"
              >
                <el-icon><View /></el-icon>
                预览
              </el-button>
              <el-button
                size="small"
                :type="editorMode === 'split' ? 'primary' : 'default'"
                @click="editorMode = 'split'"
              >
                <el-icon><Grid /></el-icon>
                分屏
              </el-button>
            </div>
            
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <span>字数: {{ contentWordCount }}</span>
              <span>|</span>
              <span>预计阅读: {{ readingTime }}分钟</span>
            </div>
          </div>
          
          <div class="flex" style="height: 500px;">
            <!-- 编辑区域 -->
            <div
              v-show="editorMode === 'edit' || editorMode === 'split'"
              :class="[
                'flex-1 relative',
                editorMode === 'split' ? 'border-r' : ''
              ]"
            >
              <textarea
                v-model="form.content"
                placeholder="请输入Markdown内容..."
                class="w-full h-full p-4 border-0 outline-none resize-none font-mono text-sm leading-relaxed"
                @input="handleContentChange"
              />
              
              <!-- 工具栏 -->
              <div class="absolute top-2 right-2 flex items-center gap-1">
                <el-tooltip content="插入代码块">
                  <el-button size="small" text @click="insertCodeBlock">
                    <el-icon><Edit /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="插入链接">
                  <el-button size="small" text @click="insertLink">
                    <el-icon><Link /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="插入图片">
                  <el-button size="small" text @click="insertImage">
                    <el-icon><Picture /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            
            <!-- 预览区域 -->
            <div
              v-show="editorMode === 'preview' || editorMode === 'split'"
              class="flex-1 p-4 overflow-y-auto bg-white"
            >
              <div
                v-if="form.content"
                class="prose prose-sm max-w-none"
                v-html="renderedContent"
              />
              <div v-else class="text-gray-400 text-center py-8">
                暂无内容，请在左侧编辑区域输入Markdown内容
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    
    <!-- 操作按钮 -->
    <div class="flex justify-end gap-4 mt-6 pt-6 border-t">
      <el-button @click="$emit('cancel')">
        取消
      </el-button>
      <el-button @click="saveDraft">
        保存草稿
      </el-button>
      <el-button type="primary" @click="saveArticle">
        {{ form.status === 'published' ? '发布文章' : '保存文章' }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Edit,
  View,
  Grid,
  Link,
  Picture,
  Upload
} from '@element-plus/icons-vue'
// import { marked } from 'marked'
import type { Article, Category, Tag } from '@/types'

interface Props {
  article?: Article | null
}

interface Emits {
  save: [article: Article]
  cancel: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 响应式数据
const formRef = ref()
const editorMode = ref<'edit' | 'preview' | 'split'>('split')

const form = ref({
  id: '',
  title: '',
  excerpt: '',
  content: '',
  category: null as Category | null,
  tags: [] as Tag[],
  status: 'draft' as 'draft' | 'published',
  coverImage: '',
  author: '',
  publishDate: '',
  updateDate: '',
  readCount: 0,
  likeCount: 0
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 1, max: 100, message: '标题长度在 1 到 100 个字符', trigger: 'blur' }
  ],
  excerpt: [
    { required: true, message: '请输入文章摘要', trigger: 'blur' },
    { min: 1, max: 200, message: '摘要长度在 1 到 200 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择文章分类', trigger: 'change' }
  ]
}

// 可选的分类和标签
const categories = ref([
  'Vue.js',
  'React',
  'JavaScript',
  'TypeScript',
  'Node.js',
  '前端工程化',
  '性能优化',
  '设计模式',
  '算法与数据结构',
  '工具与效率'
])

const availableTags = ref([
  'Vue3',
  'Composition API',
  'Pinia',
  'Vite',
  'Element Plus',
  'TypeScript',
  'ES6+',
  'Webpack',
  'CSS3',
  'HTML5',
  '响应式设计',
  '移动端',
  '性能优化',
  '代码规范',
  '最佳实践'
])

// 计算属性
const contentWordCount = computed(() => {
  return form.value.content.replace(/\s/g, '').length
})

const readingTime = computed(() => {
  const wordsPerMinute = 200
  const words = contentWordCount.value
  return Math.ceil(words / wordsPerMinute) || 1
})

const renderedContent = computed(() => {
  if (!form.value.content) return ''
  // 简单的 Markdown 预览，实际项目中应使用 marked 或其他 Markdown 解析器
  return `<pre>${form.value.content}</pre>`
})

// 方法
const handleContentChange = () => {
  // 自动保存草稿逻辑可以在这里实现
}

const insertCodeBlock = () => {
  const textarea = document.querySelector('textarea')
  if (textarea) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const before = text.substring(0, start)
    const after = text.substring(end)
    const codeBlock = '\n```javascript\n// 在这里输入代码\n```\n'
    
    form.value.content = before + codeBlock + after
    
    // 设置光标位置
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + 15, start + 24)
    }, 0)
  }
}

const insertLink = () => {
  const textarea = document.querySelector('textarea')
  if (textarea) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selectedText = text.substring(start, end)
    const before = text.substring(0, start)
    const after = text.substring(end)
    const linkText = selectedText || '链接文字'
    const link = `[${linkText}](https://example.com)`
    
    form.value.content = before + link + after
    
    setTimeout(() => {
      textarea.focus()
      const newStart = start + linkText.length + 3
      textarea.setSelectionRange(newStart, newStart + 19)
    }, 0)
  }
}

const insertImage = () => {
  const textarea = document.querySelector('textarea')
  if (textarea) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const before = text.substring(0, start)
    const after = text.substring(end)
    const image = '![图片描述](https://example.com/image.jpg)'
    
    form.value.content = before + image + after
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + 2, start + 6)
    }, 0)
  }
}

const handleImageUpload = (file: File) => {
  // 这里可以实现图片上传逻辑
  // 目前使用模拟URL
  const imageUrl = `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=blog_cover_image&image_size=landscape_16_9`
  form.value.coverImage = imageUrl
  ElMessage.success('图片上传成功')
  return false // 阻止默认上传行为
}

const saveDraft = async () => {
  form.value.status = 'draft'
  await saveArticle()
}

const saveArticle = async () => {
  try {
    await formRef.value.validate()
    
    const article: Article = {
      ...form.value,
      author: form.value.author || '匿名',
      publishDate: form.value.publishDate || new Date().toISOString().split('T')[0],
      updateDate: new Date().toISOString().split('T')[0]
    }
    
    emit('save', article)
  } catch (error) {
    ElMessage.error('请检查表单内容')
  }
}

// 监听props变化
watch(
  () => props.article,
  (article) => {
    if (article) {
      form.value = {
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        tags: article.tags,
        status: article.status,
        coverImage: article.coverImage || '',
        author: article.author,
        publishDate: article.publishDate,
        updateDate: article.updateDate,
        readCount: article.readCount,
        likeCount: article.likeCount
      }
    } else {
      // 重置表单
      form.value = {
        id: '',
        title: '',
        excerpt: '',
        content: '',
        category: null,
        tags: [],
        status: 'draft',
        coverImage: '',
        author: '',
        publishDate: '',
        updateDate: '',
        readCount: 0,
        likeCount: 0
      }
    }
  },
  { immediate: true }
)

// 生命周期
onMounted(() => {
  // Markdown 配置 - 暂时注释，需要安装 marked 库
  // marked.setOptions({
  //   breaks: true,
  //   gfm: true
  // })
})
</script>

<style scoped>
.article-editor {
  max-height: 80vh;
  overflow-y: auto;
}

.prose {
  color: #374151;
  line-height: 1.75;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: #111827;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.prose p {
  margin-bottom: 1em;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.prose pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1em 0;
}

.prose pre code {
  background-color: transparent;
  padding: 0;
  color: inherit;
}

.prose blockquote {
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  margin: 1em 0;
  font-style: italic;
  color: #6b7280;
}

.prose ul,
.prose ol {
  margin: 1em 0;
  padding-left: 1.5rem;
}

.prose li {
  margin: 0.25em 0;
}

.prose a {
  color: #3b82f6;
  text-decoration: underline;
}

.prose a:hover {
  color: #1d4ed8;
}

.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1em 0;
}

.prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}

.prose th,
.prose td {
  border: 1px solid #d1d5db;
  padding: 0.5rem;
  text-align: left;
}

.prose th {
  background-color: #f9fafb;
  font-weight: 600;
}
</style>