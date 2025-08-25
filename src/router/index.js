import { createRouter, createWebHistory } from 'vue-router'
import WardrobeView from '../views/WardrobeView.vue'
import WeatherView from '../views/WeatherView.vue'
import CustomView from '../views/CustomView.vue'
import StatsView from '../views/StatsView.vue'
import UploadView from '../views/UploadView.vue'

const routes = [
  {
    path: '/',
    name: 'wardrobe',
    component: WardrobeView
  },
  {
    path: '/weather',
    name: 'weather',
    component: WeatherView
  },
  {
    path: '/custom',
    name: 'custom',
    component: CustomView
  },
  {
    path: '/stats',
    name: 'stats',
    component: StatsView
  },
  {
    path: '/upload',
    name: 'upload',
    component: UploadView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
