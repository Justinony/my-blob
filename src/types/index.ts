// 博客系统数据类型定义

export interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  publishDate: string
  updateDate: string
  status: 'draft' | 'published'
  tags: Tag[]
  category: Category
  readCount: number
  likeCount: number
  coverImage?: string
}

export interface Category {
  id: string
  name: string
  description: string
  articleCount: number
  color: string
}

export interface Tag {
  id: string
  name: string
  color: string
  articleCount: number
}

export interface Comment {
  id: string
  articleId: string
  author: string
  content: string
  createdAt: string
  parentId?: string
  replies?: Comment[]
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  bio: string
  role: 'admin' | 'user'
  socialLinks: {
    github?: string
    twitter?: string
    linkedin?: string
  }
}

export interface UserProfile extends User {
  additionalInfo?: {
    github?: string
    twitter?: string
    linkedin?: string
    email?: string
  }
}

export interface SearchResult {
  articles: Article[]
  total: number
  query: string
}

export interface BlogConfig {
  siteName: string
  siteDescription: string
  author: User
  theme: 'light' | 'dark'
  language: string
}