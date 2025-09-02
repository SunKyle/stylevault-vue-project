import { createRouter, createWebHistory } from 'vue-router';
import WardrobeView from '../views/WardrobeView.vue';
import WeatherView from '../views/WeatherView.vue';
import InspirationView from '../views/InspirationView.vue';
import AnalysisView from '../views/AnalysisView.vue';
import UploadView from '../views/UploadView.vue';
import LoginPage from '../views/LoginPage.vue';

const routes = [
  {
    path: '/',
    name: 'wardrobe',
    component: WardrobeView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: {
      title: '登录',
      breadcrumb: '登录',
    },
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

export default router;
