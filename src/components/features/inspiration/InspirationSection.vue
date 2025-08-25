<template>
  <section>
    <div class="container mx-auto px-4">
      <h2 class="text-2xl md:text-3xl font-bold mb-8">我的搭配</h2>
      <!-- 已保存搭配区域 -->
      <div class="bg-white rounded-2xl p-6 shadow-soft mb-8">
          <div>
            <div class="flex justify-between items-center mb-5">
              <h3 class="font-bold text-lg">我的搭配</h3>
              <span class="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium">{{ savedOutfits.length }}套</span>
            </div>
            
            <!-- 已保存搭配列表 -->
            <div v-if="savedOutfits.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(outfit, index) in savedOutfits" :key="outfit.id" 
                   class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group border border-neutral-100 flex flex-col h-full">
                <!-- 搭配预览 -->
                <div class="bg-gradient-to-br from-primary/5 to-neutral-50 p-5 h-48 flex flex-col">
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <h4 class="font-bold text-neutral-800 text-lg truncate pr-2">{{ outfit.name }}</h4>
                      <div v-if="outfit.scene" class="flex items-center mt-1">
                        <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="text-primary text-xs mr-1" />
                        <span class="text-xs text-primary font-medium">{{ outfit.scene }}</span>
                      </div>
                    </div>
                    <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button @click="loadOutfit(outfit)" 
                              class="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                              title="加载搭配">
                        <font-awesome-icon :icon="['fas', 'redo']" class="text-xs" />
                      </button>
                      <button @click="deleteOutfit(index)" 
                              class="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                              title="删除搭配">
                        <font-awesome-icon :icon="['fas', 'trash']" class="text-xs" />
                      </button>
                    </div>
                  </div>
                  
                  <!-- 衣物预览区 -->
                  <div class="flex-1 flex flex-wrap items-center justify-center gap-2 relative">
                    <div v-for="(item, idx) in outfit.items.slice(0, 8)" :key="idx"
                         class="relative group/item"
                         :class="idx >= 6 ? 'opacity-70' : ''">
                      <img :src="item.img" :alt="item.name"
                           class="w-10 h-10 rounded-lg object-cover shadow-sm border-2 border-white transition-transform duration-300 group-hover/item:scale-110" />
                      <div class="absolute inset-x-0 -bottom-6 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none text-center truncate z-10">
                        {{ item.name }}
                      </div>
                      <div v-if="idx === 7 && outfit.items.length > 8"
                           class="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        +{{ outfit.items.length - 8 }}
                      </div>
                    </div>
                    
                    <!-- 空状态 -->
                    <div v-if="outfit.items.length === 0" class="text-center text-neutral-400">
                      <font-awesome-icon :icon="['fas', 'tshirt']" class="text-xl mb-1" />
                      <p class="text-xs">暂无衣物</p>
                    </div>
                  </div>
                </div>
                
                <!-- 搭配信息 -->
                <div class="p-4 flex-1 flex flex-col">
                  <!-- 日期和操作按钮（移动端） -->
                  <div class="flex justify-between items-center mb-3 md:hidden">
                    <span class="text-xs text-neutral-500">{{ formatDate(outfit.createdAt) }}</span>
                    <div class="flex gap-1">
                      <button @click="loadOutfit(outfit)" 
                              class="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                              title="加载搭配">
                        <font-awesome-icon :icon="['fas', 'redo']" class="text-xs" />
                      </button>
                      <button @click="deleteOutfit(index)" 
                              class="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                              title="删除搭配">
                        <font-awesome-icon :icon="['fas', 'trash']" class="text-xs" />
                      </button>
                    </div>
                  </div>
                  
                  <!-- 衣物类型统计 -->
                  <div class="mb-3 bg-neutral-50 rounded-lg p-2">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-xs font-medium text-neutral-700 flex items-center">
                        <font-awesome-icon :icon="['fas', 'layer-group']" class="mr-1 text-neutral-500" />
                        衣物组成
                      </span>
                      <span class="text-xs text-neutral-500 bg-white px-2 py-0.5 rounded-full">{{ outfit.items.length }}件</span>
                    </div>
                    <div class="flex flex-wrap gap-1">
                      <span v-for="(count, type) in getOutfitStats(outfit.items)" :key="type" 
                            class="text-xs bg-white text-neutral-700 px-2 py-1 rounded-md border border-neutral-200 shadow-sm">
                        {{ type }}: {{ count }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- 场景和标签 -->
                  <div class="mb-3">
                    <!-- 场景信息 -->
                    <div v-if="outfit.scene" class="mb-2">
                      <div class="text-xs font-medium text-neutral-700 mb-1 flex items-center">
                        <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="text-primary mr-1" />
                        适用场景
                      </div>
                      <div class="flex flex-wrap gap-1">
                        <span class="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100">
                          {{ outfit.scene }}
                        </span>
                      </div>
                    </div>
                    
                    <!-- 风格标签 -->
                    <div v-if="getOutfitTags(outfit.items).length > 0">
                      <div class="text-xs font-medium text-neutral-700 mb-1">风格标签</div>
                      <div class="flex flex-wrap gap-1">
                        <span v-for="tag in getOutfitTags(outfit.items).slice(0, 4)" :key="tag" 
                              class="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">
                          {{ tag }}
                        </span>
                        <span v-if="getOutfitTags(outfit.items).length > 4" 
                              class="text-xs bg-neutral-100 text-neutral-500 px-2 py-1 rounded-md">
                          +{{ getOutfitTags(outfit.items).length - 4 }}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 底部信息 -->
                  <div class="mt-auto pt-3 border-t border-neutral-100 flex justify-between items-center">
                    <span class="text-xs text-neutral-500 hidden md:block">{{ formatDate(outfit.createdAt) }}</span>
                    <button @click="loadOutfit(outfit)" 
                            class="text-xs text-primary hover:text-primary/80 font-medium flex items-center transition-colors">
                      <font-awesome-icon :icon="['fas', 'eye']" class="mr-1" />
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 空状态 -->
            <div v-else class="text-center py-10 border border-dashed border-neutral-200 rounded-xl">
              <div class="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                <font-awesome-icon :icon="['fas', 'heart']" class="text-neutral-400 text-xl" />
              </div>
              <p class="text-neutral-500 mb-2">暂无保存的搭配方案</p>
              <p class="text-neutral-400 text-sm">创建您的第一套搭配方案，开始记录时尚灵感</p>
            </div>
          </div>
        </div>
      
      <h2 class="text-2xl md:text-3xl font-bold mb-8">搭配灵感</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <!-- 左侧：穿搭预览 -->
        <div class="lg:col-span-1 order-2 lg:order-1">
          <div class="bg-white rounded-2xl p-4 md:p-6 shadow-soft h-full flex flex-col">
            <div class="flex justify-between items-center mb-5">
              <h3 class="font-bold text-lg">搭配灵感</h3>
              <div class="flex items-center gap-2">
                <span class="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium">{{ selectedClothes.length }}件</span>
              </div>
            </div>

            <!-- 搭配预览区 -->
            <div class="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-4 md:p-5 h-60 md:h-72 flex flex-col items-center justify-center mb-6 border-2 border-dashed border-neutral-200 relative overflow-hidden">
              <!-- 空状态 -->
              <div v-if="selectedClothes.length === 0" class="text-center">
                <div class="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center mx-auto mb-3">
                  <font-awesome-icon :icon="['fas', 'tshirt']" class="text-neutral-500 text-xl" />
                </div>
                <p class="text-neutral-500 text-sm md:text-base">从右侧添加衣物进行搭配</p>
              </div>

              <!-- 有衣物时的预览 -->
              <div v-else class="w-full h-full flex flex-wrap justify-center items-center gap-2 md:gap-3">
                <div v-for="(item, idx) in selectedClothes.slice(0, 6)" :key="idx" 
                     class="relative group" 
                     :class="idx >= 4 ? 'opacity-70' : ''">
                  <img :src="item.img" :alt="item.name" 
                       class="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover shadow-sm border-2 border-white" />
                  <div v-if="idx === 5 && selectedClothes.length > 6" 
                       class="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    +{{ selectedClothes.length - 6 }}
                  </div>
                </div>
              </div>

              <!-- 装饰元素 -->
              <div class="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-primary/5"></div>
              <div class="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary/5"></div>
            </div>

            <!-- 衣物列表 -->
            <div class="flex-1 flex flex-col">
              <div class="mb-3 flex justify-between items-center">
                <span class="text-sm font-medium text-neutral-700">衣物清单 ({{ selectedClothes.length }})</span>
                <button v-if="selectedClothes.length > 0" class="text-xs text-primary hover:text-primary/80" @click="resetClothes">
                  清空全部
                </button>
              </div>

              <div class="h-40 md:h-48 overflow-y-auto pr-2 scrollbar-hide space-y-2">
                <div v-if="selectedClothes.length === 0" class="text-center text-neutral-400 py-6 border border-dashed border-neutral-200 rounded-xl">
                  <p class="text-sm">尚未选择衣物</p>
                </div>
                <div v-else v-for="(item, idx) in selectedClothes" :key="idx" 
                     class="flex items-center gap-3 bg-neutral-50 rounded-lg px-3 py-2.5 group hover:bg-white transition-colors">
                  <div class="relative">
                    <img :src="item.img" :alt="item.name" class="w-10 h-10 rounded-lg object-cover" />
                    <div class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <span class="text-white text-xs font-bold">{{ idx + 1 }}</span>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-neutral-800 truncate">{{ item.name }}</p>
                    <p class="text-xs text-neutral-500 truncate">{{ item.type }}</p>
                  </div>
                  <button class="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" 
                          @click="removeCloth(idx)">
                    <span class="text-lg">×</span>
                  </button>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="mt-4 space-y-2">
                <button class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center shadow-soft disabled:opacity-50 disabled:cursor-not-allowed" 
                        @click="saveOutfit"
                        :disabled="selectedClothes.length === 0">
                  <font-awesome-icon :icon="['fas', 'heart']" class="mr-2" />
                  保存穿搭方案
                </button>
                <button class="w-full bg-white border border-neutral-200 text-neutral-700 font-medium py-2 rounded-xl hover:bg-neutral-50 transition-colors" 
                        @click="resetClothes">
                  重置搭配
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- 右侧：衣物选择 -->
        <div class="lg:col-span-2 order-1 lg:order-2">
          <div class="bg-white rounded-2xl p-6 shadow-soft">
            <h3 class="font-bold text-lg mb-5">选择衣物</h3>
            <!-- 分类选项卡 -->
            <div class="flex border-b border-neutral-100 mb-6 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
              <button v-for="cat in categories" :key="cat" class="px-4 py-3 font-medium whitespace-nowrap text-sm md:text-base"
                :class="activeCategory === cat ? 'text-primary border-b-2 border-primary' : 'text-neutral-500 hover:text-neutral-800'"
                @click="activeCategory = cat"
              >{{ cat }}</button>
            </div>
            <!-- 过滤选项 -->
            <div class="flex flex-wrap gap-2 mb-6 -mx-1 px-1">
              <button v-for="tag in tags" :key="tag" class="bg-neutral-100 text-neutral-800 text-xs px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors"
                :class="activeTag === tag ? 'bg-primary text-white' : ''"
                @click="activeTag = tag"
              >{{ tag }}</button>
            </div>
            <!-- 衣物列表 -->
            <div class="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 max-h-[500px] md:max-h-[550px] overflow-y-auto pr-2 scrollbar-hide">
              <transition-group name="fade" tag="div" class="contents">
                <div v-for="item in filteredClothes" :key="item.name" class="group relative">
                  <div class="aspect-[3/4] bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 border-2 cursor-pointer relative"
                    :class="selectedClothes.some(i => i.name === item.name) ? 'border-primary' : 'border-neutral-100'"
                    @click="toggleCloth(item)">
                    <div class="w-full h-full overflow-hidden">
                      <img :src="item.img" :alt="item.name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">
                    </div>
                    <!-- 选中状态遮罩 -->
                    <div v-if="selectedClothes.some(i => i.name === item.name)" class="absolute inset-0 bg-primary/20"></div>
                    <!-- 悬停效果遮罩 -->
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    <!-- 选中状态指示器 -->
                    <div v-if="selectedClothes.some(i => i.name === item.name)" class="absolute top-3 right-3 w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                      <span class="text-white font-bold text-lg">✓</span>
                    </div>
                    <!-- 未选中状态指示器 -->
                    <div v-else class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md">
                      <span class="text-primary font-bold text-lg">+</span>
                    </div>
                    <!-- 衣物信息 -->
                    <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                      <p class="text-white text-sm font-medium truncate">{{ item.name }}</p>
                      <p class="text-white/80 text-xs truncate">{{ item.type }}</p>
                    </div>
                  </div>
                  <div class="mt-2 px-1">
                    <p class="text-sm font-medium truncate">{{ item.name }}</p>
                    <p class="text-xs text-neutral-500 truncate">{{ item.type }}</p>
                  </div>
                </div>
              </transition-group>
              <!-- 空状态提示 -->
              <div v-if="filteredClothes.length === 0" class="col-span-full text-center py-10">
                <div class="text-neutral-400 mb-2">
                  <font-awesome-icon :icon="['fas', 'search']" class="text-3xl" />
                </div>
                <p class="text-neutral-500">没有找到符合条件的衣物</p>
                <button class="mt-3 text-primary text-sm hover:underline" @click="activeCategory = '全部'; activeTag = ''">查看全部衣物</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useWardrobeStore } from '../../../stores/wardrobeStore'
