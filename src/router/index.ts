import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: () => import('../views/wallet/index.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  console.log('➡️ 正在跳转到：', to.fullPath)
  console.log('📌 路径参数：', to.params)
  console.log('🔍 查询参数：', to.query)
  next()
})
export default router
