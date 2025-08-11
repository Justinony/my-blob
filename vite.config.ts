import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Inspector from 'unplugin-vue-dev-locator/vite'
import traeBadgePlugin from 'vite-plugin-trae-solo-badge'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/my-blob/' : '/',
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // 将Vue相关库分离到单独的chunk
          vue: ['vue', 'vue-router'],
          // 将Element Plus分离到单独的chunk
          'element-plus': ['element-plus'],
          // 将图标库分离到单独的chunk
          icons: ['lucide-vue-next'],
          // 将Supabase分离到单独的chunk
          supabase: ['@supabase/supabase-js'],
          // 将状态管理分离到单独的chunk
          store: ['pinia']
        }
      }
    },
    // 增加chunk大小警告限制
    chunkSizeWarningLimit: 1000
  },
  plugins: [
    vue(),
    Inspector(),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#app',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ✅ 定义 @ = src
    },
  },
})
