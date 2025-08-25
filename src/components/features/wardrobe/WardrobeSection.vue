<template>
<section :key="forceUpdateKey">


  <!-- 搜索和上传区 -->
  <div class="relative overflow-hidden mb-8">
    <div class="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 transform skew-y-3"></div>
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGciPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTMwIDM1Yy01IDAtOS00LTktOXMtNC05IDktOSA5IDQgOSA5LTQgOSA5IDkgOSA0IDkgOS00IDktOXptMCAxNWMtMTIuMSAwLTIyLTEwLTEyLjEtMjJzMTAtMjIgMjItMTAgMjIgMTAgMTAgMjItMjIgMTJ6bTAtMzRjLTExIDAtMjAgOS0yMCAyMHM5IDIwIDIwIDIwIDIwLTkgMjAtMjAtOS0yMC0yMC0yMHptLTMwIDIwYzAtMTYuNiAxMy40LTMwIDMwLTMwczMwIDEzLjQgMzAgMzAtMTMuNCAzMC0zMCAzMCIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
    <div class="container mx-auto px-4 py-12 md:py-20 relative z-10">
      <div class="max-w-2xl">
        <h2 class="text-[clamp(1.8rem,4vw,3rem)] font-bold text-white leading-tight mb-3">打造你的专属衣橱</h2>
        <p class="text-white/90 text-balance text-[clamp(1rem,1.5vw,1.1rem)] mb-8 max-w-xl">智能管理衣物，轻松搭配，展现独特风格，让每一天都充满时尚感</p>
        <div class="relative mb-6 group">
          <div class="absolute inset-0 bg-white/20 rounded-2xl blur-md transform scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          <input
            type="text"
            placeholder="搜索衣物、风格或场合..."
            class="w-full py-4 px-6 pr-14 rounded-2xl shadow-medium focus:outline-none focus:ring-2 focus:ring-white/30 transition-all bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/60 text-base"
            v-model="searchKeyword"
            @keyup.enter="handleSearch"
          >
          <font-awesome-icon :icon="['fas', 'search']" class="absolute right-5 top-1/2 -translate-y-1/2 text-white/70 group-hover:text-white transition-colors text-lg" />
        </div>
        <div class="flex flex-wrap gap-4">
          <button class="bg-white text-primary hover:bg-neutral-100 font-medium py-3 px-8 rounded-2xl shadow-medium transition-all flex items-center space-x-2 group" @click="$emit('showUpload')">
            <font-awesome-icon :icon="['fas', 'plus-circle']" class="group-hover:scale-110 transition-transform" />
            <span>添加新衣物</span>
          </button>
          <button class="bg-white/10 hover:bg-white/20 backdrop-blur text-white font-medium py-3 px-8 rounded-2xl shadow-medium transition-all flex items-center space-x-2">
            <font-awesome-icon :icon="['fas', 'magic']" />
            <span>智能搭配</span>
          </button>
        </div>
      </div>
    </div>
    <div class="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full"></div>
    <div class="absolute top-1/3 right-1/4 w-32 h-32 bg-white/5 rounded-full"></div>
  </div>



  <!-- 加载状态 -->
  <div v-if="loading" class="container mx-auto px-4 mb-12">
    <div class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  </div>

  <!-- 错误状态 -->
  <div v-else-if="error" class="container mx-auto px-4 mb-12">
    <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="text-red-500 text-3xl mb-3" />
      <h3 class="text-lg font-medium text-red-800 mb-2">加载失败</h3>
      <p class="text-red-600 mb-4">{{ error }}</p>
      <button @click="initializeData" class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
        重试
      </button>
    </div>
  </div>

  <!-- 衣物分类 -->
  <div v-else class="container mx-auto px-4 mb-12">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl md:text-2xl font-bold">衣物分类</h3>
      <a href="#" @click.prevent="viewAllCategories" class="text-primary font-medium flex items-center group">
        <span>查看全部</span>
        <font-awesome-icon :icon="['fas', 'arrow-right']" class="ml-1 text-sm group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
    <div class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
      <ClothingCategory
        v-for="category in categories"
        :key="category.id"
        :category="category"
        :count="getCategoryItemCount(category.id)"
        @click="selectCategory(category.id)"
        :selected="selectedCategory === category.id"
      />
    </div>
  </div>

  <!-- 我的收藏 -->
  <FavoriteSection />

  <!-- 精选搭配 -->
  <div v-if="!loading && !error" class="container mx-auto px-4 mb-12">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl md:text-2xl font-bold">精选搭配</h3>
      <div class="flex space-x-2">
        <button
          @click="prevOutfit"
          :disabled="outfitIndex === 0"
          class="w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <font-awesome-icon :icon="['fas', 'chevron-left']" class="text-neutral-600 text-xs" />
        </button>
        <button
          @click="nextOutfit"
          :disabled="outfitIndex >= outfits.length - 3"
          class="w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-neutral-600 text-xs" />
        </button>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <OutfitCard
        v-for="outfit in displayedOutfits"
        :key="outfit.title"
        :outfit="outfit"
      />
    </div>
  </div>




    <div v-if="getCategoryItems(selectedCategory).length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      <ClothingItem
        v-for="item in getCategoryItems(selectedCategory)"
        :key="item.id"
        :item="item"
        @like="toggleFavorite(item)"
        class="transform transition-transform hover:scale-105"
      />
    </div>


  <!-- 最近添加的衣物 -->
  <div v-if="!loading && !error && !selectedCategory" class="container mx-auto px-4">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl md:text-2xl font-bold">最近添加</h3>
      <a href="#" class="text-primary font-medium flex items-center group">
        <span>管理所有衣物</span>
        <font-awesome-icon :icon="['fas', 'arrow-right']" class="ml-1 text-sm group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
    <div class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-5">
      <ClothingItem
        v-for="item in recentlyAddedItems"
        :key="item.id"
        :item="item"
        @like="toggleFavorite(item)"
      />
      <!-- 添加更多 -->
      <div class="group relative">
        <div class="aspect-square bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 mb-3 border-2 border-dashed border-neutral-200 flex items-center justify-center">
          <div class="text-center p-6 group-hover:scale-110 transition-transform">
            <div class="w-14 h-14 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-3">
              <font-awesome-icon :icon="['fas', 'plus']" class="text-neutral-400 text-xl" />
            </div>
            <p class="text-neutral-500 font-medium">添加更多衣物</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 分类结果展示 - 全屏覆盖层 -->
  <transition name="fade">
    <div v-if="isDrawerOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="closeDrawer"></div>
  </transition>

  <!-- 分类结果展示 - 优雅卡片 -->
  <transition
    enter-active-class="animated slide-up-enter-active"
    leave-active-class="animated slide-up-leave-active"
    enter-from-class="slide-up-enter-from"
    enter-to-class="slide-up-enter-to"
    leave-from-class="slide-up-leave-from"
    leave-to-class="slide-up-leave-to"
    @before-enter="beforeEnter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @after-leave="afterLeave">
    <div v-if="isDrawerOpen" class="fixed inset-x-4 bottom-4 top-20 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col transform origin-bottom">
      <!-- 顶部导航栏 -->
      <div class="bg-gradient-to-r from-primary to-secondary p-5 text-white">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <font-awesome-icon :icon="isSearchMode ? ['fas', 'search'] : ['fas', 'tag']" />
            </div>
            <div>
              <h2 class="text-xl font-bold">{{ getSelectedCategoryName() }}</h2>
              <p class="text-white/80 text-sm">{{ getCategoryItemCount(selectedCategory) }} 件衣物</p>
            </div>
          </div>
          <button @click="closeDrawer" class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>

        <!-- 筛选和排序栏 -->
        <div class="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide">
          <button class="px-4 py-2 bg-white/20 rounded-full text-sm whitespace-nowrap flex items-center space-x-1 hover:bg-white/30 transition-colors">
            <font-awesome-icon :icon="['fas', 'filter']" class="text-xs" />
            <span>全部</span>
          </button>
          <button class="px-4 py-2 bg-white/10 rounded-full text-sm whitespace-nowrap flex items-center space-x-1 hover:bg-white/20 transition-colors">
            <font-awesome-icon :icon="['fas', 'heart']" class="text-xs" />
            <span>收藏</span>
          </button>
          <button class="px-4 py-2 bg-white/10 rounded-full text-sm whitespace-nowrap flex items-center space-x-1 hover:bg-white/20 transition-colors">
            <font-awesome-icon :icon="['fas', 'clock']" class="text-xs" />
            <span>最近添加</span>
          </button>
          <button class="px-4 py-2 bg-white/10 rounded-full text-sm whitespace-nowrap flex items-center space-x-1 hover:bg-white/20 transition-colors">
            <font-awesome-icon :icon="['fas', 'sort-alpha-down']" class="text-xs" />
            <span>名称</span>
          </button>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="flex-1 overflow-y-auto p-4 bg-gray-50">
        <!-- 有衣物时的展示 -->
        <div v-if="getCategoryItems(selectedCategory).length > 0" class="space-y-6">
          <!-- 网格视图 -->
          <transition-group name="staggered-fade" tag="div" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div
              v-for="(item, index) in getCategoryItems(selectedCategory)"
              :key="item.id"
              class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
              @click="viewItemDetail(item)"
              :style="{ 'transition-delay': `${index * 50}ms` }"
            >
              <div class="aspect-square overflow-hidden relative">
                <div class="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 z-10"></div>
                <img
                  :src="item.image || `https://picsum.photos/seed/${item.id}/300/300`"
                  :alt="item.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                >
                <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <button
                    @click.stop="toggleFavorite(item)"
                    class="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110"
                  >
                    <font-awesome-icon
                      :icon="['fas', 'heart']"
                      :class="[item.favorite ? 'text-red-500 animate-pulse' : 'text-gray-400']"
                    />
                  </button>
                </div>
                <div v-if="item.favorite" class="absolute top-2 left-2 animate-bounce-in">
                  <div class="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-md">
                    <font-awesome-icon :icon="['fas', 'heart']" class="text-white text-sm" />
                  </div>
                </div>
              </div>
              <div class="p-3 bg-gradient-to-b from-white to-gray-50">
                <h3 class="font-medium text-gray-900 truncate">{{ item.name }}</h3>
                <div class="flex justify-between items-center mt-1">
                  <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{{ item.brand || '未分类' }}</span>
                  <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{{ item.season || '四季' }}</span>
                </div>
              </div>
            </div>
          </transition-group>
        </div>

        <!-- 空状态展示 -->
        <transition name="fade-up" appear>
          <div v-if="getCategoryItems(selectedCategory).length === 0" class="flex flex-col items-center justify-center h-full py-12 text-center px-4">
            <div class="relative mb-6 animate-float">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <font-awesome-icon :icon="['fas', 'tshirt']" class="text-3xl text-primary animate-pulse-slow" />
              </div>
              <div class="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center animate-ping-slow">
                <font-awesome-icon :icon="['fas', 'plus']" class="text-white" />
              </div>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2 animate-fade-in-delay-1">
              {{ isSearchMode ? '没有找到相关衣物' : `您的 ${getSelectedCategoryName()} 分类还是空的` }}
            </h3>
            <p class="text-gray-600 mb-6 max-w-md animate-fade-in-delay-2">
              {{ isSearchMode ? '尝试使用其他关键词搜索' : '添加您的第一件衣物，开始构建您的专属数字衣橱，让每一天都充满时尚感' }}
            </p>
            <button
              @click="$emit('showUpload')"
              class="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-2 animate-fade-in-delay-3 hover:animate-bounce-gentle"
            >
              <font-awesome-icon :icon="['fas', 'plus-circle']" />
              <span>{{ isSearchMode ? '添加新衣物' : '添加第一件衣物' }}</span>
            </button>
          </div>
        </transition>
      </div>

      <!-- 底部操作栏 -->
      <div class="bg-white border-t border-gray-200 p-3 flex justify-between items-center">
        <button class="text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-1">
          <font-awesome-icon :icon="['fas', 'th-large']" />
          <span class="text-sm">网格视图</span>
        </button>
        <button class="text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-1">
          <font-awesome-icon :icon="['fas', 'list']" />
          <span class="text-sm">列表视图</span>
        </button>
        <button
          @click="$emit('showUpload')"
          class="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-colors flex items-center space-x-1"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
          <span>添加衣物</span>
        </button>
      </div>
    </div>
  </transition>
