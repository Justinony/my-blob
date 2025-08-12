import { ref, computed } from 'vue'

type Language = 'zh' | 'en'

interface Translations {
  [key: string]: {
    zh: string
    en: string
  }
}

const translations: Translations = {
  // 导航栏
  home: { zh: '首页', en: 'Home' },
  articles: { zh: '文章', en: 'Articles' },
  about: { zh: '关于', en: 'About' },
  admin: { zh: '管理后台', en: 'Admin Panel' },
  search: { zh: '搜索文章...', en: 'Search articles...' },
  login: { zh: '登录', en: 'Login' },
  logout: { zh: '退出登录', en: 'Logout' },
  profile: { zh: '个人资料', en: 'Profile' },
  menu: { zh: '导航菜单', en: 'Navigation Menu' },
  userActions: { zh: '用户操作', en: 'User Actions' },
  
  // 首页
  heroTitle: { zh: '欢迎来到我的技术博客', en: 'Welcome to My Tech Blog' },
  heroSubtitle: { zh: '分享前端开发经验与技术洞察', en: 'Sharing Frontend Development Experience & Tech Insights' },
  latestArticles: { zh: '最新文章', en: 'Latest Articles' },
  readMore: { zh: '阅读更多', en: 'Read More' },
  noArticles: { zh: '暂无文章', en: 'No articles yet' },
  
  // 侧边栏
  categories: { zh: '分类', en: 'Categories' },
  tags: { zh: '标签', en: 'Tags' },
  recentPosts: { zh: '最近文章', en: 'Recent Posts' },
  
  // 文章
  publishedAt: { zh: '发布于', en: 'Published at' },
  author: { zh: '作者', en: 'Author' },
  category: { zh: '分类', en: 'Category' },
  
  // 管理页面
  dashboard: { zh: '仪表板', en: 'Dashboard' },
  articleManagement: { zh: '文章管理', en: 'Article Management' },
  categoryManagement: { zh: '分类管理', en: 'Category Management' },
  tagManagement: { zh: '标签管理', en: 'Tag Management' },
  
  // 认证
  loginTitle: { zh: '登录', en: 'Login' },
  registerTitle: { zh: '注册', en: 'Register' },
  email: { zh: '邮箱', en: 'Email' },
  password: { zh: '密码', en: 'Password' },
  confirmPassword: { zh: '确认密码', en: 'Confirm Password' },
  rememberMe: { zh: '记住我', en: 'Remember Me' },
  
  // 通用
  loading: { zh: '加载中...', en: 'Loading...' },
  error: { zh: '错误', en: 'Error' },
  success: { zh: '成功', en: 'Success' },
  cancel: { zh: '取消', en: 'Cancel' },
  confirm: { zh: '确认', en: 'Confirm' },
  save: { zh: '保存', en: 'Save' },
  edit: { zh: '编辑', en: 'Edit' },
  delete: { zh: '删除', en: 'Delete' },
  create: { zh: '创建', en: 'Create' },
  update: { zh: '更新', en: 'Update' },
}

const currentLanguage = ref<Language>('zh')

export const useI18n = () => {
  const setLanguage = (lang: Language) => {
    currentLanguage.value = lang
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    const translation = translations[key]
    if (!translation) {
      console.warn(`Translation key "${key}" not found`)
      return key
    }
    return translation[currentLanguage.value] || translation.zh || key
  }

  const language = computed(() => currentLanguage.value)

  // 初始化语言设置
  const initLanguage = () => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && ['zh', 'en'].includes(savedLanguage)) {
      currentLanguage.value = savedLanguage
    }
  }

  return {
    language,
    setLanguage,
    t,
    initLanguage
  }
}