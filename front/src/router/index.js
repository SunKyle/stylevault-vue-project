import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store.js';
import WardrobeView from '../views/WardrobeView.vue';
import WeatherView from '../views/WeatherView.vue';
import InspirationView from '../views/InspirationView.vue';
import AnalysisView from '../views/AnalysisView.vue';
import UploadView from '../views/UploadView.vue';
import LoginPage from '../views/LoginPage.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage,
    meta: {
      title: '登录',
      breadcrumb: '登录',
    },
  },
  {
    path: '/wardrobe',
    name: 'wardrobe',
    component: WardrobeView,
  },
  {
    path: '/weather',
    name: 'weather',
    component: WeatherView,
  },
  {
    path: '/custom',
    name: 'custom',
    component: InspirationView,
  },
  {
    path: '/stats',
    name: 'stats',
    component: AnalysisView,
  },
  {
    path: '/upload',
    name: 'upload',
    component: UploadView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // 定义公开路由（不需要认证）
  const publicRoutes = ['/', 'login'];
  const isPublicRoute = publicRoutes.includes(to.name) || to.path === '/';
  
  if (!isPublicRoute && !authStore.isAuthenticated) {
    // 需要认证但未登录，重定向到登录页
    next({
      path: '/',
      query: { redirect: to.fullPath },
    });
  } else if (isPublicRoute && authStore.isAuthenticated) {
    // 已登录用户访问登录页，重定向到衣橱页面
    next('/wardrobe');
  } else {
    // 其他情况正常放行
    next();
  }
});

export default router;