</section>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import ClothingCategory from '../../common/ui/ClothingCategory.vue'
import OutfitCard from '../../common/ui/OutfitCard.vue'
import ClothingItem from '../../common/ui/ClothingItem.vue'
import FavoriteSection from './FavoriteSection.vue'
import { useWardrobeStore } from '../../../stores/wardrobeStore'
import { useRouter } from 'vue-router'
import { showToast } from '../../../utils/toast'

const router = useRouter()
const wardrobeStore = useWardrobeStore()
const emit = defineEmits(['showUpload'])

// 状态
const searchKeyword = ref('')
const outfitIndex = ref(0)
const isDrawerOpen = ref(false)
const searchResults = ref([])
const isSearchMode = ref(false)

// 动画事件处理函数
const beforeEnter = () => {
  console.log('动画开始: beforeEnter')
  console.time('动画持续时间')
}

const afterEnter = () => {
  console.timeEnd('动画持续时间')
  console.log('动画结束: afterEnter')
}

const beforeLeave = () => {
  console.log('离开动画开始: beforeLeave')
}

const afterLeave = () => {
  console.log('离开动画结束: afterLeave')
}

// 计算属性
const categories = computed(() => wardrobeStore.categories)
const selectedCategory = computed(() => {
  const value = wardrobeStore.selectedCategory;
  console.log("selectedCategory计算属性被调用，当前值:", value);
  return value;
})
const loading = computed(() => {
  const value = wardrobeStore.loading;
  console.log("loading计算属性被调用，当前值:", value);
  return value;
})
const error = computed(() => {
  const value = wardrobeStore.error;
  console.log("error计算属性被调用，当前值:", value);
  return value;
})
const recentlyAddedItems = computed(() => wardrobeStore.recentlyAddedItems)
const favoriteItems = computed(() => wardrobeStore.favoriteItems)

