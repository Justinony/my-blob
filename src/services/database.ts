import { supabase } from '../lib/supabase'
import type { Article, Category, Tag, User, Comment } from '../types'
import type { Database } from '../types/database'

type ArticleRow = Database['public']['Tables']['articles']['Row']
type CategoryRow = Database['public']['Tables']['categories']['Row']
type TagRow = Database['public']['Tables']['tags']['Row']
type UserRow = Database['public']['Tables']['users']['Row']
type CommentRow = Database['public']['Tables']['comments']['Row']

// Check if Supabase is available
const isSupabaseAvailable = supabase !== null

// 转换数据库行为应用类型
function transformArticle(row: ArticleRow & { category?: CategoryRow; tags?: TagRow[]; author?: UserRow }): Article {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image || '',
    category: row.category ? {
      id: row.category.id,
      name: row.category.name,
      description: row.category.description || '',
      color: row.category.color,
      articleCount: (row.category as any).article_count || 0
    } : { id: '', name: '', description: '', color: '', articleCount: 0 },
    tags: row.tags?.map(tag => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
      articleCount: (tag as any).article_count || 0
    })) || [],
    author: row.author?.name || 'Unknown',
    publishDate: row.published_at || row.created_at,
    updateDate: row.updated_at,
    readCount: row.read_count,
    likeCount: row.like_count,
    status: row.status
  }
}

function transformCategory(row: CategoryRow & { article_count?: number }): Category {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    color: row.color,
    articleCount: row.article_count || 0
  }
}

function transformTag(row: TagRow & { article_count?: number }): Tag {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    articleCount: row.article_count || 0
  }
}

function transformUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar || '',
    bio: row.bio || '',
    role: row.role,
    socialLinks: {
      github: (row as any).github_url || '',
      twitter: (row as any).twitter_url || '',
      linkedin: (row as any).linkedin_url || ''
    }
  }
}

function transformComment(row: CommentRow & { author?: UserRow }): Comment {
  return {
    id: row.id,
    articleId: row.article_id,
    author: row.author?.name || 'Unknown',
    content: row.content,
    createdAt: row.created_at,
    parentId: row.parent_id
  }
}

