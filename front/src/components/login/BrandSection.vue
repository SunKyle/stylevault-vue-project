<template>
  <div class="hidden md:flex flex-col space-y-8 text-center md:text-left">
    <!-- 品牌标志 -->
    <div
      class="inline-block self-center md:self-start bg-gradient-to-br from-primary/10 to-secondary/10 p-5 rounded-2xl"
    >
      <font-awesome-icon :icon="['fas', 'tshirt']" class="text-5xl text-gradient" />
    </div>

    <!-- 品牌名称和标语 -->
    <div class="space-y-4">
      <h1 class="text-[clamp(2.2rem,5vw,3.8rem)] font-bold text-neutral-900 leading-tight">
        智能衣橱
        <br />
        <span class="text-gradient">轻松管理</span>
      </h1>
      <p class="text-neutral-600 text-lg max-w-md mx-auto md:mx-0">
        记录每一件衣物，智能搭配推荐，合理规划衣橱空间，让每日穿搭变得更简单。
      </p>
      <div class="pt-2 flex items-center justify-center md:justify-start space-x-2">
        <div class="flex -space-x-1">
          <img
            src="https://picsum.photos/id/64/100/100"
            alt="用户头像"
            class="w-8 h-8 rounded-full border-2 border-white"
          />
          <img
            src="https://picsum.photos/id/65/100/100"
            alt="用户头像"
            class="w-8 h-8 rounded-full border-2 border-white"
          />
          <img
            src="https://picsum.photos/id/66/100/100"
            alt="用户头像"
            class="w-8 h-8 rounded-full border-2 border-white"
          />
        </div>
        <p class="text-sm text-neutral-600">
          <span class="font-semibold text-primary">10,000+</span>
          用户的选择
        </p>
      </div>
    </div>

    <!-- 装饰衣物图片 -->
    <div
      class="clothes-container flex justify-center md:justify-start space-x-2 md:space-x-4 pt-4 relative"
    >
      <div
        class="clothes-item absolute md:static w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden border-2 border-white transform rotate-6 translate-x-6 z-10"
      >
        <img
          src="https://picsum.photos/id/64/300/300"
          alt="时尚上衣展示"
          class="w-full h-full object-cover"
        />
      </div>
      <div
        class="clothes-item w-28 h-28 md:w-32 md:h-32 rounded-lg overflow-hidden border-2 border-white transform -rotate-3 z-20"
      >
        <img
          src="https://picsum.photos/id/65/300/300"
          alt="时尚裤子展示"
          class="w-full h-full object-cover"
        />
      </div>
      <div
        class="clothes-item absolute md:static w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden border-2 border-white transform rotate-2 -translate-x-6 z-10"
      >
        <img
          src="https://picsum.photos/id/66/300/300"
          alt="时尚配饰展示"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <!-- 品牌特色标签 -->
    <div class="flex flex-wrap gap-3 justify-center md:justify-start pt-4">
      <span class="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center">
        <font-awesome-icon :icon="['fas', 'magic']" class="mr-1" />
        智能搭配
      </span>
      <span class="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center">
        <font-awesome-icon :icon="['fas', 'tag']" class="mr-1" />
        分类管理
      </span>
      <span class="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center">
        <font-awesome-icon :icon="['fas', 'calendar']" class="mr-1" />
        穿搭记录
      </span>
    </div>
  </div>
</template>

<script setup>
  // BrandSection 组件不需要额外的逻辑
</script>

<style scoped>
  /* 文本渐变 */
  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary;
  }

  /* 装饰衣物动画 */
  .clothes-item {
    transition: all 0.5s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  .clothes-container:hover .clothes-item:nth-child(1) {
    transform: rotate(8deg) scale(1.05);
    z-index: 30;
  }
  .clothes-container:hover .clothes-item:nth-child(2) {
    transform: rotate(-6deg) scale(1.05) translate(5px, -5px);
    z-index: 20;
  }
  .clothes-container:hover .clothes-item:nth-child(3) {
    transform: rotate(3deg) scale(1.05) translate(-5px, 5px);
    z-index: 10;
  }
</style>