// 精选搭配数据（静态数据，可以后续改为从API获取）
const outfits = ref([
  {
    title: '简约休闲风',
    desc: '适合周末出行，舒适又时尚',
    tag: '休闲日常',
    tagColor: 'white',
    tagText: 'text-neutral-800',
    img: 'https://picsum.photos/seed/outfit1/600/400',
    items: [
      { img: 'https://picsum.photos/seed/item1/100/100', alt: '白色T恤' },
      { img: 'https://picsum.photos/seed/item2/100/100', alt: '牛仔裤' },
      { img: 'https://picsum.photos/seed/item3/100/100', alt: '运动鞋' },
      { more: 2 }
    ],
    liked: false,
    likes: 24
  },
  {
    title: '干练职场风',
    desc: '适合办公室，专业又不失时尚',
    tag: '职场通勤',
    tagColor: 'white',
    tagText: 'text-neutral-800',
    img: 'https://picsum.photos/seed/outfit2/600/400',
    items: [
      { img: 'https://picsum.photos/seed/item4/100/100', alt: '衬衫' },
      { img: 'https://picsum.photos/seed/item5/100/100', alt: '西装裤' },
      { img: 'https://picsum.photos/seed/item6/100/100', alt: '高跟鞋' },
      { more: 1 }
    ],
    liked: true,
    likes: 42
  },
  {
    title: '浪漫约会风',
    desc: '适合约会场合，优雅迷人',
    tag: '约会聚会',
    tagColor: 'white',
    tagText: 'text-neutral-800',
    img: 'https://picsum.photos/seed/outfit3/600/400',
    items: [
      { img: 'https://picsum.photos/seed/item7/100/100', alt: '连衣裙' },
      { img: 'https://picsum.photos/seed/item8/100/100', alt: '耳环' },
      { img: 'https://picsum.photos/seed/item9/100/100', alt: '手包' }
    ],
    liked: false,
    likes: 18
  }
])

