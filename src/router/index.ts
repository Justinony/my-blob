import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import HomePage from '@/pages/HomePage.vue'
import ArticleDetail from '@/pages/ArticleDetail.vue'
import ArticleManage from '@/pages/ArticleManage.vue'
import CategoryManage from '@/pages/CategoryManage.vue'
import TagManage from '@/pages/TagManage.vue'
import SearchResults from '@/pages/SearchResults.vue'
import AboutPage from '@/pages/AboutPage.vue'
import AdminPage from '@/pages/AdminPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import Auth from '@/pages/Auth.vue'
import NotFound from '@/pages/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/article/:id',
      name: 'article-detail',
      component: ArticleDetail
    },
    {
      path: '/articles',
      name: 'articles',
      component: ArticleManage,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoryManage,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/category/:id',
      name: 'category-detail',
      component: () => import('@/pages/CategoryDetail.vue')
    },
    {
      path: '/tags',
      name: 'tags',
      component: TagManage,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/tag/:id',
      name: 'tag-detail',
      component: () => import('@/pages/TagDetail.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: SearchResults
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPage,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Auth
    },
    {
      path: '/register',
      name: 'register',
      component: Auth
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    if (!userStore.isAuthenticated) {
      // 未登录，重定向到登录页面
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    // 检查是否需要管理员权限
    if (to.meta.requiresAdmin) {
      if (!userStore.isAdmin) {
        // 不是管理员，重定向到首页
        next({ name: 'home' })
        return
      }
    }
  }
  
  // 如果已登录用户访问登录/注册页面，重定向到首页
  if ((to.name === 'login' || to.name === 'register') && userStore.isAuthenticated) {
    next({ name: 'home' })
    return
  }
  
  next()
})

export default router
