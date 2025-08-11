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

// 示例文章数据
export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Vue 3 Composition API 深度解析',
    excerpt: '深入理解Vue 3 Composition API的设计理念和最佳实践，提升开发效率。',
    content: '# Vue 3 Composition API 深度解析\n\n本文将深入探讨Vue 3 Composition API的核心概念...',
    coverImage: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Vue.js%20logo%20with%20modern%20code%20background&image_size=landscape_16_9',
    category: mockCategories[0],
    tags: [mockTags[0], mockTags[2], mockTags[3]],
    author: '前端架构师',
    publishDate: '2024-01-15T10:00:00Z',
    updateDate: '2024-01-15T10:00:00Z',
    readCount: 1250,
    likeCount: 89,
    status: 'published'
  },
  {
    id: '2',
    title: 'TypeScript 高级类型系统实战',
    excerpt: '掌握TypeScript高级类型系统，编写更安全、更优雅的代码。',
    content: '# TypeScript 高级类型系统实战\n\n类型系统是TypeScript的核心优势...',
    coverImage: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=TypeScript%20logo%20with%20code%20editor%20interface&image_size=landscape_16_9',
    category: mockCategories[0],
    tags: [mockTags[2], mockTags[3]],
    author: '前端架构师',
    publishDate: '2024-01-12T14:30:00Z',
    updateDate: '2024-01-12T14:30:00Z',
    readCount: 980,
    likeCount: 67,
    status: 'published'
  },
  {
    id: '3',
    title: 'Node.js 微服务架构设计',
    excerpt: '基于Node.js构建高可用微服务架构，实现系统的可扩展性和可维护性。',
    content: '# Node.js 微服务架构设计\n\n微服务架构已成为现代应用开发的主流模式...',
    coverImage: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Node.js%20microservices%20architecture%20diagram&image_size=landscape_16_9',
    category: mockCategories[1],
    tags: [mockTags[8], mockTags[32], mockTags[26]],
    author: '后端工程师',
    publishDate: '2024-01-10T09:15:00Z',
    updateDate: '2024-01-10T09:15:00Z',
    readCount: 1456,
    likeCount: 112,
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