const displayedOutfits = computed(() => outfits.value.slice(outfitIndex.value, outfitIndex.value + 3))

// 方法
function prevOutfit() {
  if (outfitIndex.value > 0) outfitIndex.value--
}

function nextOutfit() {
  if (outfitIndex.value < outfits.value.length - 3) outfitIndex.value++
}

function getCategoryItemCount(categoryId) {
  if (isSearchMode.value) return searchResults.value.length;
  return wardrobeStore.itemsByCategory[categoryId]?.length || 0
}

function getSelectedCategoryName() {
  if (isSearchMode.value) return `搜索结果: "${searchKeyword.value}"`;
  if (!selectedCategory.value) return '';
  if (selectedCategory.value === "all") return '全部衣物';
  const category = categories.value.find(c => c.id === selectedCategory.value);
  return category ? category.name : '';
}

function getCategoryItems(categoryId) {
  if (isSearchMode.value) {
    // 返回搜索结果
    return searchResults.value;
  }
  if (categoryId === "all") {
    // 返回所有衣物
    let allItems = [];
    Object.values(wardrobeStore.itemsByCategory).forEach(items => {
      allItems = [...allItems, ...items];
    });
    return allItems;
  }
  return wardrobeStore.itemsByCategory[categoryId] || [];
}

// 强制更新组件的key
const forceUpdateKey = ref(0);

function forceUpdate() {
  forceUpdateKey.value++;
  nextTick(() => {
    console.log("组件已强制更新");
  });
}

