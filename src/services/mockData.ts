import type { Article, Category, Tag } from '../types'

// 技术分类数据
export const mockCategories: Category[] = [
  {
    id: '1',
    name: '前端开发',
    description: '现代前端开发技术与框架',
    color: '#3b82f6',
    articleCount: 15
  },
  {
    id: '2',
    name: '后端开发',
    description: 'Node.js、Python、Java等后端技术',
    color: '#10b981',
    articleCount: 12
  },
  {
    id: '3',
    name: '算法与数据结构',
    description: '算法思维与数据结构实现',
    color: '#f59e0b',
    articleCount: 8
  },
  {
    id: '4',
    name: '人工智能',
    description: 'AI、机器学习、深度学习',
    color: '#8b5cf6',
    articleCount: 6
  },
  {
    id: '5',
    name: '系统架构',
    description: '微服务、分布式系统设计',
    color: '#ef4444',
    articleCount: 10
  },
  {
    id: '6',
    name: '数据库',
    description: 'SQL、NoSQL数据库技术',
    color: '#06b6d4',
    articleCount: 7
  },
  {
    id: '7',
    name: 'DevOps',
    description: 'CI/CD、容器化、云原生',
    color: '#84cc16',
    articleCount: 9
  }
]

// 热门技术标签数据
export const mockTags: Tag[] = [
  // 前端技术
  { id: '1', name: 'Vue.js', color: '#4fc08d', articleCount: 8 },
  { id: '2', name: 'React', color: '#61dafb', articleCount: 7 },
  { id: '3', name: 'TypeScript', color: '#3178c6', articleCount: 12 },
  { id: '4', name: 'JavaScript', color: '#f7df1e', articleCount: 15 },
  { id: '5', name: 'CSS', color: '#1572b6', articleCount: 6 },
  { id: '6', name: 'Tailwind CSS', color: '#06b6d4', articleCount: 5 },
  { id: '7', name: 'Vite', color: '#646cff', articleCount: 4 },
  { id: '8', name: 'Webpack', color: '#8dd6f9', articleCount: 3 },
  
  // 后端技术
  { id: '9', name: 'Node.js', color: '#339933', articleCount: 9 },
  { id: '10', name: 'Express', color: '#000000', articleCount: 6 },
  { id: '11', name: 'Python', color: '#3776ab', articleCount: 8 },
  { id: '12', name: 'Django', color: '#092e20', articleCount: 4 },
  { id: '13', name: 'FastAPI', color: '#009688', articleCount: 3 },
  { id: '14', name: 'Java', color: '#ed8b00', articleCount: 7 },
  { id: '15', name: 'Spring Boot', color: '#6db33f', articleCount: 5 },
  
  // 数据库
  { id: '16', name: 'MySQL', color: '#4479a1', articleCount: 6 },
  { id: '17', name: 'PostgreSQL', color: '#336791', articleCount: 4 },
  { id: '18', name: 'MongoDB', color: '#47a248', articleCount: 5 },
  { id: '19', name: 'Redis', color: '#dc382d', articleCount: 4 },
  { id: '20', name: 'Supabase', color: '#3ecf8e', articleCount: 3 },
  
  // 算法与AI
  { id: '21', name: '算法', color: '#ff6b6b', articleCount: 8 },
  { id: '22', name: '数据结构', color: '#4ecdc4', articleCount: 6 },
  { id: '23', name: '机器学习', color: '#45b7d1', articleCount: 5 },
  { id: '24', name: 'TensorFlow', color: '#ff6f00', articleCount: 3 },
  { id: '25', name: 'PyTorch', color: '#ee4c2c', articleCount: 3 },
  { id: '26', name: 'OpenAI', color: '#412991', articleCount: 4 },
  
  // DevOps与工具
  { id: '27', name: 'Docker', color: '#2496ed', articleCount: 7 },
  { id: '28', name: 'Kubernetes', color: '#326ce5', articleCount: 5 },
  { id: '29', name: 'AWS', color: '#ff9900', articleCount: 6 },
  { id: '30', name: 'Git', color: '#f05032', articleCount: 8 },
  { id: '31', name: 'GitHub Actions', color: '#2088ff', articleCount: 4 },
  { id: '32', name: 'Nginx', color: '#009639', articleCount: 3 },
  
  // 架构与设计
  { id: '33', name: '微服务', color: '#ff7675', articleCount: 6 },
  { id: '34', name: '分布式系统', color: '#74b9ff', articleCount: 5 },
  { id: '35', name: '设计模式', color: '#a29bfe', articleCount: 4 },
  { id: '36', name: '系统设计', color: '#fd79a8', articleCount: 7 },
  { id: '37', name: 'API设计', color: '#fdcb6e', articleCount: 5 },
  
  // 性能优化
  { id: '38', name: '性能优化', color: '#00b894', articleCount: 6 },
  { id: '39', name: '缓存策略', color: '#e17055', articleCount: 4 },
  { id: '40', name: '监控', color: '#6c5ce7', articleCount: 3 }
]