import { scenesMockData, getClothesWithTags } from '../../../mock/wardrobe'

const wardrobeStore = useWardrobeStore()
const categories = computed(() => ['全部', ...wardrobeStore.categories.map(c => c.name)])

// 从wardrobeStore获取转换后的数据
const clothes = ref([])

// 监听clothingItems变化，自动转换数据
watch(
  () => wardrobeStore.clothingItems,
  (newItems) => {
    if (newItems.length > 0) {
      clothes.value = getClothesWithTags(newItems)
    }
  },
  { immediate: true }
)

// 获取所有唯一的标签
const allTags = computed(() => {
  const tagSet = new Set()
  if (Array.isArray(clothes.value)) {
    clothes.value.forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => tagSet.add(tag))
      }
    })
  }
  return Array.from(tagSet)
})

// 添加"最近穿着"标签
const tags = computed(() => {
  return ['最近穿着', ...allTags.value]
})
const activeCategory = ref('全部')
const activeTag = ref('')
const selectedClothes = ref([])
const savedOutfits = ref([])

// 组件挂载时加载已保存的搭
onMounted(() => {
  loadSavedOutfits()
  // 确保从store获取数据
  if (wardrobeStore.categories.length === 0) {
    wardrobeStore.fetchCategories()
  }
  if (wardrobeStore.clothingItems.length === 0) {
    wardrobeStore.fetchClothingItems()
  }
})
const filteredClothes = computed(() => {
  return clothes.value.filter(item => {
    const catMatch = activeCategory.value === '全部' || item.category === activeCategory.value
    const tagMatch = !activeTag.value || item.tags.includes(activeTag.value)
    return catMatch && tagMatch
  })
})
function addCloth(item) {
  if (!selectedClothes.value.find(i => i.name === item.name)) {
    selectedClothes.value.push(item)
  }
}
function removeCloth(idx) {
  selectedClothes.value.splice(idx, 1)
}
function resetClothes() {
  selectedClothes.value = []
}
function toggleCloth(item) {
  const index = selectedClothes.value.findIndex(i => i.name === item.name)
  if (index === -1) {
    // 如果未选中，则添加
    selectedClothes.value.push(item)
  } else {
    // 如果已选中，则移除
    selectedClothes.value.splice(index, 1)
  }
}

