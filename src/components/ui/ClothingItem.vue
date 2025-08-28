<template>
  <div class="group relative">
    <div
      class="aspect-square bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 mb-3 border-2 border-transparent hover:border-primary/30"
      :class="{ 'border-primary/50 shadow-lg': item.favorite }"
    >
      <img
        :src="item.image"
        :alt="item.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      <!-- 收藏区域特有的取消收藏按钮 -->
      <div
        v-if="showInFavoriteMode"
        class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-xl backdrop-blur-sm"
      >
        <button
          class="px-4 py-2 bg-primary text-white text-sm rounded-full flex items-center space-x-1 hover:bg-primary-dark transition-colors shadow-lg transform scale-95 group-hover:scale-100 transition-transform duration-300"
          @click="$emit('like', item)"
        >
          <font-awesome-icon :icon="['fas', 'heart-broken']" />
          <span>取消收藏</span>
        </button>
      </div>

      <!-- 非收藏区域的添加按钮 -->
      <div
        v-else
        class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 rounded-xl"
        :class="{ hidden: item.favorite }"
      >
        <button
          class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors shadow-md transform scale-90 group-hover:scale-100 transition-transform"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
        </button>
      </div>
    </div>
    <div class="px-1">
      <h4 class="font-medium truncate text-sm">{{ item.name }}</h4>
      <p class="text-xs text-neutral-500 mt-1">{{ item.category }} · {{ item.style }}</p>
      <!-- 季节信息 -->
      <div class="flex flex-wrap gap-1 mt-1" v-if="item.seasons && item.seasons.length > 0">
        <span
          v-for="season in item.seasons"
          :key="season"
          class="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary"
        >
          {{ season }}
        </span>
      </div>
    </div>

    <!-- 非收藏区域显示的按钮组 -->
    <div v-if="!showInFavoriteMode" class="absolute top-3 right-3 flex flex-col gap-2 z-10">
      <!-- 爱心按钮 -->
      <button
        class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md"
        :class="
          item.favorite
            ? 'bg-primary text-white animate-pulse-once'
            : 'bg-white/90 backdrop-blur text-neutral-400 hover:text-primary hover:bg-white'
        "
        @click="$emit('like', item)"
      >
        <font-awesome-icon
          :icon="item.favorite ? ['fas', 'heart'] : ['far', 'heart']"
          class="text-sm"
        />
      </button>
      <!-- 详细信息按钮 -->
      <button
        class="w-8 h-8 rounded-full bg-white/90 backdrop-blur text-neutral-400 hover:text-primary hover:bg-white flex items-center justify-center transition-all duration-300 shadow-md"
        @click="$emit('viewDetail', item)"
      >
        <font-awesome-icon :icon="['fas', 'info']" class="text-sm" />
      </button>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    item: {
      type: Object,
      required: true,
    },
    showInFavoriteMode: {
      type: Boolean,
      default: false,
    },
  });

  defineEmits(['like', 'viewDetail']);

  // 季节信息现在统一使用seasons数组，无需格式化
</script>

<style scoped>
  @keyframes pulse-once {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  .animate-pulse-once {
    animation: pulse-once 0.3s ease-in-out;
  }
</style>
