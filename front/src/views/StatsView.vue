<template>
  <PageLayout title="衣橱分析">
    <p class="text-gray-600 mb-6">查看你的衣橱使用统计和分析数据。</p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="衣物总数"
        value="24"
        subtitle="件衣物"
        bgColor="bg-blue-50"
        titleColor="text-blue-800"
        valueColor="text-blue-600"
        subtitleColor="text-blue-500"
      />
      <StatCard
        title="最常穿着"
        value="T恤"
        subtitle="本月穿着12次"
        bgColor="bg-green-50"
        titleColor="text-green-800"
        valueColor="text-green-600"
        subtitleColor="text-green-500"
      />
      <StatCard
        title="利用率"
        value="78%"
        subtitle="衣物使用率"
        bgColor="bg-purple-50"
        titleColor="text-purple-800"
        valueColor="text-purple-600"
        subtitleColor="text-purple-500"
      />
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
  </PageLayout>
</template>

<script setup>
  import PageLayout from '../components/layouts/PageLayout.vue';
  import StatCard from '../components/molecules/StatCard.vue';
</script>