function selectCategory(categoryId) {
  console.log("点击分类，ID:", categoryId);
  console.log("当前选中分类:", wardrobeStore.selectedCategory);
  console.log("所有分类:", categories.value);
  console.log("所有衣物:", wardrobeStore.clothingItems);

  // 如果当前是搜索模式，先退出搜索模式
  if (isSearchMode.value) {
    isSearchMode.value = false;
    searchResults.value = [];
  }

  if (wardrobeStore.selectedCategory === categoryId) {
    console.log("清除选中分类");
    wardrobeStore.clearSelectedCategory();
    // 关闭抽屉
    isDrawerOpen.value = false;
  } else {
    console.log("设置选中分类:", categoryId);
    wardrobeStore.setSelectedCategory(categoryId);
    // 打开抽屉
    isDrawerOpen.value = true;
  }

  console.log("更新后选中分类:", wardrobeStore.selectedCategory);

  // 强制更新组件
  forceUpdate();
}

async function toggleFavorite(item) {
  try {
    await wardrobeStore.updateClothingItem(item.id, { favorite: !item.favorite })
    showToast(item.favorite ? '已取消收藏' : '已添加到收藏', 'success')
  } catch (error) {
    showToast('操作失败，请重试', 'error')
  }
}

async function handleSearch() {
  if (!searchKeyword.value.trim()) return

  try {
    const results = await wardrobeStore.searchClothingItems(searchKeyword.value)
    showToast(`找到 ${results.length} 件相关衣物`, 'success')
    // 保存搜索结果并打开抽屉展示
    searchResults.value = results
    isSearchMode.value = true
    isDrawerOpen.value = true
  } catch (error) {
    showToast('搜索失败，请重试', 'error')
  }
}

function initializeData() {
  wardrobeStore.initializeData()
}

function closeDrawer() {
  // 如果是搜索模式，清除搜索状态
  if (isSearchMode.value) {
    isSearchMode.value = false;
    searchResults.value = [];
  } else {
    wardrobeStore.clearSelectedCategory();
  }
  isDrawerOpen.value = false;
}

function viewItemDetail(item) {
  // 查看衣物详情的逻辑
  console.log("查看衣物详情:", item);
  // 这里可以添加导航到详情页面的逻辑
}

function viewAllCategories() {
  // 查看所有分类的逻辑
  console.log("查看所有分类");
  // 如果当前是搜索模式，先退出搜索模式
  if (isSearchMode.value) {
    isSearchMode.value = false;
    searchResults.value = [];
  }
  // 设置一个特殊值表示查看全部
  wardrobeStore.setSelectedCategory("all");
  isDrawerOpen.value = true;
}

// 生命周期
onMounted(() => {
  initializeData()
})
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}

.slide-up-enter-active {
  animation-name: slideUpIn;
  animation-duration: 1s;
}

.slide-up-leave-active {
  animation-name: slideUpOut;
  animation-duration: 0.3s;
}

.slide-up-enter-from {
  transform: translateY(100%) scale(0.95);
  opacity: 0;
}

.slide-up-enter-to {
  transform: translateY(0) scale(1);
  opacity: 1;
}

.slide-up-leave-from {
  transform: translateY(0) scale(1);
  opacity: 1;
}

.slide-up-leave-to {
  transform: translateY(100%) scale(0.95);
  opacity: 0;
}

@keyframes slideUpIn {
  from {
    transform: translateY(100%) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes slideUpOut {
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(100%) scale(0.95);
    opacity: 0;
  }
}

/* 隐藏滚动条但保持滚动功能 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 交错淡入动画 */
.staggered-fade-enter-active {
  transition: all 0.5s ease;
}

.staggered-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.staggered-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* 向上淡入动画 */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.6s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* 浮动动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* 慢速脉冲动画 */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 慢速扩散动画 */
@keyframes ping-slow {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.animate-ping-slow {
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* 弹跳进入动画 */
@keyframes bounce-in {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-bounce-in {
  animation: bounce-in 0.5s ease-out;
}

/* 延迟淡入动画 */
@keyframes fade-in-delay {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-delay-1 {
  animation: fade-in-delay 0.6s ease-out 0.2s both;
}

.animate-fade-in-delay-2 {
  animation: fade-in-delay 0.6s ease-out 0.4s both;
}

.animate-fade-in-delay-3 {
  animation: fade-in-delay 0.6s ease-out 0.6s both;
}

/* 温和弹跳动画 */
@keyframes bounce-gentle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.hover\:animate-bounce-gentle:hover {
  animation: bounce-gentle 1s ease-in-out infinite;
}
</style>
