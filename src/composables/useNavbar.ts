import { ref, computed } from 'vue'

// 全局导航栏状态
const isNavbarCollapsed = ref(false)

export function useNavbar() {
  const toggleNavbarCollapse = () => {
    isNavbarCollapsed.value = !isNavbarCollapsed.value
  }

  // 计算导航栏高度
  const navbarHeight = computed(() => {
    return isNavbarCollapsed.value ? '3rem' : '4rem' // 12 : 16 (48px : 64px)
  })

  // 计算页面顶部间距类名
  const pageTopPadding = computed(() => {
    return isNavbarCollapsed.value ? 'pt-12' : 'pt-16'
  })

  // 计算sticky元素的top值
  const stickyTop = computed(() => {
    return isNavbarCollapsed.value ? 'top-16' : 'top-24' // 64px : 96px (navbar + 32px)
  })

  return {
    isNavbarCollapsed,
    toggleNavbarCollapse,
    navbarHeight,
    pageTopPadding,
    stickyTop
  }
}