// 加载已保存的搭配
function loadSavedOutfits() {
  const outfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]')
  savedOutfits.value = outfits
}

// 保存穿搭方案
function saveOutfit() {
  if (selectedClothes.value.length === 0) {
    alert('请至少选择一件衣物')
    return
  }

  // 获取搭配名称
  const outfitName = prompt('请为您的搭配方案命名:', `搭配方案 ${new Date().toLocaleDateString()}`)
  if (!outfitName) return // 用户取消了输入

  // 获取适用场景
  const sceneOptions = scenesMockData.join(', ')
  const outfitScene = prompt(`请输入适用场景(如: ${sceneOptions}):`, '')

  // 创建一个新的穿搭方案
  const newOutfit = {
    id: Date.now(), // 使用时间戳作为ID
    name: outfitName,
    scene: outfitScene || undefined,
    items: [...selectedClothes.value],
    createdAt: new Date()
  }

  // 保存到本地存储
  const outfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]')
  outfits.push(newOutfit)
  localStorage.setItem('savedOutfits', JSON.stringify(outfits))
  
  // 更新已保存搭配列表
  loadSavedOutfits()

  // 显示成功消息
  alert('穿搭方案已保存！')

  // 重置当前搭配
  resetClothes()
}

// 加载搭配方案
function loadOutfit(outfit) {
  selectedClothes.value = Array.isArray(outfit.items) ? [...outfit.items] : []
  // 滚动到搭配预览区域
  document.querySelector('.order-2').scrollIntoView({ behavior: 'smooth' })
}

// 删除搭配方案
function deleteOutfit(index) {
  if (confirm('确定要删除这个搭配方案吗？')) {
    const outfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]')
    outfits.splice(index, 1)
    localStorage.setItem('savedOutfits', JSON.stringify(outfits))
    
    // 更新已保存搭配列表
    loadSavedOutfits()
  }
}

// 格式化日期
function formatDate(date) {
  const d = new Date(date)
  return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`
}

// 获取搭配衣物类型统计
function getOutfitStats(items) {
  const stats = {}
  items.forEach(item => {
    // 提取类型（如"上衣"、"裤子"等）
    const type = item.type.split(' · ')[0]
    if (stats[type]) {
      stats[type]++
    } else {
      stats[type] = 1
    }
  })
  return stats
}

// 获取搭配标签
function getOutfitTags(items) {
  const tags = new Set()
  items.forEach(item => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach(tag => tags.add(tag))
    }
  })
  return Array.from(tags)
}
</script>
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
