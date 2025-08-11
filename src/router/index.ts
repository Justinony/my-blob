import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import ArticleDetail from '@/pages/ArticleDetail.vue'
import ArticleManage from '@/pages/ArticleManage.vue'
import CategoryManage from '@/pages/CategoryManage.vue'
import TagManage from '@/pages/TagManage.vue'
import SearchResults from '@/pages/SearchResults.vue'
import AboutPage from '@/pages/AboutPage.vue'
import AdminPage from '@/pages/AdminPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
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
      component: ArticleManage
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoryManage
    },
    {
      path: '/category/:id',
      name: 'category-detail',
      component: () => import('@/pages/CategoryDetail.vue')
    },
    {
      path: '/tags',
      name: 'tags',
      component: TagManage
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
      component: AdminPage
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound
    }
  ]
})

export default router
