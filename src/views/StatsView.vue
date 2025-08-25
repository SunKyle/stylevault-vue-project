<template>
  <div class="flex-grow pt-20 pb-20 container mx-auto px-4">
    <h1 class="text-3xl font-bold mb-6">衣橱分析</h1>
    <div class="bg-white rounded-xl shadow-soft p-6">
      <p class="text-gray-600 mb-6">查看你的衣橱使用统计和分析数据。</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-blue-50 rounded-lg p-5">
          <h3 class="text-lg font-semibold text-blue-800 mb-2">衣物总数</h3>
          <p class="text-3xl font-bold text-blue-600">24</p>
          <p class="text-sm text-blue-500 mt-1">件衣物</p>
        </div>
        <div class="bg-green-50 rounded-lg p-5">
          <h3 class="text-lg font-semibold text-green-800 mb-2">最常穿着</h3>
          <p class="text-3xl font-bold text-green-600">T恤</p>
          <p class="text-sm text-green-500 mt-1">本月穿着12次</p>
        </div>
        <div class="bg-purple-50 rounded-lg p-5">
          <h3 class="text-lg font-semibold text-purple-800 mb-2">利用率</h3>
          <p class="text-3xl font-bold text-purple-600">78%</p>
          <p class="text-sm text-purple-500 mt-1">衣物使用率</p>
        </div>
      </div>

      <div class="border border-gray-200 rounded-lg p-5">
        <h2 class="text-xl font-semibold mb-4">分类统计</h2>
        <div class="space-y-3">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span class="text-gray-600 flex-grow">上装</span>
            <span class="font-medium">8件 (33%)</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span class="text-gray-600 flex-grow">下装</span>
            <span class="font-medium">6件 (25%)</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span class="text-gray-600 flex-grow">外套</span>
            <span class="font-medium">4件 (17%)</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span class="text-gray-600 flex-grow">鞋履</span>
            <span class="font-medium">3件 (12%)</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
            <span class="text-gray-600 flex-grow">配饰</span>
            <span class="font-medium">2件 (8%)</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
            <span class="text-gray-600 flex-grow">包包</span>
            <span class="font-medium">1件 (4%)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 组件逻辑可以在这里添加
</script>
