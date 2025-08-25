<template>
  <section>
    <div class="container mx-auto px-4">
      <h2 class="text-2xl md:text-3xl font-bold mb-8">搭配灵感</h2>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <!-- 左侧：穿搭预览 -->
        <div class="lg:col-span-1 order-2 lg:order-1">
          <div class="bg-white rounded-2xl p-4 md:p-6 shadow-soft h-full flex flex-col">
            <div class="flex justify-between items-center mb-5">
              <h3 class="font-bold text-lg">我的搭配</h3>
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
import { ref, computed } from 'vue'
const categories = ['全部', '上衣', '裤子', '外套', '裙装', '鞋子', '配饰']
const tags = ['休闲', '正式', '运动', '夏季', '最近穿着']
const clothes = [
  { name: '白色T恤', type: '上衣 · 休闲', img: 'https://picsum.photos/seed/custom1/200/200', category: '上衣', tags: ['休闲', '夏季'] },
  { name: '格子衬衫', type: '上衣 · 休闲', img: 'https://picsum.photos/seed/custom2/200/200', category: '上衣', tags: ['休闲'] },
  { name: '黑色牛仔裤', type: '裤子 · 休闲', img: 'https://picsum.photos/seed/custom3/200/200', category: '裤子', tags: ['休闲'] },
  { name: '卡其色短裤', type: '裤子 · 休闲', img: 'https://picsum.photos/seed/custom4/200/200', category: '裤子', tags: ['休闲', '夏季'] },
  { name: '白色运动鞋', type: '鞋子 · 运动', img: 'https://picsum.photos/seed/custom5/200/200', category: '鞋子', tags: ['运动'] },
  { name: '棕色皮鞋', type: '鞋子 · 正式', img: 'https://picsum.photos/seed/custom6/200/200', category: '鞋子', tags: ['正式'] },
  { name: '黑色背包', type: '配饰 · 日常', img: 'https://picsum.photos/seed/custom7/200/200', category: '配饰', tags: ['休闲'] },
  { name: '棒球帽', type: '配饰 · 休闲', img: 'https://picsum.photos/seed/custom8/200/200', category: '配饰', tags: ['休闲', '夏季'] }
]
const activeCategory = ref('全部')
const activeTag = ref('')
const selectedClothes = ref([])
const filteredClothes = computed(() => {
  return clothes.filter(item => {
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

// 保存穿搭方案
function saveOutfit() {
  if (selectedClothes.value.length === 0) {
    alert('请至少选择一件衣物')
    return
  }

  // 创建一个新的穿搭方案
  const newOutfit = {
    id: Date.now(), // 使用时间戳作为ID
    name: `搭配方案 ${new Date().toLocaleDateString()}`,
    items: [...selectedClothes.value],
    createdAt: new Date()
  }

  // 保存到本地存储
  const savedOutfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]')
  savedOutfits.push(newOutfit)
  localStorage.setItem('savedOutfits', JSON.stringify(savedOutfits))

  // 显示成功消息
  alert('穿搭方案已保存！')

  // 重置当前搭配
  resetClothes()
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