// 文章服务
export const articleService = {
  async getAll() {
    if (!isSupabaseAvailable) {
      throw new Error('Supabase not configured')
    }
    
    const { data, error } = await supabase!
      .from('articles')
      .select(`
        *,
        category:categories(*),
        tags:article_tags(tag:tags(*)),
        author:users(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data?.map(row => transformArticle({
      ...row,
      tags: row.tags?.map(t => t.tag).filter(Boolean) || []
    })) || []
  },

  async getById(id: string) {
    if (!isSupabaseAvailable) {
      throw new Error('Supabase not configured')
    }
    
    const { data, error } = await supabase!
      .from('articles')
      .select(`
        *,
        category:categories(*),
        tags:article_tags(tag:tags(*)),
        author:users(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) return null

    return transformArticle({
      ...data,
      tags: data.tags?.map(t => t.tag).filter(Boolean) || []
    })
  },

  async getPublished() {
    if (!isSupabaseAvailable) {
      throw new Error('Supabase not configured')
    }
    
    const { data, error } = await supabase!
      .from('articles')
      .select(`
        *,
        category:categories(*),
        tags:article_tags(tag:tags(*)),
        author:users(*)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) throw error
    return data?.map(row => transformArticle({
      ...row,
      tags: row.tags?.map(t => t.tag).filter(Boolean) || []
    })) || []
  },

  async create(article: Omit<Article, 'id' | 'publishDate' | 'updateDate' | 'readCount' | 'likeCount'>) {
    if (!isSupabaseAvailable) {
      throw new Error('Supabase not configured')
    }
    
    const categoryId = typeof article.category === 'string' ? article.category : (article.category as any)?.id || article.category
    
    const { data, error } = await supabase!
      .from('articles')
      .insert({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        cover_image: article.coverImage,
        category_id: categoryId,
        author_id: '00000000-0000-0000-0000-000000000001', // 使用默认管理员ID
        status: article.status,
        published_at: article.status === 'published' ? new Date().toISOString() : null
      })
      .select()
      .single()

    if (error) throw error
    
    // 添加标签关联
    if (article.tags && article.tags.length > 0) {
      const tagRelations = article.tags.map(tag => ({
        article_id: data.id,
        tag_id: typeof tag === 'string' ? tag : (tag as any)?.id || tag
      }))
      
      await supabase!.from('article_tags').insert(tagRelations)
    }

    return data.id
  },

  async update(id: string, article: Partial<Article>) {
    if (!isSupabaseAvailable) {
      throw new Error('Supabase not configured')
    }
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (article.title) updateData.title = article.title
    if (article.excerpt) updateData.excerpt = article.excerpt
    if (article.content) updateData.content = article.content
    if (article.coverImage !== undefined) updateData.cover_image = article.coverImage
    if (article.category) {
      updateData.category_id = typeof article.category === 'string' ? article.category : (article.category as any)?.id || article.category
    }
    if (article.status) {
      updateData.status = article.status
      if (article.status === 'published') {
        updateData.published_at = new Date().toISOString()
      }
    }

    const { error } = await supabase!
      .from('articles')
      .update(updateData)
      .eq('id', id)

    if (error) throw error

    // 更新标签关联
    if (article.tags) {
      // 删除现有关联
      await supabase!.from('article_tags').delete().eq('article_id', id)
      
      // 添加新关联
      if (article.tags.length > 0) {
        const tagRelations = article.tags.map(tag => ({
          article_id: id,
          tag_id: typeof tag === 'string' ? tag : (tag as any)?.id || tag
        }))
        
        await supabase!.from('article_tags').insert(tagRelations)
      }
    }
  },

  async delete(id: string) {
    if (!isSupabaseAvailable) {
      throw new Error('Supabase not configured')
    }
    
    // 删除标签关联
    await supabase!.from('article_tags').delete().eq('article_id', id)
    
    // 删除文章
    const { error } = await supabase!
      .from('articles')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async incrementReadCount(id: string) {
    if (!isSupabaseAvailable) {
      throw new Error('Supabase not configured')
    }
    
    const { error } = await supabase!
      .rpc('increment_read_count', { article_id: id })

    if (error) {
      // 如果RPC函数不存在，使用普通更新
      const { data } = await supabase!
        .from('articles')
        .select('read_count')
        .eq('id', id)
        .single()
      
      if (data) {
        await supabase!
          .from('articles')
          .update({ read_count: data.read_count + 1 })
          .eq('id', id)
      }
    }
  },

  async toggleLike(id: string) {
    if (!isSupabaseAvailable) {
      throw new Error('Supabase not configured')
    }
    
    const { data } = await supabase!
      .from('articles')
      .select('like_count')
      .eq('id', id)
      .single()
    
    if (data) {
      await supabase!
        .from('articles')
        .update({ like_count: data.like_count + 1 })
        .eq('id', id)
    }
  },

  async search(query: string) {
    if (!isSupabaseAvailable) {
      throw new Error('Supabase not configured')
    }
    
    const { data, error } = await supabase!
      .from('articles')
      .select(`
        *,
        category:categories(*),
        tags:article_tags(tag:tags(*)),
        author:users(*)
      `)
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data?.map(row => transformArticle({
      ...row,
      tags: row.tags?.map(t => t.tag).filter(Boolean) || []
    })) || []
  }
}

// 分类服务
export const categoryService = {
  async getAll(): Promise<Category[]> {
    if (!isSupabaseAvailable) {
      throw new Error('Supabase not configured')
    }
    
    const { data, error } = await supabase!
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data?.map(transformCategory) || []
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data ? transformCategory(data) : null
  },

  async create(category: Omit<Category, 'id'>) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single()

    if (error) throw error
    return data.id
  },

  async update(id: string, category: Partial<Category>) {
    const { error } = await supabase
      .from('categories')
      .update({ ...category, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// 标签服务
export const tagService = {
  async getAll(): Promise<Tag[]> {
    if (!isSupabaseAvailable) {
      throw new Error('Supabase not configured')
    }
    
    const { data, error } = await supabase!
      .from('tags')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data?.map(transformTag) || []
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data ? transformTag(data) : null
  },

  async create(tag: Omit<Tag, 'id'>) {
    const { data, error } = await supabase
      .from('tags')
      .insert(tag)
      .select()
      .single()

    if (error) throw error
    return data.id
  },

  async update(id: string, tag: Partial<Tag>) {
    const { error } = await supabase
      .from('tags')
      .update({ ...tag, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// 用户服务
export const userService = {
  async getById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data ? transformUser(data) : null
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    return this.getById(user.id)
  }
}

// 评论服务
export const commentService = {
  async getByArticleId(articleId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:users(*)
      `)
      .eq('article_id', articleId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data?.map(transformComment) || []
  },

  async create(comment: Omit<Comment, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        article_id: comment.articleId,
        author_id: '00000000-0000-0000-0000-000000000001', // 使用默认管理员ID
        content: comment.content,
        parent_id: comment.parentId
      })
      .select()
      .single()

    if (error) throw error
    return data.id
  }
}