import { defineStore } from 'pinia'
import type { Article, Category, Tag, User, BlogConfig } from '../types'
import { articleService, categoryService, tagService, userService } from '../services/database'
import { mockDataService } from '../services/mockData'

export const useBlogStore = defineStore('blog', {
  state: () => ({
    articles: [] as Article[],
    categories: [] as Category[],
    tags: [] as Tag[],
    user: {
      id: '1',
      name: '管理员',
      email: 'admin@example.com',
      avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20avatar%20portrait%20of%20a%20friendly%20developer%20with%20modern%20style&image_size=square',
      bio: '博客管理员',
      role: 'admin',
      socialLinks: {
        github: 'https://github.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as User,
    config: {
      siteName: '前端架构师的技术博客',
      siteDescription: '分享现代前端开发技术与最佳实践',
      author: null,
      theme: 'light',
      language: 'zh-CN'
    } as BlogConfig,
    loading: false,
    searchQuery: ''
  }),

  getters: {
    publishedArticles: (state) => 
      state.articles.filter(article => article.status === 'published'),
    
    draftArticles: (state) => 
      state.articles.filter(article => article.status === 'draft'),
    
    getArticleById: (state) => (id: string) => 
      state.articles.find(article => article.id === id),
    
    getArticlesByCategory: (state) => (categoryId: string) => 
      state.articles.filter(article => article.category.id === categoryId && article.status === 'published'),
    
    getArticlesByTag: (state) => (tagName: string) => 
      state.articles.filter(article => 
        article.tags.some(tag => tag.name === tagName) && article.status === 'published'
      ),
    
    searchArticles: (state) => (query: string) => {
      if (!query.trim()) return state.articles.filter(article => article.status === 'published')
      
      const lowercaseQuery = query.toLowerCase()
      return state.articles.filter(article => 
        article.status === 'published' && (
          article.title.toLowerCase().includes(lowercaseQuery) ||
          article.content.toLowerCase().includes(lowercaseQuery) ||
          article.tags.some(tag => tag.name.toLowerCase().includes(lowercaseQuery))
        )
      )
    },
    
    popularArticles: (state) => 
      [...state.articles]
        .filter(article => article.status === 'published')
        .sort((a, b) => b.readCount - a.readCount)
        .slice(0, 5),
    
    recentArticles: (state) => 
      [...state.articles]
        .filter(article => article.status === 'published')
        .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
        .slice(0, 5),
    
    // 统计数据
    stats: (state) => {
      const publishedArticles = state.articles.filter(article => article.status === 'published')
      return {
        totalArticles: publishedArticles.length,
        totalViews: publishedArticles.reduce((sum, article) => sum + article.readCount, 0),
        totalLikes: publishedArticles.reduce((sum, article) => sum + article.likeCount, 0),
        totalCategories: state.categories.length,
        totalTags: state.tags.length
      }
    }
  },

  actions: {
    // 获取文章列表
    async fetchArticles() {
      try {
        this.loading = true
        this.articles = await articleService.getAll()
      } catch (error) {
        console.error('Failed to fetch articles:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 获取分类列表
    async fetchCategories() {
      try {
        // 优先使用mock数据，如果失败则尝试数据库
        this.categories = await mockDataService.getCategories()
      } catch (error) {
        console.error('Failed to fetch categories from mock data, trying database:', error)
        try {
          this.categories = await categoryService.getAll()
        } catch (dbError) {
          console.error('Failed to fetch categories from database:', dbError)
        }
      }
    },

    // 获取标签列表
    async fetchTags() {
      try {
        // 优先使用mock数据，如果失败则尝试数据库
        this.tags = await mockDataService.getTags()
      } catch (error) {
        console.error('Failed to fetch tags from mock data, trying database:', error)
        try {
          this.tags = await tagService.getAll()
        } catch (dbError) {
          console.error('Failed to fetch tags from database:', dbError)
        }
      }
    },

    // 创建文章
    async createArticle(article: Omit<Article, 'id' | 'publishDate' | 'updateDate' | 'readCount' | 'likeCount'>) {
      try {
        const id = await articleService.create(article)
        await this.fetchArticles() // 重新获取文章列表
        return id
      } catch (error) {
        console.error('Failed to create article:', error)
        throw error
      }
    },

    // 更新文章
    async updateArticle(id: string, updates: Partial<Article>) {
      try {
        await articleService.update(id, updates)
        await this.fetchArticles() // 重新获取文章列表
      } catch (error) {
        console.error('Failed to update article:', error)
        throw error
      }
    },

    // 删除文章
    async deleteArticle(id: string) {
      try {
        await articleService.delete(id)
        await this.fetchArticles() // 重新获取文章列表
        return true
      } catch (error) {
        console.error('Failed to delete article:', error)
        throw error
      }
    },

    // 创建分类
    async createCategory(category: Omit<Category, 'id'>) {
      try {
        const id = await categoryService.create(category)
        await this.fetchCategories()
        return id
      } catch (error) {
        console.error('Failed to create category:', error)
        throw error
      }
    },

    // 更新分类
    async updateCategory(id: string, updates: Partial<Category>) {
      try {
        await categoryService.update(id, updates)
        await this.fetchCategories()
      } catch (error) {
        console.error('Failed to update category:', error)
        throw error
      }
    },

    // 删除分类
    async deleteCategory(id: string) {
      try {
        await categoryService.delete(id)
        await this.fetchCategories()
      } catch (error) {
        console.error('Failed to delete category:', error)
        throw error
      }
    },

    // 创建标签
    async createTag(tag: Omit<Tag, 'id'>) {
      try {
        const id = await tagService.create(tag)
        await this.fetchTags()
        return id
      } catch (error) {
        console.error('Failed to create tag:', error)
        throw error
      }
    },

    // 更新标签
    async updateTag(id: string, updates: Partial<Tag>) {
      try {
        await tagService.update(id, updates)
        await this.fetchTags()
      } catch (error) {
        console.error('Failed to update tag:', error)
        throw error
      }
    },

    // 删除标签
    async deleteTag(id: string) {
      try {
        await tagService.delete(id)
        await this.fetchTags()
      } catch (error) {
        console.error('Failed to delete tag:', error)
        throw error
      }
    },

    // 增加阅读量
    async incrementReadCount(id: string) {
      try {
        await articleService.incrementReadCount(id)
        // 更新本地状态
        const article = this.articles.find(a => a.id === id)
        if (article) {
          article.readCount++
        }
      } catch (error) {
        console.error('Failed to increment read count:', error)
        throw error
      }
    },

    // 切换点赞
    async toggleLike(id: string) {
      try {
        await articleService.toggleLike(id)
        // 更新本地状态
        const article = this.articles.find(a => a.id === id)
        if (article) {
          article.likeCount++
        }
      } catch (error) {
        console.error('Failed to toggle like:', error)
        throw error
      }
    },

    // 设置搜索查询
    setSearchQuery(query: string) {
      this.searchQuery = query
    }
  }
})