// 真实的技术博客文章数据
export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Vue 3 Composition API 深度解析：从入门到实战',
    excerpt: '深入理解Vue 3 Composition API的设计理念和最佳实践，通过实际项目案例学习如何提升开发效率和代码可维护性。',
    content: `# Vue 3 Composition API 深度解析：从入门到实战

最近在重构公司的前端项目时，深度使用了 Vue 3 的 Composition API，收获颇多。今天想和大家分享一下我的使用心得和踩坑经验。

## 为什么选择 Composition API？

在之前的 Vue 2 项目中，我们经常遇到这样的问题：
- 组件逻辑分散在 data、methods、computed 等选项中
- 复用逻辑需要通过 mixins，容易产生命名冲突
- 大型组件难以维护和理解

Composition API 很好地解决了这些问题。

## 核心概念详解

### 1. setup 函数 - 新的入口点

\`\`\`javascript
import { ref, reactive, computed, onMounted } from 'vue'

export default {
  setup() {
    // 响应式数据
    const count = ref(0)
    const user = reactive({
      name: 'Alex Chen',
      email: 'alex@example.com'
    })
    
    // 计算属性
    const doubleCount = computed(() => count.value * 2)
    
    // 方法
    const increment = () => {
      count.value++
    }
    
    // 生命周期
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    return {
      count,
      user,
      doubleCount,
      increment
    }
  }
}
\`\`\`

### 2. 响应式系统的改进

**ref vs reactive 的选择：**
- \`ref()\`: 适用于基本类型和单一值
- \`reactive()\`: 适用于对象和数组

\`\`\`javascript
// 推荐的使用方式
const loading = ref(false)
const userInfo = reactive({
  id: 1,
  name: 'John Doe',
  preferences: {
    theme: 'dark',
    language: 'zh-CN'
  }
})
\`\`\`

## 实战案例：用户管理组件

让我通过一个实际的用户管理组件来展示 Composition API 的威力：

\`\`\`vue
<template>
  <div class="user-management">
    <div class="search-bar">
      <input 
        v-model="searchQuery" 
        placeholder="搜索用户..."
        @input="handleSearch"
      />
    </div>
    
    <div class="user-list">
      <div 
        v-for="user in filteredUsers" 
        :key="user.id"
        class="user-card"
        @click="selectUser(user)"
      >
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      加载中...
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserApi } from '@/composables/useUserApi'
import { useDebounce } from '@/composables/useDebounce'

// 使用自定义 composable
const { users, loading, fetchUsers } = useUserApi()
const searchQuery = ref('')
const selectedUser = ref(null)

// 防抖搜索
const debouncedSearch = useDebounce(searchQuery, 300)

// 计算属性
const filteredUsers = computed(() => {
  if (!debouncedSearch.value) return users.value
  
  return users.value.filter(user => 
    user.name.toLowerCase().includes(debouncedSearch.value.toLowerCase()) ||
    user.email.toLowerCase().includes(debouncedSearch.value.toLowerCase())
  )
})

// 方法
const handleSearch = () => {
  // 搜索逻辑已通过计算属性实现
}

const selectUser = (user) => {
  selectedUser.value = user
  console.log('选中用户:', user)
}

// 生命周期
onMounted(() => {
  fetchUsers()
})
</script>
\`\`\`

## 自定义 Composables

这是 Composition API 最强大的特性之一。我们可以将逻辑提取到可复用的函数中：

\`\`\`javascript
// composables/useUserApi.js
import { ref } from 'vue'
import axios from 'axios'

export function useUserApi() {
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  const fetchUsers = async () => {
    loading.value = true
    try {
      const response = await axios.get('/api/users')
      users.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  return {
    users,
    loading,
    error,
    fetchUsers
  }
}
\`\`\`

## 最佳实践总结

经过几个月的实践，我总结了以下最佳实践：

### 1. 使用 \`<script setup>\` 语法糖
这是 Vue 3.2+ 推荐的写法，更简洁：

\`\`\`vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
const increment = () => count.value++
</script>
\`\`\`

### 2. 合理组织 Composables
- 按功能域划分（如 useAuth、useApi、useForm）
- 保持单一职责原则
- 提供清晰的返回值

### 3. 响应式数据的解构
使用 \`toRefs\` 安全地解构响应式对象：

\`\`\`javascript
import { toRefs } from 'vue'

const state = reactive({ name: 'Vue', version: 3 })
const { name, version } = toRefs(state)
\`\`\`

## 踩坑记录

### 1. ref 的 .value 问题
在模板中不需要 .value，但在 JavaScript 中需要：

\`\`\`javascript
// ❌ 错误
const count = ref(0)
console.log(count) // Proxy 对象

// ✅ 正确
console.log(count.value) // 0
\`\`\`

### 2. 响应式丢失
直接解构会丢失响应式：

\`\`\`javascript
// ❌ 会丢失响应式
const { name } = reactive({ name: 'Vue' })

// ✅ 保持响应式
const state = reactive({ name: 'Vue' })
const { name } = toRefs(state)
\`\`\`

## 性能优化技巧

1. **合理使用 shallowRef 和 shallowReactive**
2. **避免在模板中使用复杂计算**
3. **使用 markRaw 标记不需要响应式的对象**

## 总结

Composition API 不仅仅是语法糖，它代表了 Vue 3 对组件逻辑组织方式的重新思考。通过合理使用，我们可以：

- 提高代码的可读性和可维护性
- 更好地复用逻辑
- 获得更好的 TypeScript 支持
- 构建更灵活的组件架构

希望这篇文章能帮助大家更好地理解和使用 Composition API。如果你有任何问题或想法，欢迎在评论区讨论！`,
    coverImage: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Vue.js%20Composition%20API%20code%20editor%20with%20modern%20interface&image_size=landscape_16_9',
    category: mockCategories[0],
    tags: [mockTags[0], mockTags[2], mockTags[3]],
    author: 'Alex Chen',
    publishDate: '2024-01-15T10:00:00Z',
    updateDate: '2024-01-16T14:30:00Z',
    readCount: 2847,
    likeCount: 156,
    status: 'published'
  },
  {
    id: '2',
    title: 'TypeScript 高级类型系统实战：构建类型安全的企业级应用',
    excerpt: '从实际项目出发，深入探讨TypeScript高级类型系统的应用，包括泛型约束、条件类型、映射类型等，帮你构建更安全、更优雅的企业级应用。',
    content: `# TypeScript 高级类型系统实战：构建类型安全的企业级应用

作为一名在大厂工作了5年的前端工程师，我见证了TypeScript从小众工具到前端标配的整个过程。今天想分享一下我在企业级项目中使用TypeScript高级类型系统的实战经验。

## 为什么要深入学习TypeScript类型系统？

在我们团队维护的一个包含200+组件的设计系统中，TypeScript的类型系统发挥了巨大作用：

- **编译时错误检测**：减少了70%的运行时错误
- **更好的IDE支持**：智能提示和重构变得更加准确
- **团队协作效率**：新人上手项目的时间从2周缩短到3天
- **代码自文档化**：类型定义本身就是最好的文档

## 核心高级类型特性

### 1. 联合类型与交叉类型的实际应用

在我们的用户权限系统中，联合类型和交叉类型被大量使用：

\`\`\`typescript
// 用户角色定义
type UserRole = 'admin' | 'editor' | 'viewer'
type Permission = 'read' | 'write' | 'delete'

// 基础用户信息
interface BaseUser {
  id: string
  name: string
  email: string
}

// 权限信息
interface UserPermissions {
  role: UserRole
  permissions: Permission[]
  lastLogin: Date
}

// 使用交叉类型组合
type AuthenticatedUser = BaseUser & UserPermissions

// 实际使用
function checkUserAccess(user: AuthenticatedUser, requiredPermission: Permission): boolean {
  return user.permissions.includes(requiredPermission)
}
\`\`\`

### 2. 泛型约束：让类型更精确

在开发通用的API请求函数时，泛型约束帮我们解决了很多问题：

\`\`\`typescript
// API响应的基础结构
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

// 分页数据结构
interface PaginatedData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 约束泛型必须有id字段
interface HasId {
  id: string | number
}

// 通用的CRUD操作类型
class ApiService<T extends HasId> {
  constructor(private endpoint: string) {}
  
  async getList(params?: any): Promise<ApiResponse<PaginatedData<T>>> {
    // 实现获取列表的逻辑
    const response = await fetch(\`\${this.endpoint}\`, {
      method: 'GET',
      // ...
    })
    return response.json()
  }
  
  async getById(id: T['id']): Promise<ApiResponse<T>> {
    // 实现根据ID获取的逻辑
    const response = await fetch(\`\${this.endpoint}/\${id}\`)
    return response.json()
  }
  
  async update(id: T['id'], data: Partial<Omit<T, 'id'>>): Promise<ApiResponse<T>> {
    // 实现更新的逻辑
    const response = await fetch(\`\${this.endpoint}/\${id}\`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
    return response.json()
  }
}

// 使用示例
interface User extends HasId {
  id: string
  name: string
  email: string
  avatar?: string
}

const userApi = new ApiService<User>('/api/users')

// TypeScript会自动推断类型
const users = await userApi.getList() // ApiResponse<PaginatedData<User>>
const user = await userApi.getById('123') // ApiResponse<User>
\`\`\`

### 3. 条件类型：动态类型推导

条件类型在我们的表单验证系统中发挥了重要作用：

\`\`\`typescript
// 根据字段类型自动推导验证规则类型
type ValidationRule<T> = T extends string
  ? { required?: boolean; minLength?: number; maxLength?: number; pattern?: RegExp }
  : T extends number
  ? { required?: boolean; min?: number; max?: number }
  : T extends boolean
  ? { required?: boolean }
  : T extends Date
  ? { required?: boolean; minDate?: Date; maxDate?: Date }
  : { required?: boolean }

// 表单字段定义
interface FormField<T = any> {
  value: T
  rules?: ValidationRule<T>
  error?: string
}

// 表单配置
interface UserForm {
  name: FormField<string>
  age: FormField<number>
  isActive: FormField<boolean>
  birthDate: FormField<Date>
}

// 使用时会有完整的类型提示
const userForm: UserForm = {
  name: {
    value: '',
    rules: {
      required: true,
      minLength: 2,
      maxLength: 50
    }
  },
  age: {
    value: 0,
    rules: {
      required: true,
      min: 18,
      max: 120
    }
  },
  isActive: {
    value: false,
    rules: { required: true }
  },
  birthDate: {
    value: new Date(),
    rules: {
      required: true,
      maxDate: new Date()
    }
  }
}
\`\`\`

### 4. 映射类型：批量类型转换

在状态管理中，映射类型帮我们自动生成了大量的类型定义：

\`\`\`typescript
// 基础状态接口
interface AppState {
  user: User | null
  posts: Post[]
  loading: boolean
  error: string | null
}

// 自动生成loading状态类型
type LoadingState<T> = {
  [K in keyof T as \`\${string & K}Loading\`]: boolean
}

// 自动生成error状态类型
type ErrorState<T> = {
  [K in keyof T as \`\${string & K}Error\`]: string | null
}

// 组合所有状态
type EnhancedAppState = AppState & LoadingState<AppState> & ErrorState<AppState>

// 结果类型会自动包含：
// userLoading, postsLoading, loadingLoading, errorLoading
// userError, postsError, loadingError, errorError
\`\`\`

## 实战技巧分享

### 1. 使用工具类型简化开发

\`\`\`typescript
// 创建可选字段的更新类型
type UpdatePayload<T> = Partial<Pick<T, keyof T>> & { id: T extends { id: infer U } ? U : never }

// 提取函数返回值类型
type ApiResult<T extends (...args: any[]) => any> = T extends (...args: any[]) => Promise<infer R> ? R : never

// 深度只读类型
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}
\`\`\`

### 2. 类型守卫提升运行时安全

\`\`\`typescript
// 类型守卫函数
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string'
}

function isApiError(response: any): response is { error: string } {
  return response && typeof response.error === 'string'
}

// 使用类型守卫
function handleApiResponse(response: unknown) {
  if (isApiError(response)) {
    console.error('API Error:', response.error)
    return
  }
  
  if (isUser(response)) {
    console.log('User:', response.name) // TypeScript知道这里response是User类型
  }
}
\`\`\`

### 3. 模板字面量类型的妙用

\`\`\`typescript
// 事件名称类型
type EventName = \`on\${Capitalize<string>}\`

// CSS属性类型
type CSSProperty = \`--\${string}\` | 'color' | 'background' | 'margin' | 'padding'

// API路径类型
type ApiPath = \`/api/\${string}\`

// 使用示例
interface ComponentProps {
  [K: EventName]: (event: Event) => void
  style?: Record<CSSProperty, string>
}
\`\`\`

## 性能优化建议

1. **避免过度复杂的类型**：复杂的条件类型会影响编译性能
2. **合理使用类型断言**：在确保安全的前提下使用 as 断言
3. **利用类型缓存**：将复杂类型计算结果缓存到类型别名中

## 团队协作最佳实践

1. **建立类型规范**：统一团队的类型定义风格
2. **类型文档化**：为复杂类型添加注释说明
3. **渐进式迁移**：从any开始，逐步完善类型定义
4. **代码审查**：重点关注类型定义的合理性

## 总结

TypeScript的高级类型系统不仅仅是语法特性，更是构建大型应用的重要工具。通过合理运用这些特性，我们可以：

- 在编译时发现更多潜在问题
- 提供更好的开发体验
- 构建更加健壮的应用架构
- 提升团队协作效率

希望这些实战经验能帮助大家更好地掌握TypeScript，构建出更优秀的前端应用。如果你在使用过程中遇到问题，欢迎在评论区交流讨论！`,
    coverImage: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=TypeScript%20advanced%20types%20code%20with%20enterprise%20application%20interface&image_size=landscape_16_9',
    category: mockCategories[0],
    tags: [mockTags[2], mockTags[3]],
    author: 'Sarah Wang',
    publishDate: '2024-01-12T14:30:00Z',
    updateDate: '2024-01-13T09:15:00Z',
    readCount: 1876,
    likeCount: 134,
    status: 'published'
  },
  {
    id: '3',
    title: 'Node.js 微服务架构设计实战：从单体到微服务的完整迁移指南',
    excerpt: '基于真实项目经验，详细介绍如何将传统单体应用迁移到Node.js微服务架构，包括服务拆分、数据一致性、监控告警等核心问题的解决方案。',
    content: `# Node.js 微服务架构设计实战：从单体到微服务的完整迁移指南

去年我们团队成功将一个日活百万的电商平台从单体架构迁移到了微服务架构，整个过程历时8个月。今天想和大家分享这次迁移的完整经验，希望能帮助正在考虑微服务化的团队避免一些坑。

## 为什么要进行微服务化？

我们的单体应用在发展了3年后遇到了这些问题：

- **部署困难**：每次发布都需要停机，影响所有功能
- **技术债务**：代码耦合严重，新功能开发越来越困难
- **团队协作**：20+开发人员在同一个代码库工作，冲突频繁
- **性能瓶颈**：无法针对特定模块进行优化扩容
- **技术栈限制**：无法引入新技术，只能在现有框架内修修补补

## 微服务拆分策略

### 1. 业务域驱动拆分

我们采用了DDD（领域驱动设计）的方法来拆分服务：

\`\`\`
电商平台服务拆分：
├── 用户服务 (User Service)
│   ├── 用户注册/登录
│   ├── 用户信息管理
│   └── 用户权限控制
├── 商品服务 (Product Service)
│   ├── 商品信息管理
│   ├── 库存管理
│   └── 价格管理
├── 订单服务 (Order Service)
│   ├── 订单创建
│   ├── 订单状态管理
│   └── 订单查询
├── 支付服务 (Payment Service)
│   ├── 支付处理
│   ├── 退款处理
│   └── 支付状态查询
└── 通知服务 (Notification Service)
    ├── 邮件通知
    ├── 短信通知
    └── 推送通知
\`\`\`

### 2. 数据库拆分策略

每个服务都有自己独立的数据库，避免数据耦合：

\`\`\`javascript
// 用户服务数据库设计
const userSchema = {
  users: {
    id: 'UUID',
    email: 'String',
    password_hash: 'String',
    profile: 'JSON',
    created_at: 'DateTime',
    updated_at: 'DateTime'
  },
  user_sessions: {
    id: 'UUID',
    user_id: 'UUID',
    token: 'String',
    expires_at: 'DateTime'
  }
}

// 订单服务数据库设计
const orderSchema = {
  orders: {
    id: 'UUID',
    user_id: 'UUID', // 外键，但不使用数据库约束
    total_amount: 'Decimal',
    status: 'Enum',
    created_at: 'DateTime'
  },
  order_items: {
    id: 'UUID',
    order_id: 'UUID',
    product_id: 'UUID', // 外键，但不使用数据库约束
    quantity: 'Integer',
    price: 'Decimal'
  }
}
\`\`\`

## 核心技术实现

### 1. 服务注册与发现

我们使用Consul作为服务注册中心：

\`\`\`javascript
// service-registry.js
const consul = require('consul')()
const os = require('os')

class ServiceRegistry {
  constructor(serviceName, port) {
    this.serviceName = serviceName
    this.port = port
    this.serviceId = \`\${serviceName}-\${os.hostname()}-\${port}\`
  }

  async register() {
    const service = {
      id: this.serviceId,
      name: this.serviceName,
      address: this.getLocalIP(),
      port: this.port,
      check: {
        http: \`http://\${this.getLocalIP()}:\${this.port}/health\`,
        interval: '10s',
        timeout: '5s'
      }
    }

    try {
      await consul.agent.service.register(service)
      console.log(\`Service \${this.serviceName} registered successfully\`)
    } catch (error) {
      console.error('Service registration failed:', error)
    }
  }

  async deregister() {
    try {
      await consul.agent.service.deregister(this.serviceId)
      console.log(\`Service \${this.serviceName} deregistered\`)
    } catch (error) {
      console.error('Service deregistration failed:', error)
    }
  }

  getLocalIP() {
    const interfaces = os.networkInterfaces()
    for (const name of Object.keys(interfaces)) {
      for (const interface of interfaces[name]) {
        if (interface.family === 'IPv4' && !interface.internal) {
          return interface.address
        }
      }
    }
    return '127.0.0.1'
  }
}

module.exports = ServiceRegistry
\`\`\`

### 2. API网关设计

使用Express.js构建API网关，统一处理路由、认证、限流等：

\`\`\`javascript
// api-gateway.js
const express = require('express')
const httpProxy = require('http-proxy-middleware')
const rateLimit = require('express-rate-limit')
const jwt = require('jsonwebtoken')
const consul = require('consul')()

const app = express()

// 限流中间件
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
  message: 'Too many requests from this IP'
})

// JWT认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.sendStatus(401)
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// 服务发现
const getServiceUrl = async (serviceName) => {
  try {
    const services = await consul.health.service(serviceName)
    if (services.length === 0) {
      throw new Error(\`Service \${serviceName} not found\`)
    }
    
    // 简单的负载均衡：随机选择一个健康的服务实例
    const healthyServices = services.filter(service => 
      service.Checks.every(check => check.Status === 'passing')
    )
    
    if (healthyServices.length === 0) {
      throw new Error(\`No healthy instances of \${serviceName} found\`)
    }
    
    const randomService = healthyServices[Math.floor(Math.random() * healthyServices.length)]
    return \`http://\${randomService.Service.Address}:\${randomService.Service.Port}\`
  } catch (error) {
    console.error('Service discovery error:', error)
    throw error
  }
}

// 动态代理中间件
const createProxyMiddleware = (serviceName) => {
  return async (req, res, next) => {
    try {
      const serviceUrl = await getServiceUrl(serviceName)
      const proxy = httpProxy({
        target: serviceUrl,
        changeOrigin: true,
        pathRewrite: {
          [\`^/api/\${serviceName}\`]: ''
        },
        onError: (err, req, res) => {
          console.error(\`Proxy error for \${serviceName}:\`, err)
          res.status(503).json({ error: 'Service temporarily unavailable' })
        }
      })
      proxy(req, res, next)
    } catch (error) {
      res.status(503).json({ error: 'Service discovery failed' })
    }
  }
}

// 应用中间件
app.use(express.json())
app.use(limiter)

// 路由配置
app.use('/api/users', createProxyMiddleware('user-service'))
app.use('/api/products', createProxyMiddleware('product-service'))
app.use('/api/orders', authenticateToken, createProxyMiddleware('order-service'))
app.use('/api/payments', authenticateToken, createProxyMiddleware('payment-service'))
app.use('/api/notifications', authenticateToken, createProxyMiddleware('notification-service'))

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(\`API Gateway running on port \${PORT}\`)
})
\`\`\`

### 3. 分布式事务处理

对于跨服务的事务，我们采用了Saga模式：

\`\`\`javascript
// order-saga.js
class OrderSaga {
  constructor() {
    this.steps = []
    this.compensations = []
  }

  async createOrder(orderData) {
    try {
      // 步骤1：创建订单
      const order = await this.orderService.createOrder(orderData)
      this.steps.push('createOrder')
      this.compensations.push(() => this.orderService.cancelOrder(order.id))

      // 步骤2：扣减库存
      await this.productService.decreaseStock(orderData.items)
      this.steps.push('decreaseStock')
      this.compensations.push(() => this.productService.increaseStock(orderData.items))

      // 步骤3：处理支付
      const payment = await this.paymentService.processPayment({
        orderId: order.id,
        amount: order.totalAmount,
        userId: orderData.userId
      })
      this.steps.push('processPayment')
      this.compensations.push(() => this.paymentService.refund(payment.id))

      // 步骤4：发送通知
      await this.notificationService.sendOrderConfirmation({
        userId: orderData.userId,
        orderId: order.id
      })
      this.steps.push('sendNotification')

      return { success: true, order, payment }
    } catch (error) {
      console.error('Order saga failed:', error)
      await this.compensate()
      throw error
    }
  }

  async compensate() {
    console.log('Starting compensation process...')
    
    // 逆序执行补偿操作
    for (let i = this.compensations.length - 1; i >= 0; i--) {
      try {
        await this.compensations[i]()
        console.log(\`Compensated step: \${this.steps[i]}\`)
      } catch (error) {
        console.error(\`Compensation failed for step \${this.steps[i]}:\`, error)
        // 记录补偿失败，可能需要人工介入
      }
    }
  }
}
\`\`\`

## 监控与日志

### 1. 分布式链路追踪

使用Jaeger进行链路追踪：

\`\`\`javascript
// tracing.js
const { initTracer } = require('jaeger-client')
const opentracing = require('opentracing')

const config = {
  serviceName: process.env.SERVICE_NAME || 'unknown-service',
  reporter: {
    logSpans: true,
    agentHost: process.env.JAEGER_AGENT_HOST || 'localhost',
    agentPort: process.env.JAEGER_AGENT_PORT || 6832
  },
  sampler: {
    type: 'const',
    param: 1
  }
}

const tracer = initTracer(config)
opentracing.initGlobalTracer(tracer)

// Express中间件
const tracingMiddleware = (req, res, next) => {
  const span = tracer.startSpan(\`\${req.method} \${req.path}\`)
  span.setTag('http.method', req.method)
  span.setTag('http.url', req.url)
  
  req.span = span
  
  res.on('finish', () => {
    span.setTag('http.status_code', res.statusCode)
    span.finish()
  })
  
  next()
}

module.exports = { tracer, tracingMiddleware }
\`\`\`

### 2. 统一日志管理

使用ELK Stack进行日志收集和分析：

\`\`\`javascript
// logger.js
const winston = require('winston')
const { ElasticsearchTransport } = require('winston-elasticsearch')

const esTransportOpts = {
  level: 'info',
  clientOpts: {
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
  },
  index: \`logs-\${process.env.SERVICE_NAME}-\${new Date().toISOString().slice(0, 7)}\`
}

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: process.env.SERVICE_NAME,
    version: process.env.SERVICE_VERSION,
    environment: process.env.NODE_ENV
  },
  transports: [
    new winston.transports.Console(),
    new ElasticsearchTransport(esTransportOpts)
  ]
})

module.exports = logger
\`\`\`

## 部署与运维

### 1. Docker容器化

每个服务都有独立的Dockerfile：

\`\`\`dockerfile
# Dockerfile
FROM node:16-alpine

WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# 切换到非root用户
USER nodejs

EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "index.js"]
\`\`\`

### 2. Kubernetes部署

使用Kubernetes进行容器编排：

\`\`\`yaml
# user-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  labels:
    app: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: your-registry/user-service:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: user-service-secrets
              key: database-url
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP
\`\`\`

## 迁移过程中的挑战与解决方案

### 1. 数据一致性问题

**挑战**：从单体应用的ACID事务迁移到分布式事务
**解决方案**：
- 采用最终一致性模型
- 使用Saga模式处理分布式事务
- 引入事件溯源记录所有状态变更

### 2. 服务间通信复杂性

**挑战**：网络延迟、服务不可用、数据序列化
**解决方案**：
- 实现熔断器模式
- 使用重试机制和超时控制
- 采用异步消息队列减少同步调用

### 3. 运维复杂度增加

**挑战**：服务数量激增，监控和调试困难
**解决方案**：
- 建立完善的监控体系
- 实现自动化部署和回滚
- 使用容器编排简化运维

## 性能优化成果

迁移完成后，我们获得了显著的性能提升：

- **部署时间**：从30分钟缩短到5分钟
- **系统可用性**：从99.5%提升到99.9%
- **开发效率**：新功能开发周期缩短40%
- **扩容能力**：可以针对特定服务进行水平扩容
- **技术债务**：代码耦合度大幅降低

## 总结与建议

微服务化是一个复杂的系统工程，需要团队在技术、流程、文化等多个层面做好准备：

### 技术准备
1. **容器化技术**：Docker、Kubernetes
2. **服务治理**：服务注册发现、配置管理
3. **监控体系**：日志、指标、链路追踪
4. **自动化工具**：CI/CD、自动化测试

### 组织准备
1. **团队结构调整**：按业务域组织团队
2. **DevOps文化**：开发和运维的深度协作
3. **技能提升**：团队成员需要掌握更多技能

### 迁移建议
1. **渐进式迁移**：不要一次性重写所有服务
2. **从边缘开始**：先迁移依赖较少的服务
3. **保持向后兼容**：确保迁移过程中系统稳定运行
4. **充分测试**：建立完善的测试体系

微服务不是银弹，但在合适的场景下，它确实能够显著提升系统的可扩展性和团队的开发效率。希望我们的经验能够帮助到正在考虑微服务化的团队！

如果你有任何问题或想了解更多细节，欢迎在评论区讨论。`,
    coverImage: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Node.js%20microservices%20architecture%20with%20containers%20and%20kubernetes&image_size=landscape_16_9',
    category: mockCategories[1],
    tags: [mockTags[8], mockTags[26], mockTags[32]],
    author: 'Michael Zhang',
    publishDate: '2024-01-10T09:15:00Z',
    updateDate: '2024-01-11T16:45:00Z',
    readCount: 3245,
    likeCount: 198,
    status: 'published'
  }
]

// Mock数据服务
export const mockDataService = {
  // 获取所有分类
  async getCategories(): Promise<Category[]> {
    // 模拟异步请求
    await new Promise(resolve => setTimeout(resolve, 100))
    return [...mockCategories]
  },

  // 获取所有标签
  async getTags(): Promise<Tag[]> {
    // 模拟异步请求
    await new Promise(resolve => setTimeout(resolve, 100))
    return [...mockTags]
  },

  // 获取所有文章
  async getArticles(): Promise<Article[]> {
    // 模拟异步请求
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...mockArticles]
  },

  // 获取热门标签（按文章数量排序）
  async getPopularTags(limit: number = 10): Promise<Tag[]> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return [...mockTags]
      .sort((a, b) => b.articleCount - a.articleCount)
      .slice(0, limit)
  },

  // 获取分类（按文章数量排序）
  async getCategoriesByPopularity(): Promise<Category[]> {
    await new Promise(resolve => setTimeout(resolve, 100))
    return [...mockCategories]
      .sort((a, b) => b.articleCount - a.articleCount)
  }
}