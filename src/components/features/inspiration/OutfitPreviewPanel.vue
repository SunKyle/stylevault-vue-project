<template>
  <div class="bg-gradient-to-br from-white to-neutral-50 rounded-2xl shadow-lg overflow-hidden border border-neutral-100 h-full flex flex-col transform transition-all duration-300 hover:shadow-xl">
    <div class="bg-gradient-to-r from-primary/10 to-secondary/10 p-5 border-b border-neutral-100">
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-lg flex items-center text-neutral-800">
          <div class="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mr-2 shadow-sm">
            <font-awesome-icon icon="lightbulb" class="text-white text-sm" />
          </div>
          搭配灵感
        </h3>
        <div class="flex items-center gap-2">
          <span class="bg-white/80 backdrop-blur-sm text-primary px-3 py-1 rounded-full font-medium text-sm shadow-sm">
            {{ selectedClothes.length }}件衣物
          </span>
        </div>
      </div>
    </div>

    <div class="flex-1 p-5 flex flex-col">
      <!-- 搭配预览区 -->
      <div class="bg-gradient-to-br from-primary/8 to-secondary/8 rounded-2xl p-5 h-64 md:h-72 flex flex-col items-center justify-center mb-5 border border-neutral-100/50 relative overflow-hidden shadow-inner">
        <!-- 装饰元素 -->
        <div class="absolute -bottom-12 -right-12 w-48 h-48 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-xl"></div>
        <div class="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-full blur-lg"></div>
        <div class="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-primary/30"></div>
        <div class="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-secondary/30"></div>

        <!-- 空状态 -->
        <div v-if="selectedClothes.length === 0" class="text-center relative z-10">
          <div class="w-24 h-24 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 shadow-md border border-white/50">
            <font-awesome-icon icon="tshirt" class="text-primary text-3xl" />
          </div>
          <p class="text-neutral-600 font-medium">从右侧添加衣物进行搭配</p>
        </div>

        <!-- 有衣物时的预览 -->
        <div v-else class="w-full h-full flex flex-wrap justify-center items-center gap-3 md:gap-4 relative z-10">
          <div v-for="(item, idx) in selectedClothes.slice(0, 8)" :key="idx"
               class="relative group transform transition-all duration-500 hover:z-10"
               :class="idx >= 6 ? 'opacity-70 scale-95' : ''"
               :style="{ transform: `translateY(${(idx % 3 - 1) * 10}px) rotate(${(idx % 2 === 0 ? -1 : 1) * (idx % 3)}deg)` }">
            <div class="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img :src="item.img" :alt="item.name"
                 class="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shadow-lg border-2 border-white relative z-10 transition-transform duration-300 group-hover:scale-110"
                 loading="lazy" />
            <div v-if="idx === 7 && selectedClothes.length > 8"
                 class="absolute inset-0 bg-black/80 rounded-xl flex items-center justify-center text-white text-xs font-bold z-20">
              +{{ selectedClothes.length - 8 }}
            </div>
            <div class="absolute inset-x-0 -bottom-7 bg-black/80 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none text-center truncate z-20 whitespace-nowrap shadow-lg">
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- 搭配信息表单 -->
      <div class="bg-gradient-to-br from-white to-neutral-50 rounded-2xl p-5 mb-5 border border-neutral-100 shadow-sm">
        <h4 class="text-sm font-semibold text-neutral-700 mb-4 flex items-center">
          <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
            <font-awesome-icon :icon="['fas', 'tag']" class="text-primary text-xs" />
          </div>
          搭配信息
        </h4>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-neutral-600 mb-1.5">搭配名称 <span class="text-red-500 font-bold ml-1">*</span></label>
            <div class="relative">
              <input
                :value="outfitName"
                @input="$emit('update:outfitName', $event.target.value)"
                type="text"
                class="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm bg-white shadow-sm transition-all duration-300"
                placeholder="为你的搭配起个名字"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <font-awesome-icon :icon="['fas', 'pen']" class="text-neutral-400 text-xs" />
              </div>
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-neutral-600 mb-1.5">使用场景</label>
            <div class="relative">
              <input
                :value="outfitScene"
                @input="$emit('update:outfitScene', $event.target.value)"
                type="text"
                class="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm bg-white shadow-sm transition-all duration-300"
                placeholder="例如：日常通勤、约会、商务会议等"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="text-neutral-400 text-xs" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 衣物列表 -->
      <div class="flex-1 flex flex-col">
        <div class="mb-3 flex justify-between items-center">
          <span class="text-sm font-semibold text-neutral-700">衣物清单 ({{ selectedClothes.length }})</span>
          <button v-if="selectedClothes.length > 0" class="text-xs text-primary hover:text-primary/80 transition-colors flex items-center" @click="$emit('reset-clothes')">
            <font-awesome-icon :icon="['fas', 'trash-alt']" class="mr-1" />
            清空全部
          </button>
        </div>

        <div class="h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent space-y-2.5">
          <div v-if="selectedClothes.length === 0" class="text-center text-neutral-400 py-6 border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50/50">
            <font-awesome-icon :icon="['fas', 'info-circle']" class="mr-2" />
            <p class="text-sm">尚未选择衣物</p>
          </div>
          <div v-else v-for="(item, idx) in selectedClothes" :key="idx"
               class="flex items-center gap-3 bg-white rounded-xl px-3 py-3 group hover:bg-primary/5 transition-all duration-300 transform hover:translate-x-1 border border-neutral-100 hover:border-primary/20 shadow-sm hover:shadow-md">
            <div class="relative">
              <div class="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img :src="item.img" :alt="item.name" class="w-12 h-12 rounded-lg object-cover shadow-sm relative z-10" loading="lazy" />
              <div class="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-sm z-20">
                <span class="text-white text-xs font-bold">{{ idx + 1 }}</span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-neutral-800 truncate">{{ item.name }}</p>
              <p class="text-xs text-neutral-500 truncate">{{ item.type }}</p>
            </div>
            <button class="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 hover:bg-red-500 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                    @click="$emit('remove-cloth', idx)">
              <font-awesome-icon :icon="['fas', 'times']" class="text-xs" />
            </button>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="mt-5 flex gap-3">
          <button class="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group/button"
                  @click="handleSaveOutfit"
                  :disabled="selectedClothes.length === 0 || !outfitName.trim()">
            <!-- 按钮装饰效果 -->
            <div class="absolute inset-0 bg-white/10 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 transform -translate-x-full group-hover/button:translate-x-full transition-transform duration-700"></div>

            <font-awesome-icon :icon="['fas', 'heart']" class="mr-2 transition-transform duration-300 group-hover/button:scale-110" />
            <span class="transition-transform duration-300 group-hover/button:scale-105 font-medium">保存搭配</span>
          </button>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineModel } from 'vue'

// 搭配信息
const outfitName = defineModel('outfitName', { type: String, default: '' })
const outfitScene = defineModel('outfitScene', { type: String, default: '' })

// 定义emit
const emit = defineEmits([
  'remove-cloth',
  'reset-clothes',
  'save-outfit'
])

// 处理保存搭配
function handleSaveOutfit() {
  if (!outfitName.value.trim()) {
    alert('请输入搭配名称')
    return
  }

  emit('save-outfit', {
    name: outfitName.value,
    scene: outfitScene.value
  })
}

defineProps({
  selectedClothes: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
/* 自定义滚动条样式 */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>
